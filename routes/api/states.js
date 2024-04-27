const express = require('express');
const router = express.Router();
const statesController = require('../../controllers/statesController');
const verifyState = require('../../middleware/verifyState');

router.route('/')
    .get(statesController.getAllStates)
    //.post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.createNewEmployee)
    //.put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.updateEmployee)
    //.delete(verifyRoles(ROLES_LIST.Admin), employeesController.deleteEmployee);

//app.use(verifyState);
router.route('/:state')
    .get(verifyState, statesController.getState);

module.exports = router;