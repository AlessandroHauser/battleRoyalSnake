import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FieldComponent} from "./components/field/field.component";
import {StartComponent} from "./components/start/start.component";
import {DeathScreenComponent} from "./components/death-screen/death-screen.component";

const routes: Routes = [
  { path: 'home', component: StartComponent },
  { path: 'field', component: FieldComponent },
  { path: 'death', component: DeathScreenComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
