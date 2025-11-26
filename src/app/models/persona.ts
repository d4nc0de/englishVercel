import { TipoDocumento } from "@/enums/tipo-documento";
import { UserRole } from "@/enums/user-role";

export interface Persona {
    personaid: number;
    tipodocumentoid: TipoDocumento;
    numero_documento: number;
    nombres: string;
    apellidos: string;
    activo: boolean;
    usuarioid?: string;
    rolid: UserRole;
    telefono: string;
}
