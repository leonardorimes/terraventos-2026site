import { createContext, useContext } from 'react';

export type AppShellContextValue = {
  previousPath: string;
  transitionNavigate: (path: string) => void;
};

export const AppShellCtx = createContext<AppShellContextValue>({
  previousPath: '/',
  transitionNavigate: () => {},
});

/** Acesso, a partir de páginas roteadas, ao "voltar para" e ao navigate com animação de transição. */
export function useAppShellContext(): AppShellContextValue {
  return useContext(AppShellCtx);
}
