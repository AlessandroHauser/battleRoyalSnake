import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AppComponent} from "./app.component";
import {FieldComponent} from "./components/field/field.component";

const routes: Routes = [
  // { path: '**', component: AppComponent},
  { path: 'home', component: AppComponent },
  { path: 'field', component: FieldComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
