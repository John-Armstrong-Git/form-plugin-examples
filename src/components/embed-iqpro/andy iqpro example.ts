import { PluginContract } from '@nintex/form-plugin-contract';
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('andy-iqpro')

export class NintexSampleIframe extends LitElement {

  @property({ type: String }) apikey: string = 'pub_2hCCCdzZeitXyBY16cLCXFzpJHO';

  static getMetaConfig(): Promise<PluginContract> | PluginContract {
    // plugin contract information
    return {
      controlName: 'IFrame-new',
      fallbackDisableSubmit: false,
      description: 'IFrame component which can render url view with the frame',
      iconUrl: 'one-line-text',
      groupName: 'Visual',
      version: '1.3',
      properties: {
      },
      standardProperties: {
        readOnly: true,
        required: true,
        description: true,
      },
    };
  }
  
  firstUpdated() {
    const script = document.createElement('script');
    script.src = 'https://sandbox.basysiqpro.com/tokenizer/tokenizer.js';
    script.onload = () => {
      this.initializeTokenizer();
    };
    this.shadowRoot?.appendChild(script);
  }

  setupButton() {
    this.shadowRoot?.querySelector('button')?.addEventListener('click', () => {
      this.initializeTokenizer();
    });
  }

  initializeTokenizer() {
    const example = new (window as any).Tokenizer({
      url: `https://sandbox.basysiqpro.com`,
      apikey: this.apikey,
      container: this.shadowRoot?.querySelector('#container'),
      submission: (resp: any) => { console.log(resp); }
    });
    this.shadowRoot?.querySelector('button')?.addEventListener('click', () => example.submit());
  }

  render() {
    return html`
      <div id="container"></div>
      <button>Submit</button>
    `;
  }
}