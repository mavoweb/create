(function() {

var textarea = $("#html_text");
var iframe = $("#mavo_display");
var uploadButton = $("#upload_input_html_file");
var inputFile = $("#input_html_file");

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
    

};

textarea.oninput = function() {
    iframe.srcdoc = textarea.value;
};

//consulted http://stackoverflow.com/questions/34212240/reading-uploaded-text-file-contents-in-variable
uploadButton.onclick = function() {
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

})();