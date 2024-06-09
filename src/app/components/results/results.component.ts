import { Component, Input } from '@angular/core';
import { ICalcResults } from '../../services/simulator.service';

interface IResultsComponent {
  results: ICalcResults;
}

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss',
})
export class ResultsComponent implements IResultsComponent {
  @Input() results: ICalcResults = {};

  ngAfterViewInit(): void {
    this.startsTabsFromMaterialize();
  }

  public startsTabsFromMaterialize(): void {
    const el = document.querySelectorAll('.tabs');
    M.Tabs.init(el, {});
  }
}
