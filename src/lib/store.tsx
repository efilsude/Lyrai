import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { EMPTY_PROFILE, type Profile, type TargetId, type Task } from "./career-data";

interface State {
  target: TargetId | null;
  profile: Profile;
  analyzed: boolean;
  completed: string[];
  erasmusUniId: string | null;
  erasmusTasks: Task[];
}
const KEY = "kariyerrota-v1";
const initial: State = {
  target: null,
  profile: EMPTY_PROFILE,
  analyzed: false,
  completed: [],
  erasmusUniId: null,
  erasmusTasks: [],
};

interface Ctx extends State {
  ready: boolean;
  set: (patch: Partial<State>) => void;
  toggleTask: (id: string) => void;
  setErasmusPlan: (uniId: string | null, tasks: Task[]) => void;
  reset: () => void;
}
const StoreCtx = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setState({
          ...initial,
          ...parsed,
          profile: { ...EMPTY_PROFILE, ...(parsed.profile || {}) },
          erasmusTasks: parsed.erasmusTasks || [],
        });
      }
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
      setState((s) => ({
        ...s,
        completed: s.completed.includes(id) ? s.completed.filter((x) => x !== id) : [...s.completed, id],
      })),
    setErasmusPlan: (uniId, tasks) =>
      setState((s) => ({
        ...s,
        erasmusUniId: uniId,
        erasmusTasks: tasks,
      })),
    reset: () => setState(initial),
  };
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useStore outside provider");
  return c;
}
