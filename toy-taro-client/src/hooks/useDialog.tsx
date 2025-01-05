import { useEffect, useState } from 'react';
import { OsModal } from 'ossaui';
import type { DialogConfig } from '@/manager';
import { dialogManager } from '@/manager';

function useDialog() {
  const [configs, setConfigs] = useState<DialogConfig[]>(dialogManager.getDialogConfigs());
  console.log('[test] dialog', configs);

  useEffect(() => {
    const unsubscribe = dialogManager.subscribe(() => {
      setConfigs(dialogManager.getDialogConfigs());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return configs.map(config => {
    const { id, onCancel, onClose, onConfirm, ...rest } = config;
    return (
      <OsModal
        key={config.id}
        isShow
        {...rest}
        onCancel={() => {
          onCancel?.();
          dialogManager.close(id);
        }}
        onClose={() => {
          onClose?.();
          dialogManager.close(id);
        }}
        onConfirm={() => {
          onConfirm?.();
          dialogManager.close(id);
        }}
      />
    );
  });
}

export { useDialog };
