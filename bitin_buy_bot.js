
// Telegram Alert 
const TelegramBotApi = require("node-telegram-bot-api");
const bot = new TelegramBotApi('964723803:AAFC0iRCW2I4oWBf1Ak0MDK7lic3K04fiaQ');
const chatId = 825830374;

// Etc Module
var mysql = require('mysql');
const axios = require('axios');
const CryptoJS = require('crypto-js');
const querystring = require('querystring');

const APIKEY = 'bb88a69d-d9e9-41a1-bda9-9c3956aab401';
const APISECRET = 'STQjXG9Iud778Kq5J4AgTgcbawK8km0G';
const market = 'INCASH';
const currency = 'WXB';
const price_decimal_place = 1;
const amount_decimal_place = 3;
const minimum_unit = parseFloat(0.1);
const type = 'bid';

 
var dbconn = mysql.createConnection({
    host     : 'bitin-test.cljmcewzltc4.ap-northeast-2.rds.amazonaws.com',
    user     : 'roboboot',
    password : 'fhqhqnxm123!K',
    database : 'bitin'
});

var getNonce = function() {
				
    var timestamp;
    var unix = 0;
    
    timestamp 	= +new Date();
    unix 		= Math.round(timestamp / 1000);
    unix 		= unix + "." + (timestamp % 1000);
    
    return unix;
};

var makeSignature = function(secretKey, access_token, nonce, url, param) {
		    
    var hmacVal = "";
    
    if (access_token != '') { hmacVal	 = access_token + '$'; }
    if (nonce != '') 		{ hmacVal	+= nonce + '$'; }
    if (url != '') 			{ hmacVal	+= url + '$'; }
    if (param != '') 		{ hmacVal	+= param + '$'; }
    
    var hash = CryptoJS.HmacSHA512(hmacVal, secretKey);
    
    return hash.toString(CryptoJS.enc.Base64);
};

async function orderBook() {
    let URL = 'https://apis.korcx.com/v1/public/orderbook/'+market+'/'+currency;
    let nonce = getNonce();
    let config = {
        headers: {
            'Access-Control-Allow-Origin' : '*',
            'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Korcx-Nonce': nonce
        }
    }
    let r = await axios.get(URL, config);
    chunk_data_array = r.data.data;
    ask_array = chunk_data_array[1].ask;
    bid_array = chunk_data_array[0].bid;
    wall_ask = ask_array[0].orderPc;
    wall_bid = bid_array[0].orderPc;
}

async function trade(price, amount) {
    
    let param = {}
    param.orderSe = type;
    param.currency = currency;
    //param.orderQy = amount.toString());
    param.orderQy = '10';
    param.orderPc = price.toString();
    param.tradeSe = '01';
    param.market = market;

    console.log(param.orderPc)
    console.log(param.orderQy)

    let URL = 'https://apis.korcx.com/v1/order/sendform';
    let nonce = getNonce();
    let signature = makeSignature(APISECRET, access_token, nonce, URL, JSON.stringify(param));
    let config = {
        headers: {
            'Access-Control-Allow-Origin' : '*',
            'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Korcx-Nonce': nonce,
            'X-Korcx-Apikey': APIKEY,
            'X-Korcx-Token': access_token,
            'X-Korcx-Signature': signature,
            'access-control-request-method':'POST',
        }
    }
    let r = await axios.post(URL, querystring.stringify(param), config);
    console.log(r.data);
    index++;
}

async function unsolved() {

    let URL = 'https://apis.korcx.com/v1/order/activeorder/'+market+'/'+currency;
    let nonce = getNonce();
    let signature = makeSignature(APISECRET, access_token, nonce, URL, '');
    let config = {
        headers: {
            'Access-Control-Allow-Origin' : '*',
            'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Korcx-Nonce': nonce,
            'X-Korcx-Apikey': APIKEY,
            'X-Korcx-Token': access_token,
            'X-Korcx-Signature': signature,
            'access-control-request-method':'POST',
        }
    }
    let r = await axios.post(URL, '', config);
    chunk_data = JSON.stringify(r.data.data);
}

async function cancelAll() {

    let URL = 'https://apis.korcx.com/v1/order/cancelall/'+market+'/'+currency;
    let nonce = getNonce();
    let signature = makeSignature(APISECRET, access_token, nonce, URL, '');
    let config = {
        headers: {
            'Access-Control-Allow-Origin' : '*',
            'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Korcx-Nonce': nonce,
            'X-Korcx-Apikey': APIKEY,
            'X-Korcx-Token': access_token,
            'X-Korcx-Signature': signature,
            'access-control-request-method':'POST',
        }
    }
    let r = await axios.post(URL, '', config);
}

  
// Variation
var stack = 0;
var index = 0;
var testONOFF = 32400000;
//var testONOFF = 0;
var real_time = new Date().getTime() + testONOFF;
var time_table = [];
var trade_table = [];
var table_no = [];
var chunk_data_array = [];
var ask_array = [];
var bid_array = [];
var wall_ask;
var wall_bid;
var chunk_data ='';
var order_price;
var order_amount;
var random_sequence;

