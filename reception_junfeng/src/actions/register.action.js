//register_action
export const CHANGE_USERNAME="CHANGE_USERNAME";
export const STORE_LOCATION="STORE_LOCATION";
export const INPUT_ADDRESS="INPUT_ADDRESS";
export const CHANGE_MOBILE="CHANGE_MOBILE";
export const VALIDATE="VALIDATE";
export const MOBILE_REGISTER_NULL="MOBILE_REGISTER_NULL";
export const MOBILE_REGISTER_OK="MOBILE_REGISTER_OK";
export const INPUT_PASSWORD="INPUT_PASSWORD";
export const CLICK_SEND_CODE_BUTTON="CLICK_SEND_CODE_BUTTON";
export const CHANGE_EXPECTED_PASSWORD="CHANGE_EXPECTED_PASSWORD";
export const CLICK_REGISTER_BUTTON="CLICK_REGISTER_BUTTON";
export function usernameChange(username){
    return{
        type:CHANGE_USERNAME,
        username:username,
    }
}
export function locationStore(address_province,address_city){
    return{
        type:STORE_LOCATION,
        address_province:address_province,
        address_city:address_city,
        address:address_province+address_city,
    }
}
export function addressInput(address){
    return{
        type:CHANGE_USERNAME,
        address:address,
    }
}
export function mobileChange(mobile){
    return{
        type:CHANGE_MOBILE,
        mobile:mobile,
    }
}
export function validate(){
    return{
        type:VALIDATE,
    }
}
export function mobileRegisterNull(){
    return {
        type:MOBILE_REGISTER_NULL,
    }
}
export  function mobileRegisterOK(){
    return {
        type:MOBILE_REGISTER_OK,
    }
}
export function passwordInput(password) {
    return {
        type:INPUT_PASSWORD,
        password:password,
    }
}
export function sendCodeButtonClick(verification_text,ready2send) {
    return {
        type:CLICK_SEND_CODE_BUTTON,
        verification_text:verification_text,
        ready2send:ready2send,
    }
}
export function changeExpectedPassword(expected_password){
    return {
        type:CHANGE_EXPECTED_PASSWORD,
        expected_password:expected_password,
    }
}
export function registerButtonClick(){
    return{
        type:CLICK_REGISTER_BUTTON,
    }
}

