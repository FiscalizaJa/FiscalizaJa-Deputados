import "../styles/relatorios.scss";

import { useState, useEffect } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io"
import { BsCreditCard2FrontFill } from "react-icons/bs";
import formatDocument from "../formatDocument";
import Loading from "./Loading";

export default function DeputadoListaDespesa(props: { despesas: any, deputadoID: string, baseURL: string }) {
    const date = new Date()

    const [despesas, setDespesas] = useState(props.despesas)

    const [ano, setAno] = useState(date.getFullYear())
    const [mes, setMes] = useState(date.getMonth() + 1)
    const [pagina, setPagina] = useState(1)

    const [isLoading, setLoading] = useState(false)

    async function handleFilters() {
        if(isLoading) {
            return;
        }
        setLoading(true)
        setDespesas([])
        const request = await fetch(`${props.baseURL}/deputados/${props.deputadoID}/despesas?ano=${ano}&mes=${mes}&pagina=${pagina}`)
        const response = await request.json()
        setDespesas(response.data)
        setLoading(false)
    }

    useEffect(() => {
        handleFilters()
    }, [ano, mes, pagina])

    return (
        <section className="relatorio">
            <div id="painel">
                <input type="number" defaultValue={date.getFullYear()} max={date.getFullYear()} min={2009} onChange={(e) => {
                    setAno(Number(e.currentTarget.value))
                }} disabled={isLoading} />
                <input type="number" defaultValue={date.getMonth() + 1} max={12} min={1} onChange={(e) => {
                    setMes(Number(e.currentTarget.value))
                }} disabled={isLoading}/>
            </div>
            <div className="despesas">
                {despesas?.map((despesa, i) => (
                    <div className="despesa" key={`Despesa-${i}`} style={{ width: "55%" }}>
                        <h2>{despesa.urlDocumento ? <BsCreditCard2FrontFill className="green" style={{ fontSize: "1.5em", transform: "translateY(6px)" }} /> : <BsCreditCard2FrontFill className="red" style={{ fontSize: "1.5em", transform: "translateY(6px)" }} />} R$ {despesa.valorLiquido}</h2>
                        <p>Fornecedor: {despesa.fornecedor}</p>
                        <p>{despesa.cnpj ? `CNPJ: ${formatDocument(despesa.cnpj)}` : <span className="red">CNPJ ausente</span>}</p>
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