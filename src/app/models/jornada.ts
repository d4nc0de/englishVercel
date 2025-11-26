import { TipoJornada } from "@/enums/tipo-jornada";

export interface Jornada {
    jornadaid: number;
    codigo: TipoJornada;
    descripcion: string;
}
