/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import TextInput from '../TextInput';
import { PasswordInput } from '../PasswordInput';
import { usePrefix } from '../../internal/usePrefix';
import { FormContext } from '../FluidForm/FormContext';

export interface FluidTextInputProps {
  /**
   * Specify an optional className to be applied to the outer FluidForm wrapper
   */
  className?: string;

  /**
   * Optionally provide the default value of the `<input>`
   */
  defaultValue?: string | number;

  /**
   * Specify whether the `<input>` should be disabled
   */
  disabled?: boolean;

  /**
   * Specify a custom `id` for the `<input>`
   */
  id: string;

  /**
   * Specify whether the control is currently invalid
   */
  invalid?: boolean;

  /**
   * Provide the text that is displayed when the control is in an invalid state
   */
  invalidText?: React.ReactNode;

  /**
   * Specify whether the control is a password input
   */
  isPassword?: boolean;

  /**
   * Max character count allowed for the textInput. This is needed in order for enableCounter to display
   */
  maxCount?: number;

  /**
   * Specify whether to display the character counter
   */
  enableCounter?: boolean;

  /**
   * Provide the text that will be read by a screen reader when visiting this
   * control
   */
  labelText: React.ReactNode;

  /**
   * Optionally provide an `onChange` handler that is called whenever `<input>`
   * is updated
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /**
   * Optionally provide an `onClick` handler that is called whenever the
   * `<input>` is clicked
   */
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;

  /**
   * Specify the placeholder attribute for the `<input>`
   */
  placeholder?: string;

  /**
   * Specify the value of the `<input>`
   */
  value?: string | number;

  /**
   * Specify whether the control is currently in warning state
   */
  warn?: boolean;

  /**
   * Provide the text that is displayed when the control is in warning state
   */
  warnText?: React.ReactNode;

  /**
   * Whether or not the component is readonly
   */
  readOnly?: boolean;
}

const FluidTextInput = React.forwardRef<HTMLInputElement, FluidTextInputProps>(
  function FluidTextInput({ className, isPassword, ...other }, ref) {
    const prefix = usePrefix();
    const classNames = classnames(className, {
      [`${prefix}--text-input--fluid`]: !isPassword,
    });

    return (
      <FormContext.Provider value={{ isFluid: true }}>
        {isPassword ? (
          <PasswordInput className={classNames} ref={ref} {...other} />
        ) : (
          <TextInput className={classNames} ref={ref} {...other} />
        )}
      </FormContext.Provider>
    );
  }
);

FluidTextInput.propTypes = {
  /**
   * Specify an optional className to be applied to the outer FluidForm wrapper
   */
  className: PropTypes.string,

  /**
   * Optionally provide the default value of the `<input>`
   */
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  /**
   * Specify whether the `<input>` should be disabled
   */
  disabled: PropTypes.bool,

  /**
   * Specify a custom `id` for the `<input>`
   */
  id: PropTypes.string.isRequired,

  /**
   * Specify whether the control is currently invalid
   */
  invalid: PropTypes.bool,

  /**
   * Provide the text that is displayed when the control is in an invalid state
   */
  invalidText: PropTypes.node,

  /**
   * Specify whether the control is a password input
   */
  isPassword: PropTypes.bool,

  /**
   * Max character count allowed for the textInput. This is needed in order for enableCounter to display
   */
  maxCount: PropTypes.number,

  /**
   * Specify whether to display the character counter
   */
  enableCounter: PropTypes.bool,

  /**
   * Provide the text that will be read by a screen reader when visiting this
   * control
   */
  labelText: PropTypes.node.isRequired,

  /**
   * Optionally provide an `onChange` handler that is called whenever `<input>`
   * is updated
   */
  onChange: PropTypes.func,

  /**
   * Optionally provide an `onClick` handler that is called whenever the
   * `<input>` is clicked
   */
  onClick: PropTypes.func,

  /**
   * Specify the placeholder attribute for the `<input>`
   */
  placeholder: PropTypes.string,

  /**
   * Specify the value of the `<input>`
   */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  /**
   * Specify whether the control is currently in warning state
   */
  warn: PropTypes.bool,

  /**
   * Provide the text that is displayed when the control is in warning state
   */
  warnText: PropTypes.node,

  /**
   * Whether or not the component is readonly
   */
  readOnly: PropTypes.bool,
};

export default FluidTextInput;
