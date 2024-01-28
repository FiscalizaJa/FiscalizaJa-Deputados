interface Categoria {
    total: number
    descricao: string
    numeroSubCota: number
    numeroEspecificacaoSubCota: number
}

interface Gasto {
    total: number
    mes: number
}

interface Resumo {
    categorias: Categoria[]
    gastoPorMes: Gasto[]
}

export type { Categoria, Gasto, Resumo }