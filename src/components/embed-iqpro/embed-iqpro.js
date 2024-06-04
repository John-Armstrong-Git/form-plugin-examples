import { css, html, LitElement } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { until } from 'lit/directives/until.js';
import { Tokenizer } from 'iqpro/tokenizer.js';

export class EmbedIqpro extends LitElement {
  static styles = css`
    :host {
      height: 100%;
      width: 100%;
      display: block;
    }

    .frame {
      display: inline-block;
      height: 100%;
      width: 100%;
      background-color: transparent;
      border: none;
    }
  `;

  static properties = {
    height: { type: String },
    url: { type: String },
    apikey: { type: String },
  };

  static getMetaConfig() {
    // plugin contract information
    return {
      controlName: 'embed-iqpro',
      fallbackDisableSubmit: false,
      description: 'iFrame component which can render iQPro Tokenizer',
      iconUrl: 'pen',
      groupName: 'payment',
      version: '1.3',
      properties: {
        height: {
          type: 'string',
          title: 'Height',
          description: 'Height of the component',
        },
        apikey: {
          type: 'string',
          title: 'iQ Pro Public API Key',
        },
      },
      standardProperties: {
        description: true,
      },
    };
  }

  async load() {
    var example = new Tokenizer({
      url: this.url,
      apikey: this.apikey,
      container: '#container',

      // Callback after submission request has been made
      submission: resp => {
        // Figure out what response you got back
        switch (resp.status) {
          case 'success':
            // Successful submission
            console.log(resp.token);

            // If you had user info
            if (resp.user) {
              console.log(resp.user);
            }

            // If you had billing info
            if (resp.billing) {
              console.log(resp.billing);
            }

            // If you had shipping info
            if (resp.shipping) {
              console.log(resp.shipping);
            }
            break;
          case 'error':
            // Encountered an error while performing submission
            console.log(resp.msg);
            break;
          case 'validation':
            // Encountered form validation specific errors
            console.log(resp.invalid);
            break;
        }
      },

      // Callback after iframe is initiated an onload
      onLoad: () => {
        console.log('iframe has loaded');
      },

      // Callback after payment type changes
      onPaymentChange: type => {
        console.log(type);
      },

      // Callback to identify when a valid cc has been inputed
      // If valid will return ccbin data as well
      validCard: card => {
        console.log(card);
        // card.isValid // Boolean
        // card.bin // Object of bin data
      },

      // Callback for when the user has changed sec code or account type
      achOnChange: data => {
        console.log(data);
      },
    });

    // Set error on field
    // by passing in the field name which is the name of primary css on the field
    // it will set a red border around the field
    example.setError('cvv'); // Set error on cvv field

    // Set expiration date on card payment
    example.setExpDate('09/12');

    // Submit payment
    example.submit();

    let styles = { height: this.height };
    return html` <iframe
      class="frame"
      style=${styleMap(styles)}
      id="container"
    ></iframe>`;
  }

  // Render the UI as a function of component state
  render() {
    return html`${until(this.resp, html`<span>Loading...</span>`)}`;
  }
}

// registering the web component.
const elementName = 'embed-iqpro';
customElements.define(elementName, EmbedIqpro);
