# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.5.0](https://github.com/rafamel/karmic/compare/v0.4.0...v0.5.0) (2019-11-24)


### Bug Fixes

* fixes core dependent packages ([c8ba0a7](https://github.com/rafamel/karmic/commit/c8ba0a7620b51b0ad4891d655ff42df14c616ac0))


### Features

* **core:** adds ensure static method to classes ([8b54c5d](https://github.com/rafamel/karmic/commit/8b54c5db53b03836ac750b5bf2cf2b77efdac50b))





# [0.4.0](https://github.com/rafamel/karmic/compare/v0.3.0...v0.4.0) (2019-11-19)


### Bug Fixes

* **core, rpc:** takes object inheritance into account when evaluating input objects ([622d709](https://github.com/rafamel/karmic/commit/622d70920dc4d58513d6e72ef3f25474765ddcd7))


### Features

* **core:** implements service errors as arrays; removes references create function; adds item create ([867f579](https://github.com/rafamel/karmic/commit/867f5793137db74e6378116984883d6ee9875982))
* **rpc:** updates to use latest core api ([4962855](https://github.com/rafamel/karmic/commit/4962855854b6e1b7f42d964539023b394810726c))





# [0.3.0](https://github.com/rafamel/karmic/compare/v0.2.0...v0.3.0) (2019-11-06)


### Bug Fixes

* **rpc/client:** fixes parsing of responses with falsy result values ([3f49070](https://github.com/rafamel/karmic/commit/3f490702ff4fb60e8c33cd7cfc7a7627b2cfb39e))





# [0.2.0](https://github.com/rafamel/karmic/compare/v0.1.0...v0.2.0) (2019-11-02)


### Bug Fixes

* updates setup, dependencies, and support for Node 12 ([0c2e60b](https://github.com/rafamel/karmic/commit/0c2e60bb0aba07de4fcc67dff85c8cd5ebd54e38))


### Features

* **rpc/client:** batches requests ([e5aa664](https://github.com/rafamel/karmic/commit/e5aa6643b64c96198dd86c8b92fa64c47be3848f))
* **rpc/client:** takes in batch responses ([95ccfff](https://github.com/rafamel/karmic/commit/95ccfffe0a0d7bf95aab74d7e50b382209b87700))
* **rpc/server:** emits an error if a call subscription completes before emitting any value ([46d878c](https://github.com/rafamel/karmic/commit/46d878c784df6b0797c799c8815877f6bb56f012))
* **rpc/server:** takes in stream batch requests ([00a7bc7](https://github.com/rafamel/karmic/commit/00a7bc770983cda8e0cd60c4105194be5769394e))





# 0.1.0 (2019-10-29)


### Bug Fixes

* **rpc/client:** exports types ([4c28998](https://github.com/rafamel/karmic/commit/4c28998f0a5e2b179bd728264982042854032eba))


### Features

* **rpc:** adds data types ([aa2835d](https://github.com/rafamel/karmic/commit/aa2835d3d455144646c07b9335a6b88ecf409254))
* **rpc:** adds JSON-RPC error dictionary ([d2d49ad](https://github.com/rafamel/karmic/commit/d2d49ad5e40fe3267e27fcdcf5368d92523ccf07))
* **rpc:** adds protocol types ([6f7c4d8](https://github.com/rafamel/karmic/commit/6f7c4d879745a444f9967986058333e0bbeec973))
* **rpc:** adds RPC schemas validation ([45d3a62](https://github.com/rafamel/karmic/commit/45d3a62e69e8d45c34b658c43f52c1ddacd1b08b))
* **rpc/client:** adds client types and defaults ([01985b2](https://github.com/rafamel/karmic/commit/01985b2ce2b142a3918694bcbb57c8112ce97b28))
* **rpc/client:** adds ClientManager ([2d07c91](https://github.com/rafamel/karmic/commit/2d07c91f1c1fcc0cef53689036dd847701719e24))
* **rpc/client:** adds generate, obtain, and reproduce functions ([bf028c8](https://github.com/rafamel/karmic/commit/bf028c8d1922d83d683fd18a38c6d7f3229438bc))
* **rpc/client:** adds RPCClient ([21f7a66](https://github.com/rafamel/karmic/commit/21f7a66d06d6981dc14aa82f44df1c4ffff4fbfe))
* **rpc/errors:** adds server errors ([8f12562](https://github.com/rafamel/karmic/commit/8f12562c280e096e87e8178ea993be0c031a5451))
* **rpc/server:** adds ChannelManager ([81daabc](https://github.com/rafamel/karmic/commit/81daabc287d6858c8a13f266318f7104b953d290))
* **rpc/server:** adds RPCServer ([bc545c6](https://github.com/rafamel/karmic/commit/bc545c6ecd7df27bae36118d9c8168220ed09f3d))
* **rpc/server:** adds server types and defaults ([3d546ba](https://github.com/rafamel/karmic/commit/3d546ba96f604d5dbd6408656b895cc60cab580c))
