// register the service worker if available
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then((reg) => console.log("service worker registered", reg))
    .catch((err) => console.log("service worker not registered", err));
}

//Raymond test command
// document.addEventListener("securitypolicyviolation", (e) => {
//   console.log("securitypolicyviolation");
//   console.log("blockedURI: ", e.blockedURI);
//   console.log("violatedDirective: ", e.violatedDirective);
//   console.log("originalPolicy: ", e.originalPolicy);
// });

document.addEventListener("DOMContentLoaded", () => {
  // window.navigator.mozApps.getSelf().onsuccess = function (e) {
  // let result = e.target.result.manifest.type;
  // let isSignedApp =
  //     /kaios/gi.test(window.navigator.userAgent) &&
  //     window.location.hostname.endsWith(".localhost");
  let manifestLinkEl = document.querySelector('link[rel="manifest"]');
  let appsManager = null;
  let isSignedApp =
    /kaios/gi.test(window.navigator.userAgent) &&
    window.location.hostname.endsWith(".localhost");

  let manifest, version = '', result = '';
  if (navigator.mozApps) {
    navigator.mozApps.getSelf().onsuccess = (e) => {
      manifest = e.target.result.manifestURL;
      verison = e.target.result.manifest.version;
      result = e.target.result.manifest.type;
    };
  } else if (isSignedApp) {
    if (appsManager) {
      appsManager
        .getApp(window.location.origin + "/manifest.webmanifest")
        .then((app) => {
          manifest = app.updateUrl;
        });
    } else {
      console.error("no app manger");
      verison = '';
      result = 'signed app';
    }
  } else if (manifestLinkEl) {
    manifest = new URL(manifestLinkEl.href, window.location.href);
  }
  console.log("Manifest: ", manifest);
  console.log("App Type: ", result);
  console.log("Version: ", version);
  const typeDiv = document.createElement("div");
  // and give it some content
  const typeContent = document.createTextNode(
    "[Version:" + version + "; Type:" + result + "]"
  );
  // add the text node to the newly created div
  typeDiv.appendChild(typeContent);
  // add the newly created element and its content into the DOM
  const currentDiv = document.getElementById("portrait");
  // document.body.insertBefore(typeDiv, currentDiv);
  currentDiv.insertAdjacentElement("beforebegin", typeDiv);
  // };
});

const sdkError = [
  "UNKNOWN:0",
  "DOCBODY_NOT_READY: 1",
  "ONREADY_FUNC_MISSING: 2",
  "AD_DIMEN_TOO_SMALL: 3",
  "AD_IFRAME_GONE: 4",
  "AD_REQ_TIMED_OUT: 5",
  "SERVER_SAID_NO_AD: 6",
  "FREQ_CAPPING: 7",
  "MISSING_W_H: 8",
  "BAD_SERVER_RESPONSE: 9",
  "Errors from VM code - we no longer use them: 10",
  "INVOKE_API_FAILED: 11",
  "Errors from VM code - we no longer use them: 12",
  "CANNOT_PROCESS_RESPONSE: 13",
  "NO_SERVER_RESPONSE: 14",
  "INVALID_TEST_PARAM: 15",
  "DISPLAY_CALLED_MULTIPLE_TIMES: 16",
  "CANNOT_FETCH_SETTINGS: 17",
  "UNKNOWN_API_CALLED: 18",
  "SDK_CANNOT_LOAD: 19",
  "UNSUPPORTED_SDK_VER: 20",
  "BLACKLISTED: 21",
];
