/**
 * @license
 * You may not use this file except in compliance with the KaiAds SDK Agreement.
 * You may obtain a copy of the KaiAds SDK Agreement at
 * https://www.kaiostech.com/sdk-agreement/
 */
 "use strict";

 // @ts-check
 var getKaiAd = (() => {
 
   const SDKVERSION = "1.5.7";
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
     BLACKLISTED: 21,
     CERT_STATE_ERR: 22,
   };
 
   // configs
   const CHECK_AD_WINDOW_CLOSED_INTERVAL = 100;
 
   class AdError extends Error {
     constructor(code) {
       super(code);
       this.code = code;
     }
   }
 
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
 
     // Get Cert State
   let certState = false;
 
   let manifestLinkEl = document.querySelector('link[rel="manifest"]');
   let isSignedApp =
     /kaios/gi.test(window.navigator.userAgent) &&
     window.location.hostname.endsWith(".localhost");
 
   let getCertState = () => {
     var xhr = new XMLHttpRequest();
     xhr.open("GET", "http://127.0.0.1:8081/ca");
     xhr.onload = () => {
       let retrievedCaFlags = xhr.responseText.match(/((\d+(\.\d+)?)|(\.\d+))/);
       if (retrievedCaFlags !== null && typeof parseFloat(retrievedCaFlags[0]) === 'number') {
         parseFloat(retrievedCaFlags[0]) >= 2 ? (certState = true) : (certState = false);
         console.log(`parseFloat(retrievedCaFlags[0]) (Retrieved Ca Flag Number): ${parseFloat(retrievedCaFlags[0])}`);
       } else {
         certState = false;
       }
       console.log(`certState: ${certState}`);
     };
     xhr.onerror = (error) => {
       certState = false;
       throw new AdError(ERRORS.CERT_STATE_ERR);
     };
     xhr.send();
   };
 
   if (navigator.mozApps) {   // for KaiOS 2.5 device
     const mozAppsGetSelfTargetResult = new Promise(resolve => {
       navigator.mozApps.getSelf().onsuccess = (e) => {
         resolve(e.target.result);
       }
     });
 
     mozAppsGetSelfTargetResult.then(result => {
       if (result.manifest.type === "web" && result.manifestURL.startsWith("https://") && !result.manifestURL.startsWith("https://api.kaiostech.com/")) {   // for Hosted App in KaiOS 2.5 that its manifestUrl's prefix is https://
         certState = false;
       } else {   // for Packaged App (Privileged App / Certified App / Web App) in KaiOS 2.5
         getCertState();
       }
     });
 
   } else if (isSignedApp || manifestLinkEl) {   // for SignedApp or PWA in KaiOS 3.0
     certState = true;
   } else {   // for Web
     certState = true;
   }
 
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
 
   // let adFrameOrigin = "https://ssp.kaiads.com";
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
 
   const AD_STATES = {
     LOADING: 1,
     READY: 2,
     REJECTED: 3,
   };
 
   function addStyle(styleString) {
     const style = document.createElement("style");
     style.textContent = styleString;
     document.head.appendChild(style);
   }
 
   addStyle(`
     .kaiads-options-overlay {
       position: fixed;
       top: 0;
       bottom: 0;
       left: 0;
       right: 0;
       background-color: rgba(0, 0, 0, .9);
       z-index: 99999;
     }
     .kaiads-options-container {
       font-family: "Open Sans";
       background-color: white;
       position: fixed;
       left: 0;
       right: 0;
       bottom: 0;
       z-index: 99999;
       margin-bottom: 2rem;
     }
     .kaiads-options-container .options-header {
       background: #ccc;
       text-align: center;
       padding: 5px;
     }
     .kaiads-options-container .options-footer {
       background: #ccc;
       text-align: center;
       padding: 5px;
       font-weight: 600;
     }
     .kaiads-options-container .option {
       display: block;
       padding: 0.5rem;
       cursor: none;
     }
     .kaiads-options-container .option:focus {
       background-color: #8000ff;
       color: white;
       border: none;
     }
     .kaiads-options-overlay-touch {
       width: 100%;
       height: 100%;
       background-color: #e9e9f2;
       z-index: 1000;
       position: fixed;
       top: 0;
       left: 0;
       display: flex;
       justify-content: center;
       align-items: center;
       -moz-user-select: none;
     }
     .kaiads-options-overlay-touch:focus {
       border: none;
       outline: none;
     }
     .kaiads-options-overlay-touch .popup {
       width: 400px;
       display: flex;
       flex-direction: column;
       justify-content: center;
       align-items: center;
     }
     .kaiads-options-overlay-touch .title {
       font-size: 30px;
       font-weight: bold;
       width: 400px;
       min-height: 32px;
       padding: 0 27px;
       margin-bottom: 16px;
       box-sizing: border-box;
       color: #000000;
       text-align: center;
       word-wrap: break-word;
     }
     .kaiads-options-overlay-touch .wrapper {
       width: 400px;
       overflow: hidden;
       padding: 13px 0;
       border-radius: 40px;
       border: solid 2px #000;
       background-color: #e9e9f2;
       position: relative;
     }
     .kaiads-options-overlay-touch .options {
       max-height: 400px;
       /* set width to 407 so that the total width still stay in 400px
           except hidden vertical scroll bar height(7px) */
       width: 407px;
       padding-right: 7px;
       padding-left: 0;
       overflow-y: auto;
       overflow-x: hidden;
       box-sizing: border-box;
     }
     .kaiads-options-overlay-touch .option {
       font-family: OpenSans;
       font-size: 22px;
       font-weight: 600;
       color: #000;
       display: flex;
       width: 100%;
       min-height: 80px;
       align-items: center;
       padding-left: 27px;
       padding-right: unset;
       box-sizing: border-box;
     }
     @media (prefers-color-scheme: dark) {
       .kaiads-options-overlay-touch {
         background-color: #000;
       }
       .kaiads-options-overlay-touch .title {
         color: #e9e9f2;
       }
       .kaiads-options-overlay-touch .wrapper {
         background-color: #000;
         border: solid 2px #b2b2c2;
       }
       .kaiads-options-overlay-touch .option {
         color: #e9e9f2;
       }
     }
     @media (prefers-color-scheme: light) {
       .kaiads-options-overlay-touch {
         background-color: #e9e9f2; 
       }
       .kaiads-options-overlay-touch .title {
         color: #000;
       }
       .kaiads-options-overlay-touch .wrapper {
         background-color: #e9e9f2;
         border: solid 2px #000;
       }
       .kaiads-options-overlay-touch .option {
         color: #000;
       }
     }
   `);
 
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
     advert.state = null;
 
     function setAdState(state) {
       if (advert.state === state) {
         return;
       }
 
       if (
         state === AD_STATES.LOADING &&
         typeof conf.onloadstart === "function"
       ) {
         conf.onloadstart();
       }
 
       if (
         advert.state === AD_STATES.LOADING &&
         state !== AD_STATES.LOADING &&
         typeof conf.onloadend === "function"
       ) {
         conf.onloadend();
       }
       advert.state = state;
     }
 
     // frame defined
     advert.reject = (msg) => {
       setAdState(AD_STATES.REJECTED);
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
 
     advert.ready = (readyArgs = {}) => {
       clearTimeout(advert.timeout);
       setAdState(AD_STATES.READY);
 
       // required at init
       advert.adConfig.onready(
         Object.assign({}, readyArgs, {
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
         })
       );
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
 
     setAdState(AD_STATES.LOADING);
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
 
   const showSFPReportAdMenu = (advert, cid, cursorEnabled, reportMenuLocales, options) => {
     const $overlay = document.createElement("div");
     $overlay.classList.add("kaiads-options-overlay");
     $overlay.setAttribute("tabindex", -1);
     const $optionsContainer = document.createElement("div");
     $optionsContainer.classList.add("kaiads-options-container");
     $optionsContainer.setAttribute("tabindex", -1);
 
     const $optionsHeader = document.createElement("div");
     $optionsHeader.innerText = reportMenuLocales.reportThisAdAs;
     $optionsHeader.classList.add("options-header");
     $optionsContainer.appendChild($optionsHeader);
 
     const $options = document.createElement("div");
     options.forEach(([label, code], i) => {
       const $option = document.createElement("a");
       $option.setAttribute("tabindex", i);
       $option.classList.add("option");
       $option.innerText = label;
       $option.dataset.reportReason = code;
       $options.appendChild($option);
       $option.addEventListener("mouseover", hoverHandler);
     });
 
     $options.addEventListener("click", optionsClickHandler);
     $optionsContainer.addEventListener("keydown", optionsKeydownHandler);
     $overlay.addEventListener("keydown", optionsKeydownHandler);
     document.body.appendChild($overlay);
     $optionsContainer.appendChild($options);
     document.body.appendChild($optionsContainer);
     $options.children.item(0).focus();
     const $optionsFooter = document.createElement("div");
     $optionsFooter.innerText = reportMenuLocales.select.toUpperCase();
     $optionsFooter.classList.add("options-footer");
     $optionsContainer.appendChild($optionsFooter);
 
     // Handlers
     function hoverHandler(e) {
       let self = e.target || e.srcElement;
       self.focus();
     }
 
     function optionsClickHandler(e) {
       closeOptions(e.target.dataset.reportReason);
     }
 
     function optionsKeydownHandler(e) {
       e.stopPropagation();
       let $nextFocus = null;
       switch (e.key) {
         case "Enter":
           document.activeElement.click();
           break;
         case "Backspace":
           e.preventDefault();
           closeOptions();
           break;
         case "ArrowDown":
           $nextFocus = document.activeElement.nextSibling;
           break;
         case "ArrowUp":
           $nextFocus = document.activeElement.previousSibling;
           break;
         default:
           break;
       }
       if ($nextFocus) {
         $nextFocus.focus();
       }
     }
 
     function closeOptions(reportReason) {
       $optionsContainer.removeEventListener(
         "keydown",
         optionsKeydownHandler
       );
       $options.removeEventListener("click", optionsClickHandler);
       $overlay.removeEventListener("keydown", optionsKeydownHandler);
       $overlay.remove();
       $optionsContainer.remove();
       advert.post(cid, "success", reportReason);
     }
   };
 
   const showSTReportAdMenu = (advert, cid, cursorEnabled, reportMenuLocales, options) => {
     const $overlay = document.createElement("div");
     $overlay.classList.add("kaiads-options-overlay-touch");
     $overlay.tabIndex = -1;
     const $popup = document.createElement("div");
     $popup.classList.add("popup");
     const $title = document.createElement("div");
     $title.classList.add("title");
     $title.innerText = reportMenuLocales.reportThisAdAs;
     $popup.appendChild($title);
     const $wrapper = document.createElement("div");
     $wrapper.classList.add("wrapper");
     const $options = document.createElement("div");
     $options.classList.add("options");
     options.forEach(([label, value], i) => {
       const option = document.createElement("div");
       option.value = value;
       option.classList.add("option");
       option.innerText = label;
       option.addEventListener("click", clickOption);
       $options.appendChild(option);
     });
     $wrapper.appendChild($options);
     $popup.appendChild($wrapper);
     $overlay.appendChild($popup);
     document.body.appendChild($overlay);
     $overlay.addEventListener("click", clickOverlay);
     $overlay.addEventListener("keydown", handleOverlayKeydown);
     $overlay.focus();
     function handleOverlayKeydown(e) {
       e.stopPropagation();
       e.preventDefault();
       switch (e.key) {
         case "Backspace":
         case "GoBack":
           closeOptions();
           break;
         default:
           break;
       }
     }
 
     function clickOverlay() {
       closeOptions();
     }
 
     function clickOption(e) {
       e.stopPropagation();
       advert.post(cid, "success", e.target.value);
       closeOptions();
     }
 
     function closeOptions() {
       $overlay.removeEventListener("click", clickOverlay);
       $overlay.removeEventListener("keydown", handleOverlayKeydown);
       const options = document.getElementsByClassName("option");
       Array.from(options).forEach(option => {
         option.removeEventListener("click", clickOption);
       });
       $overlay.remove();
     }
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
         if (navigator.mozApps) {
           navigator.mozApps.getSelf().onsuccess = (e) => {
             advert.post(cid, "success", e.target.result.manifestURL);
           };
         } else if (isSignedApp) {
           const fallbackURL =
             "https://api.kaiostech.com/apps/manifest/kaios-ads-stub-appid";
           fetch(window.location.origin + "/.KaiAds.appinfo.json")
             .then((res) => res.json())
             .then((obj) => {
               const manifestURL = obj.manifestURL || fallbackURL;
               advert.post(cid, "success", manifestURL);
             })
             .catch((err) => {
               advert.post(cid, "success", fallbackURL);
             });
         } else if (manifestLinkEl) {
           advert.post(
             cid,
             "success",
             "" + new URL(manifestLinkEl.href, window.location.href)
           );
         }
       },
 
       ___API___postGetManifest: (cid) => {
         if (navigator.mozApps) {
           navigator.mozApps.getSelf().onsuccess = (e) => {
             const proto = Object.getPrototypeOf(e.target.result);
             const ownProps = Object.getOwnPropertyNames(proto);
             const json = JSON.stringify(e.target.result, ownProps);
             advert.post(cid, "success", json, e.target.result.manifest);
           };
         } else {
           let url;
           if (isSignedApp) {
             url = window.location.origin + "/manifest.webmanifest";
           } else if (manifestLinkEl) {
             url = manifestLinkEl.href;
           }
           if (url) {
             fetch(url)
               .then((res) => res.json())
               .then((obj) => advert.post(cid, "success", "", obj));
           }
         }
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
         advert.container.style.overflow = "auto";
         advert.destroy();
       },
 
       ___API___postOpenWin: (cid, url) => {
         const adWindow = window.open(url);
         const timer = setInterval(() => {
           if (adWindow.closed) {
             advert.post(cid, "success");
             clearInterval(timer);
           }
         }, CHECK_AD_WINDOW_CLOSED_INTERVAL);
       },
 
       ___API___postOpenWinWithThemeColorWorkaround: (cid, url) => {
         themeColorWorkaround(cid, () => {
           API(advert).___API___postOpenWin(cid, url);
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
         advert.container.style.overflow = "hidden";
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
 
       ___API___postSetIgnoreKeys: (cid, keys, postAdReady, readyArgs) => {
         advert.ignoreKeys = keys;
         if (postAdReady) {
           advert.ready(readyArgs);
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
 
       ___API___postShowReportAdMenu: (
         cid,
         cursorEnabled,
         reportMenuLocales
       ) => {
         const isST = /kaios/gi.test(window.navigator.userAgent) && (/touch/gi.test(window.navigator.userAgent) || /\sst\//gi.test(window.navigator.userAgent));
         const options = [
           [reportMenuLocales.inappropriate, "INAPPROPRIATE"],
           [reportMenuLocales.notInterested, "NOT_INTERESTED"],
           [reportMenuLocales.seenMultipleTimes, "SEEN_MUTIPLE_TIMES"],
           [reportMenuLocales.misleading, "MISLEADING"],
         ];
         if(!isST) {
           showSFPReportAdMenu(advert, cid, cursorEnabled, reportMenuLocales, options);
         } else {
           showSTReportAdMenu(advert, cid, cursorEnabled, reportMenuLocales, options);
         }
       },
 
       ___API___postGetCertificateState: (cid) => {
         advert.post(cid, "success", certState);
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
 
   const noop = () => {};
   const identity = (x) => x;
   const compose = (...fns) =>
     fns.reduce(
       (f, g) =>
         (...args) =>
           f(g(...args))
     );
 
   const blacklistCacheKeyFromConfig = (config) => {
     const params = [
       "blacklistCache",
       config.appId,
       config.publisherId,
       config.slotId,
       config.container ? "banner" : "fullscreen",
       config.w,
       config.h,
     ].filter(Boolean);
     return params.join(":");
   };
 
   const BLACKLIST_CACHE_STATES = {
     NOT_SET: 1, // never determined
     ACTIVE: 2, // blacklisting in action
     PREV_SUCCESS: 3, // determined as success in previous load
   };
 
   const getCookieValue = (key) => {
     try {
       return document.cookie
         .split("; ")
         .find((row) => row.startsWith(key))
         .split("=")[1];
     } catch (e) {
       return null;
     }
   };
 
   const BlacklistCache = (key, ttl = 0) => {
     const store = (active) => {
       const val = active ? "1" : "0";
       const maxAge = active ? ttl : 2147483647;
       document.cookie = `${key}=${val}; max-age=${maxAge}; samesite=strict`;
     };
 
     const getState = () => {
       switch (getCookieValue(key)) {
         case "0":
           return BLACKLIST_CACHE_STATES.PREV_SUCCESS;
         case "1":
           return BLACKLIST_CACHE_STATES.ACTIVE;
         default:
           return BLACKLIST_CACHE_STATES.NOT_SET;
       }
     };
 
     return {
       getState,
       recordSuccess: () => store(false),
       recordFailure: () => store(true),
     };
   };
 
   // Blacklist caching
   // https://kaiosmonet.atlassian.net/wiki/spaces/KAIAD/pages/145260545/Blacklist+Caching
   const blacklistCacheTransformer = (config) => {
     const cacheKey = blacklistCacheKeyFromConfig(config);
     const cache = BlacklistCache(cacheKey, config.blacklistCache.ttl);
 
     const state = cache.getState();
     if (state === BLACKLIST_CACHE_STATES.ACTIVE) {
       throw new AdError(ERRORS.BLACKLISTED);
     }
 
     // from user perspective, hidden ads:
     // - never become ready
     // - do not load
     const hideAd = (config) =>
       Object.assign({}, config, {
         onready: noop,
         onloadstart: noop,
         onloadend: noop,
       });
 
     const injectCacheWriter = (config) =>
       Object.assign({}, config, {
         onready: (...args) => {
           cache.recordSuccess();
           config.onready(...args);
         },
         onerror: (errCode, ...args) => {
           if (errCode === ERRORS.BLACKLISTED) {
             cache.recordFailure();
           }
           if (typeof config.onerror === "function") {
             config.onerror(errCode, ...args);
           }
         },
       });
 
     const shouldHideAd =
       config.blacklistCache.initiallyHideAd &&
       state !== BLACKLIST_CACHE_STATES.PREV_SUCCESS;
 
     return compose(injectCacheWriter, shouldHideAd ? hideAd : identity)(config);
   };
 
   const initAd = (config, extraConfig) => {
     const advert = Ad(config);
     ads.set(advert.frame.contentWindow, advert);
 
     // expose destroy to allow pre-ready cleanup
     return {
       destroy: advert.destroy,
     };
   };
 
   return (config) => {
     try {
       if (!body()) {
         throw new AdError(ERRORS.DOCBODY_NOT_READY);
       }
       if (!config.onready) {
         throw new AdError(ERRORS.ONREADY_FUNC_MISSING);
       }
       if (!window.navigator.onLine) {
         throw new AdError(ERRORS.SDK_CANNOT_LOAD);
       }
 
       return compose(
         initAd,
         config.blacklistCache ? blacklistCacheTransformer : identity
       )(config);
     } catch (e) {
       if (e instanceof AdError) {
         const err = config.onerror || console.error;
         err(e.code);
         return;
       }
       throw e;
     }
   };
 })();
 