import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "../utils/classnames";

class PickerMask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      closing: false
    };
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose(callback) {
    this.setState({ closing: true }, () =>
      setTimeout(() => {
        this.setState({ closing: false });
        if (callback) callback();
      }, 300)
    );
  }

  render() {
    const {
      show,
      transparent,
      lang,
      onCancel,
      onOk,
      onMaskClick,
      children
    } = this.props;
    const { closing } = this.state;
    const clz = classNames({
      "weui-mask": !transparent,
      "weui-mask_transparent": transparent,
      "weui-animate-fade-in": show && !closing,
      "weui-animate-fade-out": closing
    });
    const cls = classNames("weui-picker", {
      "weui-animate-slide-up": show && !closing,
      "weui-animate-slide-down": closing
    });

    return (
      <div>
        <div
          className={clz}
          onClick={e => {
            if (onMaskClick) onMaskClick();
          }}
        />
        <div className={cls}>
          <div className="weui-picker__hd">
            <a
              key="0"
              className="weui-picker__action"
              onClick={e => {
                if (onCancel) onCancel(e);
              }}
            >
              {lang.cancelBtn}
            </a>
            <a
              key="1"
              className="weui-picker__action"
              onClick={e => {
                if (onOk) onOk(e);
              }}
            >
              {lang.okBtn}
            </a>
          </div>
          <div className="weui-picker__bd">{children}</div>
        </div>
      </div>
    );
  }
}

PickerMask.propTypes = {
  show: PropTypes.bool,
  transparent: PropTypes.bool,
  lang: PropTypes.object,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
  onMaskClick: PropTypes.func
};

PickerMask.defaultProps = {
  show: false,
  lang: { cancelBtn: "Cancel", okBtn: "Ok" }
};

export default PickerMask;
