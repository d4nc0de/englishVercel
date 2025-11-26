export enum TipoDocumento {
    CC = 1,
    TI = 2,
    CE = 3,
    PAS = 4,
    RC = 5
}

export function getTipoDocumentoName(tipo: TipoDocumento): string {
    switch (tipo) {
        case TipoDocumento.CC:
            return "Cédula de Ciudadanía";
        case TipoDocumento.TI:
            return "Tarjeta de Identidad";
        case TipoDocumento.CE:
            return "Cédula de Extranjería";
        case TipoDocumento.PAS:
            return "Pasaporte";
        case TipoDocumento.RC:
            return "Registro Civil";
        default:
            return "Desconocido";
    }
}