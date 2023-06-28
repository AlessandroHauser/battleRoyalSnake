import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FieldComponent} from './components/field/field.component';
import {StartComponent} from './components/start/start.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {DeathScreenComponent} from './components/death-screen/death-screen.component';
import {FormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {WinScreenComponent} from './components/win-screen/win-screen.component';


@NgModule({
	declarations: [
		AppComponent,
		FieldComponent,
		StartComponent,
		DeathScreenComponent,
		WinScreenComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FormsModule,
		BrowserAnimationsModule,
		MatButtonModule,
		MatDialogModule,
		MatProgressBarModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {
}
