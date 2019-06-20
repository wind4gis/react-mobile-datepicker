import './main.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { convertDate } from '../../lib/time.js';
import DatePicker from '../../lib/index';

(function main() {
  class App extends React.Component {
    state = {
      time: new Date(),
      beginDate: new Date(),
      endDate: new Date(),
      isOpen: false,
      theme: 'default',
    }

    handleToggle = (isOpen) => () => {
      this.setState({ isOpen });
    }

    handleThemeToggle = (theme) => () => {
      this.setState({ theme, isOpen: true });
    }

    handleSelect = ({ beginDate, endDate }) => {
      console.log(beginDate, endDate, 'time')
      this.setState({ beginDate, endDate, isOpen: false });
    }

    render() {
      return (
        <div className="App">
          <p className="select-time ">
            {convertDate(this.state.beginDate, 'YYYY-MM-DD')}
          </p>
          <p className="select-time ">
            {convertDate(this.state.endDate, 'YYYY-MM-DD')}
          </p>
          <div>
            <a
              className="select-btn sm"
              onClick={this.handleThemeToggle('default')}>
              default
                        </a>
            <a
              className="select-btn sm"
              onClick={this.handleThemeToggle('dark')}>
              dark
                        </a>
            <a
              className="select-btn sm"
              onClick={this.handleThemeToggle('ios')}>
              ios
                        </a>
            <a
              className="select-btn sm"
              onClick={this.handleThemeToggle('android')}>
              android
                        </a>
            <a
              className="select-btn sm"
              onClick={this.handleThemeToggle('android-dark')}>
              android-dark
                        </a>
          </div>
          <DatePicker
            value={this.state.time}
            beginDate={this.state.beginDate}
            endDate={this.state.endDate}
            max={new Date()}
            theme={this.state.theme}
            isOpen={this.state.isOpen}
            showCaption={true}
            showStartAndStop={true}
            dateConfig={{
              'year': {
                format: 'YYYY',
                caption: '年',
                step: 1,
              },
              'month': {
                format: 'M',
                caption: '月',
                step: 1,
              },
              'date': {
                format: 'D',
                caption: '日',
                step: 1,
              },
            }}
            onSelect={this.handleSelect}
            onCancel={this.handleToggle(false)} />
        </div>
      );
    }
  }


  ReactDOM.render(<App />, document.getElementById('react-box'));
}());
