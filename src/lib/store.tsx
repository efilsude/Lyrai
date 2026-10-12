import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { EMPTY_PROFILE, type Profile, type TargetId, type Task } from "./career-data";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: "google" | "email";
}

interface State {
  user: User | null;
  target: TargetId | null;
  profile: Profile;
  analyzed: boolean;
  completed: string[];
  erasmusUniId: string | null;
  erasmusTasks: Task[];
  authModalOpen: boolean;
}

const KEY = "kariyerrota-v1";
const initial: State = {
  user: null,
  target: null,
  profile: EMPTY_PROFILE,
  analyzed: false,
  completed: [],
  erasmusUniId: null,
  erasmusTasks: [],
  authModalOpen: false,
};

interface Ctx extends State {
  ready: boolean;
  set: (patch: Partial<State>) => void;
  toggleTask: (id: string) => void;
  setErasmusPlan: (uniId: string | null, tasks: Task[]) => void;
  login: (user: User) => void;
  logout: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
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
          user: parsed.user || null,
          profile: { ...EMPTY_PROFILE, ...(parsed.profile || {}) },
          erasmusTasks: parsed.erasmusTasks || [],
          authModalOpen: false,
        });
      }
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) {
      // Don't persist temporary modal state
      const { authModalOpen, ...toPersist } = state;
      localStorage.setItem(KEY, JSON.stringify(toPersist));
    }
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
    login: (user) =>
      setState((s) => ({
        ...s,
        user,
        profile: {
          ...s.profile,
          name: s.profile.name || user.name,
        },
        authModalOpen: false,
      })),
    logout: () =>
      setState((s) => ({
        ...s,
        user: null,
      })),
    openAuthModal: () => setState((s) => ({ ...s, authModalOpen: true })),
    closeAuthModal: () => setState((s) => ({ ...s, authModalOpen: false })),
    reset: () => setState(initial),
  };

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useStore outside provider");
  return c;
}
