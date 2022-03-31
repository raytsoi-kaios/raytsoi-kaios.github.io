// @ts-check
(function () {
  // Setup a dummy getKaiAd function that just save its inputs
  /** @type IArguments[] */
  let queued = [];

  const runGetKaiAdQueuedArguments = (func) => {
    queued.forEach((q) => {
      func.apply(this, q);
    });
    queued = [];
  };

  window.getKaiAd = function () {
    queued.push(arguments);
  };

  window.getKaiAd.dummy = true;

  const fallbackGetKaiAd = (obj) => {
    if (typeof obj.onerror === "function") {
      // Error code 19 = SDK Cannot load. This is in the developer documentation.
      const SDK_CANNOT_LOAD = 19;
      obj.onerror(SDK_CANNOT_LOAD);
    }
  };
  /**
   * @param {string} url url of the script to load
   */
  const loadScript = (url) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.addEventListener("load", function () {
        resolve();
      });
      script.addEventListener("error", function () {
        reject();
      });
      script.src = url;
      // try to keep the relative include order
      script.async = false;
      document.head.appendChild(script);
    });
  };
  /**
   * @param {string} url SDK url to load
   */
  const loadSDK = (url) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");

      script.addEventListener("load", function () {
        if (!getKaiAd || getKaiAd.dummy) {
          // In case the loaded file does not have getKaiAd function
          reject();
        } else {
          resolve();
        }
      });
      script.addEventListener("error", function () {
        reject();
      });

      script.src = url;
      document.head.appendChild(script);
    });
  };
  /** @type Promise<any> */
  let p;
  if (window.navigator.mozApps) {
    window.navigator.mozApps.getSelf().onsuccess = function (e) {
      let result = e.target.result;

      if (
        !result || // This is the case for KaiOS browser
        !result.manifest ||
        !result.manifest.type || // Some hosted app like Twitter does not have this attribute
        result.manifest.type === "web"
      ) {
        // The script will have the getKaiAd function and overwrites the global one
        p = loadSDK("https://static.kaiads.com/ads-sdk/ads-sdk.v5.min.js");
      }

      if (!p) {
        const v = / kaios\/((?:\d+.)*\d+)/gi.exec(window.navigator.userAgent);
        if (v && versionCompare(v[1], "2.5") === 1) {
          p = loadSDK("http://127.0.0.1/sdk/ads/ads-sdk.min.js").catch(() => {
            return loadSDK("http://127.0.0.1:8081/sdk/ads/ads-sdk.min.js");
          });
        }
      }

      if (!p) {
        p = Promise.reject();
      }

      p.catch(() => {
        runGetKaiAdQueuedArguments(fallbackGetKaiAd);
        window.getKaiAd = fallbackGetKaiAd;
        getKaiAd = fallbackGetKaiAd;
      }).then(() => {
        runGetKaiAdQueuedArguments(getKaiAd);
        window.getKaiAd = getKaiAd;
      });
    };
  } else {
    if (
      /kaios/gi.test(window.navigator.userAgent) &&
      window.location.hostname.endsWith(".localhost")
    ) {
      p = loadSDK("http://127.0.0.1/sdk/ads/ads-sdk.min.js");
    } else {
      p = loadSDK("https://static.kaiads.com/ads-sdk/ads-sdk.v5.min.js");
    }

    if (!p) {
      p = Promise.reject();
    }

    p.catch(() => {
      runGetKaiAdQueuedArguments(fallbackGetKaiAd);
      window.getKaiAd = fallbackGetKaiAd;
      getKaiAd = fallbackGetKaiAd;
    }).then(() => {
      runGetKaiAdQueuedArguments(getKaiAd);
      window.getKaiAd = getKaiAd;
    });
  }
  /**
   * @param {string} v1
   * @param {string} v2
   */
  function versionCompare(v1, v2) {
    let v1parts = v1.split(".");
    let v2parts = v2.split(".");
    while (v1parts.length < v2parts.length) {
      v1parts.push("0");
    }
    while (v2parts.length < v1parts.length) {
      v2parts.push("0");
    }

    for (let i = 0; i < v1parts.length; ++i) {
      if (v1parts[i] == v2parts[i]) {
        continue;
      } else if (v1parts[i] > v2parts[i]) {
        return 1;
      } else {
        return -1;
      }
    }

    return 0;
  }
})();
