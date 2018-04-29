export default (editor, config) => {
  const bm = editor.BlockManager;
  const toAdd = name => config.blocks.indexOf(name) >= 0;
  const c = config;


  //basic elements

  toAdd('text') && bm.add('text', {
    label: c.labelText,
    category: c.categoryText,
    attributes: {class:'gjs-fonts gjs-f-text'},
    content: {
      type:'text',
      content:'Insert your text here',
      style: {padding: '10px' },
      activeOnRender: 1
    },
  });

  toAdd('link') && bm.add('link', {
    label: c.labelLink,
    category: c.categoryLink,
    attributes: {class:'fa fa-link'},
    content: {
      type:'link',
      content:'Link',
      style: {color: '#d983a6'}
    },
  });

  toAdd('image') && bm.add('image', {
    label: c.labelImage,
    category: c.categoryImage,
    attributes: {class:'gjs-fonts gjs-f-image'},
    content: {
      style: {color: 'black'},
      type:'image',
      activeOnRender: 1
    },
  });

  toAdd('video') && bm.add('video', {
    label: c.labelVideo,
    category: c.categoryVideo,
    attributes: {class:'fa fa-youtube-play'},
    content: {
      type: 'video',
      src: 'img/video2.webm',
      style: {
        height: '350px',
        width: '615px',
      }
    },
  });

  toAdd('map') && bm.add('map', {
    label: c.labelMap,
    category: c.categoryMap,
    attributes: {class:'fa fa-map-o'},
    content: {
      type: 'map',
      style: {height: '350px'}
    },
  });


  //extra basic content items

  toAdd('quote') && bm.add('quote', {
    label: 'Quote',
    category: 'Content',
    attributes: { class: 'fa fa-quote-right' },
    content: `<blockquote class="quote">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore ipsum dolor sit
      </blockquote>`
  });

  toAdd('text-basic') && bm.add('text-basic', {
    category: 'Content',
    label: 'Text section',
    attributes: { class: 'gjs-fonts gjs-f-h1p' },
    content: `<section class="bdg-sect">
      <h1 class="heading">Insert title here</h1>
      <p class="paragraph">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</p>
      </section>`
  });


  toAdd('link-block') && bm.add('link-block', {
    category: 'Content',
    label: 'Link Block',
    attributes: { class: 'fa fa-link' },
    content: {
      type:'link',
      editable: false,
      droppable: true,
      style:{
        display: 'inline-block',
        padding: '5px',
        'min-height': '50px',
        'min-width': '50px'
      }
    },
  });


  //structure content
  let tableStyleStr = '';
  let cellStyleStr = '';
  let tableStyle = c.tableStyle || {};
  let cellStyle = c.cellStyle || {};
  
  for (let prop in tableStyle){
    tableStyleStr += `${prop}: ${tableStyle[prop]}; `;
  }
  for (let prop in cellStyle){
    cellStyleStr += `${prop}: ${cellStyle[prop]}; `;
  }

  toAdd('column1') && bm.add('column1', {
    label: c.labelColumn1,
    category: c.categoryColumn1,
    attributes: {class:'gjs-fonts gjs-f-b1'},
    content: `<table style="${tableStyleStr}">
      <tr>
        <td style="${cellStyleStr}"><p class="gjs-fonts gjs-f-text" style="padding:10px;">Insert content here</p></td>
      </tr>
      </table>`,
  });

  toAdd('column2') && bm.add('column2', {
    label: c.labelColumn2,
    category: c.categoryColumn2,
    attributes: {class:'gjs-fonts gjs-f-b2'},
    content: `<table style="${tableStyleStr}">
      <tr>
        <td style="${cellStyleStr} width: 50%">
          <p class="gjs-fonts gjs-f-text" style="padding:10px;">Insert content here</p>
        </td>
        <td style="${cellStyleStr} width: 50%">
          <p class="gjs-fonts gjs-f-text" style="padding:10px;">Insert content here</p>
        </td>
      </tr>
      </table>`,
  });

  toAdd('column3') && bm.add('column3', {
    label: c.labelColumn3,
    category: c.categoryColumn3,
    attributes: {class:'gjs-fonts gjs-f-b3'},
    content: `<table style="${tableStyleStr}">
      <tr>
        <td style="${cellStyleStr} width: 33.3333%"><p class="gjs-fonts gjs-f-text" style="padding:10px;">Insert content here</p></td>
        <td style="${cellStyleStr} width: 33.3333%"><p class="gjs-fonts gjs-f-text" style="padding:10px;">Insert content here</p></td>
        <td style="${cellStyleStr} width: 33.3333%"><p class="gjs-fonts gjs-f-text" style="padding:10px;">Insert content here</p></td>
      </tr>
      </table>`,
  });

  toAdd('column3-7') && bm.add('column3-7', {
    label: c.labelColumn37,
    category: c.categoryColumn37,
    attributes: {class:'gjs-fonts gjs-f-b37'},
    content: `<table style="${tableStyleStr}">
      <tr>
        <td style="${cellStyleStr} width:30%"><p class="gjs-fonts gjs-f-text" style="padding:10px;">Insert content here</p></td>
        <td style="${cellStyleStr} width:70%"><p class="gjs-fonts gjs-f-text" style="padding:10px;">Insert content here</p></td>
      </tr>
      </table>`,
  });

  toAdd('divider') && bm.add('divider', {
    label: c.labelDivider,
    category: c.categoryDivider,
    content: `<table style="width: 100%; margin-top: 10px; margin-bottom: 10px;">
      <tr>
        <td class="divider"></td>
      </tr>
    </table>
    <style>
    .divider {
      background-color: rgba(0, 0, 0, 0.1);
      height: 1px;
    }
    </style>`,
    attributes: {class:'gjs-fonts gjs-f-divider'}
  });

 
  //form elements

  toAdd('form') && bm.add('form', {
    label: `
    <svg class="gjs-block-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path class="gjs-block-svg-path" d="M22,5.5 C22,5.2 21.5,5 20.75,5 L3.25,5 C2.5,5 2,5.2 2,5.5 L2,8.5 C2,8.8 2.5,9 3.25,9 L20.75,9 C21.5,9 22,8.8 22,8.5 L22,5.5 Z M21,8 L3,8 L3,6 L21,6 L21,8 Z" fill-rule="nonzero"></path>
      <path class="gjs-block-svg-path" d="M22,10.5 C22,10.2 21.5,10 20.75,10 L3.25,10 C2.5,10 2,10.2 2,10.5 L2,13.5 C2,13.8 2.5,14 3.25,14 L20.75,14 C21.5,14 22,13.8 22,13.5 L22,10.5 Z M21,13 L3,13 L3,11 L21,11 L21,13 Z" fill-rule="nonzero"></path>
      <rect class="gjs-block-svg-path" x="2" y="15" width="10" height="3" rx="0.5"></rect>
    </svg>
    <div class="gjs-block-label">${c.labelForm}</div>`,
    category: c.formCategory,
    content: `
      <form class="form">
        <div class="form-group">
          <label class="label">Name</label>
          <input placeholder="Type here your name" class="input"/>
        </div>
        <div class="form-group">
          <label class="label">Email</label>
          <input type="email" placeholder="Type here your email" class="input"/>
        </div>
        <div class="form-group">
          <label class="label">Gender</label>
          <input type="checkbox" class="checkbox" value="M">
          <label class="checkbox-label">M</label>
          <input type="checkbox" class="checkbox" value="F">
          <label class="checkbox-label">F</label>
        </div>
        <div class="form-group">
          <label class="label">Message</label>
          <textarea class="textarea"></textarea>
        </div>
        <div class="form-group">
          <button type="submit" class="button">Send</button>
        </div>
      </form>
    `,
  });

  toAdd('input') && bm.add('input', {
    label: `
    <svg class="gjs-block-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path class="gjs-block-svg-path" d="M22,9 C22,8.4 21.5,8 20.75,8 L3.25,8 C2.5,8 2,8.4 2,9 L2,15 C2,15.6 2.5,16 3.25,16 L20.75,16 C21.5,16 22,15.6 22,15 L22,9 Z M21,15 L3,15 L3,9 L21,9 L21,15 Z"></path>
      <polygon class="gjs-block-svg-path" points="4 10 5 10 5 14 4 14"></polygon>
    </svg>
    <div class="gjs-block-label">${c.labelInputName}</div>`,
    category: c.formCategory,
    content: '<input class="input"/>',
  });

  toAdd('textarea') && bm.add('textarea', {
    label: `
    <svg class="gjs-block-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path class="gjs-block-svg-path" d="M22,7.5 C22,6.6 21.5,6 20.75,6 L3.25,6 C2.5,6 2,6.6 2,7.5 L2,16.5 C2,17.4 2.5,18 3.25,18 L20.75,18 C21.5,18 22,17.4 22,16.5 L22,7.5 Z M21,17 L3,17 L3,7 L21,7 L21,17 Z"></path>
      <polygon class="gjs-block-svg-path" points="4 8 5 8 5 12 4 12"></polygon>
      <polygon class="gjs-block-svg-path" points="19 7 20 7 20 17 19 17"></polygon>
      <polygon class="gjs-block-svg-path" points="20 8 21 8 21 9 20 9"></polygon>
      <polygon class="gjs-block-svg-path" points="20 15 21 15 21 16 20 16"></polygon>
    </svg>
    <div class="gjs-block-label">${c.labelTextareaName}</div>`,
    category: c.formCategory,
    content: '<textarea class="textarea"></textarea>',
  });

  toAdd('select') && bm.add('select', {
    label: `
    <svg class="gjs-block-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path class="gjs-block-svg-path" d="M22,9 C22,8.4 21.5,8 20.75,8 L3.25,8 C2.5,8 2,8.4 2,9 L2,15 C2,15.6 2.5,16 3.25,16 L20.75,16 C21.5,16 22,15.6 22,15 L22,9 Z M21,15 L3,15 L3,9 L21,9 L21,15 Z" fill-rule="nonzero"></path>
      <polygon class="gjs-block-svg-path" transform="translate(18.500000, 12.000000) scale(1, -1) translate(-18.500000, -12.000000) " points="18.5 11 20 13 17 13"></polygon>
      <rect class="gjs-block-svg-path" x="4" y="11.5" width="11" height="1"></rect>
    </svg>
    <div class="gjs-block-label">${c.labelSelectName}</div>`,
    category: c.formCategory,
    content: `<select class="select">
      ${c.labelSelectOption ? `<option value="">${c.labelSelectOption}</option>` : ''}
      <option value="1">${c.labelOption} 1</option>
      </select>`,
  });
  
  toAdd('button') && bm.add('button', {
    label: `
    <svg class="gjs-block-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path class="gjs-block-svg-path" d="M22,9 C22,8.4 21.5,8 20.75,8 L3.25,8 C2.5,8 2,8.4 2,9 L2,15 C2,15.6 2.5,16 3.25,16 L20.75,16 C21.5,16 22,15.6 22,15 L22,9 Z M21,15 L3,15 L3,9 L21,9 L21,15 Z" fill-rule="nonzero"></path>
      <rect class="gjs-block-svg-path" x="4" y="11.5" width="16" height="1"></rect>
    </svg>
    <div class="gjs-block-label">${c.labelButtonName}</div>`,
    category: c.formCategory,
    content: '<button class="button">Send</button>',
  });
  
  toAdd('label') && bm.add('label', {
    label: `
    <svg class="gjs-block-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path class="gjs-block-svg-path" d="M22,11.875 C22,11.35 21.5,11 20.75,11 L3.25,11 C2.5,11 2,11.35 2,11.875 L2,17.125 C2,17.65 2.5,18 3.25,18 L20.75,18 C21.5,18 22,17.65 22,17.125 L22,11.875 Z M21,17 L3,17 L3,12 L21,12 L21,17 Z" fill-rule="nonzero"></path>
      <rect class="gjs-block-svg-path" x="2" y="5" width="14" height="5" rx="0.5"></rect>
      <polygon class="gjs-block-svg-path" fill-rule="nonzero" points="4 13 5 13 5 16 4 16"></polygon>
    </svg>
    <div class="gjs-block-label">${c.labelNameLabel}</div>`,
    category: c.formCategory,
    content: '<label class="label">Label</label>',
  });
  
  toAdd('checkbox') && bm.add('checkbox', {
    label: c.labelCheckboxName,
    attributes: {class:'fa fa-check-square'},
    category: c.formCategory,
    content: '<input type="checkbox" class="checkbox"/>',
  });

  toAdd('radio') && bm.add('radio', {
    label: c.labelRadioName,
    attributes: {class:'fa fa-dot-circle-o'},
    category: c.formCategory,
    content: '<input type="radio" class="radio"/>',
  });

}
