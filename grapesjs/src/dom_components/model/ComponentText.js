const Component = require('./Component');

module.exports = Component.extend({
  defaults: {
    ...Component.prototype.defaults,
    type: 'text',
    showingExpressionsGui: false,
    droppable: false,
    editable: true,
    script: function() {
      // var that = this;
      // console.log("that:");
      // console.log(that);
      // console.log(this instanceof Element);
      $(this).popover(); //WORKS kind of
      var showingExpressionsGui = '{[ showingExpressionsGui ]}';

      var showExpressionGui = function() {
        if (showingExpressionsGui) {
          console.log('show');
          // $(that).popover();
          // $(that).popover('show');
          // that.popover();
          // that.popover('show');
        }
      };

      var hideExpressionGui = function() {
        if (showingExpressionsGui) {
          console.log('hide');
        }
        // console.log("inMODEL");
        // console.log(this);
      };

      var checkEventAndRun = function(e) {
        if (e.which == 219 && !showingExpressionsGui) {
          showingExpressionsGui = true;
          showExpressionGui();
        } else if (e.which == 221 && showingExpressionsGui) {
          hideExpressionGui();
          showingExpressionsGui = false;
        }
      };
      // console.log("inMODEL2");
      // var jq = window.jQuery;
      // console.log(jq);
      // var bootstrap_enabled = (typeof $().emulateTransitionEnd == 'function');
      // console.log(bootstrap_enabled);
      // console.log(this);

      this.addEventListener('keyup', checkEventAndRun);
      this.addEventListener('blur', hideExpressionGui);
      this.addEventListener('focus', showExpressionGui);
    }
  }
});
