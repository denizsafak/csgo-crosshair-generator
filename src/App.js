// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Notification } from 'react-notification';
import queryString from 'query-string';
import equal from 'deep-equal';

import { setConfig, loadPreset } from './ducks/config';
import { setNotification, clearNotification } from './ducks/notification';

import Header from './components/Header';
import Toggles from './components/Toggles';
import Slider from './components/Slider';
import CrosshairColor from './components/CrosshairColor';
import CustomColor from './components/CustomColor';
import Presets from './components/Presets';
import CrosshairPreview from './components/CrosshairPreview';

type Props = {
  config: Object,
  setConfigAction: Function,
  loadPresetAction: Function,
  setNotificationAction: Function,
  clearNotificationAction: Function,
  activeColor: string,
  notificationText: string,
  notificationIsVisible: boolean,
  location: Object,
  history: Object,
};

class App extends Component {
  props: Props;

  // Update state with url params on initial mount
  componentWillMount() {
    this.props.setConfigAction(queryString.parse(this.props.location.search));
  }

  // Update url params when config prop changes
  componentWillReceiveProps(nextProps) {
    const config = this.props.config;
    const paramConfig = queryString.parse(nextProps.location.search);
    const params = queryString.stringify(config);

    if (!equal(config, paramConfig)) {
      this.props.history.replace({
        ...this.props.location,
        search: params,
      });
    }
  }

  render() {
    const {
      config,
      setConfigAction,
      setNotificationAction,
      clearNotificationAction,
      notificationText,
      notificationIsVisible,
      activeColor,
      loadPresetAction,
    } = this.props;

    return (
      <div>
        <Notification
          isActive={notificationIsVisible}
          message={notificationText}
          dismissAfter={1500}
          onDismiss={clearNotificationAction}
          onClick={clearNotificationAction}
        />

        <Header
          config={config}
          setNotificationAction={setNotificationAction}
        />

        <div className="content">
          <Toggles
            config={config}
            onClick={setConfigAction}
          />

          <div className="grid">
            <div className="col-50">
              <Slider
                disabled={config.cl_crosshairusealpha === '0'}
                name="cl_crosshairalpha"
                label="Alpha"
                onChange={setConfigAction}
                min={0}
                max={255}
                value={parseInt(config.cl_crosshairalpha, 10)}
              />

              <Slider
                name="cl_crosshairthickness"
                label="Thickness"
                onChange={setConfigAction}
                min={0}
                max={100}
                step={0.5}
                value={parseFloat(config.cl_crosshairthickness)}
              />

              <Slider
                name="cl_crosshairsize"
                label="Size"
                onChange={setConfigAction}
                min={0}
                max={100}
                value={parseInt(config.cl_crosshairsize, 10)}
              />

              <Slider
                names={['cl_crosshairgap', 'cl_fixedcrosshairgap']}
                label="Gap"
                onChange={setConfigAction}
                min={-100}
                max={100}
                value={parseInt(config.cl_fixedcrosshairgap, 10)}
              />

              <Slider
                disabled={config.cl_crosshair_outline_draw === '0'}
                name="cl_crosshair_outline"
                label="Outline"
                onChange={setConfigAction}
                min={0}
                max={3}
                dots
                value={parseInt(config.cl_crosshair_outline, 10)}
              />
            </div>
            <div className="col-50">
              <CrosshairColor
                setConfigAction={setConfigAction}
                activeColor={activeColor}
              />

              <CustomColor
                config={config}
                onChange={setConfigAction}
                disabled={activeColor !== '5'}
              />

              <Presets onClick={loadPresetAction} />
            </div>
          </div>

          <CrosshairPreview config={config} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  config: state.config,
  activeColor: state.config.cl_crosshaircolor,
  notificationText: state.notification.message,
  notificationIsVisible: state.notification.visible,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  setConfigAction: setConfig,
  loadPresetAction: loadPreset,
  setNotificationAction: setNotification,
  clearNotificationAction: clearNotification,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(App);
