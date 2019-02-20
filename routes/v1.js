const express = require("express");
const router = express.Router();

const UserController = require("../controllers/user.controller");
const ComodoController = require("../controllers/comodo.controller");
const HomeController = require("../controllers/home.controller");

const custom = require("./../middleware/custom");

const passport = require("passport");
const path = require("path");

require("./../middleware/passport")(passport);
/* GET home page. */
router.get("/", (req, res, next) => {
  res.json({
    status: "success",
    message: "Parcel Pending API",
    data: { version_number: "v1.0.0" }
  });
});

router.post("/users", UserController.create); // C
router.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  UserController.get
); // R
router.put(
  "/users",
  passport.authenticate("jwt", { session: false }),
  UserController.update
); // U
router.delete(
  "/users",
  passport.authenticate("jwt", { session: false }),
  UserController.remove
); // D
router.post("/users/login", UserController.login);

router.post(
  "/comodos",
  passport.authenticate("jwt", { session: false }),
  ComodoController.create
); // C
router.get(
  "/comodos",
  passport.authenticate("jwt", { session: false }),
  ComodoController.getAll
); // R

router.get(
  "/comodos/:comodo_id",
  passport.authenticate("jwt", { session: false }),
  custom.comodo,
  ComodoController.get
); // R
router.put(
  "/comodos/:comodo_id",
  passport.authenticate("jwt", { session: false }),
  custom.comodo,
  ComodoController.update
); // U
router.delete(
  "/comodos/:comodo_id",
  passport.authenticate("jwt", { session: false }),
  custom.comodo,
  ComodoController.remove
); // D

router.get(
  "/dash",
  passport.authenticate("jwt", { session: false }),
  HomeController.Dashboard
);

//********* API DOCUMENTATION **********
router.use(
  "/docs/api.json",
  express.static(path.join(__dirname, "/../public/v1/documentation/api.json"))
);
router.use(
  "/docs",
  express.static(path.join(__dirname, "/../public/v1/documentation/dist"))
);
module.exports = router;
