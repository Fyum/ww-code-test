const R = require('ramda');
const moment = require('moment');
const RD = require('../utils/ramda-decimal');

const allBands = require('../config/ni');

const isDateOnOrAfter = R.curry(
  (date, dateString) => moment.utc(dateString, 'YYYY-MM-DD')
    .isSameOrBefore(date),
);

const noBandsError = date => new Error(`National Insurance bands unavailable for date ${date}`);

const bandsOnDate = (date) => {
  const month = moment.utc(date, 'YYYY-MM-DD');

  return R.compose(
    R.when(R.isNil, () => {
      throw noBandsError(date);
    }),
    R.prop('bands'),
    R.last,
    R.filter(R.propSatisfies(isDateOnOrAfter(month), 'startDate')),
  )(allBands);
};

const slice = R.curry((floor, ceiling, num) => {
  if (num === RD.ZERO) return RD.ZERO;
  if (num === ceiling) return RD.subtract(num, floor);
  if (num === floor) return RD.ZERO;
  if (RD.lt(num, floor)) return RD.ZERO;

  if (floor !== RD.ZERO) {
    if (RD.gt(num, ceiling)) return RD.subtract(ceiling, floor);
    if (num === ceiling) return RD.subtract(num, ceiling);

    return RD.subtract(num, floor);
  }

  if (floor === RD.ZERO) {
    if (RD.gt(num, ceiling)) return RD.subtract(ceiling, floor);

    return RD.subtract(num, floor);
  }

  throw new Error(`Values for floor (${floor}), ceiling (${ceiling}) and num (${num}) resulted in an unspecified calculation`);
});

const calcForBand = R.curry(
  (income, { floor, ceiling, rate }) => RD.multiply(
    slice(floor, ceiling, income),
    rate,
  ),
);

module.exports = (runDate) => {
  const bands = bandsOnDate(runDate || moment.utc());
  return R.compose(
    RD.sum,
    R.flip(R.map)(bands),
    calcForBand,
  );
};

// for unit tests
module.exports.bandsOnDate = bandsOnDate;
module.exports.slice = slice;
