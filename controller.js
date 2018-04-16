(function() {

var functionsContainer = $('#expr-functions-container');
var operatorsContainer = $('#expr-operators-container');
var specialsContainer = $('#expr-specials-container');
var propsContainer = $('#expr-properties-container');

var mvStorage = 'local';
var mvApp = '';

$("[data-toggle=popover]").popover();


// Set up GrapesJS editor with the Newsletter plugin
var editor = grapesjs.init({
  clearOnRender: true,
  height: '100%',
  storageManager: {
    id: 'gjs-nl-',
  },
  container : '#gjs',
  fromElement: true,
  components: '<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0/js/bootstrap.bundle.min.js"></script>',
  canvas: {
    scripts: ['https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js','https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0/js/bootstrap.bundle.min.js']
  },
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
    var mvAttributeOptions = [];
    for (var j = 0; j < newTraits.length; j++) {
      var trait = newTraits[j];
      var newOption;
      if (trait.name && trait.label) {
        newOption = {value: trait.name, name:trait.label};
      } else {
        newOption = {value: trait, name:trait};
      }

      mvAttributeOptions.push(newOption);
    }
    mvAttributeOptions.push({value:"none", name: "Text Content"});
    newTraits.push({
              type: 'select',
              label: 'Mavo Target',
              name: 'mv-attribute',
              options: mvAttributeOptions
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


//Mavo preview button
pnm.addButton('options', {
  id: 'show-mavo-preview',
  className: 'fa fa-eye',
  command: {
    run: function(editor, sender) {
        sender && sender.set('active', false);

        var html = editor.runCommand('gjs-get-inlined-html');
        
        var newWindow = window.open();

        var script = newWindow.document.createElement("script");
        script.src =  "https://get.mavo.io/mavo.js";
        newWindow.document.head.appendChild(script);

        var link = newWindow.document.createElement("link");
        link.href =  "https://get.mavo.io/mavo.css";
        link.rel = "stylesheet";
        newWindow.document.head.appendChild(link);

        newWindow.document.body.setAttribute("mv-app", mvApp);
        newWindow.document.body.setAttribute("mv-storage", mvStorage);

        newWindow.document.body.innerHTML = html;

    }
  },
  attributes: {
    'title': 'Mavo Preview',
    'data-tooltip-pos': 'bottom',
  },
});


var downloadFile = function(htmlContent) {
  var element = document.createElement('a');

  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(htmlContent));
  element.setAttribute('download', 'myMavoApp.html');

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

pnm.addButton('options', {
  id: 'download-html',
  className: 'fa fa-download',
  command: {
    run: function(editor, sender) {
        sender && sender.set('active', false);

        var html = editor.runCommand('gjs-get-inlined-html');
        var fullHTML = `<html>
        <head>
          <script src="https://get.mavo.io/mavo.js"></script>
          <link rel="stylesheet" href="https://get.mavo.io/mavo.css">
        </head>
        <body mv-app="`+ mvApp +`" mv-storage="`+mvStorage+`">`+html+`</body>
        </html>`;
        downloadFile(fullHTML);

    }
  },
  attributes: {
    'title': 'Download Your Webpage',
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


pnm.addButton('options', {
  id: 'make-expressions',
  className: 'fa fa-square',
  command: {
    run: function(editor, sender) {
        sender && sender.set('active', false);
        $("#expression-text-box").val("");
        $("#expression-text-box").popover();
        var popover = $('#expression-text-box').data('bs.popover');
        var popoverContent = $('#popover-content-html').html();
        popover.config.content = popoverContent;
        var popoverTitle = $('#popover-title-html').html();
        popover.config.title = popoverTitle;
        var props = getAllMavoProperties()
        propsContainer.empty();
        for (var i=0; i<props.length; i++) {
          var prop = props[i];
          propsContainer.append(`<div class="expr-title" data-value="`+ prop + `">` + prop +`</div>`);
        }
        $('#expressionsModal').modal('show');
    }
  },
  attributes: {
    'title': 'Create Expressions',
    'data-tooltip-pos': 'bottom',
  },
});

var parseExpressionsJsonAndSet = function() {
  $.getJSON('./expressions.json', function(data) {
      var expData = data['term'];
      for (var i=0; i<expData.length; i++) {
        var obj = expData[i]
        var role = obj['role'];
        var majorText = obj['name'];
        var minorText = cutDescription(obj['description']);
        var valueText = obj['name'];
        if (role == 'function') {
          var args = obj['argument'];
          majorText = majorText + '(';
          for (var k=0; k<args.length; k++) {
            majorText = majorText + args[k]['name'] + ', '
          }
          majorText = majorText.substring(0, majorText.length-2) + ')';
          majorText = majorText + ')';
          valueText = valueText + '()';
          functionsContainer.append(`<div class="expr-title" data-value="`+ valueText + `">` + majorText +`<p class="expr-description"> `+minorText+`</p></div>`);
        } else if (role == 'operator') {
          var unary = obj['unary'];
          if (unary) {
            majorText = majorText + 'a'
          } else {
            majorText = 'a ' + majorText + ' b'
          }
          operatorsContainer.append(`<div class="expr-title" data-value="`+ valueText + `">` + majorText +`<p class="expr-description"> `+minorText+`</p></div>`);
        } else if (role == 'special') {
          specialsContainer.append(`<div class="expr-title" data-value="`+ valueText + `">` + majorText +`<p class="expr-description"> `+minorText+`</p></div>`);
        }

      }

  });
}

parseExpressionsJsonAndSet();

var cutDescription = function(description) {
  var current = (' ' + description).slice(1);
  if (current.indexOf('\n') > -1) {
    current = current.substring(0, current.indexOf('\n'));
  }
  if (current.indexOf('.') > -1) {
    current = current.substring(0, current.indexOf('.'));
  }
  return current;
}

var getAllMavoProperties = function() {
  var canvas = editor.Canvas.getBody();
  var elements = canvas.querySelectorAll('[property]');
  var properties = [];
  for (var i=0; i<elements.length; i++) {
    var element = elements[i];
    properties.push(element.getAttribute('property'));
  }
  return properties;
}

$('body').on('click', '.expr-title', function () {
  var dataValue = $(this).data('value');
  var currentText = $("#expression-text-box").val();
  $("#expression-text-box").val(currentText + " " + dataValue);
  $("#expression-text-box").focus();
});


})();