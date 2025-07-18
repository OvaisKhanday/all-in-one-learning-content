# Learn React Router

## Data Mode

Installation

```sh
npm i react-router
```

**Create a Router and Render**
Create a router and pass it to RouterProvider:

```diff
// main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
+import { Provider } from "react-redux";
import { store } from "./app/store.ts";
+import { createBrowserRouter, RouterProvider } from "react-router";

+const router = createBrowserRouter([
+  {
+    path: "/",
+    element: <App />,
+  },
+  {
+    path: "/about",
+    element: <p>About</p>,
+  },
+]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
+      <RouterProvider router={router} />
-      <App/>
    </Provider>
  </StrictMode>
);
```

Refactor `router` into `app/routes.ts` and add `loader` for `Products` component.

```typescript
// app/routes.ts
import App from "../App";
import { createBrowserRouter } from "react-router";
import { Counter } from "../features/counter/Counter";
import Auth from "../features/auth/Auth";
import Products from "../features/products/Products";
import { productsLoader } from "../features/products/loader";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      { path: "/counter", Component: Counter },
      { path: "/auth", Component: Auth },
      {
        path: "/products",
        loader: productsLoader,
        Component: Products,
      },
    ],
  },
]);

// features/products/Products.tsx
import { useLoaderData } from "react-router";
import type { ListI } from "./loader";

export default function Products() {
  const list: ListI[] = useLoaderData();
  return (
    <div>
      <ul>
        {list.map((l) => (
          <li key={l.id}>{l.title}</li>
        ))}
      </ul>
    </div>
  );
}

// features/products/loader.ts
export interface ListI {
  id: number;
  title: string;
}

export function productsLoader(): ListI[] {
  return [
    { id: 1, title: "hello" },
    { id: 2, title: "world" },
  ];
}

// App.tsx
import { NavLink, Outlet } from "react-router";

function App() {
  return (
    <>
      <h1>Hello World!</h1>
      <ul>
        <li>
          <NavLink to='/'>Home</NavLink>
        </li>
        <li>
          <NavLink to='/counter'>Counter</NavLink>
        </li>
        <li>
          <NavLink to='/auth'>Auth</NavLink>
        </li>
        <li>
          <NavLink to='/products'>Products</NavLink>
        </li>
      </ul>
      <Outlet />
    </>
  );
}

export default App;
```
