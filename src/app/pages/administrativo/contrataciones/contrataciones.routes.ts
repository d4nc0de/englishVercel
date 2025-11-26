import { Routes } from '@angular/router';
import { PersonasCrud } from './personas-crud/personas-crud';
import { TutoresCrud } from './tutores-crud/tutores-crud';

export default [
    { path: 'personas', component: PersonasCrud },
    { path: 'tutores', component: TutoresCrud },
] as Routes;
