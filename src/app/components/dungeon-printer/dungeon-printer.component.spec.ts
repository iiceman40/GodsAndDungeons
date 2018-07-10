import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DungeonPrinterComponent } from './dungeon-printer.component';

describe('DungeonPrinterComponent', () => {
  let component: DungeonPrinterComponent;
  let fixture: ComponentFixture<DungeonPrinterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DungeonPrinterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DungeonPrinterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
