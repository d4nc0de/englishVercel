import { Routes } from '@angular/router';
import { ComponentesCrud } from './componentes-crud/componentes-crud';
import { PeriodosCrud } from './periodos-crud/periodos-crud';

export default [
    { path: 'componentes', component: ComponentesCrud },
    { path: 'periodos', component: PeriodosCrud },
] as Routes;
