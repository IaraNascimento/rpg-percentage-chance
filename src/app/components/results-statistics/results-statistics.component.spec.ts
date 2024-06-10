import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsStatisticsComponent } from './results-statistics.component';

describe('ResultsStatisticsComponent', () => {
  let component: ResultsStatisticsComponent;
  let fixture: ComponentFixture<ResultsStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultsStatisticsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResultsStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
