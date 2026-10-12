import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { EMPTY_PROFILE, type Profile, type TargetId } from "./career-data";

interface State {
  target: TargetId | null;
  profile: Profile;
  analyzed: boolean;
  completed: string[];
}
const KEY = "kariyerrota-v1";
const initial: State = { target: null, profile: EMPTY_PROFILE, analyzed: false, completed: [] };

interface Ctx extends State {
  ready: boolean;
  set: (patch: Partial<State>) => void;
  toggleTask: (id: string) => void;
  reset: () => void;
}
const StoreCtx = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...initial, ...JSON.parse(raw) });
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(state));
  }, [state, ready]);
  const value: Ctx = {
    ...state,
    ready,
    set: (patch) => setState((s) => ({ ...s, ...patch })),
    toggleTask: (id) =>
      setState((s) => ({ ...s, completed: s.completed.includes(id) ? s.completed.filter((x) => x !== id) : [...s.completed, id] })),
    reset: () => setState(initial),
  };
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useStore outside provider");
  return c;
}
