import "../styles/deputado.scss";

import { useState } from "react";

import DeputadoViagens from "./DeputadoViagens";
import DeputadoCombustiveis from "./DeputadoCombustiveis";
import DeputadoAlimentacao from "./DeputadoAlimentacao";
import DeputadoLocomocao from "./DeputadoLocomocao";
import DeputadoListaDespesa from "./DeputadoListaDespesa";

import type { Deputado } from "../interfaces/Deputado";

export default function DeputadoBody(props: { deputado: Deputado, baseURL: string }) {
    const [section, setSection] = useState("todas")
    
    return (
        <>
            <main>
                <div id="relatorios-painel">
                    <div id="first" className={section === "todas" ? "selected" : ""} onClick={() => {
                        setSection("todas")
                    }}>Todas despesas</div>
                    <div className={section === "viagens" ? "selected" : ""} onClick={() => {
                        setSection("viagens")
                    }}>Viagens</div>
                    <div className={section === "combustiveis" ? "selected" : ""} onClick={() => {
                        setSection("combustiveis")
                    }}>Combustíveis</div>
                    <div className={section === "alimentacao" ? "selected" : ""} onClick={() => {
                        setSection("alimentacao")
                    }}>Alimentação</div>
                    <div id="last" className={section === "locomocao" ? "selected" : ""} onClick={() => {
                        setSection("locomocao")
                    }}>Locomoção</div>
                </div>
                <div id="line" />
                <div id="content">
                    { section === "todas" && <DeputadoListaDespesa deputadoID={props.deputado.idCamara} baseURL={props.baseURL} /> }
                    { section === "viagens" && <DeputadoViagens deputadoID={props.deputado.idCamara} baseURL={props.baseURL} /> }
                    { section === "combustiveis" && <DeputadoCombustiveis deputadoID={props.deputado.idCamara} baseURL={props.baseURL} /> }
                    { section === "alimentacao" && <DeputadoAlimentacao deputadoID={props.deputado.idCamara} baseURL={props.baseURL} />}
                    { section === "locomocao" && <DeputadoLocomocao deputadoID={props.deputado.idCamara} baseURL={props.baseURL} />}  
                </div>
            </main>
        </>
    )
}