import { Horario } from "./horario";
import { HorarioDetalle } from "./horario-detalle";
import { Jornada } from "./jornada";

export interface HorarioCompleto {
    jornada: Jornada,
    horarios: HorarioWithDetalles[]
}

interface HorarioWithDetalles {
    horario: Horario,
    detalles: HorarioDetalle[]
}