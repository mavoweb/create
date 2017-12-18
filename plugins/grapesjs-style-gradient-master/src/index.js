import loadStyles from './styles';
import gjs from 'grapesjs';
const g = grapesjs || gjs;

export default g.plugins.add('gjs-style-gradient', (editor, opts = {}) => {
  let defaults = {
    // Grapick options
    grapickOpts: {},

    // Custom color picker, check Grapick's repo to get more about it
    // If you leave it empty the native color picker will be used.
    // You can use 'default' string to get the one used by Grapesjs (which
    // is spectrum at the moment of writing)
    colorPicker: '',

    // Show gradient direction input under picker, you can pass an object
    // as a model
    inputDirection: 1,

    // Show gradient type input under picker, you can pass an object as
    // a model
    inputType: 1,
  };

  // Load defaults
  const config = { ...defaults, ...opts };

  // Add styles
  loadStyles(editor, config);
});
