import React from 'react';
import renderer from 'react-test-renderer';
import { GroupPicker, CascadePicker } from '../lib/';

test('Link changes the class when hovered', () => {
  const component = renderer.create(
    <GroupPicker show={false} />,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});