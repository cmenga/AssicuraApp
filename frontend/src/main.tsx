import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "./routeTree.gen.ts";

import "./styles.css";
import reportWebVitals from "./reportWebVitals.ts";
import { authApi } from "./shared/api/auth.service.ts";
import { store } from "./shared/store.ts";
import type { AccessTokenData } from "./shared/type.ts";

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {},
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
  defaultErrorComponent: ({ error }) => {
    console.table(error)
    
    return <div>Error</div>;
  }
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

try {
  const response = await authApi.post("/refresh")
  if (response.status === 200 && response.data.access_token) {
    store.token.set<AccessTokenData>("access-token",response.data)
  }
} catch { }

// Render the app
const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<RouterProvider router={router} />);
}
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
