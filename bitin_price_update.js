

const TelegramBotApi = require("node-telegram-bot-api");
const bot = new TelegramBotApi('964723803:AAFC0iRCW2I4oWBf1Ak0MDK7lic3K04fiaQ');
const chatId = 825830374;

const request = require('request');
const API_URL = "https://apis.coinhole.kr/v1";
const APIKEY = 'px613966s-6563-7r29-b14s-es2wv5h7xd9'; // CONFIG!!!
const APISECRET = '94rsn7os36315x571j2av1akrkn4x674'; // CONFIG!!!
const market = 'KRW'; // CONFIG!!!
const currency = 'RTR'; // CONFIG!!!
const axios = require('axios');
var CryptoJS = require("crypto-js");
var querystring = require('querystring');
var https = require('https');
let md5 = require('md5');
var mysql = require('mysql');
var dbconn = mysql.createConnection({
    host     : 'rtrcoin.cljmcewzltc4.ap-northeast-2.rds.amazonaws.com', // CONFIG!!!
    user     : 'roboboot',
    password : 'fhqhqnxm123!K',
    database : 'rtr' // CONFIG!!!
});
const baseUrl = "openapi.digifinex.vip"
const appKey = "15c88a954a584f" //global_wihte2
const appSecret = "fc9f8210cc1469fef21515cbce71863205c88a954" //global_wihte2
var TIMESTAMP = parseInt(Date.now() / 1000);;
let data = '';
let data1 = [2];
var chunk_parse;
var chunk_parse_v3;
var chunk_parse_candle;
var candle_raw = [];
var standard_last1;
var standard_last2;
var current_last;
var rate;

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

function orderBook() {
    let currTime = parseInt(Date.now() / 1000);
    // Set the headers
    var headers = {
        'X-Korcx-Nonce':currTime
    }    
    // Configure the request
    var options = {
        url: `${API_URL}/public/orderbook/INCASH/WXB`,
        method: 'GET',
        headers: headers,
        qs: {}
    }
    // Start the request
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // Print out the response body
            chunk_parse = JSON.parse(body);
            //console.log(body)
            //body = '';
        } else {
            console.log(error)
        }
    })
}

calc_sign = function(data) {
    var content = querystring.stringify(data);
    return crypto.createHmac('sha256', appSecret).update(content).digest('hex')
}

do_request = function(method, path, data = {}, needSign = false) {
    var content = querystring.stringify(data);
    var options = {
        hostname: baseUrl,
        port: 443,
        path: '/v3' + path,
        method: method,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.52 Safari/537.17',
        }
    };
    if (method == "GET" && content != "") {
        options.path += '?' + content;
    }
    if (needSign) {
        options.headers['ACCESS-KEY'] = appKey;
        options.headers['ACCESS-TIMESTAMP'] = parseInt(Date.now() / 1000);
        options.headers['ACCESS-SIGN'] = calc_sign(data);
    }
    //console.log('request: ' + JSON.stringify(options));
    var req = https.request(options, function (res) {
        //console.log('STATUS: ' + res.statusCode);
        //console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            //console.log('BODY: ' + chunk);
            data += chunk;
            chunk_parse_v3 = JSON.parse(chunk);
            //console.log(data);
        });
    });
    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });
    if (method != 'GET') {
        req.write(content);
    }
    req.end();
}

async function candle() {
    return new Promise(function(resolve, reject){
        TIMESTAMP = parseInt(Date.now() / 1000);
        var TIMESTAMP_start = parseInt(Date.now() / 1000) - 70;
        params = {};
        /*keys = Object.keys(params).sort(), arr = [];
        keys.forEach(function(key){
            arr.push(params[key]);
        });
        sign = md5(arr.join(''));*/
        var url = 'https://global-openapi.bithumb.pro/openapi/v1/spot/kline?symbol='+'ETH-USDT'+'&type='+'m1'+'&start='+TIMESTAMP_start+'&end='+TIMESTAMP;
        https.get(url, (resp) => {
        data = '';
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            //console.log(data);
            chunk_parse_candle = JSON.parse(data);
            //chunk_parse_buy = data;
            //console.log(chunk_parse_buy);
            //chunk_parse_buy = JSON.parse(chunk_parse_buy);
            //console.log(chunk_parse_candle);
            resolve(chunk_parse_candle);
        });

      }).on("error", (err) => {
        console.log("Error: " + err.message);
        resolve(err.message);
      });
    });
};

