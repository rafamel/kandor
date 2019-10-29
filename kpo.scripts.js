const { scripts } = require('./project.config');
const { kpo } = require('kpo');

module.exports.scripts = {
  ...scripts,
  bootstrap: ['lerna bootstrap', kpo`build`],
  link: 'lerna link',
  build: [
    kpo`@core build`,
    kpo`@intercepts build`,
    kpo`@rest build`,
    kpo`@rpc build`,
    kpo`@rest-adapter build`,
    kpo`@ws-adapter build`,
    kpo`@ws-client build`
  ],

  /* Hooks */
  postinstall: 'kpo bootstrap'
};
