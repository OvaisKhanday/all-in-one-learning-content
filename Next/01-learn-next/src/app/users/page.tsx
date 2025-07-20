"use client";

import { delay } from "@/lib/delay";

export default function User({}) {
  return (
    <form action={(_) => delay(5000)}>
      <input name='name' />
      <button className='bg-red-300' formAction={() => delay(2000)}>
        Submit
      </button>
    </form>
  );
}
