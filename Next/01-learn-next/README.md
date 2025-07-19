# Learn Next.js

Installation

```sh
npx create-next-app@latest
```

## Project Structure

### Top-level folders

Top-level folders are used to organize your application's code and static assets.

- **app** : App Router
- **pages** : Pages Router
- **public** : Static assets to be served
- **src** : Optional application source folder

### Top-level files

Top-level files are used to configure your application, manage dependencies, run middleware, integrate monitoring tools, and define environment variables.

- **next.config.js** : Configuration file for Next.js
- **package.json** : Project dependencies and scripts
- **instrumentation.ts** : OpenTelemetry and Instrumentation file
- **middleware.ts** : Next.js request middleware
- **.env** : Environment variables
- **.env.local** : Local environment variables
- **.env.production** : Production environment variables
- **.env.development** : Development environment variables
- **.eslintrc.json** : Configuration file for ESLint
- **.gitignore** : Git files and folders to ignore
- **next-env.d.ts** : TypeScript declaration file for Next.js
- **tsconfig.json** : Configuration file for TypeScript
- **jsconfig.json** : Configuration file for JavaScript

### Routing Files

| File Name    | Extension       | Purpose                      |
| ------------ | --------------- | ---------------------------- |
| layout       | .js, .jsx, .tsx | Layout                       |
| page         | .js, .jsx, .tsx | Page                         |
| loading      | .js, .jsx, .tsx | Loading UI                   |
| not-found    | .js, .jsx, .tsx | Not found UI                 |
| error        | .js, .jsx, .tsx | Error UI                     |
| global-error | .js, .jsx, .tsx | Global error UI              |
| route        | .js, .ts        | API endpoint                 |
| template     | .js, .jsx, .tsx | Re-rendered layout           |
| default      | .js, .jsx, .tsx | Parallel route fallback page |

### Nested routes

- `folder` : Route segment
- `folder/folder` : Nested route segment

### Dynamic routes

- `[folder]` : Dynamic route segment
- `[...folder]` : Catch-all route segment
- `[[...folder]]` : Optional catch-all route segment

### Route Groups and private folders

- `(folder)` Group routes without affecting routing
- `_folder` Opt folder and all child segments out of routing

### Parallel and Intercepted Routes

- `@folder` Named slot
- `(.)folder` Intercept same level
- `(..)folder` Intercept one level above
- `(..)(..)folder` Intercept two levels above
- `(...)folder` Intercept from root

### Metadata file conventions

#### App icons

- favicon `.ico` Favicon file
- icon `.ico .jpg .jpeg .png .svg` App Icon file
- icon `.js .ts .tsx` Generated App Icon
- apple-icon `.jpg .jpeg, .png` Apple App Icon file
- apple-icon `.js .ts .tsx` Generated Apple App Icon

#### Open Graph and Twitter images

- opengraph-image `.jpg .jpeg .png .gif` Open Graph image file
- opengraph-image `.js .ts .tsx` Generated Open Graph image
- twitter-image `.jpg .jpeg .png .gif` Twitter image file
- twitter-image `.js .ts .tsx` Generated Twitter image

#### SEO

- sitemap `.xml` Sitemap file
- sitemap `.js .ts` Generated Sitemap
- robots `.txt` Robots file
- robots `.js .ts` Generated Robots file

### Component Hierarchy

```jsx
<Layout>
  <Template>
    <ErrorBoundary fallback={<Error />}>
      <Suspense fallback={<Loading />}>
        <ErrorBoundary fallback={<NotFound />}>
          <Page />
        </ErrorBoundary>
      </Suspense>
    </ErrorBoundary>
  </Template>
</Layout>
```

### Different ways of Organizing your project

- Store project files outside of app
- Store project files in top-level folders inside of app
- Split project files by feature or route
- Organize routes without affecting the URL path
- Opting specific segments into a layout
- Opting for loading skeletons on a specific route
- Creating multiple root layouts

learn more at <https://nextjs.org/docs/app/getting-started/project-structure#organizing-your-project>

