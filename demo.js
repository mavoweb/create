(function() {
var host = 'http://artf.github.io/grapesjs/';
var images = [
  host + 'img/grapesjs-logo.png',
  host + 'img/tmp-blocks.jpg',
  host + 'img/tmp-tgl-images.jpg',
  host + 'img/tmp-send-test.jpg',
  host + 'img/tmp-devices.jpg',
];

// Set up GrapesJS editor with the Newsletter plugin
var editor = grapesjs.init({
  clearOnRender: true,
  height: '100%',
  storageManager: {
    id: 'gjs-nl-',
  },
  assetManager: {
    assets: images,
    upload: 0,
    uploadText: 'Uploading is not available in this demo',
  },
  container : '#gjs',
  fromElement: true,
  plugins: ['gjs-preset-newsletter', 'gjs-aviary'],//, 'gjs-plugin-ckeditor'],
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
    // 'gjs-plugin-ckeditor': {
    //   position: 'center',
    //   options: {
    //     startupFocus: true,
    //     extraAllowedContent: '*(*);*{*}', // Allows any class and any inline style
    //     allowedContent: true, // Disable auto-formatting, class removing, etc.
    //     enterMode: CKEDITOR.ENTER_BR,
    //     extraPlugins: 'sharedspace,justify,colorbutton,panelbutton,font',
    //     toolbar: [
    //       { name: 'styles', items: ['Font', 'FontSize' ] },
    //       ['Bold', 'Italic', 'Underline', 'Strike'],
    //       {name: 'paragraph', items : [ 'NumberedList', 'BulletedList']},
    //       {name: 'links', items: ['Link', 'Unlink']},
    //       {name: 'colors', items: [ 'TextColor', 'BGColor' ]},
    //     ],
    //   }
    // }
  }
});


// Let's add in this demo the possibility to test our newsletters
var mdlClass = 'gjs-mdl-dialog-sm';
var pnm = editor.Panels;
var cmdm = editor.Commands;
var md = editor.Modal;

// Add info command
var infoContainer = document.getElementById("info-cont");
cmdm.add('open-info', {
  run(editor, sender) {
    sender.set('active', 0);
    var mdlDialog = document.querySelector('.gjs-mdl-dialog');
    mdlDialog.className += ' ' + mdlClass;
    infoContainer.style.display = 'block';
    md.setTitle('About this demo');
    md.setContent('');
    md.setContent(infoContainer);
    md.open();
    md.getModel().once('change:open', function() {
      mdlDialog.className = mdlDialog.className.replace(mdlClass, '');
    })
  }
});
pnm.addButton('options', {
  id: 'clear-all',
  className: 'fa fa-trash icon-blank',
  attributes: {title: 'Empty canvas'},
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
pnm.addButton('options', {
  id: 'view-info',
  className: 'fa fa-question-circle',
  command: 'open-info',
  attributes: {
    'title': 'About',
    'data-tooltip-pos': 'bottom',
  },
});

// Simple warn notifier
var origWarn = console.warn;
// toastr.options = {
//   closeButton: true,
//   preventDuplicates: true,
//   showDuration: 250,
//   hideDuration: 150
// };
// console.warn = function (msg) {
//   toastr.warning(msg);
//   origWarn(msg);
// };

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

// editor.on('keyup' function (e) {
//   if (e.which == 219) {
//     alert('Expression!');
//   }
// });

})();