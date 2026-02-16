/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable no-console */

import React from 'react';
import { action } from 'storybook/actions';
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
  ordered: {
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
  onHeadingClick: {
    action: 'onHeadingClick',
    control: false,
  },
};

const sharedArgs = {
  align: 'end',
  disabled: false,
  isFlush: false,
  ordered: false,
  size: 'md',
  onHeadingClick: ({ isOpen, event }) => {
    action('onHeadingClick')({
      isOpen,
      type: event.type,
    });
  },
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
    title: (
      <span>
        Data exports <em>(titles accept nodes)</em>
      </span>
    ),
    body: 'Schedule weekly CSV exports to your warehouse and confirm who receives a notification when a file is ready.',
  },
];

const renderItems = (onHeadingClick, itemProps = {}) =>
  storySections.map(({ title, body }, index) => (
    <AccordionItem
      key={`section-${index}`}
      title={title}
      onHeadingClick={onHeadingClick}
      {...itemProps}>
      <p>{body}</p>
    </AccordionItem>
  ));

export const Default = (args) => {
  const { onHeadingClick, ...restArgs } = args;
  return <Accordion {...restArgs}>{renderItems(onHeadingClick)}</Accordion>;
};

Default.args = { ...sharedArgs };

Default.argTypes = { ...sharedArgTypes };

export const Controlled = (args) => {
  const [expandAll, setExpandAll] = React.useState(false);
  const { onHeadingClick, ...restArgs } = args;

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

      <Accordion {...restArgs}>
        {renderItems(onHeadingClick, { open: expandAll })}
      </Accordion>
    </>
  );
};

Controlled.args = { ...sharedArgs };

Controlled.argTypes = { ...sharedArgTypes };

export const _WithLayer = (args) => {
  const { onHeadingClick, ...restArgs } = args;

  return (
    <WithLayer>
      <Accordion {...restArgs}>{renderItems(onHeadingClick)}</Accordion>
    </WithLayer>
  );
};

_WithLayer.args = { ...sharedArgs };

_WithLayer.argTypes = { ...sharedArgTypes };

export const Skeleton = (args) => (
  <AccordionSkeleton open count={4} {...args} />
);

Skeleton.decorators = [
  (story) => <div style={{ width: '500px' }}>{story()}</div>,
];

Skeleton.args = {
  align: 'end',
  isFlush: false,
  ordered: false,
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
    table: {
      disable: true,
    },
  },
  isFlush: {
    control: {
      type: 'boolean',
    },
  },
  size: {
    table: {
      disable: true,
    },
  },
};
