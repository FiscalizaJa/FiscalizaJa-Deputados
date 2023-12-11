import { useState } from "react";
import { BarChart } from "@mui/x-charts";

export default function ConsultaFornecedorMain() {
    const [status, setStatus] = useState<"empty" | "awaiting_user" | "is_cpf" | "is_cnpj" | "searching" | "searched">("empty")
    
    const [data, setData] = useState(null)

    let chart;

    let currentTimeout;

    function handleSearch(value: string) {
        value = value.replace(/[^0-9]/g, "")

        if(currentTimeout) {
            clearTimeout(currentTimeout)
        }

        if(!value || !value.length) {
            setStatus("empty")
        } else {
            setStatus("awaiting_user")
        }

        if(value.length == 11 || value.length == 14) {
            setStatus(value.length == 11 ? "is_cpf" : "is_cnpj")
            currentTimeout = setTimeout(async () => {
                setStatus("searching")
                const request = await fetch(`${import.meta.env.PUBLIC_API_URL}/fornecedores/${value}`)
                const response = await request.json()
                
                setData({
                    layout: "horizontal",
                    yAxis: [
                        {
                            id: "gastos",
                            data: response.data.map(d => d.ano),
                            scaleType: "band"
                        }
                    ],
                    series: [
                        {
                            data: response.data.map(d => Number(d.valorTotal))
                        }
                    ],
                    width: 500,
                    height: 600
                })

                setStatus("searched")
            }, 2300)
        }
    }

    return (
        <>
            <div id="input-container">
                <input type="text" placeholder="07.575.651/0001-59" onChange={(e) => {
                    handleSearch(e.currentTarget.value)
                }} />
            </div>
            { status === "empty" && <div className="warn">Digite um CPF ou CNPJ para consultar.</div> }
            { status === "awaiting_user" && <div className="warn"><div className="tiny-loader"/> Esperando você terminar de digitar...</div> }
            { status === "is_cpf" && <div className="warn"><div className="tiny-loader"/> Esperando você terminar de digitar (CPF detectado)</div> }
            { status === "is_cnpj" && <div className="warn"><div className="tiny-loader"/> Esperando você terminar de digitar (CNPJ detectado)</div> }
            { status === "searching" && <div className="warn"><div className="tiny-loader"/> Pesquisando no banco de dados, pode levar alguns segundos...</div> }
        
            <div id="chart">
                { data && <BarChart {...data} /> }
            </div>
        </>
    )
}