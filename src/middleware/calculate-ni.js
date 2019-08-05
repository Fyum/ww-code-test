const nationalInsurance = require('../services/national-insurance');

module.exports = (req, res) => {
  res.send({
    income: req.income,
    ni: nationalInsurance(req.runDate)(req.income),
  });
};
