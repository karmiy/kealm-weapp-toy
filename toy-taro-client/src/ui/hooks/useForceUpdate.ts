import { useCallback, useState } from 'react';

export function useForceUpdate() {
  const setState = useState(0)[1];
  return useCallback(() => setState(x => x + 1), [setState]);
}
