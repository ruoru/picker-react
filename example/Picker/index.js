import "./index.css";
import React, { Component } from "react";
import { format } from 'date-fns';
import cnCity from "./cnCity";
import { GroupPicker, CascadePicker, DatePicker } from "../../src";

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
      cascade_value: "",
      cascade_data: cnCity,

      date_show: false,
      date_value: "",
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
              placeholder="Pick cascade value"
              readOnly={true}
            />
          </li>
          <li>
            <span>DatePicker</span>
            <input
              type="text"
              value={this.state.date_value}
              onClick={e => {
                e.preventDefault();
                this.setState({ date_show: true });
              }}
              placeholder="Pick date value"
              readOnly={true}
            />
          </li>
        </ul>

        <GroupPicker
          data={this.state.group_data}
          dataKeys={{ text: "label" }}
          show={this.state.group_show}
          onOk={(selectIndexs, selectItems, e) => {
            let value = "";
            selectItems.forEach((item, i) => {
              value += item.value;
            });
            this.setState({
              group_value: value,
              group_show: false
            });
          }}
          onCancel={e => this.setState({ group_show: false })}
          onMaskClick={e => this.setState({ group_show: false })}
        />

        <CascadePicker
          data={this.state.cascade_data}
          dataKeys={{ text: "name", value: "code", sub: "sub" }}
          show={this.state.cascade_show}
          onOk={(selectIndexs, lastItem, e) => {
            this.setState({
              cascade_value: lastItem.code,
              cascade_show: false
            });
          }}
          onCancel={e => this.setState({ cascade_show: false })}
          onMaskClick={e => this.setState({ cascade_show: false })}
        />

        <DatePicker
          show={this.state.date_show}
          onOk={(value, item, e) => {
            this.setState({ date_show: false, date_value: format(value, 'yyyy-MM-dd') });
          }}
          onCancel={e => this.setState({ date_show: false })}
          onMaskClick={e => this.setState({ date_show: false })}
        />
      </div>
    );
  }
}

export default Picker;
