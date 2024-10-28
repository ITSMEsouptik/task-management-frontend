import { Routes } from '@angular/router';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { TasksComponent } from './tasks/tasks.component';
import { CreateTaskComponent } from './tasks/create-task/create-task.component';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: SignInComponent
    },
    {
        path: 'signIn',
        component: SignInComponent
    },
    {
        path: 'signUp',
        component: SignUpComponent
    },
    {
        path: 'tasks',
        component: TasksComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
            {
                path: 'create',
                component: CreateTaskComponent,
            }
        ]
    }
];
