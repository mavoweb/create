(function() {

// var editor = grapesjs.init({
//     container : '#gjs',
//     components: '<div class="txt-red">Hello world!</div>',
//     style: '.txt-red{color: red}',
// });

var editor = grapesjs.init({
        showOffsets: 1,
        noticeOnUnload: 0,
        container: '#gjs',
        height: '100%',
        forceClass: false,
        avoidInlineStyle: false,
        fromElement: true,
        storageManager: { autoload: 0 },
        styleManager : {
          sectors: [{
              name: 'General',
              open: false,
              buildProps: ['float', 'display', 'position', 'top', 'right', 'left', 'bottom']
            },{
              name: 'Dimension',
              open: false,
              buildProps: ['width', 'height', 'max-width', 'min-height', 'margin', 'padding'],
            },{
              name: 'Typography',
              open: false,
              buildProps: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-shadow'],
            },{
              name: 'Decorations',
              open: false,
              buildProps: ['border-radius-c', 'background-color', 'border-radius', 'border', 'box-shadow', 'background'],
            },{
              name: 'Extra',
              open: false,
              buildProps: ['transition', 'perspective', 'transform'],
            }
          ],
        },
      });

editor.BlockManager.add('testBlock', {
    label: 'Block',
    attributes: { class:'gjs-fonts gjs-f-b1'},
    content: `<div style="padding-top:50px; padding-bottom:50px; text-align:center">Test block</div>`
})

var comps = editor.DomComponents;
var originalText = comps.getType('text');

comps.addType('text', {
    model: originalText.model.extend({
        defaults: Object.assign({}, originalText.model.prototype.defaults, {
          traits: [
            {
              type: 'input',
              label: 'Property Name',
              name: 'property',
            },
            {
              type: 'checkbox',
              label: 'Repeatable',
              name: 'mv-multiple',
            }],
        }),
  },
  {
    isComponent: function(el) {
      if(el.tagName == 'DIV'){
        return {type: 'text'};
      }
    },
  }),
  view: originalText.view
});


})();