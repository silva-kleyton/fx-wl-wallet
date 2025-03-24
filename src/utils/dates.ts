import { addDays, addMonths, endOfYesterday, startOfYesterday } from "date-fns";

export interface IPaymentDate {
  value: number;
  date: Date;
}

/**
 * Cria um array com os valores e datas que serão adicionada a wallet
 * @param payments recebe o array das parcelas do pagamento
 * @param date recebe a data que está sendo realizado o evento
 * @returns
 */
export function paymentDate(payments: number[], date: Date): IPaymentDate[] {
  const array: IPaymentDate[] = [];

  for (let index = 0; index < payments.length; index++) {
    array.push({
      value: payments[index],
      date: addDays(date, index * 30),
    });
  }

  return array;
}
