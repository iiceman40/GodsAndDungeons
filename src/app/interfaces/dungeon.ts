export interface Dungeon {
	state: number;
	entry: {level: number, x: number, y: number};
	levels: number;
	map: {};
	maxSize: {
		x: number;
		y: number;
	};
}
