import { ComponentClass } from 'react';

export type PickPartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type PickerComponentProps<T> = T extends ComponentClass<infer P> ? P : never;
