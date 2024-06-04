// import { Meta, StoryFn } from '@storybook/web-components';
import { html } from 'lit';

import './embedded-assuresign';
// import { EmbeddedAssureSign } from './embedded-assuresign';

export default {
  title: 'Embedded eSign',
  component: 'embedded-assuresign',
};

const Template = ({ 
  src,
  content,
  envelopeName, 
  height,
  signerName,
  signerEmail,
  assureSignApiUsername,
  assureSignApiKey,
  assureSignApiUserEmail,
  assureSignTemplateId
 }) => {
  return html`<embedded-assuresign
    .src=${src}
    .content=${content}
    .envelopeName=${envelopeName}
    .height=${height}
    .signerName=${signerName}
    .signerEmail=${signerEmail}
    .assureSignApiUsername=${assureSignApiUsername}
    .assureSignApiKey=${assureSignApiKey}
    .assureSignApiUserEmail=${assureSignApiUserEmail}
    .assureSignTemplateId=${assureSignTemplateId}
    >
  </embedded-assuresign>`;
};

export const Base = Template.bind({});
Base.args = {
  envelopeName: 'Envelope Name',
  height: '1000px',
  signerName: 'John Armstrong',
  signerEmail: 'john.armstrong@nintex.com',
  assureSignApiUsername: 'john.armstrong_u5eRugJO',
  assureSignApiKey: '49FFVT9/6i5/R9OchwcZfessHkahXRnt',
  assureSignApiUserEmail: 'john.armstrong(demo)@nintex.com',
  assureSignTemplateId: '2baecacb-fa5b-458c-973e-ae5801134b3e'
};
