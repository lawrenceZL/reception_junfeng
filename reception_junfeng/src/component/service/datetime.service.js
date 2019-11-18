function formatTimeStampToDate(timestamp) {
    if (timestamp === null || timestamp === undefined) {
        return '-';
    }
    let date = new Date(timestamp);
    let year = date.getFullYear().toString();
    let month = ("0" + (date.getMonth() + 1)).slice(-2).toString();
    let day = ("0" + date.getDate()).slice(-2).toString();

    return year + '-' + month + '-' + day;
}


function formatTimeStampToDateTime(timestamp) {
    if (timestamp == null) {
        return '';
    }
    let date = new Date(timestamp);
    let year = date.getFullYear().toString();
    let month = ("0" + (date.getMonth() + 1)).slice(-2).toString();
    let day = ("0" + date.getDate()).slice(-2).toString();

    let hour = ("0" + date.getHours()).slice(-2).toString();
    let minute = ("0" + date.getMinutes()).slice(-2).toString();
    let seconds = ("0" + date.getSeconds()).slice(-2).toString();

    return year + '-' + month + '-' + day + " " + hour + ":" + minute + ":" + seconds;
}
function formatTimeStampToHourTime(timestamp) {
    if (timestamp == null) {
        return '';
    }
    let date = new Date(timestamp);
    let hour = ("0" + date.getHours()).slice(-2).toString();
    let minute = ("0" + date.getMinutes()).slice(-2).toString();
    return hour + ":" + minute;
}

function formatTimeStampToDateHour(timestamp) {
    if (timestamp == null) {
        return '';
    }
    let date = new Date(timestamp);
    let month = ("0" + (date.getMonth() + 1)).slice(-2).toString();
    let day = ("0" + date.getDate()).slice(-2).toString();
    let hour = ("0" + date.getHours()).slice(-2).toString();
    let minute = ("0" + date.getMinutes()).slice(-2).toString();

    return month + '/' + day + " " + hour + ":" + minute;
}
function formatTimeStampToMonth(timestamp) {
    if (timestamp === null || timestamp === undefined) {
        return '-';
    }
    let date = new Date(timestamp);
    let month = ("0" + (date.getMonth() + 1)).slice(-2).toString();
    let day = ("0" + date.getDate()).slice(-2).toString();

    return month + '/' + day;
}

export const datetimeService = {
    formatTimeStampToDate, formatTimeStampToDateTime, formatTimeStampToHourTime,formatTimeStampToMonth,formatTimeStampToDateHour
}