function approval() {
    let URL = `${API_URL}/auth/approval`
    let nonce = getNonce();
    let signature = makeSignature(APISECRET, '', nonce, URL, '');
    //console.log(signature);
    //console.log(signature.length);
    let config = {
        headers: {
            'Access-Control-Allow-Origin' : '*',
            'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Korcx-Nonce': nonce,
            'X-Korcx-Apikey': APIKEY,
            'X-Korcx-Signature': signature,
            'access-control-request-method':'POST',
        }
      }
    axios.post(URL, '', config).then( result => { console.log(result.data.data.accessToken); 
        access_token = result.data.data.accessToken;

        dbconn.query("UPDATE test SET purpose = \"" + access_token
        + "\" WHERE no = 10003;", function(err, rows, fields) {
            if (err){
                throw err;
            }
        });
    })
}

function assetWrite() {
    let URL = `${API_URL}/account/balance`
    let nonce = getNonce();
    let signature = makeSignature(APISECRET, access_token, nonce, URL, '');
    //console.log(signature);
    //console.log(signature.length);
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
    axios.post(URL, '', config).then( result => { 
        asset_array = result.data.data;
        approval();
        try {
            for(var i = 0; i < 100; i++) {
                if(asset_array[i].currency == market) {
                    dbconn.query("UPDATE test SET cash = " + asset_array[i].balance + " WHERE no = 10003;", function(err, rows, fields) {
                        if (err){
                            throw err;
                        }
                    });
                }else if(asset_array[i].currency == currency) {
                    dbconn.query("UPDATE test SET asset = " + asset_array[i].balance + " WHERE no = 10003;", function(err, rows, fields) {
                        if (err){
                            throw err;
                        }
                    });
                }
            }
        } catch(e) {
        }
    })
}

function assetRead() {
    let URL = `${API_URL}/account/balance`
    let nonce = getNonce();
    let signature = makeSignature(APISECRET, access_token, nonce, URL, '');
    //console.log(signature);
    //console.log(signature.length);
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
    axios.post(URL, '', config).then( result => { 
        asset_array = result.data.data;
        try {
            for(var i = 0; i < 100; i++) {
                if(asset_array[i].currency == market) {
                    console.log("cash_amount : "+cash_rate);
                    console.log("current cash_amount : "+asset_array[i].balance)
                    cash_rate = cash_rate / parseFloat(asset_array[i].balance);
                    console.log("cash_rate : "+cash_rate);
                    if(cash_rate > 1.01 || cash_rate < 0.99) {
                        cash_alert_stack++;
                        if(cash_alert_stack > 4){
                            cash_alert_stack = 0;
                            bot.sendMessage(chatId, new Date(real_time).toString() + " [Cash_rate] is changed. CHECK PLEASE!! cash_rate : ["+cash_rate+"]  [" + currency + "]");
                        }
                    }else {
                        cash_alert_stack = 0;
                    }
                }else if(asset_array[i].currency == currency) {
                    console.log("asset_amount : "+asset_rate);
                    console.log("current asset_amount : "+asset_array[i].balance)
                    asset_rate = asset_rate / parseFloat(asset_array[i].balance);
                    console.log("asset_rate : "+asset_rate);
                    if(asset_rate > 1.01 || asset_rate < 0.99) {
                        asset_alert_stack++;
                        if(asset_alert_stack > 4){
                            asset_alert_stack = 0;
                            bot.sendMessage(chatId, new Date(real_time).toString() + " [asset_rate] is changed. CHECK PLEASE!! cash_rate : ["+asset_rate+"]  [" + currency + "]");
                        }
                    }else {
                        asset_alert_stack = 0;
                    }
                }
            }
        } catch(e) {
        }
    })
}

var stack = 0;
var index = 0;
var index_stack = 3600;
var ask_buy = [5];
var bid_buy = [5];
var ask1 = [2];
var ask2 = [2];
var ask3 = [2];
var ask4 = [2];
var ask5 = [2];
var bid1 = [2];
var bid2 = [2];
var bid3 = [2];
var bid4 = [2];
var bid5 = [2];
var standard_ask;
var standard_bid;
var standard_price = [2];
var ask_price = [10];
var bid_price = [10];
var ask_amount = [10];
var bid_amount = [10];
var register_price;
var candle_stack = 0;
var real_ask;
var real_bid;
var wall_ask;
var wall_bid;
var rising_weight = 0;
var falling_weight = 0;
var access_token = '';
var falling_stack = 0;
var rising_stack = 0;
var rate_time;
var saved_price;
var second_stack = 0;
var asset_array = [];
var cash_rate;
var asset_rate;
var real_time;
var testONOFF = 0;
var cash_alert_stack = 0;
var asset_alert_stack = 0;
//var testONOFF = 32400000;



