import {
  css,
  html,
  LitElement,
} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js';
// import { LitElement, html, css } from 'lit';

export class EmbedIqpro extends LitElement {
  static styles = css`
    #submitPayment {
      background-color: var(--ntx-form-theme-color-primary);
      font-size: var(--ntx-form-theme-text-label-size);
      font-family: var(--ntx-form-theme-font-family);
      border: 0px;
      border-radius: var(--ntx-form-theme-border-radius);
    }
  `;

  static properties = {
    apiKey: { type: String },
    paymentInfo: { type: Object },
  };

  static getMetaConfig() {
    // plugin contract information
    return {
      controlName: 'iQPro Payment Tokenizer',
      description: 'Render iQPro Tokenizer',
      iconUrl: 'currency',
      groupName: 'Payment Gateways',
      version: '1.3',
      standardProperties: {
        description: true,
        fieldLabel: false,
        visibility: true,
      },
      properties: {
        apiKey: {
          type: 'string',
          title: 'API Key',
          required: true,
          description: 'iQ Pro Public API Key. Should start with pub',
          defaultValue: 'pub_2hCCCdzZeitXyBY16cLCXFzpJHO',
        },
        paymentInfo: {
          type: 'object',
          title: 'Payment Info',
          isValueField: true,
          properties: {
            status: {
              type: 'string',
              description: 'Payment Status',
              title: 'Payment Status',
            },
            token: {
              type: 'string',
              description: 'Payment Token',
              title: 'Payment Token',
            },
          },
        },
      },
      designer: {
        canvasRestrictions: {
          isFullRow: true,
        },
      },
      events: ['ntx-value-change'],
      fallbackDisableSubmit: true,
    };
  }

  firstUpdated() {
    console.log('Creating script');
    const insertScript = document.createElement('script');
    insertScript.src = 'https://sandbox.basysiqpro.com/tokenizer/tokenizer.js';
    this.shadowRoot?.appendChild(insertScript);
    insertScript.onload = () => this.startTokenizer();
  }

  startTokenizer() {
    console.log('Starting Tokenizer');
    var tokenizerForm = new Tokenizer({
      url: 'https://sandbox.basysiqpro.com',
      apikey: this.apiKey,
      container: this.shadowRoot?.querySelector('#paymentContainer'),

      // Callback after submission request has been made
      submission: resp => {
        console.log('Response received');
        // Figure out what response you got back
        switch (resp.status) {
          case 'success':
            // Successful submission
            console.log('Success');
            console.log(resp.token);
            this.paymentSubmission(resp);
            break;
          case 'error':
            // Encountered an error while performing submission
            console.log('Error');
            console.log(resp.msg);
            this.createTokenDisplay(resp);
            break;
          case 'validation':
            // Encountered form validation specific errors
            console.log('Invalid');
            console.log(resp.invalid);
            this.createTokenDisplay(resp);
            break;
        }
      },
    });

    this.shadowRoot
      ?.querySelector('#submitPayment')
      ?.addEventListener('click', () => tokenizerForm.submit());
  }

  submitButton() {
    this.shadowRoot
      ?.querySelector('#submitPayment')
      ?.addEventListener('click', () => {
        this.startTokenizer();
      });
  }

  paymentSubmission(e) {
    const args = {
      bubbles: true,
      cancelable: false,
      compsed: true,
      detail: e,
    };
    const event = new CustomEvent('ntx-value-change', args);
    this.dispatchEvent(event);
    console.log('Event triggered');
    console.log(e);

    this.createTokenDisplay(e);
  }

  createTokenDisplay(e) {
    if (e.status == 'success') {
      const deadChild = this.shadowRoot?.querySelector('#tokenizerDisplay');
      this.shadowRoot?.removeChild(deadChild);
    } else {
      console.log('Starting display setup');

      if (this.shadowRoot?.querySelector('#tokenizerDisplay') != null) {
        console.log('This div exists!');
        const deadChild = this.shadowRoot?.querySelector('#tokenizerDisplay');
        this.shadowRoot?.removeChild(deadChild);
      } else {
        console.log('This div does not exist yet');
      }

      console.log('Creating div');
      const tokenizerOutput = JSON.stringify(e);
      const newDiv = document.createElement('div');
      newDiv.id = 'tokenizerDisplay';
      const childDiv = this.shadowRoot?.appendChild(newDiv);
      const tokenizerText = document.createTextNode(tokenizerOutput);
      childDiv.appendChild(tokenizerText);
    }
  }

  // Render the UI as a function of component state
  render() {
    return html`<div id="paymentContainer"></div>
      <button id="submitPayment">Request Payment</button>`;
  }
}

// registering the web component.
const elementName = 'embed-iqpro';
customElements.define(elementName, EmbedIqpro);
