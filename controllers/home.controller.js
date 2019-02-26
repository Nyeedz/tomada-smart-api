const { to, ReE, ReS } = require("../services/util.service");

const Dashboard = (req, res) => {
  let user = req.user.id;
  return res.json({
    success: true,
    message: "Funcionou",
    data: "usuário é :" + user
  });
};
module.exports.Dashboard = Dashboard;
