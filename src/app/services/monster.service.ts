import {Injectable} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {MonsterType} from '../interfaces/monster-type';
import {BehaviorSubject} from 'rxjs';
import {Tile} from '../interfaces/tile';
import {Monster} from '../interfaces/monster';

@Injectable({
	providedIn: 'root'
})
export class MonsterService {

	public static readonly MONSTER_STATUS_DEAD = 0;
	public static readonly MONSTER_STATUS_ALIVE = 1;

	private _monsterTypes: BehaviorSubject<{ [monsterTypeId: string]: MonsterType }> = new BehaviorSubject({});

	constructor(private _db: AngularFirestore) {
		_db.collection('monsterTypes').snapshotChanges().subscribe(changes => {
			const _monsterTypes = {};
			changes.forEach(change => {
				_monsterTypes[change.payload.doc.id] = <MonsterType>change.payload.doc.data();
			});
			this._monsterTypes.next(_monsterTypes);
			console.log('monsterTypes', this._monsterTypes);
		});
	}

	public async generateMonstersAtTile(tile: Tile) {
		const monster: Monster = await this._generateMonster(tile.level);
		tile.monsters = [monster];
		console.log('NEW MONSTER', monster);
	}

	private async _generateMonster(level): Promise<Monster> {
		const types = Object.keys(this._monsterTypes.getValue());
		const typeId = types[Math.floor(Math.random() * types.length)];
		const typeDoc = this._db.doc('monsterTypes/' + typeId);
		const type = await typeDoc.ref.get();
		const typeData: MonsterType = <MonsterType>type.data();
		return {
			type: typeData,
			hp: typeData.maxHP,
			level: level,
			status: MonsterService.MONSTER_STATUS_ALIVE
		};
	}

}
