interface Despesa {
    id: number;
    nomeParlamentar: string;
    cpf: string;
    numeroCarteiraParlamentar: string;
    legislatura: number;
    siglaUF: string;
    siglaPartido: string;
    codigoLegislatura: number;
    numeroSubCota: number;
    descricao: string;
    numeroEspecificacaoSubCota: number;
    descricaoEspecificacao: string;
    fornecedor: string;
    cnpjCPF: string;
    numero: string;
    tipoDocumento: string;
    dataEmissao: string;
    valorDocumento: string;
    valorGlosa: string;
    valorLiquido: string;
    mes: number;
    ano: number;
    parcela: number;
    passageiro: string;
    trecho: string;
    lote: string;
    ressarcimento: string;
    datPagamentoRestituicao: string;
    restituicao: string;
    numeroDeputadoID: number;
    idDocumento: number;
    urlDocumento: string;
}

export type {
    Despesa
}