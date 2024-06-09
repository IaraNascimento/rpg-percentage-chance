import { Injectable } from '@angular/core';
import { ISelectOption } from '../components/select/select.component';

export interface IInformation {
  rolls?: number;
  max_main_die?: number; //Valor do dado principal (1d20 é o padrão), possibilidades: 4,6,8,10,12,20,100
  target?: number; //Dificuldade a ser alcançada, positivo/inteiro [0,100]
  modifier?: number; //Modificadores fixos somados, inteiro inf
  extra?: Array<number>; //Array de dados. Ex: [4, 4, -6] soma o resultado de 2d4 e subtrai o valor de 1d6 do total, array inteiro inf.
  extra_dices?: Array<ISelectOption>;
  penault_dices?: Array<ISelectOption>;
  has_advantage?: boolean; //Se valor for True, rola duas vezes e pega o maior resultado
  has_disadvantage?: boolean; //Se valor for False, rola duas vezes e pega o menor resultado
  nat_max_auto_success?: boolean; //Se true e o valor rolado (após verificação de vantagem e desvantagem) for o máximo do dado, sucesso automático
  nat_min_auto_fail?: boolean; //Se true e o valor rolado (após verificação de vantagem e desvantagem) for o mínimo do dado, falha automática
  success_is_bigger?: boolean; //Se true, o valor tem final tem que ser igual o maior para ser sucesso. Do contrário, tem que ser igual ou menor
}

export interface RollResult {
  success: boolean;
  finalValue: number;
  mainDie: number;
}

export interface ICalcResults {
  successes?: number;
  successPercentage?: number;
  critics?: number;
  criticPercentage?: number;
  criticsFail?: number;
  criticFailPercentage?: number;
  averageRoll?: number;
  standardDeviation?: number;
}

@Injectable({
  providedIn: 'root',
})
export class SimulatorService {
  constructor() {}

  public variance(values: Array<number>, mean: number): number {
    let varianceValue = 0;
    values.forEach((element) => {
      varianceValue += (element - mean) ** 2;
    });
    return varianceValue / (values.length - 1);
  }

  public die(max: number): number {
    return Math.floor(Math.random() * max) + 1;
  }

  public calcRoll(
    maxMainDie: number,
    target: number,
    modifier: number,
    extraDice: Array<number>,
    hasAdvantage: boolean,
    hasDisadvantage: boolean,
    natMaxAutoSuccess: boolean,
    natMinAutoFail: boolean,
    successIsBigger: boolean
  ): RollResult {
    let finalValue = modifier;
    let mainDie = this.die(maxMainDie);
    let success: boolean | null = null;

    // Verifica VANTAGEM ou DESVANTAGEM (troca de dado principal pelo secundário)
    const secondDie = this.die(maxMainDie);
    if (hasAdvantage && !hasDisadvantage && mainDie < secondDie) {
      mainDie = secondDie;
    } else if (hasDisadvantage && !hasAdvantage && mainDie > secondDie) {
      mainDie = secondDie;
    }

    // Sucesso crítico
    if (natMaxAutoSuccess && mainDie === maxMainDie) {
      success = true;
    }

    // Fracasso crítico
    if (natMinAutoFail && mainDie === 1) {
      success = false;
    }

    // O valor final que será comparado é a soma do dado principal e do modificador
    finalValue += mainDie;

    // Adiciona os dados extra positivos e negativos
    if (extraDice?.length) {
      for (let i = 0; i < extraDice.length; i++) {
        const extraDie = this.die(extraDice[i]);
        finalValue += extraDie;
      }
    }

    // Verifica o sucesso NÃO crítico (maior ou menor que o target/dificuldade)
    if (success === null) {
      if (successIsBigger) {
        success = finalValue >= target;
      } else {
        success = finalValue <= target;
      }
    }

    return { success, finalValue, mainDie };
  }

  public multCalcRoll(data: IInformation): ICalcResults {
    let amountOfSuccesses: number = 0;
    let amountOfCrits: number = 0;
    let criticsFail: number = 0;
    let finalValueAvg: number = 0;
    let finalValues: number[] = [];

    for (let i = 0; i < (data.rolls as number); i++) {
      const result = this.calcRoll(
        data.max_main_die as number,
        data.target as number,
        data.modifier as number,
        data.extra as Array<number>,
        data.has_advantage as boolean,
        data.has_disadvantage as boolean,
        data.nat_max_auto_success as boolean,
        data.nat_min_auto_fail as boolean,
        data.success_is_bigger as boolean
      );

      finalValueAvg += result.finalValue;
      finalValues.push(result.finalValue);

      if (result.mainDie === data.max_main_die) {
        amountOfCrits += 1;
      }

      if (result.mainDie === 1) {
        criticsFail += 1;
      }

      if (result.success) {
        amountOfSuccesses += 1;
      }
    }

    finalValueAvg = finalValueAvg / (data.rolls as number);
    const varianceValue = this.variance(finalValues, finalValueAvg);
    const stdDev = Math.sqrt(varianceValue);

    return {
      successes: amountOfSuccesses,
      successPercentage: amountOfSuccesses / (data.rolls as number),
      critics: amountOfCrits,
      criticPercentage: amountOfCrits / (data.rolls as number),
      criticsFail: criticsFail,
      criticFailPercentage: criticsFail / (data.rolls as number),
      averageRoll: finalValueAvg,
      standardDeviation: stdDev,
    };
  }
}
