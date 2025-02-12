/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState } from 'react';
import { render, screen, within, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  findListBoxNode,
  assertMenuOpen,
  assertMenuClosed,
  generateItems,
  generateGenericItem,
  cognateItems,
  waitForPosition,
} from '../ListBox/test-helpers';
import ComboBox from '../ComboBox';
import { AILabel } from '../AILabel';

const findInputNode = () => screen.getByRole('combobox');
const openMenu = async () => {
  await userEvent.click(screen.getByRole('combobox'));
};

const prefix = 'cds';

const ControlledComboBox = ({ controlledItem }) => {
  const items = generateItems(5, generateGenericItem);
  const [value, setValue] = useState(controlledItem || items[0]);
  const [onChangeCallCount, setOnChangeCallCount] = useState(0);
  const controlledOnChange = ({ selectedItem }) => {
    setValue(selectedItem);
    setOnChangeCallCount((prevCount) => prevCount + 1);
  };

  return (
    <div>
      <ComboBox
        id="test-combobox"
        items={items}
        selectedItem={value}
        onChange={controlledOnChange}
        placeholder="Filter..."
        type="default"
      />
      <div>value: {value?.label || 'none'}</div>
      <div>onChangeCallCount: {onChangeCallCount}</div>
      <button onClick={() => setValue(items[3])}>Choose item 3</button>
      <button onClick={() => setValue(null)}>reset</button>
    </div>
  );
};

