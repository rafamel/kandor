# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.5.0](https://github.com/rafamel/karmic/compare/v0.4.0...v0.5.0) (2019-11-24)


### Bug Fixes

* **core:** fixes Application.routes ([8d9a203](https://github.com/rafamel/karmic/commit/8d9a20350f5463c71fc5360825790548fd86dcb8))
* **core:** fixes Collection.reference ([16d7690](https://github.com/rafamel/karmic/commit/16d7690f6b69742d74c2c1b6f26e1fcc85c8820b))
* **core:** fixes Service.kind -redeclaring an inherited property set on super causes it to be undefi ([c2536da](https://github.com/rafamel/karmic/commit/c2536da5e02c3b72b42d3ffce6cba5e4a09e41c8))
* fixes core dependent packages ([c8ba0a7](https://github.com/rafamel/karmic/commit/c8ba0a7620b51b0ad4891d655ff42df14c616ac0))
* **core:** exports generate functions and PublicError from entry point ([e6385d2](https://github.com/rafamel/karmic/commit/e6385d2c03f0dd2adfc1cf9c904a255b0b3fc5a4))
* **core:** sets info parameter as required ElementInfo for Collection.toImplementation ([6317dca](https://github.com/rafamel/karmic/commit/6317dca8e12e225966e5f36503c371381e7bdc6a))
* **core:** sets info parameter as required ElementInfo for intercept and service resolve functions ([490f7d7](https://github.com/rafamel/karmic/commit/490f7d74984f23f9a42d074fe617dd7915480fec))


### Features

* **core:** adds ensure static method to classes ([8b54c5d](https://github.com/rafamel/karmic/commit/8b54c5db53b03836ac750b5bf2cf2b77efdac50b))
* **core:** makes query, mutation, and subscription static Service methods only take implementations ([abc1dea](https://github.com/rafamel/karmic/commit/abc1dea70894cd8b693742b821ff245f6e7f16a3))
* **core:** rewrites Types as Exception, Schema, and Children ([b373082](https://github.com/rafamel/karmic/commit/b3730824731fe4de601216d8d5abf81726a8f151))





# [0.4.0](https://github.com/rafamel/karmic/compare/v0.3.0...v0.4.0) (2019-11-19)


### Bug Fixes

* **core:** fixes circular dependencies ([7e80adb](https://github.com/rafamel/karmic/commit/7e80adb597578b9bbca75e4a9966f61f37b8b8b1))
* **core, rpc:** takes object inheritance into account when evaluating input objects ([622d709](https://github.com/rafamel/karmic/commit/622d70920dc4d58513d6e72ef3f25474765ddcd7))


### Features

* **core:** adds getSchemas and validator utils ([2782855](https://github.com/rafamel/karmic/commit/2782855970bd5ac40d5d2aa243c27d303f7c1506))
* **core:** implements service errors as arrays; removes references create function; adds item create ([867f579](https://github.com/rafamel/karmic/commit/867f5793137db74e6378116984883d6ee9875982))
* **core:** moves types to service object root; inline types must be schemas ([89b1c4f](https://github.com/rafamel/karmic/commit/89b1c4f07c15e71fdafde45ed1fae3818f37578d))
* **rpc:** updates to use latest core api ([4962855](https://github.com/rafamel/karmic/commit/4962855854b6e1b7f42d964539023b394810726c))





# [0.3.0](https://github.com/rafamel/karmic/compare/v0.2.0...v0.3.0) (2019-11-06)


### Bug Fixes

* **rest/server:** passes adequate data object to resolvers depending on method and params ([90576de](https://github.com/rafamel/karmic/commit/90576decd9f4bd294335689ca58f411b4c98545e))
* **rpc/client:** fixes parsing of responses with falsy result values ([3f49070](https://github.com/rafamel/karmic/commit/3f490702ff4fb60e8c33cd7cfc7a7627b2cfb39e))
* **ws-client:** works with browser native WebSockets ([29bb394](https://github.com/rafamel/karmic/commit/29bb394bb39d09b0caf34c5769e095051b089164))


### Features

* **ws-client, ws-adapter:** allows to pass a context object as an address query parameter ([653d45a](https://github.com/rafamel/karmic/commit/653d45a1e740dd77111ea1e1128375786b0a969d))





# [0.2.0](https://github.com/rafamel/karmic/compare/v0.1.0...v0.2.0) (2019-11-02)


### Bug Fixes

* **ws-client:** fixes reconnect reaching max call stack ([db2f859](https://github.com/rafamel/karmic/commit/db2f859f4c94d32b6dbaeb77c25de7b616c35ad4))
* updates setup, dependencies, and support for Node 12 ([0c2e60b](https://github.com/rafamel/karmic/commit/0c2e60bb0aba07de4fcc67dff85c8cd5ebd54e38))
* **rest/server:** removes unimplemented declaration option ([a4080b3](https://github.com/rafamel/karmic/commit/a4080b35df41d480814ee9150c2dffcf496c576b))


### Features

* **rpc/client:** batches requests ([e5aa664](https://github.com/rafamel/karmic/commit/e5aa6643b64c96198dd86c8b92fa64c47be3848f))
* **rpc/client:** takes in batch responses ([95ccfff](https://github.com/rafamel/karmic/commit/95ccfffe0a0d7bf95aab74d7e50b382209b87700))
* **rpc/server:** emits an error if a call subscription completes before emitting any value ([46d878c](https://github.com/rafamel/karmic/commit/46d878c784df6b0797c799c8815877f6bb56f012))
* **rpc/server:** takes in stream batch requests ([00a7bc7](https://github.com/rafamel/karmic/commit/00a7bc770983cda8e0cd60c4105194be5769394e))





# 0.1.0 (2019-10-29)


### Bug Fixes

* **core:** fixes circular dependencies ([bf81644](https://github.com/rafamel/karmic/commit/bf81644f7dea3cfee91ed695b611d42146836535))
* **core:** fixes client generate by not applying map for default on application ([ffeb61b](https://github.com/rafamel/karmic/commit/ffeb61b64ef059f6e6976ae8232e1823231f36af))
* **core:** uses take operator when transforming observables into promises ([5ce0ffc](https://github.com/rafamel/karmic/commit/5ce0ffc4220b1edcf2ba732bab3b5d9116add387))
* **core/create:** fixes input intercept types ([1de6069](https://github.com/rafamel/karmic/commit/1de60697f9cd9021173a62389de576684de90153))
* **core/create:** fixes intercepts ([1015d0b](https://github.com/rafamel/karmic/commit/1015d0b24fa944659e27365d1bc732f3b845e7dc))
* **core/create:** fixes scopes ([88bf5dc](https://github.com/rafamel/karmic/commit/88bf5dc6929161ad5f6fae5bb60bb75976cec82d))
* **core/create:** fixes service ([1398c1a](https://github.com/rafamel/karmic/commit/1398c1a9ce099d584f609b0217b5da19807448ca))
* **core/generate:** fixes typings ([79196ca](https://github.com/rafamel/karmic/commit/79196cace07efc6922400b8858bc17e8480d4ba4))
* rejects when observables complete before they emit a value; adds toSafePromise util ([0ba9472](https://github.com/rafamel/karmic/commit/0ba94724bec4583dfcfad79f0721605b97f65acb))
* **core/generate:** typings takes headComments option ([a7c0faa](https://github.com/rafamel/karmic/commit/a7c0faad893142c7233d9e118f395d9cdab0d7a9))
* **core/transform:** fixes normalize ([039a929](https://github.com/rafamel/karmic/commit/039a92953c3568c4822a48e97a0591d0d1fdccb1))
* **core/transform:** fixes replace ([f44035f](https://github.com/rafamel/karmic/commit/f44035fd69e9ff51549528baf7f8cf08704f3e98))
* **core/transform:** fixes response normalization ([5bde885](https://github.com/rafamel/karmic/commit/5bde88540efba5c313a79c35e3557388f83434fb))
* **core/transform:** fixes routes options declaration ([397d866](https://github.com/rafamel/karmic/commit/397d866aadd985eaf76ff61a5e120f4324c54d3d))
* **core/transform:** toImplementation callback must return a ServiceImplementation ([104dc26](https://github.com/rafamel/karmic/commit/104dc264b1ee7784547f0a590ae563a7ffa82b43))
* **core/types:** removes InterceptImplementation types for ServiceImplementation, as they caused conflicts with never returning resolves ([b1a7606](https://github.com/rafamel/karmic/commit/b1a760643bf680500b40bd9c01f56dd5385b04f0))
* **rpc/client:** exports types ([4c28998](https://github.com/rafamel/karmic/commit/4c28998f0a5e2b179bd728264982042854032eba))


### Features

* adds create types ([b0e9a2d](https://github.com/rafamel/karmic/commit/b0e9a2d9571e78cb51c6101d3f6590b777d4dca7))
* **core/transform:** adds toUnary ([3e4560f](https://github.com/rafamel/karmic/commit/3e4560fa3164a010f2c8646cbb1b6629109f1fa7))
* adds services tree types ([1d5d7a7](https://github.com/rafamel/karmic/commit/1d5d7a7b60a49f2449298cdc5d44ce292401df90))
* **core:** adds 'ServerGateway' as ServerErrorCode ([018c64f](https://github.com/rafamel/karmic/commit/018c64f8c333dce49bce9a02689d9bb9cf20bd02))
* **core:** adds create application and allof for intercepts ([5b13c7f](https://github.com/rafamel/karmic/commit/5b13c7f246737484421cf22c18ae87c2489c1677))
* **core:** adds default service to Application ([5ec0d59](https://github.com/rafamel/karmic/commit/5ec0d59a8672a5c1645908710999012d3969691c))
* **core:** adds explicit interfaces for create functions options ([f1e229d](https://github.com/rafamel/karmic/commit/f1e229d0d94f7b67a0c7093ddf9119c5fd6cff64))
* **core:** adds flow control via next for replace and traverse ([e434dbb](https://github.com/rafamel/karmic/commit/e434dbb73a9d98606338048db9c3c667bef02c76))
* **core:** adds hook function ([7faac2e](https://github.com/rafamel/karmic/commit/7faac2e3b9dde80e62032f2737eb2a1f96b120f8))
* **core:** adds input types for error, request, response ([734e70c](https://github.com/rafamel/karmic/commit/734e70ca49b18b8832ccf350cbabc62eb08a7a81))
* **core:** adds options for validation and normalization ([c0d80ce](https://github.com/rafamel/karmic/commit/c0d80ce7de35d9332b91b466a7aba145cada6e42))
* **core:** adds PublicError and generateErrors ([d2fbce2](https://github.com/rafamel/karmic/commit/d2fbce24eb82134f93cf88ff5208dbe03e4dcf8a))
* **core:** adds replace; modifies traverse api ([ab3b3bd](https://github.com/rafamel/karmic/commit/ab3b3bd1b1e94803625dba22f78b2b4ef3b95a0b))
* **core:** adds resolvableWait and safeTrigger utils ([dd35d51](https://github.com/rafamel/karmic/commit/dd35d5110b1f8e931080b01e41e19bb0ee8f612a))
* **core:** adds routes transform ([a8e6524](https://github.com/rafamel/karmic/commit/a8e6524d25fb3e6596c2c3941829753af6a82c3b))
* **core:** allows intercepts and scopes functions to take a CollectionTree ([7bf98da](https://github.com/rafamel/karmic/commit/7bf98dab30d95db605bcac8b563345b621310653))
* **core:** allows service types to take schemas ([d8fe60a](https://github.com/rafamel/karmic/commit/d8fe60a42e6a98a8650d0f7c98ac5478a5caceda))
* **core:** changes ErrorCode to ErrorLabel; adds ClientInvalid and ClientLegal error labels ([75c8098](https://github.com/rafamel/karmic/commit/75c80987dfb6863c3846aee27620548e8a60ecd5))
* **core:** full core rewrite ([2808e39](https://github.com/rafamel/karmic/commit/2808e39fd43dcbbedb0c1c38cb6f6f81653c7e09))
* **core:** intercepts info object contains the service kind ([701802c](https://github.com/rafamel/karmic/commit/701802c4f1943665bd713dfcc2ff3f17f00b4073))
* **core:** parametizes elements for services types ([38b1d89](https://github.com/rafamel/karmic/commit/38b1d8911f7e09b8395dc5d0ad74841b4707dae6))
* **core:** redesigns core api ([5684278](https://github.com/rafamel/karmic/commit/56842788423dc70a014bf143b73d14d0ecaef28a))
* **core:** removes generateErrors; adds CollectionError ([221e85d](https://github.com/rafamel/karmic/commit/221e85df29bff17362d4e12fe1b52cb93bdf3570))
* **core:** rewrites a large part of karmic's core ([66f33e4](https://github.com/rafamel/karmic/commit/66f33e407955cba1857914b53a57bc6f57742db8))
* **core:** rewrites core; simplifies collection structure ([b30f91a](https://github.com/rafamel/karmic/commit/b30f91a9b07341b62682780704510833f9b39284))
* **core:** sets default response type as null; maps undefined to null on services ([6577ec6](https://github.com/rafamel/karmic/commit/6577ec62b1bdc3e4e460a094cf03666ca8c9ced6))
* **core/application:** adds Application.flatten ([c3538b7](https://github.com/rafamel/karmic/commit/c3538b7b884bbcd9ad952e0d8f6a159a5b0ad6c7))
* **core/create:** adds both ServerError and ClientError to collection on application ([b826046](https://github.com/rafamel/karmic/commit/b82604635f303b8e3942e32d5267b073bde5ea4d))
* **core/create:** adds default InternalServerError and intercepts errors on application ([819a4b7](https://github.com/rafamel/karmic/commit/819a4b7a62a89bfbfcaa6aa3bbe5fc08311dc048))
* **core/create:** adds descriptions to all create functions ([9e5fb87](https://github.com/rafamel/karmic/commit/9e5fb87c9c5a702f635442669aa105ec24f9ee06))
* **core/create:** adds extract ([b39c5c6](https://github.com/rafamel/karmic/commit/b39c5c6b551ed8db04d9cd063b080068ba7870e9))
* **core/create:** adds optional validation to application ([6061a2d](https://github.com/rafamel/karmic/commit/6061a2dc398f1754b2403875b8087f186c9b8be1))
* **core/create:** adds schema ([50d8573](https://github.com/rafamel/karmic/commit/50d85734526bdb2c47283d4fd640b3c85fad3cb9))
* **core/create:** adds select ([9ae0d9e](https://github.com/rafamel/karmic/commit/9ae0d9e454e6ccdab1e471086f13578457ff9cf3))
* **core/create:** allows second argument of intercepts to be a single intercept ([433726a](https://github.com/rafamel/karmic/commit/433726afe3cc4f348c6b0662564477aa4e19d2e4))
* **core/create:** application doesn't normalize collection; refactors application ([8dcdd4e](https://github.com/rafamel/karmic/commit/8dcdd4e07ad109a70f892ae349c4cad4fc20bdfb))
* **core/create:** doesn't add an empty intercept array by default on service creation ([e8206c0](https://github.com/rafamel/karmic/commit/e8206c037d58c3b7c88386420d09196f9aef75e4))
* **core/create:** ensures collection has scope on extract ([dcdfddc](https://github.com/rafamel/karmic/commit/dcdfddccc1ec2fe67e3a7086453235f41855157b))
* **core/create:** renames collection to collections ([bde7ed9](https://github.com/rafamel/karmic/commit/bde7ed9a4a67df29d2d56a6efffe439f73d33296))
* **core/create:** schema allows to specify additionalProperties; schema only sets type as "object" ([8b947e5](https://github.com/rafamel/karmic/commit/8b947e5b511688fb4fdc2bb5300a2d4d2a67fc08))
* **core/errors:** PublicError and CollectionError constructors take a last argument to clear the stack ([5f3099e](https://github.com/rafamel/karmic/commit/5f3099e13c9d3ca47cc48198d8a16e6d83b0b253))
* **core/generate:** adds client ([9c684c4](https://github.com/rafamel/karmic/commit/9c684c4bf273c15eedb53c6b5b33c33beaaac047))
* **core/generate:** adds eslint-disable to generated types; removes previous banner comment ([95d5a1a](https://github.com/rafamel/karmic/commit/95d5a1ac0046f2c7b931238ab7a95e92f4bc8241))
* **core/generate:** client generates Application client factory by default ([f04a018](https://github.com/rafamel/karmic/commit/f04a0182b92fe38966a694f4f299747b822fd4b0))
* **core/generate:** generate functions take a collection or a collection promise ([379bc11](https://github.com/rafamel/karmic/commit/379bc112f942c3dc4cb405f03c2e77d7dab894f8))
* **core/inspect:** adds atPath and atRoute ([d5985c4](https://github.com/rafamel/karmic/commit/d5985c4589f71eabdefeefb961fae644fc4142f7))
* **core/inspect:** adds isTreeImplementation ([7314761](https://github.com/rafamel/karmic/commit/73147610503645bfeeb66d2adaa965fd9a36b1e0))
* **core/inspect:** adds validate ([d0a547a](https://github.com/rafamel/karmic/commit/d0a547aeb18b36f0849d4301a26b72f2e4f34035))
* **core/transform:** adds asImplementation and asDeclaration ([62390ad](https://github.com/rafamel/karmic/commit/62390ad6c214f531c641900f73ed47b77147165b))
* **core/transform:** adds filter ([6074e8b](https://github.com/rafamel/karmic/commit/6074e8b7b33385568032b8aa3a2e5a38473d3fc4))
* **core/transform:** adds normalize ([1b0228e](https://github.com/rafamel/karmic/commit/1b0228e376aab2d97d566c35e43c4574947b5c14))
* **core/transform:** doesn't change type names on normalize ([3bc8d64](https://github.com/rafamel/karmic/commit/3bc8d64b5499c4ab9286e731b6f9bf18b5753cb1))
* **core/transform:** improves normalize ([79553ad](https://github.com/rafamel/karmic/commit/79553ada06759523d20bb498598eb34cd791f754))
* **core/transform:** normalize also takes intercepts into account ([5a4f525](https://github.com/rafamel/karmic/commit/5a4f525f1bd83da97b8f67c656f118806197ce87))
* **core/transform:** renames asImplementation and asDeclaration to toImplementation and toDeclaration ([f697ba9](https://github.com/rafamel/karmic/commit/f697ba9dca7ea98170ef594ec33c3a2fc6742516))
* **core/transform:** renames routes as route ([186d38e](https://github.com/rafamel/karmic/commit/186d38e791cdae4d22281b6f3f67bcc9a2f2b806))
* **core/transform:** routes produces children routes ([c68dade](https://github.com/rafamel/karmic/commit/c68dadeb41ad322894177c4120327483d3f7948d))
* **core/transform:** routes returns collection, routes, and tree ([3fa7bdd](https://github.com/rafamel/karmic/commit/3fa7bdd5958f938cd82440fa2c1df11cd5b1d93f))
* **core/utils:** traverse passes trees to callback ([e112fa9](https://github.com/rafamel/karmic/commit/e112fa91d8908bc24d56fa287abf6cd4bbfcc24e))
* **create:** adds collection, scope, and services ([502c98b](https://github.com/rafamel/karmic/commit/502c98be3088f4504d61bdaf403dd11522b3222b))
* **create:** adds schema ([bab385d](https://github.com/rafamel/karmic/commit/bab385d8aa394369d25625c26c0944237397d1a7))
* **create:** adds service ([567a7c4](https://github.com/rafamel/karmic/commit/567a7c46cb7ad311931d343750cfbd42b0e573c9))
* **create:** adds type ([08f7d4d](https://github.com/rafamel/karmic/commit/08f7d4d8bed93ae230e4ffc811856c9bf9338bc5))
* **http-adapter:** adds rpc adapter ([e347a05](https://github.com/rafamel/karmic/commit/e347a057b84ee9de606f5df291055d28925316e9))
* **rpc-client:** adds reproduce ([ee26db7](https://github.com/rafamel/karmic/commit/ee26db7a9a5fe3905a517c68e00e13722ed19618))
* moves rpc-adapter and rpc-client packages to ws-adapter and ws-client; uses rpc common abstrac ([2da15ec](https://github.com/rafamel/karmic/commit/2da15ec1a2bf6b247faf7df36ef5a8e362690d13))
* **http-adapter:** moves rest-adapter pacakge to http-adapter; refactors to use RESTServer and be connect compatible ([fd248df](https://github.com/rafamel/karmic/commit/fd248dffe133151557c93a97cb7be1922f95fb05))
* **intercepts:** adds logging ([321908f](https://github.com/rafamel/karmic/commit/321908f69d11448243a7ff60cbd7ed130e690cea))
* **intercepts:** adds validation ([ef79491](https://github.com/rafamel/karmic/commit/ef79491d093b7a9c9e2f395c6108b1562a76e141))
* **rest-adapter:** adds adapter ([9c1ffd9](https://github.com/rafamel/karmic/commit/9c1ffd92d0d277f53a687a10c33a17cb804144de))
* **rest-adapter:** adds error map ([1e59d01](https://github.com/rafamel/karmic/commit/1e59d01402fab05bbf12941c95fa68332d14cd2e))
* **rest-adapter:** adds types and defaults ([75d9534](https://github.com/rafamel/karmic/commit/75d95343d4e4e63bd7c46e4aefaa6cf1afa491f9))
* **rest/server:** adds RESTServer ([39d34b0](https://github.com/rafamel/karmic/commit/39d34b06c5b5325f892361fd9e66ace5a8050071))
* **rpc:** adds data types ([aa2835d](https://github.com/rafamel/karmic/commit/aa2835d3d455144646c07b9335a6b88ecf409254))
* **rpc:** adds JSON-RPC error dictionary ([d2d49ad](https://github.com/rafamel/karmic/commit/d2d49ad5e40fe3267e27fcdcf5368d92523ccf07))
* **rpc:** adds protocol types ([6f7c4d8](https://github.com/rafamel/karmic/commit/6f7c4d879745a444f9967986058333e0bbeec973))
* **rpc:** adds RPC schemas validation ([45d3a62](https://github.com/rafamel/karmic/commit/45d3a62e69e8d45c34b658c43f52c1ddacd1b08b))
* **rpc-adapter:** adds adapter ([b609187](https://github.com/rafamel/karmic/commit/b609187a76f8bd79366b64be11c8412af2734330))
* **rpc-adapter:** adds ChannelManager ([6ea08d2](https://github.com/rafamel/karmic/commit/6ea08d2b256ff2e352df8220956e9196447dc4ef))
* **rpc-adapter:** adds option types and defaults ([c61398b](https://github.com/rafamel/karmic/commit/c61398b2a48059dabda2de9d50abbccea05e768f))
* **rpc-adapter:** adds rpc request and response types ([e0fdf38](https://github.com/rafamel/karmic/commit/e0fdf381bef2c768efa7a9a47d47261b884a4bf3))
* **rpc-client:** adds client ([6c17da7](https://github.com/rafamel/karmic/commit/6c17da7789a1bc41396825b89da4a69ad3fd4450))
* **rpc-client:** adds client connect ([6f780bf](https://github.com/rafamel/karmic/commit/6f780bffa0acc8eab8d5f279731841ba519a38c4))
* **rpc-client:** adds client option types and defaults ([18b3e1b](https://github.com/rafamel/karmic/commit/18b3e1bf84a822f25d847165c7f72ddfdf001700))
* **rpc-client:** adds ClientManager ([045954b](https://github.com/rafamel/karmic/commit/045954bd39facfe6b4fc032031f56b23bae2038f))
* **rpc-client:** adds generate ([f6cca63](https://github.com/rafamel/karmic/commit/f6cca6397b0d63085b05a5575666ebef8a7d1f85))
* **rpc-client:** adds obtain ([0aff68f](https://github.com/rafamel/karmic/commit/0aff68f3e810cb1c78be6e5d81d4d6cd09bc397d))
* **rpc-client:** adds rpc-client package ([2280b41](https://github.com/rafamel/karmic/commit/2280b412f0a9aefbb30577063b817c963569d145))
* **rpc/client:** adds client types and defaults ([01985b2](https://github.com/rafamel/karmic/commit/01985b2ce2b142a3918694bcbb57c8112ce97b28))
* **rpc/client:** adds ClientManager ([2d07c91](https://github.com/rafamel/karmic/commit/2d07c91f1c1fcc0cef53689036dd847701719e24))
* **rpc/client:** adds generate, obtain, and reproduce functions ([bf028c8](https://github.com/rafamel/karmic/commit/bf028c8d1922d83d683fd18a38c6d7f3229438bc))
* **rpc/client:** adds RPCClient ([21f7a66](https://github.com/rafamel/karmic/commit/21f7a66d06d6981dc14aa82f44df1c4ffff4fbfe))
* **rpc/errors:** adds server errors ([8f12562](https://github.com/rafamel/karmic/commit/8f12562c280e096e87e8178ea993be0c031a5451))
* **rpc/server:** adds ChannelManager ([81daabc](https://github.com/rafamel/karmic/commit/81daabc287d6858c8a13f266318f7104b953d290))
* **rpc/server:** adds RPCServer ([bc545c6](https://github.com/rafamel/karmic/commit/bc545c6ecd7df27bae36118d9c8168220ed09f3d))
* **rpc/server:** adds server types and defaults ([3d546ba](https://github.com/rafamel/karmic/commit/3d546ba96f604d5dbd6408656b895cc60cab580c))
