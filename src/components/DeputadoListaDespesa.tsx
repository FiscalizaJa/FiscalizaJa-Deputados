import "../styles/relatorios.scss";

import { useState, useEffect } from "react";
import { ArrowLeft, Search, ArrowRight, CreditCard } from "lucide-react";
import formatDocument from "../formatDocument";
import Loading from "./Loading";

import type { Despesa } from "../interfaces/Despesa";

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

export default function DeputadoListaDespesa(props: { deputadoID: string, baseURL: string }) {
    const date = new Date()
    const currentMonth = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1).toString() : date.getMonth() + 1

    const [despesas, setDespesas] = useState([])
    const [fornecedores, setFornecedores] = useState([])

    const [ano, setAno] = useState(date.getFullYear())
    const [mes, setMes] = useState(date.getMonth() + 1)
    const [totalGasto, setTotalGasto] = useState([])
    const [fornecedor, setFornecedor] = useState(null)
    const [pagina, setPagina] = useState(1)

    const [isLoading, setLoading] = useState(false)

    async function handleFilters() {
        if(isLoading) {
            return;
        }
        setLoading(true)
        setDespesas([])
        const request = await fetch(`${props.baseURL}/deputados/${props.deputadoID}/despesas?ano=${ano}&mes=${mes}&pagina=${pagina}${fornecedor ? `&fornecedor=${fornecedor.cnpj || fornecedor.fornecedor || fornecedor}` : ``}`)
        const response = await request.json()
        setDespesas(response.data)
        setFornecedores(response.fornecedores)
        setTotalGasto(response.totalGasto)
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
                <input type="month" defaultValue={`${date.getFullYear()}-${currentMonth}`} max={`${date.getFullYear()}-${currentMonth}`} min="2009-01" onChange={(e) => {
                    const values = e.currentTarget.value.split("-")
                    const year = Number(values[0])
                    const month = Number(values[1])
                    
                    setAno(year)
                    setMes(month)

                }}/>
            </div>
            <div className="despesas">
                <div className="despesa" style={{ width: "100%" }}>
                    <h2><Search style={{ fontSize: "1.3em", transform: "translateY(6px)" }} /> Observação</h2>
                    <p>Gastou R$ {Number(totalGasto)?.toLocaleString("pt-br") || 0} em {months[mes]?.toLowerCase()} de {ano}</p>
                </div>
                {despesas?.map((despesa, i) => (
                    <div className="despesa" key={`Despesa-${i}`} style={{ width: "55%" }}>
                        <h2>{despesa.urlDocumento ? <CreditCard className="green" style={{ fontSize: "1.5em", transform: "translateY(6px)" }} /> : <CreditCard className="red" style={{ fontSize: "1.5em", transform: "translateY(6px)" }} />} R$ {despesa.valorLiquido}</h2>
                        <p>Fornecedor: {despesa.fornecedor}</p>
                        <p>{despesa.cnpjCPF ? `CNPJ: ${formatDocument(despesa.cnpjCPF)}` : <span className="red">CNPJ ausente</span>}</p>
                        <p>Tipo: {despesa.descricao}</p>
                        <p>Emitido em {new Date(despesa.dataEmissao).toLocaleDateString("pt-br", { dateStyle: "long" })}</p>
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
                    <ArrowLeft />
                </div>
                <div onClick={() => {
                    setPagina(pagina + 1)
                }}>
                    <ArrowRight />
                </div>
            </div>
            <div style={{ textAlign: "center" }}>Página {pagina}</div>
            <br />
        </section>
    )
}