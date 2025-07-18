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
