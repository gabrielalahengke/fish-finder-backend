const router = require('express').Router();
const controller = require('./controller');

router.post('/', controller.createCoordinate);
router.get('/user/:id', controller.getCoordinatePointByUserId);

module.exports = router;
