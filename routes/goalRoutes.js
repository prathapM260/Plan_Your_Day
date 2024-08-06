const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');
// const {updateGoal } = require('../controllers/goalController');


// Define routes
router.get('/', goalController.getGoals);
router.post('/', goalController.createGoal);
// router.put('/:id', goalController.updateGoal);
router.put('/:id', goalController.updateGoal);

router.delete('/:id', goalController.deleteGoal);


module.exports = router;
