type TwoDigits = `${number}${number}`

// Hora basica HH:MM, sin validar limites reales (00–23, 00–59)
export type TimeString = `${TwoDigits}:${TwoDigits}`

export interface HorarioDetalle {
    horariodetalleid: number;
    dia_semana: number;
    hora_inicio: TimeString;
    hora_fin: TimeString;
    unidades: number;
    horarioid: number;
}

export function isValidTime(t: string): t is TimeString {
    return /^[0-2][0-9]:[0-5][0-9]$/.test(t)
}

export function timeStringToMinutes(t: TimeString | string): number {
    const [h, m] = t.split(':')
    return parseInt(h, 10) * 60 + parseInt(m, 10)
}