export const parser = 'babel';

export default function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  // 1. How do I find the node(s) I want to change?

  // Look for the "Button" component
  //   -> this component should come from our package

  // Look for a specific "prop"
  root
    .find(j.JSXElement)
    .filter((path) => {
      // TODO
      // Should include buttons from 'carbon-components-react';
      // Should only include Buttons with the prop "hasIconOnly"
      return path.value.openingElement.name.name === 'Button';
    })
    .forEach((path) => {
      // 1. Adding an import to "IconButton"
      // 2. Change the "JSXElement" to use "IconButton" instead of "Button"
      //    - Change both the opening and closing element names, if there is a closing element
      renameComponent(path, 'IconButton');

      // 4. Remove the "hasIconOnly" prop
      removeProp(path, 'hasIconOnly');
    });

  function removeProp(jsxElement, propName) {
    j(jsxElement)
      .find(j.JSXAttribute, {
        name: {
          name: propName,
        },
      })
      .forEach((path) => {
        j(path).remove();
      });
  }

  function renameComponent(jsxElement, name) {
    const identifier = j.identifier(name);
    const closingElement = jsxElement.get('closingElement');

    j(jsxElement.get('openingElement').get('name')).replaceWith(identifier);

    if (closingElement.value) {
      j(closingElement.get('name')).replaceWith(identifier);
    }
  }

  return root.toSource();
}
