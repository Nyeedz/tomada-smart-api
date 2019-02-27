const { User } = require("../models");
const authService = require("../services/auth.service");
const { to, ReE, ReS } = require("../services/util.service");

const create = async (req, res) => {
  const body = req.body;

  if (!body.unique_key && !body.email && !body.phone) {
    return ReE(res, "Por favor insira o e-mail ou telefone para cadastrar.");
  } else if (!body.password) {
    return ReE(res, "Por favor insira a senha para cadastrar.");
  } else {
    let err, user;

    [err, user] = await to(authService.createUser(body));

    if (err) return ReE(res, err, 422);
    return ReS(
      res,
      {
        message: "Novo usuário criado com sucesso.",
        user: user.toWeb(),
        token: user.getJWT()
      },
      201
    );
  }
};
module.exports.create = create;

const get = async (req, res) => {
  let user = req.user;

  return ReS(res, { user: user.toWeb() });
};
module.exports.get = get;

const update = async (req, res) => {
  let err, user, data;
  user = req.user;
  data = req.body;
  user.set(data);

  [err, user] = await to(user.save());
  if (err) {
    if (err.message == "Erro de validação")
      err = "Este e-mail ou número de telefone já está em uso";
    return ReE(res, err);
  }
  return ReS(res, { message: `Usuário ${user.email} atualizado` });
};
module.exports.update = update;

const remove = async (req, res) => {
  let user, err;
  user = req.user;

  [err, user] = await to(user.destroy());
  if (err) return ReE(res, "Erro occorido ao tentar deletar um usuário");

  return ReS(res, { message: "Usuário deletado" }, 204);
};
module.exports.remove = remove;

const login = async (req, res) => {
  const body = req.body;
  let err, user;

  [err, user] = await to(authService.authUser(req.body));
  if (err) return ReE(res, err, 422);

  return ReS(res, { jwt: user.getJWT(), user: user.toWeb() });
};
module.exports.login = login;
