import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";


interface AuthContext {
  isAuthenticated: boolean;
  checkAuth: () => Promise<void>;
}
interface RouterContext {
  auth: AuthContext 
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <Outlet />
    </>
  ),
});
