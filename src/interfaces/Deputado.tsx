interface Deputado {
    id?: string,
    uri: string,
    operational?: number,
    nome: string,
    urlFoto: string,
    idCamara: number,
    idLegislaturaInicial: number,
    idLegislaturaFinal: number,
    nomeCivil: string,
    siglaSexo: string,
    siglaPartido: string,
    urlRedeSocial: string[],
    urlWebsite: string[],
    dataNascimento: string,
    dataFalecimento: string,
    ufNascimento: string,
    municipioNascimento: string
}

export type {
    Deputado
}