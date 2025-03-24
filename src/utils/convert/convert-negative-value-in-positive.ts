export function parseNegativeValueToPositive(value: number) {
  if (value > 0) throw "not permited values positive";
  return -value;
}
