'use strict';

define("dummy/tests/acceptance/setup-application-test-test", ["mocha", "ember-mocha", "chai", "@ember/test-helpers", "dummy/app", "dummy/config/environment", "ember-test-helpers/has-ember-version"], function (_mocha, _emberMocha, _chai, _testHelpers, _app, _environment, _hasEmberVersion) {
  "use strict";

  (0, _mocha.describe)('setupApplicationTest', function () {
    if (!(0, _hasEmberVersion.default)(2, 4)) {
      return;
    }

    (0, _testHelpers.setApplication)(_app.default.create(Object.assign({}, _environment.default.APP, {
      autoboot: false
    })));
    this.timeout(5000);
    (0, _mocha.describe)('acceptance test', function () {
      (0, _emberMocha.setupApplicationTest)();
      (0, _mocha.it)('can visit subroutes', async function () {
        await (0, _testHelpers.visit)('/');
        (0, _chai.expect)(this.element.querySelector('h2').textContent.trim()).to.be.empty;
        await (0, _testHelpers.visit)('/foo');
        (0, _chai.expect)(this.element.querySelector('h2').textContent.trim()).to.be.equal('this is an acceptance test');
      });
    });
    (0, _mocha.describe)('hooks API', function () {
      let hooks = (0, _emberMocha.setupApplicationTest)();
      (0, _mocha.it)('returns hooks API', function () {
        (0, _chai.expect)(hooks).to.respondTo('beforeEach').and.to.respondTo('afterEach');
      });
    });
  });
});
define("dummy/tests/helpers/destroy-app", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = destroyApp;

  function destroyApp(application) {
    Ember.run(application, 'destroy');
  }
});
define("dummy/tests/helpers/grep-for", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.grepFor = grepFor;

  /**
   * Captures mocha grep options for a. That way you can run describe
   * block or an `it` block that may narrow the mocha test run, but
   * those options will be reset afterwards. E.g.
   *
   *   var grep = grepFor(function() {
   *     it.skip('this is skipped');
   *   })
   *   console.log(grep) //=> /this is skipped/
  */
  function grepFor(fn) {
    var options = window.mocha.options;
    var originalMochaGrep = options.grep;

    try {
      fn();
      return options.grep;
    } finally {
      options.grep = originalMochaGrep;
    }
  }
});
define("dummy/tests/helpers/resolver", ["exports", "dummy/resolver", "dummy/config/environment", "ember-test-helpers"], function (_exports, _resolver, _environment, _emberTestHelpers) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.setResolverRegistry = setResolverRegistry;
  _exports.default = void 0;

  const Resolver = _resolver.default.extend({
    resolve: function (fullName) {
      return this.registry[fullName] || this._super.apply(this, arguments);
    },
    normalize: function (fullName) {
      return Ember.String.dasherize(fullName);
    }
  });

  const resolver = Resolver.create();
  resolver.namespace = {
    modulePrefix: _environment.default.modulePrefix,
    podModulePrefix: _environment.default.podModulePrefix
  };
  var _default = resolver;
  _exports.default = _default;
  (0, _emberTestHelpers.setResolver)(resolver);

  function setResolverRegistry(registry) {
    resolver.set('registry', registry);
  }
});
define("dummy/tests/helpers/start-app", ["exports", "dummy/app", "dummy/config/environment"], function (_exports, _app, _environment) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = startApp;

  function startApp(attrs) {
    let attributes = Ember.merge({}, _environment.default.APP);
    attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

    return Ember.run(() => {
      let application = _app.default.create(attributes);

      application.setupForTesting();
      application.injectTestHelpers();
      return application;
    });
  }
});
define("dummy/tests/test-helper", ["ember-mocha", "dummy/tests/helpers/resolver"], function (_emberMocha, _resolver) {
  "use strict";

  (0, _emberMocha.setResolver)(_resolver.default);
  (0, _emberMocha.start)();
});
define("dummy/tests/unit/it-test", ["ember-mocha", "mocha", "chai", "dummy/tests/helpers/grep-for"], function (_emberMocha, _mocha, _chai, _grepFor) {
  "use strict";

  function tryMochaSpecifier(fn) {
    try {
      fn();
      return null;
    } catch (e) {
      return e;
    }
  }

  var Mocha = window.mocha; ///////////////////////////////////////////////////////////////////////////////

  (0, _mocha.describe)('it', function () {
    (0, _emberMocha.it)('works with synchronous tests', function () {
      (0, _chai.expect)(true).to.equal(true);
    });
    (0, _emberMocha.it)('works with asynchronous tests using callbacks', function (done) {
      setTimeout(function () {
        (0, _chai.expect)(true).to.equal(true);
        done();
      }, 10);
    });
    (0, _emberMocha.it)('works with asynchronous tests using promises', function () {
      return new Ember.RSVP.Promise(function (resolve) {
        setTimeout(function () {
          (0, _chai.expect)(true).to.equal(true);
          resolve();
        }, 10);
      });
    });
    var pendingError = tryMochaSpecifier(function () {
      (0, _emberMocha.it)('is a pending spec');
    });
    (0, _emberMocha.it)('does not throw errors when you mark a pending spec', function () {
      (0, _chai.expect)(pendingError).to.be.null;
      var pendingSpec = window.mocha.suite.suites.find(function (suite) {
        return suite.tests.find(function (test) {
          return test.title === 'is a pending spec';
        });
      });
      (0, _chai.expect)(pendingSpec).to.be.ok;
    });
    (0, _emberMocha.it)('correctly sets mocha grep options for runing a single test case with.only', function () {
      (0, _chai.expect)(mochaGrep).to.match(/it runs this test/);
    });
    var mochaGrep = (0, _grepFor.grepFor)(function () {
      _emberMocha.it.only('runs this test');
    });
    var skippedError = tryMochaSpecifier(function () {
      _emberMocha.it.skip('is a skipped spec');
    });
    (0, _emberMocha.it)('skips tests with the .skip modifier', function () {
      (0, _chai.expect)(skippedError).to.be.null;
      var pendingSpec = Mocha.suite.suites.find(function (suite) {
        return suite.tests.find(function (test) {
          return test.title === 'is a skipped spec';
        });
      });
      (0, _chai.expect)(pendingSpec).to.exist;
    });

    var callback = function () {
      (0, _chai.expect)(callback.toString()).to.equal(wrapper.fn.toString());
    };

    var wrapper = (0, _emberMocha.it)('testing test report string representation', callback);
  });
});
define("dummy/tests/unit/setup-rendering-test-test", ["ember-mocha", "mocha", "chai", "@ember/test-helpers", "ember-test-helpers/has-ember-version"], function (_emberMocha, _mocha, _chai, _testHelpers, _hasEmberVersion) {
  "use strict";

  const PrettyColor = Ember.Component.extend({
    classNames: ['pretty-color'],
    attributeBindings: ['style'],
    style: Ember.computed('name', function () {
      return 'color: ' + this.get('name') + ';';
    }),
    actions: {
      paintItBlack() {
        this.set('name', 'black');
      }

    }
  });

  function setupRegistry(owner) {
    owner.register('component:x-foo', Ember.Component.extend());
    owner.register('component:pretty-color', PrettyColor);
    owner.register('template:components/pretty-color', Ember.HTMLBars.template(
    /*
      Pretty Color: <button {{action "paintItBlack"}}><span class="color-name">{{name}}</span></button>
    */
    {
      id: "49FhrTJh",
      block: "{\"symbols\":[],\"statements\":[[0,\"Pretty Color: \"],[7,\"button\",false],[3,\"action\",[[23,0,[]],\"paintItBlack\"]],[8],[7,\"span\",true],[10,\"class\",\"color-name\"],[8],[1,[22,\"name\"],false],[9],[9]],\"hasEval\":false}",
      meta: {}
    }));
  }

  (0, _mocha.describe)('setupRenderingTest', function () {
    if (!(0, _hasEmberVersion.default)(2, 4)) {
      return;
    }

    (0, _mocha.describe)('pretty-color', function () {
      (0, _emberMocha.setupRenderingTest)();
      (0, _mocha.beforeEach)(function () {
        setupRegistry(this.owner);
      });
      (0, _mocha.it)('renders with color', async function () {
        this.set('name', 'green');
        await (0, _testHelpers.render)(Ember.HTMLBars.template(
        /*
          {{pretty-color name=name}}
        */
        {
          id: "fnw/9+mD",
          block: "{\"symbols\":[],\"statements\":[[1,[28,\"pretty-color\",null,[[\"name\"],[[24,[\"name\"]]]]],false]],\"hasEval\":false}",
          meta: {}
        }));
        (0, _chai.expect)(this.element.textContent.trim()).to.equal('Pretty Color: green');
      });
      (0, _mocha.it)('renders when using standard setters', async function () {
        this.name = 'red';
        await (0, _testHelpers.render)(Ember.HTMLBars.template(
        /*
          {{pretty-color name=name}}
        */
        {
          id: "fnw/9+mD",
          block: "{\"symbols\":[],\"statements\":[[1,[28,\"pretty-color\",null,[[\"name\"],[[24,[\"name\"]]]]],false]],\"hasEval\":false}",
          meta: {}
        }));
        (0, _chai.expect)(this.element.textContent.trim()).to.equal('Pretty Color: red');
      });
      (0, _mocha.it)('renders a second time without', async function () {
        await (0, _testHelpers.render)(Ember.HTMLBars.template(
        /*
          {{pretty-color name=name}}
        */
        {
          id: "fnw/9+mD",
          block: "{\"symbols\":[],\"statements\":[[1,[28,\"pretty-color\",null,[[\"name\"],[[24,[\"name\"]]]]],false]],\"hasEval\":false}",
          meta: {}
        }));
        (0, _chai.expect)(this.element.textContent.trim()).to.equal('Pretty Color:');
      });
      (0, _mocha.it)('renders a third time with', async function () {
        this.set('name', 'blue');
        (0, _chai.expect)(this.get('name')).to.equal('blue');
        await (0, _testHelpers.render)(Ember.HTMLBars.template(
        /*
          {{pretty-color name=name}}
        */
        {
          id: "fnw/9+mD",
          block: "{\"symbols\":[],\"statements\":[[1,[28,\"pretty-color\",null,[[\"name\"],[[24,[\"name\"]]]]],false]],\"hasEval\":false}",
          meta: {}
        }));
        (0, _chai.expect)(this.element.textContent.trim()).to.equal('Pretty Color: blue');
      });
      (0, _mocha.it)('picks up changes to variables set on the context', async function () {
        this.set('name', 'pink');
        await (0, _testHelpers.render)(Ember.HTMLBars.template(
        /*
          {{pretty-color name=name}}
        */
        {
          id: "fnw/9+mD",
          block: "{\"symbols\":[],\"statements\":[[1,[28,\"pretty-color\",null,[[\"name\"],[[24,[\"name\"]]]]],false]],\"hasEval\":false}",
          meta: {}
        }));
        await (0, _testHelpers.click)('button');
        (0, _chai.expect)(this.element.textContent.trim()).to.equal('Pretty Color: black');
        (0, _chai.expect)(this.get('name')).to.equal('black');
        (0, _chai.expect)(this.name).to.equal('black');
      });
      (0, _mocha.it)('picks up changes to variables set on the context with a standard setter', async function () {
        this.name = 'pink';
        await (0, _testHelpers.render)(Ember.HTMLBars.template(
        /*
          {{pretty-color name=name}}
        */
        {
          id: "fnw/9+mD",
          block: "{\"symbols\":[],\"statements\":[[1,[28,\"pretty-color\",null,[[\"name\"],[[24,[\"name\"]]]]],false]],\"hasEval\":false}",
          meta: {}
        }));
        await (0, _testHelpers.click)('button');
        (0, _chai.expect)(this.element.textContent.trim()).to.equal('Pretty Color: black');
        (0, _chai.expect)(this.name).to.equal('black');
      });
    });
    (0, _mocha.describe)('hooks API', function () {
      let hooks = (0, _emberMocha.setupRenderingTest)();
      (0, _mocha.it)('returns hooks API', function () {
        (0, _chai.expect)(hooks).to.respondTo('beforeEach').and.to.respondTo('afterEach');
      });
    });
  });
});
define("dummy/tests/unit/setup-test-test", ["ember-mocha", "mocha", "chai", "@ember/test-helpers", "ember-test-helpers/has-ember-version"], function (_emberMocha, _mocha, _chai, _testHelpers, _hasEmberVersion) {
  "use strict";

  (0, _mocha.describe)('setupTest', function () {
    if (!(0, _hasEmberVersion.default)(2, 4)) {
      return;
    }

    (0, _mocha.describe)('context setup', function () {
      (0, _emberMocha.setupTest)();
      (0, _mocha.afterEach)(function () {
        (0, _chai.expect)(this.owner, 'Context does not leak between tests').to.be.undefined;
      });
      (0, _mocha.it)('sets up owner', function () {
        (0, _chai.expect)(this.owner, 'Owner exists').to.exist;
        this.owner.register('service:dummy', Ember.Service.extend({
          foo: 'bar'
        }));
        let subject = this.owner.lookup('service:dummy');
        (0, _chai.expect)(subject.get('foo')).to.equal('bar');
      });
      (0, _mocha.it)('has setters and getters', function () {
        (0, _chai.expect)(this).to.respondTo('get').and.to.respondTo('getProperties').and.to.respondTo('set').and.to.respondTo('setProperties');
        this.set('foo', 'bar');
        (0, _chai.expect)(this.get('foo')).to.equal('bar');
      });
    });
    (0, _mocha.describe)('pauseTest/resumeTest', function () {
      (0, _emberMocha.setupTest)();
      (0, _mocha.it)('can pause tests without timeouts', async function () {
        this.timeout(100);
        setTimeout(_testHelpers.resumeTest, 200); // resume test after timeout
        // make sure pauseTest does not wait forever, if resumeTest fails

        let timer = setTimeout(() => {
          throw new Error('resumeTest() did not work');
        }, 300);
        await (0, _testHelpers.pauseTest)();
        clearTimeout(timer);
      });
    });
    (0, _mocha.describe)('context in beforeEach/afterEach hooks', function () {
      // @todo will throw `this.get is not a function` if called after `setupRenderingTest()`
      (0, _mocha.afterEach)(function () {
        (0, _chai.expect)(this.get('name')).to.equal('blue');
      });
      (0, _emberMocha.setupTest)();
      (0, _mocha.beforeEach)(function () {
        this.set('name', 'red');
      });
      (0, _mocha.beforeEach)(function () {
        (0, _chai.expect)(this.get('name')).to.equal('red');
      });
      (0, _mocha.it)('has correct context', async function () {
        (0, _chai.expect)(this.get('name')).to.equal('red');
        this.set('name', 'blue');
      });
    });
    (0, _mocha.describe)('hooks API', function () {
      (0, _mocha.describe)('calls hooks in order', function () {
        let calledSteps = [];

        function setupFoo(hooks) {
          hooks.beforeEach(function () {
            (0, _chai.expect)(this.owner, 'Context is set up already').to.exist;
            (0, _chai.expect)(calledSteps).to.deep.equal([]);
            calledSteps.push('bE1');
          });
          hooks.afterEach(function () {
            (0, _chai.expect)(calledSteps, 'afterEach is called in LIFO order').to.deep.equal(['bE1', 'bE2', 'it', 'aE2']);
            calledSteps.push('aE1');
          });
        }

        (0, _mocha.after)(function () {
          (0, _chai.expect)(calledSteps, 'hooks are called in correct order').to.deep.equal(['bE1', 'bE2', 'it', 'aE2', 'aE1']);
        });
        let hooks = (0, _emberMocha.setupTest)();
        setupFoo(hooks);
        hooks.beforeEach(function () {
          (0, _chai.expect)(calledSteps, 'beforeEach is called in FIFO order').to.deep.equal(['bE1']);
          calledSteps.push('bE2');
        });
        hooks.afterEach(function () {
          (0, _chai.expect)(calledSteps, 'afterEach is called in LIFO order').to.deep.equal(['bE1', 'bE2', 'it']);
          calledSteps.push('aE2');
        });
        (0, _mocha.it)('calls beforeEach/afterEach in FIFO/LIFO order', function () {
          (0, _chai.expect)(calledSteps, 'it() is called after all beforeEach').to.deep.equal(['bE1', 'bE2']);
          calledSteps.push('it');
        });
      });
      (0, _mocha.describe)('is Promise aware', function () {
        let calledSteps = [];

        function delay(ms) {
          return new Ember.RSVP.Promise(resolve => setTimeout(resolve, ms));
        }

        (0, _mocha.after)(function () {
          (0, _chai.expect)(calledSteps, 'hooks are called in correct order').to.deep.equal(['bE1', 'bE2', 'it', 'aE2', 'aE1']);
        });
        let hooks = (0, _emberMocha.setupTest)();
        hooks.beforeEach(function () {
          (0, _chai.expect)(calledSteps, 'beforeEach waits for promise').to.deep.equal([]);
          return delay(10).then(() => calledSteps.push('bE1'));
        });
        hooks.beforeEach(function () {
          (0, _chai.expect)(calledSteps, 'beforeEach waits for promise').to.deep.equal(['bE1']);
          return delay(10).then(() => calledSteps.push('bE2'));
        });
        hooks.afterEach(function () {
          (0, _chai.expect)(calledSteps, 'afterEach waits for promise').to.deep.equal(['bE1', 'bE2', 'it', 'aE2']);
          return delay(10).then(() => calledSteps.push('aE1'));
        });
        hooks.afterEach(function () {
          (0, _chai.expect)(calledSteps, 'afterEach waits for promise').to.deep.equal(['bE1', 'bE2', 'it']);
          return delay(10).then(() => calledSteps.push('aE2'));
        });
        (0, _mocha.it)('beforeEach/afterEach chain up promises', function () {
          (0, _chai.expect)(calledSteps, 'it() is called after all beforeEach').to.deep.equal(['bE1', 'bE2']);
          calledSteps.push('it');
        });
      });
    });
  });
});
define("dummy/tests/unit/shims-test", ["mocha", "chai"], function (_mocha, _chai) {
  "use strict";

  (0, _mocha.describe)('mocha-shim', function () {
    (0, _mocha.describe)('beforeEach and afterEach', function () {
      (0, _mocha.beforeEach)(function () {
        this.beforeEachRunLoop = Ember.run.currentRunLoop;
      });
      (0, _mocha.afterEach)(function () {
        (0, _chai.expect)(Ember.run.currentRunLoop).to.be.ok;
      });
      (0, _mocha.it)('does use the runloop', function () {
        (0, _chai.expect)(this.beforeEachRunLoop).to.be.ok;
      });
    });
    (0, _mocha.describe)('before and after', function () {
      (0, _mocha.before)(function () {
        this.beforeRunLoop = Ember.run.currentRunLoop;
      });
      (0, _mocha.after)(function () {
        (0, _chai.expect)(Ember.run.currentRunLoop).to.be.null;
      });
      (0, _mocha.it)('do not use the runloop', function () {
        (0, _chai.expect)(this.beforeRunLoop).to.be.null;
      });
    });
    (0, _mocha.it)('should export global variables defined by mocha', function () {
      (0, _chai.expect)(_mocha.mocha).to.equal(window.mocha);
      (0, _chai.expect)(_mocha.describe).to.equal(window.describe);
      (0, _chai.expect)(_mocha.context).to.equal(window.context);
      (0, _chai.expect)(_mocha.it).to.equal(window.it);
      (0, _chai.expect)(_mocha.before).to.equal(window.before);
      (0, _chai.expect)(_mocha.after).to.equal(window.after);
      (0, _chai.expect)(_mocha.beforeEach.withoutEmberRun).to.equal(window.beforeEach);
      (0, _chai.expect)(_mocha.afterEach.withoutEmberRun).to.equal(window.afterEach);
    });
  });
});
define('dummy/config/environment', [], function() {
  var prefix = 'dummy';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(decodeURIComponent(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

require('dummy/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;
//# sourceMappingURL=tests.map
