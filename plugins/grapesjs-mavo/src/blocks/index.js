export default (editor, config) => {
  const bm = editor.BlockManager;
  const toAdd = name => config.blocks.indexOf(name) >= 0;
  const c = config;

  toAdd('link-block') && bm.add('link-block', {
    category: 'Basic',
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

  toAdd('quote') && bm.add('quote', {
    label: 'Quote',
    category: 'Basic',
    attributes: { class: 'fa fa-quote-right' },
    content: `<blockquote class="quote">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore ipsum dolor sit
      </blockquote>`
  });

  toAdd('text-basic') && bm.add('text-basic', {
    category: 'Basic',
    label: 'Text section',
    attributes: { class: 'gjs-fonts gjs-f-h1p' },
    content: `<section class="bdg-sect">
      <h1 class="heading">Insert title here</h1>
      <p class="paragraph">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</p>
      </section>`
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
    category: 'Interactive',
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
    category: 'Interactive',
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
    category: 'Interactive',
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
    category: 'Interactive',
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
    category: 'Interactive',
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
    category: 'Interactive',
    content: '<label class="label">Label</label>',
  });
  
  toAdd('checkbox') && bm.add('checkbox', {
    label: c.labelCheckboxName,
    attributes: {class:'fa fa-check-square'},
    category: 'Interactive',
    content: '<input type="checkbox" class="checkbox"/>',
  });

  toAdd('radio') && bm.add('radio', {
    label: c.labelRadioName,
    attributes: {class:'fa fa-dot-circle-o'},
    category: 'Interactive',
    content: '<input type="radio" class="radio"/>',
  });

}
