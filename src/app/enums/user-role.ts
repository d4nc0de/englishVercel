export enum UserRole {
    TUTOR = 2,
    ADMINISTRATIVO = 3,
    ADMINISTRADOR = 1
}

export function getUserRoleName(role: UserRole): string {
    switch (role) {
        case UserRole.TUTOR:
            return 'Tutor';
        case UserRole.ADMINISTRATIVO:
            return 'Administrativo';
        case UserRole.ADMINISTRADOR:
            return 'Administrador';
        default:
            return 'Desconocido';
    }
}