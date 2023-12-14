import "../styles/deputado.scss";

import { useState } from "react";

import DeputadoViagens from "./DeputadoViagens";
import DeputadoCombustiveis from "./DeputadoCombustiveis";
import DeputadoAlimentacao from "./DeputadoAlimentacao";
import DeputadoLocomocao from "./DeputadoLocomocao";
import DeputadoListaDespesa from "./DeputadoListaDespesa";

import type { Deputado } from "../interfaces/Deputado";
import type { Despesa } from "../interfaces/Despesa";
import type { Viagem } from "../interfaces/Viagem";
import type { Combustivel } from "../interfaces/Combustivel";
import type { Alimentacao } from "../interfaces/Alimentacao";
import type { Locomocao } from "../interfaces/Locomocao";

import type { Fornecedor } from "../interfaces/Fornecedor";

export default function DeputadoBody(props: { deputado: Deputado, todas_despesas: Despesa[], viagens: { viagens: Viagem[], fornecedores: Fornecedor[] }, combustiveis: { combustiveis: Combustivel[], fornecedores: Fornecedor[] }, alimentacao: { alimentacao: Alimentacao[], fornecedores: Fornecedor[] }, locomocao: { locomocao: Locomocao[], fornecedores: Fornecedor[] }, baseURL: string }) {
    const [section, setSection] = useState("viagens")
    
    return (
        <>
            <main>
                <div id="relatorios-painel">
                    <div id="first" className={section === "viagens" ? "selected" : ""} onClick={() => {
                        setSection("viagens")
                    }}>Viagens</div>
                    <div className={section === "combustiveis" ? "selected" : ""} onClick={() => {
                        setSection("combustiveis")
                    }}>Combustíveis</div>
                    <div className={section === "alimentacao" ? "selected" : ""} onClick={() => {
                        setSection("alimentacao")
                    }}>Alimentação</div>
                    <div className={section === "locomocao" ? "selected" : ""} onClick={() => {
                        setSection("locomocao")
                    }}>Locomoção</div>
                    <div id="last" className={section === "todas" ? "selected" : ""} onClick={() => {
                        setSection("todas")
                    }}>Todas despesas</div>
                </div>
                <div id="line" />
                <div id="content">
                    { section === "viagens" && <DeputadoViagens viagens={props.viagens} deputadoID={props.deputado.idCamara} baseURL={props.baseURL} /> }
                    { section === "combustiveis" && <DeputadoCombustiveis combustiveis={props.combustiveis} deputadoID={props.deputado.idCamara} baseURL={props.baseURL} /> }
                    { section === "alimentacao" && <DeputadoAlimentacao alimentacao={props.alimentacao} deputadoID={props.deputado.idCamara} baseURL={props.baseURL} />}
                    { section === "locomocao" && <DeputadoLocomocao locomocao={props.locomocao} deputadoID={props.deputado.idCamara} baseURL={props.baseURL} />}
                    { section === "todas" && <DeputadoListaDespesa despesas={props.todas_despesas} deputadoID={props.deputado.idCamara} baseURL={props.baseURL} /> }  
                </div>
            </main>
        </>
    )
}