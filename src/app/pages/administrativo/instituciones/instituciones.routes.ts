import { Routes } from '@angular/router';
import { AulasCrud } from './aulas-crud/aulas-crud';
import { InstitucionesCrud } from './instituciones-crud/instituciones-crud';
import { SedesCrud } from './sedes-crud/sedes-crud';

export default [
    { path: 'aulas', component: AulasCrud },
    { path: 'instituciones', component: InstitucionesCrud },
    { path: 'sedes', component: SedesCrud },
] as Routes;
