import "../styles/relatorios.scss";

import { useState, useEffect } from "react";
import { FaMagnifyingGlassDollar } from "react-icons/fa6";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io"
import { MdOutlineLocalTaxi, MdOutlineTaxiAlert } from "react-icons/md";
import formatDocument from "../formatDocument";
import Loading from "./Loading";

function calculaTotal(fornecedores: any) {
    let total = 0

    for(const fornecedor of fornecedores) {
        total += Number(fornecedor.valorGasto)
    }

    return total.toFixed()
}


export default function DeputadoLocomocao(props: { locomocao: any, deputadoID: string, baseURL: string }) {
    const date = new Date()

    const [fornecedores, setFornecedores] = useState(props.locomocao.fornecedores)
    const [despesas, setDespesas] = useState(props.locomocao.locomocao)

    const [ano, setAno] = useState(date.getFullYear())
    const [mes, setMes] = useState(date.getMonth() + 1)
    const [fornecedor, setFornecedor] = useState(null)
    const [pagina, setPagina] = useState(1)

    const [isLoading, setLoading] = useState(false)

    async function handleFilters() {
        if(isLoading) {
            return;
        }
        setLoading(true)
        setDespesas([])
        const request = await fetch(`${props.baseURL}/relatorios/${props.deputadoID}/locomocao?ano=${ano}&mes=${mes}&pagina=${pagina}${fornecedor ? `&fornecedor=${fornecedor.cnpj || fornecedor.fornecedor || fornecedor}` : ``}`)
        const response = await request.json()
        setDespesas(response.data.locomocao)
        setFornecedores(response.data.fornecedores)
        setLoading(false)
    }

    useEffect(() => {
        handleFilters()
    }, [ano, mes, fornecedor, pagina])

    return (
        <section className="relatorio">
            <div id="painel">
                <select id="fornecedor" disabled={isLoading} onChange={(e) => {
                    if(e.currentTarget.value === "all") {
                        setFornecedor(null)
                    } else {
                        const infos = fornecedores.find(f => f.fornecedor === e.currentTarget.value || f.cnpj === e.currentTarget.value)
                        if(infos) {
                            setFornecedor(infos)
                        } else {
                            setFornecedor(e.currentTarget.value)
                        }
                    }
                    }}>
                    <option value="all">
                        Todos os fornecedores
                    </option>
                    {fornecedores?.map((fornecedor, i) => (
                        <option value={fornecedor.cnpj || fornecedor.fornecedor} key={`fornecedor-${i}-locomocao`}>
                            {fornecedor.fornecedor}
                        </option>
                    ))}
                </select>
                <input type="number" defaultValue={date.getFullYear()} max={date.getFullYear()} min={2009} onChange={(e) => {
                    setAno(Number(e.currentTarget.value))
                }} disabled={isLoading} />
                <input type="number" defaultValue={date.getMonth() + 1} max={12} min={1} onChange={(e) => {
                    setMes(Number(e.currentTarget.value))
                }} disabled={isLoading}/>
            </div>
            <div className="despesas">
                <div className="despesa" style={{ maxWidth: "80%", width: "fit-content" }}>
                    <h2><FaMagnifyingGlassDollar style={{ fontSize: "1.3em", transform: "translateY(6px)" }} /> Observações</h2>
                    {
                        fornecedor?.fornecedor && <p>
                            Gasto R$ {fornecedor.valorGasto} com <strong>{fornecedor.fornecedor}</strong> em {fornecedor.contratacoes} {fornecedor.contratacoes > 1 ? "contratações" : "contratação"} no mês {mes}.
                        </p>
                    }
                    <p>Total de R$ {calculaTotal(fornecedores) || 0} gastos em locomoção no mês {mes}.</p>
                    <p>* <i style={{ fontSize: "0.9em" }}>Inclui serviços de táxi, pedágio e estacionamento.</i></p>
                </div>
                {despesas?.map((despesa, i) => (
                    <div className="despesa" key={`Alimentacao-${i}`} style={{ width: "55%" }}>
                        <h2>{despesa.urlDocumento ? <MdOutlineLocalTaxi className="green" style={{ fontSize: "1.5em", transform: "translateY(6px)" }} /> : <MdOutlineTaxiAlert className="red" style={{ fontSize: "1.5em", transform: "translateY(6px)" }} />} R$ {despesa.valor}</h2>
                        <p>Fornecedor: {despesa.fornecedor}</p>
                        <p>{despesa.cnpj ? `CNPJ: ${formatDocument(despesa.cnpj)}` : <span className="red">CNPJ ausente</span>}</p>
                        <p>Emitido em {new Date(despesa.data).toLocaleDateString("pt-br", { dateStyle: "long" })}</p>
                        {despesa.urlDocumento != "" ? <a href={despesa.urlDocumento} target="_blank">Ver comprovante</a> : <p className="red">Comprovante ausente.</p>}
                    </div>
                ))}
            </div>
            {!despesas?.length && <p style={{ textAlign: "center" }}>Nenhuma despesa encontrada.</p>}

            {isLoading && <Loading />}

            <div className="paginas">
                <div onClick={() => {
                    if(pagina > 1) {
                        setPagina(pagina - 1)
                    } 
                }}>
                    <IoIosArrowBack />
                </div>
                <div onClick={() => {
                    setPagina(pagina + 1)
                }}>
                    <IoIosArrowForward />
                </div>
            </div>
            <div style={{ textAlign: "center" }}>Página {pagina}</div>
            <br />
        </section>
    )
}