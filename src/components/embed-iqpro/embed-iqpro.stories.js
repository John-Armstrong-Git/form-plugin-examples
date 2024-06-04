import { html } from 'lit';

import './embed-iqpro';

export default {
  title: 'Embedded iQPro Tokenizer',
  component: 'embed-iqpro',
};

const Template = ({ height, url, apikey }) => {
  return html`<embed-iqpro .height=${height} .url=${url} .apikey=${apikey}>
  </embed-iqpro>`;
};

export const Base = Template.bind({});
Base.args = {
  height: '1000px',
  url: 'localhost',
  apikey: 'pub_2hCCCdzZeitXyBY16cLCXFzpJHO',
};
