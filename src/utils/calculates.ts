/**
 *
 * @param value valor que será dividio
 * @param installments quantidade de pacelas
 * @returns retorna um array com a quantidade de parcelas definidas
 */
export function breakValueInInstallments(
  value: number,
  installments: number
): number[] {
  const price = divideIntoInstallments(value, installments);

  const values = generateArrayValue(price, installments);

  const sumArrayValues = sumValuesArray(values);

  if (sumArrayValues === value) return values;

  // Verifica se possui valor restante
  const diff = getDifferenceInTwoValues(sumArrayValues, value);

  // setando o valor da diferença na primeira parcela
  //values[0] = values[0] + diff;

  return redistributeRemainderInInstallments(diff, values);
}

/**
 * Divide o valor pelas quantidades de parcelas
 * @param value valor que será dividio
 * @param installments quantidade de pacelas
 * @returns  retorna um int
 */
function divideIntoInstallments(value: number, installments: number): number {
  return Math.floor(value / installments);
}

/**
 * Quebra o valor passado em parcelas
 * @param value valor a ser adicionar no array
 * @param installments quantidade de items no array
 * @returns retorna array de valores
 */
function generateArrayValue(value: number, installments: number): number[] {
  const array = [];

  for (let index = 0; index < installments; index++) {
    array.push(value);
  }

  return array;
}

/**
 * Soma todos os valores passados no array
 * @param values array de números
 * @returns retorna o valor da soma
 */
export function sumValuesArray(values: number[]): number {
  return values.reduce((x, y) => x + y);
}

/**
 * Obter doferença entre dois valores
 * @param a valor
 * @param b valor
 * @returns retorna a diferença
 */
export function getDifferenceInTwoValues(a: number, b: number): number {
  return Math.abs(a - b);
}

/**
 * Redistribui o valor entra as parcelas
 * @param diff valor do resto a ser redistribuido
 * @param values array com valores para receber a resdistribuição
 */
export function redistributeRemainderInInstallments(
  diff: number,
  values: number[]
): number[] {
  const valuesArray = [...values];

  for (let index = diff; index > 0; index--) {
    valuesArray[diff - index] += 1;
  }

  return valuesArray;
}

export function percentageComissionValue(
  value: number,
  percentageCommission: number
): number {
  const totalPercentageCommission = percentageCommission;
  const comission = value * (totalPercentageCommission / 100);

  return Math.round(comission);
}
