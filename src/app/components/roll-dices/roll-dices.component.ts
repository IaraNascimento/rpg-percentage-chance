import { Component, OnInit } from '@angular/core';
import {
  IInformation,
  ICalcResults,
  SimulatorService,
  IStatistcs,
} from '../../services/simulator.service';
import { ISelectOption } from '../select/select.component';
import { dicesList } from '../../utils/utils';

@Component({
  selector: 'app-roll-dices',
  templateUrl: './roll-dices.component.html',
  styleUrl: './roll-dices.component.scss',
})
export class RollDicesComponent implements OnInit {
  public copyDicesList = JSON.parse(JSON.stringify(dicesList));

  public data: IInformation = {};
  public results: ICalcResults = {};
  public statistics: IStatistcs = {};

  public initialValues: IInformation = {
    rolls: 15000,
    max_main_die: 20,
    target: 11,
    modifier: 0,
    extra_dices: [],
    penault_dices: [],
    has_advantage: false,
    has_disadvantage: false,
    nat_max_auto_success: true,
    nat_min_auto_fail: true,
    success_is_bigger: true,
  };

  public defaulDie: ISelectOption = { value: -1, label: 'selecione' };

  constructor(public simulator: SimulatorService) {}

  ngOnInit(): void {
    this.defineData('rolls', this.initialValues.rolls);
    this.defineData('modifier', this.initialValues.modifier);
    this.defineData('target', this.initialValues.target);
    this.defineData('has_advantage', this.initialValues.has_advantage);
    this.defineData('has_disadvantage', this.initialValues.has_disadvantage);
    this.defineData(
      'nat_max_auto_success',
      this.initialValues.nat_max_auto_success
    );
    this.defineData('nat_min_auto_fail', this.initialValues.nat_min_auto_fail);
    this.defineData('success_is_bigger', this.initialValues.success_is_bigger);
    this.setDefaultDie(
      JSON.parse(JSON.stringify(dicesList)),
      this.initialValues.max_main_die as number
    );
  }

  public setDefaultDie(list: Array<ISelectOption>, dieValue: string | number) {
    const found: ISelectOption | undefined = list.find(
      (el) => el.value == dieValue
    );
    this.defaulDie = found ? found : this.defaulDie;
    this.defineData('max_main_die', dieValue);
  }

  public addExtraDie(): void {
    const copy = JSON.parse(JSON.stringify(dicesList));
    if (!this.data.extra_dices?.length) {
      this.data.extra_dices = [];
    }
    this.data.extra_dices?.push(copy[0]);
    this.defineData('extra_dices', this.data.extra_dices);
  }

  public addPenaultDie(): void {
    const copy = JSON.parse(JSON.stringify(dicesList));
    if (!this.data.penault_dices?.length) {
      this.data.penault_dices = [];
    }
    this.data.penault_dices?.push(copy[0]);
    this.defineData('penault_dices', this.data.penault_dices);
  }

  public removeExtraDices(): void {
    this.data.extra_dices = [];
    this.defineData('extra_dices', this.data.extra_dices);
  }

  public removePenaultDices(): void {
    this.data.penault_dices = [];
    this.defineData('penault_dices', this.data.penault_dices);
  }

  public redefineExtraDie(type: string, index: number, newValue: any) {
    if (type === 'extra' && this.data.extra_dices?.length) {
      this.data.extra_dices[index] = newValue;
      this.defineData('extra_dices', this.data.extra_dices);
    } else if (type === 'penault' && this.data.penault_dices?.length) {
      this.data.penault_dices[index] = newValue;
      this.defineData('penault_dices', this.data.penault_dices);
    }
  }

  public defineData(
    attr: string,
    value: any,
    num?: boolean,
    normalize?: boolean
  ): void {
    this.results = {};
    let normalizedValue = value;
    if (normalize) {
      normalizedValue = value.target.value;
    }
    if (num) {
      normalizedValue = Number(normalizedValue);
    }
    if (attr === 'max_main_die') {
      const newTarget = Math.floor(normalizedValue / 2) + 1;
      this.initialValues.target = newTarget;
      this.defineData('target', newTarget);
    }
    this.data = {
      ...this.data,
      ...({ [attr]: normalizedValue } as IInformation),
    };
  }

  public getDicesValues(
    positives: Array<ISelectOption> | undefined,
    negatives: Array<ISelectOption> | undefined
  ): Array<number> {
    let onlyValues: Array<number> = [];
    positives?.forEach((el) => {
      onlyValues.push(Number(el.value));
    });
    negatives?.forEach((el) => {
      onlyValues.push(-Number(el.value));
    });
    return onlyValues;
  }

  public calculate(dataValues: IInformation): void {
    let normalized: IInformation = {
      ...dataValues,
      extra: this.getDicesValues(
        dataValues.extra_dices,
        dataValues.penault_dices
      ),
    };
    this.results = this.simulator.multCalcRoll(normalized);
    this.statistics = this.simulator.calcStatistcs(normalized, this.results);
    this.scrollBottom();
  }

  public scrollBottom() {
    const element = document.querySelector('#destinationScroll');
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
