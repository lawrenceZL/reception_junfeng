import React from 'react'

import {Route} from 'react-router-dom'
import MachineDetail from "../machine/machinedetail";
import DeviceOperation from '../../containers/machine/operation'
import Prebind from "../prebind/prebind";
import BindList from "../prebind/bindlist";
const gmair_page = {
    width: `100%`,
    height: `100%`,
    backgroundSize: `100% 100%`
}

class Page extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={gmair_page}>
                <Route exact path='/machine/detail/:qrcode' component={MachineDetail}/>
                <Route path="/machine/operation/:qrcode" component={DeviceOperation}/>
                <Route exact path='/prebind' render={() => (<Prebind/>)}/>
                <Route exact path='/prebind/list' render={() => (<BindList/>)}/>
            </div>
        );
    }
}

export default Page;
