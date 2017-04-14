(function() {

var textarea = $("#html_text");
var iframe = $("#mavo_display");
var uploadButton = $("#upload_input_html_file");
var inputFile = $("#input_html_file");


textarea.oninput = function() {
    iframe.contentWindow.location.href = iframe.src; 
    iframe.srcdoc = textarea.value;
};

//consulted http://stackoverflow.com/questions/34212240/reading-uploaded-text-file-contents-in-variable
uploadButton.onclick = function() {
	var file = inputFile.files[0];
	var textType = /text.*/;
    if (file && file.type.match(textType)) {
        var reader = new FileReader();

        reader.onload = function(e) {
            //set up text in textarea
            textarea.value = reader.result;
            iframe.srcdoc = textarea.value;
        };
        reader.readAsText(file);    
    }
    
};

})();