var access_token = '';
var DB_stack = 0;

for(var i = 0; i < 6000; i++) {
    time_table[i] = 0;
    trade_table[i] = 0;
    table_no[i] = 0;
}

var u = 0;
dbconn.connect();

for(var i = 0; i < 5000; i++) {
    
    dbconn.query("SELECT * FROM test WHERE no = " + (i + 1), function(err, rows, fields) {
        if (err){
            throw err;
        }
        rows.forEach( (row) => { time_table[u] = row.time + testONOFF; trade_table[u] = row.amount; table_no[u] = row.no;
            real_time = new Date().getTime() + testONOFF;
            if(Math.abs(time_table[u] - real_time) < 100000) {
                index = table_no[u] - 1;
                if(new Date(real_time).toString().substring(16,24) > new Date(time_table[index]).toString().substring(16,24)) {
                    index = table_no[u];
                }
            };
            if( u == 4999) {
                DB_stack = 1;
            };
        });
        u++;
    }); 
}




setInterval(() => {
    real_time = new Date().getTime() + testONOFF;
    random_sequence = parseFloat(Number.parseFloat(Math.random() * 100).toFixed(0));
    console.log('INDEX : '+index+' / DB_stack : '+DB_stack);
    console.log('NOW TIME : '+new Date(real_time).toString().substring(1,24));
    console.log('NEXT TIME : '+new Date(time_table[index]).toString().substring(1,24));
    if(new Date(real_time) > new Date((time_table[index]) + 30000) ) {
        index++;
    }
    if(new Date(real_time).toString().substring(16,24) == "00:02:00" && stack == 0) {
        stack = 1;
        index = 0;
        index_stack = 3600;
        date = new Date().getTime() + testONOFF;

        for(var i = 0; i < 6000; i++) {
            time_table[i] = 0;
            trade_table[i] = 0;
            table_no[i] = 0;
        }

        u = 0;
    
        for(var i = 0; i < 5000; i++) {
            dbconn.query("SELECT * FROM test WHERE no = " + (i + 1), function(err, rows, fields) {
                if (err){
                    throw err;
                }
                rows.forEach( (row) => { time_table[u] = row.time + testONOFF; trade_table[u] = row.amount; table_no[u] = row.no;
                    real_time = new Date().getTime() + testONOFF;
                    if(Math.abs(time_table[u] - real_time) < 100000) {
                    index = table_no[u] - 1;
                    if(new Date(real_time).toString().substring(16,24) > new Date(time_table[index]).toString().substring(16,24)) {
                        index = table_no[u];
                    }
                };
                u++;});
            }); 
        }

    }else if(new Date(real_time).toString().substring(16,24) == new Date(time_table[index]).toString().substring(16,24) && stack == 0 && time_table[index] != 0 && DB_stack == 0) {
        index++;
    }else if(new Date(real_time).toString().substring(16,24) == new Date(time_table[index]).toString().substring(16,24) && stack == 0 && time_table[index] != 0 && DB_stack == 1) {
        stack = 1;
        dbconn.query("SELECT * FROM test WHERE no = 10003", function(err, rows, fields) { 
            if (err){
                throw err;
            }
            rows.forEach( (row) => { 
                access_token = row.purpose;
                order_price = Number.parseFloat(row.price).toFixed(price_decimal_place);
            });
        });
        orderBook();

        var timeout1 = setTimeout(() => {
            order_amount = Number.parseFloat(trade_table[index] / order_price).toFixed(amount_decimal_place);
            if(parseFloat(order_price) >= parseFloat(wall_ask)) {
                order_price = parseFloat(wall_ask) - minimum_unit;
                console.log("order_price : "+order_price)
                console.log("order_amount : "+order_amount)
                console.log("order_amount_original : "+trade_table[index])
                trade(order_price, order_amount);
            }else if(parseFloat(order_price) <= parseFloat(wall_bid)) {
                order_price = parseFloat(wall_bid) + minimum_unit;
                console.log("order_price : "+order_price)
                console.log("order_amount : "+order_amount)
                console.log("order_amount_original : "+trade_table[index])
                trade(order_price, order_amount);
            }else if((parseFloat(wall_ask) - parseFloat(wall_bid)) == minimum_unit) {
                bot.sendMessage(chatId, new Date(real_time).toString() + " There's no space. Can't make a deal.. AMOUNT : ["+trade_table[index]+"]  [" + currency + "]");
            }else {
                console.log("order_price : "+order_price)
                console.log("order_amount : "+order_amount)
                console.log("order_amount_original : "+trade_table[index])
                trade(order_price, order_amount);
            }
        }, 1000 + random_sequence);

        var timeout2 = setTimeout(() => {
            unsolved();
        }, 4000);

        var timeout3 = setTimeout(() => {
            if(chunk_data != '[]') {
                cancelAll();
            }
        }, 5000);

        var timeout4 = setTimeout(() => {
            clearTimeout(timeout1);
            clearTimeout(timeout2);
            clearTimeout(timeout3);
        }, 6000);
        clearTimeout(timeout4); 
    }else if(stack == 1) {
        stack = 0;
    }
}, 1000);
