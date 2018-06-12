# picker-react

基于 WEUI 实现的组选择器，级联选择器。

[<img src="http://p42sgsc8q.bkt.clouddn.com/country-flags/svg/uk.svg" height="20" /> README in English](README.md)

## 例子链接

https://ruoru.github.io/picker-react

## 支持环境

* 手机浏览器

## 适用场景

1.  手机端，屏幕尺寸在主流范围内（320x480 至 414x732）；
2.  无论是否带有底部导航；
3.  横向排布，建议要展现的数据结构深度不要超过四级结构；
4.  要求字数长度在一定范围内，太长则无法显示完全；
5.  接口中 data 格式需要严格按照格式规定；

## 遗留问题

1.  每次点击值的选项 onValueChange 都会执行两次；
2.  如果第一项是不可选中的，选中后面不可选中的项会默认跳转到第一项。

## 接口设计

### GroupPicker 和 CascadePicker

GroupPicker 和 CascadePicker 有着同样的接口，但是他们两个的 data 格式不一样的。

| 属性名              | 类型     | 说明                                           |
| ------------------- | -------- | ---------------------------------------------- |
| data \*             | Array    | 选择器的数据来源，默认值为[]。                 |
| dataKeys             | Object   | 数据来源键值的别名。                           |
| defaultSelectIndexs | Array    | 默认选择下标。                                 |
| selectIndexs        | Array    | 强制选中下标。                                 |
| onChange \*         | Function | 回调方法，每次更改选中的值改变后会执行该方法。 |
| show \*             | Bool     | 是否显示该组件。                               |
| transparent         | Bool     | 灰色背景是否是否透明。                         |
| lang                | Object   | 组件取消按钮和确定按钮的显示内容。             |
| onCancel \*         | Function | 回调方法，点击取消按钮会执行该方法。           |
| onOk \*             | Function | 回调方法，点击确认按钮后会执行该方法。         |
| onMaskClick         | Function | 回调方法，点击灰色背景后会执行该方法。         |

这里强调一下，`GroupPicker data`的数据格式为：

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

`CascadePicker data`的数据格式为：

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

## 安装

```bash
npm install picker-react --save
```

## 示例

[代码](./example/views/Picker.js)

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

## 本地开发

```sh
$ git clone https://github.com/ruoru/picker-react.git
$ npm install
$ npm start
```
