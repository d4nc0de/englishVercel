import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Login } from './app/pages/auth/login';
// import { Documentation } from './app/pages/documentation/documentation';
// import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { Profile } from '@/pages/session/profile';
import { adminGuard } from '@/guards/admin-guard';
import { superAdminGuard } from '@/guards/superadmin-guard';
// import { authGuard } from '@/guards/auth-guard';  // si tienes uno

export const appRoutes: Routes = [

    // 👉 Predeterminado = Login
    { path: '', redirectTo: 'login', pathMatch: 'full' },

    { path: 'login', component: Login },
    // { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },

    // 👉 Rutas que sí van dentro del layout (solo después del login)
    {
        path: '',
        component: AppLayout,
        // canActivate: [authGuard], // opcional, recomendado
        children: [
            { path: 'dashboard', component: Dashboard },
            { path: 'admin', loadChildren: () => import('./app/pages/admin/admin.routes') },
            { path: 'administrativo', loadChildren: () => import('./app/pages/administrativo/administrativo.routes')},
            { path: 'tutor', loadChildren: () => import('./app/pages/tutor/tutor.routes') },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
            { path: 'profile', component: Profile }
        ]
    },

    { path: '**', redirectTo: 'notfound' }
];
