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
    if (!iframe.contentWindow.Mavo) {
        $.create("script", {src: "//mavo.io/mavo/mavo.js", inside: iframe.contentDocument.head });
        $.create("link", {rel:"stylesheet", href:"//mavo.io/mavo/mavo.css", inside: iframe.contentDocument.head });
        // $.include(iframe.contentWindow.Mavo, "//mavo.io/mavo/mavo.js").then(function(){
        //         if (Mavo.inited) {
        //            Mavo.init();
        //         }
        // });
        textarea.value = iframe.contentDocument.documentElement.outerHTML;
    }

    iframe.contentWindow.document.body.onmousemove = function(e) {
        e.target.style.outline = "5px solid black";

        //listener to remove outline when mouse leaves element
        e.target.onmouseleave = function(evt) {
            evt.currentTarget.style.outline = "";
        }

        //remove outline from parent elements
        var a =  e.target.parentNode;
        var els = [];
        while (a && a.tagName !== "HTML") {
            console.log(a);
            a.style.outline = "";
            a = a.parentNode;
        }
    }
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