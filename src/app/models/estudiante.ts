import { Sexo } from "@/enums/sexo";
import { TipoDocumento } from "@/enums/tipo-documento";

export interface Estudiante {
    estudianteid: number;
    numero_documento: string;
    nombres: string;
    apellidos: string;
    fecha_nacimiento: Date;
    sexo?: Sexo;
    activo: boolean;
    tipodocumentoid: TipoDocumento;
    aulaid: number;
}
