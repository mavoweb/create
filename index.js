(function() {

var editor = grapesjs.init({
  height: '100%',
  showOffsets: 1,
  noticeOnUnload: 0,
  storageManager: { autoload: 0 },
  container: '#gjs',
  fromElement: true,

  plugins: ['gjs-mavo'],
  pluginsOpts: {
    'gjs-mavo': {
      blocks: ['column1', 'column2', 'column3', 'column3-7', 'divider', 'text', 'link', 'image', 'map', 'text-basic', 'quote', 'input', 'textarea', 'select', 'label', 'checkbox'],
      navbarOpts: false,
      countdownOpts: false,
      useRequiredTrait: false,
    }
  },
  canvas: {
    scripts: [
      'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0/js/bootstrap.bundle.min.js',
      ],
    styles: [
      './index.css',
      'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0/css/bootstrap.min.css',
      ],
    customBadgeLabel: function(ComponentModel) {
      var propertyName;
      var property = ComponentModel.get('traits').where({ name: 'property' })[0];
      if (property) {
        propertyName = property.get('value');
      }
      if (propertyName && propertyName !== '') {
        return ComponentModel.getName() + ' - ' + propertyName;
      }
      return ComponentModel.getName();
    },
  },

});


var functionsContainer = $('#expr-functions-container');
var operatorsContainer = $('#expr-operators-container');
var specialsContainer = $('#expr-specials-container');
var propsContainer = $('#expr-properties-container');

var mvStorage = 'local'; //what goes into mv-app
var mvStorageChoice = 'local'; //the choice (value) from the dropdown menu in the modal
var mvStorageDetail; //for github and dropbox, what the user enters in the box in the modal

var mvApp = '';

$("[data-toggle=popover]").popover();


var pnm = editor.Panels;
var cmdm = editor.Commands;
var md = editor.Modal;

// Show borders by default
pnm.getButton('options', 'sw-visibility').set('active', 1);

//remove preview, fullscreen, and export buttons
pnm.getButton('options', 'preview').set('attributes', {style: 'display:none;'});
pnm.getButton('options', 'fullscreen').set('attributes', {style: 'display:none;'});
pnm.getButton('options', 'export-template').set('attributes', {style: 'display:none;'});

//make import button icon into upload button
pnm.getButton('options', 'gjs-open-import-webpage').set('className', 'fa fa-upload');

// for debugging
// window.editor = editor;
// domComponents = editor.DomComponents;

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


//Edit mv-app and mv-storage
pnm.addButton('options', {
  id: 'edit-mavo-info',
  className: 'fa fa-gear',
  command: {
    run: function(editor, sender) {
        sender && sender.set('active', false);
        $("#mv-app-setting").val(mvApp);

        $("#storage-setting-dropdown").val(mvStorageChoice);
        setStorageDescription(mvStorageChoice);
        setStorageDetailInput(mvStorageChoice);

        $('#settingsModal').modal('show');
    }
  },
  attributes: {
    'title': 'Edit Mavo Settings',
    'data-tooltip-pos': 'bottom',
  },
});

var setStorageDescription = function(storageType) {
  var descriptor = "";
  if (storageType == "local") {
    descriptor = "This option stores your Mavo data locally in the browser.";
  } else if (storageType == "github") {
    descriptor = "To store your data on Github, you need to create a github account. Once you do, include your github username below:";
  } else if (storageType == "dropbox") {
    descriptor = 'To store your data on Dropbox, create an empty file with a .json extension on Dropbox. Then, in the Dropbox application, click "Share"; copy the link and paste it below:';
  } else if (storageType == "none") {
    descriptor = "Choosing this option means that your Mavo data will not be stored anywhere.";
  } else {
    descriptor = "";
  }
  $("#storage-setting-description").text(descriptor);
};

var setStorageDetailInput = function(storageType, initialSetup=false) {
  var detailInput = $("#storage-setting-detail");

  if (storageType == "github" || storageType == "dropbox") {
    //add placeholder
    if (storageType == "github") {
      detailInput.attr("placeholder", "Your Github username");
      if (mvStorageDetail && mvStorageChoice == "github") {
        detailInput.val(mvStorageDetail);
      }
    } else if (storageType == "dropbox") {
      detailInput.attr("placeholder", "Your Dropbox sharing link");
      if (mvStorageDetail && mvStorageChoice == "dropbox") {
        detailInput.val(mvStorageDetail);
      }
    }
    detailInput.removeClass("hidden");

  } else {
    detailInput.addClass("hidden");
    detailInput.val("");
  }
};

//on changing the settings modal dropdown
$('#storage-setting').on('change', function () {
  var newStorageChoice = $("#storage-setting-dropdown option:selected").val();
  setStorageDescription(newStorageChoice);
  setStorageDetailInput(newStorageChoice);

});

//when the user hits "Save" for saving mv-app and mv-storage stuff
$("#save-settings-modal").on("click", function(e){
  e.preventDefault();
  var storageDropdown = $("#storage-setting-dropdown").val();
  if (storageDropdown == "github" || storageDropdown == "dropbox") {
    var detailInput = $("#storage-setting-detail").val();
    if (detailInput && detailInput.replace(/\s/g,'').length > 0) {
      if (storageDropdown == "github") {
        mvStorage = "https://github.com/" + detailInput.replace(/\s/g,'');
      } else if (storageDropdown == "dropbox") {
        //just the URL for dropbox
        mvStorage = detailInput;
      }
      mvStorageChoice = storageDropdown;
      mvStorageDetail = detailInput;
    } else {
      //invalid entry, so divert to local
      mvStorage = "local";
      mvStorageChoice = 'local';
      mvStorageDetail = null;
    }
  } else {
    mvStorage = storageDropdown;
    mvStorageChoice = storageDropdown;
    mvStorageDetail = null;
  }

  var app = $("#mv-app-setting").val();
  app ? mvApp = app : mvApp = '';

  $(this).prev().click();
});

$('#settingsModal').on('hidden.bs.modal', function (e) {
  $("#mv-app-setting").value = '';
  $("#storage-setting-detail").val('');
});


//expressions modal
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
  // var input = $("#expression-text-box");
  // var scrollPos = input.scrollTop;
  // var pos = input.selectionStart;
  // console.log(pos);
  // var front = (input.val()).substring(0, pos);
  // var back = (input.val()).substring(pos, input.val().length);
  // input.val(front+dataValue+back);
  // input.scrollTop = scrollPos;
  $("#expression-text-box").val(currentText + " " + dataValue);
  $("#expression-text-box").focus();
});

