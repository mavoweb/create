(function() {

var textarea = $("#html_text");
var iframe = $("#mavo_display");
var uploadButton = $("#upload_input_html_file");
var inputFile = $("#input_html_file");

iframe.onload = function() {
	//iframe.contentDocument.write(textarea.value);

    var potentialHeadText = textarea.value.split("<head>");
    if (potentialHeadText.length > 1) {
    	var headText = potentialHeadText[1].split("</head>");
    	if (headText.length > 1) {
    		var finalHeadText = headText[0];
    		if (!finalHeadText.includes("mavo.js") || !finalHeadText.includes("mavo.css")) {
    			iframe.contentDocument.head.innerHTML += finalHeadText;
			} else {
    			iframe.contentDocument.head.innerHTML = finalHeadText;
    		}
    	} else {
    		//Bad HTML?
    	}
    } else { //no head element; use default with just Mavo
    	//iframe.contentDocument.head.innerHTML = "<script src='//mavo.io/mavo/mavo.js'></script><link rel='stylesheet' href='//mavo.io/mavo/mavo.css'/>";
    }

    var potentialBodyText = textarea.value.split("<body>");
    if (potentialBodyText.length > 1) {
    	var bodyText = potentialBodyText[1].split("</body>");
    	if (bodyText.length > 1) {
    		iframe.contentDocument.body.innerHTML = bodyText[0];
    	} else {
    		//Bad HTML?
    	}
    } //else no body element

    //TODO: find a better way to read HTML from iFrame to put in textarea
    // var textareaNewContent = "<head>\n" + iframe.contentDocument.head.innerHTML + "\n</head>\n<body>\n" + iframe.contentDocument.body.innerHTML + "\n</body>\n";
    // textarea.value = textareaNewContent

    var Mavo = iframe.contentWindow.Mavo;

    if (Mavo && !Mavo.all.length) {
        Mavo.init();
    }
};

textarea.oninput = function() {
    iframe.contentWindow.location.href = iframe.src; 
};

//consulted http://stackoverflow.com/questions/34212240/reading-uploaded-text-file-contents-in-variable
uploadButton.onclick = function() {
	var file = inputFile.files[0];
	var textType = /text.*/;
    if (file && file.type.match(textType)) {
        var reader = new FileReader();

        reader.onload = function(e) {
            textarea.value = reader.result;
            iframe.contentWindow.location.href = iframe.src; 
        };
        reader.readAsText(file);    
    }
    
};

})();