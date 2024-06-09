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
    this.listOfOptions = JSON.parse(JSON.stringify(this.options));
    if (!this.initialValue) {
      this.initialValue = JSON.parse(JSON.stringify(this.listOfOptions[0]));
    }
    this.listOfOptions.map((el) => {
      if (el.value == this.initialValue?.value) {
        el.selected = true;
      }
      return el;
    });
  }

  ngAfterViewInit(): void {
    this.startsSelectFromMaterialize();
  }

  public startsSelectFromMaterialize(): void {
    var elems = document.querySelectorAll('select');
    M.FormSelect.init(elems, {});
    M.updateTextFields();
  }

  public sendSelected(event: Event, list: Array<ISelectOption>): void {
    const value = (event?.target as any).value;
    let selectedItem: ISelectOption = this.initialValue as ISelectOption;
    const found = list.find((el) => el.value == value);
    if (found) {
      selectedItem = found;
    }
    this.selected.emit(selectedItem);
  }
}
