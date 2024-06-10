import { AfterViewInit, Component, Input } from '@angular/core';
import {
  ICalcResults,
  IInformation,
  IStatistcs,
} from '../../services/simulator.service';

interface IResultsComponent {
  parameters: IInformation;
  results: ICalcResults;
  statisticsFromDices: IStatistcs;
}

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss',
})
export class ResultsComponent implements IResultsComponent, AfterViewInit {
  @Input() parameters: IInformation = {};
  @Input() results: ICalcResults = {};
  @Input() statisticsFromDices: IStatistcs = {};

  public rollsResults: Array<any> = [];
  public seeAllRolls: boolean = false;
  public seeMinificated: boolean = false;

  ngAfterViewInit(): void {
    this.startsTabsFromMaterialize();
  }

  public startsTabsFromMaterialize(): void {
    const el = document.querySelectorAll('.tabs');
    M.Tabs.init(el, {});
  }
}