dbconn.connect();
approval();


//dbconn.end();


setInterval(() => {
    real_time = new Date().getTime() + testONOFF;
    if(second_stack == 900 || second_stack == 0) {
        second_stack = 0;
        assetWrite();
        
    }
    second_stack++;
    if(stack == 0) {
        //do_request('GET', '/kline', {symbol: 'btc_usdt', period: 1, start_time: TIMESTAMP - 130, end_time: TIMESTAMP}, false);
        orderBook();
        dbconn.query("SELECT * FROM test WHERE no = 10003", function(err, rows, fields) {
            if (err){
                throw err;
            }
            rows.forEach( (row) => { standard_price[1] = row.price; rate_time = row.rate;
                cash_rate = row.cash; asset_rate = row.asset;
            });
            console.log("read standard_price[1] : "+standard_price[1]);
        });

        stack++;
    }else if(stack == 1) {
        data1 = chunk_parse.data;
        ask_buy = data1[1].ask;
        bid_buy = data1[0].bid;
        
        ask1[0] = ask_buy[0].orderPc; ask1[1] = ask_buy[0].bnt;
        bid1[0] = bid_buy[0].orderPc; bid1[1] = bid_buy[0].bnt;


        ask_price[0] = ask1[0]; ask_amount[0] = ask1[1];

        bid_price[0] = bid1[0]; bid_amount[0] = bid1[1];

        wall_ask = ask_price[0];
        wall_bid = bid_price[0];
 
        standard_price[0] = Math.round(((parseFloat(wall_ask) + parseFloat(wall_bid)) / 2) * 100) / 100; //fix
        candle();
        //do_request('GET', '/kline', {symbol: 'btc_usdt', period: 1, start_time: TIMESTAMP - 130, end_time: TIMESTAMP}, false);

        stack++;
        
    }else if(stack == 2) {
        candle_raw = chunk_parse_candle.data;
        standard_last1 = candle_raw[0];
        standard_last2 = candle_raw[1];
        console.log(standard_last1.c);
        console.log(standard_last2.c);
        stack++;
        assetRead();
    }else if(stack == 3) {
        rate = ((1 - (standard_last1.c / standard_last2.c)) * rate_time) + 1;
        
        register_price = rate * standard_price[1];
        if(register_price > standard_price[1] * 1.5) {
            register_price = standard_price[1];
            bot.sendMessage(chatId, "multiple error");
        }
        console.log("put register_price : "+register_price);

        if(register_price >= parseFloat(wall_ask)) {
            if(register_price >= parseFloat(wall_ask) && falling_stack > 50) {
                bot.sendMessage(chatId, new Date(real_time).toString() + " [FALLING WEIGHT] CHECK PLEASE!! [" + currency + "]");
            }
            register_price = parseFloat(wall_ask) - 0.1; //fix
            falling_weight = 1;
            falling_stack++;

        }else if(register_price <= parseFloat(wall_bid)) {
            if(register_price <= parseFloat(wall_bid) && rising_stack > 50) {
                bot.sendMessage(chatId, new Date(real_time).toString() + " [RISING WEIGHT] CHECK PLEASE!! [" + currency + "]");
            }
            register_price = parseFloat(wall_bid) + 0.1; //fix
            rising_weight = 1;
            rising_stack++;
        }

        if(falling_weight == 1) {
            //register_price -= 0.0000005; // when 0.00001
            register_price -= 0.005; // when 0.1
        }else if(rising_weight == 1) {
            //register_price += 0.0000005; // when 0.00001
            register_price += 0.005; // when 0.1
        }

        if(register_price < standard_price[0] && falling_weight == 1) {
            falling_stack = 0;
            falling_weight = 0;
            //bot.sendMessage(chatId, "BITIN FALLING WEIGHT = 0");
        }else if(register_price > standard_price[0] && rising_weight == 1) {
            rising_stack = 0;
            rising_weight = 0;
            //bot.sendMessage(chatId, "BITIN RISING WEIGHT = 0");
        }

        if(register_price == NaN) {
            register_price = saved_price;
        }

        register_price = Number.parseFloat(register_price).toFixed(5); // fix

        standard_price[1] = register_price;
        saved_price = register_price;
        

        console.log("rate : "+rate);
        console.log("register_price : "+register_price);

        dbconn.query("UPDATE test SET price = " + register_price + ", wall_ask = " + wall_ask
        + ", wall_bid = " + wall_bid + " WHERE no = 10003;", function(err, rows, fields) {
            if (err){
                throw err;
            }
        });

        stack = 0;

    }
}, 2000);
