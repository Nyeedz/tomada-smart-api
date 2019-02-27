const { User } = require("../models");
const validator = require("validator");
const { to, TE } = require("../services/util.service");

const getUniqueKeyFromBody = body => {
  // this is so they can send in 3 options unique_key, email, or phone and it will work
  let unique_key = body.unique_key;
  if (typeof unique_key === "undefined") {
    if (typeof body.email != "undefined") {
      unique_key = body.email;
    } else if (typeof body.phone != "undefined") {
      unique_key = body.phone;
    } else {
      unique_key = null;
    }
  }

  return unique_key;
};
module.exports.getUniqueKeyFromBody = getUniqueKeyFromBody;

const createUser = async userInfo => {
  let unique_key, auth_info, err;

  auth_info = {};
  auth_info.status = "create";

  unique_key = getUniqueKeyFromBody(userInfo);
  if (!unique_key) TE("E-mail ou telefone não inserido.");

  if (validator.isEmail(unique_key)) {
    auth_info.method = "email";
    userInfo.email = unique_key;

    [err, user] = await to(User.create(userInfo));
    if (err) TE("Usuário já existe com este e-mail");

    return user;
  } else if (validator.isMobilePhone(unique_key, "any")) {
    //checks if only phone number was sent
    auth_info.method = "phone";
    userInfo.phone = unique_key;

    [err, user] = await to(User.create(userInfo));
    if (err) TE("Usuário já existe com este número de telefone");

    return user;
  } else {
    TE("Número de telefone inválido.");
  }
};
module.exports.createUser = createUser;

const authUser = async userInfo => {
  //returns token
  let unique_key;
  let auth_info = {};
  auth_info.status = "login";
  unique_key = getUniqueKeyFromBody(userInfo);

  if (!unique_key) TE("Por favor entre com o e-mail ou telefone para logar");

  if (!userInfo.password) TE("Por favo entre a senha para logar");

  let user;
  if (validator.isEmail(unique_key)) {
    auth_info.method = "email";

    [err, user] = await to(User.findOne({ where: { email: unique_key } }));
    if (err) TE(err.message);
  } else if (validator.isMobilePhone(unique_key, "any")) {
    //checks if only phone number was sent
    auth_info.method = "phone";

    [err, user] = await to(User.findOne({ where: { phone: unique_key } }));
    if (err) TE(err.message);
  } else {
    TE("E-mail ou telefone inválido");
  }

  if (!user) TE("Não cadastrado");

  [err, user] = await to(user.comparePassword(userInfo.password));

  if (err) TE(err.message);

  return user;
};
module.exports.authUser = authUser;
