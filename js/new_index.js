
let listOptionMap = new Map()
listOptionMap['EnvSelect'] = "EnvOptions"
listOptionMap['SDKverSelect'] = "SDKverOptions"
listOptionMap['AdTypeSelect'] = "AdTypeOptions"


// forEach method, could be shipped as part of an Object Literal/Module
var forEach = function (array, callback, scope) {
    for (var i = 0; i < array.length; i++) {
      callback.call(scope, i, array[i]); // passes back stuff we need
    }
  };
  
 
var optionsContainer,options,overlay

document.addEventListener('DOMContentLoaded', function() {
    const selectItems = document.querySelectorAll(".selectItem")
    // selectItems.forEach((item)=>{item.addEventListener("click",popUpMenu)})

 // Usage:
  // optionally change the scope as final parameter too, like ECMA5
//   var myNodeList = document.querySelectorAll('li');
//   forEach(myNodeList, function (index, value) {
//     console.log(index, value); // passes index + value back!
//   });
  forEach(selectItems, function (index, value) {
    console.log(index, value); // passes index + value back!
    selectItems[index].addEventListener("click",popUpMenu);
  });



    overlay = document.getElementById("options-overlay")

 function popUpMenu(e){
    console.log("optionsContainer",listOptionMap[e.target.id])
    console.log("target",e.target.id)

    var optionList = document.getElementById(e.target.id)
    //const optionsContainer = optionList.querySelectorAll('.kaiads-options-container')
    optionsContainer =  document.getElementById(listOptionMap[e.target.id])
    //const optionsHeader = document.querySelectorAll(".options-header")
    document.getElementById("options-overlay").style.display = "unset";
    optionsContainer.style.display = "flex";
    options = optionsContainer.querySelectorAll(".option")
 
   // optionsContainer.forEach((container)=>{container.addEventListener('keydown', optionsKeydownHandler)});
    optionsContainer.addEventListener('keydown', optionsKeydownHandler);
    // options.forEach((option)=>{
    //  option.addEventListener('mouseover', hoverHandler)
    //  option.addEventListener('click', optionsClickHandler)
    //  });

     forEach(options, function (index, value) {
        options[index].addEventListener('mouseover', hoverHandler)
        options[index].addEventListener('click', optionsClickHandler)
      });
    overlay.addEventListener('click', overlayClose);
    options[0].focus();
 }

   //kaios-option menu
//    let envList = document.getElementById("envSelect");
//    envList.addEventListener("click", function envSelect() {
//        document.getElementById("options-overlay").style.display = "unset";
//        document.getElementById("envOptions").style.display = "flex";


       



    


     // Handlers
     function hoverHandler(e) {
        let self = e.target || e.srcElement;
        self.focus();
      }

      function optionsClickHandler(e) {
        console.log("optionsClickHandler",e,e.target.dataset.selectValue)
        closeOptions(e.target);
      }

      function optionsKeydownHandler(e) {
        e.stopPropagation();
        let nextFocus = null;
        switch (e.key) {
          case 'Enter':
            document.activeElement.click();
            console.log('click')
            break;
          case 'Backspace':
            e.preventDefault();
            closeOptions();
            break;
          case 'ArrowDown':
            nextFocus = document.activeElement.nextElementSibling;
            break;
          case 'ArrowUp':
            nextFocus = document.activeElement.previousElementSibling;
            break;
          default:
            break;
        }
        if (nextFocus) {
            // console.log("activeElement",document.activeElement)
            // console.log("nextFocus:",nextFocus)
          nextFocus.focus();
        }
      }

      function closeOptions(selected) {
        // document.getElementById("envOptions").style.display = "none";
        optionsContainer.style.display = "none";
        overlay.style.display="none";
     
        var currentSelect =  document.getElementById(selected.dataset.formCategory)
        var currentOption = currentSelect.firstElementChild
        // Add option into select list
        currentOption.text = selected.text;
        currentOption.value = selected.dataset.selectValue;
        currentSelect.value= selected.dataset.selectValue;
        //
        //Display selected option

        const currentDiv = document.getElementById(selected.dataset.formCategory+"Select")
        currentDiv.textContent = currentDiv.dataset.name+": "+ currentSelect.textContent
        //Remove Listener
        // optionsContainer.forEach((container)=>container.removeEventListener('keydown', optionsKeydownHandler));
        optionsContainer.removeEventListener('keydown', optionsKeydownHandler);
        // options.forEach((option)=>option.removeEventListener('click', optionsClickHandler));
        forEach(options, function (index, value) {
            options[index].removeEventListener('click', optionsClickHandler)
          });
        

        // overlay.removeEventListener('keydown', optionsKeydownHandler);
        // overlay.remove();
        //optionsContainer.remove();
     
      };

      function overlayClose(){
        optionsContainer.style.display = "none";
        overlay.style.display="none";
        optionsContainer.removeEventListener('keydown', optionsKeydownHandler);
        overlay.removeEventListener('click', overlayClose);
        
      }

    // })

});

