var mysql = require('mysql');
var dbconn = mysql.createConnection({
    host     : 'bitin-test.cljmcewzltc4.ap-northeast-2.rds.amazonaws.com',
    user     : 'roboboot',
    password : 'fhqhqnxm123!K',
    database : 'bitin'
});
dbconn.connect();
const secondOfDay = 86400000;
const trade_amount = 100000000;
var time_table = [];
var amount_table = [];
var total_time = 0;
var total_price = 0;
var NOWTIME;
var index = 0;
var date = new Date().getTime() + testONOFF;
var real_time = new Date(date).toString().substring(16,24);
date = date - ((parseInt(real_time.substring(0,2)) * 3600000) + (parseInt(real_time.substring(3,5)) * 60000) + (parseInt(real_time.substring(6,8)) * 1000) - 240000);
total_time = date;
var stack = 0;
var price_index = 0;
var price_stack = 0;
var price_random_stack = 0;
var price_random_small_stack = 0;
var random_table = [];
var testONOFF = 0;
//var testONOFF = 32400000;






setInterval(() => {
    NOWTIME = new Date().getTime() + testONOFF;
    if(stack == 0) {
        for(var i = 0; i < 5000; i++) {
            time_table[i] = 0;
            amount_table[i] = 0;
        }

        total_time = 0;
        date = new Date().getTime() + testONOFF;
        real_time = new Date(date).toString().substring(16,24);
        date = date - ((parseInt(real_time.substring(0,2)) * 3600000) + (parseInt(real_time.substring(3,5)) * 60000) + (parseInt(real_time.substring(6,8)) * 1000) - 240000);
        console.log("real_time : "+new Date(date).toString());
        total_time = date + 180000;
        total_price = 0;
        index = 0;
        price_index = 0;
        price_stack = 0;
        price_random_stack = 0;
        price_random_small_stack = 0;

        while(secondOfDay + date - 100000 > total_time) {
            total_time += Math.floor(Math.random() * 45000) + 15000;
            time_table[index] = total_time;
    
            dbconn.query("UPDATE test SET time = " + time_table[index] + " WHERE no = "+parseInt(index+1), function(err, rows, fields) {
                if (err){
                    throw err;
                }
            });
            index++;
        }

        for(var i = 0; i < index; i++) {
            amount_table[i] = Math.random() * 3000 + 1000;
            price_random_small_stack += amount_table[i];
            //console.log(price_random_small_stack);
        }

        price_stack = trade_amount - price_random_small_stack;
        //console.log(price_random_small_stack);

        while(price_stack > 0) {
            price_random_stack = Math.random() * 100000;
            random_table[price_index] = price_random_stack;
            price_stack -= price_random_stack;
            price_index++;
        }
        price_index--;

        random_table[price_index] += price_stack;

        for(var i = 0; i <= price_index; i++) {
            var random = Math.floor(index * Math.random());
            amount_table[random] += random_table[i];
            //console.log(amount_table[random]);
        }

        for(var i = 0; i < 5000; i++) {
            if (i == index - 1) {
                amount_table[i] += 1100;
            }
            total_price += Math.floor(amount_table[i]);
            dbconn.query("UPDATE test SET amount = " + Number.parseFloat(amount_table[i]).toFixed(0)
                + " , time = " + time_table[i] + " WHERE no = "+parseInt(i+1), function(err, rows, fields) {
                if (err){
                    throw err;
                }
            });
        }

        dbconn.query("UPDATE test SET amount = " + total_price + ", time = " + index + " WHERE no = 10003", function(err, rows, fields) {
            if (err){
                throw err;
            }
        });

        console.log("total amount : "+index);
        console.log("total price : "+total_price+" won");
        stack = 1;
    }else if(new Date(NOWTIME).toString().substring(16,24) == "00:00:00") {
        stack = 0;
    }
}, 1000);