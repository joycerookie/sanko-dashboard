import { Routes } from '@angular/router';
import { Dashboard2Component } from './dashboard-2/dashboard-2.component';
import { AppComponent } from './app.component';
import { Dashboard1Component } from './dashboard-1/dashboard-1.component';

//export const routes: Routes = [];
export const routes: Routes = [
  { path: 'dash1', component: Dashboard1Component },
  { path: 'dash2', component: Dashboard2Component },
];
