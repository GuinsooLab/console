require('../typedefs');
const router = require('express').Router();
const mustBeAdmin = require('../middleware/must-be-admin');
const wrap = require('../lib/wrap');
const ConnectionClient = require('../lib/connection-client');

/**
 * A non-error response is considered a success or valid connection config
 * @param {Req} req
 * @param {Res} res
 */
async function testConnection(req, res) {
  const connectionClient = new ConnectionClient(
    { ...req.body, maxRows: 1 },
    req.user
  );
  // testConnection will throw if configuration is invalid
  // This is expected
  // An assumption is made that this is due to user-input error
  // TODO - separate connection config error from internal server error
  try {
    await connectionClient.testConnection();
    res.utils.data();
  } catch (error) {
    res.utils.error(error);
  }
}

router.post('/api/test-connection', mustBeAdmin, wrap(testConnection));

module.exports = router;
