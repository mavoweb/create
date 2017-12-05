import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import boldIcon from '@ckeditor/ckeditor5-core/theme/icons/low-vision.svg';
import buildModelConverter from '@ckeditor/ckeditor5-engine/src/conversion/buildmodelconverter';
import buildViewConverter from '@ckeditor/ckeditor5-engine/src/conversion/buildviewconverter';
import AttributeCommand from './attributecommand';

const BOLD = 'myBold';

class BoldEngine extends Plugin {
	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const data = editor.data;
		const editing = editor.editing;

		// Allow bold attribute on all inline nodes.
		editor.document.schema.allow( { name: '$inline', attributes: BOLD, inside: '$block' } );
		// Temporary workaround. See https://github.com/ckeditor/ckeditor5/issues/477.
		editor.document.schema.allow( { name: '$inline', attributes: BOLD, inside: '$clipboardHolder' } );

		// Build converter from model to view for data and editing pipelines.
		buildModelConverter().for( data.modelToView, editing.modelToView )
			.fromAttribute( BOLD )
			.toElement( 'strong' );

		// Build converter from view to model for data pipeline.
		buildViewConverter().for( data.viewToModel )
			.fromElement( 'strong' )
			.fromElement( 'b' )
			.fromAttribute( 'style', { 'font-weight': 'bold' } )
			.toAttribute( BOLD, true );

		// Create bold command.
		editor.commands.add( BOLD, new AttributeCommand( editor, BOLD ) );
	}
}

export default class MyBold extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ BoldEngine ];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'Bold';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const t = editor.t;
		const command = editor.commands.get( 'myBold' );
		const keystroke = 'CTRL+B';

		// Add bold button to feature components.
		editor.ui.componentFactory.add( 'myBold', locale => {
			const view = new ButtonView( locale );

			view.set( {
				label: t( 'myBold' ),
				icon: boldIcon,
				keystroke,
				tooltip: true
			} );

			view.bind( 'isOn', 'isEnabled' ).to( command, 'value', 'isEnabled' );

			// Execute command.
			this.listenTo( view, 'execute', () => editor.execute( 'myBold' ) );

			return view;
		} );

		// Set the Ctrl+B keystroke.
		editor.keystrokes.set( keystroke, 'myBold' );
	}
}