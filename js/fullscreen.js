//document.addEventListener("DOMContentLoaded", () => {
getKaiAd({
  publisher: "e6dfb88f-ca58-4816-85ad-27eb07964d34",
  app: "testApp",
  slot: "fullscreen_test",
  // h: 50,
  //w: 240,
  test: 0,
  // If container (HTMLElement) is not provided, a full screen ad will be attempted
  // it will be: absolutely positioned and document.body appended
  container: undefined,
  onerror: (err) => {
    console.error("Custom catch:", sdkError[err]);
    document.getElementById("fullscreenError").innerHTML =
      "Custom catch: " + sdkError[err];
  },
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
    ad.call("display");
  },
});
//});