describe('ComboBox', () => {
  let mockProps;
  window.HTMLElement.prototype.scrollIntoView = function () {};
  beforeEach(() => {
    mockProps = {
      id: 'test-combobox',
      items: generateItems(5, generateGenericItem),
      onChange: jest.fn(),
      placeholder: 'Filter...',
      type: 'default',
    };
  });

  it('should display the menu of items when a user clicks on the input', async () => {
    render(<ComboBox {...mockProps} />);

    await userEvent.click(findInputNode());

    assertMenuOpen(mockProps);
  });

  it('should call `onChange` each time an item is selected', async () => {
    render(<ComboBox {...mockProps} />);
    expect(mockProps.onChange).not.toHaveBeenCalled();

    for (let i = 0; i < mockProps.items.length; i++) {
      await openMenu();

      await userEvent.click(screen.getAllByRole('option')[i]);

      expect(mockProps.onChange).toHaveBeenCalledTimes(i + 1);
      expect(mockProps.onChange).toHaveBeenCalledWith({
        selectedItem: mockProps.items[i],
      });
    }
  });

  it('should call `onChange` when selection is cleared', async () => {
    render(<ComboBox {...mockProps} />);
    expect(mockProps.onChange).not.toHaveBeenCalled();
    await openMenu();
    await userEvent.click(screen.getAllByRole('option')[0]);
    expect(mockProps.onChange).toHaveBeenCalledTimes(1);
    await userEvent.click(
      screen.getByRole('button', { name: 'Clear selected item' })
    );
    expect(mockProps.onChange).toHaveBeenCalledTimes(2);
  });

  it('should call `onChange` with the proper item when `shouldFilterItem` is provided', async () => {
    const filterItems = (menu) => {
      return menu?.item?.label
        ?.toLowerCase()
        .includes(menu?.inputValue?.toLowerCase());
    };
    const onInputChange = jest.fn();

    render(
      <ComboBox
        {...mockProps}
        shouldFilterItem={filterItems}
        onInputChange={onInputChange}
      />
    );

    await userEvent.type(findInputNode(), 'Item 2');
    expect(onInputChange).toHaveBeenCalledWith('Item 2');

    await userEvent.click(screen.getAllByRole('option')[0]);
    expect(mockProps.onChange).toHaveBeenCalledTimes(1);
    expect(mockProps.onChange).toHaveBeenCalledWith({
      selectedItem: mockProps.items[2],
    });
  });

  it('should display titleText', () => {
    render(<ComboBox {...mockProps} titleText="Combobox title" />);

    expect(screen.getByText('Combobox title')).toBeInTheDocument();
  });

  it('should confirm custom aria-label is on the input', () => {
    render(<ComboBox {...mockProps} aria-label="custom aria-label" />);

    expect(screen.getByRole('combobox')).toHaveAttribute(
      'aria-label',
      'custom aria-label'
    );
  });

  it('should select the correct item from the filtered list after text input on click', async () => {
    const user = userEvent.setup();

    render(<ComboBox {...mockProps} items={cognateItems} />);

    await user.type(findInputNode(), 'struct');

    await user.click(screen.getAllByRole('option')[1]);

    expect(mockProps.onChange).toHaveBeenCalledTimes(1);
    expect(mockProps.onChange).toHaveBeenCalledWith({
      selectedItem: {
        id: 'construct',
        text: 'Construct',
      },
    });
  });

  it('should select the correct item from the filtered list after text input on [Enter]', async () => {
    const user = userEvent.setup();

    render(<ComboBox {...mockProps} items={cognateItems} />);

    await user.type(findInputNode(), 'struct');

    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('[Enter]');

    expect(mockProps.onChange).toHaveBeenCalledTimes(1);
    expect(mockProps.onChange).toHaveBeenCalledWith({
      selectedItem: {
        id: 'construct',
        text: 'Construct',
      },
    });
  });

  it('capture filter text event onInputChange', async () => {
    const onInputChange = jest.fn();
    render(<ComboBox {...mockProps} onInputChange={onInputChange} />);

    await userEvent.type(findInputNode(), 'something');

    expect(onInputChange).toHaveBeenCalledWith('something');
  });

  it('should render custom item components', async () => {
    const itemToElement = jest.fn((item) => {
      return <div className="mock-item">{item.text}</div>;
    });
    render(<ComboBox {...mockProps} itemToElement={itemToElement} />);
    await openMenu();

    expect(itemToElement).toHaveBeenCalled();
  });

  it('should let the user select an option by clicking on the option node', async () => {
    render(<ComboBox {...mockProps} />);
    await openMenu();

    await userEvent.click(screen.getAllByRole('option')[0]);

    expect(mockProps.onChange).toHaveBeenCalledTimes(1);
    expect(mockProps.onChange).toHaveBeenCalledWith({
      selectedItem: mockProps.items[0],
    });
    assertMenuClosed();

    mockProps.onChange.mockClear();

    await openMenu();

    await userEvent.click(screen.getAllByRole('option')[1]);
    expect(mockProps.onChange).toHaveBeenCalledTimes(1);
    expect(mockProps.onChange).toHaveBeenCalledWith({
      selectedItem: mockProps.items[1],
    });
    expect(screen.getByRole('combobox')).toHaveDisplayValue('Item 1');
  });

  it('should not let the user select an option by clicking on the disabled option node', async () => {
    mockProps.items[2].disabled = true;

    render(<ComboBox {...mockProps} />);
    await openMenu();

    await userEvent.click(screen.getAllByRole('option')[2]);

    expect(mockProps.onChange).not.toHaveBeenCalled();
  });

  it('should not select the disabled option if user type in input and press enter', async () => {
    mockProps.items[2].disabled = true;

    render(<ComboBox {...mockProps} />);
    await userEvent.type(findInputNode(), 'Item 2');
    await userEvent.keyboard('[Enter]');

    expect(mockProps.onChange).not.toHaveBeenCalled();
    //it should not close the menu if matching element not found and enter is pressed.
    expect(findListBoxNode()).toHaveClass(`${prefix}--list-box--expanded`);
  });

  it('should retain value if custom value is entered and `allowCustomValue` is set', async () => {
    render(<ComboBox {...mockProps} allowCustomValue />);

    expect(findInputNode()).toHaveDisplayValue('');

    await userEvent.type(findInputNode(), 'Apple');
    // Should close menu and keep value in input, even though it is not in the item list
    await userEvent.keyboard('[Enter]');
    assertMenuClosed();
    expect(findInputNode()).toHaveDisplayValue('Apple');
    // Should retain value on blur
    await userEvent.keyboard('[Tab]');
    expect(findInputNode()).toHaveDisplayValue('Apple');
  });

  it('should handle InputBlur with allowCustomValue', async () => {
    render(<ComboBox {...mockProps} allowCustomValue />);
    await userEvent.type(findInputNode(), 'Apple');
    fireEvent.blur(findInputNode());
    expect(findInputNode()).toHaveDisplayValue('Apple');
  });

  it('should apply onChange value if custom value is entered and `allowCustomValue` is set', async () => {
    render(<ComboBox {...mockProps} allowCustomValue />);

    expect(findInputNode()).toHaveDisplayValue('');

    await userEvent.type(findInputNode(), 'Apple');
    await userEvent.keyboard('[Enter]');
    assertMenuClosed();
    expect(mockProps.onChange).toHaveBeenCalledWith({
      inputValue: 'Apple',
      selectedItem: null,
    });
  });

  it('should respect slug prop', async () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(
      <ComboBox {...mockProps} slug={<AILabel />} />
    );
    await waitForPosition();
    expect(container.firstChild).toHaveClass(
      `${prefix}--list-box__wrapper--slug`
    );
    spy.mockRestore();
  });

  it('should respect decorator prop', async () => {
    const { container } = render(
      <ComboBox {...mockProps} decorator={<AILabel />} />
    );
    await waitForPosition();
    expect(container.firstChild).toHaveClass(
      `${prefix}--list-box__wrapper--decorator`
    );
  });

  describe('should display initially selected item found in `initialSelectedItem`', () => {
    it('using an object type for the `initialSelectedItem` prop', async () => {
      render(
        <ComboBox {...mockProps} initialSelectedItem={mockProps.items[0]} />
      );
      await waitForPosition();
      expect(findInputNode()).toHaveDisplayValue(mockProps.items[0].label);
    });

    it('using a string type for the `initialSelectedItem` prop', async () => {
      // Replace the 'items' property in mockProps with a list of strings
      mockProps = {
        ...mockProps,
        items: ['1', '2', '3'],
      };

      render(
        <ComboBox {...mockProps} initialSelectedItem={mockProps.items[1]} />
      );
      await waitForPosition();
      expect(findInputNode()).toHaveDisplayValue(mockProps.items[1]);
    });
  });

  describe('provided `selectedItem`', () => {
    it('should display selected item using an object type for the `selectedItem` prop', async () => {
      render(<ComboBox {...mockProps} selectedItem={mockProps.items[0]} />);
      await waitForPosition();
      expect(findInputNode()).toHaveDisplayValue(mockProps.items[0].label);
    });

    it('should display selected item using a string type for the `selectedItem` prop', async () => {
      // Replace the 'items' property in mockProps with a list of strings
      mockProps = {
        ...mockProps,
        items: ['1', '2', '3'],
      };

      render(<ComboBox {...mockProps} selectedItem={mockProps.items[1]} />);
      await waitForPosition();
      expect(findInputNode()).toHaveDisplayValue(mockProps.items[1]);
    });
    it('should update and call `onChange` once when selection is updated from the combobox', async () => {
      render(<ComboBox {...mockProps} selectedItem={mockProps.items[0]} />);
      expect(mockProps.onChange).not.toHaveBeenCalled();
      await openMenu();
      await userEvent.click(screen.getByRole('option', { name: 'Item 2' }));
      expect(mockProps.onChange).toHaveBeenCalledTimes(1);
      expect(
        screen.getByRole('combobox', { value: 'Item 2' })
      ).toBeInTheDocument();
    });
    it('should not call `onChange` when current selection is selected again', async () => {
      render(<ComboBox {...mockProps} selectedItem={mockProps.items[0]} />);
      expect(mockProps.onChange).not.toHaveBeenCalled();
      await openMenu();
      await userEvent.click(screen.getByRole('option', { name: 'Item 0' }));
      expect(mockProps.onChange).toHaveBeenCalledTimes(0);
      expect(
        screen.getByRole('combobox', { value: 'Item 0' })
      ).toBeInTheDocument();
    });
    it('should update and call `onChange` once when selection is updated from the combobox and the external state managing selectedItem is updated', async () => {
      render(<ControlledComboBox />);
      expect(screen.getByText('onChangeCallCount: 0')).toBeInTheDocument();
      await openMenu();
      await userEvent.click(screen.getByRole('option', { name: 'Item 2' }));
      expect(screen.getByText('onChangeCallCount: 1')).toBeInTheDocument();
      expect(screen.getByText('value: Item 2')).toBeInTheDocument();
      expect(
        screen.getByRole('combobox', { value: 'Item 2' })
      ).toBeInTheDocument();
    });
    it('should update and call `onChange` once when selection is cleared from the combobox and the external state managing selectedItem is updated', async () => {
      render(<ControlledComboBox />);
      expect(screen.getByText('onChangeCallCount: 0')).toBeInTheDocument();
      await openMenu();
      await userEvent.click(screen.getByRole('option', { name: 'Item 2' }));
      expect(screen.getByText('onChangeCallCount: 1')).toBeInTheDocument();
      await userEvent.click(
        screen.getByRole('button', { name: 'Clear selected item' })
      );
      expect(screen.getByText('onChangeCallCount: 2')).toBeInTheDocument();
      expect(screen.getByText('value: none')).toBeInTheDocument();
      expect(findInputNode()).toHaveDisplayValue('');
    });
    it('should update and call `onChange` once when selection is cleared from the combobox after an external update is made, and the external state managing selectedItem is updated', async () => {
      render(<ControlledComboBox />);
      expect(screen.getByText('onChangeCallCount: 0')).toBeInTheDocument();
      await openMenu();
      await userEvent.click(
        screen.getByRole('button', { name: 'Choose item 3' })
      );
      expect(screen.getByText('onChangeCallCount: 1')).toBeInTheDocument();
      await userEvent.click(
        screen.getByRole('button', { name: 'Clear selected item' })
      );
      expect(screen.getByText('onChangeCallCount: 2')).toBeInTheDocument();
      expect(screen.getByText('value: none')).toBeInTheDocument();
      expect(findInputNode()).toHaveDisplayValue('');
    });
    it('should update and call `onChange` when a combination of external and combobox selections are made', async () => {
      render(<ControlledComboBox />);
      expect(screen.getByText('onChangeCallCount: 0')).toBeInTheDocument();
      await userEvent.click(
        screen.getByRole('button', { name: 'Choose item 3' })
      );
      expect(screen.getByText('onChangeCallCount: 1')).toBeInTheDocument();
      expect(findInputNode()).toHaveDisplayValue('Item 3');
      expect(screen.getByText('value: Item 3')).toBeInTheDocument();
      await openMenu();
      await userEvent.click(screen.getByRole('option', { name: 'Item 2' }));
      expect(screen.getByText('onChangeCallCount: 2')).toBeInTheDocument();
      expect(findInputNode()).toHaveDisplayValue('Item 2');
      expect(screen.getByText('value: Item 2')).toBeInTheDocument();
      await userEvent.click(
        screen.getByRole('button', { name: 'Clear selected item' })
      );
      expect(screen.getByText('onChangeCallCount: 3')).toBeInTheDocument();
      expect(screen.getByText('value: none')).toBeInTheDocument();
      expect(findInputNode()).toHaveDisplayValue('');
    });
    it('should update and call `onChange` once when selection is updated externally', async () => {
      const { rerender } = render(
        <ComboBox {...mockProps} selectedItem={mockProps.items[0]} />
      );
      expect(findInputNode()).toHaveDisplayValue(mockProps.items[0].label);
      rerender(<ComboBox {...mockProps} selectedItem={mockProps.items[1]} />);
      expect(findInputNode()).toHaveDisplayValue(mockProps.items[1].label);
      expect(mockProps.onChange).toHaveBeenCalledTimes(1);
    });
    it('should clear selected item and call `onChange` when selection is cleared externally', async () => {
      render(<ControlledComboBox />);
      expect(screen.getByText('onChangeCallCount: 0')).toBeInTheDocument();
      await openMenu();
      await userEvent.click(screen.getByRole('option', { name: 'Item 2' }));
      await userEvent.click(screen.getByRole('button', { name: 'reset' }));
      expect(screen.getByText('onChangeCallCount: 2')).toBeInTheDocument();
      expect(screen.getByText('value: none')).toBeInTheDocument();
      expect(findInputNode()).toHaveDisplayValue('');
    });
    it('should clear selected item when `selectedItem` is updated to `null` externally', async () => {
      const { rerender } = render(
        <ComboBox {...mockProps} selectedItem={mockProps.items[1]} />
      );
      await waitForPosition();
      expect(findInputNode()).toHaveDisplayValue(mockProps.items[1].label);
      rerender(<ComboBox {...mockProps} selectedItem={null} />);
      await waitForPosition();
      expect(findInputNode()).toHaveDisplayValue('');
      expect(mockProps.onChange).toHaveBeenCalled();
    });
  });

  describe('when disabled', () => {
    it('should not let the user edit the input node', async () => {
      render(<ComboBox {...mockProps} disabled={true} />);
      await waitForPosition();
      expect(findInputNode()).toHaveAttribute('disabled');

      expect(findInputNode()).toHaveDisplayValue('');

      await userEvent.type(findInputNode(), 'a');

      expect(findInputNode()).toHaveDisplayValue('');
    });

    it('should not let the user expand the menu', async () => {
      render(<ComboBox {...mockProps} disabled={true} />);
      await waitForPosition();
      await openMenu();
      expect(findListBoxNode()).not.toHaveClass(
        `${prefix}--list-box--expanded`
      );
    });
  });

  describe('when readonly', () => {
    it('should not let the user edit the input node', async () => {
      render(<ComboBox {...mockProps} readOnly={true} />);
      await waitForPosition();
      expect(findInputNode()).toHaveAttribute('readonly');

      expect(findInputNode()).toHaveDisplayValue('');

      await userEvent.type(findInputNode(), 'o');

      expect(findInputNode()).toHaveDisplayValue('');
    });

    it('should not let the user expand the menu', async () => {
      render(<ComboBox {...mockProps} disabled={true} />);
      await waitForPosition();
      await openMenu();
      expect(findListBoxNode()).not.toHaveClass(
        `${prefix}--list-box--expanded`
      );
    });
  });

  describe('downshift quirks', () => {
    it('should set `inputValue` to an empty string if a false-y value is given', async () => {
      render(<ComboBox {...mockProps} />);
      await waitForPosition();
      expect(findInputNode()).toHaveDisplayValue('');
    });

    it('should only render one listbox at a time when multiple comboboxes are present', async () => {
      render(
        <>
          <div data-testid="combobox-1">
            <ComboBox {...mockProps} id="combobox-1" />
          </div>
          <div data-testid="combobox-2">
            <ComboBox {...mockProps} id="combobox-2" />
          </div>
        </>
      );
      await waitForPosition();
      const firstCombobox = screen.getByTestId('combobox-1');
      const secondCombobox = screen.getByTestId('combobox-2');

      const firstComboboxChevron = within(firstCombobox).getByRole('button');
      const secondComboboxChevron = within(secondCombobox).getByRole('button');

      function firstListBox() {
        return within(firstCombobox).getByRole('listbox');
      }

      function secondListBox() {
        return within(secondCombobox).getByRole('listbox');
      }

      expect(firstListBox()).toBeEmptyDOMElement();
      expect(secondListBox()).toBeEmptyDOMElement();

      await userEvent.click(firstComboboxChevron);

      expect(firstListBox()).not.toBeEmptyDOMElement();
      expect(secondListBox()).toBeEmptyDOMElement();

      await userEvent.click(secondComboboxChevron);

      expect(firstListBox()).toBeEmptyDOMElement();
      expect(secondListBox()).not.toBeEmptyDOMElement();

      await userEvent.click(secondComboboxChevron);

      expect(firstListBox()).toBeEmptyDOMElement();
      expect(secondListBox()).toBeEmptyDOMElement();
    });
    it('should open menu without moving focus on pressing Alt+ DownArrow', async () => {
      render(<ComboBox {...mockProps} />);
      await waitForPosition();
      act(() => {
        screen.getByRole('combobox').focus();
      });
      await userEvent.keyboard('{Alt>}{ArrowDown}');
      assertMenuOpen(mockProps);
    });

    it('should close menu and return focus to combobox on pressing Alt+ UpArrow', async () => {
      render(<ComboBox {...mockProps} />);
      await waitForPosition();
      await openMenu();
      await userEvent.keyboard('{Alt>}{ArrowUp}');
      assertMenuClosed(mockProps);
    });
  });

  describe('Highlights', () => {
    it('should highlight the matched element', async () => {
      render(<ComboBox {...mockProps} allowCustomValue={false} />);
      await userEvent.type(findInputNode(), '1');
      expect(screen.getAllByRole('option')[1]).toHaveClass(
        'cds--list-box__menu-item'
      );
    });

    it('should highlight the selected element', async () => {
      render(<ComboBox {...mockProps} allowCustomValue={false} />);
      await openMenu();
      await userEvent.type(findInputNode(), 'Item 1');
      await userEvent.keyboard('[Enter]');
      await openMenu();
      expect(screen.getAllByRole('option')[1]).toHaveClass(
        'cds--list-box__menu-item--highlighted'
      );
    });

    it('should highlight the selected element if user enter some other value click outside of combobox', async () => {
      render(<ComboBox {...mockProps} allowCustomValue={false} />);
      await openMenu();
      await userEvent.type(findInputNode(), 'Item 1');
      await userEvent.keyboard('[Enter]');
      await openMenu();
      expect(screen.getAllByRole('option')[1]).toHaveClass(
        'cds--list-box__menu-item--highlighted'
      );

      await userEvent.clear(findInputNode());
      await userEvent.type(findInputNode(), 'Item');
      //should match the loosely match element
      expect(screen.getAllByRole('option')[0]).toHaveClass(
        'cds--list-box__menu-item--highlighted'
      );

      fireEvent.blur(findInputNode());
      await openMenu();
      // on blur, it should retain the selected value
      expect(findInputNode()).toHaveDisplayValue('Item 1');
      expect(screen.getAllByRole('option')[1]).toHaveClass(
        'cds--list-box__menu-item--highlighted'
      );
    });

    it('should clear input when closing with chevron if input does not match any item and allowCustomValue is false', async () => {
      render(<ComboBox {...mockProps} allowCustomValue={false} />);

      // First type something that doesn't match any item
      await userEvent.type(findInputNode(), 'xyz');

      // Menu should be open at this point
      assertMenuOpen(mockProps);

      // Click the chevron/toggle button to close
      await userEvent.click(screen.getByRole('button', { name: 'Close' }));

      // Menu should be closed
      assertMenuClosed();

      // Input should be cleared
      expect(findInputNode()).toHaveDisplayValue('');
    });

    it('should pass defined selectedItem to onChange when item is selected', async () => {
      render(<ComboBox {...mockProps} />);

      expect(mockProps.onChange).not.toHaveBeenCalled();

      await openMenu();
      await userEvent.click(screen.getAllByRole('option')[0]);

      expect(mockProps.onChange).toHaveBeenCalledTimes(1);
      expect(mockProps.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          selectedItem: expect.anything(),
        })
      );

      const call = mockProps.onChange.mock.calls[0][0];
      expect(call.selectedItem).toBeDefined();
      expect(call.selectedItem).toEqual(mockProps.items[0]);
    });

    it('should never pass undefined as selectedItem to onChange', async () => {
      render(<ComboBox {...mockProps} />);

      for (let i = 0; i < mockProps.items.length; i++) {
        await openMenu();
        await userEvent.click(screen.getAllByRole('option')[i]);

        const call = mockProps.onChange.mock.calls[i][0];
        expect(call.selectedItem).toBeDefined();
        expect(call.selectedItem).not.toBeUndefined();
        expect(call.selectedItem).toEqual(mockProps.items[i]);
      }
    });
  });

  describe('ComboBox autocomplete', () => {
    const items = [
      { id: 'option-1', text: 'Option 1' },
      { id: 'option-2', text: 'Option 2' },
      { id: 'option-3', text: 'Option 3' },
      { id: 'apple', text: 'Apple' },
      { id: 'banana', text: 'Banana' },
      { id: 'orange', text: 'Orange' },
      { id: 'orangeish', text: 'Orangeish' },
    ];

    const mockProps = {
      id: 'test-combobox',
      items,
      itemToString: (item) => (item ? item.text : ''),
      onChange: jest.fn(),
    };

    it('should respect autocomplete prop', async () => {
      render(<ComboBox {...mockProps} typeahead />);
      await waitForPosition();
      const inputNode = findInputNode();
      expect(inputNode).toHaveAttribute('autocomplete');
    });
    it('should use autocompleteCustomFilter when autocomplete prop is true', async () => {
      const user = userEvent.setup();
      render(<ComboBox {...mockProps} typeahead />);

      // Open the dropdown
      const input = screen.getByRole('combobox');
      user.click(input);

      // Type 'op' which should match all options
      await user.type(input, 'op');
      expect(screen.getAllByRole('option')).toHaveLength(3);

      // Type 'opt' which should still match all options
      await user.type(input, 't');
      expect(screen.getAllByRole('option')).toHaveLength(3);

      // Type 'opti' which should match only 'Option 1'
      await user.type(input, 'i');
      expect(screen.getAllByRole('option')).toHaveLength(3);
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('should use default filter when autocomplete prop is false', async () => {
      const user = userEvent.setup();
      render(<ComboBox {...mockProps} />);

      // Open the dropdown
      const input = screen.getByRole('combobox');
      user.click(input);

      // Type 'op' which should match all options
      await user.type(input, 'op');
      expect(screen.getAllByRole('option')).toHaveLength(7);

      // Type 'opt' which should still match all options
      await user.type(input, 't');
      expect(screen.getAllByRole('option')).toHaveLength(7);

      // Type 'opti' which should still match all options
      await user.type(input, 'i');
      expect(screen.getAllByRole('option')).toHaveLength(7);

      // Type 'option' which should still match all options
      await user.type(input, 'on');
      expect(screen.getAllByRole('option')).toHaveLength(7);
    });

    it('should not autocomplete when no match is found', async () => {
      const user = userEvent.setup();
      render(<ComboBox {...mockProps} typeahead />);

      const input = screen.getByRole('combobox');
      user.click(input);

      await user.type(input, 'xyz');
      await user.keyboard('[Tab]');

      expect(document.activeElement).not.toBe(input);
    });
    it('should suggest best matching typeahread suggestion and complete it in Tab key press', async () => {
      const user = userEvent.setup();
      render(<ComboBox {...mockProps} typeahead />);

      // Open the dropdown
      const input = screen.getByRole('combobox');
      user.click(input);

      // Type 'op' which should match all options
      await user.type(input, 'Ap');

      await user.keyboard('[Tab]');

      expect(findInputNode()).toHaveDisplayValue('Apple');
    });
    it('should not autocomplete on Tab after backspace', async () => {
      const user = userEvent.setup();
      render(<ComboBox {...mockProps} allowCustomValue typeahead />);

      const input = screen.getByRole('combobox');
      user.click(input);

      await user.type(input, 'App');
      await user.keyboard('[Backspace]');

      await user.keyboard('[Tab]');

      expect(document.activeElement).not.toBe(input);
    });
    it('should autocomplete with the first matching suggestion when multiple matches exist', async () => {
      const multipleMatchProps = {
        ...mockProps,
        options: ['Apple', 'Application', 'Apricot'],
      };
      const user = userEvent.setup();
      render(<ComboBox {...multipleMatchProps} allowCustomValue typeahead />);

      const input = screen.getByRole('combobox');
      user.click(input);

      await user.type(input, 'App');
      await user.keyboard('[Tab]');

      expect(input).toHaveDisplayValue('Apple');
    });

    it('should match case exactly with option list when Tab is pressed', async () => {
      const user = userEvent.setup();
      render(<ComboBox {...mockProps} allowCustomValue typeahead />);

      const input = screen.getByRole('combobox');
      user.click(input);

      await user.type(input, 'APpl');
      await user.keyboard('[Tab]');

      expect(input).toHaveDisplayValue('Apple');
    });
  });
});
