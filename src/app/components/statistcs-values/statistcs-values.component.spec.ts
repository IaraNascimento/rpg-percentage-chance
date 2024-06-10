import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatistcsValuesComponent } from './statistcs-values.component';

describe('StatistcsValuesComponent', () => {
  let component: StatistcsValuesComponent;
  let fixture: ComponentFixture<StatistcsValuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatistcsValuesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StatistcsValuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
