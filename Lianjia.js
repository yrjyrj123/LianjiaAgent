var async = require("async");
var fs = require("fs");
var _ = require("underscore");
var lianjia_api = require('./lib/lianjia_api.js');

const OUTPUT = "Lianjia.csv";
const MAX_ASYNC_OP = 64;

console.log("Start running ...");

lianjia_api.get_count(function (err, count) {
    console.log("There are about " + count + " records");
    async.mapLimit(_.range(0, count, lianjia_api.MAX_STEP_LEN), MAX_ASYNC_OP, function (item, map_callback) {
        async.retry({times: 10, interval: 2000}, function (retry_callback) {
            lianjia_api.request_data(lianjia_api.CITY_ID_BJ, item, lianjia_api.MAX_STEP_LEN, function (err, res) {
                if (res.data.list.length != 0) {
                    retry_callback(null, res.data.list);
                } else {
                    // console.log("request " + item + " need retry");
                    retry_callback("no data", res.data.list);
                }
            });
        }, function (err, result) {
            map_callback(err, result);
        });
    }, function (err, results) {
        results = _.flatten(results);
        results = _.map(results, function (item) {
            return lianjia_api.csv_line(item);
        })
        var fout = fs.createWriteStream(OUTPUT);
        var buffer = Buffer.concat([new Buffer('\xEF\xBB\xBF', 'binary'), new Buffer(lianjia_api.csv_title() + "\n")]);
        fout.write(buffer);
        fout.close();

        fs.appendFile(OUTPUT, results.join("\n"), function (err) {
            if (err) {
                console.log(err);
            }
            console.log("Done");
        });
    });
});

