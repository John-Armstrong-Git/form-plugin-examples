import { html } from 'lit';

import './embed-iqpro';

export default {
  title: 'Embedded iQPro Tokenizer',
  component: 'embed-iqpro',
};

const Template = ({ apiKey }) => {
  return html`<embed-iqpro .apiKey=${apiKey}></embed-iqpro>`;
};

export const Base = Template.bind({});
Base.args = {
  apiKey: 'pub_2hCCCdzZeitXyBY16cLCXFzpJHO',
};
