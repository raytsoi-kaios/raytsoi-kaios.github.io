setAdFrameOrigin = "https://qa1v2-ssp-srv.kaiads.com";

class adConfig {
  constructor(height, width, containerId) {
    this.publisher = "e6dfb88f-ca58-4816-85ad-27eb07964d34";
    this.app = "testApp";
    this.slot = "test_config";
    this.h = height;
    this.w = width;
    this.test = 0;
    this.container = document.getElementById(containerId);
    this.onerror = (err) => console.error("Custom catch:", sdkError[err]);
    this.onready = (ad) => {
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
      ad.call("display", {
        tabindex: 0,
        navClass: "items",
        display: "block", // or inline-block
      });
      let clickBtn = this.container.parentElement;
      clickBtn.addEventListener("click", () => ad.call("click"));
    };
  }
}

document.addEventListener("DOMContentLoaded", () => {
  let adHolder2Config = new adConfig(320, 200, "ad-holder2");
  console.log(Object.entries(adHolder2Config));
  getKaiAd({ ...adHolder2Config });
  // let kaiAd = new Promise((resolve, reject) => {
  //   //let kaiAdController =
  //   getKaiAd({
  //     ...adHolder2Config,
  //     onerror: (err) => {
  //       console.error("Custom catch:", err);
  //       reject(err);
  //     },
  //     onready: (ad) => {
  //       ad.call("display", {
  //         tabindex: 0,
  //         navClass: "items",
  //         display: "block", // or inline-block
  //       });
  //       ad.on("display", (args) => console.log("display event", args));
  //       resolve(ad);
  //     },
  //   });

  //   let clickBtn = document.getElementById("clickAdHolder2");
  //   clickBtn.addEventListener("click", () => {
  //     console.log("clickBtn");
  //     console.log(kaiAd);
  //     kaiAd.then((ad) => {
  //       ad.call("click");
  //       ad.on("click", (args) => console.log("click event", args));
  //       window.open("http://helloworld", "popup");
  //     });
  //   });
  // });
});
