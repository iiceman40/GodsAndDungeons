import {Component, OnInit} from '@angular/core';
import {DungeonService} from '../../services/dungeon.service';

@Component({
	selector: 'app-dungeon-printer',
	templateUrl: './dungeon-printer.component.html',
	styleUrls: ['./dungeon-printer.component.scss']
})
export class DungeonPrinterComponent implements OnInit {

	public dungeon: {rooms: {}[], entry: {},};

	constructor(private _dungeonService: DungeonService) {
	}

	ngOnInit() {
		this._dungeonService.getDungeonFromGenerator();
	}

}
