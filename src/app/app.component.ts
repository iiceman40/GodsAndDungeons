import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	title = 'app';

	constructor(public afAuth: AngularFireAuth) {
	}

	ngOnInit(): void {
	}
}
