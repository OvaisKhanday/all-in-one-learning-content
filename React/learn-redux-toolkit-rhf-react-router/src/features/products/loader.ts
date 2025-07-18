export interface ListI {
  id: number;
  title: string;
}

// export function productsLoader(): ListI[] {
//   return [
//     { id: 1, title: "hello" },
//     { id: 2, title: "world" },
//   ];
// }

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function productsLoader(): Promise<ListI[]> {
  console.log("Starting...");
  return delay(5000) // Delay for 5 seconds
    .then(() => {
      console.log("Waited 5 seconds");
      // Add code to be executed after the delay here
      return [
        { id: 1, title: "hello" },
        { id: 2, title: "world" },
      ];
    });
}
