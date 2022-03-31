getKaiAd({
  publisher: "e6dfb88f-ca58-4816-85ad-27eb07964d34",
  app: "testApp",
  slot: "banner-ui_test",
  h: 36, //54, //at least 54
  w: 216, //216, // at least 216
  test: 0,
  // container must be tyepof HTMLElement
  container: document.getElementById("ui-test-216x36"),
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
getKaiAd({
  publisher: "e6dfb88f-ca58-4816-85ad-27eb07964d34",
  app: "testApp",
  slot: "banner-ui_test",
  h: 54, //54, //at least 54
  w: 216, //216, // at least 216
  test: 0,
  // container must be tyepof HTMLElement
  container: document.getElementById("ui-test-216x54"),
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

getKaiAd({
  publisher: "e6dfb88f-ca58-4816-85ad-27eb07964d34",
  app: "testApp",
  slot: "banner-ui_test",
  h: 50, //54, //at least 54
  w: 300, //216, // at least 216
  test: 0,
  // container must be tyepof HTMLElement
  container: document.getElementById("ui-test-300x50"),
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

getKaiAd({
  publisher: "e6dfb88f-ca58-4816-85ad-27eb07964d34",
  app: "testApp",
  slot: "banner-ui_test",
  h: 100, //54, //at least 54
  w: 220, //216, // at least 216
  test: 0,
  // container must be tyepof HTMLElement
  container: document.getElementById("ui-test-220x100"),
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
getKaiAd({
  publisher: "e6dfb88f-ca58-4816-85ad-27eb07964d34",
  app: "testApp",
  slot: "banner-ui_test",
  h: 50, //54, //at least 54
  w: 320, //216, // at least 216
  test: 0,
  // container must be tyepof HTMLElement
  container: document.getElementById("ui-test-320x50"),
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

getKaiAd({
  publisher: "e6dfb88f-ca58-4816-85ad-27eb07964d34",
  app: "testApp",
  slot: "banner-ui_test",
  h: 250, //54, //at least 54
  w: 300, //216, // at least 216
  test: 0,
  // container must be tyepof HTMLElement
  container: document.getElementById("ui-test-300x250"),
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

getKaiAd({
  publisher: "e6dfb88f-ca58-4816-85ad-27eb07964d34",
  app: "testApp",
  slot: "banner-ui_test",
  h: 250, //54, //at least 54
  w: 250, //216, // at least 216
  test: 0,
  // container must be tyepof HTMLElement
  container: document.getElementById("ui-test-250x250"),
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

getKaiAd({
  publisher: "e6dfb88f-ca58-4816-85ad-27eb07964d34",
  app: "testApp",
  slot: "banner-ui_test",
  h: 200, //54, //at least 54
  w: 200, //216, // at least 216
  test: 0,
  // container must be tyepof HTMLElement
  container: document.getElementById("ui-test-200x200"),
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

getKaiAd({
  publisher: "e6dfb88f-ca58-4816-85ad-27eb07964d34",
  app: "testApp",
  slot: "banner-ui_test",
  h: 100, //54, //at least 54
  w: 150, //216, // at least 216
  test: 0,
  // container must be tyepof HTMLElement
  container: document.getElementById("ui-test-150x100"),
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

getKaiAd({
  publisher: "e6dfb88f-ca58-4816-85ad-27eb07964d34",
  app: "testApp",
  slot: "banner-ui_test",
  h: 120, //54, //at least 54
  w: 120, //216, // at least 216
  test: 0,
  // container must be tyepof HTMLElement
  container: document.getElementById("ui-test-120x120"),
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

getKaiAd({
  publisher: "e6dfb88f-ca58-4816-85ad-27eb07964d34",
  app: "testApp",
  slot: "banner-ui_test",
  h: 100, //54, //at least 54
  w: 480, //216, // at least 216
  test: 0,
  // container must be tyepof HTMLElement
  container: document.getElementById("ui-test-480x100"),
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

//For getting background color
function assBGColor() {
  var color = document.getElementById("bgColor").value;
  console.log(color);
  return color;
}

//For set background color
let button = document.getElementById("setColor");
button.addEventListener("click", function changeColor() {
  console.log("set color");
  // button.removeEventListener('click', changeColor) //Comment out because want to keep changing the Bg color,so the event keep listening
  document.body.style.backgroundColor = assBGColor();
  console.log("Done");
});
//});

//For collapsible
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function () {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}
