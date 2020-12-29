import React, { Component } from "react";
import PropTypes from "prop-types";
import { isEqual, cloneDeep } from "lodash";
import PickerMask from "./PickerMask";
import PickerColumn from "./PickerColumn";
class CascadePicker extends Component {
  constructor(props) {
    super(props);
    const { defaultSelectIndexs, selectIndexs } = props;
    const { columns, newSelectIndexs } = this.parseData(selectIndexs || defaultSelectIndexs);
    this.state = {
      columns,
      selectIndexs: newSelectIndexs,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { data, selectIndexs } = nextProps;
    const { data: oldData } = this.props;
    if (!isEqual(oldData, data)) {
      const { columns, newSelectIndexs } = this.parseData(selectIndexs, nextProps);
      this.setState({
        columns,
        selectIndexs: newSelectIndexs,
      });
    }
    if (Array.isArray(selectIndexs) && selectIndexs.length > 0) {
      this.setState({ selectIndexs });
    }
  }

  parseData = (selectIndexs = [], props) => {
    const { data, dataKeys } = props || this.props;
    let i = 0;
    let dataItem = cloneDeep(data);
    const columns = [];
    const newSelectIndexs = [];
    do {
      const selectIndex = dataItem[selectIndexs[i]] ? selectIndexs[i] : 0;
      columns.push(dataItem);
      newSelectIndexs.push(selectIndex);
      dataItem = Array.isArray(dataItem) && dataItem[selectIndex] && dataItem[selectIndex][dataKeys.sub];
      i++;
    } while (dataItem);

    return { columns, newSelectIndexs };
  }

  handleChange = (item, rowIndex, columnIndex) => {
    const { onChange } = this.props;
    const { selectIndexs } = this.state;
    selectIndexs[columnIndex] = rowIndex;
    const { columns, newSelectIndexs } = this.parseData(selectIndexs);
    this.setState({ columns, selectIndexs: newSelectIndexs }, () => {
      if (typeof onChange === "function") onChange(selectIndexs, rowIndex, columnIndex);
    });
  }

  render() {
    const { className, dataKeys, show, transparent, lang, onCancel,
      onOk, onMaskClick, itemHeight, indicatorHeight,
    } = this.props;
    const { columns, selectIndexs } = this.state;

    if (!show) { return null; }

    return (
      <PickerMask
        className={className}
        show={show} transparent={transparent}
        lang={lang}
        onCancel={onCancel}
        onOk={e => { if (typeof onOk === "function") onOk(selectIndexs, e); }}
        onMaskClick={onMaskClick}
      >
        {
          columns.map((item, i) => (
            <PickerColumn
              key={i}
              data={item}
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

CascadePicker.propTypes = {
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

CascadePicker.defaultProps = {
  data: [],
  dataKeys: {
    text: "text",
    value: "value",
    disable: "disable",
    sub: "sub",
  },
  defaultSelectIndexs: [],
};

export default CascadePicker;
