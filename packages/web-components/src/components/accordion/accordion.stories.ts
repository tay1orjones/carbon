/**
 * Copyright IBM Corp. 2019, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { html } from 'lit';
import { prefix } from '../../globals/settings';
import { ACCORDION_SIZE } from './accordion';
import './index';
import '../button/index';

const sizes = {
  [`Small size (${ACCORDION_SIZE.SMALL})`]: ACCORDION_SIZE.SMALL,
  [`Medium size (${ACCORDION_SIZE.MEDIUM})`]: ACCORDION_SIZE.MEDIUM,
  [`Large size (${ACCORDION_SIZE.LARGE})`]: ACCORDION_SIZE.LARGE,
};

const args = {
  alignment: 'end',
  disabled: false,
  isFlush: false,
  size: ACCORDION_SIZE.MEDIUM,
  disableToggle: false,
};

const argTypes = {
  alignment: {
    control: 'select',
    description:
      'Specify the alignment of the accordion heading title and chevron.',
    options: ['start', 'end'],
  },
  disabled: {
    control: 'boolean',
    description:
      'Specify whether an individual AccordionItem should be disabled.',
  },
  isFlush: {
    control: 'boolean',
    description:
      'Specify whether Accordion text should be flush, default is false, does not work with align="start".',
  },
  size: {
    control: 'select',
    description: 'Specify the size of the Accordion.',
    options: sizes,
  },
  disableToggle: {
    control: 'boolean',
    description: `Disable user-initiated toggle action (Call event.preventDefault() in ${prefix}-accordion-beingtoggled event).`,
  },
  onBeforeToggle: {
    action: `${prefix}-accordion-item-beingtoggled`,
  },
  onToggle: {
    action: `${prefix}-accordion-item-toggled`,
  },
};

export const Default = {
  args,
  argTypes,
  render: () => {
    return html`
      <cds-accordion>
        <cds-accordion-item title="Create an account">
          <p>
            Use your work email and a strong password to set up access. We’ll
            send a verification link that expires in 30 minutes to keep things
            secure.
          </p>
        </cds-accordion-item>
        <cds-accordion-item title="Choose delivery speed">
          <p>
            Decide between standard (3–5 business days) or express (next
            business day). Cutoff for express orders is 5:00 p.m. local time.
          </p>
        </cds-accordion-item>
        <cds-accordion-item title="Add payment method">
          <p>
            Save a corporate card or purchase order number. Billing contacts can
            be updated later from your account settings without re-entering card
            details.
          </p>
        </cds-accordion-item>
        <cds-accordion-item title="Review and confirm">
          <p>
            Double-check the shipping address, contact phone, and any delivery
            notes. We’ll email a receipt and tracking link once you submit the
            order.
          </p>
        </cds-accordion-item>
      </cds-accordion>
    `;
  },
};

export const Controlled = {
  // This story doesn't accept any args.
  args: {},
  argTypes: {},
  render: () => {
    return html`
      <script>
        const toggleItems = (isOpen) => {
          document
            .querySelectorAll('cds-accordion-item[controlled]')
            .forEach((item) => {
              if (isOpen) {
                item.setAttribute('open', '');
              } else {
                item.removeAttribute('open');
              }
            });
        };
      </script>
      <cds-button onclick="toggleItems(true)">Click to expand all</cds-button>
      <cds-button onclick="toggleItems(false)"
        >Click to collapse all</cds-button
      >

      <cds-accordion>
        <cds-accordion-item controlled title="Create an account">
          <p>
            Use your work email and a strong password to set up access. We’ll
            send a verification link that expires in 30 minutes to keep things
            secure.
          </p>
        </cds-accordion-item>
        <cds-accordion-item controlled title="Choose delivery speed">
          <p>
            Decide between standard (3–5 business days) or express (next
            business day). Cutoff for express orders is 5:00 p.m. local time.
          </p>
        </cds-accordion-item>
        <cds-accordion-item controlled title="Add payment method">
          <p>
            Save a corporate card or purchase order number. Billing contacts can
            be updated later from your account settings without re-entering card
            details.
          </p>
        </cds-accordion-item>
        <cds-accordion-item controlled title="Review and confirm">
          <p>
            Double-check the shipping address, contact phone, and any delivery
            notes. We’ll email a receipt and tracking link once you submit the
            order.
          </p>
        </cds-accordion-item>
      </cds-accordion>
    `;
  },
};

export const Skeleton = {
  decorators: [(story) => html`<div style="width: 500px">${story()}</div>`],
  parameters: {
    percy: {
      skip: true,
    },
  },
  render: () => {
    return html`<cds-accordion-skeleton></cds-accordion-skeleton>`;
  },
};

const meta = {
  title: 'Components/Accordion',
};

export default meta;
