import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "./routeTree.gen.ts";

import "./styles.css";
import reportWebVitals from "./reportWebVitals.ts";
import { AuthProvider, useAuth } from "./shared/store/AuthProvider.tsx";
import { useEffect, useState } from "react";
import Loader from "./shared/components/Loader.tsx";

// Create a new router instance
const router = createRouter({
  routeTree,
  context: { auth: { isAuthenticated: false, checkAuth: async () => { return; } } },
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
  defaultErrorComponent: ({ error }) => {
    console.table(error);

    return <div>Error</div>;
  },
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}


function InnerApp() {
  const [isLoading, setIsLoading] = useState(true);
  const auth = useAuth();

  useEffect(() => {
    async function authenticate() {
      await auth.checkAuth();
      setIsLoading(false);
    }
    if (window.location.pathname === "/unreachable") {
      setIsLoading(false);
      return;
    }
    authenticate();
  }, []);

  return (
    <>
      {isLoading && (<Loader />)}
      {!isLoading && <RouterProvider
        router={router}
        context={{ auth: auth }}
      />}
    </>
  );
}
// Render the app
const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<AuthProvider>
    <InnerApp />
  </AuthProvider>);
}
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
