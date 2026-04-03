import { createServer } from "http";

const server = createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("<h1>Hello World!</h1>");
  res.end();
});

// start the server and listen on port 3000
server.listen(3000, () => {
  console.log("Server listening on port 3000...");
});
