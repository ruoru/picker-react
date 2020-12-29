import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "../utils/classnames";

class PickerColumn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      translate: 0,
      selectedIndex: 0,
      animating: props.aniamtion,
      touching: false,
      inertialing: false,
      ogY: 0, // The Y coordinate of the finger at the touch start 
      ogTranslate: 0, // The displacement of option group at the touch start
      touchId: undefined,
      totalHeight: 0,
      dataKeys: Object.assign({
        text: "text",
        value: "value",
        disable: "disable",
        sub: "sub",
      }, props.dataKeys),
    };
  }

  componentDidMount() {
    this.adjustPosition();
    document.body.addEventListener("touchmove", this.preventDefault, {
      passive: false,
    });
  }

  componentWillReceiveProps(nextProps) {
    this.adjustPosition(nextProps);
  }

  componentWillUnmount() {
    document.body.removeEventListener("touchmove", this.preventDefault);
  }

  preventDefault = (e) => {
    e.preventDefault();
  }

  adjustPosition(props) {
    const { data, defaultIndex, itemHeight, indicatorTop } = props || this.props;
    let { translate } = this.state;
    const totalHeight = data.length * itemHeight;
    translate = indicatorTop - itemHeight * defaultIndex;
    this.setState({
      selectedIndex: defaultIndex,
      ogTranslate: translate,
      totalHeight,
      translate,
    }, () => {
      if (defaultIndex <= -1) this.updateSelected();
    });
  }

  adjustSelectedIndex() {
    const { data, itemHeight, indicatorTop, indicatorHeight } = this.props;
    const { translate, dataKeys } = this.state;
    let selectedIndex = 0;
    for (let i = 0; i < data.length; i++) {
      if (!data[i][dataKeys.disable] && itemHeight * i + translate >= indicatorTop && (i + 1) * itemHeight + translate <= indicatorTop + indicatorHeight) {
        selectedIndex = i;
        break;
      }
    }
    return selectedIndex;
  }

  updateSelected = () => {
    const { data, onChange, columnIndex } = this.props;
    const selectedIndex = this.adjustSelectedIndex();
    if (onChange) {
      onChange(data[selectedIndex], selectedIndex, columnIndex);
    }
  }

  handleTouchStart = (e) => {
    const { data } = this.props;
    const { touching, translate } = this.state;
    if (touching || data.length <= 1) return;
    const pageY = e.targetTouches[0].pageY;
    this.setState({
      touching: true,
      inertialing: true,
      ogTranslate: translate,
      touchId: e.targetTouches[0].identifier,
      ogY: pageY,
      animating: false,
    });
    this.inertialSliding('start', pageY);
  }

  handleTouchMove = (e) => {
    const { data } = this.props;
    const { touching, touchId, ogY, ogTranslate } = this.state;

    if (!touching || data.length <= 1) return;

    if (e.targetTouches[0].identifier !== touchId) return;

    // prevent move background
    e.preventDefault();

    const pageY = e.targetTouches[0].pageY;
    const diffY = pageY - ogY;
    this.setState({
      translate: diffY + ogTranslate,
    });
    this.inertialSliding('move', pageY);
  }

  handleTouchEnd = (e) => {
    const { data, indicatorTop, indicatorHeight, itemHeight } = this.props;
    const { touching, inertialing, ogTranslate, totalHeight } = this.state;
    let { translate } = this.state;

    if (!touching || data.length <= 1) return;

    if (inertialing && this.inertialSliding('end')) return;

    if (Math.abs(translate - ogTranslate) < itemHeight * 0.51) {
      translate = ogTranslate;
    } else if (translate > indicatorTop) {
      // top boundry
      translate = indicatorTop;
    } else if (translate + totalHeight < indicatorTop + indicatorHeight) {
      // bottom boundry
      translate = indicatorTop + indicatorHeight - totalHeight;
    } else {
      // pass single item range but not exceed boundry
      let step = 0;
      let adjust = 0;
      const diff = (translate - ogTranslate) / itemHeight;
      if (Math.abs(diff) < 1) {
        step = diff > 0 ? 1 : -1;
      } else {
        adjust = Math.abs((diff % 1) * 100) > 50 ? 1 : 0;
        step = diff > 0 ? Math.floor(diff) + adjust : Math.ceil(diff) - adjust;
      }
      translate = ogTranslate + step * itemHeight;
    }
    this.setState({
      touching: false,
      ogY: 0,
      touchId: undefined,
      ogTranslate: 0,
      animating: true,
      translate,
    }, this.updateSelected);
  }

  inertialSliding = (type, distance = 0) => {
    const { translate } = this.state;
    if (type === 'start') {
      this.dots = [{ time: 0, distance }];
      this.dotStartTime = new Date().getTime();
    } else if (type === 'move') {
      this.dots.unshift({ time: new Date().getTime() - this.dotStartTime, distance });
    } else if (type === 'end') {
      const slopes = [];
      let convergenceVelocity = 0;
      for (let i = 1; i < this.dots.length; i++) {
        const { time: prevTime, distance: prevDistance } = this.dots[i - 1];
        const { time: nextTime, distance: nextDistance } = this.dots[i];
        const velocity = (nextDistance - prevDistance) / (nextTime - prevTime);

        slopes.push(velocity);
        // The last three moves are about 100ms
        const validLength = 2;
        if (i <= validLength) {
          const length = this.dots.length <= validLength ? this.dots.length - 1 : validLength;
          convergenceVelocity += velocity / length;
        }
      }

      // braking distancey
      const direction = convergenceVelocity > 0;
      const acceleration = 0.1;
      const stepInterval = 40;
      let nextTranslate = translate;
      convergenceVelocity = Math.abs(this.tanh(1.6, convergenceVelocity));
      if (this.inertialInterval || convergenceVelocity <= acceleration) {
        return;
      }
      this.inertialInterval = setInterval(() => {
        convergenceVelocity -= acceleration;
        nextTranslate = direction ? nextTranslate + convergenceVelocity * 20 * stepInterval : nextTranslate - convergenceVelocity * 20 * stepInterval;
        if (convergenceVelocity <= acceleration) {
          this.setState({
            translate: nextTranslate,
            inertialing: false,
          }, () => {
            clearInterval(this.inertialInterval);
            this.inertialInterval = null;
            this.handleTouchEnd();
          });
        } else {
          this.setState({
            translate: nextTranslate
          });
        }
      }, stepInterval);
      return true;
    }
  }

  // convergence function tanh
  tanh = (scalar, x) => {
    return (Math.pow(scalar, x) - Math.pow(scalar, -x)) / (Math.pow(scalar, x) + Math.pow(scalar, -x));
  }

  render() {
    const { data, itemHeight, indicatorHeight } = this.props;
    const { dataKeys, translate, animating } = this.state;
    return (
      <div
        className="weui-picker__group"
        onTouchStart={this.handleTouchStart}
        onTouchMove={this.handleTouchMove}
        onTouchEnd={this.handleTouchEnd}
      >
        <div className="weui-picker__mask" />
        <div
          className="weui-picker__indicator"
          style={{ height: `${indicatorHeight}px` }}
        />
        <div
          className="weui-picker__content"
          style={{ transform: `translate(0, ${translate}px)`, transition: animating ? "transform .3s" : "none", }}
        >
          {
            data.map((item, j) => (
              <div
                key={j}
                value={item[dataKeys.value]}
                className={classNames("weui-picker__item", { "weui-picker__item_disabled": item[dataKeys.disable], })}
                style={{ height: `${itemHeight}px`, lineHeight: `${itemHeight}px`, }}
              >
                {item[dataKeys.text]}
              </div >
            ))
          }
        </div>
      </div>
    );
  }
}

PickerColumn.propTypes = {
  data: PropTypes.array.isRequired,
  dataKeys: PropTypes.object,
  height: PropTypes.number,
  itemHeight: PropTypes.number,
  indicatorTop: PropTypes.number,
  indicatorHeight: PropTypes.number,
  onChange: PropTypes.func,
  aniamtion: PropTypes.bool,
  columnIndex: PropTypes.number,
  defaultIndex: PropTypes.number,
};

PickerColumn.defaultProps = {
  data: [],
  dataKeys: {},
  height: 238,
  itemHeight: 25 + 9, // content + padding 
  indicatorTop: 102,
  indicatorHeight: 34,
  aniamtion: true,
  columnIndex: -1,
  defaultIndex: -1,
};

export default PickerColumn;
