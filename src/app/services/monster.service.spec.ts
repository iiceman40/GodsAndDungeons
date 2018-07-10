import { TestBed, inject } from '@angular/core/testing';

import { MonsterService } from './monster.service';

describe('MonsterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MonsterService]
    });
  });

  it('should be created', inject([MonsterService], (service: MonsterService) => {
    expect(service).toBeTruthy();
  }));
});
