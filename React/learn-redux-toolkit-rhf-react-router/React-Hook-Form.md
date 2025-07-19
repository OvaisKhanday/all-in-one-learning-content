# Learn react-hook-form

Form Data without `react-hook-form`

```typescript
type GenderEnum = "female" | "male" | "other";

interface IFormInput {
  firstName: string;
  gender: GenderEnum;
}

export default function Users() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data: IFormInput = {
      firstName: formData.get("firstName") as string,
      gender: formData.get("gender") as GenderEnum,
    };
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>First Name</label>
      <input name='firstName' />
      <br />
      <label>Gender Selection</label>
      <select name='gender'>
        <option value='male'>male</option>
        <option value='female'>female</option>
        <option value='other'>other</option>
      </select>
      <input type='submit' />
    </form>
  );
}
```

**Using `react-hook-form`**

Installation

```sh
npm install react-hook-form
```

Refactoring the previous code

```diff
+import { useForm, type SubmitHandler } from "react-hook-form";

type GenderEnum = "female" | "male" | "other";

interface IFormInput {
  firstName: string;
  gender: GenderEnum;
}

export default function App() {
-  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
-    event.preventDefault();
-    const formData = new FormData(event.currentTarget);
-    const data: IFormInput = {
-      firstName: formData.get("firstName") as string,
-      gender: formData.get("gender") as GenderEnum,
-    };
-    console.log(data);
-  }
+  const { register, handleSubmit } = useForm<IFormInput>();
+  const onSubmit: SubmitHandler<IFormInput> = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>First Name</label>
-      <input name='firstName' />
+      <input {...register("firstName")} />
      <br />
      <label>Gender Selection</label>
-      <select name="gender">
+      <select {...register("gender")}>
        <option value='female'>female</option>
        <option value='male'>male</option>
        <option value='other'>other</option>
      </select>
      <input type='submit' />
    </form>
  );
}
```

Basic Validations and Error showing

```typescript
import { useForm, type SubmitHandler } from "react-hook-form";

type GenderEnum = "female" | "male" | "other";

interface IFormInput {
  firstName: string;
  gender: GenderEnum;
  evenNumber: number;
}

export default function App() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<IFormInput>({});
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      await new Promise((res) => setTimeout(res, 3000));
      console.log(data);
      throw new Error("user threw error");
    } catch (error) {
      console.error(error);
      setError("firstName", {
        message: "username already taken",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>First Name</label>
      <input
        {...register("firstName", {
          required: "name is important and required",
          minLength: { value: 8, message: "Name cannot be less than 8 characters long" },
        })}
      />
      <p className='form-invalid-input-message'>{errors?.firstName?.message}</p>
      <label>Gender Selection</label>
      <select {...register("gender")}>
        <option value='female'>female</option>
        <option value='male'>male</option>
        <option value='other'>other</option>
      </select>
      <p className='form-invalid-input-message'>{errors?.gender?.message}</p>
      <label>Enter an even number</label>
      <input
        type='number'
        {...register("evenNumber", {
          valueAsNumber: true,
          required: { value: true, message: "This filed is compulsory" },
          validate: (value) => (value % 2 == 0 ? true : "need an even number"),
        })}
      />
      <p className='form-invalid-input-message'>{errors.evenNumber?.message}</p>
      <button disabled={isSubmitting} type='submit'>
        {isSubmitting ? "Loading..." : "Submit"}
      </button>
    </form>
  );
}
```

Zod validations

```sh
npm install zod @hookform/resolvers
```

```typescript
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z.email({ error: "not a valid email address" }),
  password: z.string().min(8, { error: "password should at least be 8 characters long" }),
  username: z
    .string()
    .min(8, { error: "username should be at least 8 characters long" })
    .regex(/^[a-zA-Z0-9_]+$/, { error: "username must contains only letters, digits and underscore" }),
  firstName: z.string().min(1, { error: "First Name is required" }),
  lastName: z.string().min(1, { error: "Last Name is required" }),
  gender: z.enum(["male", "female", "other"], { error: "must be male, female or other" }),
  age: z.number({ error: "enter valid number" }).gt(10, { error: "age must be greater than 10" }).lt(100, { error: "age must be lesser than 100" }),
  anEvenNumber: z.number({ error: "enter a valid number" }).refine((v) => v % 2 === 0, { error: "number should be an even" }),
});

type FormInputType = z.infer<typeof schema>;

export default function App() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInputType>({ resolver: zodResolver(schema) });
  const onSubmit: SubmitHandler<FormInputType> = async (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>First Name</label>
      <input {...register("firstName")} />
      <p className='form-invalid-input-message'>{errors?.firstName?.message}</p>
      <label>Last Name</label>
      <input {...register("lastName")} />
      <p className='form-invalid-input-message'>{errors?.lastName?.message}</p>
      <label>Email</label>
      <input type='email' {...register("email")} />
      <p className='form-invalid-input-message'>{errors?.email?.message}</p>
      <label>Password</label>
      <input type='password' {...register("password")} />
      <p className='form-invalid-input-message'>{errors?.password?.message}</p>
      <label>username</label>
      <input {...register("username")} />
      <p className='form-invalid-input-message'>{errors?.username?.message}</p>
      <label>Gender Selection</label>
      <select {...register("gender")}>
        <option value='female'>female</option>
        <option value='male'>male</option>
        <option value='other'>other</option>
      </select>
      <p className='form-invalid-input-message'>{errors?.gender?.message}</p>
      <label>Enter age</label>
      <input type='number' {...register("age", { valueAsNumber: true })} />
      <p className='form-invalid-input-message'>{errors.age?.message}</p>
      <label>Enter an even number</label>
      <input type='number' {...register("anEvenNumber", { valueAsNumber: true })} />
      <p className='form-invalid-input-message'>{errors.anEvenNumber?.message}</p>
      <button disabled={isSubmitting} type='submit'>
        {isSubmitting ? "Loading..." : "Submit"}
      </button>
      <p className='form-invalid-input-message'>{errors.root?.message}</p>
    </form>
  );
}
```

