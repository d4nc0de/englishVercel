export interface AulaJornada {
    aulajornadahistoricoid: number;
    fecha_inicio : Date;
    fecha_fin?: Date;
    motivo_cambio?: string;
    aulaid: number;
    jornadaid: number;
}
