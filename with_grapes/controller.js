(function() {

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

//add property and mv-multiple
var comps = editor.DomComponents;
for (var i = 0; i < comps.componentTypes.length; i++) {
    var compType = comps.componentTypes[i].id;
    var originalComp = comps.getType(compType);
    var givenTraits = originalComp.model.prototype.defaults.traits;
    var newTraits = givenTraits.slice();
    newTraits.push({
              type: 'input',
              label: 'Mavo Name',
              name: 'property',
            })
    newTraits.push({
              type: 'checkbox',
              label: 'Repeatable',
              name: 'mv-multiple',
            });
   
    comps.addType(compType, {
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