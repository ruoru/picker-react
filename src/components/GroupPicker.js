import React, { Component } from "react";
import PropTypes from "prop-types";
import PickerMask from "./PickerMask";
import PickerColumn from "./PickerColumn";
import classNames from "../utils/classnames";
import { isEqual } from "lodash";

class GroupPicker extends Component {
  constructor(props) {
    super(props);
    const { data, defaultSelectIndexs, selectIndexs } = props;

    this.state = {
      selectIndexs:
        selectIndexs || defaultSelectIndexs || Array(data.length).fill(-1)
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    //there may think about props.data change
    const { data, defaultSelectIndexs, selectIndexs } = nextProps;
    if (Array.isArray(selectIndexs) && selectIndexs.length > 0) {
      this.setState({ selectIndexs });
      return;
    }
    if (!isEqual(this.props.data, data)) {
      this.setState({
        selectIndexs:
          selectIndexs || defaultSelectIndexs || Array(data.length).fill(-1)
      });
    }
  }

  handleChange(item, rowIndex, columnIndex) {
    const { onChange } = this.props,
      propsSelectIndexs = this.props.selectIndexs;
    let { selectIndexs } = this.state;

    if (Array.isArray(propsSelectIndexs) && propsSelectIndexs.length > 0) {
      selectIndexs = this.props.selectIndexs;
    } else {
      selectIndexs[columnIndex] = rowIndex;
    }

    this.setState({ selectIndexs }, () => {
      if (onChange) onChange(selectIndexs, rowIndex, columnIndex);
    });
  }

  render() {
    const {
      data,
      dataKeys,
      onChange,
      show,
      transparent,
      lang,
      onCancel,
      onOk,
      onMaskClick
    } = this.props;
    const { selectIndexs } = this.state;

    return (
      show? (
        <PickerMask
          show={show}
          transparent={transparent}
          lang={lang}
          onCancel={e => {
            if (onCancel) onCancel();
          }}
          onOk={e => {
            if (onOk) onOk(selectIndexs);
          }}
          onMaskClick={onMaskClick}
        >
          {data.map((column, i) => {
            return (
              <PickerColumn
                key={i}
                data={column}
                dataKeys={dataKeys}
                onChange={this.handleChange}
                columnIndex={i}
                defaultIndex={selectIndexs[i]}
              />
            );
          })}
        </PickerMask>)
        : ''
      
    );
  }
}

GroupPicker.propTypes = {
  data: PropTypes.array.isRequired,
  dataKeys: PropTypes.object,
  defaultSelectIndexs: PropTypes.array,
  selectIndexs: PropTypes.array,
  onChange: PropTypes.func,
  show: PropTypes.bool,
  transparent: PropTypes.bool,
  lang: PropTypes.object,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
  onMaskClick: PropTypes.func
};

GroupPicker.defaultProps = {
  data: []
};

export default GroupPicker;
