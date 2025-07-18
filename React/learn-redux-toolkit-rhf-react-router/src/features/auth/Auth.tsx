import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { login, logout } from "./authSlice";

export default function Auth() {
  const { username, id, loggedIn } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  return (
    <div>
      {loggedIn ? (
        <div>
          <p>username: {username}</p>
          <p>id: {id}</p>
          <button aria-label='log out' onClick={() => dispatch(logout())}>
            Logout
          </button>
        </div>
      ) : (
        <button aria-label='log in' onClick={() => dispatch(login({ username: "ovais", id: 43 }))}>
          Login
        </button>
      )}
    </div>
  );
}
