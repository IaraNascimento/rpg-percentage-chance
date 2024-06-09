import { Component, EventEmitter, Input, Output } from '@angular/core';

interface ISwitchComponent {
  labelOn: string;
  labelOff: string;
  initialValue?: boolean;
  value: EventEmitter<boolean | null>;
}

@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  styleUrl: './switch.component.scss',
})
export class SwitchComponent implements ISwitchComponent {
  @Input() labelOn: string = '';
  @Input() labelOff: string = '';
  @Input() initialValue: boolean = false;

  @Output() value: EventEmitter<boolean | null> = new EventEmitter();

  public selectOpt(target: any): void {
    if (target) {
      this.value.emit(target.target.checked);
    }
  }
}
