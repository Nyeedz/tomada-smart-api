const Comodo = require("./../models").Comodo;
const { to, ReE, ReS } = require("../services/util.service");

let comodo = async (req, res, next) => {
  let comodo_id, err, comodo;
  comodo_id = req.params.comodo_id;

  [err, comodo] = await to(Comodo.findOne({ where: { id: comodo_id } }));
  if (err) return ReE(res, "Erro ao buscar o cômodo");

  if (!comodo) return ReE(res, `Cômodo com o id ${comodo_id} não encontrado`);
  let user, users_array, users;
  user = req.user;
  [err, users] = await to(comodo.getUsers());

  users_array = users.map(obj => String(obj.user));

  if (!users_array.includes(String(user._id)))
    return ReE(
      res,
      `Usuário não tem permissão para ler essa página com o id ${app_id}`
    );

  req.comodo = comodo;
  next();
};
module.exports.comodo = comodo;
