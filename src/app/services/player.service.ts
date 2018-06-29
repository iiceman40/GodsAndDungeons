import {Injectable} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {AngularFireAuth} from 'angularfire2/auth';
import {DungeonService} from './dungeon.service';

@Injectable({
	providedIn: 'root'
})
export class PlayerService {

	isUpdatingDatabase = false;
	players;

	constructor(
		private _db: AngularFirestore,
		private _afAuth: AngularFireAuth,
		private _dungeonService: DungeonService
	) {
	}

	initPlayers () {
		this.players = this._db.collection(`dungeon-${this._dungeonService.dungeonId}-players`).valueChanges();
	}

	updatePlayerPosition(position) {
		const currentUser = this._afAuth.auth.currentUser;
		const id = currentUser.email; // TODO get a real id? maybe has the email
		const player = Object.assign({}, position);
		player.name = currentUser.displayName;
		this.isUpdatingDatabase = true;
		this._db.doc(`dungeon-${this._dungeonService.dungeonId}-players/player-${id}`).set(player).then(() => {
			this.isUpdatingDatabase = false;
		});
	}
}
