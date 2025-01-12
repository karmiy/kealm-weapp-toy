import { useState } from 'react';
import { Undefinable } from '@shared/types';
import { useConsistentFunc } from './useConsistentFunc';

type SetValue<T> = (v: T) => void;

function useValue<T>(options: {
  defaultValue?: T;
  value: T;
  onChange?: (v: T) => void;
}): [T, SetValue<T>];
function useValue<T>(options: {
  defaultValue: T;
  value?: T;
  onChange?: (v: T) => void;
}): [T, SetValue<T>];
function useValue<T>(options: {
  defaultValue?: T;
  value?: T;
  onChange?: (v: Undefinable<T>) => void;
}): [Undefinable<T>, SetValue<T>];
function useValue<T>(options: { value?: T; defaultValue?: T; onChange?: (v: T) => void }) {
  const { value: _value, defaultValue, onChange } = options;
  const [innerValue, setInnerValue] = useState<Undefinable<T>>(_value ?? defaultValue);
  const value = _value ?? innerValue;

  const setValue = useConsistentFunc((v: T) => {
    if (v === value) return;
    setInnerValue(v);
    onChange?.(v);
  });

  return [value, setValue] as const;
}

export { useValue };
