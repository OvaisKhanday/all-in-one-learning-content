import { useLoaderData, useNavigation } from "react-router";
import type { ListI } from "./loader";

export default function Products() {
  const list: ListI[] = useLoaderData();
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);
  return (
    <div>
      {isNavigating ? (
        <h1>Loading...</h1>
      ) : (
        <ul>
          {list.map((l) => (
            <li key={l.id}>{l.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
