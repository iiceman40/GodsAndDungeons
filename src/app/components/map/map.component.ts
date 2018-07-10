import {Component, HostListener, OnInit} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {DungeonService} from '../../services/dungeon.service';
import {PlayerService} from '../../services/player.service';
import {MonsterService} from '../../services/monster.service';
import {Monster} from '../../interfaces/monster';
import {Tile} from '../../interfaces/tile';

@Component({
	selector: 'app-map',
	templateUrl: './map.component.html',
	styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

	private static readonly MOVE_COOL_DOWN_VALUE = 500;
	private static readonly MOVE_COOL_DOWN_INTERVAL = 100;

	currentTile: Tile = null;
	gridSize = 50;
	moveCoolDown = 0;

	private _moveTimeout: number;

	constructor(
		public afAuth: AngularFireAuth,
		public dungeonService: DungeonService,
		public playerService: PlayerService) {
	}

	ngOnInit() {
		this.playerService.initPlayers();
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

	async goToTile(level, x, y) {
		if (this.moveCoolDown > 0) {
			return;
		}

		let currentTile = this.dungeonService.getTile(level, x, y);
		if (!!currentTile === false) {
			const entry = this.dungeonService.dungeon.getValue().entry;
			const preventMonsterSpawning = entry.x === x && entry.y === y;
			currentTile = await this.dungeonService.generateTile(level, x, y, preventMonsterSpawning);
		}

		this.currentTile = currentTile;
		this.playerService.updatePlayerPosition(currentTile);

		// move cool down
		this.moveCoolDown = MapComponent.MOVE_COOL_DOWN_VALUE;
		this._moveTimeout = setInterval(() => {
			this.moveCoolDown = Math.max(this.moveCoolDown - MapComponent.MOVE_COOL_DOWN_INTERVAL, 0);
			if (this.moveCoolDown === 0) {
				clearInterval(this._moveTimeout);
			}
		}, MapComponent.MOVE_COOL_DOWN_INTERVAL);

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

	attack(monster: Monster) {
		monster.hp = Math.max(0, monster.hp - 10);

		if (monster.hp === 0) {
			monster.status = MonsterService.MONSTER_STATUS_DEAD;
		}

		this.dungeonService.updateDungeon();
	}
}
