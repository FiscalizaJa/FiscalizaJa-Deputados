import { useState, useEffect } from "react";
import Modal from "./Modal";
import formatDocument from "../formatDocument";

function percentage(partialValue: number, totalValue: number) {
    return (100 * partialValue) / totalValue;
}

function genArray(start: number, end: number) {
    return Array.from({length: end - start + 1}, (_, i) => start + i);
}

const months = {
    1: 'Janeiro',
    2: 'Fevereiro',
    3: 'Março',
    4: 'Abril',
    5: 'Maio',
    6: 'Junho',
    7: 'Julho',
    8: 'Agosto',
    9: 'Setembro',
    10: 'Outubro',
    11: 'Novembro',
    12: 'Dezembro'
};

export default function ConsultaFornecedorMain(props: { baseURL: string }) {
    const currentDate = new Date()

    const [status, setStatus] = useState<"not_loaded" | "empty" | "loading" | "deputies_loading">("empty")    
    const [valid, setValid] = useState(false)

    const [fornecedores, setFornecedores] = useState(null)
    const [ranking, setRanking] = useState(null)

    const [totalGasto, setTotalGasto] = useState(null)
    const [totalRanking, setTotalRanking] = useState(null)

    const [anoDeputados, setAnoDeputados] = useState("all")
    const [mesInicio, setMesInicio] = useState<number | string>("all")
    const [mesFinal, setMesFinal] = useState<number | string>()

    const [modalCnpj, setModalCnpj] = useState(false)
    const [cnpjResultados, setCnpjResultados] = useState([])

    function getFilters() {
        const meses = mesInicio !== "all" ? genArray(Number(mesInicio), Number(mesFinal)).map((m, i) => `${i === 0 ? "?" : "&"}mes=${m}`).join("") : ``

        const input = document.querySelector<HTMLInputElement>("#document")
        const cnpjCPF = input.value.replace(/[^0-9]/g, "")

        return {
            meses,
            input,
            cnpjCPF
        }
    }

    async function consultaTotal(cnpjCPF: string, querystring?: string) {
        const request = await fetch(`${import.meta.env.PUBLIC_API_URL}/fornecedores/${cnpjCPF}${querystring}`)
        const response = await request.json()

        setFornecedores(response.data)

        let total = 0

        for(const fornecedor of response.data) {
            total += Number(fornecedor.valorTotal)
        }

        setTotalGasto(total)
    }

    async function consultaRanking(cnpjCPF: string, querystring?: string) {
        const request = await fetch(`${import.meta.env.PUBLIC_API_URL}/fornecedores/${cnpjCPF}/ranking${querystring.length ? `${querystring}${anoDeputados === "all" ? `` : `&ano=${anoDeputados}`}` : `${anoDeputados === "all" ? `` : `?ano=${anoDeputados}`}`}`)
        const response = await request.json()

        setRanking(response.ranking)

        let ranking_total = 0

        for(const rank of response.ranking) {
            ranking_total += Number(rank.valorTotal)
        }

        setTotalRanking(ranking_total)
    }

    async function Consulta() {
        setFornecedores(null)
        setRanking(null)
        setStatus("loading")

        const { meses, cnpjCPF } = getFilters()

        await Promise.all([
            consultaTotal(cnpjCPF, meses),
            consultaRanking(cnpjCPF, meses)
        ])
        
        setStatus("empty")
    }

    async function pesquisaNome(nome: string) {
        const request = await fetch(`${import.meta.env.PUBLIC_API_URL}/fornecedores/pesquisa?termo=${encodeURIComponent(nome)}`)
        const response = await request.json()

        setCnpjResultados(response.data)
    }

    useEffect(() => {
        if(!ranking) return;

        const bars = document.querySelectorAll<HTMLDivElement>(".auto-width")

        const widths = []

        for(const bar of bars) {
            widths.push(bar.offsetWidth)
        }

        const maxWidth = Math.max(...widths)

        for(const bar of bars) {
            bar.style.width = `${maxWidth + 10}px`
        }

    }, [ranking])

    useEffect(() => {
        if(status === "empty") {
            return;
        }

        const chart = document.querySelector<HTMLElement>("#dep-rank")

        chart.style.minHeight = `${chart.offsetHeight}px`

        setRanking(null)

        const { meses, cnpjCPF } = getFilters()

        setStatus("deputies_loading")
        consultaRanking(cnpjCPF, meses).then(() => {
            setStatus("empty")
            chart.style.minHeight = "none"
        })
    }, [anoDeputados])

    return (
        <>
            <div className="input-container">
                <input type="text" id="document" placeholder="07.575.651/0001-59" onChange={(e) => {
                    const value = e.currentTarget.value.replace(/[^0-9]/g, "")
                    
                    if(value.length === 11 || value.length === 14) {
                        setValid(true)
                    } else {
                        setValid(false)
                    }
                }} />
                <div className="input-title">
                    CNPJ ou CPF
                </div>
                <select id="mesInicio" onChange={(e) => {
                    setMesInicio(e.currentTarget.value)
                }}>
                    <option value="all">
                        Todos os meses
                    </option>
                    {
                        Object.keys(months).map((month, i) => (
                            <option value={month} key={`month_select-${i}`}>
                                {months[month]}
                            </option>
                        ))
                    } 
                </select>
                <span hidden={mesInicio === "all"}>
                    Até
                    <select id="mesFinal" onChange={(e) => {
                    setMesFinal(e.currentTarget.value)
                }}>
                    {
                        Object.keys(months).filter(month => Number(month) >= Number(mesInicio)).map((month, i) => (
                            <option value={month} key={`month_end_select-${i}`}>
                                {months[month]}
                            </option>
                        ))
                    } 
                </select>
                </span>
                <p className="search-prompt" onClick={() => {
                    setModalCnpj(true)
                }}>Pesquisar empresa por nome</p>
                <button name="Consultar CNPJ ou CPF" disabled={!valid} onClick={() => {
                    Consulta()
                }}>Consultar</button>
            </div>
            {
            status === "loading" && <div style={{ marginTop: "2.5rem" }}>
                <div className="loader" />
                <p style={{ textAlign: "center" }}>Carregando informações...</p>
            </div> }
            
            <div className="bar-chart" style={{ display: (status === "empty" || status === "loading") && !fornecedores ? "none" : "flex" }}>
                <h2>Gastos por ano</h2>
                <div className="chart-item">
                    <p>Total R$ {Number(totalGasto)?.toLocaleString("pt-br", { minimumFractionDigits: 2 })}</p>
                </div>
                { fornecedores && fornecedores.map((fornecedor, index) => (
                    <div className="chart-item" key={index}>
                        <p>{fornecedor.ano}</p>
                        <div className="bar" style={{ width: `${percentage(fornecedor.valorTotal, totalGasto)}%` }}>
                            <div className="details">
                                <p><strong>{fornecedor.ano}</strong></p>
                                <p>R$ {Number(fornecedor.valorTotal).toLocaleString("pt-br", { minimumFractionDigits: 2 })}</p>
                            </div>
                        </div>
                        <p style={{ fontSize: "0.9em" }} className="chart-value">R$ {Number(fornecedor.valorTotal).toLocaleString("pt-br", { minimumFractionDigits: 2 })}</p>
                    </div>
                )) }
            </div>

            <div className="bar-chart" style={{ display: (status === "empty" || status === "loading") && !ranking ? "none" : "flex" }} id="dep-rank">
                <h2>Deputados que mais gastaram</h2>
                <div className="input-container" style={{ margin: 0, maxWidth: "220px" }}>
                    <select id="ano-deputados-ranking" onChange={(e) => {
                        setStatus("deputies_loading")
                        setAnoDeputados(e.currentTarget.value)
                    }}>
                        {
                            genArray(2009, currentDate.getFullYear()).reverse().map((year, i) => (
                                <option value={year} key={`ranking_year-${i}`}>
                                    {year}
                                </option>
                            ))
                        }
                    </select>
                </div>
                <div className="chart-item">
                    <p>Total R$ {Number(totalRanking)?.toLocaleString("pt-br", { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="chart-item" style={{ display: status === "deputies_loading" ? "flex" : "none" }}>
                    <p>Carregando...</p>
                </div>
                { ranking && ranking.map((rank, index) => (
                    <div className="chart-item" key={`rank${index}`}>
                        <div className="img-container">
                            <img src={`https://www.camara.leg.br/internet/deputado/bandep/${rank.numeroDeputadoID}.jpg`} width={30} height={30} />
                        </div>
                        <p className="auto-width">{rank.nomeParlamentar}</p>
                        <div className="bar" style={{ width: `${percentage(rank.valorTotal, totalRanking)}%` }}>
                            <div className="details">
                                <p><strong>{rank.nomeParlamentar}</strong></p>
                                <p>R$ {Number(rank.valorTotal).toLocaleString("pt-br", { minimumFractionDigits: 2 })}</p>
                            </div>
                        </div>
                        <p style={{ fontSize: "0.9em" }} className="chart-value">R$ {Number(rank.valorTotal)?.toLocaleString("pt-br", { minimumFractionDigits: 2 })}</p>
                    </div>
                )) }
            </div>
            {
                modalCnpj && <Modal isOpen={true} onClose={() => { setModalCnpj(false) }}>
                    <h2>Pesquisar CNPJs</h2>
                    <p>Apenas digite o nome da empresa e pegue o cnpj da qual está procurando.</p>
                    <input type="text" placeholder="Nome da empresa" id="search-cnpj"/>
                    <button 
                    style={{ margin: "0.8rem 0 0.8rem 0", fontSize: "0.9em" }}
                    name="Pesquisar CNPJs para o nome informado"
                    onClick={(e) => {
                        const input = document.querySelector<HTMLInputElement>("#search-cnpj")
                        pesquisaNome(input.value)
                    }}
                    >Pesquisar</button>
                    <p style={{ fontSize: "0.8em" }}>Os nomes podem mudar devido a variações da mesma empresa nos dados.</p>
                    <br />
                    {
                        cnpjResultados.map((result, i) => (
                            <p key={`cnpj-${i}`} style={{ fontSize: "0.8em" }}>{formatDocument(result.cnpjCPF)} - {result.nomes[Math.floor(Math.random() * result.nomes.length)]}</p>
                        ))
                    }
                    {
                        !cnpjResultados?.length && <p style={{ fontSize: "0.8em" }}>Nenhum resultado.</p>
                    }
                </Modal>
            }
        </>
    )
}