const adResponsiveContainer = {
  height: 250,
  width: 300,
  el: document.getElementById("responsive-ad-conteiner"),
};

//For 'Get New Ad' button
var getNewAdBtn = document.getElementById("getNewAd");

function getNewAd() {
  getNewAdBtn.style.display = "none";
  getNewAdBtn.style.visibility = "hidden";
  var element = document.createElement("script");
  element.src = "../js/backgroundReq_newAd.js";
  document.head.appendChild(element);
  document.getElementById("displayListUp").style.display = "block";
  document.getElementById("displayList").style.display = "block";
}

getNewAdBtn.addEventListener(
  "click",
  (newAdBtnListener = () => {
    getNewAd();
    getNewAdBtn.removeEventListener("click", newAdBtnListener);
  })
);

//For Overlay
function on() {
  document.getElementById("overlay").style.display = "block";
}
document.getElementById("overlayBtn").addEventListener("click", () => {
  on();
  document.getElementsByClassName("closebtn")[0].focus();
  document.getElementById("overlay").addEventListener("click", () => off());
});

function off() {
  document.getElementById("overlay").style.display = "none";
}

//For List button
document
  .getElementById("goList")
  .addEventListener("click", () =>
    document.getElementById("displayList").scrollIntoView()
  );

getKaiAd({
  publisher: "e6dfb88f-ca58-4816-85ad-27eb07964d34",
  app: "testApp",
  slot: "ClickDisplay_test1",
  h: adResponsiveContainer.height, //60, //at least 54
  w: adResponsiveContainer.width, //220, // at least 216
  test: 0,
  // container must be tyepof HTMLElement
  container: adResponsiveContainer.el,
  onerror: (err) => {
    console.error("Custom catch:", sdkError[err]);
    document.getElementById("hiddenAdStatus").style.display = "unset";
    document.getElementById("hiddenAdStatus").innerHTML =
      "Custom catch: " + sdkError[err];
  },
  onready: (ad) => {
    // Ad is resolved, loaded, and is ready to display
    // calling ad.show() will display the ad

    console.log("clickDisplay - app: ad ready!");
    document.getElementById("hiddenAdStatus").style.display = "inline-block";
    document.getElementById("hiddenAdStatus").innerHTML = "Hidden ad ready";

    let button = document.getElementById("clickDisplay");
    button.addEventListener("click", () => {
      var x = adResponsiveContainer.el.parentElement;
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
        x.style.display = "none";
        document.getElementById("hiddenAdStatus").style.display = "none";
      }
    });

    ad.call("get", "clickURL");
    ad.on("get", (args) => {
      console.log("app: clickURL", args);
    });

    ad.on("click", (args) => console.log("click event", args));
    ad.on("close", (args) => console.log("close event", args));
    ad.on("display", (args) => {
      console.log("clickDisplay: display event", args);
      document.getElementById("hiddenAdStatus").innerHTML = "Displayed";
      let clickBtn = adResponsiveContainer.el.parentElement;
      console.log("ClickBtn: ", clickBtn);
      clickBtn.addEventListener("click", () => {
        ad.call("click");
        console.log("By clickBtn");
      });
    });
    ad.on("custom", (args) => console.log("custom event", args));
  },
});
