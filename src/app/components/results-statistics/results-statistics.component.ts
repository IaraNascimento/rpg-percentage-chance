import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ICalcResults, IStatistcs } from '../../services/simulator.service';

interface IResultsStatisticsComponent {
  statisticsFromDices: IStatistcs;
  statisticsFromResult: IStatistcs;
  results: ICalcResults;
}

@Component({
  selector: 'app-results-statistics',
  templateUrl: './results-statistics.component.html',
  styleUrl: './results-statistics.component.scss',
})
export class ResultsStatisticsComponent
  implements IResultsStatisticsComponent, AfterViewInit
{
  @Input() statisticsFromDices: IStatistcs = {};
  @Input() statisticsFromResult: IStatistcs = {};
  @Input() results: ICalcResults = {};

  ngAfterViewInit(): void {
    this.startsTabsFromMaterialize();
  }

  public startsTabsFromMaterialize(): void {
    const el = document.querySelectorAll('.tabs');
    M.Tabs.init(el, {});
  }
}
