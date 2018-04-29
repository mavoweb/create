import grapesjs from 'grapesjs';
import pluginNavbar from 'grapesjs-navbar';
import pluginCountdown from 'grapesjs-component-countdown';
import pluginExport from 'grapesjs-plugin-export';
import pluginAviary from 'grapesjs-aviary';
import pluginFilestack from 'grapesjs-plugin-filestack';

import commands from './commands';
import blocks from './blocks';
import components from './components';
import traits from './traits';
import panels from './panels';
import styles from './styles';

export default grapesjs.plugins.add('gjs-mavo', (editor, opts = {}) => {
  let config = opts;

  let defaults = {
    // Which blocks to add
    //basic: 'column1', 'column2', 'column3', 'column3-7', 'text', 'link', 'image', 'video', 'map'
    //extra: 'link-block', 'quote', 'text-basic'
    //form: 'form', 'input', 'textarea', 'select', 'button', 'label', 'checkbox', 'radio'
    blocks: ['column1', 'column2', 'column3', 'column3-7', 'divider', 'text', 'link', 'image', 'video', 'map', 'link-block', 'quote', 'text-basic', 'form', 'input', 'textarea', 'select', 'button', 'label', 'checkbox', 'radio'],
    
    // Modal import title
    modalImportTitle: 'Import',

    // Modal import button text
    modalImportButton: 'Import',

    // Import description inside import modal
    modalImportLabel: '',

    // Default content to setup on import model open.
    // Could also be a function with a dynamic content return (must be a string)
    // eg. modalImportContent: editor => editor.getHtml(),
    modalImportContent: '',

    // Code viewer (eg. CodeMirror) options
    importViewerOptions: {},

    // Confirm text before cleaning the canvas
    textCleanCanvas: 'Are you sure to clean the canvas?',

    // Show the Style Manager on component change
    showStylesOnChange: 1,

    // Text for General sector in Style Manager
    textGeneral: 'General',

    // Text for Layout sector in Style Manager
    textLayout: 'Layout',

    // Text for Typography sector in Style Manager
    textTypography: 'Typography',

    // Text for Decorations sector in Style Manager
    textDecorations: 'Decorations',

    // Text for Extra sector in Style Manager
    textExtra: 'Extra',

    // Use custom set of sectors for the Style Manager
    customStyleManager: [],

    // `grapesjs-navbar` plugin options
    // By setting this option to `false` will avoid loading the plugin
    navbarOpts: {},

    // `grapesjs-component-countdown` plugin options
    // By setting this option to `false` will avoid loading the plugin
    countdownOpts: {},

    // `grapesjs-plugin-export` plugin options
    // By setting this option to `false` will avoid loading the plugin
    exportOpts: {},

    // `grapesjs-aviary` plugin options, disabled by default
    // Aviary library should be included manually
    // By setting this option to `false` will avoid loading the plugin
    aviaryOpts: 0,

    // `grapesjs-plugin-filestack` plugin options, disabled by default
    // Filestack library should be included manually
    // By setting this option to `false` will avoid loading the plugin
    filestackOpts: 0,

    // settings for the form elements, modeled off of the
    // 'grapesjs-plugin-forms' plugin
    useRequiredTrait: true,
    formCategory: 'Interactive',

    labelTraitMethod: 'Method',
    labelTraitAction: 'Action',
    labelTraitState: 'State',
    labelTraitId: 'Id',
    labelTraitFor: 'For',
    labelInputName: 'Input',
    labelTextareaName: 'Textarea',
    labelSelectName: 'Select',
    labelCheckboxName: 'Checkbox',
    labelRadioName: 'Radio',
    labelButtonName: 'Button',
    labelTraitName: 'Name',
    labelTraitPlaceholder: 'Placeholder',
    labelTraitValue: 'Value',
    labelTraitRequired: 'Required',
    labelTraitType: 'Type',
    labelTraitOptions: 'Options',
    labelTraitChecked: 'Checked',
    labelTypeText: 'Text',
    labelTypeEmail: 'Email',
    labelTypePassword: 'Password',
    labelTypeNumber: 'Number',
    labelTypeSubmit: 'Submit',
    labelTypeReset: 'Reset',
    labelTypeButton: 'Button',
    labelNameLabel: 'Label',
    labelForm: 'Form',
    labelSelectOption: '- Select option -',
    labelOption: 'Option',
    labelStateNormal: 'Normal',
    labelStateSuccess: 'Success',
    labelStateError: 'Error',

    // settings for the basic block elements, modeled off of the
    // 'grapesjs-blocks-basic' plugin, and the blocks in the
    // 'grapesjs-preset-newletter' plugin
    stylePrefix: '',
    addBasicStyle: true,
    labelColumn1: '1 Column',
    labelColumn2: '2 Columns',
    labelColumn3: '3 Columns',
    labelColumn37: '2 Columns 3/7',
    labelDivider: 'Divider',
    labelText: 'Text',
    labelLink: 'Link',
    labelImage: 'Image',
    labelVideo: 'Video',
    labelMap: 'Map',
    categoryColumn1: 'Structured Content',
    categoryColumn2: 'Structured Content',
    categoryColumn3: 'Structured Content',
    categoryColumn37: 'Structured Content',
    categoryDivider: 'Structured Content',
    categoryText: 'Content',
    categoryLink: 'Content',
    categoryImage: 'Content',
    categoryVideo: 'Content',
    categoryMap: 'Content',
    cellStyle: {
      padding: 0,
      margin: 0,
      'vertical-align': 'top',
    },
    tableStyle: {
      height: '150px',
      margin: '0 auto 10px auto',
      padding: '5px 5px 5px 5px',
      width: '100%'
    },

    //additional defaults for Mavo properties
    labelMavoProperty: 'Mavo Name',
    labelMvMultiple: 'Repeatable',
    labelMvAttribute: 'Mavo Target',

  };

  // Load defaults
  for (let name in defaults) {
    if (!(name in config))
      config[name] = defaults[name];
  }

  const {
    navbarOpts,
    countdownOpts,
    exportOpts,
    aviaryOpts,
    filestackOpts
  } = config;

  // Load plugins
  navbarOpts && pluginNavbar(editor, navbarOpts);
  countdownOpts && pluginCountdown(editor, countdownOpts);
  exportOpts && pluginExport(editor, exportOpts);
  aviaryOpts && pluginAviary(editor, aviaryOpts);
  filestackOpts && pluginFilestack(editor, filestackOpts);

  // Load components
  components(editor, config);

  // Load blocks
  blocks(editor, config);

  // Load commands
  commands(editor, config);

  // Load traits
  traits(editor, config);

  // Load panels
  panels(editor, config);

  // Load styles
  styles(editor, config);

});
