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
  allValues?: Array<number>;
}

export interface IStatistcs {
  sum?: number;
  mean?: number;
  desvPad?: number;
  mediam?: number;
  mode?: Array<number>;
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
    let finalValues: Array<number> = [];

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

    return {
      successes: amountOfSuccesses,
      successPercentage: amountOfSuccesses / (data.rolls as number),
      critics: amountOfCrits,
      criticPercentage: amountOfCrits / (data.rolls as number),
      criticsFail: criticsFail,
      criticFailPercentage: criticsFail / (data.rolls as number),
      allValues: finalValues,
    };
  }

  public calcSum(list: Array<number>): number {
    return list.length
      ? list.reduce((total, currentValue) => total + currentValue, 0)
      : 0;
  }

  public calcMean(sum: number, total: number): number {
    return sum / total;
  }

  public calcDesvPad(mean: number, list: Array<number>): number {
    const squaredDifferences = list.map((num) => Math.pow(num - mean, 2));
    const averageSquaredDifference = this.calcMean(
      this.calcSum(squaredDifferences),
      list.length
    );
    return Math.sqrt(averageSquaredDifference);
  }

  public calcMediam(list: Array<number>): number {
    const sortedList = list.slice().sort((a, b) => a - b);
    const middleIndex = Math.floor(sortedList.length / 2);

    if (sortedList.length % 2 !== 0) {
      return sortedList[middleIndex];
    } else {
      return (sortedList[middleIndex - 1] + sortedList[middleIndex]) / 2;
    }
  }

  public calcMode(list: Array<number>): Array<number> {
    const frequencyMap: { [key: number]: number } = {};
    list.forEach((num) => {
      if (frequencyMap[num]) {
        frequencyMap[num]++;
      } else {
        frequencyMap[num] = 1;
      }
    });

    let maxFrequency = 0;
    for (const key in frequencyMap) {
      if (frequencyMap[key] > maxFrequency) {
        maxFrequency = frequencyMap[key];
      }
    }

    const modes: Array<number> = [];
    for (const key in frequencyMap) {
      if (frequencyMap[key] === maxFrequency) {
        modes.push(Number(key));
      }
    }

    return modes;
  }

  public calcStatistcs(data: IInformation, results: ICalcResults): IStatistcs {
    const sum: number = this.calcSum(
      results.allValues?.length ? results.allValues : [0]
    );
    const mean: number = this.calcMean(sum, data.rolls ? data.rolls : 1);
    const desvPad: number = this.calcDesvPad(
      mean,
      results.allValues?.length ? results.allValues : [0]
    );
    const mediam: number = this.calcMediam(
      results.allValues?.length ? results.allValues : [0]
    );
    const mode: Array<number> = this.calcMode(
      results.allValues?.length ? results.allValues : [0]
    );

    return { sum, mean, desvPad, mediam, mode };
  }
}
