# AXIOS Setup and Implementation Guide

- **Quick set up** - group members amend after full set up.

---

- depth set up
1. Step 1: Install
2. Step 2: Create the base HTTP client
- 2.1: Configure the API base URL
- 2.2 Create the client file
3. Smoke Test
4. Application: Example - Login Page, Simple Header which pulls username from database, RoutinesList component

---

# Quick setup for once 1st set up is done (other users)
## 1. Install Axios
**Goal:** Add Axios to the frontend
```bash
cd frontend
npm i axios
```

## 2. Configure the API base URL
- create a frontend .env file
Add to env file:
`REACT_APP_API_URL=http://localhost:5000` <------> or your PORT.

Make sure this new .env is in the .gitignore file

## 3. Amend the `client file`
```js
// frontend/src/api/client.js
import axios from "axios";

// 1) Where is our API? (use env vars if present, else localhost)
const BASE_URL =
  process.env.REACT_APP_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  "http://localhost:9090"; // ensure it's pointing to project port

// One Axios instance used everywhere
export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000, // optional — you can remove if you want
});

```

## 4. check with a smoke test
### Running the Smoke Test:

1. Make an api helper

Create `frontend/src/api/test.js`
```js
import { api } from "./client";

export async function apiTest() {
  const res = await api.get("/api/test");
  return res.data; // { message: "Hello from the backend API!" }
}
```

2. Make a throwaway component
`frontend/src/components/ApiProbe.jsx`
```js
import { useEffect, useState } from "react";
import { apiTest } from "../api/test";

export default function ApiProbe() {
  const [text, setText] = useState("Checking API…");

  useEffect(() => {
    let mounted = true;
    apiTest()
      .then((data) => { if (mounted) setText(`API OK: ${data.message}`); })
      .catch(() => { if (mounted) setText("API error"); });
    return () => { mounted = false; };
  }, []);

  return <p>{text}</p>;
}
```
3. + Mount somewhere visible
```js
// App.js
export default function App() {
  return (
    <div>
      <h1>App</h1>
      <ApiProbe /> <---- mounted here so can be rendered on page
    </div>
  );
}
```
*Success* - the message renders to the page 

**Things to look out for:** When I did this on the group version it said I didn't have mysql, cors etc (backend dependencies) installed. So if you havn't touched the backend or done anything requiring them as of yet - you may need to do that. Installing them worked for me.

---


# 1st time install and setup
## 1st time set up
## 1. Install Axios
**Goal:** Add Axios to the frontend so we can create a shared HTTP client next.
```bash
cd frontend
 npm i axios
```
---

## 2. Create the base HTTP client
**Goal:** Make one shared Axios instance with a clean, predictable error shape.

**references**
- https://axios-http.com/docs/instance

**What is 'the base HTTP client'?**
- One shared, pre‑configured object that we use for every API call.
- It wraps a library (Axios for us) and sets common behaviour in one place:
- Base URL (where the API lives)
- Default headers (e.g. JSON)
- Timeouts
- Interceptors for consistent error messages, auth tokens, logging, etc.

**Use Case:**
- DRY: No repeated `fetch`/ Axios code components
- consistent errors
- One switch: change/ twee in one single file rather than tweaking across multiple component files
- Easier testing

***Rule of thumb:* All network requests go through the base client. No direct axios()/fetch() in components.**

### 2.1: Configure the API base URL

**references:**
- https://create-react-app.dev/docs/adding-custom-environment-variables/

Add to env file:
`REACT_APP_API_URL=http://localhost:5000` <------> or your PORT

### 2.2 Create the client file

**What is the client file?**
A single, shared HTTP helper that every network request goes through. In our project this is src/api/client.js. It wraps Axios and centralises common behaviour so components stay small and predictable.

**Use Case:**
- Consistency: One place to set the API base URL, headers, and timeouts.
- Clean errors: Turns any non‑2xx response into a simple ApiError(message, status, data) so components just try/catch and display e.message.
- Future‑proofing: Easy to add cross‑cutting concerns later (auth tokens, refresh logic, logging, retry) without touching every component.
- Testing: Mock one client instead of many scattered fetch/Axios calls.
- DRY: No repeated boilerplate in forms and pages.

**What it does:**
- Sets base URL (where the backend lives).
- Applies default headers (JSON).
- Sets a timeout (so calls don’t hang forever).
- Adds response interceptors to normalise errors into ApiError.
- (Later) Can attach auth headers or handle 401 refresh in one place.

```js
// frontend/src/api/client.js
import axios from "axios";

// 1) Where is our API? (use env vars if present, else localhost)
const BASE_URL =
  process.env.REACT_APP_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  "http://localhost:5000";

// One Axios instance used everywhere
export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000, // optional — you can remove if you want
});

```

---

## Smoke Test
**Goal:** Prove the frontend can reach the backend. No features. No UI polish. Just “can we talk to /api/test and see the message?”

