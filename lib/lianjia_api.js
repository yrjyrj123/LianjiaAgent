var CryptoJS = require("crypto-js");
var https = require("https");
var _ = require("underscore");
require('dnscache')({
    "enable": true
});

const APP_ID = "20170324_android";
const App_Secret = "93273ef46a0b880faf4466c48f74878f";

const CITY_ID_BJ = 110000;
const MAX_STEP_LEN = 100;

function get_Authorization(city_id, limit_offset, limit_count, request_ts) {
    const sha1 = CryptoJS.SHA1(App_Secret +
        "city_id=" + city_id +
        "limit_count=" + limit_count +
        "limit_offset=" + limit_offset +
        "request_ts=" + request_ts).toString();
    return new Buffer(APP_ID + ":" + sha1).toString('base64');
}

function request_data(city_id, limit_offset, limit_count, callback) {//callback:function(err,res)
    var timestamp = Date.parse(new Date()) / 1000;
    var options = {
        hostname: "app.api.lianjia.com",
        port: 443,
        path: "/house/chengjiao/search?" +
        "city_id=" + city_id +
        "&limit_offset=" + limit_offset +
        "&limit_count=" + limit_count +
        "&request_ts=" + timestamp,
        method: 'GET',
        headers: {
            "Authorization": get_Authorization(city_id, limit_offset, limit_count, timestamp)
        }
    };

    const req = https.request(options, (res) => {
        var data_buffer = [];
        var size = 0;
        res.on('data', function (data) {
            data_buffer.push(data);
            size += data.length;
        });
        res.on("end", function () {
            var buff = Buffer.concat(data_buffer, size);
            var result = buff.toString();
            callback(null, JSON.parse(result));
        });

        req.on('error', function (e) {
            callback(e, null);
        });

    });
    req.end();
}

function get_count(callback) {//function(err,count)
    request_data(CITY_ID_BJ, 0, MAX_STEP_LEN, function (err, res) {
        callback(err, res.data.total_count);
    });
}

function csv_line(house) {
    return [
        //house.bizcircle_id,
        //house.community_id,
        _.has(house, "house_code") ? house.house_code : "",
        _.has(house, "title") ? house.title : "",
        //house.kv_house_type,
        //house.cover_pic,
        //house.frame_id,
        _.has(house, "blueprint_hall_num") ? house.blueprint_hall_num : "",
        _.has(house, "blueprint_bedroom_num") ? house.blueprint_bedroom_num : "",
        _.has(house, "area") ? house.area : "",
        _.has(house, "price") ? house.price : "",
        _.has(house, "unit_price") ? house.unit_price : "",
        _.has(house, "sign_date") ? house.sign_date : "",
        //house.sign_timestamp,
        _.has(house, "sign_source") ? house.sign_source : "",
        _.has(house, "orientation") ? house.orientation : "",
        _.has(house, "floor_state") ? house.floor_state : "",
        _.has(house, "building_finish_year") ? house.building_finish_year : "",
        _.has(house, "decoration") ? house.decoration : "",
        _.has(house, "building_type") ? house.building_type : ""
    ].join(",");
}

function csv_title() {
    return [
        //"商圈编号",
        //"社区编号",
        "房源编号",
        "标题",
        //"类型",
        //"封面照片",
        //"户型编号",
        "厅",
        "室",
        "面积",
        "价格",
        "单价",
        "成交时间",
        //"成交时间戳",
        "成交来源",
        "朝向",
        "楼层",
        "建成年代",
        "装修情况",
        "建筑类型",
    ].join(",");
}


module.exports.CITY_ID_BJ = CITY_ID_BJ;
module.exports.MAX_STEP_LEN = MAX_STEP_LEN;
module.exports.request_data = request_data;
module.exports.get_count = get_count;
module.exports.csv_line = csv_line;
module.exports.csv_title = csv_title;