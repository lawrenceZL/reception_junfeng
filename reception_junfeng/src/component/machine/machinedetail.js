import React from 'react'

import {NavBar, Modal} from 'antd-mobile'

import {Label} from 'react-bootstrap'

import Operation from './machineoperation'
import PM2_5Charts from "./pm2_5charts";

import {util} from "../service/util";
import {machine_service} from "../service/mahcine.service";
import {locationservice} from "../service/location.service";

import 'antd/dist/antd.css';
import './machine_bind_name.css'

import Location from "../citypicker/Location";
import {airquality_service} from "../service/airquality.service";

const gmair_machine_index = {
    width: `100%`,
    padding: `1rem 7.5% 0rem 7.5%`,
    textAlign: `center`
}

const gmair_machine_pm2_5 = {
    textAlign: `left`,
    fontWeight: `1rem`,
    height: `2.5rem`,
    lineHeight: `2.5rem`,
    width: `50%`,
    float: `left`
}

const gmair_machine_pm2_5_value = {
    height: `10rem`,
    lineHeight: `10rem`,
    fontFamily: `Helvetica`,
    fontSize: `9.5rem`,
    fontWeight: `lighter`,
    width: `70%`,
    float: `left`,
    letterSpacing: `0.55rem`,
    textAlign: `left`,
    marginTop: `1rem`
}

const gmair_machine_index_desc = {
    width: `30%`,
    float: `left`,
    margin: `1rem 0 0.7rem 0`
}

const gmair_machine_index_desc_item = {
    padding: `0.5rem 0 0.5rem 0.5rem`,
    fontSize: `1.5rem`,
    textAlign: `left`
}

const gmair_icon_active = {
    color: `#00A2E9`,
    width: `2rem`,
    textAlign: `center`
}

const indoor_index = {
    height: `12rem`
}

const charts_area = {
    margin: `3rem -2rem 0 -2rem`
}

class MachineDetail extends React.Component {
    constructor(props) {
        super(props);
        this.obtain_machine_status = this.obtain_machine_status.bind(this);
        this.operate_local_power = this.operate_local_power.bind(this);
        this.operate_local_volume = this.operate_local_volume.bind(this);
        this.operate_local_mode = this.operate_local_mode.bind(this);
        this.operate_local_light = this.operate_local_light.bind(this);
        this.operate_local_heat = this.operate_local_heat.bind(this);
        this.operate_local_lock = this.operate_local_lock.bind(this);
        this.edit_operation = this.edit_operation.bind(this);
        this.confirm_bind_name = this.confirm_bind_name.bind(this);
        this.read_bind = this.read_bind.bind(this);
        this.check_qrcode = this.check_qrcode.bind(this);
        this.check_control_option = this.check_control_option.bind(this);
        this.state = {
            bind_name: '',
            qrcode: '',
            model_id: '',
            online: false,
            pm2_5: 0,
            volume: 0,
            temp: 0,
            humid: 0,
            power_status: 'off',
            work_mode: 'manual',
            work_mode_list: [],
            heat_mode: 0,
            heat_mode_list: [],
            light: 0,
            lock: 0,
            co2: 0,
            edit_machine_name: false,
            co2_is_present: false,
            lock_is_present: false
        }
    }

    read_bind = (e) => {
        this.setState({bind_name: e.target.value});
    }

    edit_operation = () => {
        this.setState({edit_machine_name: !this.state.edit_machine_name})
    }

    confirm_bind_name = () => {
        machine_service.config_bind_name(this.state.qrcode, this.state.bind_name).then(response => {
            console.log(JSON.stringify(response))
        })
        this.edit_operation();
    }

    operate_local_power = (power) => {
        this.setState({power_status: power});
    }

    operate_local_volume = (volume) => {
        this.setState({volume: volume});
    }

    operate_local_mode = (mode) => {
        this.setState({work_mode: mode})
    }

    operate_local_light = (light) => {
        this.setState({light: light});
    }

    operate_local_heat = (heat) => {
        this.setState({heat_mode: heat});
    }

    operate_local_lock = (lock) => {
        this.setState({lock: lock});
    }

