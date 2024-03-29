import { useState } from "react";
import CotaParlamentar from "./CotaParlamentar";
import RedesSociais from "./RedesSociais";

import type { Deputado } from "../../interfaces/Deputado";
import type { Despesa } from "../../interfaces/Despesa";
import type { Resumo } from "../../interfaces/Resumo";

export default function Body(props: { deputado: Deputado, despesas: { data: Despesa[], totalGasto: number, fornecedores: any }, resumo: Resumo }) {
    const [section, defineSection] = useState("cota")

    return (
        <main>
            <nav id="sections">
                <button id="first" className={section == "cota" ? "selected" : ""} onClick={() => { defineSection("cota") }}>
                    Cota parlamentar
                </button>
                <button id="last" className={section == "redes_sociais" ? "selected" : ""} onClick={() => { defineSection("redes_sociais") }}>
                    Redes Sociais
                </button>
            </nav>
            <div id="line" />
            { section === "cota" && <CotaParlamentar resumo={props.resumo} deputado={props.deputado} despesas={props.despesas} /> }
            { section === "redes_sociais" && <RedesSociais links={props.deputado.urlRedeSocial || []} deputado={props.deputado} /> }
        </main>
    )
}
