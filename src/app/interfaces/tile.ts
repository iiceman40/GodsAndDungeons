import {Monster} from './monster';

export interface Tile {
	level: number;
	x: number;
	y: number;
	monsters: Monster[];
	exits: string[];
}
