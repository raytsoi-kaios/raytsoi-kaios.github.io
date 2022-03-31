const getKaiAd = ((...theContext) => {
  // Remove circular deps for JSON.stringify
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value#Examples
  const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  };

  let adFrameOrigin = setAdFrameOrigin;
  // let adFrameOrigin = "http://192.168.137.235:8000";
  //let adFrameOrigin = "https://testv2.ssp.kaiads.com";
  let adFrameUrl = adFrameOrigin + "/static/v2/frame.html?";

  // test cookies set via iframe
  // if doesn't work add ajax with creds
  // fetch(adRequestUrl + prepRequestQuery('request', args), {credentials: 'include'})

  // code minimization help
  let window = theContext[0];
  let document = theContext[1];
  let undefined = theContext[2];

  let ads = {};

  // code minimization help
  let str = {
    setAttribute: "setAttribute",
    createElement: "createElement",
    contentWindow: "contentWindow",
    appendChild: "appendChild",
    addEventListener: "addEventListener",
    dataset: "dataset",
    keydown: "keydown",
    length: "length",
    style: "style",
    error: "error",
    timeout: "timeout",
    push: "push",
    message: "message",
  };

  let charset =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let len = charset[str.length];

  let getInt = parseInt;
  let consoleError = console[str.error];

  let defaultAdReqTimeout = 60000;

  // used to share data cross ads
  let sdkData = {
    // visible full screen ad
    // vfsAdId: '',
  };

  let body = () => document.body;

  // chain
  let isNew = 0;
  let func = 1;
  let assign = 2;
  let params = 3;
  let value = 4;

  // message
  let id = 5;
  let event = 6;
  let chain = 7;
  let args = 8;

  // the rest
  let vars = 9;
  let ad = 10;
  let post = 11;
  let chains = 12;
  let next = 13;
  let ready = 14;
  let reject = 15;
  let ignoreKeys = 16;
  let container = 17;
  let wrap = 18;
  let frame = 19;
  let context = 20;
  let error = 21;
  let timeout = 22;
  let isFullscreen = 23;
  let adConfig = 24;
  let listeners = 25;
  let traverse = 26;
  let traverseAll = 27;
  let index = 28;
  let destroy = 29;

  let uuid = () => {
    let arr = crypto.getRandomValues(new Uint16Array(32));
    return [].map.call(arr, (n) => charset[n % len]).join("");
  };

  let sessionId = uuid();

  let isFunc = (f) => typeof f == typeof getInt;
  let isString = (s) => typeof s === typeof str.length;

  let Ad = (conf) => {
    let advert = {};
    // user provided
    advert[adConfig] = conf;

    // tracking
    advert[id] = uuid();
    advert[ignoreKeys] = [];
    // console.log(advert[id], id)

    // ads[x] = ad
    ads[advert[id]] = advert;

    // store all chains
    advert[chains] = [];

    // user defined
    advert[listeners] = {};

    // frame defined
    advert[reject] = (msg) => {
      let err = advert[adConfig].onerror || consoleError;
      err(msg);
      advert[destroy]();
    };
    advert[destroy] = () => {
      // destroy
      if (advert[wrap]) {
        advert[wrap].remove();
      }

      ads[advert[id]] = advert = undefined;
    };

    advert[ready] = () => {
      clearTimeout(advert[timeout]);

      // required at init
      advert[adConfig].onready({
        call(theEvent, theArgs) {
          advert[post](theEvent, theArgs);
        },
        on(event, func) {
          if (!advert[listeners][event]) {
            advert[listeners][event] = [];
          }
          advert[listeners][event][str.push](func);
        },
      });
    };

    // const msgArray = []

    advert[post] = (theEvent, ...theArgs) => {
      if (!advert[frame] || !advert[frame][str.contentWindow]) {
        // user accidentally removed iframe?
        advert[reject](4);
      } else {
        let msg = [];
        msg[id] = advert[id];
        msg[event] = theEvent;
        msg[args] = theArgs;

        advert[frame][str.contentWindow].postMessage(
          JSON.stringify(msg, getCircularReplacer()),
          "*"
        );
      }
    };

    // auto 1
    advert[timeout] = (() => {
      advert[adConfig][str.timeout] =
        advert[adConfig][str.timeout] || defaultAdReqTimeout;
      return setTimeout(() => {
        advert[reject](5);
      }, advert[adConfig][str.timeout]);
    })();

    // auto 2
    advert[container] = (() => {
      let cont = advert[adConfig].container;
      if (!cont) {
        cont = body();
        advert[isFullscreen] = advert[adConfig][isFullscreen] = 1;
      }

      return cont;
    })();

    // part of the url // &w=${w}&h=${h}
    // remove as can be found from frame
    // let computedStyle = window.getComputedStyle(advert[container], null)
    // let h = computedStyle.getPropertyValue('height')
    // let w = computedStyle.getPropertyValue('width')

    // auto 3
    advert[frame] = (() => {
      let url = `${adFrameUrl}i=${advert[id]}&s=${sessionId}`;
      let frame = document[str.createElement]("iframe");

      frame[str.setAttribute]("src", url);

      let wrapper = document[str.createElement]("div");
      wrapper[str.dataset][sessionId] = advert[id];

      wrapper[str.style].position = "absolute";
      wrapper[str.style].left = "-1000%";

      advert[wrap] = wrapper;

      if (!advert[isFullscreen]) {
        // allow user to select & focus
        // set by developer
        // wrapper[str.setAttribute]('tabindex', 0)
        wrapper[str.addEventListener]("focus", (e) => advert[post]("focus"));
        wrapper[str.addEventListener]("blur", (e) => advert[post]("blur"));
      }

      wrapper[str.appendChild](frame);
      advert[container][str.appendChild](wrapper);

      wrapper[str.dataset][sessionId] = advert[id];

      return frame;
    })();
  };

  let Chain = (advert, data) => {
    let that = {};
    that[ad] = advert;

    advert[chains][str.push](data[chain]);

    that[chain] = data[chain];
    that[event] = data[event];
    that[index] = -1;
    that[args] = [];
    that[vars] = [];

    that[func] = (theChain) => {
      let res = that[traverse](theChain[func]);

      if (!res[func]) {
        that[ad][post](
          that[event],
          str.error,
          10,
          advert[chains][str.length],
          that[index]
        );
      } else {
        let sdkErrors = [];
        let newParams = that[traverseAll](theChain[params]);

        that[vars][that[index]] = theChain[isNew]
          ? new res[func](...newParams[0])
          : res[func](...newParams[0]);

        // does params contain next() ?
        if (!newParams[1]) {
          that[next]();
        }
      }
    };

    that[assign] = (theChain) => {
      if (theChain[value]) {
        let theValue = that[traverse](theChain[value]);

        if (theValue[error]) {
          that[ad][post](
            that[event],
            str.error,
            11,
            advert[chains][str.length],
            that[index]
          );
          // return
        } else {
          let variable;

          if (theValue[func]) {
            variable = theValue[func];
          } else if (theValue[chain]) {
            variable = theValue[chain];
          } else {
            variable = theChain[value];
          }

          // traverse's second argument is assignment
          let theAssign = that[traverse](theChain[assign], variable);

          // nothing to store in vars
          that[vars][that[index]] = undefined;

          if (!theAssign[next]) {
            that[next]();
          }
        }
      } else {
        let newChain = that[traverse](theChain[assign]);

        if (newChain[error]) {
          that[ad][post](
            that[event],
            str.error,
            12,
            advert[chains][str.length],
            that[index]
          );
        } else {
          // assign is added into that.vars
          that[vars][that[index]] = newChain;
          that[next]();
        }
      }
    };

    that[next] = (...theArgs) => {
      that[index]++;
      that[args][that[index]] = theArgs;

      let newChain = that[chain][that[index]];

      if (!newChain) {
        // return
      } else if (newChain[func]) {
        that[func](newChain);
      } else if (newChain[assign]) {
        that[assign](newChain);
      } else {
        that[next]();
      }
    };

    that[traverseAll] = (arr) => {
      // 0 - holds resulted array
      // 1 - indicates presense of next()
      let res = [[], undefined];
      if (arr) {
        for (let i = 0, l = arr[str.length]; l > i; i++) {
          if (isString(arr[i])) {
            let newChain = that[traverse](arr[i]);
            if (newChain[func]) {
              res[0][str.push](newChain[func]);
              if (newChain[next]) {
                res[1] = 1;
              }
            } else if (newChain[chain]) {
              res[0][str.push](newChain[chain]);
            } else {
              res[0][str.push](arr[i]);
            }
          } else {
            res[0][str.push](arr[i]);
          }
        }
      }
      return res;
    };

    that[traverse] = (strChain, assign) => {
      let res = {};

      if (isString(strChain) && /^[wts]/.test(strChain)) {
        let parts = strChain.split(".");
        let theChain = parts.shift();

        if (theChain == "t") {
          theChain = that;
        } else if (theChain == "w") {
          theChain = window;
        } else if (theChain == "s") {
          theChain = sdkData;
        }

        if (theChain === undefined) {
          // window/that/sdkData undefined
        }

        for (let i = 0, l = parts[str.length]; l > i; i++) {
          if (l > i) {
            res[context] = theChain;
          }

          if (theChain[parts[i]] === undefined) {
            // that[X][Y][Z]
            if (l > i) {
              // if parts[i] is Z
              if (assign) {
                // and this is assign, break
                break;
              } else {
                // if Z but no assign, return error to frame
                res[error] = 1;
                return res;
              }
            }
          }

          if (theChain === undefined || theChain[parts[i]] === undefined) {
            if (l > i && assign === undefined) {
              //
              // last part without assignment
              res[error] = 1;
              return res;
            }
            // l>i && assign===undefined
          }

          theChain = theChain[parts[i]];
        }

        if (assign !== undefined) {
          res[context][parts.pop()] = assign;
          theChain = assign;
        }

        if (isFunc(theChain)) {
          res[next] = theChain === that[next];
          if (!res[next]) {
            res[func] = theChain.bind(res[context]);
          } else {
            res[func] = theChain;
          }
        }

        res[chain] = theChain;
      }

      return res;
    };

    that[next]();
  };

  let onMessage = (e) => {
    if (!e || !e.origin || e.origin !== adFrameOrigin) {
      return;
    }
    let data = JSON.parse(e.data);

    if (ads[data[id]]) {
      let ad = ads[data[id]];

      // got chain?
      if (data[chain]) {
        Chain(ad, data);
      }

      if (ad[listeners][data[event]]) {
        ad[listeners][data[event]].forEach((func) => func(data[args]));
      }
    }
  };

  let onKeydown = (e) => {
    let ad;
    // fullscreen must be checked first, it is all blocking
    if (sdkData.vfsAdId && ads[sdkData.vfsAdId]) {
      ad = ads[sdkData.vfsAdId];
    } else {
      let ae = document.activeElement;
      let id = ae[str.dataset][sessionId];
      if (!ae || !id) {
        // event doesn't belong to us
        return;
      }
      ad = ads[id];
    }

    if (!ad) {
      return;
    }

    if (ad[ignoreKeys].indexOf(e.key) > -1) {
      return;
    }

    // pass to frame
    // e.keyCode only?
    ad[post](str.keydown, e.key, e.keyCode);

    // block
    e.preventDefault();
    e.stopPropagation();
  };

  window[str.addEventListener](str.message, onMessage);
  window[str.addEventListener](str.keydown, onKeydown);

  return (config) => {
    let err = config.onerror || consoleError;
    if (!body()) {
      err(1);
    } else if (!config.onready) {
      err(2);
    } else {
      // new ad
      Ad(config);
    }
  };
})(window, document);
