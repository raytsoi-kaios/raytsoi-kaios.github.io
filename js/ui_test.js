class adConfig {
  constructor(height, width, containerId) {
    this.publisher = "e6dfb88f-ca58-4816-85ad-27eb07964d34";
    this.app = "testApp";
    this.slot = "banner-ui_test";
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
      ad.on("display", (args) => console.log("display event", args));
      ad.on("click", (args) => console.log("click event", args));
      ad.on("close", (args) => console.log("close event", args));
      ad.on("custom", (args) => console.log("custom event", args));

      ad.call("display", {
        tabindex: 0,
        navClass: "items",
        display: "block", // or inline-block
      });
      let clickBtn = this.container.parentElement;
      console.log(clickBtn);
      clickBtn.addEventListener("click", () => {
        ad.call("click");
        //console.log("By clickBtn");
      });
    };

    this.getAd = () =>{
      getKaiAd({
        publisher: this.publisher,
        app: this.app,
        slot: this.slot,
        h: this.h, //54, //at least 54
        w: this.w, //216, // at least 216
        test: this.test,
        // container must be tyepof HTMLElement
        container: this.container,
        onerror: this.onerror,
        onready: this.onready,
      });
    }
  }
}


let adConfig216x36 = new adConfig(36, 216, "ui-test-216x36");
let adConfig216x54 = new adConfig(54, 216, "ui-test-216x54");
let adConfig300x50 = new adConfig(50, 300, "ui-test-300x50");
let adConfig220x100 = new adConfig(100, 220, "ui-test-220x100");
let adConfig320x50 = new adConfig(50, 320, "ui-test-320x50");
let adConfig300x250 = new adConfig(250, 300, "ui-test-300x250");
let adConfig250x250 = new adConfig(250, 250, "ui-test-250x250");
let adConfig200x200 = new adConfig(200, 200, "ui-test-200x200");
let adConfig150x100 = new adConfig(100, 150, "ui-test-150x100");
let adConfig120x120 = new adConfig(120, 120, "ui-test-120x120");
let adConfig480x100 = new adConfig(100, 480, "ui-test-480x100");

// let adConfig216x36 = new adConfig(36, 216, "ui-test-216x36", "click216x36");
// let adConfig216x54 = new adConfig(54, 216, "ui-test-216x54", "click216x54");
// let adConfig300x50 = new adConfig(50, 300, "ui-test-300x50", "click300x50");
// let adConfig220x100 = new adConfig(100, 220, "ui-test-220x100", "click220x100");
// let adConfig320x50 = new adConfig(50, 320, "ui-test-320x50", "click320x50");
// let adConfig300x250 = new adConfig(250, 300, "ui-test-300x250", "click300x250");
// let adConfig250x250 = new adConfig(250, 250, "ui-test-250x250", "click250x250");
// let adConfig200x200 = new adConfig(200, 200, "ui-test-200x200", "click200x200");
// let adConfig150x100 = new adConfig(100, 150, "ui-test-150x100", "click150x100");
// let adConfig120x120 = new adConfig(120, 120, "ui-test-120x120", "click120x120");
// let adConfig480x100 = new adConfig(100, 480, "ui-test-480x100", "click480x100");

//GETKAIAD
adConfig216x36.getAd();
adConfig216x54.getAd();
adConfig300x50.getAd();
adConfig220x100.getAd();
adConfig320x50.getAd();
adConfig300x250.getAd();
adConfig250x250.getAd();
adConfig200x200.getAd();
adConfig150x100.getAd();
adConfig120x120.getAd();
adConfig480x100.getAd();

//UNSUPPORTED FOR FIREFOX UNDER V55
// getKaiAd({ ...adConfig216x36 });
// getKaiAd({...adConfig216x54});
// getKaiAd({ ...adConfig300x50 });
// getKaiAd({ ...adConfig220x100 });
// getKaiAd({ ...adConfig320x50 });
// getKaiAd({ ...adConfig300x250 });
// getKaiAd({ ...adConfig250x250 });
// getKaiAd({ ...adConfig200x200 });
// getKaiAd({ ...adConfig150x100 });
// getKaiAd({ ...adConfig120x120 });
// getKaiAd({ ...adConfig480x100 });

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
