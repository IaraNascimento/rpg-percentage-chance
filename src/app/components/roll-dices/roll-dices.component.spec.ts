import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RollDicesComponent } from './roll-dices.component';

describe('RollDicesComponent', () => {
  let component: RollDicesComponent;
  let fixture: ComponentFixture<RollDicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RollDicesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RollDicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
