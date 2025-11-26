export enum TipoJornada {
    MATUTINA = 1,
    TARDE = 2,
    MIXTA = 3
}

export function getTipoJornadaName(tipo: TipoJornada): string {
    switch (tipo) {
        case TipoJornada.MATUTINA:
            return 'Mañana';
        case TipoJornada.TARDE:
            return 'Tarde';
        case TipoJornada.MIXTA:
            return 'Mixta';
        default:
            return 'Desconocido';
    }
}