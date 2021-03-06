import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {AngularFireModule} from 'angularfire2';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {environment} from '../environments/environment';
import {MapComponent} from './components/map/map.component';
import {AngularFirestore, AngularFirestoreModule} from 'angularfire2/firestore';
import {LoginComponent} from './components/login/login.component';
import {AngularFireAuth, AngularFireAuthModule} from 'angularfire2/auth';
import {DungeonPrinterComponent} from './components/dungeon-printer/dungeon-printer.component';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
	declarations: [
		AppComponent,
		MapComponent,
		LoginComponent,
		DungeonPrinterComponent
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		AngularFireModule.initializeApp(environment.firebase.config),
		AngularFireDatabaseModule,
		AngularFirestoreModule,
		AngularFireAuthModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {
}