**What is a smoke test?**
**reference:** https://en.wikipedia.org/wiki/Smoke_testing_%28software%29Why

A tiny, end‑to‑end check that exercises the minimum path:

- Frontend → network → Backend route → response → Frontend renders text.

- like plugging in a device to see if it turns on- If it fails, building more features is a waste of time.

Used to:
- Confirm the base URL/env var is correct.
- Confirm the backend is running and the route exists.
- Catch CORS/proxy misconfigurations early.
- Establish a simple pattern for future API calls.

*Success looks like:* A line of text in the browser, e.g. API OK: Hello from the backend API!
*Failure looks like:* A clear error/placeholder (keep it simple).

### Running the Smoke Test:
**reference:** https://react.dev/reference/react/useEffect

1. Make an api helper

Create `frontend/src/api/test.js`
```js
import { api } from "./client";

export async function apiTest() {
  const res = await api.get("/api/test");
  return res.data; // { message: "Hello from the backend API!" }
}
```

Make a throwaway component
`frontend/src/components/ApiProbe.jsx`
```js
import { useEffect, useState } from "react";
import { apiTest } from "../api/test";

export default function ApiProbe() {
  const [text, setText] = useState("Checking API…");

  useEffect(() => {
    let mounted = true;
    apiTest()
      .then((data) => { if (mounted) setText(`API OK: ${data.message}`); })
      .catch(() => { if (mounted) setText("API error"); });
    return () => { mounted = false; };
  }, []);

  return <p>{text}</p>;
}
```
+ Mount somewhere visible
```js
// App.js
export default function App() {
  return (
    <div>
      <h1>App</h1>
      <ApiProbe /> <---- mounted here so can be rendered on page
    </div>
  );
}
```
*Success* - the message renders to the page :) 

--- 

## 4. Application: Example - Login Form

Create `frontend/src/api/auth.js`
**WHAT?**
```js
import { api } from "./client"; // your shared Axios instance (has baseURL, headers, etc.)

// Calls your backend GET /users/:id and returns the response body
export async function getUserById(id) {
  const res = await api.get(`/users/${id}`); // goes to {BASE_URL}/users/123
  return res.data;                            // e.g. { username: "alice" }
}

```
Create component
```js
// frontend/src/components/LoginForm.jsx

// Import the hook from React Router that lets you navigate in code
import { useNavigate } from "react-router-dom"; // navigation to routines page from login button

// Import YOUR API wrapper function that sends POST /login to the backend
import { login } from "../../src/api/auth"; // your wrapper that POSTs /login

// Export a React component so other files can <LoginForm /> it
export default function LoginForm() {
  // Get the navigate() function so we can programmatically change pages after login
  const navigate = useNavigate(); // set navigate

  // Submit handler for the <form> - async because we'll await the login() promise.
  async function handleSubmit(error) {
    // Stop the browser doing a full page reload/HTML form submit
    error.preventDefault(); // don't reload the page

    // Build a FormData object from the <form> element that fired the event
    const formdata = new FormData(error.currentTarget);

    // Read values by their input "name" attributes
    const username = formdata.get("username");
    const password = formdata.get("password");

    try {
      // Call the backend via your wrapper. It should return an object like:
      // { userId, username, message }
      // We rename 'username' to 'name' while destructuring to avoid shadowing the local variable name
      const { userId, username: name } = await login(username, password);

      // Persist minimal identity info for later pages (routines/ play routine)
      localStorage.setItem("userId", String(userId)); // store userId as a string
      localStorage.setItem("username", name);         // store username

      // Navigate to the routines page and replace the history entry
      // so Back won't return to /login
      navigate("/routines", { replace: true });
    } catch {
      // Keep it ultra-minimal for now. Later we can show a toast or inline message.
      alert("Login failed");
    }
  }

  // Render a small HTML form.
  // don't use React state here — FormData reads the values on submit.
  return (
    <form onSubmit={handleSubmit}>
      {/* The 'name' attributes MUST match what you read from FormData above */}
      <input name="username" placeholder="Username" autoComplete="username" />
      <input name="password" type="password" placeholder="Password" autoComplete="current-password" />
      <button>Log in</button>
    </form>
  );
}

```

### EXAMPLE:  Header Element
**Goal:**s Build a tiny component that does exactly one thing: show a friendly greeting using the logged‑in user’s name.

