import React, {Component} from 'react';
import PropTypes from 'prop-types';
import PickerMask from './PickerMask';
import PickerColumn from './PickerColumn';
import classNames from '../utils/classnames';
import equal from 'fast-deep-equal';

class CascadePicker extends Component {

    constructor(props){
        super(props);
        const { data, datamap, defaultSelectIndexs, selectIndexs } = this.props;
        const { columns, newSelectIndexs } = this.parseData(selectIndexs || defaultSelectIndexs);
        this.state = {
            columns,
            selectIndexs: newSelectIndexs,
        };

        this.parseData = this.parseData.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillReceiveProps(nextProps){
        if (!equal(this.props.data, nextProps.data)) {
            const { columns, newSelectIndexs } = this.parseData(nextProps.selectIndexs || nextProps.defaultSelectIndexs, nextProps);
            this.setState({
                columns,
                selectIndexs: newSelectIndexs,
            });
        }
    }

    parseData(selectIndexs = [], props){
        const { data, datamap } = props || this.props;
        let i = 0, dataItem = JSON.parse(JSON.stringify(data)), columns = [], newSelectIndexs = [];

        do {
            columns.push(dataItem);
            const selectIndex = dataItem[ selectIndexs[ i ] ] ? selectIndexs[ i ] : 0;
            newSelectIndexs.push(selectIndex);

            dataItem = Array.isArray(dataItem) && dataItem[selectIndex] && dataItem[selectIndex][datamap.sub];
            i++;
        } while (dataItem);

        return { columns, newSelectIndexs };
    }

    handleChange(item, index, columnIndex){
        let {selectIndexs} = this.state;
        const {onChange} = this.props;

        selectIndexs[columnIndex] = index;
        const { columns, newSelectIndexs } = this.parseData(selectIndexs);

        this.setState({ columns, selectIndexs: newSelectIndexs }, ()=>{
            if (onChange) onChange(selectIndexs, index, columnIndex);
        });
    }

    render(){
        const { data, datamap, onChange, show, transparent, lang, onCancel, onOk, onMaskClick, } = this.props;
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
                        return <PickerColumn key={i} data={column} datamap={datamap} onChange={this.handleChange} columnIndex={i} defaultIndex={selectIndexs[i]} />;
                    })
                }
            </PickerMask>

        );
    }
}


CascadePicker.propTypes = {
    data: PropTypes.array.isRequired,
    datamap: PropTypes.object,
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
    datamap: {
        text: 'text',
        value: 'value',
        disable: 'disable',
        sub: 'sub',
    },
}

export default CascadePicker;
