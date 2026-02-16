/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable no-console */

import React from 'react';
import './story.scss';
import { default as Accordion, AccordionItem, AccordionSkeleton } from '.';
import Button from '../Button';
import ButtonSet from '../ButtonSet';
import mdx from './Accordion.mdx';
import { WithLayer } from '../../../.storybook/templates/WithLayer';

export default {
  title: 'Components/Accordion',
  component: Accordion,
  subcomponents: {
    AccordionItem,
    AccordionSkeleton,
  },
  parameters: {
    docs: {
      page: mdx,
    },
  },
};

const sharedArgTypes = {
  align: {
    options: ['start', 'end'],
    control: { type: 'select' },
  },
  children: {
    control: false,
  },
  className: {
    control: false,
  },
  disabled: {
    control: {
      type: 'boolean',
    },
  },
  isFlush: {
    control: {
      type: 'boolean',
    },
  },
  size: {
    options: ['sm', 'md', 'lg'],
    control: { type: 'select' },
  },
};

export const Default = (args) => (
  <Accordion {...args}>
    <AccordionItem title="Create an account">
      <p>
        Use your work email and a strong password to set up access. We’ll send a
        verification link that expires in 30 minutes to keep things secure.
      </p>
    </AccordionItem>
    <AccordionItem title="Choose delivery speed">
      <p>
        Decide between standard (3–5 business days) or express (next business
        day). Cutoff for express orders is 5:00 p.m. local time.
      </p>
    </AccordionItem>
    <AccordionItem title="Add payment method">
      <p>
        Save a corporate card or purchase order number. Billing contacts can be
        updated later from your account settings without re-entering card
        details.
      </p>
    </AccordionItem>
    <AccordionItem
      title={
        <span>
          Review and confirm (<em>the title can be a node</em>)
        </span>
      }>
      <p>
        Double-check the shipping address, contact phone, and any delivery
        notes. We’ll email a receipt and tracking link once you submit the
        order.
      </p>
    </AccordionItem>
  </Accordion>
);

Default.args = {
  disabled: false,
  isFlush: false,
};

Default.argTypes = { ...sharedArgTypes };

export const Controlled = (args) => {
  const [expandAll, setExpandAll] = React.useState(false);
  return (
    <>
      <ButtonSet className={'controlled-accordion-btnset'}>
        <Button
          className={'controlled-accordion-btn'}
          onClick={() => {
            expandAll === true ? setExpandAll(1) : setExpandAll(true);
          }}>
          Click to expand all
        </Button>
        <Button
          className={'controlled-accordion-btn'}
          onClick={() => {
            expandAll || expandAll === null
              ? setExpandAll(false)
              : setExpandAll(null);
          }}>
          Click to collapse all
        </Button>
      </ButtonSet>

      <Accordion {...args}>
        <AccordionItem title="Create an account" open={expandAll}>
          <p>
            Use your work email and a strong password to set up access. We’ll
            send a verification link that expires in 30 minutes to keep things
            secure.
          </p>
        </AccordionItem>
        <AccordionItem title="Choose delivery speed" open={expandAll}>
          <p>
            Decide between standard (3–5 business days) or express (next
            business day). Cutoff for express orders is 5:00 p.m. local time.
          </p>
        </AccordionItem>
        <AccordionItem title="Add payment method" open={expandAll}>
          <p>
            Save a corporate card or purchase order number. Billing contacts can
            be updated later from your account settings without re-entering card
            details.
          </p>
        </AccordionItem>
        <AccordionItem title="Review and confirm" open={expandAll}>
          <p>
            Double-check the shipping address, contact phone, and any delivery
            notes. We’ll email a receipt and tracking link once you submit the
            order.
          </p>
        </AccordionItem>
      </Accordion>
    </>
  );
};

Controlled.args = {
  disabled: false,
  isFlush: false,
};

Controlled.argTypes = { ...sharedArgTypes };

export const _WithLayer = (args) => {
  return (
    <WithLayer {...args}>
      <Accordion>
        <AccordionItem title="Create an account">
          <p>
            Use your work email and a strong password to set up access. We’ll
            send a verification link that expires in 30 minutes to keep things
            secure.
          </p>
        </AccordionItem>
        <AccordionItem title="Choose delivery speed">
          <p>
            Decide between standard (3–5 business days) or express (next
            business day). Cutoff for express orders is 5:00 p.m. local time.
          </p>
        </AccordionItem>
        <AccordionItem title="Add payment method">
          <p>
            Save a corporate card or purchase order number. Billing contacts can
            be updated later from your account settings without re-entering card
            details.
          </p>
        </AccordionItem>
        <AccordionItem title="Review and confirm">
          <p>
            Double-check the shipping address, contact phone, and any delivery
            notes. We’ll email a receipt and tracking link once you submit the
            order.
          </p>
        </AccordionItem>
      </Accordion>
    </WithLayer>
  );
};

WithLayer.args = {
  disabled: false,
  isFlush: false,
};

WithLayer.argTypes = { ...sharedArgTypes };

export const Skeleton = (args) => (
  <AccordionSkeleton open count={4} {...args} />
);

Skeleton.decorators = [
  (story) => <div style={{ width: '500px' }}>{story()}</div>,
];

Skeleton.args = {
  isFlush: false,
};

Skeleton.argTypes = {
  align: {
    options: ['start', 'end'],
    control: { type: 'select' },
  },
  children: {
    control: false,
  },
  className: {
    control: false,
  },
  disabled: {
    control: false,
  },
  isFlush: {
    control: {
      type: 'boolean',
    },
  },
  size: {
    control: false,
  },
};
