const TelegramBotApi = require("node-telegram-bot-api");
const bot = new TelegramBotApi('964723803:AAFC0iRCW2I4oWBf1Ak0MDK7lic3K04fiaQ');
const chatId = 825830374;
const APIKEY = 'px613966s-6563-7r29-b14s-es2wv5h7xd9'; // CONFIG!!!
const APISECRET = '94rsn7os36315x571j2av1akrkn4x674'; // CONFIG!!!
const market = 'KRW'; // CONFIG!!!
const currency = 'RTR'; // CONFIG!!!
const axios = require('axios');
var CryptoJS = require("crypto-js");

var mysql = require('mysql');
var dbconn = mysql.createConnection({
    host     : 'rtrcoin.cljmcewzltc4.ap-northeast-2.rds.amazonaws.com', // CONFIG!!!
    user     : 'roboboot',
    password : 'fhqhqnxm123!K',
    database : 'rtr' // CONFIG!!!
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
    let URL = 'https://apis.coinhole.kr/v1/public/orderbook/'+market+'/'+currency;
    let nonce = getNonce();
    let config = {
        headers: {
            'Access-Control-Allow-Origin' : '*',
            'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Korcx-Nonce': nonce
        }
    }
    let r = await axios.get(URL, config);
    console.log(r.data)
}

async function orderList(TIMESTAMP) {
    TIMESTAMP = TIMESTAMP / 1000;

    let URL = 'https://apis.coinhole.kr/v1/public/order/'+market+'/'+currency;
    let nonce = getNonce();
    let config = {
        headers: {
            'Access-Control-Allow-Origin' : '*',
            'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Korcx-Nonce': nonce,
            'X-Korcx-Timestamp': TIMESTAMP
        }
    }
    let r = await axios.get(URL, config);
    if(JSON.stringify(r.data.data) == '[]') {
        //bot.sendMessage(chatId, new Date(Math.floor(TIMESTAMP + 300) * 1000).toString() + " [volume_bot] is not working. CHECK PLEASE!! [" + currency + "]");
    }
}

var testONOFF = 0;
//var testONOFF = 32400000;
var stack = 0;
var trade_list_check;
var trade_list_check_before;
var price_update_check;
var price_update_check_before;
var price_update_check_stack = 0;
var second_stack = 0;
var NOWTIME;
var asking_check;
var asking_check_before;
var asking_check_stack = 0;



dbconn.connect();



setInterval(() => {
    NOWTIME = new Date().getTime() + testONOFF;

    if(new Date(NOWTIME).toString().substring(16,24) == "00:02:00") {
        stack = 0;
    }else if(second_stack == 60) {
        stack = 1;
    }else if(second_stack % 59 == 0 && second_stack != 0){
        if(parseInt(new Date(NOWTIME).toString().substring(16,18)) == 0 && parseInt(new Date(NOWTIME).toString().substring(19,21)) < 4) {
            stack = 3;
        }else {
            stack = 2;
        }
    }else {
        stack = 3;
    }

    if(stack == 0) {
        dbconn.query("SELECT * FROM test WHERE no = 10003", function(err, rows, fields) {
            if (err){
                throw err;
            }
            rows.forEach( (row) => { trade_list_check = row.time;});
            if(trade_list_check == trade_list_check_before) {
                bot.sendMessage(chatId, new Date(NOWTIME).toString() + " [trade_list] is not working. CHECK PLEASE!! [" + currency + "]");
            }else {
                trade_list_check_before = trade_list_check;
            }
        });

        stack++;
    }else if(stack == 1) {
        dbconn.query("SELECT * FROM test WHERE no = 10003", function(err, rows, fields) {
            if (err){
                throw err;
            }
            rows.forEach( (row) => { price_update_check = row.price;
                asking_check = row.order_number;
            });
            if(asking_check == asking_check_before) {
                asking_check_stack++;
                if(asking_check_stack > 10) {
                    bot.sendMessage(chatId, new Date(NOWTIME).toString() + " [asking] is not working. CHECK PLEASE!! [" + currency + "]");
                }
            }else {
                asking_check_stack = 0;
                asking_check_before = asking_check;
            }
            if(price_update_check == price_update_check_before) {
                second_stack = 0;
                price_update_check_stack++;
                if(price_update_check_stack >= 3) {
                    price_update_check_stack = 0;
                    //bot.sendMessage(chatId, new Date(NOWTIME).toString() + " [price_update] is not working. CHECK PLEASE!! [" + currency + "]");
                }
            }else {
                price_update_check_before = price_update_check;
                price_update_check_stack = 0;
            }
        });
    }else if(stack == 2) {
        orderList(NOWTIME - 300000);
        second_stack++;
    }else if(stack == 3) {
        second_stack++;
    }
     
}, 1000);
