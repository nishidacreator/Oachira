import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CounterViewComponent } from './components/counter-view/counter-view.component';
import { NavbarComponent } from './components/navbar/navbar.component';

const routes: Routes = [
  {
    path: "",
    component: NavbarComponent,
    children: [{ path: "home", component: CounterViewComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CounterRoutingModule { }
