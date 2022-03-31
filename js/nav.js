document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("keydown", handleKeydownEvent);
  document.addEventListener("keydown", logKey);
  
  // if (document.querySelectorAll(".itemsWrapSelector").length != 0) {
  //   document.querySelectorAll(".itemsWrapSelector").forEach((wrap) => {
  //     wrap.addEventListener("click", () => {
  //       wrap.children[0].focus();
  //     });
  //   });
  // }
  var itemswrapSelector = document.querySelectorAll(".itemsWrapSelector")
  if(itemswrapSelector.length != 0){
    forEach(itemswrapSelector,function(index,value){
      itemswrapSelector[index].addEventListener("click", () => {
              // itemswrapSelector[index].children[0].focus();
              document.body.className="modal-open";
              // document.getElementById("options-overlay").style.display="block"
              var select = itemswrapSelector[index].children[0];
              select.focus();
              select.addEventListener("blur",()=>{
                document.body.className='';
              })
              var option = select.querySelectorAll("option")
              forEach(option, function(index,value){
                // console.log(option[index])
                // option[index].addEventListener('mouseover', hoverHandler)
              })
            });
        
    });
  }

});

// forEach method, could be shipped as part of an Object Literal/Module
var forEach = function (array, callback, scope) {
  for (var i = 0; i < array.length; i++) {
    callback.call(scope, i, array[i]); // passes back stuff we need
  }
};

function hoverHandler(e) {
  let self = e.target || e.srcElement;
  // self.focus();
  console.log(self);
}

function nav(e, dir) {
  //console.log(document.activeElement.tagName);
  const items = [...document.getElementsByClassName("items")].filter(
    (item) => item.tagName != "DIV"
  );
  // console.log("Items: ", items);
  items.some((el, i, arr) => {
    if (document.activeElement === document.body) {
      el.focus();
      // console.log("active");
      return true;
    }
    if (el !== document.activeElement) {
      // console.log("Not active");
      return false;
    }

    let next = i + dir;
    if (next < 0) {
      next = arr.length - 1;
      // console.log("<0");
    }
    if (next === arr.length) {
      // console.log("=length");
      next = 0;
    }

    for (
      ;
      arr[next].offsetParent == null ||
      arr[next].disabled == true ||
      arr[next].style.display == "none";

    ) {
      next = next + dir;
      // console.log("in for loop");
    }

    e.preventDefault();
    e.stopPropagation();
    arr[next].focus();
    // console.log("Focus:", next, arr[next]);
    return true;
  });
}

function handleKeydownEvent(e) {
  console.log(e);
  // console.log(e.key);
  switch (e.key) {
    case "ArrowUp":
      nav(e, -1);
      break;
    case "ArrowLeft":
      if (document.activeElement.tagName != "INPUT") {
        nav(e, -1);
      }
      break;
    case "ArrowDown":
      nav(e, 1);
      break;
    case "ArrowRight":
      if (document.activeElement.tagName != "INPUT") {
        nav(e, 1);
      }
      break;
    case "2":
      window.scrollTo(0, 0);
      break;
    case "5":
      window.scrollBy(0, -100);
      break;
    case "8":
      window.scrollBy(0, 100);
      break;
    case "4":
      window.scrollBy(-50, 0);
      break;
    case "6":
      window.scrollBy(50, 0);
      break;
  }
}
const logKey = (e) => {
  console.log(e)
  switch (e.key) {
    case "SoftRight":
      handleSoftRightInCustom(e);
      break;
    case "Alt":
      handleSoftRightInCustom(e);
      break;
    // case "Enter":
    // case "SoftLeft":
    //   console.log('Hi');
    //   if(document.body.className=="modal-open"){
    //     console.log('HiHi')
    //     document.body.className='';
    //   }
      // document.getElementById("options-overlay").style.display="none"
      break;
  }
};

const handleSoftRightInCustom = (e) => {
  console.log("handleSoftRightInCustom");
  let activeTag = document.activeElement.tagName;
  switch (activeTag) {
    case "INPUT":
      const inputs = [...document.getElementsByTagName("input")];
      //var current;
      inputs.some((el, i, arr) => {
        if (document.activeElement == el) {
          switch (i) {
            case inputs.length - 1:
              console.log("last");
              arr[i].blur();
              break;
            default:
              let next = i + 1;
              arr[i].blur();
              arr[next].focus();
              console.log("next");
              break;
          }
          return true;
        }
      });
      break;
    case "SELECT":
      const selects = [...document.getElementsByTagName("select")];
      selects.some((el, i, arr) => {
        if (document.activeElement == el) {
          el.blur();
          // console.log(el.parentElement.className);
          // el.parentElement.focus();
          return true;
        }
      });
      break;
  }
};
