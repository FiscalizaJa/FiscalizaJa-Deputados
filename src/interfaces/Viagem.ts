interface Viagem {
    id: number;
    deputado: string;
    mes: number;
    ano: number;
    dataEmissao: string;
    companhia: string;
    cnpj: string;
    bilhete: string;
    valor: string;
    passageiros: string;
    trecho: string;
    idDocumento: number;
    comprovante: string;
}

export type {
    Viagem
}