export interface Institucion {
    institucionid: number;
    codigo: string;
    nombre: string;
    direccion?: string; // TODO: Eliminar? ¿No debería estar relacionado con una sede principal solamente?
}
