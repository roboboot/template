  var https = require('https');
  var crypto = require('crypto');
  var querystring = require('querystring');
  const TelegramBotApi = require("node-telegram-bot-api");
  const bot = new TelegramBotApi('964723803:AAFC0iRCW2I4oWBf1Ak0MDK7lic3K04fiaQ');
  const chatId = '-328419166';
  const chatId_admin = 825830374;
  const baseUrl = "openapi.digifinex.vip"
  //const appKey_buy = "15d94c90dbd06d"
  //const appSecret_buy = "c23cc6ad817acae39db4e3e3300d4f9f05d94c90d"
  //const appKey_buy = "15d96aa84338dc"
  //const appSecret_buy = "1e3caf35f1b319464083a5041aa2045505d96aa84"
  //const appKey_buy = "15d9e8c7b4bc5c"
  //const appSecret_buy = "b7a5a09df6ccf4c80552f5978489e16505d9e8c7b"
  //const appKey_buy = "15d9e8b35cc3ba" //hoga
  //const appSecret_buy = "d89c07ffdf0d7ec724552d5d9cd7b84605d9e8b35"
  //const appKey_buy = "15db10f9f775e9" //wihte
  //const appSecret_buy = "82775b73c844d6117b987b9c7137703305db10f9f"
  const appKey_buy = "15c88a954a584f" //wihte2
  const appSecret_buy = "fc9f8210cc1469fef21515cbce71863205c88a954"
  var error_con = '';
  error_list = function(error_num) {
      switch(parseInt(error_num)) {
          case 10001: error_con = "Wrong request method, please check it's a GET or POST request"; break;
          case 10002: error_con = "Invalid ApiKey"; break;
          case 10003: error_con = "Sign doesn't match"; break;
          case 10004: error_con = "Illegal request parameters"; break;
          case 10005: error_con = "Request frequency exceeds the limit"; break;
          case 10006: error_con = "Unauthorized to execute this request"; break;
          case 10007: error_con = "IP address Unauthorized"; break;
          case 10008: error_con = "Timestamp for this request is invalid"; break;
          case 10009: error_con = "Unexist endpoint, please check endpoint URL"; break;
          case 10011: error_con = "ApiKey expired. Please go to client side to re-create an ApiKey"; break;
          case 20002: error_con = "Trade of this trading pair is suspended"; break;
          case 20007: error_con = "Price precision error"; break;
          case 20008: error_con = "Amount precision error"; break;
          case 20009: error_con = "Amount is less than the minimum requirement"; break;
          case 20010: error_con = "Cash Amount is less than the minimum requirement"; break;
          case 20011: error_con = "Insufficient balance"; break;
          case 20012: error_con = "Invalid trade type (valid value: buy/sell)"; break;
          case 20013: error_con = "No order info found"; break;
          case 20014: error_con = "Invalid date (Valid format: 2018-07-25)"; break;
          case 20015: error_con = "Date exceeds the limit"; break;
          case 20018: error_con = "Your have been banned for API trading by the system"; break;
          case 20019: error_con = "Wrong trading pair symbol, correct format:'base_quote', e.g. 'btc_usdt'"; break;
          case 20020: error_con = "You have violated the API trading rules and temporarily banned for trading. At present, we have certain restrictions on the user's transaction rate and withdrawal rate."; break;
          case 20021: error_con = "Invalid currency"; break;
          case 20022: error_con = "The ending timestamp must be larger than the starting timestamp"; break;
          case 20023: error_con = "Invalid transfer type"; break;
          case 20024: error_con = "Invalid amount"; break;
          case 20025: error_con = "This currency is not transferable at the moment"; break;
          case 20026: error_con = "Transfer amount exceed your balance"; break;
          case 20027: error_con = "Abnormal account status"; break;
          case 20028: error_con = "Blacklist for transfer"; break;
          case 20029: error_con = "Transfer amount exceed your daily limit"; break;
          case 20030: error_con = "You have no position on this trading pair"; break;
          case 50000: error_con = "Exception error"; break;
          case 500500: error_con = "Server error"; break;
          default: error_con = "Unknown error"; break;
      }
      error_con += '  ==> WILL BE STOPPED THIS BOT PROGRAM. CHECK PLEASE !!';
  }
  calc_sign_buy = function(data) {
      var content = querystring.stringify(data);
      return crypto.createHmac('sha256', appSecret_buy).update(content).digest('hex')
  }
var array = [100];
var chunk_parse;
var parse2;
var parse3 = [];
var parse4 = [];
  do_request_buy = function(method, path, data = {}, needSign = false) {
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
          options.headers['ACCESS-KEY'] = appKey_buy;
          options.headers['ACCESS-TIMESTAMP'] = parseInt(Date.now() / 1000);
          options.headers['ACCESS-SIGN'] = calc_sign_buy(data);
      }
      //console.log('request: ' + JSON.stringify(options));
      var req = https.request(options, function (res) {
          //console.log('STATUS: ' + res.statusCode);
          //console.log('HEADERS: ' + JSON.stringify(res.headers));
          res.setEncoding('utf8');

          res.on('data', function (chunk) {
              console.log('BODY: ' + chunk);
              //chunk_parse = JSON.parse(chunk);
              chunk_parse += chunk;
              if(chunk.substring(2,6) == "code" && chunk.substring(8,9) != "0") {
                error_list(chunk.substring(8,chunk.length - 1));
                var error_date = new Date();
                var Fdate = error_date.getFullYear() + 
                            '/' + error_date.getMonth() +
                            '/' + error_date.getDay() +
                            ' ' + error_date.getHours() +
                            ':' + error_date.getMinutes() +
                            ':' + error_date.getSeconds() + '';
                //bot.sendMessage(chatId_admin, Fdate + ' ERROR '+ chunk.substring(8,chunk.length - 1) + '   ' + error_con);
              }
              //lastprice = JSON.stringify(json["ticker"]["krw_mch"]["last"]);
              //lastprice = JSON.stringify(chunk_parse["bids"]);
              //console.log(chunk);
              
              //ask = chunk_parse.asks;
              //bid = chunk_parse.bids;
          }

          );
      });
      req.on('error', function (e) {
          console.log('problem with request: ' + e.message);
      });
      if (method != 'GET') {
          req.write(content);
      }
      req.end();
  }
  //var date = new Date().getTime() / 1000;
  //console.log(date);
  /*
  do_request_buy('POST', '/spot/order/new', {
    symbol: 'axl_eth',
    price: 0.00009227,
    amount: 5000,
    type: 'sell',
}, true)*/


