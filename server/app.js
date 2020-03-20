const express = require("express");
const next = require("next");
const logger = require("morgan");
const authroutes = require("./routes/authroutes");

require("dotenv").config();

const routes = require("./routes");
const mobileRoutes = require("./routes/mobileRoute");


const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;

const app = next({ dev });
const handle = app.getRequestHandler();



app.prepare().then(() => {
  const server = express();

  /* Body Parser built-in to Express as of version 4.16 */
  server.use(express.json());
  server.use("/uploads", express.static('uploads'));

  //server.use("/uploads", express.static('uploads'));

  /* give all Next.js's requests to Next.js server */
  server.get("/_next/*", (req, res) => {
    handle(req, res);
  });

  server.get("/static/*", (req, res) => {
    handle(req, res);
  });

  /* morgan for request logging from client
- we use skip to ignore static files from _next folder */
  server.use(
      logger("dev", {
        skip: req => req.url.includes("_next")
      })
  );
  server.use("/api", routes);
  server.use("/api_mobile", mobileRoutes);
  server.use("/v2.api", authroutes);

  /* Error handling from async / await functions */
  server.use((err, req, res, next) => {
    const { status = 500, message } = err;
    res.status(status).json(message);
  });

  /* default route
   - allows Next to  handle all other routes
   - includes the numerous `/_next/...` routes which must    be exposedfor the next app to work correctly
   - includes 404'ing on unknown routes */
  server.get("*", (req, res) => {
    handle(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`Server listening on ${port}`);
  });
});
