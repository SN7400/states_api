const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');
const verifyState = require('../../middleware/verifyState');

router.route('/')
    .get(statesController.getAllStates);

router.route('/:state')
    .get(verifyState, statesController.getState);

router.route('/:state/funfact')
    .get(verifyState, statesController.getFunFact)
    .post(verifyState, statesController.createFunFact)
    .patch(verifyState, statesController.updateFunFact)
    .delete(verifyState, statesController.deleteFunFact);

module.exports = router;