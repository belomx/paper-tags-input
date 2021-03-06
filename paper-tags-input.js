import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-input/paper-input.js';
import '@cwmr/paper-chip/paper-chip.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import '@polymer/polymer/lib/utils/render-status.js'

/**
* `paper-tags-input`
* Material Design input control for a collection of tags
*
* @customElement
* @polymer
* @demo demo/index.html
*/
class PaperTagsInput extends PolymerElement {
    static get template() {
        return html`
            <style include="paper-tags-input-shared-styles">
                :host {
                    display: block;
		    @apply --paper-tag-input-mixin;
                }
                :host[hidden] {
                    display: none !important;
                }
                input {
                    text-transform: lowercase;
                    height: 36px;
                    width: auto !important;
                    padding-left: 0.5em;
		    @apply --paper-tag-input-input-mixin;
                }
                paper-chip {
                    margin: 2px;
                    padding-right: 6px;
                    cursor: pointer;
		    @apply --paper-tag-input-chip-mixin;
                }
                iron-icon {
                    --iron-icon-height: 20px;
                    --iron-icon-width: 20px;
                    color: var(--disabled-text-color);
		    @apply --paper-tag-input-icon-mixin;
                }
            </style>
        
            <paper-input label="[[label]]" placeholder="[[placeholder]]" on-keydown="_onInputKeydown">
                <div slot="prefix">
                    <template is="dom-repeat" items="[[tags]]">
                        <paper-chip selectable="">[[item]] <iron-icon icon="icons:cancel" on-click="_onTagRemoveClicked"></iron-icon></paper-chip>
                    </template>
                </div>
            </paper-input>
`;
    }

    static get is() { return 'paper-tags-input'; }
    static get properties() {
        return {
            placeholder: {
		type: String,
		value: "+tag"
	    },
            label: {
                type: String,
                value: 'Tags'
            },
            tags: {
                type: Array,
                notify: true,
                value: function() { return []; }
            }
        };
    }

    constructor() {
        super();
    }

    addTag(tag) {
        if (this.tags === null) {
            this.tags = [];
        }
        const oldValue = [...this.tags];
        var trimmedTag = tag.replace(/^\s+/, '').replace(/\s+$/, '');
        if (trimmedTag !== '') {
            var tagIndex = this.tags.indexOf(trimmedTag);
            if (tagIndex === -1) {
                this.push('tags', trimmedTag);
            }
        }
	this._tagsChanged (this.tags, oldValue);
    }
    removeTag(tag) {
        if (this.tags === null) {
            return;
        }
	const oldValue = [...this.tags];
        var tagIndex = this.tags.indexOf(tag);
        if (tagIndex > -1) {
            this.splice('tags', tagIndex, 1);
        }
	this._tagsChanged (this.tags, oldValue);
    }

    _onTagRemoveClicked(e) {
        this.removeTag(e.model.item);
    }

    _onInputKeydown(e) {
        if (e.keyCode === 13) {	    
            this.addTag(e.target.value.toLowerCase());
            e.target.value = '';
        }
    }

    _tagsChanged (newValue, oldValue) {
	 this.dispatchEvent(new CustomEvent('tags-changed-complete', {
           detail: {
	     value: newValue,
	     oldValue: oldValue
           }
         }));
    }
}

customElements.define(PaperTagsInput.is, PaperTagsInput);
export {PaperTagsInput};
