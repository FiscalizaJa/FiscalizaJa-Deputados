import "../styles/deputado.scss";

function getAge(date: string) {
    const jsdate = new Date(date)

    const year = jsdate.getFullYear()
    const month = jsdate.getMonth() + 1

    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth()

    const age = currentMonth < month ? currentYear - year - 1 : currentYear - year

    return age
}

export default function DeputadoHeader(props: { deputado: any }) {
    const { deputado } = props
    
    return (
        <>
            <header>
                <div id="content">
                   <div id="img-container">
                        <img 
                        src={`https://www.camara.leg.br/internet/deputado/bandep/pagina_do_deputado/${deputado.idCamara}.jpg`}
                        width="510"
                        height="210"
                        alt={`Foto de ${deputado.nome} na câmara dos deputados`}
                        />
                   </div>
                    <div>
                        <h1>{deputado.nome}</h1>
                        <p id="tiny">{deputado.nomeCivil}</p>
                        <p>{deputado.siglaSexo === "M" ? "Nascido" : "Nascida"} em {deputado.dataNascimento.getFullYear()} na cidade de {deputado.municipioNascimento}, {deputado.nomeCivil.split(" ")[0]} atua pelo {deputado.siglaPartido} e tem {getAge(deputado.dataNascimento)} anos de idade.</p>
                        <a href={`https://www.camara.leg.br/deputados/${deputado.idCamara}`} target="_blank">Mais informações</a>
                    </div>
                </div>
            </header>
        </>
    )
}