$("#expression-text-box").on('keyup', function (e) {
  var expContent = $("#expression-text-box").val();
  if (expContent[expContent.length-1] == " " || expContent.length < 1) {
    //if white space at end:
    resetPopover();
    return
  }
  var counts = {};
  var popoverContentCols = $("#popover-content-html td");
  for (c=0; c<popoverContentCols.length; c++) {
    var col = popoverContentCols[c].children[0];
    var hidden = 0;
    for (r=0; r<col.children.length; r++) {
      var item = $(col.children[r]);
      var value = item.data("value");
      if (!(value.includes(expContent))) {
        //remove from sight
        item.addClass('hidden');
        hidden = hidden + 1;
      } else {
        item.removeClass('hidden');
      }
    }
    counts[c] = [col.children.length, hidden];
    if (col.children.length == hidden) {
      //hide whole column
      $(popoverContentCols[c]).addClass('hidden');
    } else {
      $(popoverContentCols[c]).removeClass('hidden');
    }
  }

  var popoverTitlesCols = $("#popover-title-html td");
  for (c=0; c<popoverTitlesCols.length; c++) {
    var col = popoverTitlesCols[c];
    if (counts[c][0] == counts[c][1]) {
      $(col).addClass('hidden');
    } else {
      $(col).removeClass('hidden');
    }
  }

  $("#expression-text-box").popover();
  var popover = $('#expression-text-box').data('bs.popover');
  var popoverContent = $('#popover-content-html').html();
  popover.config.content = popoverContent;
  var popoverTitle = $('#popover-title-html').html();
  popover.config.title = popoverTitle;
  popover.setContent();
});

var resetPopover = function() {
  var popoverContentCols = $("#popover-content-html td");
  for (c=0; c<popoverContentCols.length; c++) {
    var col = popoverContentCols[c].children[0];
    $(popoverContentCols[c]).removeClass('hidden');
    for (r=0; r<col.children.length; r++) {
      var item = $(col.children[r]);
      item.removeClass('hidden');
    }
  }

  var popoverTitlesCols = $("#popover-title-html td");
  for (c=0; c<popoverTitlesCols.length; c++) {
    $(popoverTitlesCols[c]).removeClass('hidden');
  }

  $("#expression-text-box").popover();
  var popover = $('#expression-text-box').data('bs.popover');
  var popoverContent = $('#popover-content-html').html();
  popover.config.content = popoverContent;
  var popoverTitle = $('#popover-title-html').html();
  popover.config.title = popoverTitle;
  popover.setContent();
};

$('#expressionsModal').on('hidden.bs.modal', function (e) {
  resetPopover();
});



// Add and beautify tooltips
[['sw-visibility', 'Show Borders'], ['undo', 'Undo'], ['redo', 'Redo'], ['gjs-open-import-webpage', 'Import Template'], ['canvas-clear', 'Clear canvas']].forEach(function(item) {
  pnm.getButton('options', item[0]).set('attributes', {title: item[1], 'data-tooltip-pos': 'bottom'});
});
[['open-sm', 'Style Manager'], ['open-tm', 'Traits Manager'], ['open-layers', 'Layers'], ['open-blocks', 'Blocks']].forEach(function(item) {
  pnm.getButton('views', item[0]).set('attributes', {title: item[1], 'data-tooltip-pos': 'bottom'});
});

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