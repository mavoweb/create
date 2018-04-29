export default (editor, config = {}) => {
  const domc = editor.DomComponents;
  const defaultType = domc.getType('default');
  const defaultModel = defaultType.model;
  const defaultView = defaultType.view;

  const c = config;

  const textType = domc.getType('text');
  const textModel = textType.model;
  const textView = textType.view;

  let stateNormal = 'Normal';
  let stateSuccess = 'Success';
  let stateError = 'Error';

  const idTrait = {
    name: 'id',
    label: c.labelTraitId,
  };

  const forTrait = {
    name: 'for',
    label: c.labelTraitFor,
  };

  const nameTrait = {
    name: 'name',
    label: c.labelTraitName,
  };

  const placeholderTrait = {
    name: 'placeholder',
    label: c.labelTraitPlaceholder,
  };

  const valueTrait = {
    name: 'value',
    label: c.labelTraitValue,
  };

  const requiredTrait = {
    type: 'checkbox',
    name: 'required',
    label: c.labelTraitRequired,
  };

  const checkedTrait = {
    label: c.labelTraitChecked,
    type: 'checkbox',
    name: 'checked',
    changeProp: 1
  };

  const mavoPropertyTrait = {
    label: c.labelMavoProperty,
    type: 'input',
    name: 'property',
  };

  const mavoMultipleTrait = {
    label: c.labelMvMultiple,
    type: 'checkbox',
    name: 'mv-multiple',
  };

  const preventDefaultClick = () => {
    return defaultType.view.extend({
      events: {
        'mousedown': 'handleClick',
      },

      handleClick(e) {
        e.preventDefault();
      },
    });
  };

  domc.addType('form', {
    model: defaultModel.extend({
      defaults: {
        ...defaultModel.prototype.defaults,
        droppable: ':not(form)',
        draggable: ':not(form)',
        traits: [{
          type: 'select',
          label: c.labelTraitMethod,
          name: 'method',
          options: [
            {value: 'post', name: 'POST'},
            {value: 'get', name: 'GET'},
          ]
        },{
          label: c.labelTraitAction,
          name: 'action',
        }/*,{
          type: 'select',
          label: c.labelTraitState,
          name: 'formState',
          changeProp: 1,
          options: [
            {value: '', name: c.labelStateNormal},
            {value: 'success', name: c.labelStateSuccess},
            {value: 'error', name: c.labelStateError},
          ]
        }*/],
      },

      init() {
        this.listenTo(this, 'change:formState', this.updateFormState);
      },

      updateFormState() {
        var state = this.get('formState');
        switch (state) {
          case 'success':
            this.showState('success');
            break;
          case 'error':
            this.showState('error');
            break;
          default:
            this.showState('normal');
        }
      },

      showState(state) {
        var st = state || 'normal';
        var failVis, successVis;
        if (st == 'success') {
          failVis = 'none';
          successVis = 'block';
        } else if (st == 'error') {
          failVis = 'block';
          successVis = 'none';
        } else {
          failVis = 'none';
          successVis = 'none';
        }
        var successModel = this.getStateModel('success');
        var failModel = this.getStateModel('error');
        var successStyle = successModel.getStyle();
        var failStyle = failModel.getStyle();
        successStyle.display = successVis;
        failStyle.display = failVis;
        successModel.setStyle(successStyle);
        failModel.setStyle(failStyle);
      },

      getStateModel(state) {
        var st = state || 'success';
        var stateName = 'form-state-' + st;
        var stateModel;
        var comps = this.get('components');
        for (var i = 0; i < comps.length; i++) {
          var model = comps.models[i];
          if(model.get('form-state-type') == st) {
            stateModel = model;
            break;
          }
        }
        if (!stateModel) {
          var contentStr = formMsgSuccess;
          if(st == 'error') {
            contentStr = formMsgError;
          }
          stateModel = comps.add({
            'form-state-type': st,
            type: 'text',
            removable: false,
            copyable: false,
            draggable: false,
            attributes: {'data-form-state': st},
            content: contentStr,
          });
        }
        return stateModel;
      },
    }, {
      isComponent(el) {
        if(el.tagName == 'FORM'){
          return {type: 'form'};
        }
      },
    }),

    view: defaultView.extend({
      events: {
        submit(e) {
          e.preventDefault();
        }
      }
    }),
  });

  // INPUT
  var inputTraits = [
    nameTrait,
    placeholderTrait, {
      label: c.labelTraitType,
      type: 'select',
      name: 'type',
      options: [
        {value: 'text', name: c.labelTypeText},
        {value: 'email', name: c.labelTypeEmail},
        {value: 'password', name: c.labelTypePassword},
        {value: 'number', name: c.labelTypeNumber},
      ]
    }
  ];

  if (c.useRequiredTrait) {
    inputTraits.push(requiredTrait);
  }

  domc.addType('input', {
    model: defaultModel.extend({
      defaults: {
        ...defaultModel.prototype.defaults,
        'custom-name': c.labelInputName,
        tagName: 'input',
        droppable: false,
        traits: inputTraits,
      },
    }, {
      isComponent(el) {
        if(el.tagName == 'INPUT') {
          return {type: 'input'};
        }
      },
    }),
    view: defaultView,
  });

  var inputType = domc.getType('input');
  var inputModel = inputType.model;


  // TEXTAREA
  var textAreaTraits = [
    nameTrait,
    placeholderTrait
  ];

  if (c.useRequiredTrait) {
    textAreaTraits.push(requiredTrait);
  }

  domc.addType('textarea', {
    model: inputType.model.extend({
      defaults: {
        ...inputModel.prototype.defaults,
        'custom-name': c.labelTextareaName,
        tagName: 'textarea',
        traits: textAreaTraits,
      },
    }, {
      isComponent(el) {
        if(el.tagName == 'TEXTAREA'){
          return {type: 'textarea'};
        }
      },
    }),
    view: defaultView,
  });

  // SELECT
  var selectTraits = [
    nameTrait, {
      label: c.labelTraitOptions,
      type: 'select-options'
    }
  ];

  if (c.useRequiredTrait) {
    selectTraits.push(requiredTrait);
  }
  domc.addType('select', {
    model: defaultModel.extend({
      defaults: {
        ...inputModel.prototype.defaults,
        'custom-name': c.labelSelectName,
        tagName: 'select',
        traits: selectTraits,
      },
    }, {
      isComponent(el) {
        if(el.tagName == 'SELECT'){
          return {type: 'select'};
        }
      },
    }),
    view: preventDefaultClick(),
  });

  // CHECKBOX
  var checkboxTraits = [
    idTrait,
    nameTrait,
    valueTrait,
    checkedTrait
  ];

  if (c.useRequiredTrait) {
    checkboxTraits.push(requiredTrait);
  }
  domc.addType('checkbox', {
    model: defaultModel.extend({
      defaults: {
        ...inputModel.prototype.defaults,
        'custom-name': c.labelCheckboxName,
        copyable: false,
        attributes: {type: 'checkbox'},
        traits: checkboxTraits,
      },

      init() {
        this.listenTo(this, 'change:checked', this.handleChecked);
      },

      handleChecked() {
        let checked = this.get('checked');
        let attrs = this.get('attributes');
        const view = this.view;

        if (checked) {
          attrs.checked = true;
        } else {
          delete attrs.checked;
        }

        if (view) {
          view.el.checked = checked
        }

        this.set('attributes', { ...attrs });
      }
    }, {
      isComponent(el) {
        if (el.tagName == 'INPUT' && el.type == 'checkbox') {
          return {type: 'checkbox'};
        }
      },
    }),
    view: defaultView.extend({
      events: {
        'click': 'handleClick',
      },

      handleClick(e) {
        e.preventDefault();
      },
    }),
  });

  var checkType = domc.getType('checkbox');

  // RADIO
  domc.addType('radio', {
     model: checkType.model.extend({
       defaults: {
         ...checkType.model.prototype.defaults,
         'custom-name': c.labelRadioName,
         attributes: {type: 'radio'},
       },
     }, {
       isComponent(el) {
         if(el.tagName == 'INPUT' && el.type == 'radio'){
           return {type: 'radio'};
         }
       },
     }),
     view: checkType.view,
  });


  domc.addType('button', {
    model: defaultModel.extend({
      defaults: {
        ...inputModel.prototype.defaults,
        'custom-name': c.labelButtonName,
        tagName: 'button',
        traits: [{
          type: 'content',
          label: 'Text',
        },{
          label: c.labelTraitType,
          type: 'select',
          name: 'type',
          options: [
            {value: 'submit', name: c.labelTypeSubmit},
            {value: 'reset', name: c.labelTypeReset},
            {value: 'button', name: c.labelTypeButton},
          ]
        }]
      },
    }, {
      isComponent(el) {
        if(el.tagName == 'BUTTON'){
          return {type: 'button'};
        }
      },
    }),
    view: defaultView.extend({
      events: {
        'click': 'handleClick'
      },

      init() {
        this.listenTo(this.model, 'change:content', this.updateContent);
      },

      updateContent() {
        this.el.innerHTML = this.model.get('content')
      },

      handleClick(e) {
        e.preventDefault();
      },
    }),
  });


  // LABEL
  domc.addType('label', {
    model: textModel.extend({
      defaults: {
        ...textModel.prototype.defaults,
        'custom-name': c.labelNameLabel,
        tagName: 'label',
        traits: [forTrait],
      },
    }, {
      isComponent(el) {
        if(el.tagName == 'LABEL'){
          return {type: 'label'};
        }
      },
    }),
    view: textView,
  });


  //add mavo traits to all existing components

  for (var i = 0; i < domc.componentTypes.length; i++) {
    var compType = domc.componentTypes[i].id;
    if (compType !== 'select') {
      var originalComp = domc.getType(compType);
      var givenTraits = originalComp.model.prototype.defaults.traits;
      var newTraits = givenTraits.slice();
      newTraits.push({
                type: 'input',
                label: 'Mavo Name',
                name: 'property',
              });
      var mvAttributeOptions = [];
      mvAttributeOptions.push({value:"", name: "Default"});
      for (var j = 0; j < newTraits.length; j++) {
        var trait = newTraits[j];
        var newOption;
        if (trait.name && trait.label) {
          newOption = {value: trait.name, name:trait.label};
        } else {
          newOption = {value: trait, name:trait};
        }

        mvAttributeOptions.push(newOption);
      }
      mvAttributeOptions.push({value:"none", name: "Text Content"});
      newTraits.push({
                type: 'select',
                label: 'Mavo Target',
                name: 'mv-attribute',
                options: mvAttributeOptions
              });
      newTraits.push({
                type: 'checkbox',
                label: 'Repeatable',
                name: 'mv-multiple',
              });

      domc.addType(compType, {
          model: originalComp.model.extend({
              defaults: Object.assign({}, originalComp.model.prototype.defaults, {
                traits: newTraits,
              }),
          }),
          view: originalComp.view
      });
    }
  };
}