    obtain_machine_status = (qrcode) => {
        machine_service.obtain_machine_status(qrcode).then(response => {
            //machine online
            if (response.responseCode === 'RESPONSE_OK') {
                let information = response.data;
                let pm2_5 = information.pm2_5;
                let volume = information.volume;
                let temp = information.temperature;
                let humid = information.humidity;
                let power = information.power;
                let mode = information.mode;
                let light = information.light;
                let heat = information.heat;
                let lock = information.lock;
                let co2 = information.co2;
                this.setState({
                    online: false,
                    pm2_5: pm2_5,
                    volume: volume,
                    temp: temp,
                    humid: humid,
                    power_status: (power === 1) ? 'on' : 'off',
                    work_mode: util.tell_mode(mode, this.state.work_mode_list),
                    light: light,
                    heat_mode: heat,
                    lock: lock,
                    co2: co2
                });
            }
            //machine offline
            if (response.responseCode === 'RESPONSE_NULL') {
                this.setState({online: false});
            }
            if (response.responseCode === 'RESPONSE_ERROR') {
                this.setState({online: false});
            }
        });
    }

    check_qrcode = (qrcode) => {
        machine_service.check_exist(qrcode).then(response => {
            if (response.responseCode === 'RESPONSE_OK') {
                let info = response.data[0];
                this.setState({model_id: info.modelId})
                this.check_control_option(info.modelId)
                machine_service.probe_component(info.modelId, 'CO2').then(response => {
                    if (response.responseCode === 'RESPONSE_OK') {
                        this.setState({co2_is_present: true})
                    } else {
                        this.setState({co2_is_present: false})
                    }
                })
                machine_service.probe_component(info.modelId, 'LOCK').then(response => {
                    if (response.responseCode === 'RESPONSE_OK') {
                        this.setState({lock_is_present: true})
                    } else {
                        this.setState({lock_is_present: false})
                    }
                })
            } else {
                // window.location.href = '/machine/list'
            }
        })
    }

    check_control_option = (model_id) => {
        machine_service.obtain_control_option(model_id).then(response => {
            if (response.responseCode === 'RESPONSE_OK') {
                let control_list = response.data;
                for (let i = 0; i < control_list.length; i++) {
                    let item = control_list[i];
                    if (item.optionComponent === 'heat') {
                        let action_list = item.actions;
                        let heat_list = [];
                        for (let index in action_list) {
                            let action_item = action_list[index];
                            heat_list[action_item.commandValue] = {
                                name: action_item.actionName,
                                operator: action_item.actionOperator
                            }
                        }
                        this.setState({heat_mode_list: heat_list});
                    }
                    if (item.optionComponent === 'mode') {
                        let action_list = item.actions;
                        let mode_list = [];
                        for (let index in action_list) {
                            let action_item = action_list[index];
                            mode_list[action_item.commandValue] = {
                                name: action_item.actionName,
                                operator: action_item.actionOperator
                            }
                        }
                        this.setState({work_mode_list: mode_list})
                    }
                }
                this.obtain_machine_status(this.state.qrcode);
            }
        })
    }

    componentDidMount() {
        let qrcode = this.props.match.params.qrcode;
        this.check_qrcode(qrcode);
        this.setState({qrcode: qrcode});
        setInterval(() => {
            this.obtain_machine_status(qrcode);
        }, 10000);
    }

