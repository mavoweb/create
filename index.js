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
      blocks: ['column1', 'column2', 'column3', 'column3-7', 'divider', 'text', 'link', 'image', 'map', 'text-basic', 'input', 'textarea', 'select', 'label', 'checkbox'],
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

        var html = editor.runCommand('get-inlined-html');

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

        var html = editor.runCommand('get-inlined-html');
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
  label: `<svg version="1.1" viewBox="0.0 0.0 100.0 100.0" fill="none" stroke="none" stroke-linecap="square" stroke-miterlimit="10" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"><clipPath id="p.0"><path d="m0 0l100.0 0l0 100.0l-100.0 0l0 -100.0z" clip-rule="nonzero"/></clipPath><g clip-path="url(#p.0)"><path fill="#000000" fill-opacity="0.0" d="m0 0l100.0 0l0 100.0l-100.0 0z" fill-rule="evenodd"/><path fill="#b9a5a6" d="m13.401575 24.729568l0 0c0 8.89159 16.385674 16.099648 36.598427 16.099648c20.212753 0 36.598427 -7.2080574 36.598427 -16.099648l0 50.540863c0 8.891586 -16.385674 16.099648 -36.598427 16.099648c-20.212751 0 -36.598427 -7.208061 -36.598427 -16.099648z" fill-rule="evenodd"/><path fill="#d5c9c9" d="m13.401575 24.729568l0 0c0 -8.891589 16.385674 -16.099648 36.598427 -16.099648c20.212753 0 36.598427 7.2080584 36.598427 16.099648l0 0c0 8.89159 -16.385674 16.099648 -36.598427 16.099648c-20.212751 0 -36.598427 -7.2080574 -36.598427 -16.099648z" fill-rule="evenodd"/><path fill="#000000" fill-opacity="0.0" d="m86.59843 24.729568l0 0c0 8.89159 -16.385674 16.099648 -36.598427 16.099648c-20.212751 0 -36.598427 -7.2080574 -36.598427 -16.099648l0 0c0 -8.891589 16.385674 -16.099648 36.598427 -16.099648c20.212753 0 36.598427 7.2080584 36.598427 16.099648l0 50.540863c0 8.891586 -16.385674 16.099648 -36.598427 16.099648c-20.212751 0 -36.598427 -7.208061 -36.598427 -16.099648l0 -50.540863" fill-rule="evenodd"/><path stroke="#b9a5a6" stroke-width="1.0" stroke-linejoin="round" stroke-linecap="butt" d="m86.59843 24.729568l0 0c0 8.89159 -16.385674 16.099648 -36.598427 16.099648c-20.212751 0 -36.598427 -7.2080574 -36.598427 -16.099648l0 0c0 -8.891589 16.385674 -16.099648 36.598427 -16.099648c20.212753 0 36.598427 7.2080584 36.598427 16.099648l0 50.540863c0 8.891586 -16.385674 16.099648 -36.598427 16.099648c-20.212751 0 -36.598427 -7.208061 -36.598427 -16.099648l0 -50.540863" fill-rule="evenodd"/></g></svg>`,
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
    'title': 'Mavo Storage Settings',
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



// editor.on('component:update:attributes', model => {
//   var attrs = model.getAttributes();
//   console.log(attrs);
//   if (attrs.showExpressionsModal) {
//     //open expressions modal
//     console.log('open!');
//   }
// });

// editor.on('component:update:showExpressionsModal', model => {
// });

