import { Routes } from '@angular/router';
import { FestivosCrud } from './festivos-crud/festivos-crud';
import { HorariosCrud } from './horarios-crud/horarios-crud';
import { RazonesCrud } from './razones-crud/razones-crud';
import { JornadasCrud } from './jornadas-crud/jornadas-crud';

export default [
    { path: 'festivos', component: FestivosCrud },
    { path: 'horarios', component: HorariosCrud },
    { path: 'jornadas', component: JornadasCrud },
    { path: 'razones', component: RazonesCrud },
] as Routes;
