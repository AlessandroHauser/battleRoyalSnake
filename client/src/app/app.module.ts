import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FieldComponent } from './components/field/field.component';
import { StartComponent } from './components/start/start.component';
import { DeathScreenComponent } from './components/death-screen/death-screen.component';

@NgModule({
  declarations: [
    AppComponent,
    FieldComponent,
    StartComponent,
    DeathScreenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
