getKaiAd({
  publisher: "e6dfb88f-ca58-4816-85ad-27eb07964d34",
  app: "testApp",
  slot: "automation_test",
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

    ad.on("click", (args) => console.log("click event", args));
    ad.on("close", (args) => console.log("close event", args));
    ad.on("display", (args) => {
      console.log("display event", args);
      var position = document.getElementById("ad-holder2");
      var x = position.offsetTop;
      var y = position.offsetLeft;
      console.log(x, y);
      document.getElementById("x").innerHTML = x;
      document.getElementById("y").innerText = y;
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

// function getOffset(el) {
//   var _x = 0;
//   var _y = 0;
//   while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
//     _x += el.offsetLeft - el.scrollLeft;
//     _y += el.offsetTop - el.scrollTop;
//     el = el.offsetParent;
//   }
//   return { top: _y, left: _x };
// }
// var x = getOffset(document.getElementById("ad-holder2")).left;
// console.log(x);
