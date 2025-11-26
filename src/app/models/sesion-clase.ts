export interface SesionClase {
    sesionclaseid: number;
    fecha_real: Date,
    dia_semana: number,
    hora_inicio: Date,
    hora_fin: Date,
    minutos_dictados: number,
    clase_dictada: boolean,
    es_reposicion: boolean,
    estado: string,
    tutorid: number,
    aulaid: number,
    calendariosemanalprogramaid: number;
    motivonoclaseid?: number;
    festivoid?: number;
    sesionrepuestaid?: number;
}
