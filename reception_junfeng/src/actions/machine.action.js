//machine_action
export const OBTAIN_MACHINE_LIST="OBTAIN_MACHINE_LIST";
export const LOADING_OK="LOADING_DATA";
export const LOADING_NULL="LOADING_NULL";

export function obtainMachineList(machine_list) {
    return {
        type:OBTAIN_MACHINE_LIST,
        machine_list:machine_list,
    }
}
export function loadingOk() {
    return {
        type:LOADING_OK,
    }
}
export function loadingNull() {
    return {
        type:LOADING_NULL,
    }
}