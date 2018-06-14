import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {AngularFirestore} from 'angularfire2/firestore';
import {Dungeon} from '../interfaces/dungeon';

@Injectable({
	providedIn: 'root'
})
export class DungeonService {

	static readonly EXITS_LEFT = 'left';
	static readonly EXITS_RIGHT = 'right';
	static readonly EXITS_UP = 'up';
	static readonly EXITS_DOWN = 'down';

	dungeonId: string;
	dungeon: BehaviorSubject<Dungeon> = new BehaviorSubject(null);

	constructor(private _db: AngularFirestore) {
		let currentlyActiveDungeon = null;
		let currentlyActiveDungeonId = null;
		_db.collection('dungeons').snapshotChanges().subscribe(changes => {
			changes.forEach(change => {
				const dungeonId = change.payload.doc.id;
				const dungeon = <Dungeon>change.payload.doc.data();
				console.log('change id', dungeonId);
				console.log('change data', dungeon);
				if (dungeon.state === 1) {
					currentlyActiveDungeon = dungeon;
					currentlyActiveDungeonId = dungeonId;
				}
			});
			this.dungeonId = currentlyActiveDungeonId;
			this.dungeon.next(currentlyActiveDungeon);
			console.log(this.dungeonId, this.dungeon.getValue());
		});

	}

	generateTile(level: number, x: number, y: number) {
		const dungeon = this.dungeon.getValue();
		if (dungeon !== null) {
			if (!!dungeon.map[level] === false) {
				dungeon.map[level] = {};
			}
			if (!!dungeon.map[level][y] === false) {
				dungeon.map[level][y] = {};
			}
			if (!!dungeon.map[level][y][x] === false) {
				dungeon.map[level][y][x] = {
					level: level,
					x: x,
					y: y,
					monsters: [],
					exits: []
				};
				this._generateEntries(dungeon.map[level][y][x]);
				this._generateExits(dungeon.map[level][y][x]);
			}
		}
		this.dungeon.next(dungeon);

		this._db.doc(`dungeon-${this.dungeonId}-tiles/tile-${level}-${x}-${y}`).set(dungeon.map[level][y][x]);

		// TODO do not update dungeon itself anymore but get the tile information from the tiles collection
		if (dungeon !== null) {
			const dbDungeon = this._db.collection('dungeons').doc(this.dungeonId);
			if (this.dungeon.getValue() !== null) {
				dbDungeon.ref.update(dungeon);
			}
		}

		return dungeon.map[level][y][x];
	}

	getTile(level: number, x: number, y: number) {
		const dungeon = this.dungeon.getValue();
		if (dungeon !== null) {
			if (!!dungeon.map[level] === false) {
				return null;
			}
			if (!!dungeon.map[level][y] === false) {
				return null;
			}
			if (!!dungeon.map[level][y][x] === true) {
				return dungeon.map[level][y][x];
			}
		}
		return null;
	}

	private _generateExits(tile) {
		const numberOfExits = Math.round(Math.random()) + 1;
		for (let i = 0; i < numberOfExits; i++) {
			this._generateExit(tile);
		}
	}

	private _generateExit(tile) {
		const dungeon = this.dungeon.getValue();
		const possibleExits = [];

		// limit possible exits considering map boundaries and already existing exits
		if (tile.x > 0 && tile.exits.indexOf(DungeonService.EXITS_LEFT) === -1) {
			const neighborTile = this.getTile(tile.level, tile.x - 1, tile.y);
			if (!!neighborTile === false || neighborTile.exits.indexOf(DungeonService.EXITS_RIGHT) !== -1) {
				possibleExits.push(DungeonService.EXITS_LEFT);
			}
		}
		if (tile.y > 0 && tile.exits.indexOf(DungeonService.EXITS_UP) === -1) {
			const neighborTile = this.getTile(tile.level, tile.x, tile.y - 1);
			if (!!neighborTile === false || neighborTile.exits.indexOf(DungeonService.EXITS_DOWN) !== -1) {
				possibleExits.push(DungeonService.EXITS_UP);
			}
		}
		if (tile.x < dungeon.maxSize.x - 1 && tile.exits.indexOf(DungeonService.EXITS_RIGHT) === -1) {
			const neighborTile = this.getTile(tile.level, tile.x + 1, tile.y);
			if (!!neighborTile === false || neighborTile.exits.indexOf(DungeonService.EXITS_LEFT) !== -1) {
				possibleExits.push(DungeonService.EXITS_RIGHT);
			}
		}
		if (tile.y < dungeon.maxSize.y - 1 && tile.exits.indexOf(DungeonService.EXITS_DOWN) === -1) {
			const neighborTile = this.getTile(tile.level, tile.x, tile.y + 1);
			if (!!neighborTile === false || neighborTile.exits.indexOf(DungeonService.EXITS_UP) !== -1) {
				possibleExits.push(DungeonService.EXITS_DOWN);
			}
		}

		// TODO add higher and deeper

		if (possibleExits.length > 0) {
			tile.exits.push(possibleExits[Math.floor(Math.random() * possibleExits.length)]);
		}
	}

	private _generateEntries(tile) {
		if (this.getTile(tile.level, tile.x - 1, tile.y)) {
			const neighborTile = this.getTile(tile.level, tile.x - 1, tile.y);
			if (neighborTile.exits.indexOf(DungeonService.EXITS_RIGHT) !== -1) {
				tile.exits.push(DungeonService.EXITS_LEFT);
			}
		}
		if (this.getTile(tile.level, tile.x + 1, tile.y)) {
			const neighborTile = this.getTile(tile.level, tile.x + 1, tile.y);
			if (neighborTile.exits.indexOf(DungeonService.EXITS_LEFT) !== -1) {
				tile.exits.push(DungeonService.EXITS_RIGHT);
			}
		}
		if (this.getTile(tile.level, tile.x, tile.y + 1)) {
			const neighborTile = this.getTile(tile.level, tile.x, tile.y + 1);
			if (neighborTile.exits.indexOf(DungeonService.EXITS_UP) !== -1) {
				tile.exits.push(DungeonService.EXITS_DOWN);
			}
		}
		if (this.getTile(tile.level, tile.x, tile.y - 1)) {
			const neighborTile = this.getTile(tile.level, tile.x, tile.y - 1);
			if (neighborTile.exits.indexOf(DungeonService.EXITS_DOWN) !== -1) {
				tile.exits.push(DungeonService.EXITS_UP);
			}
		}
	}
}
