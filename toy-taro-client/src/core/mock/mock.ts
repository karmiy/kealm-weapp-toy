import { mockCheckInApi, mockCouponApi, mockOrderApi, mockProductApi, mockTaskApi } from './api';
import { MOCK_API_NAME } from './constants';

const mockApis: Record<MOCK_API_NAME, () => unknown> = Object.assign(
  {},
  mockProductApi,
  mockCouponApi,
  mockTaskApi,
  mockOrderApi,
  mockCheckInApi,
);

const DEFAULT_ENABLE_MOCK = true;

export function mock(options: { name: MOCK_API_NAME; enable?: boolean }) {
  return function (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
    const { name, enable = DEFAULT_ENABLE_MOCK } = options;
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: unknown[]) {
      if (enable) {
        return mockApis[name]();
      } else {
        return originalMethod.apply(this, args);
      }
    };
  };
}
