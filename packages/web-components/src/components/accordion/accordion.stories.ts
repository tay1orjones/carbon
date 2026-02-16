/**
 * Copyright IBM Corp. 2019, 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { html } from 'lit';
import { prefix } from '../../globals/settings';
import { ACCORDION_SIZE } from './accordion';
import './index';
import '../layer/index';
import '../../../.storybook/templates/with-layer';
import styles from './accordion.scss?lit';

const sizes = {
  [`Small size (${ACCORDION_SIZE.SMALL})`]: ACCORDION_SIZE.SMALL,
  [`Medium size (${ACCORDION_SIZE.MEDIUM})`]: ACCORDION_SIZE.MEDIUM,
  [`Large size (${ACCORDION_SIZE.LARGE})`]: ACCORDION_SIZE.LARGE,
};

const args = {
  alignment: 'END',
  disabled: false,
  isFlush: false,
  size: ACCORDION_SIZE.MEDIUM,
};

const storySections = [
  {
    title: 'Account overview',
    body: 'Review usage, active seats, and pending invitations so you understand what will change before updating the plan.',
  },
  {
    title: 'Billing and payments',
    body: 'Update the corporate card, add backup billing contacts, and download recent invoices for finance.',
  },
  {
    title: 'Email preferences',
    body: 'Choose which alerts need emails versus in-product notifications so the team only sees what matters.',
  },
  {
    title: 'Data exports',
    body: 'Schedule weekly CSV exports to your warehouse and confirm who receives a notification when a file is ready.',
  },
];

const argTypes = {
  alignment: {
    control: 'select',
    description:
      'Specify the alignment of the accordion heading title and chevron.',
    options: ['start', 'END'],
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
  onBeforeToggle: {
    action: `${prefix}-accordion-item-beingtoggled`,
    table: {
      disable: true,
    },
  },
  onToggle: {
    action: `${prefix}-accordion-item-toggled`,
    table: {
      disable: true,
    },
  },
};

export const Default = {
  args,
  argTypes,
  render: ({
    alignment,
    isFlush,
    size,
    disabled,
    onBeforeToggle,
    onToggle,
  }) => {
    return html`
      <cds-accordion
        alignment="${alignment}"
        size="${size}"
        ?isFlush="${isFlush}"
        ?disabled="${disabled}">
        ${storySections.map(
          ({ title, body }) => html`
            <cds-accordion-item
              title="${title}"
              @cds-accordion-item-beingtoggled="${onBeforeToggle}"
              @cds-accordion-item-toggled="${onToggle}">
              <p>${body}</p>
            </cds-accordion-item>
          `
        )}
      </cds-accordion>
    `;
  },
};

export const Controlled = {
  // This story doesn't accept any args.
  args,
  argTypes,
  render: ({
    alignment,
    isFlush,
    size,
    disabled,
    onBeforeToggle,
    onToggle,
  }) => {
    const toggleItems = (isOpen: boolean) => {
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

    return html`
      <style>
        ${styles}
      </style>
      <cds-button-set>
        <cds-button
          class="controlled-accordion-btn"
          @click=${() => toggleItems(true)}>
          Click to expand all
        </cds-button>
        <cds-button
          class="controlled-accordion-btn"
          @click=${() => toggleItems(false)}>
          Click to collapse all
        </cds-button>
      </cds-button-set>

      <cds-accordion
        alignment="${alignment}"
        size="${size}"
        ?isFlush="${isFlush}"
        ?disabled="${disabled}">
        ${storySections.map(
          ({ title, body }) => html`
            <cds-accordion-item
              controlled
              title="${title}"
              @cds-accordion-item-beingtoggled="${onBeforeToggle}"
              @cds-accordion-item-toggled="${onToggle}">
              <p>${body}</p>
            </cds-accordion-item>
          `
        )}
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
  args: {
    alignment: 'END',
    isFlush: false,
  },
  argTypes: {
    alignment: {
      control: 'select',
      description:
        'Specify the alignment of the accordion heading title and chevron.',
      options: ['start', 'END'],
    },
    isFlush: {
      control: 'boolean',
      description:
        'Specify whether Accordion text should be flush, default is false, does not work with align="start".',
    },
  },
  render: ({ alignment, isFlush }) => {
    return html`<cds-accordion-skeleton
      alignment="${alignment}"
      ?isFlush="${isFlush}"></cds-accordion-skeleton>`;
  },
};

export const WithLayer = {
  args,
  argTypes,
  render: ({
    alignment,
    isFlush,
    size,
    disabled,
    onBeforeToggle,
    onToggle,
  }) => {
    return html`
      <sb-template-layers>
        <cds-accordion
          alignment="${alignment}"
          size="${size}"
          ?isFlush="${isFlush}"
          ?disabled="${disabled}">
          <cds-accordion-item
            title="Section 1 title"
            @cds-accordion-item-beingtoggled="${onBeforeToggle}"
            @cds-accordion-item-toggled="${onToggle}">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </cds-accordion-item>
          <cds-accordion-item
            title="Section 2 title"
            @cds-accordion-item-beingtoggled="${onBeforeToggle}"
            @cds-accordion-item-toggled="${onToggle}">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </cds-accordion-item>
          <cds-accordion-item
            title="Section 3 title"
            @cds-accordion-item-beingtoggled="${onBeforeToggle}"
            @cds-accordion-item-toggled="${onToggle}">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </cds-accordion-item>
          <cds-accordion-item
            title="Section 4 title"
            @cds-accordion-item-beingtoggled="${onBeforeToggle}"
            @cds-accordion-item-toggled="${onToggle}">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </cds-accordion-item>
        </cds-accordion>
      </sb-template-layers>
    `;
  },
};

const meta = {
  title: 'Components/Accordion',
};

export default meta;
