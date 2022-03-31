/**
 * @license
 * You may not use this file except in compliance with the KaiAds SDK Agreement.
 * You may obtain a copy of the KaiAds SDK Agreement at
 * https://www.kaiostech.com/sdk-agreement/
 */
"use strict";
// @ts-check
var getKaiAd = (() => {
  const SDKVERSION = "1.4.3";
  // This is a copy from ssp-server/v2/configs/frame.js
  // Refer to that table for latest error code meaning.
  const ERRORS = {
    DOCBODY_NOT_READY: 1,
    ONREADY_FUNC_MISSING: 2,
    AD_DIMEN_TOO_SMALL: 3,
    AD_IFRAME_GONE: 4,
    AD_REQ_TIMED_OUT: 5,
    SERVER_SAID_NO_AD: 6,
    FREQ_CAPPING: 7,
    MISSING_W_H: 8,
    BAD_SERVER_RESPONSE: 9,
    // 10, 12 are Errors from VM code - we no longer use them
    INVOKE_API_FAILED: 11,

    CANNOT_PROCESS_RESPONSE: 13,
    NO_SERVER_RESPONSE: 14,
    INVALID_TEST_PARAM: 15,
    DISPLAY_CALLED_MULTIPLE_TIMES: 16,
    CANNOT_FETCH_SETTINGS: 17,
    UNKNOWN_API_CALLED: 18,
    SDK_CANNOT_LOAD: 19,
    UNSUPPORTED_SDK_VER: 20,
  };

  /**
   * @typedef {Object} Advert
   * @property {Object} adConfig
   * @property {string} id
   * @property {function} post
   * @property {function} ready
   * @property {function} reject
   * @property {function} destroy
   * @property {string[]} ignoreKeys
   * @property {HTMLElement} container
   * @property {HTMLElement} wrap
   * @property {HTMLIFrameElement} frame
   * @property {number} timeout - timeout ID
   * @property {Object<string, function[]>} listeners
   * @property {number} isFullscreen - 0 or 1
   */

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

  // dataset key is in dash-style
  const camelToDashStyle = (str) =>
    str.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

  // finds ad wrapper div in document
  const getAdWrapper = (sessionId, advertId) => {
    const datasetKey = `data-${camelToDashStyle(sessionId)}`;
    return document.querySelector(`[${datasetKey}="${advertId}"]`);
  };

  //let adFrameOrigin = "https://ssp.kaiads.com";
  let adFrameOrigin = setAdFrameOrigin;
  let adFrameUrl = adFrameOrigin + "/static/v3/frame.html?";

  let ads = new WeakMap();

  let defaultAdReqTimeout = 60000;

  // used to share data cross ads
  let sdkData = {
    // visible full screen ad
    // vfsAdId: '',
  };

  let body = () => document.body;

  let uuid = () => {
    let arr = crypto.getRandomValues(new Uint16Array(32));
    let charset =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let len = charset.length;

    return [].map.call(arr, (n) => charset[n % len]).join("");
  };

  let sessionId = uuid();

  let Ad = (conf) => {
    /** @type Advert */
    let advert = {};
    // user provided
    advert.adConfig = conf;

    // tracking
    advert.id = uuid();
    advert.ignoreKeys = [];

    // user defined
    advert.listeners = {};

    // frame defined
    advert.reject = (msg) => {
      let err = advert.adConfig.onerror || console.error;
      err(msg);
      advert.destroy();
    };

    advert.destroy = () => {
      let wrap = getAdWrapper(sessionId, advert.id);
      if (wrap) {
        wrap.remove();
      }
      if (sdkData.vfsAdId === advert.id) {
        sdkData.vfsAdId = null;
      }

      clearTimeout(advert.timeout);
    };

    advert.ready = () => {
      clearTimeout(advert.timeout);

      // required at init
      advert.adConfig.onready({
        call(theEvent, theArgs) {
          advert.post(theEvent, theArgs);
        },
        /**
         * @param {string} event
         * @param {Function} func
         */
        on(event, func) {
          if (!advert.listeners[event]) {
            advert.listeners[event] = [];
          }
          advert.listeners[event].push(func);
        },
      });
    };

    advert.post = (theEvent, ...theArgs) => {
      if (!advert.frame || !advert.frame.contentWindow) {
        // user accidentally removed iframe?
        advert.reject(ERRORS.AD_IFRAME_GONE);
      } else {
        let msg = {};
        msg.id = advert.id;
        msg.event = theEvent;
        msg.args = theArgs;

        advert.frame.contentWindow.postMessage(
          JSON.stringify(msg, getCircularReplacer()),
          adFrameOrigin
        );
      }
    };

    // auto 1
    advert.timeout = (() => {
      advert.adConfig.timeout = advert.adConfig.timeout || defaultAdReqTimeout;
      return setTimeout(() => {
        advert.reject(ERRORS.AD_REQ_TIMED_OUT);
      }, advert.adConfig.timeout);
    })();

    // auto 2
    advert.container = (() => {
      let cont = advert.adConfig.container;
      if (!cont) {
        cont = body();

        advert.isFullscreen = advert.adConfig.isFullscreen = 1;
      }

      return cont;
    })();

    // auto 3
    advert.frame = (() => {
      let originURI = encodeURIComponent(document.location.origin);
      let url = `${adFrameUrl}i=${advert.id}&s=${sessionId}&o=${originURI}`;
      let frame = document.createElement("iframe");

      frame.setAttribute("src", url);

      let wrapper = document.createElement("div");
      wrapper.dataset[sessionId] = advert.id;

      wrapper.style.position = "absolute";
      wrapper.style.left = "-1000%";
      wrapper.style.top = "0px";

      advert.wrap = wrapper;

      if (!advert.isFullscreen) {
        // allow user to select & focus
        // set by developer
        // wrapper.setAttribute('tabindex', 0)
        wrapper.addEventListener("focus", (e) => advert.post("focus"));
        wrapper.addEventListener("blur", (e) => advert.post("blur"));
      }

      wrapper.appendChild(frame);
      advert.container.appendChild(wrapper);

      return frame;
    })();

    return advert;
  };

  const themeColorWorkaround = (cid, callback) => {
    const oriThemeColorTags = document.head.querySelectorAll(
      'meta[name="theme-color"]'
    );
    const oriThemeColors = Array.from(oriThemeColorTags);
    const removeChild = document.head.removeChild.bind(document.head);
    const appendChild = document.head.appendChild.bind(document.head);
    oriThemeColors.forEach(removeChild);

    const workaround = document.createElement("meta");
    workaround.setAttribute("name", "theme-color");
    workaround.setAttribute("content", "transparent");
    document.head.appendChild(workaround);

    callback();

    document.head.removeChild(workaround);
    oriThemeColors.forEach(appendChild);
  };

  /**
   * @param {Advert} advert
   */
  let API = (advert) => {
    return {
      ___API___postGetSettings: (cid) => {
        advert.post(cid, "success", advert.adConfig);
      },

      ___API___postGetManifestURL: (cid) => {
        navigator.mozApps.getSelf().onsuccess = (e) => {
          advert.post(cid, "success", e.target.result.manifestURL);
        };
      },

      ___API___postGetManifest: (cid) => {
        navigator.mozApps.getSelf().onsuccess = (e) => {
          const proto = Object.getPrototypeOf(e.target.result);
          const ownProps = Object.getOwnPropertyNames(proto);
          const json = JSON.stringify(e.target.result, ownProps);
          advert.post(cid, "success", json, e.target.result.manifest);
        };
      },
      ___API___postGetFullscreenDimension: (cid) => {
        advert.post(cid, "success", window.innerHeight, window.innerWidth);
      },

      ___API___postGetOrigin: (cid) => {
        advert.post(
          cid,
          "success",
          document.location.href,
          document.location.origin
        );
      },
      ___API___postError: (reasonCode) => {
        advert.adConfig.onerror(reasonCode);
      },

      ___API___postReject: (reasonCode) => {
        advert.reject(reasonCode);
        clearTimeout(advert.timeout);
      },

      ___API___postGetVisibility: (cid, flags = {}) => {
        // when fullscreen ad is displayed, make other ads count as
        // not visible
        if (
          flags.acceptOnScreenPercent &&
          sdkData.vfsAdId &&
          sdkData.vfsAdId !== advert.id
        ) {
          advert.post(cid, 0);
          return;
        }
        const rect = advert.frame.getBoundingClientRect();
        advert.post(
          cid,
          rect.top,
          rect.left,
          rect.right,
          rect.bottom,
          rect.width,
          rect.height,
          window.innerWidth,
          window.innerHeight
        );
      },
      ___API___postDestroyAd: (cid) => {
        advert.destroy();
      },

      ___API___postOpenWin: (cid, url) => {
        window.open(url);
      },

      ___API___postOpenWinWithThemeColorWorkaround: (cid, url) => {
        themeColorWorkaround(cid, () => {
          window.open(url);
        });
      },

      ___API___postAssignLocation: (cid, url) => {
        window.location = url;
      },

      ___API___postAssignLocationWithThemeColorWorkaround: (cid, url) => {
        themeColorWorkaround(cid, () => {
          window.location = url;
        });
      },

      ___API___postDisplayFullscreenAd: (cid, myAdSlotId, fullscreenCss) => {
        sdkData.vfsAdId = myAdSlotId;
        advert.container.style.position = "relative";
        advert.wrap.setAttribute("tabindex", 0);
        advert.wrap.style.cssText = fullscreenCss;
        advert.frame.style.cssText = fullscreenCss;
      },

      ___API___postDisplayBannerAd: (
        cid,
        displayArgs,
        bannerCss,
        color,
        w,
        h
      ) => {
        // TODO:
        // args could contain tabindex, navClass and display:block or inline for banner
        // tabindex allows user to focus on a div, so that we get focus/blur events.
        advert.wrap.setAttribute("tabindex", displayArgs.tabindex || 0);
        advert.wrap.classList.add(displayArgs.navClass || "");
        advert.container.style.display = displayArgs.display;

        advert.container.style.background = color;
        advert.container.style.position = "relative";
        advert.wrap.style.cssText = bannerCss;
        advert.frame.style.cssText = bannerCss;

        if (w) {
          advert.container.style.width = w + "px";
        }
        if (h) {
          advert.container.style.height = h + "px";
        }
      },

      ___API___postSetIgnoreKeys: (cid, keys, postAdReady) => {
        advert.ignoreKeys = keys;
        if (postAdReady) {
          advert.ready();
        }
      },

      ___API___postAdFocus: (cid) => {
        advert.wrap.focus();
      },

      ___API___postMaskGlobalFSListeners: () => {
        advert.wrap.keydownhandler = (e) => {
          if (advert.ignoreKeys.indexOf(e.key) >= 0) {
            return;
          }
          e.preventDefault();
          e.stopPropagation();

          // No longer pass e.keyCode. Pass in -1 for compatibility
          advert.post("keydown", e.key, -1 /*e.keyCode*/);
        };

        advert.wrap.addEventListener("keydown", advert.wrap.keydownhandler);
      },
      ___API___postGetSDKVersion: (cid) => {
        advert.post(cid, "success", SDKVERSION);
      },
    };
  };

  let onMessage = (e) => {
    if (!e || !e.origin || e.origin !== adFrameOrigin) {
      return;
    }

    let ad = ads.get(e.source);
    let data = JSON.parse(e.data);

    // Verify sender identity and authenticity
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage#Security_concerns
    if (!ad || ad.id !== data.id) {
      return;
    }

    // got API call?
    if (data.event && data.event.indexOf("___API___") === 0) {
      let api = API(ad)[data.event];
      if (api) {
        try {
          api.call(ad, ...data.args, data.flags);
        } catch (ex) {
          ad.post(data.event, "error", ERRORS.INVOKE_API_FAILED);
        }
      } else {
        ad.adConfig.onerror(ERRORS.UNKNOWN_API_CALLED); // 18 = Unknown API
      }
    }

    if (ad.listeners[data.event]) {
      ad.listeners[data.event].forEach((func) => func(data.args));
    }
  };

  function getActiveAdFrame(maybeWrapper = document.activeElement) {
    if (!maybeWrapper || !maybeWrapper.dataset[sessionId]) {
      return;
    }
    const iframes = maybeWrapper.getElementsByTagName("iframe");
    // safely assume that only 1 iframe is in the wrapper
    return iframes.length > 0 ? iframes[0] : null;
  }

  /** @param {KeyboardEvent} e */
  let onKeydown = (e) => {
    // search for visible fullscreen ad, because it is all blocking
    // but might not be in focus.
    let fullscreenAdWrapper = sdkData.vfsAdId
      ? getAdWrapper(sessionId, sdkData.vfsAdId)
      : null;
    let adFrame = fullscreenAdWrapper
      ? getActiveAdFrame(fullscreenAdWrapper)
      : getActiveAdFrame();
    if (!adFrame) {
      // event doesn't belong to us
      return;
    }
    /** @type Advert */
    let ad = ads.get(adFrame.contentWindow);

    if (!ad || ad.ignoreKeys.indexOf(e.key) > -1) {
      return;
    }

    // pass to frame
    // No longer pass e.keyCode. Pass in -1 for compatibility
    ad.post("keydown", e.key, -1 /*e.keyCode*/);

    // block
    e.preventDefault();
    e.stopPropagation();
  };

  window.addEventListener("message", onMessage);
  window.addEventListener("keydown", onKeydown);

  return (config) => {
    let err = config.onerror || console.error;
    if (!body()) {
      err(ERRORS.DOCBODY_NOT_READY);
    } else if (!config.onready) {
      err(ERRORS.ONREADY_FUNC_MISSING);
    } else if (!window.navigator.onLine) {
      err(ERRORS.SDK_CANNOT_LOAD);
    } else {
      // new ad
      const advert = Ad(config);
      ads.set(advert.frame.contentWindow, advert);
      // expose destroy to allow pre-ready cleanup
      return {
        destroy: advert.destroy,
      };
    }
  };
})();
