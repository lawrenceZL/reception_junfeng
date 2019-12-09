import axios from 'axios'

const location_url = 'https://www.jfczn.com:8017/reception/location';

function list_province() {
    let request_province_url = location_url + '/province/list';
    return axios.get(request_province_url).then(function (response) {
        return response.data;
    }).catch(() => {
        return {responseCode: 'RESPONSE_ERROR', description: 'Fail to process the request'}
    })
}

function list_city(province_id) {
    let request_city_url = location_url + '/' + province_id + '/cities';
    return axios.get(request_city_url).then(function (response) {
        return response.data;
    }).catch(() => {
        return {responseCode: 'RESPONSE_ERROR', description: 'Fail to process the request'}
    })
}

function list_district(city_id) {
    let district_url = location_url + '/' + city_id + '/districts';
    return axios.get(district_url).then(function (response) {
        return response.data;
    }).catch(() => {
        return {responseCode: 'RESPONSE_ERROR', description: 'Fail to process the request'}
    })
}

function tell_location() {
    let tell_location_url = location_url + '/ip/address';
    return axios.get(tell_location_url).then(function (response) {
        return response.data;
    }).catch(() => {
        return {responseCode: 'RESPONSE_ERROR', description: 'Fail to process the request'}
    })
}

function city_profile(city_id) {
    let city_profile_url = location_url + '/probe/provinceId?cityId=' + city_id;
    return axios.get(city_profile_url).then(function (response) {
        return response.data;
    }).catch(() => {
        return {responseCode: 'RESPONSE_ERROR', description: 'Fail to process the request'}
    })

}

function acquire_city_id(code) {
    let city_url = location_url + '/probe/cityId?code=' + code;
    return axios.get(city_url).then(function (response) {
        return response.data;
    }).catch(() => {
        return {responseCode: 'RESPONSE_ERROR', description: 'Fail to process the request'}
    })
}

export const locationservice = {
    acquire_city_id, city_profile, list_province, list_city, list_district, tell_location
}
