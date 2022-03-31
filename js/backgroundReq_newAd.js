let adHolder2 = {
  height: 200,
  width: 220,
  el: document.getElementById("ad-holder2"),
};

//For disFun or disTOPFun

function disFun(p) {
  var h = adHolder2.height;
  document.getElementById("forScroll").style.display = "none";
  var elmnt = adHolder2.el;
  elmnt.scrollIntoView();
  p = parseInt(p);
  if (p < 100) {
    var y;
    y = ((101 - p) * h) / 100;
    window.scrollBy(0, y);
  }
}
function disTOPFun(p) {
  var h = adHolder2.height;
  var elmnt = adHolder2.el;
  var windowH = window.innerHeight;
  var forScroll = document.getElementById("forScroll");
  elmnt.scrollIntoView();
  p = parseInt(p);
  if (p < 100) {
    var y = ((p + 1) * h) / 100;
    forScroll.style.height = windowH + "px";
    forScroll.style.display = "block";
    window.scrollBy(0, -(windowH - y));
    // console.log("p", p, "; scroll up: ", windowH - y, ";y: ", y, ";h: ", h);
  }
}
var displayBtns = document.querySelectorAll(".display");
displayBtns.forEach((btn) => {
  if (btn.id.startsWith("dT")) {
    var val = btn.id.split("dT");
    btn.addEventListener("click", () => disTOPFun(val[1]));
  } else {
    var val = btn.id.split("d");
    btn.addEventListener("click", () => disFun(val[1]));
  }
});

//Get KaiAds
getKaiAd({
  publisher: "e6dfb88f-ca58-4816-85ad-27eb07964d34",
  app: "testApp",
  slot: "BACKGROUND_test2",
  h: adHolder2.height, //54, //at least 54
  w: adHolder2.width, //216, // at least 216
  test: 0,
  timeout: 600000,
  // container must be tyepof HTMLElement
  container: adHolder2.el,
  onerror: (err) => console.error("Custom catch:", sdkError[err]),
  onready: (ad) => {
    // Ad is resolved, loaded, and is ready to display
    // calling ad.show() will display the ad

    console.log("ad-holder2 - app: ad ready!");

    ad.call("get", "clickURL");
    ad.on("get", (args) => {
      console.log("app: clickURL", args);
    });

    ad.on("click", (args) => console.log("click event", args));
    ad.on("close", (args) => console.log("close event", args));
    ad.on("display", (args) => {
      console.log("[BACKGROUND]ad-holder2 : display event", args);
      let clickBtn = adHolder2.el.parentElement;
      console.log("ClickBtn: ", clickBtn);
      clickBtn.addEventListener("click", () => {
        ad.call("click");
      });
    });
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