    render() {
        let pm2_5_color = 'pm2_5_excellent';
        if (this.state.pm2_5 >= 0 && this.state.pm2_5 <= 35) {
            pm2_5_color = 'pm2_5_excellent'
        } else if (this.state.pm2_5 > 35 && this.state.pm2_5 <= 75) {
            pm2_5_color = 'pm2_5_moderate'
        } else if (this.state.pm2_5 > 75 && this.state.pm2_5 <= 115) {
            pm2_5_color = 'pm2_5_sensative';
        } else if (this.state.pm2_5 > 115 && this.state.pm2_5 <= 150) {
            pm2_5_color = 'pm2_5_unhealthy';
        } else if (this.state.pm2_5 > 150 && this.state.pm2_5 <= 250) {
            pm2_5_color = 'pm2_5_very_unhealthy';
        } else {
            pm2_5_color = 'pm2_5_hazardous';
        }

        return (
            <div>
                <NavBar
                    mode="light"
                    rightContent={[
                        <div>
                            <span className='am-icon' onClick={() => {
                                window.location.href = "/machine/operation/" + this.state.qrcode;
                            }}><i className='fa fa-cog fa-lg'></i> </span>
                        </div>
                    ]}
                >济福新风</NavBar>
                <div style={gmair_machine_index}>
                    <div style={gmair_machine_pm2_5}>
                        <div className={pm2_5_color}>
                            PM2.5 {util.tell_pm2_5_desc(this.state.pm2_5)}
                        </div>
                    </div>
                </div>
                <div style={gmair_machine_index}>
                    <div style={indoor_index}>
                        <div style={gmair_machine_pm2_5_value}
                             className={pm2_5_color}>{util.format_pm2_5(this.state.pm2_5)}</div>
                        <div style={gmair_machine_index_desc}>
                            {this.state.co2_is_present &&
                            <div style={gmair_machine_index_desc_item}>
                                <span style={{
                                    fontSize: `10px`, color: `#00A2E9`,
                                    width: `2rem`,
                                    textAlign: `center`
                                }}>
                                   CO<sub>2</sub>
                                </span>
                                <span>&nbsp;{this.state.co2}ppm</span>
                            </div>
                            }
                            <div style={gmair_machine_index_desc_item}>
                                <span style={gmair_icon_active}>
                                    <i className='fa fa-thermometer fa-fw'></i>
                                </span>
                                <span>&nbsp;{this.state.temp}°C</span>
                            </div>
                            <div style={gmair_machine_index_desc_item}>
                                <span style={gmair_icon_active}>
                                    <i className='glyphicon glyphicon-tint fa-fw'></i>
                                </span>
                                <span>&nbsp;{this.state.humid}%</span>
                            </div>
                        </div>
                    </div>
                    <Outdoor qrcode={this.props.match.params.qrcode} city={this.refresh_city}/>
                    <Operation qrcode={this.props.match.params.qrcode}
                               power_status={this.state.power_status} operate_local_power={this.operate_local_power}
                               volume_value={this.state.volume} operate_local_volume={this.operate_local_volume}
                               work_mode_list={this.state.work_mode_list} work_mode={this.state.work_mode}
                               operate_local_mode={this.operate_local_mode}
                               light={this.state.light} operate_local_light={this.operate_local_light}
                               heat_mode_list={this.state.heat_mode_list} heat={this.state.heat_mode}
                               operate_local_heat={this.operate_local_heat}
                               lock_enabled={this.state.lock_is_present} lock={this.state.lock}
                               operate_local_lock={this.operate_local_lock}
                    />
                    <div style={charts_area}>
                        <PM2_5Charts qrcode={this.props.match.params.qrcode}/>
                    </div>
                </div>
            </div>
        )
    }
}

const outdoor_area = {
    marginTop: `0.5rem`
}

const outdoor_title = {
    textAlign: `left`
}

const outdoor_area_content = {
    display: `block`,
    height: `2.5rem`,
    lineHeight: `2.5rem`
}

const outdoor_pm2_5 = {
    width: `40%`,
    float: `left`,
    textAlign: `left`
}

const outdoor_temp = {
    width: `25%`,
    float: `left`,
    textAlign: `center`
}

const outdoor_humid = {
    width: `35%`,
    float: `left`,
    textAlign: `right`
}

const address = {
    fontSize: `1.6rem`,
    height: `100%`
}

