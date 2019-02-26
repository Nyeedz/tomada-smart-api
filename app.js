const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const passport = require("passport");
const pe = require("parse-error");
const cors = require("cors");

const v1 = require("./routes/v1");
const app = express();

const CONFIG = require("./config/config");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

//Passport
app.use(passport.initialize());

//Log Env
console.log("Environment:", CONFIG.app);
//DATABASE
const models = require("./models");
models.sequelize
  .authenticate()
  .then(() => {
    console.log("Conectado ao banco de dados SQL:", CONFIG.db_name);
  })
  .catch(err => {
    console.error(
      "Incapaz de conectar ao banco de dados SQL:",
      CONFIG.db_name,
      err
    );
  });
if (CONFIG.app === "dev") {
  models.sequelize.sync();
  models.sequelize.sync({ force: true }); // Deleta todas as tabelas
}
// CORS
app.use(cors());

app.use("/v1", v1);

app.use("/", (req, res) => {
  res.statusCode = 200; //send the appropriate status code
  res.json({
    status: "success",
    message: "Bem vindo a API SmartSocket",
    data: {
      description: "Está API foi feita para o tcc da Unisal de 2019"
    }
  });
});

// Erro 404
app.use((req, res, next) => {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

//This is here to handle all the uncaught promise rejections
process.on("unhandledRejection", error => {
  console.error("Uncaught Error", pe(error));
});
