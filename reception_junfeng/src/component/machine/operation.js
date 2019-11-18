import React, {Component} from 'react';
// import SettingSelect from '../../containers/machine/operation';
import SettingSelect from '../../containers/machine/settingSelect';
import {NavBar, Icon} from 'antd-mobile';
import {machine_service} from "../service/mahcine.service";
import {operation_service} from "../service/operation.service";
import createHistory from 'history/createBrowserHistory'

const history = createHistory();

class MachineOperation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: 0,
        }
    }

    componentDidMount() {
        // localStorage.setItem("access_token","4344bc0b-6819-49fc-9442-03d3cbafa840")
        let qrcode = this.props.match.params.qrcode;
        this.props.qrcodeStore(qrcode);
        operation_service.obtain_timing_status(qrcode).then(response=>{
            if(response.responseCode==="RESPONSE_OK"){
                if(response.data[0].status){
                    this.props.expandTiming();
                    this.props.switchOn();
                }
                response=response.data[0];
                this.props.componentIn(response.startTime.hour,response.startTime.minute,response.endTime.hour,
                    response.endTime.minute,operation_service.format_time(response.startTime.hour,response.startTime.minute),
                    operation_service.format_time(response.endTime.hour,response.endTime.minute));
            }
        })
        machine_service.obtain_bind_info(qrcode).then(response=>{
            if(response.responseCode==="RESPONSE_OK"){
                this.props.inputUsername(response.data[0].bindName);
            }
        })
    }

    render() {
        const setting_container = {
            height: window.innerHeight,
            width: window.innerWidth,
            backgroundColor: `#e6e6e6`
        }
        return (

            <div>
                <div className="setting_container" style={setting_container}>
                    <NavBar
                        mode="light"
                        leftContent={[<Icon key="return" type="left"/>]}
                        onLeftClick={() => {history.goBack();}}
                    >新风设置</NavBar>
                    {this.state.mode === 0 &&
                    <SettingSelect qrcode={this.props.qrcode}/>
                    }
                </div>
            </div>
        )
    }
}


export default MachineOperation;
