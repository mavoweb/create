import openImport from './openImport';
import {
  cmdImport,
  cmdDeviceDesktop,
  cmdDeviceTablet,
  cmdDeviceMobile,
  cmdClear,
  cmdExport
} from './../consts';

export default (editor, config) => {
  const cm = editor.Commands;
  const txtConfirm = config.textCleanCanvas;
  const juice = require('juice');

  cm.add(cmdImport, openImport(editor, config));
  cm.add(cmdDeviceDesktop, e => e.setDevice('Desktop'));
  cm.add(cmdDeviceTablet, e => e.setDevice('Tablet'));
  cm.add(cmdDeviceMobile, e => e.setDevice('Mobile portrait'));
  cm.add(cmdClear, e => confirm(txtConfirm) && e.runCommand('core:canvas-clear'));
  cm.add(cmdExport, {
    run(editor) {
      const tmpl = editor.getHtml() + `<style>${editor.getCss()}</style>`;
      return juice(tmpl);
    }
  });
}
