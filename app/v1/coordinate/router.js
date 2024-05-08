const router = require('express').Router();
const controller = require('./controller');

router.post('/', controller.createCoordinate);
router.get('/user/:id', controller.getCoordinatePointByUserId);
router.delete('/:id', controller.deleteCoordinateById);
module.exports = router;