**Where?**
Create `frontend/src/api/auth.js`
**WHAT?**
```js
// frontend/src/api/auth.js
import { api } from "./client"; // imports the api from the client file so no need to refer to explicitly

// GET /users/:id   { username: "alice" }
export async function getUserById(id) {
  const res = await api.get(`/users/${id}`);
  return res.data; // { username }
}
```

 **Component**
 ```js
// frontend/src/components/Header.jsx
import React from "react";
// import "../styles/Header.css"; // keep if you have it

export default function Header() {
    // pull username from localstorage where held after successful login
  const username = localStorage.getItem("username") || "";
  return (
    <header className="header">
        {/*username passed into header*/}
      <h1>Hi {username}! Let's get started with your routine</h1>
    </header>
  );
}
```

 ### Routines Page
 **Goal:** Apply above to a project page. Feed user's routines from the db to the page.

 Add and api routines file
 ```js
 // frontend/src/api/routines.js
import { api } from "./client";
export async function getRoutines(user_id) {
  const res = await api.get("/routines", { params: { user_id } });
  return res.data; // { routines: [...] }
}
```
```js
// frontend/src/components/routine-list/RoutineList.jsx

// Import React and two hooks:
// - useState: store component state (the routines array)
// - useEffect: run side-effects (fetching data after render)
import React, { useEffect, useState } from "react";

// Import navigation hook from React Router so we can go to other pages in code
import { useNavigate } from "react-router-dom";

// Import your Axios-based API helper that calls GET /routines?user_id=...
import { getRoutines } from "../../api/routines";

// Define and export the component so it can be used elsewhere
function RoutinesList() {

  // Grab the navigate() function so we can push to URLs (e.g., edit/play/new)
  const navigate = useNavigate();

  // Read the logged-in user's id (saved by Login) from localStorage (stored as a string)
  const userId = localStorage.getItem("userId"); // set at login

  // Create a piece of state to hold the routines returned from the API (start empty)
  const [routines, setRoutines] = useState([]);

  // Run once on mount (and again if userId changes): fetch the user's routines
  useEffect(() => {
    // Immediately-invoked async function so we can use await inside useEffect
    (async () => {
      // Call the API helper; backend expects a number for user_id
      const { routines } = await getRoutines(Number(userId));

      // Save the routines array into state (fallback to [] if undefined/null)
      setRoutines(routines ?? []);
    })();
  }, [userId]); // Re-run if a different userId is present (e.g., user logs out/in)

  // JSX UI for the list page
  return (
    <section className="routines">
      {/* Header area for the page title */}
      <div className="routines__header">
        <h1 className="routines__title">Your Routines</h1>
      </div>

      {/* Unordered list that will contain one <li> per routine */}
      <ul className="routines__list">
        {routines.map((r) => (
          // React needs a stable key to track items; routine_id is unique from DB
          <li key={r.routine_id} className="routine-card">
            {/* Left side: routine label info */}
            <div className="routine-card__info">
              {/* Routine name as a subheading */}
              <h2>{r.routine_name}</h2>
              {/* Routine duration in minutes */}
              <p>Duration: {r.routine_duration_minutes} mins</p>
            </div>

            {/* Right side: action buttons for this specific routine */}
            <div className="routine-card__actions">
              {/* Play button navigates to the routine player route with this routine's id */}
              <button
                className="btn btn--secondary"
                onClick={() => navigate(`/routines/play/${r.routine_id}`)}
              >
                Play
              </button>

              {/* Edit button navigates to the edit screen for this routine */}
              <button
                className="btn btn--secondary"
                onClick={() => navigate(`/routines/edit/${r.routine_id}`)}
              >
                Edit
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Global add button to create a brand-new routine */}
      <button
        className="btn btn--secondary"
        onClick={() => navigate("/routines/new")}
      >
        + Add Routine
      </button>
    </section>
  );
}

// Export as default so importing files can do: import RoutinesList from './RoutineList'
export default RoutinesList;
```


---

## References
Axios (base HTTP client)

**Create an Axios instance (axios.create)** — official docshttps://axios-http.com/docs/instanceWhy: We made one shared client with baseURL, headers, and optional timeout.

Interceptors — official docshttps://axios-http.com/docs/interceptorsWhy: Later we can centralise error handling and auth (we mentioned this, even if you’re not adding it yet).

Config defaults & timeouts — official docshttps://axios-http.com/docs/config_defaultsWhy: Confirms how defaults apply to every request and that default timeout is 0 (no timeout) unless you set one.

**Frontend environment variables (pointing the client at the backend)**

**Create React App — Adding custom env vars (REACT_APP_*)**https://create-react-app.dev/docs/adding-custom-environment-variables/Why: We used REACT_APP_API_URL in frontend/.env.

Next.js — Environment variables (NEXT_PUBLIC_* for client-side)https://nextjs.org/docs/pages/guides/environment-variablesWhy: If you’re on Next, our client reads NEXT_PUBLIC_API_URL.

**React piece we used in the smoke test**

**React useEffect** (current docs)https://react.dev/reference/react/useEffectWhy: The smoke-test component calls the API in an effect.

**“Smoke test” concept**
Wikipedia — Smoke testing (software)https://en.wikipedia.org/wiki/Smoke_testing_%28software%29Why: Short definition and context for the term we’re using.