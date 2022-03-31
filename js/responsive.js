// document.querySelectorAll(".itemsWrapSelector").forEach((wrap) => {
//   wrap.addEventListener("click", () => {
//     wrap.children[0].focus();
//   });
//   //console.log(wrap.children);
// });

function preset() {
  document.getElementById("responsive-ad-conteiner").style.display = "none";
  document.getElementById("ad-holder2").style.display = "none";
  document.getElementById("presetSize").style.display = "unset";
  // document.addEventListener("DOMContentLoaded", () => {
  getKaiAd({
    publisher: "e6dfb88f-ca58-4816-85ad-27eb07964d34",
    app: "testApp",
    slot: "banner_test1",
    h: 200, //60, //at least 54
    w: 200, //220, // at least 216
    test: 0,
    // container must be tyepof HTMLElement
    container: document.getElementById("responsive-ad-conteiner"),
    onerror: (err) => {
      console.error("Custom catch:", sdkError[err]);
      document.getElementById("hiddenAdStatus").style.display = "unset";
      document.getElementById("hiddenAdStatus").innerHTML =
        "Custom catch: " + sdkError[err];
    },
    onready: (ad) => {
      // Ad is resolved, loaded, and is ready to display
      // calling ad.show() will display the ad

      console.log("app: ad ready!");
      document.getElementById("hiddenAdStatus").style.display = "inline-block";
      document.getElementById("hiddenAdStatus").innerHTML = "Hidden ad ready";

      let button = document.getElementById("clickDisplay");
      button.addEventListener("click", function btnListener() {
        var x = document.getElementById("clickResponsiveAdConteiner");
        // var x = document.getElementById("responsive-ad-conteiner");
        // calling 'display' will display the ad
        // button.removeEventListener("click", btnListener);
        if (x.style.display === "none") {
          x.style.display = "block";
          ad.call("display", {
            tabindex: 0,
            navClass: "items",
            display: "block",
          });

          console.log("ran ad.call");
        } else {
          document.getElementById("hiddenAdStatus").style.display = "none";
          x.style.display = "none";
        }
        // App developer is responsible for allowing user to focus
        // on the ad by providing navigational className
        // and/or a tabindex
      });

      ad.call("get", "clickURL");
      ad.on("get", (args) => {
        console.log("app: clickURL", args);
      });
      let clickBtn = document.getElementById("clickResponsiveAdConteiner");
      clickBtn.addEventListener(
        "click",
        (clickAd = () => {
          ad.call("click");
        })
      );
      ad.on("click", (args) => console.log("click event", args));
      ad.on("close", (args) => console.log("close event", args));
      ad.on("display", (args) => {
        console.log("clickDisplay: display event", args);
        document.getElementById("hiddenAdStatus").innerHTML = "Displayed";
      });
      ad.on("custom", (args) => console.log("custom event", args));
    },
  });

  getKaiAd({
    publisher: "e6dfb88f-ca58-4816-85ad-27eb07964d34",
    app: "testApp",
    slot: "banner_test2",
    h: 200, //54, //at least 54
    w: 200, //216, // at least 216
    test: 0,
    // container must be tyepof HTMLElement
    container: document.getElementById("ad-holder2"),
    onerror: (err) => console.error("Custom catch:", sdkError[err]),
    onready: (ad) => {
      // Ad is resolved, loaded, and is ready to display
      // calling ad.show() will display the ad

      console.log("app: ad ready!");

      ad.call("get", "clickURL");
      ad.on("get", (args) => {
        console.log("app: clickURL", args);
      });
      let clickBtn = document.getElementById("clickAdHolder2");
      clickBtn.addEventListener(
        "click",
        (clickAd = () => {
          ad.call("click");
        })
      );
      ad.on("click", (args) => console.log("click event", args));
      ad.on("close", (args) => console.log("close event", args));
      ad.on("display", (args) => console.log("display event", args));
      ad.on("custom", (args) => console.log("custom event", args));

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
  // });
}
preset();

//Set Custom Ad size
//For collapsible
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function () {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
      kiilIframe();
      preset();
    } else {
      content.style.display = "block";
      document.getElementById("customElement").style.display = "none";
      document.getElementById("status").style.display = "none";
    }
  });
}

//SetSize button to GetKaiAd
var height, width, e, testMode;

let button = document.getElementById("setSize");
button.addEventListener("click", function goSetSize() {
  document.getElementById("customElement").style.display = "unset";
  document.getElementById("status").style.display = "block";
  document.getElementById("presetSize").style.display = "none";
  console.log("Set Size");
  kiilIframe();
  // assPage(document.getElementById("sizeForm"));

  document.getElementById("statuslink").style.display = "none";
  document.getElementById("adSize").style.display = "none";
  document.getElementById("msgBox").style.display = "none";
  document.getElementById("custom-ad-container").style.display = "none";
  assSize();
  console.log("Done");
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
        document.getElementById("statuslink").style.display = "none";
        document.getElementById("msgBox").style.display = "inline-block";
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

        let clickBtn = document.getElementById("clickCustomAdContainer");
        // clickBtn.addEventListener(
        //   "click",
        //   (clickAd = () => {
        //     ad.call("click");
        //   })
        // );

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
          document.getElementById("msgBox").style.display = "none";
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
  } else {
    console.log("fullscreen hidden");
    getKaiAd({
      publisher: "customTest",
      app: "TestApp",
      slot: "customWHTest",
      test: parseInt(testMode.replace(/\w+=/g, "")),
      onerror: (err) => {
        console.error("Custom catch:", sdkError[err]);
        document.getElementById("statuslink").style.display = "none";
        document.getElementById("msgBox").style.display = "inline-block";
        document.getElementById("msgBox").innerHTML =
          "Custom catch: " + sdkError[err];
      },
      onready: (ad) => {
        // Ad is resolved, loaded, and is ready to display
        // calling ad.show() will display the ad

        console.log("app: ad ready!");
        document.getElementById("msgBox").style.display = "none";
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
  }
}

function kiilIframe() {
  var iframes = document.querySelectorAll("iframe");
  for (var i = 0; i < iframes.length; i++) {
    //  window.frames[i].stop();
    iframes[i].parentNode.removeChild(iframes[i]);
  }
}
