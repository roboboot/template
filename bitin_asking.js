
// Telegram Alert 
const TelegramBotApi = require("node-telegram-bot-api");
const bot = new TelegramBotApi('964723803:AAFC0iRCW2I4oWBf1Ak0MDK7lic3K04fiaQ');
const chatId = 825830374;

// Etc Module
var mysql = require('mysql');
const axios = require('axios');
const CryptoJS = require('crypto-js');
const querystring = require('querystring');

const APIKEY = 'px613966s-6563-7r29-b14s-es2wv5h7xd9'; // CONFIG!!!
const APISECRET = '94rsn7os36315x571j2av1akrkn4x674'; // CONFIG!!!
const market = 'KRW'; // CONFIG!!!
const currency = 'RTR'; // CONFIG!!!
const price_decimal_place = 1; // CONFIG!!!
const amount_decimal_place = 3; // CONFIG!!!
const minimum_unit = parseFloat(0.1); // CONFIG!!!

 
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

//----------------------------------------------------------------------------------------------------------------------------------------------

async function unsolved() {
    let URL = 'https://apis.coinhole.kr/v1/order/activeorder/'+market+'/'+currency;
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
    order_array = r.data.data;      //.orderSe = type, .orderDttm = time, .orderPc = price,
                                    //.orderQy = amount, .dcnt = exective amount, .orderNo = order number                         
    for(var i = 0; i < 50; i++) {
        try {
            if(order_array[i].orderSe == 'ask') {
                ask_weight++;
                index++;
                probability += 0.02;
                probability = parseFloat(parseFloat(probability).toFixed(2));
            }else if(order_array[i].orderSe == 'bid') {
                bid_weight++;
                index++;
                probability += 0.02;
                probability = parseFloat(parseFloat(probability).toFixed(2));
            }
        }catch(e) {}
    }
    dbconn.query("UPDATE test SET order_number = " + index + " WHERE no = 10003;", function(err, rows, fields) {
        if (err){
            throw err;
        }
    });
}


async function trade1(price, amount, type) {
    
    let param = {}
    param.orderSe = type;
    param.currency = currency;
    param.orderQy = '10';
    param.orderPc = price;
    param.tradeSe = '01';
    param.market = market;
    
    //let results = await approval();
    //console.log(results);
    //let token = results.data.accessToken;

    let URL = ' https://apis.coinhole.kr/v1/order/sendform';
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
    console.log(r.data)
}

async function cancel(orderNo) {
    
    let param = {}
    param.market = market;
    param.currency = currency;
    param.orderNo = orderNo;

    let URL = ' https://apis.coinhole.kr/v1/order/cancel';
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
}
  
// Variation
var stack = 0;
var index = 0;
//var testONOFF = 32400000;
var testONOFF = 0;
var real_time = new Date().getTime() + testONOFF;
var order_array = []; //.orderSe = type, .orderDttm = time, .orderPc = price,
                      //.orderQy = amount, .dcnt = exective amount, .orderNo = order number
var ask_weight = 1;
var bid_weight = 1;
var type_const;
var probability = 0;
var random_timer;
var random_sequence;
var random_order_price;
var random_order_amount;
var random_type;
var random_cancel;
var wall_ask;
var wall_bid;
var order_price;
var order_amount;
var index;

            

dbconn.connect();



!function loop() {
    random_timer = Math.random() * 10000 + 1500;
    random_sequence = Math.random();
    random_order_price = parseFloat(parseFloat(Math.random() * 3 + 0.1).toFixed(1))
    random_order_amount = parseFloat(parseFloat(Math.random() * 5000 + 5000).toFixed(0));
    random_type = Math.random();
    index = 0;
    probability = 0;
    ask_weight = 1;
    bid_weight = 1;

    console.log("timer : "+ parseFloat(random_timer / 1000).toFixed(2));
    dbconn.query("SELECT * FROM test WHERE no = 10003", function(err, rows, fields) { 
        if (err){
            throw err;
        }
        rows.forEach( (row) => { 
            access_token = row.purpose;
            wall_ask = row.wall_ask;
            wall_bid = row.wall_bid;
        });
    });

    var timeout1 = setTimeout(() => {
        unsolved();
    }, 400)

    var timeout2 = setTimeout(() => {
        if(probability <= random_sequence && index < 50) {                  //order
            console.log('probability : '+probability);
            console.log('random_sequence : '+random_sequence);
            type_const = ask_weight / (ask_weight + bid_weight);

            if(type_const <= random_type){                                  //ask
                order_price = parseFloat(parseFloat(wall_ask) + random_order_price).toFixed(1);
                order_amount = Number.parseFloat(random_order_amount / order_price).toFixed(amount_decimal_place);
                console.log("ASK!! : " + order_price + " / " + order_amount);
                trade1(order_price, order_amount, 'ask');
                
            }else {                                                         //bid
                order_price = parseFloat(parseFloat(wall_bid) - random_order_price).toFixed(1);
                order_amount = Number.parseFloat(random_order_amount / order_price).toFixed(amount_decimal_place);
                console.log("BID!! : " + order_price + " / " + order_amount);
                trade1(order_price, order_amount, 'bid');
            }

        }else if(probability > random_sequence && index > 0) {              //cancel
            random_cancel = parseFloat(Math.random() * (index - 0.001)).toFixed(0);
            try {
                console.log("CANCEL!! : " + random_cancel + " / " + order_array[random_cancel].orderNo);
                cancel(order_array[random_cancel].orderNo);
            }catch(e){}
        }
        
    }, 1200)

    var timeout3 = setTimeout(() => {
        loop();
    }, random_timer)
}()
