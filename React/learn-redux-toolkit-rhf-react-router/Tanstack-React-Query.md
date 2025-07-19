# @tanstack/react-query

```sh
npm i @tanstack/react-query
npm i -D @tanstack/eslint-plugin-query
```

```typescript
import React from "react";
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getTodos, postTodo, TodoType } from "./my-api";

// Create a client
const queryClient = new QueryClient();

export default function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <Todos />
    </QueryClientProvider>
  );
}

function Todos() {
  // Access the client
  const queryClient = useQueryClient();

  // Queries
  const query = useQuery<TodoType[]>({
    queryKey: ["todos"],
    queryFn: getTodos,
  });

  // Mutations
  const mutation = useMutation({
    mutationFn: postTodo,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  return (
    <div>
      <ul>
        {query.data?.map((todo: TodoType) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>

      <button
        onClick={() => {
          mutation.mutate({
            id: Date.now(),
            title: "Do Laundry",
          });
        }}
      >
        Add Todo
      </button>
    </div>
  );
}
```

```typescript
// my-api.ts
export type TodoType = {
  id: number;
  title: string;
};

const todos: TodoType[] = [
  { id: 1, title: "HEllo World" },
  { id: 2, title: "World Hello" },
];

export async function getTodos(): Promise<TodoType[]> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return todos;
}

export async function postTodo(data: TodoType): Promise<TodoType> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  todos.push(data);
  return data;
}
```
