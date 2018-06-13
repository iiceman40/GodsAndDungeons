import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {auth} from 'firebase';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

	constructor(public afAuth: AngularFireAuth) {
	}

	ngOnInit(): void {
	}

	login() {
		this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
	}

	logout() {
		this.afAuth.auth.signOut();
	}

}
