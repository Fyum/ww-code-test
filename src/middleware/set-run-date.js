const moment = require('moment');

module.exports = (req, res, next) => {
  const {
    'x-run-date': runDate,
  } = req.headers;

  if (runDate && !moment(runDate).isValid()) {
    return next(new Error('Provided run date is not a valid date'));
  }

  req.runDate = runDate;
  return next();
};
