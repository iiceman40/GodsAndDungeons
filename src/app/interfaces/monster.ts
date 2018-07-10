import {MonsterType} from './monster-type';

export interface Monster {
	type: MonsterType;
	hp: number;
	level: number;
	status: number;
}
