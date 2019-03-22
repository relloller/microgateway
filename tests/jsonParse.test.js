// jsonParse.test.js

describe("error actions - products from server", done => {
  before(done => {
    get(
      {
        source: asdfFilePath,
        keys: { key, secret }
      },
      function(err, config) {
        console.log("err", err);
        assert.equal(err, null);
        opts.productName = "EdgeMicroPOISON2";
        opts.productDesc = 'EdgeMicroPOISON2"';
        opts.scopes = '"x,,';
        opts.proxies = "edgemicro-auth,edgemicro_hello";
        opts.environments = "test";
      }
    );
    sdk.createProduct(opts).then(
      function(result) {
        setTimeout(done, 5000);
      },
      function(err) {
        //product creation failed
        console.log("err", err);
        setTimeout(done, 5000);
      }
    );
  });
});

after(done => {
  opts.productName = "EdgeMicroPOISON2";
  opts.productDesc = 'EdgeMicroPOISON2"';
  opts.proxies = "edgemicro-auth,edgemicro_hello";
  opts.environments = "test";
  sdk.deleteProduct(opts).then(
    function(result) {
      setTimeout(done, 5000);
    },
    function(err) {
      //product creation failed
      assert.equal(true, false);

      console.log("err", err);
    }
  );
});

it("does not apply updates which are not valid JSON", done => {
  get(
    {
      // source: def,
      keys: { key, secret }
    },
    function(err, config) {
      if (err) console.log(err);

      assert.equal(err, null);
      console.log("config", config);
      assert(typeof config.product_to_proxy["EdgeMicroPOISON2"] === "undefined");
      done();
    }
  );
});

describe("after receiving invalid update, application of updates resume if server provides valid JSON", done => {
  before(done => {
    opts.productName = "EdgeMicroPOISON2";
    opts.productDesc = 'EdgeMicroPOISON2"';
    opts.proxies = "edgemicro-auth,edgemicro_hello";
    opts.environments = "test";
    sdk.deleteProduct(opts).then(
      function(result) {
        // done2;
        setTimeout(done, 5000);
      },
      function(err) {
        //product creation failed
        assert(false);
        console.log("err", err);
      }
    );
  });

  after(done => {
    opts.productName = "EdgeMicroJSON2";
    opts.productDesc = "EdgeMicroJSON2";
    opts.proxies = "edgemicro-auth,edgemicro_hello";
    opts.environments = "test";
    // opts.productDesc = 'EdgeMicroJSO"N2';
    sdk.deleteProduct(opts).then(
      function(result) {
        done();
      },
      function(err) {
        //product creation failed
        console.log("err", err);
      }
    );
  });
  it("received update", done => {
    get(
      {
        source: customFixtureDirPath,
        keys: { key, secret }
      },
      function(err, config) {
        console.log("config", config);
        assert(!config.product_to_proxy)["EdgeMicroPOISON2"];
        assert.equal(err, null);
        done();
      }
    );
  });
});
