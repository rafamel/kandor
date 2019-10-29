const { scripts } = require('./project.config');
const { kpo } = require('kpo');

module.exports.scripts = {
  ...scripts,
  bootstrap: ['lerna bootstrap', kpo`build:common`],
  link: 'lerna link',
  build: [
    kpo`build:common`,
    kpo`@http-adapter build`,
    kpo`@ws-adapter build`,
    kpo`@ws-client build`
  ],
  'build:common': [
    kpo`@core build`,
    kpo`@intercepts build`,
    kpo`@rest build`,
    kpo`@rpc build`
  ],

  /* Hooks */
  postinstall: 'kpo bootstrap'
};
