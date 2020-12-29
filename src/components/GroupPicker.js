import React, { Component } from "react";
import PropTypes from "prop-types";
import { isEqual } from "lodash";
import PickerMask from "./PickerMask";
import PickerColumn from "./PickerColumn";
class GroupPicker extends Component {
  constructor(props) {
    super(props);
    const { data, defaultSelectIndexs, selectIndexs } = props;
    this.state = {
      selectIndexs: selectIndexs || defaultSelectIndexs || Array(data.length).fill(-1),
    };
  }

  componentWillReceiveProps(nextProps) {
    const { selectIndexs } = nextProps;
    if (Array.isArray(selectIndexs) && selectIndexs.length > 0) {
      this.setState({ selectIndexs });
    }

    // there may think about props.data change
    // if (!isEqual(this.props.data, data)) {
    //   this.setState({
    //     selectIndexs:
    //       selectIndexs || defaultSelectIndexs || Array(data.length).fill(-1)
    //   });
    // }
  }

  handleChange = (item, rowIndex, columnIndex) => {
    const { onChange } = this.props;
    const { selectIndexs } = this.state;
    selectIndexs[columnIndex] = rowIndex;
    this.setState({ selectIndexs }, () => {
      if (typeof onChange === "function") {
        onChange(selectIndexs, rowIndex, columnIndex)
      };
    });
  }

  render() {
    const {
      className, data, dataKeys, show, transparent, lang, itemHeight, indicatorHeight,
      onCancel, onOk, onMaskClick,
    } = this.props;
    const { selectIndexs } = this.state;

    if (!show) { return null; }

    return (
      <PickerMask
        className={className}
        show={show}
        transparent={transparent}
        lang={lang}
        onCancel={onCancel}
        onOk={e => { if (typeof onOk === "function") onOk(selectIndexs, e); }}
        onMaskClick={onMaskClick}
      >
        {
          data.map((column, i) => (
            <PickerColumn
              key={i}
              data={column}
              dataKeys={dataKeys}
              itemHeight={itemHeight}
              indicatorHeight={indicatorHeight}
              onChange={this.handleChange}
              columnIndex={i}
              defaultIndex={selectIndexs[i]}
            />
          ))
        }
      </PickerMask>
    );
  }
}

GroupPicker.propTypes = {
  className: PropTypes.string,
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
  onMaskClick: PropTypes.func,
  itemHeight: PropTypes.number,
  indicatorHeight: PropTypes.number,
};

GroupPicker.defaultProps = {
  data: [],
};

export default GroupPicker;
