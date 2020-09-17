import axios from 'axios'

const airquality_url = 'https://xf.jfczn.com:8017/reception/airquality';

function config_default_outdoor(qrcode, city_id) {
    let config_default_outdoor_url = airquality_url + '/city/modify';
    let form = new FormData();
    form.append('qrcode', qrcode);
    form.append('cityId', city_id);
    return axios.post(config_default_outdoor_url, form).then(function (response) {
        return response.data;
    }).catch(() => {
        return {responseCode: 'RESPONSE_ERROR', description: 'Fail to process the request'}
    })
}

function obtain_latest_aqi(cityId) {
    let obtain_aqi_url = airquality_url + '/city?cityId=' + cityId;
    return axios.get(obtain_aqi_url).then(function(response) {
        return response.data;
    }).catch(() => {
        return {responseCode: 'RESPONSE_ERROR', description: 'Fail to process the request'};
    })
}

function obtain_city_pm2_5_weekly(city_id) {
    let obtain_aqi_url = airquality_url + '/city/daily/aqi?cityId=' + city_id;
    return axios.get(obtain_aqi_url).then(function(response) {
        return response.data;
    }).catch(() => {
        return {responseCode: 'RESPONSE_ERROR', description: 'Fail to process the request'};
    })
}

export const airquality_service = {
    config_default_outdoor, obtain_city_pm2_5_weekly, obtain_latest_aqi
}
