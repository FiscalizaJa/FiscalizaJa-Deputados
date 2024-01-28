import { useState, useEffect } from "react";
import type { Deputado } from "../interfaces/Deputado";

import "../styles/listaDeputado.scss";

const estados_uf = {"AC":"Acre","AL":"Alagoas","AP":"Amapá","AM":"Amazonas","BA":"Bahia","CE":"Ceará","DF":"Distrito Federal","ES":"Espírito Santo","GO":"Goiás","MA":"Maranhão","MT":"Mato Grosso","MS":"Mato Grosso do Sul","MG":"Minas Gerais","PA":"Pará","PB":"Paraíba","PR":"Paraná","PE":"Pernambuco","PI":"Piauí","RJ":"Rio de Janeiro","RN":"Rio Grande do Norte","RS":"Rio Grande do Sul","RO":"Rondônia","RR":"Roraima","SC":"Santa Catarina","SP":"São Paulo","SE":"Sergipe","TO":"Tocantins"};

function removeAcento(text: string) {                                                        
    text = text.replace(new RegExp('[ÁÀÂÃ]','gi'), 'a');
    text = text.replace(new RegExp('[ÉÈÊ]','gi'), 'e');
    text = text.replace(new RegExp('[ÍÌÎ]','gi'), 'i');
    text = text.replace(new RegExp('[ÓÒÔÕ]','gi'), 'o');
    text = text.replace(new RegExp('[ÚÙÛ]','gi'), 'u');
    text = text.replace(new RegExp('[Ç]','gi'), 'c');
    return text; 
}

export default function ListaDeputados(props: { deputados: Deputado[], partidos?: any[] }) {
    const [listaDeputados, setLista] = useState(props.deputados)
    const partidos = props.partidos || []
    const estados = []

    for(const deputado of props.deputados) {
        if(!estados.find(e => e.uf === deputado.ufNascimento)) {
            estados.push({
                uf: deputado.ufNascimento,
                estado: estados_uf[deputado.ufNascimento]
            })
        }
    }

    let searchTimeout;

    function handleFilters() {
        const partidosInput = document.querySelector<HTMLSelectElement>("#partidos")
        const estadosInput = document.querySelector<HTMLSelectElement>("#estados")
        const searchInput = document.querySelector<HTMLInputElement>("#search")

        if(!searchInput.value) {
            setLista(
                props.deputados.filter(d => {
                    if(partidosInput.value === "all") {
                        return true
                    } else {
                        return d.siglaPartido == partidosInput.value
                    }
                }).filter(d => {
                    if(estadosInput.value === "all") {
                        return true
                    } else {
                        return d.ufNascimento == estadosInput.value
                    }
                })
            )
        } else {
            if(searchTimeout) {
                clearTimeout(searchTimeout)
            }
            searchTimeout = setTimeout(() => {
    
                if(!searchInput.value) {
                    setLista(props.deputados)
                } else {
                    let result = props.deputados.filter(d => removeAcento(d.nome.toLowerCase()).startsWith(removeAcento(searchInput.value.toLowerCase())))

                    setLista(result.filter(d => {
                        if(partidosInput.value === "all") {
                            return true
                        } else {
                            return d.siglaPartido == partidosInput.value
                        }
                    }).filter(d => {
                        if(estadosInput.value === "all") {
                            return true
                        } else {
                            return d.ufNascimento == estadosInput.value
                        }
                    }) as any)
                }
            }, 400)
        }

    }

    function loadImagesOnDemand() {
        const images = document.querySelectorAll("img[data-src]");
        for (let i = 0; i < images.length; i++) {
            const rect = images[i].getBoundingClientRect();
            if (images[i].hasAttribute("data-src") && rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth) {
                images[i].setAttribute("src", images[i].getAttribute("data-src"));
                images[i].removeAttribute("data-src");
            }
        }
    }

    useEffect(() => {
        loadImagesOnDemand()
    }, [listaDeputados])

    useEffect(() => {
        document.addEventListener("scroll", loadImagesOnDemand)
        document.addEventListener("resize", loadImagesOnDemand)
    })

    return (
        <>
            <header>
                <h1>Possuímos uma missão.</h1>
                <p>Quer mudar o país? Comece cobrando quem está nessa lista.</p>
            </header>
            <main>
                <div id="painel">
                    <div id="text-input-container">
                        <input type="text" placeholder="Kim Kataguiri" onInput={handleFilters} id="search" />
                    </div>
                    <div id="seletores">
                        <select style={{ borderRadius: "8px 0 0 8px" }} id="estados" onChange={handleFilters}>
                            <option value="all">
                                Todos os estados
                            </option>
                            {estados.map((estado, i) => (
                                <option value={estado.uf} key={`uf-${i}`}>
                                    {estado.estado}
                                </option>
                            ))}
                        </select>
                        <select style={{ borderRadius: "0 8px 8px 0" }} id="partidos" onChange={handleFilters}>
                            <option value="all">
                                Todos os partidos
                            </option>
                            {
                                partidos.map((partido, i) => (
                                    <option value={partido} key={`partido-${i}`}>
                                        {partido}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                </div>
                <div id="deputados">
                    {listaDeputados.map((deputado) => (
                        <a href={`/deputados/${deputado.idCamara}`} key={deputado.idCamara}>
                            <div id="text">
                                <img 
                                    data-src={deputado.urlFoto}
                                    alt={`Foto ${deputado.siglaSexo === "M" ? "do deputado" : "da deputada"} ${deputado.nome}`}
                                    width={80}
                                    height={80}
                                />
                                <div>
                                    <h2>{deputado.nome}</h2>
                                    <p>{deputado.siglaPartido} / {deputado.ufNascimento}</p>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </main>
        </>
    )
}