const crypto = require('crypto');

const testFileName = expect.getState().testPath.split('/').pop();
if (!process.env.TEST_SEED) {
  process.env.TEST_SEED = crypto.createHash('sha256').update(testFileName).digest('hex');
}
