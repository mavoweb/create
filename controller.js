(function() {

var textarea = $("#html_text");
var iframeTemplate = $("#template_display");
var iframeMavo = $("#mavo_display");
var inputFile = $("#input_html_file");

var mavoDisplay = $("#mavo_display_container");
var mavoInnerDisplay = $("#mavo_full_display_container");
var htmlDisplay = $("#html_display_container");
var templateDisplay = $("#template_display_container");

var showHTMLDisplay = $("#show_html_display");
var showMavoDisplay = $("#show_mavo_display");
var showTemplateDisplay = $("#show_template_display");

var modalContainer = $("#modal_container");
var closeModalButton = $("#close_modal_button");
var alreadyHasPropertyDescription = $("#already_has_property_description");
var existingPropertyName = $("#existing_property_name");
var inputPropertyName = $("#input_property_name");
var addPropertyButton = $("#add_property_button");
var changePropertyButton = $("#change_property_button");
var removePropertyButton = $("#remove_property_button");
var alreadyHasMvMultipleDescription = $("#already_has_mv_multiple_description");
var addMvMultiple = $("#add_mv_multiple_button");
var mvMultipleNote = $("#mv-multiple-note");
var removeMvMultiple = $("#remove_mv_multiple_button");

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
            openModal(evt.target.dataset.mavoHelperIndex);
        };
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

showHTMLDisplay.onclick = function() {
    changeDisplays();
};

showMavoDisplay.onclick = function() {
    changeDisplays();
};

showTemplateDisplay.onclick = function() {
    changeDisplays();
};

var changeDisplays = function() {
    var wantHTML = showHTMLDisplay.checked;
    var wantMavo = showMavoDisplay.checked;
    var wantTemplate = showTemplateDisplay.checked;

    templateDisplay.classList.remove("hidden");
    htmlDisplay.classList.remove("hidden");
    mavoInnerDisplay.classList.remove("hidden");
    mavoDisplay.classList.remove("hidden");
    mavoDisplay.classList.remove("row_flex_flow");
    mavoInnerDisplay.classList.remove("extra_left_border");

    if (wantTemplate && wantMavo && wantHTML) {
        //nothing different, default
    } else if (wantMavo && wantHTML) {
        templateDisplay.classList.add("hidden");
    } else if (wantHTML && wantTemplate) {
        mavoInnerDisplay.classList.add("hidden");
    } else if (wantMavo && wantTemplate) {
        htmlDisplay.classList.add("hidden");
        mavoDisplay.classList.add("row_flex_flow");
        mavoInnerDisplay.classList.add("extra_left_border");
    } else if (wantMavo) {
        templateDisplay.classList.add("hidden");
        htmlDisplay.classList.add("hidden");
    } else if (wantTemplate) {
        htmlDisplay.classList.add("hidden");
        mavoInnerDisplay.classList.add("hidden");
    } else if (wantHTML) {
        mavoDisplay.classList.add("hidden");
    } else {
        htmlDisplay.classList.add("hidden");
        mavoDisplay.classList.add("hidden");
    }
}


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


//MODAL CODE

closeModalButton.onclick = function() {
    modalContainer.classList.add("hidden");
    resetModal();
};

addPropertyButton.onclick = function() {
    var index = addPropertyButton.dataset.mavoLinkedIndex;
    var nodeInMaster = findSiblingInMasterDoc(index);
    if (nodeInMaster && inputPropertyName.value) {
        nodeInMaster.setAttribute("property", inputPropertyName.value);
        updateAllViews();
    }
    openModal(index);
};

changePropertyButton.onclick = function() {
    var index = changePropertyButton.dataset.mavoLinkedIndex;
    var nodeInMaster = findSiblingInMasterDoc(index);
    if (nodeInMaster && inputPropertyName.value) {
        nodeInMaster.setAttribute("property", inputPropertyName.value);
        updateAllViews();
    }
    openModal(index);
};

removePropertyButton.onclick = function() {
    var index = removePropertyButton.dataset.mavoLinkedIndex;
    var nodeInMaster = findSiblingInMasterDoc(index);
    if (nodeInMaster) {
        nodeInMaster.removeAttribute("property");
        updateAllViews();
    }
    openModal(index);
};

addMvMultiple.onclick = function() {
    var index = addMvMultiple.dataset.mavoLinkedIndex;
    var nodeInMaster = findSiblingInMasterDoc(index);
    if (nodeInMaster) {
        nodeInMaster.setAttribute("mv-multiple", "");
        updateAllViews();
    }
    openModal(index);
};

removeMvMultiple.onclick = function() {
    var index = removeMvMultiple.dataset.mavoLinkedIndex;
    var nodeInMaster = findSiblingInMasterDoc(index);
    if (nodeInMaster) {
        nodeInMaster.removeAttribute("mv-multiple");
        updateAllViews();
    }
    openModal(index);
};

var openModal = function(index) {
    var nodeInMaster = findSiblingInMasterDoc(index);

    addPropertyButton.dataset.mavoLinkedIndex = index;
    changePropertyButton.dataset.mavoLinkedIndex = index;
    removePropertyButton.dataset.mavoLinkedIndex = index;
    addMvMultiple.dataset.mavoLinkedIndex = index;
    removeMvMultiple.dataset.mavoLinkedIndex = index;

    existingPropertyName.value = "";
    inputPropertyName.value = "";

    var hasProperty = nodeInMaster.hasAttribute("property") && nodeInMaster.getAttribute("property");
    if (hasProperty) {
        var currentProperty = nodeInMaster.getAttribute("property")
        alreadyHasPropertyDescription.classList.remove("hidden");
        existingPropertyName.innerHTML = currentProperty;
        
        changePropertyButton.classList.remove("hidden");
        addPropertyButton.classList.add("hidden");
        removePropertyButton.classList.remove("hidden");
    } else {
        alreadyHasPropertyDescription.classList.add("hidden");
        changePropertyButton.classList.add("hidden");
        addPropertyButton.classList.remove("hidden");
        removePropertyButton.classList.add("hidden");
    }

    var hasMvMultiple = nodeInMaster.hasAttribute("mv-multiple") && (nodeInMaster.getAttribute("mv-multiple") == "" || nodeInMaster.getAttribute("mv-multiple") == true);
    if (hasMvMultiple && hasProperty) {
        alreadyHasMvMultipleDescription.classList.remove("hidden");
        addMvMultiple.classList.add("hidden");
        mvMultipleNote.classList.add("hidden");
        removeMvMultiple.classList.remove("hidden");
    } else if (hasProperty) {
        alreadyHasMvMultipleDescription.classList.add("hidden");
        addMvMultiple.classList.remove("hidden");
        addMvMultiple.removeAttribute("disabled");
        mvMultipleNote.classList.add("hidden");
        removeMvMultiple.classList.add("hidden");
    } else { //doesn't have a property
        alreadyHasMvMultipleDescription.classList.add("hidden");
        addMvMultiple.classList.remove("hidden");
        addMvMultiple.setAttribute("disabled", "true");
        mvMultipleNote.classList.remove("hidden");
        removeMvMultiple.classList.add("hidden");
    }

    modalContainer.classList.remove("hidden");
};


var resetModal = function() {
    addPropertyButton.removeAttribute("data-mavo-linked-index");
    changePropertyButton.removeAttribute("data-mavo-linked-index");
    removePropertyButton.removeAttribute("data-mavo-linked-index");
    addMvMultiple.removeAttribute("data-mavo-linked-index");
    removeMvMultiple.removeAttribute("data-mavo-linked-index");

    existingPropertyName.value = "";
    inputPropertyName.value = "";
};

})();