(function() {

var flask = new CodeFlask;
flask.run('#html_text', {language: 'markup'});

var textarea = $("textarea");
var iframe = $("#mavo_display");

iframe.onload = function() {
    iframe.contentDocument.body.innerHTML = textarea.value;

    var Mavo = iframe.contentWindow.Mavo;

    if (!Mavo.all.length) {
        Mavo.init();
    }
};

textarea.oninput = function() {
    iframe.contentWindow.location.href = iframe.src; 
};

})();