//expressions modal
pnm.addButton('options', {
  id: 'make-expressions',
  label: `<svg version="1.1" viewBox="0.0 0.0 100.0 100.0" fill="none" stroke="none" stroke-linecap="square" stroke-miterlimit="10" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"><clipPath id="p.0"><path d="m0 0l100.0 0l0 100.0l-100.0 0l0 -100.0z" clip-rule="nonzero"/></clipPath><g clip-path="url(#p.0)"><path fill="#000000" fill-opacity="0.0" d="m0 0l100.0 0l0 100.0l-100.0 0z" fill-rule="evenodd"/><path fill="#000000" fill-opacity="0.0" d="m-34.603676 -40.120735l166.70865 0l0 151.2441l-166.70865 0z" fill-rule="evenodd"/><path fill="#b9a5a6" d="m22.050264 33.917564l10.468748 0q2.671875 -10.421875 6.28125 -15.984375q3.625 -5.5625 9.46875 -8.640625q5.84375 -3.0781245 10.953125 -3.0781245q2.921875 0 4.65625 1.1875q1.75 1.1718745 1.75 3.2656245q0 1.703125 -0.875 2.8125q-0.875 1.109375 -2.390625 1.109375q-1.578125 0 -5.0625 -1.5625q-3.53125 -1.53125 -5.140625 -1.53125q-2.890625 0 -4.8125 3.015625q-1.90625 3.0 -3.5625 10.109375l-2.28125 9.296875l11.65625 0l-0.75 3.09375l-11.59375 0l-6.890625 27.78125q-1.9687481 7.859375 -6.093748 13.765625q-4.109375 5.90625 -9.75 9.015625q-5.625001 3.125 -11.765625 3.125q-3.0156252 0 -4.53125 -1.359375q-1.53125 -1.34375 -1.53125 -3.34375q0 -1.828125 1.046875 -2.84375q1.0468749 -1.0 2.78125 -1.0q1.140625 0 2.28125 0.375q1.125 0.375 2.3124995 0.78125q1.171875 0.421875 2.484375 0.78125q1.296875 0.375 2.78125 0.375q2.484376 0 3.968751 -1.109375q1.484375 -1.109375 2.609375 -3.59375q1.140625 -2.484375 2.328125 -7.15625l8.84375 -35.59375l-10.46875 0l0.828125 -3.09375zm29.83734 35.203125q-2.0 0 -3.515625 -1.15625q-1.5 -1.15625 -1.5 -2.78125q0 -1.34375 0.953125 -2.40625q0.96875 -1.078125 2.28125 -1.078125q1.34375 0 2.75 1.703125q1.21875 1.390625 2.34375 1.390625q1.53125 0 4.203125 -2.671875q2.6875 -2.6875 5.265625 -6.390625l3.1875 -4.765625l-2.046875 -9.71875q-0.53125 -2.53125 -1.234375 -3.859375q-0.6875 -1.328125 -1.78125 -1.328125q-0.875 0 -2.6875 1.15625q-1.796875 1.15625 -3.59375 2.671875l-1.21875 -1.78125q9.375 -6.984375 13.296875 -6.984375q2.140625 0 3.40625 1.609375q0.75 1.09375 1.25 3.234375q0.5 2.140625 1.328125 5.796875q8.9375 -12.6875 15.53125 -12.6875q1.828125 0 2.90625 0.875q1.0937424 0.875 1.0937424 2.265625q0 1.171875 -0.640625 1.875q-0.6249924 0.703125 -1.7187424 1.078125q-1.078125 0.359375 -3.609375 0.453125l-1.875 0.078125q-2.65625 0.140625 -4.625 1.625q-1.96875 1.46875 -6.453125 7.578125l3.046875 14.65625q2.1875 10.8125 4.90625 15.59375q2.734375 4.78125 6.09375 4.78125q2.828125 0 4.015625 -3.75q0.9531174 -2.53125 3.1406174 -2.53125q1.046875 0 1.84375 0.78125q0.8125 0.78125 0.8125 2.015625q0 2.296875 -2.796875 4.21875q-2.78125 1.921875 -6.7499924 1.921875q-4.984375 0 -9.265625 -2.984375q-4.265625 -2.984375 -6.78125 -8.921875q-2.5 -5.9375 -4.765625 -16.21875l-1.703125 2.390625q-3.09375 4.5 -5.625 7.25q-2.53125 2.734375 -4.671875 3.875q-2.125 1.140625 -4.796875 1.140625z" fill-rule="nonzero"/></g></svg>`,
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