getKaiAd({
  publisher: "e6dfb88f-ca58-4816-85ad-27eb07964d34",
  app: "testApp",
  slot: "banner_test1",
  h: 200, //60, //at least 54
  w: 200, //220, // at least 216
  test: 0,
  // container must be tyepof HTMLElement
  container: document.getElementById("responsive-ad-conteiner"),
  onerror: (err) => console.error("Custom catch:", sdkError[err]),
  onready: (ad) => {
    // Ad is resolved, loaded, and is ready to display
    // calling ad.show() will display the ad

    console.log("app: ad ready!");

    let button = document.getElementById("clickDisplay");
    button.addEventListener("click", function btnListener() {
      // calling 'display' will display the ad
      button.removeEventListener("click", btnListener);

      // App developer is responsible for allowing user to focus
      // on the ad by providing navigational className
      // and/or a tabindex
      ad.call("display", {
        tabindex: 0,
        navClass: "items",
        display: "block",
      });
      console.log("ran ad.call");
    });

    ad.call("get", "clickURL");
    ad.on("get", (args) => {
      console.log("app: clickURL", args);
    });

    ad.on("click", (args) => console.log("click event", args));
    ad.on("close", (args) => console.log("close event", args));
    ad.on("display", (args) => console.log("display event", args));
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
