const { scripts } = require('./project.config');
const { kpo } = require('kpo');

module.exports.scripts = {
  ...scripts,
  bootstrap: ['lerna bootstrap', kpo`build`],
  link: 'lerna link',
  build: [
    kpo`@core build`,
    kpo`@rest-adapter build`,
    kpo`@rpc-adapter build`,
    kpo`@rpc-client build`
  ],

  /* Hooks */
  postinstall: 'kpo bootstrap'
};
