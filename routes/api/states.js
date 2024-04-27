const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');
const verifyState = require('../../middleware/verifyState');

router.route('/')
    .get(statesController.getAllStates);

router.route('/:state')
    .get(verifyState, statesController.getState);

router.route('/:state/funfacts')
    .post(verifyState, statesController.createFunFact);

module.exports = router;