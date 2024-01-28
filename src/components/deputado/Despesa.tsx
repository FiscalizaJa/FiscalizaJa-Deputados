import type { Despesa } from "../../interfaces/Despesa";
import { Wallet, FileSearch, PlaneLanding, PlaneTakeoff } from "lucide-react";
import formatDocument from "../../formatDocument";
import Modal from "../Modal";
import { useEffect, useState } from "react";

export default function Despesa(props: { despesa: Despesa, isFirst: boolean }) {
    const baseURL = import.meta.env.PUBLIC_API_URL
    
    const { despesa } = props
    const date = new Date(despesa.dataEmissao)

    const [trecho, setTrecho] = useState(null)
    const [trechoLoading, setTrechoLoading] = useState(null)
    const [trechoAberto, setTrechoAberto] = useState(null)

    let emitted = date.toLocaleDateString("pt-br", { dateStyle: "medium" })
    if (emitted === "Invalid Date") {
        emitted = "data desconhecida"
    }
    despesa.descricao = despesa.descricao.split(" ").map((nome, i) => i === 0 ? nome.charAt(0) + nome.slice(1).toLowerCase() : nome.toLowerCase()).join(" ")

    const toCompareCNPJ = despesa.cnpjCPF?.replace(/[^0-9]/g, "") || ""

    function verificaTrecho(trechos: string) {
        if(!trechos) {
            return;
        }
        setTrechoLoading(true)
        const queryString = trechos.replace(/ /g, "").split("/").map((trecho, i) => {
            if(i === 0) {
                return `?iata=${trecho}`
            } else {
                return `&iata=${trecho}`
            }
        }).join("")
    
        fetch(`${baseURL}/aeroportos${queryString}`).then((request) => {
            request.json().then(response => {
                setTrecho(response.data)
                setTrechoLoading(false)
            })
        })
    }

    useEffect(() => {
        if(trechoAberto) {
            verificaTrecho(trechoAberto)
        } else {
            setTrecho(null)
        }
    }, [trechoAberto])

    return (
        <div className="despesa">
            <div className="sidebar" />
            <div className={props.isFirst ? "first-content" : "content"}>
                <h2><Wallet className="icon" /> R$ {despesa.valorLiquido}</h2>
                <p className={despesa.urlDocumento ? "good" : "bad"}>{despesa.urlDocumento ? "Enviou comprovante" : "Comprovante ausente"}</p>
                <p className="minimal">Emitido em {emitted}</p>
                <p>{toCompareCNPJ?.length === 11 ? `Pessoa:` : "Empresa:"} {despesa.fornecedor}</p>
                <p>{toCompareCNPJ?.length === 11 ? `CPF:` : "CNPJ:"} {formatDocument(despesa.cnpjCPF || "Não informado")}</p>
                <p>Tipo: {despesa.descricao}</p>
                { despesa.trecho && <p>Trecho: {despesa.trecho} {trechoLoading ? <span>Carregando...</span> : <span className="details" onClick={() => {
                    setTrechoAberto(despesa.trecho)
                }}>detalhes</span>}</p> }
                { despesa.passageiro && <p>Passageiros: {despesa.passageiro}</p> }
                { despesa.numero && despesa.trecho && <p>Bilhete: {despesa.numero.replace(/[^0-9]/g, "")}</p> }
                { despesa.urlDocumento && <a className="comprovante" href={despesa.urlDocumento} target="_blank"><FileSearch /> Ver comprovante</a> }
                { despesa.trecho && trecho && <Trecho trechosDetalhes={trecho} setTrecho={setTrechoAberto} /> }
            </div>
        </div>
    )
}

function Trecho(props: { trechosDetalhes: any, setTrecho: any }) {
    return <Modal isOpen={true} onClose={() => { props.setTrecho(null) }}>
        {
            props.trechosDetalhes && props.trechosDetalhes.map((trecho, i) => (
                <span key={`Infos-Viagem-${i}`}>
                    {
                        i === 0 && <>
                            <p><PlaneTakeoff /> Saindo de {trecho.city}</p>
                            <p style={{ fontSize: "0.8em" }}>{trecho.name}</p>
                            <br />
                        </>
                    }
                    {
                        i > 0 && i < props.trechosDetalhes.length - 1 && <>
                            <p><PlaneLanding /> Pouso de escala em {trecho.city} <PlaneTakeoff /></p>
                            <p style={{ fontSize: "0.8em" }}>{trecho.name}</p>
                            <br />
                        </>
                    }
                    {
                        i === props.trechosDetalhes.length - 1 && <>
                            <p><PlaneLanding /> Pouso final em {trecho.city}</p>
                            <p style={{ fontSize: "0.8em" }}>{trecho.name}</p>
                        </>
                    }
                </span>
            ))
        }
    </Modal>
}