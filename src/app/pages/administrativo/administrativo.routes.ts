import { Routes } from '@angular/router';
import { EstudiantesCrud } from './estudiantes-crud/estudiantes-crud';
import { AdministrativoDashboard } from './administrativo-dashboard/administrativo-dashboard';

export default [
    { path: '', component: AdministrativoDashboard },
    { path: 'contrataciones', loadChildren: () => import('./contrataciones/contrataciones.routes') },
    { path: 'cursos', loadChildren: () => import('./cursos/cursos.routes') },
    { path: 'horarios', loadChildren: () => import('./horarios/horarios.routes') },
    { path: 'instituciones', loadChildren: () => import('./instituciones/instituciones.routes') },
    { path: 'estudiantes', component: EstudiantesCrud },
] as Routes;
