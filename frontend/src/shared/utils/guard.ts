import { store } from "../store";
import { redirect } from "@tanstack/react-router";
import type { AccessTokenData } from "../type";

type GuardOptions = {
  authRequired?: boolean;
  guestOnly?: boolean;
  redirectTo?: string;
};

export function routeGuard(options: GuardOptions = {}) {
  const { authRequired, guestOnly, redirectTo = "/" } = options;
  const accessToken = store.token.get<AccessTokenData>("access-token");

  if (authRequired && !accessToken?.access_token) {
    throw redirect({ to: redirectTo });
  }

  if (guestOnly && accessToken) {
    throw redirect({ to: redirectTo });
  }

  return;
}
