export const WITHHOLDING = {
  incomeTaxRate: 0.03,
  localIncomeTaxRate: 0.003,
  totalRate: 0.033,
} as const;

export type TaxResult = {
  gross: number;
  incomeTax: number;
  localIncomeTax: number;
  totalTax: number;
  net: number;
};

const clampWon = (value: number) => Math.max(0, Math.floor(Number.isFinite(value) ? value : 0));

export function calculateFromGross(grossInput: number): TaxResult {
  const gross = clampWon(grossInput);
  const incomeTax = Math.floor(gross * WITHHOLDING.incomeTaxRate);
  const localIncomeTax = Math.floor(incomeTax * 0.1);
  const totalTax = incomeTax + localIncomeTax;

  return {
    gross,
    incomeTax,
    localIncomeTax,
    totalTax,
    net: gross - totalTax,
  };
}

export function calculateFromNet(netInput: number): TaxResult {
  const targetNet = clampWon(netInput);
  if (targetNet === 0) return calculateFromGross(0);

  let gross = Math.ceil(targetNet / (1 - WITHHOLDING.totalRate));
  let result = calculateFromGross(gross);

  while (result.net < targetNet) {
    gross += 1;
    result = calculateFromGross(gross);
  }

  while (gross > 0) {
    const previous = calculateFromGross(gross - 1);
    if (previous.net < targetNet) break;
    gross -= 1;
    result = previous;
  }

  return result;
}

export function formatWon(value: number) {
  return `${Math.floor(value).toLocaleString('ko-KR')}원`;
}
