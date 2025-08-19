import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { AUTH_GUARD } from '@/guard/auth.guard';
import { LOGIN_GUARD } from '@/guard/login.guard';

export const appRoutes: Routes = [
    { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
    { path: 'auth', canActivate:[LOGIN_GUARD], loadChildren: () => import('./app/pages/auth/auth.routes') },
    {
        path: 'application',
        component: AppLayout,
        canActivate: [AUTH_GUARD],
        children: [
            { path: '', component: Dashboard },
            { path: 'features', loadChildren: () => import('./app/components/components.routes')},
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
        ]
    },
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: '**', redirectTo: '/notfound' }
];
