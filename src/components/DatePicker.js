import React, { Component } from 'react';
import PropTypes from "prop-types";
import { endOfMonth, isSameDay } from 'date-fns';
import { typeIs, isNumber } from '../utils/type';
import CascadePicker from './CascadePicker';

function isSameDate(date1, date2) {
  if (typeIs(date1) === 'date' && typeIs(date2) === 'date') {
    return isSameDay(date1, date2);
  }
  return date1 === date2;
}

class DatePicker extends Component {
  constructor(props) {
    super(props);
    const { startDate, endDate, selectValue, defaultSelectValue } = props;
    const { dateOptions, selectDateIndexs } = this.getInitData(startDate, endDate, selectValue || defaultSelectValue);
    this.state = {
      data: dateOptions,
      selectIndexs: selectDateIndexs,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { startDate, endDate, selectValue, defaultSelectValue } = nextProps;
    const { startDate: oldStartDate, endDate: oldEndDate, selectValue: oldSelectValue } = this.props;

    const nextState = {};
    if (!isSameDate(startDate, oldStartDate) || !isSameDate(endDate, oldEndDate)) {
      const { dateOptions, selectDateIndexs } = this.getInitData(startDate, endDate, selectValue || defaultSelectValue);
      nextState.data = dateOptions;
      nextState.selectIndexs = selectDateIndexs;
    } else if (!isSameDate(selectValue || defaultSelectValue, oldSelectValue)) {
      nextState.selectIndexs = this.getSelectIndexsByValue(selectValue, nextState.data || this.state.data);
    }

    if (Object.keys(nextState).length > 0) {
      this.setState(nextState);
    }
  }

  getInitData = (startDate, endDate, selectDate) => {
    var { startDate, endDate, selectDate } = this.processDate(startDate, endDate, selectDate);
    return this.getDateOptions(startDate, endDate, selectDate);
  }

  // js中唯独月份是从0开始，计算遵循该原则，显示则月份从1开始
  processDate = (startDate, endDate, selectDate) => {
    const currentDate = new Date();
    if (typeIs(startDate) === 'string' || isNumber(startDate)) {
      startDate = new Date(startDate);
    }

    if (typeIs(endDate) === 'string' || isNumber(endDate)) {
      endDate = new Date(endDate);
    }

    if (!startDate || !endDate) {
      if (!startDate && !endDate) {
        startDate = new Date(currentDate.getFullYear() - 10, 0);
        endDate = new Date(currentDate.getFullYear() + 10, 11, 31);
      } else if (!startDate) {
        startDate = new Date(endDate.getFullYear() - 20, 0);
      } else if (!endDate) {
        endDate = new Date(startDate.getFullYear() + 20, 11, 31);
      }
    }

    if (!selectDate) {
      selectDate = currentDate;
    } else if (typeIs(selectDate) === 'string' || isNumber(selectDate)) {
      selectDate = new Date(selectDate);
    }

    return { startDate, endDate, selectDate };
  }

  getDateOptions = (startDate, endDate, selectDate) => {
    const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth();
    const startDay = startDate.getDate();
    const endYear = endDate.getFullYear();
    const endMonth = endDate.getMonth();
    const endDay = endDate.getDate();
    let selectDateIndexs = selectDate;

    let yearIndex = 0;
    const dateOptions = [];
    for (let y = startYear; y <= endYear; y++, yearIndex++) {
      // 计算 month 循环范围
      const inStartYear = startYear === y;
      const inEndYear = endYear === y;
      const mEnd = inEndYear ? endMonth + 1 : 12;

      const mOptions = []; let monthIndex = 0;
      for (let m = inStartYear ? startMonth : 0; m < mEnd; m++, monthIndex++) {
        // 计算 day 循环范围
        const februaryDays = m !== 1 ? monthDays[m] : endOfMonth(new Date(y, 1)).getDate();
        const dEnd = inEndYear && endMonth === m ? endDay : februaryDays;

        const dOptions = []; let dayIndex = 0;
        for (let d = inStartYear && startMonth === m ? startDay : 1; d <= dEnd; d++, dayIndex++) {
          dOptions.push({
            text: d,
            value: new Date(y, m, d),
            disable: false,
          });

          if (typeIs(selectDateIndexs) === 'date' && y === selectDate.getFullYear() && m === selectDate.getMonth() && d === selectDate.getDate()) {
            selectDateIndexs = [yearIndex, monthIndex, dayIndex];
          }
        }

        mOptions.push({
          text: m + 1,
          value: m,
          sub: dOptions,
        });
      }

      dateOptions.push({
        text: y,
        value: y,
        sub: mOptions,
      });
    }

    if (typeIs(selectDateIndexs) === 'date') {
      selectDateIndexs = [0, 0, 0];
    }

    return { dateOptions, selectDateIndexs };
  }

  getSelectIndexsByValue = (selectValue, data, selectIndexs = []) => {
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      if (Array.isArray(item.sub) && item.sub.length > 0) {
        const findIndexs = this.getSelectIndexsByValue(selectValue, item.sub, selectIndexs.concat(i));
        if (Array.isArray(findIndexs)) {
          return findIndexs;
        }
      } else if (isSameDate(item.value, selectValue)) {
        selectIndexs.push(i);
        return selectIndexs;
      }
    }
  }

  onOk = (selectIndexs, lastSelectItem, e) => {
    const { onOk } = this.props;
    if (typeIs(onOk) === 'function') {
      onOk(lastSelectItem.value, lastSelectItem, e);
    }
  }

  render() {
    const { data } = this.state;
    const { selectIndexs } = this.state;
    return (
      <CascadePicker
        itemHeight={45}
        indicatorHeight={45}
        {...this.props}
        data={data}
        selectIndexs={selectIndexs}
        onOk={this.onOk}
      />
    );
  }
}

DatePicker.propTypes = {
  startDate: PropTypes.object,
  endDate: PropTypes.object,
  selectValue: PropTypes.object,
  defaultSelectValue: PropTypes.object,
};

DatePicker.defaultProps = {};

export default DatePicker;
