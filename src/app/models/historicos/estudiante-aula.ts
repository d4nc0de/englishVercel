export interface EstudianteAula {
    estudianteaulahistoricoid: number;
    fecha_inicio: Date;
    fecha_fin?: Date;
    motivo_cambio?: string;
    estudianteid: number;
    aulaid: number;
}
