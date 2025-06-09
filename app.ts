const express = require("express");
const app = express();
const cors = require("cors")
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
// const errorMiddleware = require("./src/middleware/error.ts");

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(
  fileUpload({ limits: { fieldSize: 100 * 1024 * 1024  }, useTempFiles: true })
);
app.use(express.json({ limit: "50mb" }));


// Configure CORS
const corsOptions = {
  origin: 'http://localhost:3000', // Your Next.js frontend
  credentials: true, // REQUIRED for cookies
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};


// Handle preflight requests
// app.options('*', cors(corsOptions)); 

app.use(cors(corsOptions));


// app.use(
//     '/api',
//     createProxyMiddleware({
//       target: 'http://localhost:3000',
//       changeOrigin: true,
//     })
//   );

app.use(cookieParser());
// app.options('*', cors());
// /* ========= ROUTES IMPORTS =========== */
const user = require("./src/routes/authRoutes");
const hr = require("./src/routes/hrRoute")


// /* ====== ROUTES USE ======== */
app.use("/api/v1", user);
app.use("/api/v1", hr)




// app.use(errorMiddleware);

module.exports = app;
