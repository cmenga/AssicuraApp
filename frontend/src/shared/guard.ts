import { store } from "./model/store";
import { redirect } from "@tanstack/react-router";
import type { AccessTokenData } from "./type";

type GuardOptions = {
  authRequired?: boolean;
  guestOnly?: boolean;
  redirectTo?: string;
};

export function routeGuard(options: GuardOptions = {}) {
  const { authRequired, guestOnly, redirectTo = "/" } = options;
  const accessToken = store.token.get<AccessTokenData>("access-token");

  if (authRequired && !accessToken) {
    // la rotta richiede autenticazione
    throw redirect({ to: redirectTo });
  }

  if (guestOnly && accessToken) {
    // la rotta è solo per guest
    throw redirect({ to: redirectTo });
  }

  // tutto ok, si può accedere alla rotta
  return;
}
