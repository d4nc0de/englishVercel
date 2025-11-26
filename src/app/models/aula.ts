import { TipoPrograma } from "@/enums/tipo-programa";

export interface Aula {
    aulaid: number;
    nombre: string;
    grado: number;
    cupo_maximo?: number;
    activo: boolean;
    sedeid: number;
    programaid: TipoPrograma;
    jornadaid: number;
    tutorid: number;
}
