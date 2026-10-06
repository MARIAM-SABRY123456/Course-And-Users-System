const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const morgan = require("morgan");
dotenv.config({ path: "config.env" });
const cors = require("cors");
const dbConnection = require("./config/database");
const courseRoute = require("./routes/courseRoute");
const userRoute = require("./routes/userRoute");
const golbalError = require("./middlewares/apiError");
const httpStatusText = require("./utils/httpStatusText");
dbConnection();

const app = express();
app.use("/uploads", express.static(path.join(__dirname,"uploads")));
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}
app.use("/api/courses", courseRoute);
app.use("/api/users", userRoute);
// Error Handling Middleware For Not Found Route
app.all(/.*/, (req, res, next) => {
  return res.status(500).json({status: httpStatusText.ERROR, message: "this resorce is not available"});
});
// Global Error Handling Middleware
app.use(golbalError);

app.listen(3000, () => {
  console.log("Listening on port 5000");
});
