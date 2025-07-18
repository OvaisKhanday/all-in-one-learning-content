# React Concepts

## forwardRef

```typescript
import * as React from "react";
import "./style.css";

export default function App() {
  const ref = React.useRef<HTMLInputElement | null>(null);
  React.useEffect(() => {
    console.log(ref);
  }, [ref]);

  return (
    <div style={{ backgroundColor: "lightgreen", padding: "10px" }}>
      <h1>Parent Component</h1>
      <div style={{ padding: "4px 0px" }}>
        <button onClick={() => ref.current.focus()}>Focus</button>
        <button onClick={() => ref.current.blur()}>Blur</button>
        <button onClick={() => ref.current.setAttribute("disabled", "true")}>Disable</button>
        <button onClick={() => ref.current.removeAttribute("disabled")}>Enable</button>
        <button onClick={() => console.log(ref.current.value)}>Log Value</button>
      </div>
      <Child ref={ref} />
    </div>
  );
}

const Child = React.forwardRef<HTMLInputElement>(({}, ref) => {
  return (
    <div style={{ backgroundColor: "white", padding: "10px" }}>
      <h3>Child Component</h3>
      <input ref={ref} />
    </div>
  );
});
```

Output

<div id="root"><div style="background-color: lightgreen; padding: 10px;"><h1>Parent Component</h1><div style="padding: 4px 0px;"><button>Focus</button><button>Blur</button><button>Disable</button><button>Enable</button><button>Log Value</button></div><div style="background-color: white; padding: 10px;"><h3>Child Component</h3><input></div></div></div>
