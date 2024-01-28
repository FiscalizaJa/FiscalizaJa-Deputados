import Charts from "./Charts";
import Loading from "../Loading";
import Despesas from "../../layouts/Despesas";
import Despesa from "./Despesa";
import { useState, useEffect } from "react";

import type { Despesa as DeputadoDespesa } from "../../interfaces/Despesa";
import type { Resumo } from "../../interfaces/Resumo";
import type { Deputado } from "../../interfaces/Deputado";

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
}

export default function CotaParlamentar(props: { despesas: { data: DeputadoDespesa[], totalGasto: number, fornecedores: any }, resumo: Resumo, deputado: Deputado }) {
    const date = new Date()
    const baseURL = import.meta.env.PUBLIC_API_URL

    const currentYear = date.getFullYear()
    const currentMonth = date.getMonth() + 1
    const formattedCurrentMonth = `${currentMonth < 10 ? "0" : ""}` + String(currentMonth)

    const [loading, setLoading] = useState(true)
    const [despesas, setDespesas] = useState(props.despesas)
    const [fornecedor, setFornecedor] = useState(null)
    const [resumo, setResumo] = useState(props.resumo)
    const [gastou, setGastou] = useState(resumo?.gastoPorMes?.find(r => r.mes == currentMonth)?.total || 0)

    const [ano, setAno] = useState(currentYear)
    const [mes, setMes] = useState(currentMonth)
    
    async function fetchData() {
        setLoading(true)
        const promises = [
            fetch(`${baseURL}/deputados/${props.deputado.idCamara}/despesas/resumo?ano=${ano}&mes=${mes}${fornecedor ? `&fornecedor=${fornecedor}`: ``}`),
            fetch(`${baseURL}/deputados/${props.deputado.idCamara}/despesas?ano=${ano}&mes=${mes}${fornecedor ? `&fornecedor=${fornecedor}`: ``}`)
        ]

        const serialize_promises = []
        const requests = await Promise.all(promises)
        
        for(const request of requests) {
            serialize_promises.push(request.json())
        }
        
        const data = await Promise.all(serialize_promises)
        setResumo(data[0].data)
        setGastou(data[0].data.gastoPorMes?.find(r => r.mes == mes)?.total || 0)
        setDespesas(data[1])
        setLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [mes, ano, fornecedor])

    useEffect(() => {
        if(fornecedor) {
            const select = document.querySelector<HTMLSelectElement>("select")
            if(!select) {
                return
            }

            const options = select.querySelectorAll<HTMLOptionElement>("option")
            if(!options) {
                return
            }

            options.forEach((option, i) => {
                if(option.value === fornecedor) {
                    select.selectedIndex = i
                }
            })
        }
    }, [despesas])

    if((despesas?.totalGasto === 0 || !despesas)) {
        if(loading) {
            return (
                <>
                    <Loading />
                </>
            )
        } else {
            if(fornecedor) {
                setFornecedor(null)
            }
            return (
                <>
                    <section id="filter">
                        <input type="month" defaultValue={`${ano}-${`${mes < 10 ? "0" : ""}` + String(mes)}`} max={`${currentYear}-${formattedCurrentMonth}`} min="2009-01" onChange={(e) => {
                            const values = e.currentTarget.value.split("-")
                            const year = Number(values[0])
                            const month = Number(values[1])
    
                            if(!year || !month) {
                                return;
                            }
    
                            setAno(year)
                            setMes(month)
                        }}/>
                        <select onChange={(e) => {
                            if(e.currentTarget.value === "all") {
                                setFornecedor(null)
                            } else {
                                setFornecedor(e.currentTarget.value)
                            }
                        }}>
                            <option value="all">
                                Todos os fornecedores
                            </option>
                        </select>
                    </section>
                    <div id="nothing" className="minimal">
                        {
                            ano === currentYear && mes === currentMonth
                            ? <p>{props.deputado.nome} ainda não registrou despesas para {months[mes]} de {ano}.<br/>Que tal consultar meses anteriores?</p>
                            : <p>{props.deputado.nome} não possui despesas em {months[mes]} de {ano}.<br />Que tal selecionar uma data mais atual?</p>
                        }
                    </div>
                </>
            )
        }
    }

    return (
        <>
            <section id="filter">
                <input type="month" defaultValue={`${ano}-${`${mes < 10 ? "0" : ""}` + String(mes)}`} max={`${currentYear}-${formattedCurrentMonth}`} min="2009-01" onChange={(e) => {
                    const values = e.currentTarget.value.split("-")
                    const year = Number(values[0])
                    const month = Number(values[1])

                    if(!year || !month) {
                        return;
                    }
                    
                    setAno(year)
                    setMes(month)
                }}/>
                <select id="a" onChange={(e) => {
                    if(e.currentTarget.value === "all") {
                        setFornecedor(null)
                    } else {
                        setFornecedor(e.currentTarget.value)
                    }
                }}>
                    <option value="all">
                        Todos os fornecedores
                    </option>
                    {
                        despesas && despesas.fornecedores.map((fornecedor, i) => (
                            <option value={encodeURIComponent(fornecedor.fornecedor)} key={`Fornecedor-${i}`}>
                                {fornecedor.fornecedor}
                            </option>
                        ))
                    }
                </select>
            </section>
            <div id="total-title">
                <p>Gastou</p>
                <h2>R$ {gastou.toLocaleString("pt-br")}</h2>
                <p>Em {months[mes]} de {ano}</p>
            </div>
            <Charts resumo={resumo} ano={ano} />
            <div id="line" />
            <Despesas>
                {
                    despesas?.data?.map((despesa, i) => {
                        return <Despesa despesa={despesa} key={`Despesa-${i}`} isFirst={i === 0} />
                    })
                }
            </Despesas>
        </>
    )
}