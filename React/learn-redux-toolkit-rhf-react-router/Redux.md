# Learn @reduxjs/toolkit

Install dependencies

```sh
npm install @reduxjs/toolkit react-redux
```

Create a Redux Store

```typescript
// app/store.ts
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {},
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {counter: CounterState, auth: AuthState}
export type AppDispatch = typeof store.dispatch;
```

Provide the Redux Store to React

```typescript
// main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./app/store.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
```

Create a Redux State Slice

```typescript
// features/counter/counterSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface CounterState {
  value: number;
}

const initialState: CounterState = {
  value: 0,
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    }, // uses Immer under the hood
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;
```

Add Slice Reducers to the Store

```typescript
// app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {counter: CounterState}
export type AppDispatch = typeof store.dispatch;
```

Use Redux State and Actions in React Components

```typescript
// features/counter/Counter.tsx
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { decrement, increment } from "./counterSlice";

export function Counter() {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div>
      <div>
        <button aria-label='Increment value' onClick={() => dispatch(increment())}>
          Increment
        </button>
        <span>{count}</span>
        <button aria-label='Decrement value' onClick={() => dispatch(decrement())}>
          Decrement
        </button>
      </div>
    </div>
  );
}
```

Output

<body>
  <div>
    <button aria-label="Increment value" onclick="increment()">Increment</button>
    <span id="count">0</span>
    <button aria-label="Decrement value" onclick="decrement()">Decrement</button>
  </div>
  <script>
    function increment(){
      const countElement = document.getElementById('count')
      countElement.textContent = parseInt(countElement.textContent) + 1
    }
    function decrement(){
      const countElement = document.getElementById('count')
      countElement.textContent = parseInt(countElement.textContent) - 1
    }
  </script>
</body>

## Extras

Define Typed Hooks

```typescript
// app/hooks.ts
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
```

Use Typed Hooks in Components

```diff
// features/counter/Counter.tsx
- import { useDispatch, useSelector } from "react-redux";
- import type { RootState } from "../../app/store";
+ import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { decrement, increment } from "./counterSlice";

export function Counter() {
-  const count = useSelector((state: RootState) => state.counter.value);
+  const count = useAppSelector((state) => state.counter.value);
-  const dispatch = useDispatch();
+  const dispatch = useAppDispatch();

  return (
    <div>
      <div>
        <button aria-label='Increment value' onClick={() => dispatch(increment())}>
          Increment
        </button>
        <span>{count}</span>
        <button aria-label='Decrement value' onClick={() => dispatch(decrement())}>
          Decrement
        </button>
      </div>
    </div>
  );
}
```
