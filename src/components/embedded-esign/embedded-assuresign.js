import {
  css,
  html,
  LitElement,
  styleMap,
  until,
} from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';
// import { css, html, LitElement } from 'lit';
// import { styleMap } from 'lit/directives/style-map.js';
// import { until } from 'lit/directives/until.js';

export class EmbeddedAssureSign extends LitElement {
  // Define scoped styles right with your component, in plain CSS
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
    src: { type: String },
    content: { type: String },
    envelopeName: { type: String },
    height: { type: String },
    signerName: { type: String },
    signerEmail: { type: String },
    assureSignApiUsername: { type: String },
    assureSignApiKey: { type: String },
    assureSignApiUserEmail: { type: String },
    assureSignTemplateId: { type: String },
  };

  static getMetaConfig() {
    // plugin contract information
    return {
      controlName: 'Embedded AssureSign',
      fallbackDisableSubmit: false,
      description: 'IFrame component which can render AssureSign envelope',
      iconUrl: 'pen',
      groupName: 'Signature',
      version: '1.3',
      properties: {
        height: {
          type: 'string',
          title: 'Height',
          description: 'Height of the component',
          defaultValue: '1000px',
        },
        envelopeName: {
          type: 'string',
          title: 'Envelope Name',
          defaultValue: 'Envelope Name',
        },
        signerEmail: {
          type: 'string',
          title: 'Signer Email',
          defaultValue: 'john.armstrong@nintex.com',
        },
        signerName: {
          type: 'string',
          title: 'Signer Name',
          defaultValue: 'John Armstrong',
        },
        assureSignApiUsername: {
          type: 'string',
          title: 'AssureSign API Username',
          defaultValue: 'john.armstrong_u5eRugJO',
        },
        assureSignApiKey: {
          type: 'string',
          title: 'AssureSign API Password',
          defaultValue: '49FFVT9/6i5/R9OchwcZfessHkahXRnt',
        },
        assureSignApiUserEmail: {
          type: 'string',
          title: 'AssureSign API User Email',
          defaultValue: 'john.armstrong(demo)@nintex.com',
        },
        assureSignTemplateId: {
          type: 'string',
          title: 'AssureSign template Id',
          defaultValue: '2baecacb-fa5b-458c-973e-ae5801134b3e',
        },
        // envelopeIdOutput: {
        //   type: 'string',
        //   title: 'Envelope ID Outputers',
        //   isValueField: true,
        //   readOnly: true,
        // },
      },
      standardProperties: {},
      events: ['ntx-value-change'],
    };
  }

  async load() {
    const apiUserBody = {
      request: {
        apiUsername: this.assureSignApiUsername,
        key: this.assureSignApiKey,
        contextUsername: this.assureSignApiUserEmail,
        sessionLengthInMinutes: 60,
      },
    };

    const apiUserBodyString = JSON.stringify(apiUserBody);

    const response = await fetch(
      'https://account.assuresign.net/api/v3.7/authentication/apiUser',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: apiUserBodyString,
        // body: apiUserBody
      }
    );

    const jsonResponse = await response.json();
    const token = jsonResponse.result.token;

    const submitBody = {
      request: {
        placeholders: [],
        templates: [
          {
            templateID: this.assureSignTemplateId,
            values: [
              {
                name: 'Envelope Name 2 ',
                value: this.envelopeName,
              },
              {
                name: 'Language',
                value: 'en-US',
              },
              {
                name: 'New Employee Name',
                value: this.signerName,
              },
              {
                name: 'New Employee Email',
                value: this.signerEmail,
              },
            ],
          },
        ],
      },
    };

    const submit = await fetch(
      'https://www.assuresign.net/api/documentnow/v3.7/submit',
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitBody),
      }
    );

    const jsonSubmit = await submit.json();
    const envelopeId = jsonSubmit.result.envelopeID;

    const signingLinks = await fetch(
      'https://www.assuresign.net/api/documentnow/v3.7/envelope/' +
        envelopeId +
        '/signingLinks',
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
      }
    );

    const jsonSigningLinks = await signingLinks.json();

    let styles = { height: this.height };
    return html` <iframe
      class="frame"
      style=${styleMap(styles)}
      allow="geolocation *; microphone; camera"
      src=${jsonSigningLinks.result.signingLinks[0].url}
    ></iframe>`;
  }

  constructor() {
    super();
    (this.envelopeName = 'Envelope Name'), (this.height = '900px');
  }

  async connectedCallback() {
    super.connectedCallback();
    this.content = this.load();
  }

  // Render the UI as a function of component state
  render() {
    return html`${until(this.content, html`<span>Loading...</span>`)}`;
  }
}

// registering the web component.
const elementName = 'embedded-assuresign';
customElements.define(elementName, EmbeddedAssureSign);
