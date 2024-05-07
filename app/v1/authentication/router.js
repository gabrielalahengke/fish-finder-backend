const router = require('express').Router();
const controller = require('./controller');

router.post('/register', controller.register);
router.post('/login', controller.login);
router.put('/token', controller.updateAccessToken);
router.post('/logout', controller.logout);

module.exports = router;
