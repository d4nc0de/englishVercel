export enum DiaSemana {
    LUNES = 1,
    MARTES = 2,
    MIERCOLES = 3,
    JUEVES = 4,
    VIERNES = 5,
    SABADO = 6,
    DOMINGO = 7
}

export function getDiaSemanaName(dia: DiaSemana): string {
    switch (dia) {
        case DiaSemana.LUNES:
            return "Lunes";
        case DiaSemana.MARTES:
            return "Martes";
        case DiaSemana.MIERCOLES:
            return "Miércoles";
        case DiaSemana.JUEVES:
            return "Jueves";
        case DiaSemana.VIERNES:
            return "Viernes";
        case DiaSemana.SABADO:
            return "Sábado";
        case DiaSemana.DOMINGO:
            return "Domingo";
        default:
            return "Desconocido";
    }
}