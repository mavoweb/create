(function() {

var iframeMavo = document.getElementById("mavo-display");
var mavoDisplay = document.getElementById("mavo-display-container");
mavoDisplay.classList.add("hidden");

var mvStorage = 'local';
var mvApp = '';

// Set up GrapesJS editor with the Newsletter plugin
var editor = grapesjs.init({
  clearOnRender: true,
  height: '100%',
  storageManager: {
    id: 'gjs-nl-',
  },
  container : '#gjs',
  fromElement: true,
  plugins: ['gjs-preset-newsletter'],
  pluginsOpts: {
    'gjs-preset-newsletter': {
      modalLabelImport: 'Paste all your code here below and click import',
      modalLabelExport: 'Copy the code and use it wherever you want',
      codeViewerTheme: 'material',
      //defaultTemplate: templateImport,
      importPlaceholder: '<table class="table"><tr><td class="cell">Hello world!</td></tr></table>',
      cellStyle: {
        'font-size': '12px',
        'font-weight': 300,
        'vertical-align': 'top',
        color: 'rgb(111, 119, 125)',
        margin: 0,
        padding: 0,
      }
    },
  }
});

// for debugging
// window.editor = editor;
domComponents = editor.DomComponents;

//add property and mv-multiple
for (var i = 0; i < domComponents.componentTypes.length; i++) {
    var compType = domComponents.componentTypes[i].id;
    var originalComp = domComponents.getType(compType);
    var givenTraits = originalComp.model.prototype.defaults.traits;
    var newTraits = givenTraits.slice();
    newTraits.push({
              type: 'input',
              label: 'Mavo Name',
              name: 'property',
            });
    newTraits.push({
              type: 'checkbox',
              label: 'Repeatable',
              name: 'mv-multiple',
            });
   
    domComponents.addType(compType, {
        model: originalComp.model.extend({
            defaults: Object.assign({}, originalComp.model.prototype.defaults, {
              traits: newTraits,
            }),
        }),
        view: originalComp.view
    });
};



var pnm = editor.Panels;
var cmdm = editor.Commands;
var md = editor.Modal;


//Erase canvas button
pnm.addButton('options', {
  id: 'clear-all',
  className: 'fa fa-trash icon-blank',
  attributes: {title: 'Show Mavo view'},
  command: {
    run: function(editor, sender) {
        sender && sender.set('active', false);
        if(confirm('Are you sure to clean the canvas?')){
            editor.DomComponents.clear();
            setTimeout(function(){
              localStorage.clear()
        },0)
      }
    }
  }
});

iframeMavo.onload = function() {
    iframeMavo.contentDocument.body.setAttribute("mv-app", mvApp);
    iframeMavo.contentDocument.body.setAttribute("mv-storage", mvStorage);
    // add Mavo to page if it's not there already
    if (!iframeMavo.contentWindow.Mavo) {
        var script = iframeMavo.contentWindow.document.createElement("script");
        script.src =  "https://get.mavo.io/mavo.js";
        iframeMavo.contentWindow.document.head.appendChild(script);

        var link = iframeMavo.contentWindow.document.createElement("link");
        link.href =  "https://get.mavo.io/mavo.css";
        link.rel = "stylesheet";
        iframeMavo.contentWindow.document.head.appendChild(link);
    }

};

//Mavo preview button
pnm.addButton('options', {
  id: 'show-mavo-preview',
  className: 'fa fa-eye',
  command: {
    run: function(editor, sender) {
        sender && sender.set('active', false);

        var html = editor.runCommand('gjs-get-inlined-html');
        iframeMavo.srcdoc = html;

        mavoDisplay.classList.remove("hidden");
    }
  },
  attributes: {
    'title': 'Mavo Preview',
    'data-tooltip-pos': 'bottom',
  },
});

//hide Mavo preview
pnm.addButton('options', {
  id: 'hide-mavo-preview',
  className: 'fa fa-eye-slash',
  command: {
    run: function(editor, sender) {
        sender && sender.set('active', false);
        mavoDisplay.classList.add("hidden");
    }
  },
  attributes: {
    'title': 'Hide Mavo Preview',
    'data-tooltip-pos': 'bottom',
  },
});

//Edit Header information
pnm.addButton('options', {
  id: 'edit-meta',
  className: 'fa fa-gear',
  command: {
    run: function(editor, sender) {
        sender && sender.set('active', false);
        $("#storage-setting").val(mvStorage);
        $("#mv-app-setting").val(mvApp);
        $('#settingsModal').modal('show');
    }
  },
  attributes: {
    'title': 'Edit Meta Info',
    'data-tooltip-pos': 'bottom',
  },
});


$("#save-settings-modal").on("click", function(e){
  e.preventDefault();
  var storage = $("#storage-setting").val();
  var app = $("#mv-app-setting").val();
  app ? mvApp = app : mvApp = '';
  storage ? mvStorage = storage : mvStorage = 'local';
  $(this).prev().click();
});

$('#settingsModal').on('hidden.bs.modal', function (e) {
  $("#storage-setting").value = '';
  $("#mv-app-setting").value = '';

});

// Beautify tooltips
var titles = document.querySelectorAll('*[title]');
for (var i = 0; i < titles.length; i++) {
  var el = titles[i];
  var title = el.getAttribute('title');
  title = title ? title.trim(): '';
  if(!title)
    break;
  el.setAttribute('data-tooltip', title);
  el.setAttribute('title', '');
}


})();