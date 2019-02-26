const { Comodo } = require("../models");
const { to, ReE, ReS } = require("../services/util.service");

const create = async (req, res) => {
  let err, comodo;
  let user = req.user;

  let comodo_info = req.body;

  [err, comodo] = await to(Comodo.create(comodo_info));
  if (err) return ReE(res, err, 422);

  comodo.addUser(user, { through: { status: "Iniciado" } })[
    (err, comodo)
  ] = await to(comodo.save());
  if (err) return ReE(res, err, 422);

  let comodo_json = comodo.toWeb();
  comodo_json.users = [{ user: user.id }];

  return ReS(res, { comodo: comodo_json }, 201);
};
module.exports.create = create;

const getAll = async (req, res) => {
  let user = req.user;
  let err, comodos;

  [err, comodos] = await to(
    user.getComodos({ include: [{ association: Comodo.Users }] })
  );

  let comodos_json = [];
  for (let i in comodos) {
    let comodo = comodos[i];
    let users = comodo.Users;
    let comodo_info = comodo.toWeb();
    let users_info = [];
    for (let i in users) {
      let user = users[i];
      // let user_info = user.toJSON();
      users_info.push({ user: user.id });
    }
    comodo_info.users = users_info;
    comodos_json.push(comodo_info);
  }

  console.log("c t", comodos_json);
  return ReS(res, { comodos: comodos_json });
};
module.exports.getAll = getAll;

const get = (req, res) => {
  let comodo = req.comodo;

  return ReS(res, { comodo: comodo.toWeb() });
};
module.exports.get = get;

const update = async (req, res) => {
  let err, comodo, data;
  comodo = req.comodo;
  data = req.body;
  comodo.set(data);

  [err, comodo] = await to(comodo.save());
  if (err) {
    return ReE(res, err);
  }
  return ReS(res, { comodo: comodo.toWeb() });
};
module.exports.update = update;

const remove = async (req, res) => {
  let comodo, err;
  comodo = req.comodo;

  [err, comodo] = await to(comodo.destroy());
  if (err) return ReE(res, "Erro ocorrido ao tentar deletar um cômodo");

  return ReS(res, { message: "Cômodo deletado com sucesso" }, 204);
};
module.exports.remove = remove;
