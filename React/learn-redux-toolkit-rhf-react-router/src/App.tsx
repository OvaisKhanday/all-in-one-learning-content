import { NavLink, Outlet } from "react-router";

function App() {
  return (
    <div style={{ padding: "20px 50px" }}>
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
          <NavLink to='/products'>{({ isPending }) => (isPending ? "Loading" : "Products")}</NavLink>
        </li>
        <li>
          <NavLink to='/users'>Users</NavLink>
        </li>
      </ul>
      <Outlet />
    </div>
  );
}

export default App;
