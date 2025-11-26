export enum TipoRazon {
    ESTUDIANTE = 1,
    CLASE = 2
}

export function getTipoRazonName(tipo: TipoRazon): string {
    switch (tipo) {
        case TipoRazon.ESTUDIANTE:
            return 'Estudiante';
        case TipoRazon.CLASE:
            return 'Clase';

        default:
            return 'Desconocido';
    }
}