## Layout and Pages

### Rendering with params

```typescript
// app/blog/[slug]/page.tsx

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
}
```

### Rendering with searchParams

```typescript
export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const filters = (await searchParams).filters;
  ...
}
```

#### What to use and when

- Use the `searchParams` prop when you need search parameters to load data for the page (e.g. pagination, filtering from a database).
- Use `useSearchParams` when search parameters are used only on the client (e.g. filtering a list already loaded via props).
- As a small optimization, you can use `new URLSearchParams(window.location.search)` in callbacks or event handlers to read search params without triggering re-renders.

### Linking Between Pages

```typescript
<Link href={`/blog/${post.slug}`}>{post.title}</Link>
```

## Linking and Navigating

To understand how navigation works in Next.js, it helps to be familiar with the following concepts:

- Server Rendering

  There are two types of server rendering, based on when it happens:

  - **Static Rendering** (or **Prerendering**) happens at build time or during **revalidation** and the result is cached.
  - **Dynamic Rendering** happens at request time in response to a client request

- Prefetching

  Next.js automatically prefetches routes linked with the `<Link>` component when they enter the user's viewport.

  How much of the route is prefetched depends on whether it's static or dynamic:

  - **Static Route**: the full route is prefetched.
  - **Dynamic Route**: prefetching is skipped, or the route is partially prefetched if `loading.tsx` is present.

- Streaming

  To use streaming, create a `loading.tsx` in your route folder:

- Client-side transitions

  Instead of reloading the page, it updates the content dynamically by:

  - Keeping any shared layouts and UI.
  - Replacing the current page with the prefetched loading state or a new page if available.

### What can make transitions slow?

- Dynamic routes without `loading.tsx`

  We recommend adding loading.tsx to dynamic routes to enable partial prefetching, trigger immediate navigation, and display a loading UI while the route renders.

- Dynamic segments without `generateStaticParams`

  If a dynamic segment could be prerendered but isn't because it's missing `generateStaticParams`, the route will fallback to dynamic rendering at request time.

  The `generateStaticParams` function can be used in combination with dynamic route segments to statically generate routes at build time instead of on-demand at request time.

```typescript
// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams() {
  const posts = await fetch("https://.../posts").then((res) => res.json());

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Multiple versions of this page will be statically generated
// using the `params` returned by `generateStaticParams`
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // ...
}
```

- Slow networks

  On slow or unstable networks, prefetching may not finish before the user clicks a link. This can affect both static and dynamic routes. In these cases, the `loading.js` fallback may not appear immediately because it hasn't been prefetched yet.

  To improve perceived performance, you can use the `useLinkStatus` hook to show inline visual feedback to the user (like spinners or text glimmers on the link) while a transition is in progress.

```typescript
// app/ui/loading-indicator.tsx

"use client";

import { useLinkStatus } from "next/link";

export default function LoadingIndicator() {
  const { pending } = useLinkStatus();
  return pending ? <div role='status' aria-label='Loading' className='spinner' /> : null;
}
```

Learn more here: <https://nextjs.org/docs/app/getting-started/linking-and-navigating#slow-networks>

- Restricting Prefetching

  Completely off

```typescript
<Link prefetch={false} href='/blog'>
  Blog
</Link>
```

Prefetch only on hover

```typescript
"use client";

import Link from "next/link";
import { useState } from "react";

function HoverPrefetchLink({ href, children }: { href: string; children: React.ReactNode }) {
  const [active, setActive] = useState(false);

  return (
    <Link href={href} prefetch={active ? null : false} onMouseEnter={() => setActive(true)}>
      {children}
    </Link>
  );
}
```

## Server and Client Components

### How do Server and Client Components work in Next.js?

#### On the server

On the server, Next.js uses React's APIs to orchestrate rendering. The rendering work is split into chunks, by individual route segments (layouts and pages):

- Server Components are rendered into a special data format called the **React Server Component Payload** (RSC Payload).
- Client Components and the RSC Payload are used to **prerender** HTML.

