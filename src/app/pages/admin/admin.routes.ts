import { Routes } from '@angular/router';
import { Calendario } from './calendario/calendario';
import { UsersCrud } from './users-crud/users-crud';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';

export default [
    { path: '', component: AdminDashboard },
    { path: 'calendario', component: Calendario },
    { path: 'usuarios', component: UsersCrud },
] as Routes;
