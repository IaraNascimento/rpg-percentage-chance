import { BrowserModule } from '@angular/platform-browser';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  NgModule,
} from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { AppComponent } from './app.component';
import { SelectComponent } from './components/select/select.component';
import { SwitchComponent } from './components/switch/switch.component';
import { ResultsComponent } from './components/results/results.component';
import { SimulatorService } from './services/simulator.service';

@NgModule({
  declarations: [
    AppComponent,
    SelectComponent,
    SwitchComponent,
    ResultsComponent,
  ],
  imports: [BrowserModule, CommonModule, FormsModule, RouterOutlet, NgFor],
  providers: [SimulatorService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
