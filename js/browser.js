const presetUrl = "http://192.168.137.192:5500/index.html";
var setEnv;
window.onload = function () {
  const params = new URL(location.href).searchParams;
  setEnv = params.get("Env");
  if (
    setEnv == "custom" ||
    setEnv == "test" ||
    setEnv == "stage" ||
    setEnv == "prod" ||
    setEnv == "add"
  ) {
    document.getElementById("goBtn").disabled = true;
    setEnv = "DISABLED";
  }
  const envDiv = document.createElement("p");
  const envContent = document.createTextNode("GO Btn: " + setEnv);
  envDiv.appendChild(envContent);
  const currentDiv = document.getElementById("div1");
  currentDiv.appendChild(envDiv);

  //For preset URL
  const presetDiv = document.createElement("p");
  const presetContent = document.createTextNode("PRESET: " + presetUrl);
  presetDiv.appendChild(presetContent);
  currentDiv.appendChild(presetDiv);
};

const openWithMozActivity = (clickUrl) => {
  // Use KaiOS browser to open the url
  if (!window.MozActivity) {
    console.log("Open - " + clickUrl);
    return;
  }
  new MozActivity({
    name: "view",
    data: {
      url: clickUrl,
      type: "url",
    },
  });
};

function goOpen() {
  var url = setEnv;
  openWithMozActivity(url);
}
