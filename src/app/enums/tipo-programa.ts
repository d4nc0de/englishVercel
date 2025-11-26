export enum TipoPrograma {
    GLOBALENGLISH = 1,
    INSIDECLASSROOM = 2,
    OUTSIDECLASSROOM = 3
}

export function getTipoProgramaName(tipo: TipoPrograma): string {
    switch (tipo) {
        case TipoPrograma.GLOBALENGLISH:
            return 'Global English';
        case TipoPrograma.INSIDECLASSROOM:
            return 'Inside Classroom';
        case TipoPrograma.OUTSIDECLASSROOM:
            return 'Outside Classroom';
        default:
            return 'Desconocido';
    }
}