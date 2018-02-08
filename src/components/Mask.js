import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from '../utils/classnames'/**
 * screen mask, use in `Dialog`, `ActionSheet`, `Popup`.
 *
 */
class Mask extends React.Component {


    render() {
        const {transparent, className} = this.props;
        const clz = classNames({
            'weui-mask': !transparent,
            'weui-mask_transparent': transparent
        }, className);

        return (
            <div className={clz}></div>
        );
    }
}

Mask.propTypes = {
    /**
     * Whather mask should be transparent (no color)
     *
     */
    transparent: PropTypes.bool
};

Mask.defaultProps = {
    transparent: false
};

export default Mask;