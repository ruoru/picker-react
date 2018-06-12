# picker-react

[![Build Status](https://img.shields.io/travis/ruoru/picker-react.svg?style=flat-square)](https://travis-ci.org/ruoru/picker-react)
[![Codecov](https://img.shields.io/codecov/c/github/ruoru/picker-react/master.svg?style=flat-square)](https://codecov.io/gh/ruoru/picker-react/branch/master)
[![Dependency Status](https://img.shields.io/gemnasium/react-component/trigger.svg?style=flat-square)](https://gemnasium.com/ruoru/picker-react)

[![NPM Version](https://img.shields.io/npm/v/picker-react.svg?style=flat-square)](https://www.npmjs.org/package/picker-react)
[![NPM Downloads](http://img.shields.io/npm/dm/picker-react.svg?style=flat-square)](https://npmjs.org/package/picker-react)

group and cascade pickers base on WEUI picker.

[<img src="http://p42sgsc8q.bkt.clouddn.com/country-flags/svg/cn.svg" height="20" /> 简体中文文档](README-zh_CN.md)

## Demo link

https://ruoru.github.io/picker-react

## Support environment

* Mobel browser.

## Applicable scene

1.  Mobile phone, the screen size in the mainstream (320x480 to 414x732);
2.  Whether with bottom navigation or not;
3.  Horizontal arrangement, it is recommend not to exceed the depth of four-level structure;
4.  Requirements of the word length in a certain range, too long can not be displayed completely;
5.  Interface data format needs to be strictly in accordance with the provisions of the format;

## Remaining problem

1.  if the first one is disable, if chose another disable item in same column, it will jump to the first one disable;

## Interface design

### GroupPicker & CascadePicker

GroupPicker & CascadePicker has the same interface, but the `data` structure is different.

| property name          | description                                                                         | type                                              | default                                                           |
| ---------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------------- |
| data \*                | The data source of the Array selector.                                              | Array                                             | []                                                                |
| dataKeys                | The alias of the data source key.                                                  | Object                                            | {text: 'text', value: 'value', disable: 'disable', sub: 'sub'}    |
| defaultSelectIndexs    | The default selection index of data.                                                | Array                                             | -                                                                 |
| selectIndexs           | Forces the selection of data.                                                       | Array                                             | -                                                                 |
| onChange \*            | Callback method, each time you change the selected value will run of the method.    | Function (selectIndexs, rowIndex, columnIndex)    | -                                                                 |
| show \*                | Show or Hide the component.                                                         | Bool                                              | false                                                             |
| transparent            | Is the gray background transparent or not.                                          | Bool                                              | false                                                             |
| lang                   | Text of Component `Cancel button` and `OK button`.                                  | Object                                            | { cancelBtn: 'Cancel', okBtn: 'Ok' }                              |
| onCancel \*            | Callback method, click the `Cancel button` will run the method.                     | Function                                          | -                                                                 |
| onOk \*                | Callback method, click the `OK button` will run the method.                         | Function (selectIndexs)                           | -                                                                 |
| onMaskClick            | Callback method, click on the gray background will run the method.                  | Function                                          | -                                                                 |

Here the `data` to emphasize, GroupPicker data format is:

```js
[
  [
    {
      text: "A1 (Disabled)",
      value: "A1",
      disable: true
    },
    {
      text: "A2",
      value: "A2"
    },
    {
      text: "A3",
      value: "A3"
    }
  ],
  [
    {
      text: "B1",
      value: "B1"
    },
    {
      text: "B2",
      value: "B2"
    }
  ],
  [
    {
      text: "C1",
      value: "C1"
    },
    {
      text: "C2",
      value: "C2"
    },
    {
      text: "C3 (Disabled)",
      value: "C3",
      disable: true
    },
    {
      text: "C4",
      value: "C4"
    }
  ]
];
```

CascadePicker data format is:

```js
[
  {
    text: "北京",
    value: "110000",
    sub: [
      {
        text: "北京市",
        value: "110000",
        sub: [
          {
            text: "东城区",
            value: "110101"
          },
          {
            text: "西城区",
            value: "110102"
          },
          {
            text: "朝阳区",
            value: "110105"
          },
          {
            text: "丰台区",
            value: "110106"
          }
        ]
      }
    ]
  },
  {
    text: "河北省",
    value: "130000",
    sub: [
      {
        text: "石家庄市",
        value: "130100",
        sub: [
          {
            text: "市辖区",
            value: "130101"
          },
          {
            text: "长安区",
            value: "130102"
          },
          {
            text: "新华区",
            value: "130103"
          },
          {
            text: "桥西区",
            value: "130104"
          }
        ]
      },
      {
        text: "唐山市",
        value: "130200",
        sub: [
          {
            text: "市辖区",
            value: "130201"
          },
          {
            text: "路南区",
            value: "130202"
          },
          {
            text: "路北区",
            value: "130203"
          },
          {
            text: "古冶区",
            value: "130204"
          }
        ]
      }
    ]
  }
];
```

## Install

```bash
npm install picker-react --save
```

## Example Code

[picker demo.js code](./example/views/Picker.js)

```js
import React, { Component } from "react";
import cnCity from "./cnCity";
import { GroupPicker, CascadePicker } from "picker-react";

class Picker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      group_show: false,
      group_value: "",
      group_data: [
        [
          {
            label: "A1 (Disabled)",
            value: "A1",
            disable: true
          },
          {
            label: "A2",
            value: "A2"
          },
          {
            label: "A3",
            value: "A3"
          },
          {
            label: "A4 (Disabled)",
            value: "A4",
            disable: true
          },
          {
            label: "A5",
            value: "A5"
          },
          {
            label: "A6",
            value: "A6"
          },
          {
            label: "A7",
            value: "A7"
          }
        ],
        [
          {
            label: "B1",
            value: "B1"
          },
          {
            label: "B2",
            value: "B2"
          },
          {
            label: "B3 (Disabled)",
            value: "B3",
            disable: true
          },
          {
            label: "B4",
            value: "B4"
          }
        ],
        [
          {
            label: "C1",
            value: "C1"
          },
          {
            label: "C2",
            value: "C2"
          },
          {
            label: "C3 (Disabled)",
            value: "C3",
            disable: true
          },
          {
            label: "C4",
            value: "C4"
          }
        ]
      ],
      cascade_show: false,
      cascade_value: ""
    };
  }

  render() {
    return (
      <div className="picker">
        <ul>
          <li>
            <span>GroupPicker</span>
            <input
              type="text"
              onClick={e => {
                e.preventDefault();
                this.setState({ group_show: true });
              }}
              placeholder="Pick a item"
              value={this.state.group_value}
              readOnly={true}
            />
          </li>
          <li>
            <span>CascadePicker</span>
            <input
              type="text"
              value={this.state.cascade_value}
              onClick={e => {
                e.preventDefault();
                this.setState({ cascade_show: true });
              }}
              placeholder="Chose Your cascade value"
              readOnly={true}
            />
          </li>
        </ul>

        <GroupPicker
          data={this.state.group_data}
          dataKeys={{ text: "label" }}
          show={this.state.group_show}
          onOk={selected => {
            let value = "";
            selected.forEach((s, i) => {
              value += this.state.group_data[i][s].value;
            });
            this.setState({
              group_value: value,
              group_show: false
            });
          }}
          onCancel={e => this.setState({ group_show: false })}
        />

        <CascadePicker
          data={cnCity}
          dataKeys={{ text: "name", value: "code", sub: "sub" }}
          show={this.state.cascade_show}
          onOk={selected => {
            let value = cnCity;
            selected.forEach((s, i) => {
              if (i === selected.length - 1) {
                value = value[s].code;
              } else {
                value = value[s].sub;
              }
            });
            this.setState({
              cascade_value: value,
              cascade_show: false
            });
          }}
          onCancel={e => this.setState({ cascade_show: false })}
        />
      </div>
    );
  }
}

export default Picker;
```

## Local development

```sh
$ git clone https://github.com/ruoru/picker-react.git
$ npm install
$ npm start
```
