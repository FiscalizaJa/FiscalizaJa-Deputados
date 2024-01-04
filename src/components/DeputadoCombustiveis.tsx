import "../styles/relatorios.scss";

import { useState, useEffect } from "react";
import { Car, Plane, Ship, Search, ArrowLeft, ArrowRight } from "lucide-react";
import formatDocument from "../formatDocument";
import Loading from "./Loading";

import type { Combustivel } from "../interfaces/Combustivel";
import type { Fornecedor } from "../interfaces/Fornecedor";

function calculaTotal(fornecedores: any) {
    let total = 0

    for(const fornecedor of fornecedores) {
        total += Number(fornecedor.valorGasto)
    }

    return total.toFixed()
}

function Icon(props: { tipoCombustivel: string, valido: boolean }) {
    if(props.tipoCombustivel === "veiculos") {
        return <>
            {props.valido ? <Car className="green" style={{ fontSize: "1.5em", transform: "translateY(6px)" }} /> : <Car className="red" style={{ fontSize: "1.5em", transform: "translateY(6px)"}} /> }
        </>
    } else if(props.tipoCombustivel === "aeronaves") {
        return <>
            {props.valido ? <Plane className="green" style={{ fontSize: "1.5em", transform: "translateY(6px)" }} /> : <Plane className="red" style={{ fontSize: "1.5em", transform: "translateY(6px)" }} />}
        </>
    } else if (props.tipoCombustivel === "embarcacoes") {
        return <>
            {props.valido ? <Ship className="green" style={{ fontSize: "1.5em", transform: "translateY(6px)" }} /> : <Ship className="red" style={{ fontSize: "1.5em", transform: "translateY(6px)" }} />}
        </>
    }
}

export default function DeputadoCombustiveis(props: { combustiveis: { combustiveis: Combustivel[], fornecedores: Fornecedor[] }, deputadoID: string, baseURL: string }) {
    const date = new Date()
    const currentMonth = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1).toString() : date.getMonth() + 1

    const [tipoCombustivel, setTipo] = useState("veiculos")
    const [fornecedores, setFornecedores] = useState(props.combustiveis.fornecedores)
    const [despesas, setDespesas] = useState(props.combustiveis.combustiveis)

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
        const request = await fetch(`${props.baseURL}/relatorios/${props.deputadoID}/combustiveis/${tipoCombustivel}?ano=${ano}&mes=${mes}&pagina=${pagina}${fornecedor ? `&fornecedor=${fornecedor.cnpj || fornecedor.fornecedor || fornecedor}` : ``}`)
        const response = await request.json()
        setDespesas(response.data.combustiveis)
        setFornecedores(response.data.fornecedores)
        setLoading(false)
    }

    useEffect(() => {
        handleFilters()
    }, [ano, mes, fornecedor, pagina, tipoCombustivel])

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
                    {fornecedores.map((fornecedor, i) => (
                        <option value={fornecedor.cnpj || fornecedor.fornecedor} key={`fornecedor-${i}-viagens`}>
                            {fornecedor.fornecedor}
                        </option>
                    ))}
                </select>
                <select id="tipo" disabled={isLoading} onChange={(e) => {
                    setTipo(e.currentTarget.value)
                }}>
                    <option value="veiculos">
                        Veículos
                    </option>
                    <option value="aeronaves">
                        Aeronaves
                    </option>
                    <option value="embarcacoes">
                        Embarcações
                    </option>
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
                <div className="despesa" style={{ maxWidth: "80%", width: "fit-content" }}>
                    <h2><Search style={{ fontSize: "1.3em", transform: "translateY(6px)" }} /> Observações</h2>
                    {
                        fornecedor?.fornecedor && <p>
                            Gasto R$ {fornecedor.valorGasto} com <strong>{fornecedor.fornecedor}</strong> em {fornecedor.contratacoes} {fornecedor.contratacoes > 1 ? "contratações" : "contratação"} no mês {mes}.
                        </p>
                    }
                    <p>Total de R$ {calculaTotal(fornecedores) || 0} gastos em combustíveis para {tipoCombustivel} no mês {mes}.</p>
                </div>
                {despesas.map((despesa, i) => (
                    <div className="despesa" key={`Viagem-${i}`}>
                        <h2><Icon tipoCombustivel={tipoCombustivel} valido={despesa.urlDocumento?.length > 0} /> R$ {despesa.valor}</h2>
                        <p>Empresa: {despesa.fornecedor}</p>
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