What is the React Server Component Payload (RSC)?

The RSC Payload is a **compact binary representation** of the rendered React Server Components tree. It's used by React on the client to update the browser's DOM. The RSC Payload contains:

- The rendered result of Server Components
- Placeholders for where Client Components should be rendered and references to their JavaScript files
- Any props passed from a Server Component to a Client Component

#### On the client (first load)

Then, on the client:

- HTML is used to immediately show a fast non-interactive preview of the route to the user.
- RSC Payload is used to reconcile the Client and Server Component trees.
- JavaScript is used to hydrate Client Components and make the application interactive.

  - What is hydration? : Hydration is React's process for attaching event handlers to the DOM, to make the static HTML interactive.

#### Subsequent Navigations

On subsequent navigations:

- The RSC Payload is prefetched and cached for instant navigation.
- Client Components are rendered entirely on the client, without the server-rendered HTML.

### Reducing JS Bundle size

To reduce the size of your client JavaScript bundles, add `use client` to specific interactive components instead of marking large parts of your UI as Client Components.

### Passing data from Server to Client Components

You can pass data from Server Components to Client Components using props.

```typescript
// app/[id]/page.tsx
import LikeButton from "@/app/ui/like-button";
import { getPost } from "@/lib/data";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost(id);

  return <LikeButton likes={post.likes} />;
}

// app/ui/like-button.tsx
("use client");

export default function LikeButton({ likes }: { likes: number }) {
  // ...
}
```

Alternatively, you can stream data from a Server Component to a Client Component with the `use` Hook

```typescript
// app/blog/page.tsx
import Posts from '@/app/ui/posts
import { Suspense } from 'react'

export default function Page() {
  // Don't await the data fetching function
  const posts = getPosts()

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Posts posts={posts} />
    </Suspense>
  )
}

// app/ui/posts.tsx
'use client'
import { use } from 'react'

export default function Posts({
  posts,
}: {
  posts: Promise<{ id: string; title: string }[]>
}) {
  const allPosts = use(posts)

  return (
    <ul>
      {allPosts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

### Third-party components

Third-party client component, but it doesn't yet have the `use client` directive.

- Wrap it in a Client Component to ensure it works as expected.
- Another way

```typescript
"use client";

import { Carousel } from "acme-carousel";
// Carousel in 'acme-carousel' has not 'use client' directive

export default Carousel;
```

### Preventing environment poisoning

In Next.js, only environment variables prefixed with NEXT*PUBLIC* are included in the client bundle. If variables are not prefixed, Next.js replaces them with an empty string.

use of `server-only` and `client-only` packages

More at <https://nextjs.org/docs/app/getting-started/server-and-client-components>

## Data Fetching

### In Server Components

- The `fetch` API

  `fetch` responses are **not cached** by default. However, Next.js will **prerender** the route and the output will be cached for improved performance. If you'd like to opt into dynamic rendering, use the `{ cache: 'no-store' }` option.

- An ORM or database

### In Client Components

- React's `use` hook ([Go here](#passing-data-from-server-to-client-components))
- A community library like `SWR` or `React Query`

### Deduplicate requests and cache data

- You can also deduplicate `fetch` requests by using Next.js’ **Data Cache**, for example by setting `cache: 'force-cache'` in your fetch options.

- If you are not using fetch, and instead using an ORM or database directly, you can wrap your data access with the React `cache` function.

  To maximize cache hits and reduce work, the two components should call the same memoized function to access the same cache. Instead, define the memoized function in a dedicated module that can be import-ed across components.

```typescript
// getWeekReport.js
import { cache } from "react";
import { calculateWeekReport } from "./report";

export default cache(calculateWeekReport);

// Temperature.js
import getWeekReport from "./getWeekReport";

export default function Temperature({ cityData }) {
  const report = getWeekReport(cityData);
  // ...
}

// Precipitation.js
import getWeekReport from "./getWeekReport";

