import {Component, HostListener, OnInit} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {DungeonService} from '../../services/dungeon.service';

@Component({
	selector: 'app-map',
	templateUrl: './map.component.html',
	styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

	currentTile: { level: number, x: number, y: number, monsters: {}[], exits: string[] } = null;
	gridSize = 50;

	constructor(
		public afAuth: AngularFireAuth,
		public dungeonService: DungeonService) {
	}

	ngOnInit() {
		// TODO init player position

		// this.dungeonService.dungeon.subscribe(dungeon => {
		// 	if (dungeon && Object.keys(dungeon.map).length === 0) {
		// 		this.currentTile = null;
		// 	}
		// });
	}

	@HostListener('window:keydown', ['$event'])
	keyboardInput(event: KeyboardEvent) {
		switch (event.key) {
			case 'ArrowUp':
				event.preventDefault();
				this.goTroughExit(DungeonService.EXITS_UP);
				break;
			case 'ArrowDown':
				event.preventDefault();
				this.goTroughExit(DungeonService.EXITS_DOWN);
				break;
			case 'ArrowLeft':
				event.preventDefault();
				this.goTroughExit(DungeonService.EXITS_LEFT);
				break;
			case 'ArrowRight':
				event.preventDefault();
				this.goTroughExit(DungeonService.EXITS_RIGHT);
				break;
		}
	}

	enter() {
		const entry = this.dungeonService.dungeon.getValue().entry;
		this.goToTile(entry.level, entry.x, entry.y);
	}

	goToTile(level, x, y) {
		let currentTile = this.dungeonService.getTile(level, x, y);
		if (!!currentTile === false) {
			currentTile = this.dungeonService.generateTile(level, x, y);
		}
		this.currentTile = currentTile;
		// TODO update player position
	}

	canEnter() {
		return this.dungeonService.dungeon.getValue() !== null && this.afAuth.auth.currentUser;
	}

	goTroughExit(exit: string) {
		if (!!this.currentTile === false || this.currentTile.exits.indexOf(exit) === -1) {
			return;
		}

		switch (exit) {
			case 'left':
				this.goToTile(this.currentTile.level, this.currentTile.x - 1, this.currentTile.y);
				break;
			case 'right':
				this.goToTile(this.currentTile.level, this.currentTile.x + 1, this.currentTile.y);
				break;
			case 'up':
				this.goToTile(this.currentTile.level, this.currentTile.x, this.currentTile.y - 1);
				break;
			case 'down':
				this.goToTile(this.currentTile.level, this.currentTile.x, this.currentTile.y + 1);
				break;
			case 'deeper':
				this.goToTile(this.currentTile.level + 1, this.currentTile.x, this.currentTile.y);
				break;
			case 'height':
				this.goToTile(this.currentTile.level - 1, this.currentTile.x, this.currentTile.y);
				break;
		}
	}

	getObjectAsArray(obj) {
		return !!obj === false ? [] : Object.keys(obj).map((k) => obj[k]);
	}

	zoomOut() {
		this.gridSize = Math.max(0, this.gridSize - 10);
	}

	zoomIn() {
		this.gridSize = Math.min(200, this.gridSize + 10);
	}

	hasExitLeft(tile) {
		return tile.exits.indexOf(DungeonService.EXITS_LEFT) !== -1;
	}

	hasExitRight(tile) {
		return tile.exits.indexOf(DungeonService.EXITS_RIGHT) !== -1;
	}

	hasExitUp(tile) {
		return tile.exits.indexOf(DungeonService.EXITS_UP) !== -1;
	}

	hasExitDown(tile) {
		return tile.exits.indexOf(DungeonService.EXITS_DOWN) !== -1;
	}
}
