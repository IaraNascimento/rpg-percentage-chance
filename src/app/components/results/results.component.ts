import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  ICalcResults,
  IInformation,
  IStatistcs,
} from '../../services/simulator.service';

interface IResultsComponent {
  parameters: IInformation;
  results: ICalcResults;
  statistics: IStatistcs;
}

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss',
})
export class ResultsComponent
  implements IResultsComponent, AfterViewInit, OnChanges
{
  @Input() parameters: IInformation = {};
  @Input() results: ICalcResults = {};
  @Input() statistics: IStatistcs = {};

  public rollsResults: Array<any> = [];

  public seeAllRolls: boolean = false;
  public seeMinificated: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    this.toggleViewMinificated(false);
  }

  ngAfterViewInit(): void {
    this.startsTabsFromMaterialize();
  }

  public startsTabsFromMaterialize(): void {
    const el = document.querySelectorAll('.tabs');
    M.Tabs.init(el, {});
  }

  public toggleViewResults(showHide: boolean): void {
    this.seeAllRolls = showHide;
    this.toggleViewMinificated(false);
  }

  public minifyData(list: Array<any>): Array<any> {
    const frequency: Array<{ value: number; quantity: number }> = [];

    list.forEach((num: any) => {
      const indexFound = frequency.findIndex((el) => el.value === num);
      if (indexFound >= 0) {
        frequency[indexFound].quantity++;
      } else {
        frequency.push({ value: num, quantity: 1 });
      }
    });

    return frequency.sort((a, b) => a.value - b.value);
  }

  public toggleViewMinificated(showHide: boolean): void {
    if (showHide) {
      this.rollsResults = this.minifyData(
        JSON.parse(JSON.stringify(this.results.allValues)) as Array<number>
      );
    } else {
      this.rollsResults = JSON.parse(JSON.stringify(this.results.allValues));
    }
    this.seeMinificated = showHide;
  }
}