export default function Precipitation({ cityData }) {
  const report = getWeekReport(cityData);
  // ...
}
```

### Streaming

Warning: The content below assumes the `cacheComponents` config option is enabled in your application. The flag was introduced in Next.js 15 canary.

There are two ways you can implement streaming in your application:

- Wrapping a page with a `loading.js` file

  loading.js will result in something like this automatically.

```diff
<Layout>
  <Header />
  <Sidebar />
+  <Suspense fallback={<Loading />}>
    <Page />
+  </Suspense>
</Layout>
```

- Wrapping a component with `<Suspense>`

  `<Suspense>` allows you to be more granular about what parts of the page to stream. For example, you can immediately show any page content that falls outside of the `<Suspense>` boundary, and stream in the list of blog posts inside the boundary.

```typescript
import { Suspense } from "react";
import BlogList from "@/components/BlogList";
import BlogListSkeleton from "@/components/BlogListSkeleton";

export default function BlogPage() {
  return (
    <div>
      {/* This content will be sent to the client immediately */}
      <header>
        <h1>Welcome to the Blog</h1>
        <p>Read the latest posts below.</p>
      </header>
      <main>
        {/* Any content wrapped in a <Suspense> boundary will be streamed */}
        <Suspense fallback={<BlogListSkeleton />}>
          <BlogList />
        </Suspense>
      </main>
    </div>
  );
}
```

### Data Access strategies

#### Sequential

```typescript
export default async function Page({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  // Get artist information
  const artist = await getArtist(username);

  return (
    <>
      <h1>{artist.name}</h1>
      {/* Show fallback UI while the Playlists component is loading */}
      <Suspense fallback={<div>Loading...</div>}>
        {/* Pass the artist ID to the Playlists component */}
        <Playlists artistID={artist.id} />
      </Suspense>
    </>
  );
}

async function Playlists({ artistID }: { artistID: string }) {
  // Use the artist ID to fetch playlists
  const playlists = await getArtistPlaylists(artistID);

  return (
    <ul>
      {playlists.map((playlist) => (
        <li key={playlist.id}>{playlist.name}</li>
      ))}
    </ul>
  );
}
```

#### Parallel

```typescript
import Albums from "./albums";

async function getArtist(username: string) {
  const res = await fetch(`https://api.example.com/artist/${username}`);
  return res.json();
}

async function getAlbums(username: string) {
  const res = await fetch(`https://api.example.com/artist/${username}/albums`);
  return res.json();
}

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const artistData = getArtist(username);
  const albumsData = getAlbums(username);

  // Initiate both requests in parallel
  const [artist, albums] = await Promise.all([artistData, albumsData]);

  return (
    <>
      <h1>{artist.name}</h1>
      <Albums list={albums} />
    </>
  );
}
```

**Good to know**: If one request fails when using `Promise.all`, the entire operation will fail. To handle this, you can use the `Promise.allSettled` method instead.

### Preloading data

You can preload data by creating an utility function that you eagerly call above blocking requests. `<Item>` conditionally renders based on the `checkIsAvailable()` function.

You can call `preload()` before `checkIsAvailable()` to eagerly initiate `<Item/>` data dependencies. By the time `<Item/>` is rendered, its data has already been fetched.

```typescript
import { getItem, checkIsAvailable } from "@/lib/data";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // starting loading item data
  preload(id);
  // perform another asynchronous task
  const isAvailable = await checkIsAvailable();

  return isAvailable ? <Item id={id} /> : null;
}

export const preload = (id: string) => {
  // void evaluates the given expression and returns undefined
  // https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/void
  void getItem(id);
};
export async function Item({ id }: { id: string }) {
  const result = await getItem(id);
  // ...
}
```

Additionally, you can use React's `cache` function and the `server-only` package to create a reusable utility function. This approach allows you to cache the data fetching function and ensure that it's only executed on the server.

```typescript
import { cache } from "react";
import "server-only";
import { getItem } from "@/lib/data";

export const preload = (id: string) => {
  void getItem(id);
};

export const getItem = cache(async (id: string) => {
  // ...
});
```
