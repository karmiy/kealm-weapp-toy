import { OsModalProps } from 'ossaui';

type DialogConfig = Omit<OsModalProps, 'isShow'> & { id: string };
type Listener = (...args: unknown[]) => void;

class DialogManager {
  private _store = new Map<string, DialogConfig>();
  private _listeners = new Set<Listener>();

  getDialogConfigs() {
    return [...this._store.values()];
  }

  open(config: DialogConfig) {
    this._store.set(config.id, config);
    this._notify();
  }

  close(id: string) {
    this._store.delete(id);
    this._notify();
  }

  private _notify() {
    this._listeners.forEach(item => item());
  }

  subscribe(listener: Listener) {
    this._listeners.add(listener);

    return () => this._listeners.delete(listener);
  }
}

const dialogManager = new DialogManager();

export { dialogManager, DialogConfig };