Field Array

```typescript
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z.email({ error: "not a valid email address" }),
  password: z.string().min(8, { error: "password should at least be 8 characters long" }),
  username: z
    .string()
    .min(8, { error: "username should be at least 8 characters long" })
    .regex(/^[a-zA-Z0-9_]+$/, { error: "username must contains only letters, digits and underscore" }),
  firstName: z.string().min(1, { error: "First Name is required" }),
  lastName: z.string().min(1, { error: "Last Name is required" }),
  gender: z.enum(["male", "female", "other"], { error: "must be male, female or other" }),
  age: z.number({ error: "enter valid number" }).gt(10, { error: "age must be greater than 10" }).lt(100, { error: "age must be lesser than 100" }),
  anEvenNumber: z.number({ error: "enter a valid number" }).refine((v) => v % 2 === 0, { error: "number should be an even" }),
  items: z
    .object({
      name: z.string({ error: "item name is required" }).min(1, { error: "Item name is required" }),
      price: z.number({ error: "item price is required" }).min(1, { error: "Item price is required" }),
    })
    .array(),
});

type FormInputType = z.infer<typeof schema>;

export default function App() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormInputType>({ resolver: zodResolver(schema) });
  const { fields, append, remove } = useFieldArray({ control: control, name: "items" });
  const items = useWatch({ control, name: "items" });
  const onSubmit: SubmitHandler<FormInputType> = async (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>First Name</label>
      <input {...register("firstName")} />
      <p className='form-invalid-input-message'>{errors?.firstName?.message}</p>
      <label>Last Name</label>
      <input {...register("lastName")} />
      <p className='form-invalid-input-message'>{errors?.lastName?.message}</p>
      <label>Email</label>
      <input type='email' {...register("email")} />
      <p className='form-invalid-input-message'>{errors?.email?.message}</p>
      <label>Password</label>
      <input type='password' {...register("password")} />
      <p className='form-invalid-input-message'>{errors?.password?.message}</p>
      <label>username</label>
      <input {...register("username")} />
      <p className='form-invalid-input-message'>{errors?.username?.message}</p>
      <label>Gender Selection</label>
      <select {...register("gender")}>
        <option value='female'>female</option>
        <option value='male'>male</option>
        <option value='other'>other</option>
      </select>
      <p className='form-invalid-input-message'>{errors?.gender?.message}</p>
      <label>Enter age</label>
      <input type='number' {...register("age", { valueAsNumber: true })} />
      <p className='form-invalid-input-message'>{errors.age?.message}</p>
      <label>Enter an even number</label>
      <input type='number' {...register("anEvenNumber", { valueAsNumber: true })} />
      <p className='form-invalid-input-message'>{errors.anEvenNumber?.message}</p>
      {fields.map((field, index) => (
        <section key={field.id}>
          <input type='text' {...register(`items.${index}.name` as const)} placeholder='Enter item name' />
          <input type='number' {...register(`items.${index}.price` as const, { valueAsNumber: true })} placeholder='Enter item price' />
          <button
            onClick={() => {
              remove(index);
            }}
          >
            Delete
          </button>
          <p className='form-invalid-input-message'>{errors.items?.[index]?.name?.message}</p>
          <p className='form-invalid-input-message'>{errors.items?.[index]?.price?.message}</p>
        </section>
      ))}
      <button
        onClick={() => {
          append({ name: "", price: 0 });
        }}
      >
        Add New Item
      </button>
      <h2>Total: {items?.reduce((acc, item) => acc + (Number.isNaN(item.price) ? 0 : item.price), 0)}</h2>
      <button disabled={isSubmitting} type='submit'>
        {isSubmitting ? "Loading..." : "Submit"}
      </button>
      <p className='form-invalid-input-message'>{errors.root?.message}</p>
    </form>
  );
}
```
