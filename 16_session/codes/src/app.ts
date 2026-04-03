import express from "express";
import session from "express-session";
// @ts-ignore
import connectSqlite3 from "connect-sqlite3"; // Type definitions for this package may be incomplete, so ignore TS checks

// 🎯 Production usually uses Redis for session storage. For demo convenience, this uses sqlite3.
// The connect-sqlite3 package is an Express Session store adapter that implements the required store interface.

// This interface defines core session store operations such as get, set, and destroy.
// Through this adapter, we can store session data in an SQLite database.
// This allows session data to persist even after server restarts.

// After user authentication, user information is stored in the session.
// In later requests, user information can be retrieved from the session.
// Express Session default typings do not include user, so SessionData needs to be extended.
declare module "express-session" {
  interface SessionData {
    user?: {
      id: number;
      username: string;
      role: string;
      email: string;
    };
  }
}

// 📚 Mock user database (for teaching)
interface User {
  id: number;
  username: string;
  password: string; // In real projects, this should be a hashed password
  role: string;
  email: string;
}

const users: User[] = [
  {
    id: 1,
    username: "admin",
    password: "cisco", // In real projects, this should be a hashed password
    role: "admin",
    email: "admin@abc.com",
  },
  {
    id: 2,
    username: "jack",
    password: "cisco",
    role: "user",
    email: "jack@abc.com",
  },
];

const app = express();
const PORT = 3000;
// Create SQLite session store
const SQLiteStore = connectSqlite3(session);

// Regular middleware configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // Serve static files

// 🛠️ Logging middleware A
// This middleware prints request URL and headers.
// It is placed before the session middleware, so this data is from the raw request.
app.use((req, res, next) => {
  let now = new Date();
  console.log("\n+--------------------------------------------------------------");
  console.log(`| 🌸 Received an HTTP request 🫡🫡🫡`);
  console.log(`| 🌸 Local time: ${now.toLocaleString()}`);
  console.log(`| 🌸 UTC time:  ${now.toUTCString()}`);
  console.log("+--------------------------------------------------------------");
  console.log("\n=== Logging Middleware A 😋 ===");
  console.log("=== Raw request info, especially whether cookie exists 🚗🚗🚗 ===");
  console.log("req.url: ", req.url);
  console.log("req.headers: ", req.headers);
  console.log("\n=== At this point, request has no session info yet because session middleware has not run ===");
  console.log("❌ req.sessionID: ", req.sessionID);
  console.log("❌ req.session: ", req.session);
  console.log("=== Handing off to session middleware next ===👇");
  next();
});

// 🛠️ Session middleware
app.use(
  session({
    secret: "topsecret", // Secret used to sign session ID cookie to prevent tampering
    resave: false, // Do not re-save session if it has not been modified
    saveUninitialized: false, // Do not save uninitialized sessions
    name: "easyblog.sid", // Cookie name, default is 'connect.sid'
    rolling: false, // Whether to refresh cookie expiration on every request

    cookie: {
      secure: false, // Set to true under HTTPS so cookie is only sent via HTTPS
      httpOnly: true, // Server-only cookie access, prevents client-side JS access
      maxAge: 5 * 60 * 1000, // Cookie expiration set to 5 minutes (ms)
      sameSite: "strict", // CSRF protection: 'strict' | 'lax' | 'none'
    },

    // Use SQLite as session store
    store: new SQLiteStore({
      db: "sessions.db", // SQLite database file name
      table: "sessions", // Table name
      dir: "./db", // Database file directory
      concurrentDB: true, // Enable WAL mode for concurrent read/write
    }),
  }),
);

