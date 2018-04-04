const Component = require('./Component');

module.exports = Component.extend({
  defaults: {
    ...Component.prototype.defaults,
    type: 'text',
    showingExpressionsGui: false,
    droppable: false,
    editable: true,
    script: function() {
      var showingExpressionsGui = '{[ showingExpressionsGui ]}';

      var showExpressionGui = function() {
        if (showingExpressionsGui) {
          console.log('show');
        }
      };

      var hideExpressionGui = function() {
        if (showingExpressionsGui) {
          console.log('hide');
        }
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

      this.addEventListener('keyup', checkEventAndRun);
      this.addEventListener('blur', hideExpressionGui);
      this.addEventListener('focus', showExpressionGui);
    }
  }
});
