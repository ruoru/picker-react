import React, {Component} from 'react';
import PropTypes from 'prop-types';
import PickerMask from './PickerMask';
import PickerColumn from './PickerColumn';
import classNames from '../utils/classnames';
import equal from 'fast-deep-equal';

class CascadePicker extends Component {

    constructor(props){
        super(props);
        const { data, dataKeys, defaultSelectIndexs, selectIndexs } = this.props;
        const { columns, newSelectIndexs } = this.parseData(selectIndexs || defaultSelectIndexs);
        this.state = {
            columns,
            selectIndexs: newSelectIndexs,
        };

        this.parseData = this.parseData.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillReceiveProps(nextProps){
        const {data, defaultSelectIndexs, selectIndexs} = nextProps;
        if (!equal(this.props.data, data)) {
            const { columns, newSelectIndexs } = this.parseData(selectIndexs || defaultSelectIndexs, nextProps);
            this.setState({
                columns,
                selectIndexs: newSelectIndexs,
            });
        }
        if (Array.isArray(selectIndexs) && selectIndexs.length > 0) {
            this.setState({selectIndexs});
        }
    }

    parseData(selectIndexs = [], props){
        const { data, dataKeys } = props || this.props;
        let i = 0, dataItem = JSON.parse(JSON.stringify(data)), columns = [], newSelectIndexs = [];

        do {
            columns.push(dataItem);
            const selectIndex = dataItem[ selectIndexs[ i ] ] ? selectIndexs[ i ] : 0;
            newSelectIndexs.push(selectIndex);

            dataItem = Array.isArray(dataItem) && dataItem[selectIndex] && dataItem[selectIndex][dataKeys.sub];
            i++;
        } while (dataItem);

        return { columns, newSelectIndexs };
    }

    handleChange(item, rowIndex, columnIndex){
        const {onChange} = this.props, propsSelectIndexs = this.props.selectIndexs;
        let {selectIndexs} = this.state;

        if (Array.isArray(propsSelectIndexs) && propsSelectIndexs.length > 0) {
            selectIndexs = this.props.selectIndexs;
        } else {
            selectIndexs[columnIndex] = rowIndex;
        }
        const { columns, newSelectIndexs } = this.parseData(selectIndexs);
        this.setState({ columns, selectIndexs: newSelectIndexs }, ()=>{
            if (onChange) onChange(selectIndexs, rowIndex, columnIndex);
        });
    }

    render(){
        const { data, dataKeys, onChange, show, transparent, lang, onCancel, onOk, onMaskClick, } = this.props;
        const { columns, selectIndexs } = this.state;

        return show && (
            <PickerMask
                show={show}
                transparent={transparent}
                lang={lang}
                onCancel={e => {if(onCancel) onCancel();}}
                onOk={e => {if (onOk) onOk(selectIndexs);}}
                onMaskClick={onMaskClick}
            >
                {
                    columns.map( (column, i) => {
                        return <PickerColumn key={i} data={column} dataKeys={dataKeys} onChange={this.handleChange} columnIndex={i} defaultIndex={selectIndexs[i]} />;
                    })
                }
            </PickerMask>

        );
    }
}


CascadePicker.propTypes = {
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
}

CascadePicker.defaultProps = {
    data: [],
    dataKeys: {
        text: 'text',
        value: 'value',
        disable: 'disable',
        sub: 'sub',
    },
}

export default CascadePicker;
