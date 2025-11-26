export interface AsistenciaEstudiante {
    asistenciaestudianteid: number;
    asistio: boolean;
    observacion?: string;
    justificada: boolean;
    estado: string;
    sesionclaseid: number;
    estudianteid: number;
    motivoinasistenciaestudianteid?: number;
}
