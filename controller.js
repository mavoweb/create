(function() {

var textarea = $("#html_text");
var iframe = $("#mavo_display");
var inputFile = $("#input_html_file");

var mavoDisplay = $("#mavo_display_container");
var htmlDisplay = $("#html_display_container");

var changeToHTMLDisplay = $("#change_to_html_display");
var changeToMavoDisplay = $("#change_to_mavo_display");
var changeToBothDisplay = $("#change_to_both_display");

iframe.onload = function() {
    var parser = new DOMParser();
    var doc = parser.parseFromString(textarea.value, "text/html");
    //add Mavo to page if it's not there already
    if (!iframe.contentWindow.Mavo) {
        $.create("script", {src: "//get.mavo.io/mavo.js", inside: iframe.contentDocument.head });
        $.create("link", {rel:"stylesheet", href:"//get.mavo.io/mavo.css", inside: iframe.contentDocument.head });
        iframe.contentDocument.body.innerHTML = "";
        var mvAppDivWrapper = $.create("div", {'mv-app':'', 'mv-storage':"local", innerHTML:doc.body.innerHTML, inside: iframe.contentDocument.body });
        textarea.value = iframe.contentDocument.documentElement.outerHTML;
    }

    var allElements = iframe.contentDocument.querySelectorAll('body *');
    allElements.forEach(function(e) {
        e.onmouseover = function(evt) {
            evt.target.style.outline = "5px solid black";
        };
        e.onmouseout = function(evt) {
            evt.target.style.outline = "";
        };
        e.onclick = function(evt) {
            evt.stopPropagation();
            evt.target.style.outline = "5px solid red";

            var elemToRemove = iframe.contentDocument.getElementById("creator-toolbar");
            if (elemToRemove) {
                elemToRemove.remove();
            }

            
            var givePropButton = $.create("button", {id:"give-property", textContent:"Give a Property Name"});
            var makeMultipleButton = $.create("button", {id:"make-multiple", textContent:"Allow for Multiple Copies"});
            var insertEquationButton = $.create("button", {id:"insert-equation", textContent:"Insert an Equation"});
            
            $.create("div", {id:"creator-toolbar", contents:[givePropButton, makeMultipleButton, insertEquationButton], inside: iframe.contentDocument.body});
        
            givePropButton.onclick = function() {
                // var newPropNameInput = $.create("input", {type:"text"});
                // $.create("div", {id:"new_prop_name_setter", contents:["Choose a property name:", newPropNameInput], inside: iframe.contentDocument.body});
                evt.target.setAttribute("property", "newPropName");
                textarea.value = iframe.contentDocument.documentElement.outerHTML;
                var elemToRemove = iframe.contentDocument.getElementById("creator-toolbar");
                evt.target.style.outline = "";
                if (elemToRemove) {
                    elemToRemove.remove();
                }
            };

        }
    });

};

textarea.oninput = function() {
    iframe.srcdoc = textarea.value;
};

//consulted http://stackoverflow.com/questions/34212240/reading-uploaded-text-file-contents-in-variable
inputFile.onchange = function() {
	var file = inputFile.files[0];
	var textType = /text.*/;
    if (file && file.type.match(textType)) {
        var reader = new FileReader();

        reader.onload = function(e) {
            textarea.value = reader.result;
            iframe.srcdoc = textarea.value;
        };
        reader.readAsText(file);    
    }
    
};

changeToHTMLDisplay.onclick = function() {
    htmlDisplay.style.display = "flex";
    mavoDisplay.style.display = "none";
};

changeToMavoDisplay.onclick = function() {
    mavoDisplay.style.display = "flex";
    htmlDisplay.style.display = "none";
};

changeToBothDisplay.onclick = function() {
    mavoDisplay.style.display = "flex";
    htmlDisplay.style.display = "flex";
};

})();