//do_request_buy('GET', '/spot/order/current', {symbol: 'mch_usdt'}, true);
do_request_buy('GET', '/spot/assets', {}, true);
/*
var timeout1 = setTimeout(() => {
    parse2 = chunk_parse.substring(9,chunk_parse.length);
    //var chunk_par = JSON.parse(chunk_parse)
}, 3000)
var timeout2 = setTimeout(() => {
    //console.log(chunk_parse);
    parse2 = JSON.parse(parse2);
    parse3 = parse2.data;

    for(var i = 0; i < 22; i++) {
        if(parse3[i]) {
        parse4[i] = parse3[i].order_id;

        console.log(i, parse4[i]);
        do_request_buy('POST', '/spot/order/cancel', {order_id: parse4[i]}, true);
        }
    }
    //console.log(parse2);
}, 6000)
//do_request_buy('GET', '/order_book', {symbol:"mch_usdt"}, false);
/*
var all_cancel = [];
var cancel = [30];
do_request_buy('GET', '/spot/order/current', {symbol: 'mch_usdt'}, true);
var time = setTimeout(() => {
    all_cancel = chunk_parse.data;
    console.log(all_cancel);
}, 1000);
var time1 = setTimeout(() => {
    for(var i = 0; i < 30; i++) {
        if(all_cancel[i].order_id) {
            cancel[i] = all_cancel[i].order_id;
        }else {
            break;
        }
    }
    clearTimeout(time);
}, 2000);
var time2 = setTimeout(() => {
    for(var i = 0; i < 5; i++) {
        if(cancel[i]) {
            do_request_buy('POST', '/spot/order/cancel', {order_id: cancel[i]}, true);    
        }else {
            break;
        }
    }
    clearTimeout(time1);
}, 3000);
var time3 = setTimeout(() => {
    for(var i = 5; i < 10; i++) {
        if(cancel[i]) {
            do_request_buy('POST', '/spot/order/cancel', {order_id: cancel[i]}, true);    
        }else {
            break;
        }
    }
    clearTimeout(time2);
}, 4000);
var time4 = setTimeout(() => {
    for(var i = 10; i < 15; i++) {
        if(cancel[i]) {
            do_request_buy('POST', '/spot/order/cancel', {order_id: cancel[i]}, true);    
        }else {
            break;
        }
    }
    clearTimeout(time3);
}, 5000);
var time5 = setTimeout(() => {
    for(var i = 15; i < 20; i++) {
        if(cancel[i]) {
            do_request_buy('POST', '/spot/order/cancel', {order_id: cancel[i]}, true);    
        }else {
            break;
        }
    }
    clearTimeout(time4);
}, 6000);
var time6 = setTimeout(() => {
    for(var i = 20; i < 25; i++) {
        if(cancel[i]) {
            do_request_buy('POST', '/spot/order/cancel', {order_id: cancel[i]}, true);    
        }else {
            break;
        }
    }
    clearTimeout(time5);
}, 7000);
var time7 = setTimeout(() => {
    for(var i = 25; i < 30; i++) {
        if(cancel[i]) {
            do_request_buy('POST', '/spot/order/cancel', {order_id: cancel[i]}, true);    
        }else {
            break;
        }
    }
    clearTimeout(time6);
}, 8000);
clearTimeout(time7);
*/
//do_request_buy('POST', '/spot/position/close', {symbol: 'mch_usdt'}, true);

  //do_request_buy('GET', '/kline', {symbol: 'btc_usdt', period: 1}, false);
  //do_request_buy('GET', '/spot/assets', {}, true);
/*
  var stack1 = [2];
  var price1 = [6];
  var price2 = [6];
  var price3;
  var price4;
  var timestamp;

  var time = setTimeout(() => {
    timestamp = chunk_parse.server_time;
    do_request_buy('GET', '/kline', {symbol: 'btc_usdt', period: 1, start_time: timestamp - 120}, false);
  }, 800)
  var kline = setTimeout(() => {
    stack1 = chunk_parse.data;
    price1 = stack1[0];
    price2 = stack1[1];
    price3 = ((((Math.round((price1[5] / price2[5]) * 10000) / 10000) - 1) * 1) + 1);
    price4 = Math.round(price3 * 0.245223 * 1000000) / 1000000;
    console.log(price3);
    console.log(price4);
    clearTimeout(time);
  }, 1600)
  var price = setTimeout(() => {
    clearTimeout(kline);
  }, 2400)
  clearTimeout(price);

  */