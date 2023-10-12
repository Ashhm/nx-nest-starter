const path = require('path');
const nxPreset = require('@nx/jest/preset').default;
const glob = require('glob');

const extendMatchersSetupPaths = glob.sync('./libs/**/test/matchers/extend-matchers.setup.ts', {
  cwd: path.resolve(__dirname),
});

module.exports = {
  ...nxPreset,
  setupFilesAfterEnv: [
    path.resolve(__dirname, './tools/test/setups/seed.setup.js'),
    ...extendMatchersSetupPaths.map((setupPath) => path.resolve(__dirname, setupPath)),
  ],
};
