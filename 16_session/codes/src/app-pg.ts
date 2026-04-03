import express from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";
import pg from "pg";

const dbConfig = {
  host: "10.0.0.133",
  port: 5432,
  user: "postgres",
  password: "Cisco123",
  database: "db4",
  max: 10, // Max connections in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

export const pool = new pg.Pool(dbConfig);

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
// Create session store
const pgStore = connectPg(session);

// Regular middleware configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // Serve static files

// 🛠️ Logging middleware A
app.use((req, res, next) => {
  let now = new Date();
  console.log("\n+--------------------------------------------------------------");
  console.log(`| 🌸 Received an HTTP request 🫡🫡🫡`);
  console.log("+--------------------------------------------------------------");
  console.log("\n=== Logging Middleware A 😋 ===");
  console.log("=== Raw request information ===");
  console.log("req.headers.cookie: ", req.headers.cookie);
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
    // Use PostgreSQL as session store
    cookie: { maxAge: 5 * 60 * 1000 },
    store: new pgStore({
      pool,
      createTableIfMissing: true, // Create table if it does not exist
      tableName: "session", // Specify table name for session storage
    }),
  }),
);

// 🛠️ Logging middleware B
app.use((req, res, next) => {
  console.log("\n\n🍀🍀🍀🍀If you can see this log, the request has passed through session middleware🍀🍀🍀🍀\n\n");
  console.log("👆=== Logging Middleware B 😋 ===");
  console.log("=== Session middleware has finished, session info is now attached to request 🍔🍔🍔 ===");
  console.log("✅ req.sessionID: ", req.sessionID);
  console.log("✅ req.session: ", req.session);
  console.log("\n=== Handing off to route handlers next ===👇");
  console.log("\n🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑🍑");
  next();
});

// Route handlers
app.get("/", (req, res) => {
  res.send(`
        <h1>Welcome to the session demo pgsql version!</h1>
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
            <p>You need to <a href='/login?username=john&password=cisco'>Login</a> first.</p>`);
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
