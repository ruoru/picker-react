import React from 'react';
import { render } from 'react-dom';
import 'babel-polyfill';

import Picker from './views/Picker';

render(
    <Picker />,
    document.getElementById('root'),
);