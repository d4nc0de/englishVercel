export enum Sexo {
    Masculino = 'M',
    Femenino = 'F',
    Otro = 'O'
}

export function getSexoName(sexo: Sexo): string {
    switch (sexo) {
        case Sexo.Masculino:
            return 'Masculino';
        case Sexo.Femenino:
            return 'Femenino';
        case Sexo.Otro:
            return 'Otro';
        default:
            return 'Desconocido';
    }
}