// 🛠️ Logging middleware B
// This middleware prints session ID and session data.
// It is placed after session middleware, so session data has already been attached to request.
app.use((req, res, next) => {
  console.log("\n\n🍀🍀🍀🍀If you can see this log, the request has passed through session middleware🍀🍀🍀🍀\n\n");
  console.log("👆=== Logging Middleware B 😋 ===");
  console.log("=== Session middleware has finished, session info is now attached to request 🍔🍔🍔 ===");
  console.log("✅ req.sessionID: ", req.sessionID);
  console.log("✅ req.session: ", req.session);
  console.log("👆=== If user id/name/role is not present, this is an unauthenticated session ===");
  console.log("👆=== For unauthenticated sessions, sessionID changes on every refresh ===");
  console.log("👆=== If user id/name/role is present, this is an authenticated session ===");
  console.log("👆=== For authenticated sessions, sessionID stays stable unless logout or expiration occurs ===");
  console.log("\n=== Handing off to route handlers next ===👇");
  console.log("\n🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑");
  next();
});

// Route handlers
app.get("/", (req, res) => {
  res.send(`
        <h1>Welcome to the session demo!</h1>
        <p>Session ID: ${req.sessionID}</p>
        <p>Session Data: ${JSON.stringify(req.session)}</p>
        <p>Try <a href="/login">Login</a></p>
        <p>Try <a href="/profile">Profile</a></p>
        <p>Try <a href="/logout">Logout</a></p>
    `);
});

app.get("/login", (req, res) => {
  if (req.session.user) {
    // If user is already logged in, redirect to profile page
    res.redirect("/profile");
  } else {
    res.send(`
                <h1>User Login</h1>
                <p><strong>req.sessionID: </strong> ${req.sessionID}</p>
                <p><strong>req.session: </strong> ${JSON.stringify(req.session)}</p>
                <form action="/login" method="POST">
                    <input type="text" name="username" placeholder="Enter username" required>
                    <input type="password" name="password" placeholder="Enter password" required>
                    <button type="submit">Login</button>
                </form>
        `);
  }
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log(`Login request: username: ${username}, password: ${password}`);
  const user = users.find((u) => u.username === username && u.password === password);
  if (user) {
    // Login successful, store user info in session
    req.session.user = {
      id: user.id,
      username: user.username,
      role: user.role,
      email: user.email,
    };
    console.log(`User ${username} logged in successfully, Session ID: ${req.sessionID}`);
    res.send(`<h1>Logged in!</h1>
            <p>Session ID: ${req.sessionID}</p>
            <p>Session Data: ${JSON.stringify(req.session)}</p>
            <p>Try <a href='/profile'>Profile</a></p>
            <p>Try <a href='/logout'>Logout</a></p>`);
  } else {
    // Login failed, return error
    res.status(401).send(`<h1>Login Failed</h1>
            <p>Session ID: ${req.sessionID}</p>
            <p>Session Data: ${JSON.stringify(req.session)}</p>
            <p>Invalid username or password. Please try again.</p>
            <p>Try <a href='/login'>Login</a></p>`);
  }
});

app.get("/profile", (req, res) => {
  // Check whether user is logged in
  if (req.session.user) {
    res.send(`<h1>Welcome ${req.session.user.username}!</h1>
            <p>Session ID: ${req.sessionID}</p>
            <p>Session Data: ${JSON.stringify(req.session)}</p>
            <p>Your role: ${req.session.user.role}</p>
            <p>Your email: ${req.session.user.email}</p>
            <p>Try <a href='/logout'>Logout</a></p>`);
  } else {
    res.status(401).send(`<h1>Unauthorized</h1>
            <p>Session ID: ${req.sessionID}</p>
            <p>Session Data: ${JSON.stringify(req.session)}</p>
            <p>You need to <a href='/login'>Login</a> first.</p>`);
  }
});

app.get("/logout", (req, res) => {
  // Clear session
  req.session.destroy((err) => {
    if (err) {
      res.status(500).send("Could not log out.");
    } else {
      res.clearCookie("easyblog.sid");
      console.log(`Logged out, current Session ID: ${req.sessionID}`);
      res.send(`<h1>Logged out!</h1>
                <p>Session ID: ${req.sessionID}</p>
                <p>Session Data: ${JSON.stringify(req.session)}</p>
                <p>Try <a href='/'>Back to Home</a></p>`);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Test accounts: admin: admin / cisco, user: jack / cisco`);
});
