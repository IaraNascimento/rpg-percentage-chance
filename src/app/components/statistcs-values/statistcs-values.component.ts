import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { IStatistcs } from '../../services/simulator.service';

interface IStatistcsValuesComponent {
  statistics: IStatistcs;
}

@Component({
  selector: 'app-statistcs-values',
  templateUrl: './statistcs-values.component.html',
  styleUrl: './statistcs-values.component.scss',
})
export class StatistcsValuesComponent
  implements IStatistcsValuesComponent, OnInit, OnChanges
{
  @Input() statistics: IStatistcs = {};

  public rollsResults: Array<any> = [];
  public seeAllRolls: boolean = false;
  public seeMinificated: boolean = false;

  ngOnInit(): void {
    this.toggleViewResults(true);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.toggleViewResults(true);
  }

  public toggleViewResults(showHide: boolean): void {
    this.seeAllRolls = showHide;
    this.toggleViewMinificated(true, this.statistics.list);
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

  public toggleViewMinificated(
    showHide: boolean,
    list: Array<number> | undefined
  ): void {
    if (list) {
      if (showHide) {
        this.rollsResults = this.minifyData(
          JSON.parse(JSON.stringify(list)) as Array<number>
        );
      } else {
        this.rollsResults = JSON.parse(JSON.stringify(list));
      }
    }
    this.seeMinificated = showHide;
  }
}
