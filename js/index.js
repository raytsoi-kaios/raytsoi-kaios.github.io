function addText(protocol) {
  var input = document.getElementById("newEndpt").value;
  console.log(input);
  if (/^http/.test(input)) {
    var path = input.match(/[^:]+$/);
    var output = protocol + ":" + path;
  } else {
    var output = protocol + "://" + input;
  }

  document.getElementById("newEndpt").value = output;
}

//For right softkey handling
document.addEventListener("DOMContentLoaded", () => {
  //For wrapSelectorButtons
  // document.querySelectorAll(".itemsWrapSelector").forEach((wrap) => {
  //   wrap.addEventListener("click", () => {
  //     wrap.children[0].focus();
  //   });
  //   //console.log(wrap.children);
  // });

  //Check display Add env
  let envList = document.getElementById("Env");
  envList.addEventListener("change", function checkSelect() {
    if (this.options[this.selectedIndex].value == "add") {
      document.getElementById("textInput").style.display = "unset";
    } else {
      document.getElementById("textInput").style.display = "none";
    }
  });

  //For http and https buttons
  document.getElementById("http").addEventListener("click", () => {
    addText("http");
  });
  document.getElementById("https").addEventListener("click", () => {
    addText("https");
  });

  let addBtn = document.getElementById("addNewEnv");
  addBtn.addEventListener("click", function addOption() {
    var newEndpt = document.getElementById("newEndpt").value;
    const newOption = document.createElement("option");
    newOption.text = newEndpt;
    newOption.value = newEndpt;
    document.getElementById("Env").add(newOption);
    addBtn.removeEventListener("click", addOption);
    document.getElementById("textInput").style.display = "none";
  });

  //Disable Invaild option for Test Tool page
  let adTypeCheck = document.getElementById("AdType");

  adTypeCheck.addEventListener("change", function checkSelectPage() {
    let envOptions = envList.querySelectorAll("option");
    switch (this.options[this.selectedIndex].value) {
      case "testTool":
        document.getElementById("Env").disabled = true;
        document.getElementById("SDKver").disabled = true;
        break;
      case "browser":
        envList.disabled = false;
        // console.log(envList.getElementsByTagName("option").length);
        for (i = 0; i < envList.getElementsByTagName("option").length; i++) {
          // console.log(envOptions[0]);
          if (envOptions[i].value == "add") {
            envOptions[i].selected = true;
            document.getElementById("textInput").style.display = "unset";
          } else {
            // console.log(i, envOptions[i]);
            envOptions[i].disabled = true;
          }
        }
        document.getElementById("SDKver").disabled = true;
        break;
      default:
        document.getElementById("textInput").style.display = "none";
        for (i = 0; i < envList.getElementsByTagName("option").length; i++) {
          envOptions[i].disabled = false;
        }
        envList.disabled = false;
        document.getElementById("SDKver").disabled = false;
        break;
    }
  });

  let sdkVerCheck = document.getElementById("SDKver");
  sdkVerCheck.addEventListener("change", function checkSelectVer() {
    var selectedVer = this.options[this.selectedIndex].value;
    switch (true) {
      case /web/.test(selectedVer):
        envList.disabled = true;
        document.getElementById("prod").selected = true;
        break;
      case /loader/.test(selectedVer):
        envList.disabled = true;
        document.getElementById("prod").selected = true;
        break;
      default:
        envList.disabled = false;
        break;
    }
  });

  //Add page here
  function assignPage(form) {
    var e = document.getElementById("AdType");
    var selectedType = e.options[e.selectedIndex].value;
    switch (selectedType) {
      case "backgroundReq":
        form.action = "/pages/backgroundReq.html";
        console.log("backgroundReq");
        break;
      case "ui_test":
        form.action = "/pages/ui_test.html";
        console.log("UI");
        break;
      case "font_test":
        form.action = "/pages/font.html";
        console.log("Font");
        break;
      case "browser":
        form.action = "/pages/browser.html";
        console.log("browser");
        break;
      case "testTool":
        form.action = "/pages/testTool.html";
        console.log("testTool");
        break;
      case "automation":
        form.action = "/pages/automation.html";
        console.log("automation");
        break;
      case "request":
        form.action = "/pages/request.html";
        console.log("request");
        break;
      default:
        form.action = "/pages/custom.html";
        console.log("custom");
    }

    console.log(selectedType);
  }

  //Event listener: For set which html
  let button = document.getElementById("setVersion");
  button.addEventListener("click", function goSetHTML() {
    console.log("click");
    button.removeEventListener("click", goSetHTML); //Comment out because want to keep changing the Bg color,so the event keep listening
    assignPage(document.getElementById("sdkForm"));
    console.log("Done");
  });

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
      } else {
        content.style.display = "block";
      }
    });
  }
});