class Outdoor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            province: '',
            city: '',
            province_id: '',
            city_id: '',
            configure_outdoor: false,
            outdoor_aqi: 0,
            outdoor_level: '',
            outdoor_pm2_5: 0,
            default_location: {province_id: '110000', province: '北京', city_id: '110101', city: '东城'}
        };
        this.obtain_aqi = this.obtain_aqi.bind(this);
        this.refresh_city = this.refresh_city.bind(this);
        this.trigger_config_outdoor = this.trigger_config_outdoor.bind(this);
    }

    refresh_city = (city_id) => {
        this.setState({city_id: city_id});
        locationservice.city_profile(city_id).then(response => {
            this.setState({city: response.data[0].cityName, province_id: response.data[0].provinceId})
        })
        this.setState({configure_outdoor: false});
        this.obtain_aqi();
    }

    obtain_aqi = () => {
        airquality_service.obtain_latest_aqi(this.state.city_id).then(response => {
            if (response.responseCode === 'RESPONSE_OK') {
                let air = response.data[0];
                this.setState({outdoor_aqi: air.aqi, outdoor_level: air.aqiLevel, outdoor_pm2_5: air.pm2_5})
            }
            if (response.responseCode == 'RESPONSE_NULL') {
                locationservice.city_profile(this.state.city_id).then(response => {
                    if (response.responseCode === 'RESPONSE_OK') {
                        this.setState({city: response.data[0].cityName, province_id: response.data[0].provinceId})
                        airquality_service.obtain_latest_aqi(response.data[0].provinceId).then(response => {
                            if (response.responseCode === 'RESPONSE_OK') {
                                let air = response.data[0];
                                this.setState({
                                    outdoor_aqi: air.aqi,
                                    outdoor_level: air.aqiLevel,
                                    outdoor_pm2_5: air.pm2_5
                                })
                            } else if (response.responseCode === 'RESPONSE_NULL') {
                                this.setState({
                                    province: this.state.default_location.province,
                                    province_id: this.state.default_location.province_id,
                                    city: this.state.default_location.city,
                                    city_id: this.state.default_location.city_id
                                })
                                airquality_service.obtain_latest_aqi(this.state.default_location.city_id).then(response => {
                                    let air = response.data[0];
                                    this.setState({
                                        outdoor_aqi: air.aqi,
                                        outdoor_level: air.aqiLevel,
                                        outdoor_pm2_5: air.pm2_5
                                    })
                                })
                            }
                        })
                    }
                })
            }
        })
    }

    trigger_config_outdoor = () => {
        this.setState({configure_outdoor: true})
    }

    componentDidMount() {
        machine_service.obtain_current_city(this.props.qrcode).then(response => {
            if (response.responseCode === 'RESPONSE_OK') {
                let city_id = this.state.default_location.city_id
                if (new String(response.data[0].cityId) != 'null') {
                    this.setState({city_id: response.data[0].cityId});
                    city_id = response.data[0].cityId;
                }
                locationservice.city_profile(city_id).then(response => {
                    if (response.responseCode === 'RESPONSE_OK') {
                        this.setState({
                            city: response.data[0].cityName,
                            province_id: response.data[0].provinceId
                        }, this.obtain_aqi)
                    } else {
                        this.setState({
                            city_id: this.state.default_location.city_id,
                            city: this.state.default_location.city,
                            province_id: this.state.default_location.province_id
                        }, this.obtain_aqi)
                    }
                })
            }
            if (response.responseCode === 'RESPONSE_NULL') {
                locationservice.tell_location().then(response => {
                    if (response.responseCode == 'RESPONSE_OK') {
                        this.setState({
                            province: response.data.province,
                            city: response.data.city
                        });
                        locationservice.acquire_city_id(response.data.code).then(response => {
                            if (response.responseCode === 'RESPONSE_OK') {
                                this.setState({city_id: response.data}, this.obtain_aqi)
                            } else {
                                this.setState({
                                    province: this.state.default_location.province,
                                    province_id: this.state.default_location.province_id,
                                    city: this.state.default_location.city,
                                    city_id: this.state.default_location.city_id
                                }, this.obtain_aqi)
                            }

                        })
                    } else {
                        this.setState({
                            province: this.state.default_location.province,
                            province_id: this.state.default_location.province_id,
                            city: this.state.default_location.city,
                            city_id: this.state.default_location.city_id
                        }, this.obtain_aqi)
                    }
                })
            }
        })
    }

    render() {
        let pm2_5_color = 'pm2_5_excellent';
        if (this.state.outdoor_pm2_5 >= 0 && this.state.outdoor_pm2_5 <= 35) {
            pm2_5_color = 'pm2_5_excellent'
        } else if (this.state.outdoor_pm2_5 > 35 && this.state.outdoor_pm2_5 <= 75) {
            pm2_5_color = 'pm2_5_moderate'
        } else if (this.state.outdoor_pm2_5 > 75 && this.state.outdoor_pm2_5 <= 115) {
            pm2_5_color = 'pm2_5_sensative';
        } else if (this.state.outdoor_pm2_5 > 115 && this.state.outdoor_pm2_5 <= 150) {
            pm2_5_color = 'pm2_5_unhealthy';
        } else if (this.state.outdoor_pm2_5 > 150 && this.state.outdoor_pm2_5 <= 250) {
            pm2_5_color = 'pm2_5_very_unhealthy';
        } else {
            pm2_5_color = 'pm2_5_hazardous';
        }

        return (
            <div style={outdoor_area}>
                <div style={outdoor_title}>
                    {
                        this.state.configure_outdoor ?
                            <Location qrcode={this.props.qrcode} refresh_city={this.refresh_city}/>
                            :
                            <div style={address} onClick={this.trigger_config_outdoor}>
                                <Label bsStyle="success">{this.state.city}</Label>
                            </div>
                    }

                </div>
                {
                    this.state.cityId !== '' ?
                        <div>
                            <hr/>
                            <div style={outdoor_area_content}>
                                <div style={outdoor_pm2_5}>
                        <span style={gmair_icon_active}>
                            空气质量
                        </span>
                                    <span className={pm2_5_color}>&nbsp;{this.state.outdoor_level}</span>
                                </div>
                                <div style={outdoor_temp}>
                        <span style={gmair_icon_active}>
                            AQI
                        </span>
                                    <span>&nbsp;{this.state.outdoor_aqi}</span>
                                </div>
                                <div style={outdoor_humid}>
                        <span style={gmair_icon_active}>
                            PM2.5
                        </span>
                                    <span>&nbsp;{this.state.outdoor_pm2_5}</span>
                                </div>
                            </div>
                            <hr/>
                        </div>
                        :
                        ''
                }

            </div>
        )
    }
}

export default MachineDetail;
