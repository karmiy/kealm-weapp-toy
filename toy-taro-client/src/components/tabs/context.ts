import { createContext } from 'react';

interface TabsContextProp {
  classes?: {
    headerContainer?: string;
    headerItem?: string;
  };
  current: number;
  variant: 'text' | 'contained';
  mode: 'vertical' | 'horizontal';
}

export const TabsContext = createContext<TabsContextProp>({
  current: 0,
  variant: 'text',
  mode: 'horizontal',
});
