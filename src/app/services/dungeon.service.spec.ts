import { TestBed, inject } from '@angular/core/testing';

import { DungeonService } from './dungeon.service';

describe('DungeonService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DungeonService]
    });
  });

  it('should be created', inject([DungeonService], (service: DungeonService) => {
    expect(service).toBeTruthy();
  }));
});
