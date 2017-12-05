import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
//import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Image from '@ckeditor/ckeditor5-image/src/image';


import AddPropertyName from './addProperty.js';
import MyBold from './myBold.js';

let theEditor;

ClassicEditor
    .create( document.querySelector( '#editor' ), {
        plugins: [ Essentials, Paragraph, Italic, Image, AddPropertyName, MyBold ],
        toolbar: [ 'italic', 'addPropertyName', 'myBold' ]
    } )
    .then( editor => {
    	theEditor = editor;
        console.log( 'Editor was initialized', editor );
    } )
    .catch( error => {
        console.error( error.stack );
    } );


function getDataFromTheEditor() {
    //theEditor.setData("<p property='yesss'><strong>Editor content goes here.</strong></p>");
    theEditor.setData("<div><p><strong>Editor content goes here.</strong></p><span>Hello</span></div>", true);
    //theEditor.setData("<div><strong>Editor content goes here.</strong><p class='blue'><span>Hello</span></p></div>");
    return theEditor.getData();
}

document.getElementById( 'getdata' ).addEventListener( 'click', () => {
    alert( getDataFromTheEditor() );
} );


// var viewSelector = $("#view-selector");
// viewSelector.onchange = function(e) {
// 	var selectedString = viewSelector.options[viewSelector.selectedIndex].value;
//     alert(selectedString);
// };
