require('dotenv').config();
const path = require('path');
const Prefixy = require(path.resolve(path.dirname(__dirname), 'prefixy'));
const jwt = require("jsonwebtoken");

const resolveTenant = token => {
  Prefixy.tenant = jwt.verify(token, process.env.SECRET).tenant;
};

module.exports = async function(req, res, next) {
  try {
    resolveTenant(req.body.token);
  } catch(error) {
    error.status = 401;
    return next(error);
  }

  const completion = req.body.completion;

  try {
    await Prefixy.invoke(() => Prefixy.increment(completion));
  } catch(error) {
    return next(error);
  }

  res.sendStatus(204);
};