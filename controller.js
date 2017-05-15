(function() {

var textarea = $("#html_text");
var iframeTemplate = $("#template_display");
var iframeMavo = $("#mavo_display");
var inputFile = $("#input_html_file");

var mavoDisplay = $("#mavo_display_container");
var htmlDisplay = $("#html_display_container");

var changeToHTMLDisplay = $("#change_to_html_display");
var changeToMavoDisplay = $("#change_to_mavo_display");
var changeToBothDisplay = $("#change_to_both_display");

//create a masterDoc, which will be the point of reference for making any changes
//each node in the html is assigned a data-mavo-helper-index, which allows us to recognize the same node in
//  different copied views
var createMasterDoc = function() {
    var parser = new DOMParser();
    masterDoc = parser.parseFromString(textarea.value, "text/html");
    var allElements = masterDoc.querySelectorAll('body *');
    var dataIndex = 1;
    allElements.forEach(function(e) {
        e.dataset.mavoHelperIndex = dataIndex;
        dataIndex += 1;
    });
    return masterDoc;
}

var masterDoc = createMasterDoc();


iframeTemplate.onload = function() {
    var allElements = iframeTemplate.contentDocument.querySelectorAll('body *');
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

            var elemToRemove = iframeTemplate.contentDocument.getElementById("creator-toolbar");
            if (elemToRemove) {
                elemToRemove.remove();
            }

            var nodeInMaster = findSiblingInMasterDoc(evt.target.dataset.mavoHelperIndex);
            
            var givePropButton = $.create("button", {id:"give-property", textContent:"Give a Property Name"});
            var makeMultipleButton = $.create("button", {id:"make-multiple", textContent:"Allow for Multiple Copies"});
            var insertEquationButton = $.create("button", {id:"insert-equation", textContent:"Insert an Equation"});
            
            $.create("div", {id:"creator-toolbar", contents:[givePropButton, makeMultipleButton, insertEquationButton], inside: iframeTemplate.contentDocument.body});
        
            givePropButton.onclick = function() {
                var currentProperty = nodeInMaster.getAttribute("property")
                if (currentProperty) {
                    //this node already has a property name; would you like to rename it?
                } else {
                    // var newPropNameInput = $.create("input", {type:"text"});
                    // $.create("div", {id:"new_prop_name_setter", contents:["Choose a property name:", newPropNameInput], inside: iframe.contentDocument.body});
                    var rand = Math.floor(Math.random() * 1000) +1;
                    nodeInMaster.setAttribute("property", ""+rand);
                    //textarea.value = iframeTemplate.contentDocument.documentElement.outerHTML;
                    var elemToRemove = iframeTemplate.contentDocument.getElementById("creator-toolbar");
                    evt.target.style.outline = "";
                    if (elemToRemove) {
                        elemToRemove.remove();
                    }
                    updateAllViews();
                }
                
            };

            makeMultipleButton.onclick = function() {
                var currentlyMultiple = nodeInMaster.hasAttribute("mv-multiple")
                if (currentlyMultiple) {
                    //this item is already a multiple; would you like to undo this?
                    updateAllViews();
                } else {
                    nodeInMaster.setAttribute("mv-multiple", "");
                    var elemToRemove = iframeTemplate.contentDocument.getElementById("creator-toolbar");
                    evt.target.style.outline = "";
                    if (elemToRemove) {
                        elemToRemove.remove();
                    }
                    updateAllViews();
                }
                
            };

            insertEquationButton.onclick = function() {
                
            };

        }
    });

};


iframeMavo.onload = function() {
    //add Mavo to page if it's not there already
    if (!iframeMavo.contentWindow.Mavo) {
        $.create("script", {src: "//get.mavo.io/mavo.js", inside: iframeMavo.contentDocument.head });
        $.create("link", {rel:"stylesheet", href:"//get.mavo.io/mavo.css", inside: iframeMavo.contentDocument.head });
        iframeMavo.contentDocument.body.setAttribute("mv-app", "");
        iframeMavo.contentDocument.body.setAttribute("mv-storage", "local");
        //then add Mavo to the masterDoc and the textarea
        addMavo();
    }

};

//when the user changes something in the textarea, re-create the masterDoc. Update the 2 display views accordingly
textarea.oninput = function() {
    masterDoc = createMasterDoc();
    //textarea.value = masterDoc.documentElement.outerHTML;
    iframeMavo.srcdoc = masterDoc.documentElement.outerHTML;
    iframeTemplate.srcdoc = removeMavo(masterDoc.documentElement.outerHTML);

    
};

//when a file is uploaded, create a new version of the masterDoc. load information into all views accordingly
//consulted http://stackoverflow.com/questions/34212240/reading-uploaded-text-file-contents-in-variable
inputFile.onchange = function() {
	var file = inputFile.files[0];
	var textType = /text.*/;
    if (file && file.type.match(textType)) {
        var reader = new FileReader();

        reader.onload = function(e) {
            textarea.value = reader.result;
            masterDoc = createMasterDoc();
            //textarea.value = masterDoc.documentElement.outerHTML;
            iframeMavo.srcdoc = masterDoc.documentElement.outerHTML;
            iframeTemplate.srcdoc = removeMavo(masterDoc.documentElement.outerHTML);
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


// Add mavo to the original masterDoc, and update the textarea view
var addMavo = function() {
    $.create("script", {src: "//get.mavo.io/mavo.js", inside: masterDoc.head });
    $.create("link", {rel:"stylesheet", href:"//get.mavo.io/mavo.css", inside: masterDoc.head });
    masterDoc.body.setAttribute("mv-app", "");
    masterDoc.body.setAttribute("mv-storage", "local");
    updateTextarea();
};

//update textarea: show the masterDoc without the data-mavo-helper-index attributes
var updateTextarea = function() {
    textarea.value = masterDoc.documentElement.outerHTML;
    textarea.value = textarea.value.replace(/ data-mavo-helper-index="[0-9]+"/gi, "");
};

//update all views to reflect newest changes
var updateAllViews = function() {
    updateTextarea();
    iframeMavo.srcdoc = masterDoc.documentElement.outerHTML;
    iframeTemplate.srcdoc = removeMavo(masterDoc.documentElement.outerHTML);
};


//remove the Mavo script and css from a clone of the master doc; return the String of the resulting html
var removeMavo = function() {
    var doc = masterDoc.cloneNode(true);

    var scriptToRemove;
    var scripts = doc.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; i++) {
        var currentScript = scripts[i];
        if (currentScript.getAttribute("src") == "//get.mavo.io/mavo.js") {
            scriptToRemove = currentScript;
        }
    }
    if (scriptToRemove) {
        scriptToRemove.parentNode.removeChild(scriptToRemove);
    }

    var linkToRemove;
    var links = doc.getElementsByTagName("link");
    for (var i = 0; i < links.length; i++) {
        var currentLink = links[i];
        if (currentLink.getAttribute("href") == "//get.mavo.io/mavo.css") {
            linkToRemove = currentLink;
        }
    }
    if (linkToRemove) {
        linkToRemove.parentNode.removeChild(linkToRemove);
    }

    return doc.documentElement.outerHTML;
};

//given the data-mavo-helper-index number, find the corresponding node in the masterDoc
var findSiblingInMasterDoc = function(index) {
    if (index) {
        var siblings = masterDoc.querySelectorAll('[data-mavo-helper-index="'+ index + '"]');
        return siblings[0];
    }
};

})();