import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

// import propertyIcon from './property_name_icon.svg';
import propertyIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';

import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import ModelElement from '@ckeditor/ckeditor5-engine/src/model/element';

export default class AddPropertyName extends Plugin {
    init() {
        const editor = this.editor;

        editor.ui.componentFactory.add( 'addPropertyName', locale => {
            const view = new ButtonView( locale );

            view.set( {
                label: 'Property Name',
                icon: propertyIcon,
                tooltip: true
            } );

            // Callback executed once the image is clicked.
            view.on( 'execute', () => {
                const propertyName = prompt( 'Property Name' );
                console.log(this)

                editor.document.enqueueChanges( () => {
                    const imageElement = new ModelElement( 'image', {
                        "src": propertyName,
                        "alt": "Smiley face",
                        "class": "blue"
                        //"property": "yess"
                    } );

                    // Insert the image in the current selection location.
                    editor.data.insertContent( imageElement, editor.document.selection );
                } );
            } );

            return view;
        } );
    }
}