
import connect from "react-redux/es/connect/connect";
import {obtainMachineList} from "../../actions/machine.action";
import machineList from '../../component/machine/machinelist';

//映射Redux state到组件的属性
function mapStateToProps(state) {
    return {
        machine_list: state.machine_reducer.machine_list,
    }
}

//映射Redux actions到组件的属性
function mapDispatchToProps(dispatch){
    return{
        obtainMachineList:(machine_list)=>dispatch(obtainMachineList(machine_list))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(machineList);