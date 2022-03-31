import { formatNumber } from '@/utils/base';

export function getIntegerAndDecimal(value: number) {
    const valueStr = formatNumber(value, { isStrict: true });
    return valueStr.split('.');
}
