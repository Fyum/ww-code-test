const { Router } = require('express');
const setIncome = require('../../../middleware/set-income');
const setRunDate = require('../../../middleware/set-run-date');
const calculateNI = require('../../../middleware/calculate-ni');

module.exports = () => {
  const api = Router();

  api.post(
    '/national-insurance',
    setIncome,
    setRunDate,
    calculateNI,
  );

  return api;
};
