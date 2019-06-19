/**
 * @module DatePicker Component
 */

import React, { Component } from 'react';
import DatePickerItem from './DatePickerItem.js';
import PureRender from './pureRender.js';
import { convertDate, nextDate } from './time.js';
import { dateConfigMap } from './dataSource';

type Props = {
  theme: string,
  value: Object,
  beginDate: Object,
  endDate: Object,
  min: Object,
  max: Object,
  customHeader?: React.Element<*>,
  showHeader: boolean,
  showCaption: boolean,
  showStartAndStop: boolean,
  dateConfig: Object | Array<string>,
  headerFormat: string,
  confirmText: string,
  cancelText: string,
  onSelect: Function,
  onCancel: Function,
}

type State = {
  value: Date,
  beginDate: Date,
  endDate: Date,
}

/**
 * 大写首字母
 * @param {String} 字符串 
 */
const capitalize = ([first, ...rest]) => first.toUpperCase() + rest.join('');

/**
 * 判断数组
 * @param {any} val 
 */
const isArray = val => Object.prototype.toString.apply(val) === '[object Array]';

/**
 * Class DatePicker Component Class
 * @extends Component
 */
class DatePicker extends Component<void, Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      value: nextDate(this.props.value),
      beginDate: nextDate(this.props.beginDate),
      endDate: nextDate(this.props.endDate),
    };

    if ('dateFormat' in props) {
      console.warn('dateFormat已经被弃用, 请使用dateConfig属性配置');
    }

    if ('dateSteps' in props) {
      console.warn('dateSteps已经被弃用, 请使用dateConfig属性配置');
    }

    if ('showFormat' in props) {
      console.warn('headerFormat, 请使用dateConfig属性');
    }

    this.handleFinishBtnClick = this.handleFinishBtnClick.bind(this);
    this.handleDateSelect = this.handleDateSelect.bind(this);
    this.handleBeginDateSelect = this.handleBeginDateSelect.bind(this);
    this.handleEndDateSelect = this.handleEndDateSelect.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // update value of state
    const date = nextDate(nextProps.value);
    const beginDate = nextDate(nextProps.beginDate);
    const endDate = nextDate(nextProps.endDate);
    if (date.getTime() !== this.state.value.getTime()) {
      this.setState({ value: date });
    }
    if (beginDate.getTime() !== this.state.beginDate.getTime()) {
      this.setState({ beginDate });
    }
    if (endDate.getTime() !== this.state.endDate.getTime()) {
      this.setState({ endDate });
    }
  }

  /**
   * When you swipe two datepickeritems at the same time.
   * Prevent dates from going out.
   */
  componentDidUpdate() {
    const { value, beginDate, endDate } = this.state;
    const { min, max } = this.props;
    if (value.getTime() > max.getTime()) {
      this.setState({ value: max });
    }
    if (beginDate.getTime() > max.getTime()) {
      this.setState({ beginDate: max });
    }
    if (endDate.getTime() > max.getTime()) {
      this.setState({ endDate: max });
    }

    if (value.getTime() < min.getTime()) {
      this.setState({ value: min });
    }
    if (beginDate.getTime() < min.getTime()) {
      this.setState({ beginDate: min });
    }
    if (endDate.getTime() < min.getTime()) {
      this.setState({ endDate: min });
    }
  }

  /**
   * Optimization component, Prevents unnecessary rendering
   * Only props or state change or value before re-rendering
   *
   * @param  {Object} nextProps next props
   * @param  {Object} nextState next state
   * @return {Boolean}          Whether re-rendering
   */
  shouldComponentUpdate(nextProps, nextState) {
    /* const date = nextDate(nextState.value);
    return date.getTime() !== this.state.value.getTime() ||
      PureRender.shouldComponentUpdate(nextProps, nextState, this.props, this.state); */
    const beginDate = nextDate(nextState.beginDate)
    const endDate = nextDate(nextState.endDate)
    return (beginDate.getTime() !== this.state.beginDate.getTime() ||
      endDate.getTime() !== this.state.endDate.getTime()) ||
      PureRender.shouldComponentUpdate(nextProps, nextState, this.props, this.state);
  }

  /**
   * 点击完成按钮事件
   * @return {undefined}
   */
  handleFinishBtnClick() {
    // this.props.onSelect(this.state.value);
    const { beginDate, endDate } = this.state
    this.props.onSelect({ beginDate, endDate })
  }

  /**
   * 选择下一个日期
   * @return {undefined}
   */
  handleDateSelect(value) {
    this.setState({ value });
  }

  /**
   * 选择下一个日期
   * @return {undefined}
   */
  handleBeginDateSelect(value) {
    this.setState({ beginDate: value });
  }

  /**
   * 选择下一个日期
   * @return {undefined}
   */
  handleEndDateSelect(value) {
    this.setState({ endDate: value });
  }

  /**
   * 格式化dateConfig
   * @param {*} dataConfig dateConfig属性
   */
  normalizeDateConfig(dataConfig) {
    const configList = [];
    if (isArray(dataConfig)) {
      for (let i = 0; i < dataConfig.length; i++) {
        const value = dataConfig[i];
        if (typeof value === 'string') {
          const lowerCaseKey = value.toLocaleLowerCase();
          configList.push({
            ...dateConfigMap[lowerCaseKey],
            type: capitalize(lowerCaseKey),
          });
        }
      }
    } else {
      for (const key in dataConfig) {
        if (dataConfig.hasOwnProperty(key)) {
          const lowerCaseKey = key.toLocaleLowerCase();
          if (dateConfigMap.hasOwnProperty(lowerCaseKey)) {
            configList.push({
              ...dateConfigMap[lowerCaseKey],
              ...dataConfig[key],
              type: capitalize(lowerCaseKey),
            });
          }
        }
      }
    }

    return configList;
  }

  /**
   * render函数
   * @return {Object} JSX对象
   */
  render() {
    const { min, max, theme, dateConfig, confirmText, cancelText, headerFormat, showHeader, customHeader, showCaption, showStartAndStop } = this.props;
    const { value, beginDate, endDate } = this.state;
    const themeClassName =
      ['default', 'dark', 'ios', 'android', 'android-dark'].indexOf(theme) === -1 ?
        'default' : theme;

    const dataConfigList = this.normalizeDateConfig(dateConfig);

    return (
      <div
        className={`datepicker ${themeClassName}`}>
        {showHeader && (
          <div className="datepicker-header">
            <a
              className="datepicker-navbar-btn"
              onClick={this.props.onCancel}
              style={{ color: '#999' }}>{cancelText}</a>
            <a
              className="datepicker-navbar-btn"
              onClick={this.handleFinishBtnClick}
              style={{ color: '#FF344D' }}>{confirmText}</a>
          </div>
        )}
        {showCaption && showStartAndStop && (
          <div className="datepicker-caption">
            <span>开始日期</span>
          </div>
        )}
        <div className="datepicker-content">
          {dataConfigList.map((item, index) => (
            <DatePickerItem
              key={index}
              value={beginDate}
              min={min}
              max={max}
              step={item.step}
              type={item.type}
              format={item.format}
              onSelect={this.handleBeginDateSelect} />
          ))}
        </div>
        {
          showCaption && showStartAndStop && (
            <div className="datepicker-caption">
              <span>结束日期</span>
            </div>
          )
        }
        {
          showStartAndStop && (
            <div className="datepicker-content">
              {dataConfigList.map((item, index) => (
                <DatePickerItem
                  key={index}
                  value={endDate}
                  min={beginDate}
                  max={max}
                  step={item.step}
                  type={item.type}
                  format={item.format}
                  onSelect={this.handleEndDateSelect} />
              ))}
            </div>
          )
        }
      </div>
    );
  }
}

export default DatePicker;
