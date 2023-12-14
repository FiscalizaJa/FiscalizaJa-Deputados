import "../styles/relatorios.scss";

import { useState, useEffect } from "react";
import { Search, ArrowLeft, ArrowRight, PlaneTakeoff, PlaneLanding, Plane } from "lucide-react";
import formatDocument from "../formatDocument";
import Modal from "./Modal";
import Loading from "./Loading";

import type { Viagem } from "../interfaces/Viagem";
import type { Fornecedor } from "../interfaces/Fornecedor";

function calculaTotal(fornecedores: any) {
    let total = 0

    for(const fornecedor of fornecedores) {
        total += Number(fornecedor.valorGasto)
    }

    return total.toFixed(2)
}

export default function DeputadoViagens(props: { viagens: { viagens: Viagem[], fornecedores: Fornecedor[] }, deputadoID: string, baseURL: string }) {
    const date = new Date()

    const [fornecedores, setFornecedores] = useState(props.viagens.fornecedores)
    const [despesas, setDespesas] = useState(props.viagens.viagens)
    const [trechoAberto, setTrechoAberto] = useState(null)
    const [trechos, setTrechos] = useState(null)
    const [trechosDetalhes, setTrechosDetalhes] = useState(null)
    const [trechoLoading, setTrechoLoading] = useState(null)

    const [ano, setAno] = useState(date.getFullYear())
    const [mes, setMes] = useState(date.getMonth() + 1) // CONTINUAR O FILTRO!
    const [fornecedor, setFornecedor] = useState(null)
    const [pagina, setPagina] = useState(1)

    const [isLoading, setLoading] = useState(false)

    function verificaTrecho(trechos: string) {
        setTrechoLoading(true)
        const queryString = trechos.replace(/ /g, "").split("/").map((trecho, i) => {
            if(i === 0) {
                return `?iata=${trecho}`
            } else {
                return `&iata=${trecho}`
            }
        }).join("")
    
        fetch(`${props.baseURL}/aeroportos${queryString}`).then((request) => {
            request.json().then(response => {
                setTrechosDetalhes(response.data)
                setTrechoLoading(false)
            })
        })
    }

    async function handleFilters() {
        if(isLoading) {
            return;
        }
        setLoading(true)
        setDespesas([])
        const request = await fetch(`${props.baseURL}/relatorios/${props.deputadoID}/viagens?ano=${ano}&mes=${mes}&pagina=${pagina}${fornecedor ? `&fornecedor=${fornecedor}` : ``}`)
        const response = await request.json()
        setDespesas(response.data.viagens)
        setFornecedores(response.data.fornecedores)
        setLoading(false)
    }

    useEffect(() => {
        handleFilters()
    }, [ano, mes, fornecedor, pagina])

    useEffect(() => {
        if(trechoAberto) {
            verificaTrecho(trechos)
        } else {
            setTrechosDetalhes(null)
        }
    }, [trechoAberto])

    return (
        <section className="relatorio">
            <div id="painel">
                <select id="fornecedor" disabled={isLoading} onChange={(e) => {
                    if(e.currentTarget.value === "all") {
                        setFornecedor(null)
                    } else {
                        setFornecedor(e.currentTarget.value)
                    }
                }}>
                    <option value="all">
                        Todos os fornecedores
                    </option>
                    {fornecedores.map((fornecedor, i) => (
                        <option value={fornecedor.cnpj || fornecedor.fornecedor} key={`fornecedor-${i}-viagens`}>
                            {fornecedor.fornecedor}
                        </option>
                    ))}
                </select>
                <input type="month" defaultValue={`${date.getFullYear()}-${date.getMonth() + 1}`} max={`${date.getFullYear()}-${date.getMonth() + 1}`} min="2009-01" onChange={(e) => {
                    const values = e.currentTarget.value.split("-")
                    const year = Number(values[0])
                    const month = Number(values[1])
                    
                    setAno(year)
                    setMes(month)

                }}/>
            </div>
            <div className="despesas">
                <div className="despesa">
                    <h2><Search style={{ fontSize: "1.3em", transform: "translateY(6px)" }} /> Fornecedores</h2>
                    {
                        fornecedores.map((fornecedor, i) => (
                            <p key={`Fornecedor-${i}`}>{fornecedor.fornecedor}: R$ {fornecedor.valorGasto} em {fornecedor.contratacoes} {fornecedor.contratacoes < 2 ? "contratação" : "contratações"}</p>
                        ))
                    }
                    <p>Total: R$ { calculaTotal(fornecedores) } em viagens.</p>
                </div>
                {despesas.map((despesa, i) => (
                    <div className="despesa" key={`Viagem-${i}`}>
                        <h2>{despesa.comprovante != "" ? <Plane className="green" style={{ fontSize: "1.5em", transform: "translateY(6px)" }} /> : <Plane className="red" style={{ fontSize: "1.5em", transform: "translateY(6px)" }} />} R$ {despesa.valor}</h2>
                        <p>Empresa: {despesa.companhia}</p>
                        <p>{despesa.cnpj ? `CNPJ: ${formatDocument(despesa.cnpj)}` : <span className="red">CNPJ ausente</span>}</p>
                        <p>Emitido em {new Date(despesa.dataEmissao).toLocaleDateString("pt-br", { dateStyle: "long" })}</p>
                        <p>Bilhete aéreo: {despesa.bilhete}</p>
                        <p>Trecho {despesa.trecho} <button className="consulta" onClick={() => {
                            setTrechoAberto(`Viagem-${i}`)
                            setTrechos(despesa.trecho)
                        }}>Detalhes</button></p>
                        {
                            trechoAberto === `Viagem-${i}` && <Modal isOpen={true} onClose={() => { setTrechoAberto(null) }}>
                                <h2>Detalhes do trajeto</h2>
                                {
                                    trechosDetalhes && trechosDetalhes.map((trecho, i) => (
                                        <>
                                            {
                                                i === 0 && <>
                                                    <p><PlaneTakeoff /> Saindo de {trecho.city}</p>
                                                    <p style={{ fontSize: "0.8em" }}>{trecho.name}</p>
                                                    <br />
                                                </>
                                            }
                                            {
                                                i > 0 && i < trechosDetalhes.length - 1 && <>
                                                    <p><PlaneLanding /> Pouso de escala em {trecho.city} <PlaneTakeoff /></p>
                                                    <p style={{ fontSize: "0.8em" }}>{trecho.name}</p>
                                                    <br />
                                                </>
                                            }
                                            {
                                                i === trechosDetalhes.length - 1 && <>
                                                    <p><PlaneLanding /> Pouso final em {trecho.city}</p>
                                                    <p style={{ fontSize: "0.8em" }}>{trecho.name}</p>
                                                </>
                                            }
                                        </>
                                    ))
                                }
                                {
                                    trechoLoading && <Loading />
                                }
                            </Modal>
                        }
                        {despesa.comprovante != "" ? <a href={despesa.comprovante} target="_blank">Ver comprovante</a> : <p className="red">Comprovante ausente.</p>}
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