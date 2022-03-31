//Token to get SdkJS
const token = "oPdjesWeSc6w8zLXgjin";

//Back button action
const adTestGoBack = () => {
  window.history.back();
};

//Get Frame.html
const getSDKFiles = () => {
  const adFrameOrigin = "https://sdk-testing-tool.kaiads.com";
  const params = "/api/ad/frame_html?";
  return Promise.all([getSdkJS()]).then((r) => {
    let s = document.createElement("script");
    s.type = "text/javascript";
    s.innerHTML = r
      .join("\n")
      .replace("https://ssp.kaiads.com", adFrameOrigin)
      .replace("/static/v3/frame.html?", params);
    document.getElementsByTagName("head")[0].appendChild(s);
    return true;
  });
};

//Get SDK in master (latest release)
const getSdkJS = () => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(
      "get",
      `https://git.kaiostech.com/api/v4/projects/7003/repository/files/sdk%2Ejs/raw?ref=master&private_token=${token}`
    );
    xhr.send();

    xhr.onload = () => {
      resolve(xhr.response);
    };
    xhr.onerror = () => {
      reject("Load sdk.js error");
    };
  });
};

//SetSize button to GetKaiAd
var height, width, e, testMode;

document.addEventListener("DOMContentLoaded", () => {
  let button = document.getElementById("setSize");
  button.addEventListener("click", function goSetSize() {
    console.log("Set Size");
    var iframes = document.querySelectorAll("iframe");

    for (var i = 0; i < iframes.length; i++) {
      //  window.frames[i].stop();
      iframes[i].parentNode.removeChild(iframes[i]);
    }
    // assPage(document.getElementById("sizeForm"));
    document.getElementById("statuslink").style.display = "none";
    document.getElementById("adSize").style.display = "none";
    document.getElementById("msgBox").style.display = "none";
    document.getElementById("custom-ad-container").style.display = "none";
    assSize();
    console.log("Done");
  });
});

function assSize() {
  height = document.getElementsByName("height")[0].value;
  width = document.getElementsByName("width")[0].value;
  e = document.getElementById("testMode");
  testMode = e.options[e.selectedIndex].value;
  fs = document.getElementById("fullscreen");
  fullscreen = fs.options[fs.selectedIndex].value;
  console.log(height, width);

  if (fullscreen == 0) {
    getSDKFiles()
      .then(() => {
        getKaiAd({
          publisher: "customTest",
          app: "TestApp",
          slot: "customWHTest",
          h: parseInt(height.replace(/\w+=/g, "")),
          w: parseInt(width.replace(/\w+=/g, "")),
          test: parseInt(testMode.replace(/\w+=/g, "")),
          // container must be tyepof HTMLElement
          container: document.getElementById("custom-ad-container"),
          onerror: (err) => {
            console.error("Custom catch:", sdkError[err]);
            document.getElementById("msgBox").style.display = "unset";
            document.getElementById("msgBox").innerHTML =
              "Custom catch: " + sdkError[err];
          },
          onready: (ad) => {
            // Ad is resolved, loaded, and is ready to display
            // calling ad.show() will display the ad
            let lastDisplayTime;
            console.log("app: ad ready!");

            ad.call("get", "clickURL");
            ad.on("get", (args) => {
              console.log("app: clickURL", args);
            });

            ad.on("get", (args) => {
              console.log("app: clickURL", args);
            });

            ad.on("click", (args) => {
              console.log("click event", args);
            });
            ad.on("close", (args) => {
              console.log("close event", args);
            });
            ad.on("display", (args) => {
              var adSize = "Ad size: ( w:" + width + " x h:" + height + " )";
              document.getElementById("statuslink").style.display = "unset";
              document.getElementById("status").innerHTML = "Ad dislayed";
              document.getElementById("adSize").style.display = "unset";
              document.getElementById("adSize").innerHTML = adSize;
              console.log("dislay event", args);
            });
            // App developer is responsible for allowing user to focus
            // on the ad by providing navigational className
            // and/or a tabindex
            ad.call("display", {
              tabindex: 0,
              navClass: "items",
              display: "block", // or inline-block
            });
          },
        });
      })
      .catch((e) => {
        console.error(e);
        document.getElementById("msgBox").style.display = "unset";
        document.getElementById("msgBox").innerHTML = e;
      });
  } else {
    console.log("fullscreen hidden");
    getSDKFiles()
      .then(() => {
        getKaiAd({
          publisher: "customTest",
          app: "TestApp",
          slot: "customWHTest",
          test: parseInt(testMode.replace(/\w+=/g, "")),
          onerror: (err) => {
            console.error("Custom catch:", sdkError[err]);
            document.getElementById("msgBox").style.display = "unset";
            document.getElementById("msgBox").innerHTML =
              "Custom catch: " + sdkError[err];
          },
          onready: (ad) => {
            // Ad is resolved, loaded, and is ready to display
            // calling ad.show() will display the ad

            console.log("app: ad ready!");
            document.getElementById("statuslink").style.display = "unset";
            document.getElementById("status").innerHTML = "Ad Ready";

            ad.call("get", "clickURL");
            ad.on("get", (args) => {
              console.log("app: clickURL", args);
            });

            ad.on("get", (args) => {
              console.log("app: clickURL", args);
            });

            ad.on("click", (args) => {
              console.log("click event", args);
            });
            ad.on("close", (args) => {
              console.log("close event", args);
            });
            ad.on("display", (args) => {
              console.log("dislay event", args);
            });
            // App developer is responsible for allowing user to focus
            // on the ad by providing navigational className
            // and/or a tabindex
            ad.call("display", {
              tabindex: 0,
              navClass: "items",
              display: "block", // or inline-block
            });
          },
        });
      })
      .catch((e) => {
        console.error(e);
        document.getElementById("msgBox").style.display = "unset";
        document.getElementById("msgBox").innerHTML = e;
      });
  }
}
