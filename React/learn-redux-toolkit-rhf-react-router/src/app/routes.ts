import App from "../App";
import { createBrowserRouter } from "react-router";
import { Counter } from "../features/counter/Counter";
import Auth from "../features/auth/Auth";
import Products from "../features/products/Products";
import { productsLoader } from "../features/products/loader";
import Users from "../features/users/User";

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
      { path: "/users", Component: Users },
    ],
  },
]);
