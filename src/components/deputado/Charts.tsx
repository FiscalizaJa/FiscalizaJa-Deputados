import { useEffect } from "react";
import Highcharts from "highcharts/highmaps";
import Chart from "highcharts-react-official";

import type { Resumo } from "../../interfaces/Resumo";

const conversions = {
    "AQUISIÇÃO DE TOKENS E CERTIFICADOS DIGITAIS": "Aquisição de tokens e certificados digitais",
    "ASSINATURA DE PUBLICAÇÕES": "Assinatura de publicações",
    "COMBUSTÍVEIS E LUBRIFICANTES.": "Combustíveis e lubrificantes",
    "CONSULTORIAS, PESQUISAS E TRABALHOS TÉCNICOS.": "Consultorias, pesquisas e trabalhos técnicos",
    "DIVULGAÇÃO DA ATIVIDADE PARLAMENTAR.": "Divulgação da atividade parlamentar",
    "FORNECIMENTO DE ALIMENTAÇÃO DO PARLAMENTAR": "Fornecimento de alimentação do parlamentar",
    "HOSPEDAGEM ,EXCETO DO PARLAMENTAR NO DISTRITO FEDERAL.": "Hospedagem (exceto Distrito Federal)",
    "LOCAÇÃO OU FRETAMENTO DE AERONAVES": "Locação ou fretamento de aeronaves",
    "LOCAÇÃO OU FRETAMENTO DE EMBARCAÇÕES": "Locação ou fretamento de embarcações",
    "LOCAÇÃO OU FRETAMENTO DE VEÍCULOS AUTOMOTORES": "Locação ou fretamento de veículos",
    "MANUTENÇÃO DE ESCRITÓRIO DE APOIO À ATIVIDADE PARLAMENTAR": "Manutenção de escritório de apoio à atividade parlamentar",
    "PARTICIPAÇÃO EM CURSO, PALESTRA OU EVENTO SIMILAR": "Participação em curso, palestra ou evento similar",
    "PASSAGEM AÉREA - REEMBOLSO": "Passagem aérea Reembolso",
    "PASSAGEM AÉREA - RPA": "Passagem aérea RPA",
    "PASSAGEM AÉREA - SIGEPA": "Passagem aérea SIGEPA",
    "PASSAGENS TERRESTRES, MARÍTIMAS OU FLUVIAIS": "Passagens terrestres, marítimas ou fluviais",
    "SERVIÇO DE SEGURANÇA PRESTADO POR EMPRESA ESPECIALIZADA.": "Serviço de segurança por empresa especializada",
    "SERVIÇO DE TÁXI, PEDÁGIO E ESTACIONAMENTO": "Serviço de táxi, pedágio e estacionamento",
    "SERVIÇOS POSTAIS": "Serviços postais",
    "TELEFONIA": "Telefonia"
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
}
  

export default function Charts(props: { resumo: Resumo, ano: number }) {

    const categories_data = props.resumo?.categorias?.map(r => {
        return {
            name: conversions[r.descricao] || r.descricao,
            y: Number(r.total)
        }
    })

    const categories_options = {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
            backgroundColor: "transparent",
        },
        title: {
            text: "Gastos por categoria",
            style: {
                fontSize: "1.1em"
            }
        },
        series: [
            {
                name: "Total",
                colorByPoint: true,
                data: categories_data
            }
        ],
        rangeSelector: {
            enabled: false
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                showInLegend: true,
            }
        },
        legend: {
            layout: "vertical"
        }
    }

    const per_month_data = props.resumo?.gastoPorMes?.map(g => {
        return {
            name: months[g.mes].slice(0, 3),
            y: Number(g.total)
        }
    })

    const per_month_options = {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'column',
            backgroundColor: "transparent"
        },
        plotOptions: {
            column: {
                maxPointWidth: 30,
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                showInLegend: true,
            }
        },
        title: {
            text: `Gasto mensal em ${props.ano}`,
            style: {
                fontSize: "1.1em"
            }
        },
        xAxis: {
            categories: per_month_data?.map(g => g.name.slice(0, 3))
        },
        series: [
            {
                name: "Total",
                colorByPoint: true,
                data: per_month_data
            }
        ],
    }

    return (
        <section id="charts">
            <div id="container">
                <div className="f-chart">
                    <Chart 
                        highcharts={Highcharts}
                        options={categories_options}
                    />
                </div>
                <div className="f-chart" key={"a"}>
                    <Chart 
                        highcharts={Highcharts}
                        options={per_month_options}
                    />
                </div>
            </div>
            <a href="/faq/dados-diferentes-do-portal" target="_blank">Os dados estão diferentes do portal da câmara?</a>
            <br /><br />
        </section>
    )
}