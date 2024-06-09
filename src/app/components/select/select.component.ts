import { NgFor } from '@angular/common';
import {
  Component,
  AfterViewInit,
  Input,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';
import M from 'materialize-css';

export interface ISelectOption {
  value: any;
  label: string;
  selected?: boolean;
}

interface ISelectComponent {
  options: Array<ISelectOption>;
  label: string;
  id: string;
  initialValue?: ISelectOption | undefined;
  selected: EventEmitter<ISelectOption>;
}

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
})
export class SelectComponent
  implements ISelectComponent, AfterViewInit, OnInit
{
  @Input() options: Array<ISelectOption> = [];
  @Input() label: string = '';
  @Input() id: string = '';
  @Input() initialValue: ISelectOption | undefined;

  @Output() selected: EventEmitter<ISelectOption> = new EventEmitter();

  public listOfOptions: Array<ISelectOption> = [];

  constructor() {}

  ngOnInit(): void {
    if (!this.initialValue) {
      this.initialValue = JSON.parse(JSON.stringify(this.options[0]));
    }
    console.log('again');
    this.setSelected(this.options, this.initialValue as ISelectOption);
  }

  ngAfterViewInit(): void {
    this.startsSelectFromMaterialize();
  }

  public startsSelectFromMaterialize(): void {
    var elems = document.querySelectorAll('select');
    M.FormSelect.init(elems, {});
    M.updateTextFields();
  }

  public setSelected(list: Array<ISelectOption>, choosen: ISelectOption) {
    this.listOfOptions = JSON.parse(JSON.stringify(list));
    const aux = this.listOfOptions.map((item) => {
      item.selected = false;
      if (item.value == choosen.value) {
        item.selected = true;
      }
      return item;
    });
    this.listOfOptions = aux;
  }

  public selectOpt(target: Event | null, list: Array<ISelectOption>): void {
    const copyList: Array<ISelectOption> = JSON.parse(JSON.stringify(list));
    const foundEl: ISelectOption | undefined = copyList.find(
      (item: ISelectOption) => item.value == (target?.target as any).value
    );
    if (foundEl) {
      this.setSelected(copyList, foundEl);
    }
    if (target && foundEl) {
      const foundSelected = JSON.parse(JSON.stringify(this.listOfOptions)).find(
        (item: ISelectOption) => item.selected
      );
      if (foundSelected) {
        this.selected.emit(foundSelected);
      }
    }
  }
}
