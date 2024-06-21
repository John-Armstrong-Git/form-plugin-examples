import { html } from 'lit';

import './embed-iqpro';

export default {
  title: 'Embedded iQPro Tokenizer',
  component: 'embed-iqpro',
};

const Template = ({ apikey }) => {
  return html`<embed-iqpro .apikey=${apikey}></embed-iqpro>`;
};

export const Base = Template.bind({});
Base.args = {
  apikey: 'pub_2hCCCdzZeitXyBY16cLCXFzpJHO',
};
