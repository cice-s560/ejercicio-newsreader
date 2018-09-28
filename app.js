// Cargo, lo primero de todo, mis variables de entorno
require("dotenv").config();

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var logger = require("morgan");
var bodyParser = require("body-parser");

const assert = require("chalk");

const MongoClient = require("mongodb").MongoClient;
const DB_URL = "mongodb://localhost:27017/newsreader";

const PORT = process.env.PORT || 3000;

var indexRouter = require("./routes/index");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());

// Todas las rutas de la app en un solo router
app.use("/", indexRouter.router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(PORT, () => {
  console.log(assert.magentaBright(`Express running at ${PORT}`));

  MongoClient.connect(
    DB_URL,
    (err, client) => {
      if (err) throw err;

      console.log(assert.yellow("Mongo connected"));

      indexRouter.setDBClient(client.db("newsreader"));
    }
  );
});

module.exports = app;
