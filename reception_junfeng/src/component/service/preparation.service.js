import axios from 'axios'

const server_url = 'https://xf.jfczn.com:8016/preparation';

function pre_bind_single(records) {
    let prebind_url = server_url + '/machine/bind';
    let item = records[0];
    let form = new FormData();
    form.append('machineId', item.machineId);
    form.append('codeValue', item.codeValue);
    form.append('version', item.version);
    return axios.post(prebind_url, form).then(function (response) {
        return response.data;
    }).catch((reason => {
        console.log(reason);
        return {responseCode: 'RESPONSE_ERROR'}
    }));
}

function pre_bind_batch(records) {
    let prebind_url = server_url + '/machine/bind/batch';
    let list = [];
    for (let i = 0; i < records.length; i++) {
        list.push(records[i]);
        if (i != 0 && i % 30 == 0 && i != records.length - 1) {
            let form = new FormData();
            form.append('bindList', JSON.stringify(list));
            axios.post(prebind_url, form);
            list = [];
        }
    }
    let form = new FormData();
    form.append('bindList', JSON.stringify(list));
    return axios.post(prebind_url, form).then(function (response) {
        return response.data;
    }).catch((reason => {
        console.log(reason);
        return {responseCode: 'RESPONSE_ERROR'}
    }));
}

function obtain_prebind_list() {
    let obtain_url = server_url + '/machine/prebind/list/now'
    return axios.get(obtain_url).then(function (response) {
        return response.data;
    }).catch((reason => {
        console.log(reason);
        return {responseCode: 'RESPONSE_ERROR'}
    }))
}

function prebind_list(qrcode, machineId, start, end) {
    let obtain_url = server_url + '/machine/prebind/list?qrcode=' + qrcode + '&machineId=' + machineId + '&start=' + start + '&end=' + end;
    return axios.get(obtain_url).then(function (response) {
        return response.data;
    }).catch((reason => {
        console.log(reason);
        return {responseCode: 'RESPONSE_ERROR'}
    }))
}

function remove_prebind_record(bindId) {
    let del_url = server_url + '/machine/prebind/delete';
    let form = new FormData();
    form.append("bindId", bindId);
    return axios.post(del_url, form).then(function (response) {
        return response.data;
    }).catch((reason => {
        console.log(reason)
        return {responseCode: 'RESPONSE_ERROR'}
    }))
}

export const preparation_service = {
    obtain_prebind_list, pre_bind_single, pre_bind_batch, prebind_list, remove_prebind_record
}
