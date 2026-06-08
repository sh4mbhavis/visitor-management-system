import { Routes } from '@angular/router';

import { LoginComponent } from './features/auth/login/login';
import { DashboardComponent } from './features/dashboard/dashboard/dashboard';
import { MainLayoutComponent } from './layout/main-layout/main-layout';

import { VisitorListComponent } from './features/visitors/visitor-list/visitor-list';
import { VisitListComponent  } from './features/visits/visit-list/visit-list';
import { ApprovalListComponent } from './features/approvals/approval-list/approval-list';
import { ReportListComponent } from './features/reports/report-list/report-list';
import { UserListComponent } from './features/users/user-list/user-list';
import { AddVisitorComponent } from './features/visitors/add-visitor/add-visitor';
import { EditVisitorComponent } from './features/visitors/edit-visitor/edit-visitor';
import { DepartmentListComponent } from './features/departments/department-list/department-list';
import { AddDepartmentComponent } from './features/departments/add-department/add-department';
import { EditDepartmentComponent } from './features/departments/edit-department/edit-department';
import { AddVisitComponent } from './features/visits/add-visit/add-visit';
import { EditVisitComponent } from './features/visits/edit-visit/edit-visit';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: '',
    component: MainLayoutComponent,
   children: [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'visitors', component: VisitorListComponent },
  { path: 'visitors/add', component: AddVisitorComponent },
  { path: 'visits', component: VisitListComponent },
  { path: 'approvals', component: ApprovalListComponent },
  { path: 'reports', component: ReportListComponent },
  { path: 'users', component: UserListComponent },
{
  path: 'visitors/edit/:id',
  component: EditVisitorComponent
},
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'departments', component: DepartmentListComponent },
{ path: 'departments/add', component: AddDepartmentComponent },
{ path: 'departments/edit/:id', component: EditDepartmentComponent },
{ path: 'visits', component: VisitListComponent },
{ path: 'visits/add', component: AddVisitComponent },
{ path: 'visits/edit/:id', component: EditVisitComponent },
]
  },

  {
    path: '**',
    redirectTo: 'dashboard'
  }
];