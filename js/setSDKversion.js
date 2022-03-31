//Set environment
const customAdFrameOrigin = "http://192.168.137.192:8000";
// const customAdFrameOrigin = "http://127.0.0.1:8000";
var setAdFrameOrigin;
const webIntegration_v3 = "https://static.kaiads.com/ads-sdk/ads-sdk.v3.min.js";
const webIntegration_v4 = "https://static.kaiads.com/ads-sdk/ads-sdk.v4.min.js";

//SetSDKversion:
const params = new URL(location.href).searchParams;
const sdkVersion = params.get("SDKver");
var adType = params.get("AdType");
var setEnv = params.get("Env");
//Debug-use
// for (const [key, value] of params) {
//   console.log(`Key: ${key}, Value: ${value}`);
// }
function callPageJs() {
  var page = document.createElement("script");
  page.src = "../js/" + adType + ".js";
  document.head.appendChild(page);
}

function assignEnv(sdkVersion, env) {
  if (/loader/.test(sdkVersion) || /web/.test(sdkVersion)) {
    env = "prod";
  }
  switch (env) {
    case "local":
      setAdFrameOrigin = "http://127.0.0.1:8000";
      break;
    case "custom":
      setAdFrameOrigin = customAdFrameOrigin;
      break;
    case "qa":
      setAdFrameOrigin = "https://qa1v2-ssp-srv.kaiads.com";
      break;
    case "test":
      // setAdFrameOrigin = "https://testv2.ssp.kaiads.com";
      setAdFrameOrigin = "https://testv2-ssp-srv.kaiads.com";
      break;
    case "stage":
      //setAdFrameOrigin = "https://stagev2.ssp.kaiads.com";
      setAdFrameOrigin = "https://stagev2-ssp-srv.kaiads.com";
      break;
    case "prod":
      setAdFrameOrigin = "https://ssp.kaiads.com";
      break;
    default:
      setAdFrameOrigin = setEnv;
      break;
  }
}

window.onload = function () {
  assignEnv(sdkVersion, setEnv);
  if (window.location.href.indexOf("ui_test.html") > -1) {
    adType = "ui_test";
  }
  if (window.location.href.indexOf("backgroundReq.html") > -1) {
    adType = "backgroundReq";
  }
  if (window.location.href.indexOf("automation.html") > -1) {
    adType = "automation";
  }
  var element = document.createElement("script");
  if (/web/.test(sdkVersion)) {
    switch (sdkVersion) {
      case "web_v3":
        element.src = webIntegration_v3;
        break;
      case "web_v4":
        element.src = webIntegration_v4;
        break;
    }
  } else {
    element.src = "../sdk/sdk-" + sdkVersion + ".js";
  }

  document.head.appendChild(element);
  if (element.readyState) {
    //IE
    element.onreadystatechange = function () {
      if (element.readyState == "loaded" || element.readyState == "complete") {
        element.onreadystatechange = null;
        callPageJs();
      }
    };
  } else {
    //Others
    element.onload = function () {
      callPageJs();
    };
  }

  const newDiv = document.createElement("p");
  var newContent;
  // and give it some content
  if (sdkVersion == "web") {
    newContent = document.createTextNode(adType + " - sdk: " + webIntegration);
  } else {
    newContent = document.createTextNode(adType + " - sdk" + sdkVersion);
  }

  // add the text node to the newly created div
  newDiv.appendChild(newContent);

  const envDiv = document.createElement("p");
  // and give it some content
  const envContent = document.createTextNode("Env: " + setAdFrameOrigin);
  // add the text node to the newly created div
  envDiv.appendChild(envContent);

  // add the newly created element and its content into the DOM
  const currentDiv = document.getElementById("div1");
  currentDiv.appendChild(newDiv);
  currentDiv.appendChild(envDiv);
  //   document.body.insertBefore(newDiv, currentDiv);
  //   document.body.insertBefore(envDiv, currentDiv);
};

document.addEventListener("DOMContentLoaded", () => {
  if (adType == "fullscreen") {
    document.getElementById("responsiveElement").style.visibility = "hidden";
  }
});
