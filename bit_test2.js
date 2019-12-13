let md5 = require('md5');
let https = require('https');
var CryptoJS = require('crypto-js');
var request = require('request');
var querystring = require('querystring');
  var APIKEY = "cc2fa062906dc8fb79f55bdba08b5466"; //bithumb golbal1
  var APISECRET = "bd31c7cd06b5ab21fab77824c9bc42211b5857769a14d27fd956628dbce9eb2c";
  //var APIKEY = "f2628e75a3d9aa4322f25c86b9a88d74"; //bithumb golbal2
  //var APISECRET = "c6258b6fb101a325f969ef1a9ae5289faa245fdbb0fb32d2fb3d849271cc063b";
    const stock = 'MCH-USDT';
    var TIMESTAMP;
    //let params = {type: 'kline_1m', symbol: 'usdt_btc',  apiKey: APIKEY, apiSecret: APISECRET}; 
  let params;
	let keys;
  let sign;
  var price = 0.20;
  var amount = 2000;
  //var method = 'POST';
    //console.log(sign);
    let data = '';

    var ask_buy = [10];
    var ask = [2];
    var bid_buy = [10];
    var bid = [2];
    let chunk_parse;
  var type = 'buy';
  var ts;

function test() {
  let headers = {
    'Content-Type': 'application/json'
  }
  let currTime = Date.now();
  let param = {
    "apiKey" : APIKEY,
    "assetType" : "spot",
    "msgNo" : currTime,
    "timestamp" : currTime
  }
  let fromParam = querystring.stringify(param);
  //let fromParam = apiKey=${APIKEY}&assetType=spot&msgNo=${currTime}&timestamp=${currTime};
  let signature = CryptoJS.HmacSHA256(fromParam, APISECRET).toString(CryptoJS.enc.Hex);
  param['signature'] = signature;
  let url = 'https://global-openapi.bithumb.pro/openapi/v1/spot/assetList';
  let option = {
    url: url,
    method: 'POST',
    headers: headers,
    json : param
  }
  request(option, (err, response, body) => {
    console.log(JSON.stringify(body))
  })
}
//test();

function trade() {
  let headers = {
    'Content-Type': 'application/json'
  }
  let currTime = Date.now();
  let param = {
    "apiKey" : APIKEY,
    "msgNo" : currTime,
    "price" : price,
    "quantity" : amount,
    "side" : type,
    "symbol" : "MCH-USDT",
    "timestamp" : currTime,
    "type" : "limit"
  }
  let fromParam = querystring.stringify(param);
  //let fromParam = apiKey=${APIKEY}&assetType=spot&msgNo=${currTime}&timestamp=${currTime};
  let signature = CryptoJS.HmacSHA256(fromParam, APISECRET).toString(CryptoJS.enc.Hex);
  param['signature'] = signature;
  let url = 'https://global-openapi.bithumb.pro/openapi/v1/spot/placeOrder';
  let option = {
    url: url,
    method: 'POST',
    headers: headers,
    json : param
  }
  request(option, (err, response, body) => {
    console.log(JSON.stringify(body))
    //chunk_parse = JSON.parse(body);
    chunk_parse = body;
  })
}
//trade();
var order_id = '129074802726207488';
function cancel() {
  let headers = {
    'Content-Type': 'application/json'
  }
  let currTime = Date.now();
  let param = {
    "apiKey" : APIKEY,
    "msgNo" : currTime,
    "orderId" : order_id,
    "symbol" : "MCH-USDT",
    "timestamp" : currTime
  }
  let fromParam = querystring.stringify(param);
  //let fromParam = apiKey=${APIKEY}&assetType=spot&msgNo=${currTime}&timestamp=${currTime};
  let signature = CryptoJS.HmacSHA256(fromParam, APISECRET).toString(CryptoJS.enc.Hex);
  param['signature'] = signature;
  let url = 'https://global-openapi.bithumb.pro/openapi/v1/spot/cancelOrder';
  let option = {
    url: url,
    method: 'POST',
    headers: headers,
    json : param
  }
  request(option, (err, response, body) => {
    console.log(JSON.stringify(body))
    //chunk_parse = JSON.parse(body);
    chunk_parse = body;
  })
}
//cancel();

function asset() {
  let headers = {
    'Content-Type': 'application/json'
  }
  let currTime = Date.now();
  let param = {
    "apiKey" : APIKEY,
    "assetType" : "spot",
    "msgNo" : currTime,
    "timestamp" : currTime
  }
  let fromParam = querystring.stringify(param);
  //let fromParam = apiKey=${APIKEY}&assetType=spot&msgNo=${currTime}&timestamp=${currTime};
  let signature = CryptoJS.HmacSHA256(fromParam, APISECRET).toString(CryptoJS.enc.Hex);
  param['signature'] = signature;
  let url = 'https://global-openapi.bithumb.pro/openapi/v1/spot/assetList';
  let option = {
    url: url,
    method: 'POST',
    headers: headers,
    json : param
  }
  request(option, (err, response, body) => {
    console.log(JSON.stringify(body))
    //chunk_parse = JSON.parse(body);
    chunk_parse = body;
  })
}

asset();
/*
do_request_buy('POST', '/spot/placeOrder', {symbol: stock,
                                            price: price,
                                            quantity: amount,
                                            type: 'limit',
                                            side: type
                                          }, true);*/
//trade_buy('POST', 'assetList');
    var timeout1 = setTimeout(() => {
      //console.log(chunk_parse.data.orderId);
      //console.log(JSON.stringify(chunk_parse, ["data"]));

    }, 2000);

    var timeout2 = setTimeout(() => {
      clearTimeout(timeout1);
    }, 4000);
    clearTimeout(timeout2);

    /*
    async function depth2() {
      return new Promise(function(resolve, reject){
          TIMESTAMP = parseInt(Date.now() / 1000);
          params = {symbol: stock, timestamp: TIMESTAMP, apiKey: APIKEY2, apiSecret: APISECRET2};
          keys = Object.keys(params).sort(), arr = [];
          keys.forEach(function(key){
              arr.push(params[key]);
          });
          sign = md5(arr.join(''));
          var url = 'https://openapi.digifinex.kr/v2/depth?symbol='+stock+'&apiKey='+APIKEY2+'&timestamp='+TIMESTAMP+'&sign='+sign;
          https.get(url, (resp) => {
          data = '';
          // A chunk of data has been recieved.
          resp.on('data', (chunk) => {
              data += chunk;
          });
  
          // The whole response has been received. Print out the result.
          resp.on('end', () => {
              chunk_parse_buy = JSON.parse(data);
              //console.log(chunk_parse_buy);
              resolve(chunk_parse_buy);
          });
  
        }).on("error", (err) => {
          console.log("Error: " + err.message);
          resolve(err.message);
        });
      });
  }
  depth2();*/
  /*
    var timeout1 = setTimeout(() => {
      ask_buy = chunk_parse_buy.asks;
      ask = ask_buy[9];
      bid_buy = chunk_parse_buy.bids;
      bid = bid_buy[0];
      console.log("chunk_parse_buy.asks :", chunk_parse_buy.asks);
      console.log("ask_buy[9] :", ask_buy[9]);
      console.log("ask[0] :", ask[0]);
      console.log("chunk_parse_buy.bids :", chunk_parse_buy.bids);
      console.log("bid_buy[0] :", bid_buy[0]);
      console.log("bid[0] :", bid[0]);
    }, 1000);
    var timeout2 = setTimeout(() => {
    }, 2000);

    price = 0.1;
    amount = 1972.76;
    
    async function trade() {
      return new Promise(function(resolve, reject){
          TIMESTAMP = parseInt(Date.now() / 1000);
          params = {symbol: stock,
                    price: price,
                    amount: amount,
                    type: 'sell',
                    post_only: post_only,
                    timestamp: TIMESTAMP, 
                    apiKey: APIKEY1, 
                    apiSecret: APISECRET1
                  };
          keys = Object.keys(params).sort(), arr = [];
          keys.forEach(function(key){
              arr.push(params[key]);
          });
          sign = md5(arr.join(''));
          console.log(sign);
          params = {symbol: stock,
            price: price,
            amount: amount,
            type: 'sell',
            post_only: post_only,
            timestamp: TIMESTAMP, 
            apiKey: APIKEY1,
            //apiSecret: APISECRET
            sign: sign
          };
          var content = querystring.stringify(params);
          var url = 'openapi.digifinex.kr';
          var options = {
                      host: url,
                      path: '/v2/trade',
                      port: 443,
                      method: method,
                      headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.52 Safari/537.17',
                      }
                    };
          var req = https.request(options, (resp) => {
          data = '';
          // A chunk of data has been recieved.
          resp.on('data', (chunk) => {
              data += chunk;
          });
  
          // The whole response has been received. Print out the result.
          resp.on('end', () => {
              chunk_parse_buy = JSON.parse(data);
              console.log(chunk_parse_buy);
              resolve(chunk_parse_buy);
          });
  
        })
        req.on('error', (err) => {
          console.log('problem with request: ' + err.message);
          resolve(err.message);
      });
      if (method != 'GET') {
          req.write(content);
      }
      req.end();
      });
  }
  //trade();
  */

/*
  async function position() {
    return new Promise(function(resolve, reject){
        TIMESTAMP = parseInt(Date.now() / 1000);
        params = {timestamp: TIMESTAMP, apiKey: APIKEY1, apiSecret: APISECRET1};
        keys = Object.keys(params).sort(), arr = [];
        keys.forEach(function(key){
            arr.push(params[key]);
        });
        sign = md5(arr.join(''));
        var url = 'https://openapi.digifinex.kr/v2/myposition?apiKey='+APIKEY1+'&timestamp='+TIMESTAMP+'&sign='+sign;
        https.get(url, (resp) => {
        data = '';
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            chunk_parse_buy = JSON.parse(data);
            console.log(chunk_parse_buy);
            resolve(chunk_parse_buy);
        });

      }).on("error", (err) => {
        console.log("Error: " + err.message);
        resolve(err.message);
      });
    });
}
position();
*/

/*
async function history() {
  return new Promise(function(resolve, reject){
      TIMESTAMP = parseInt(Date.now() / 1000);
      params = {symbol: stock, timestamp: TIMESTAMP, apiKey: APIKEY, apiSecret: APISECRET};
      keys = Object.keys(params).sort(), arr = [];
      keys.forEach(function(key){
          arr.push(params[key]);
      });
      sign = md5(arr.join(''));
      var url = 'https://openapi.digifinex.kr/v2/order_history?apiKey='+APIKEY+'&timestamp='+TIMESTAMP+'&sign='+sign+'&symbol='+stock;
      https.get(url, (resp) => {
      data = '';
      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
          data += chunk;
      });

      // The whole response has been received. Print out the result.
      resp.on('end', () => {
          chunk_parse_buy = JSON.parse(data);
          console.log(chunk_parse_buy);
          resolve(chunk_parse_buy);
      });

    }).on("error", (err) => {
      console.log("Error: " + err.message);
      resolve(err.message);
    });
  });
}
history();
*/
/*
var order_id = '';

async function cancel() {
  return new Promise(function(resolve, reject){
      TIMESTAMP = parseInt(Date.now() / 1000);
      params = {order_id: order_id,
                timestamp: TIMESTAMP, 
                apiKey: APIKEY, 
                apiSecret: APISECRET};
      keys = Object.keys(params).sort(), arr = [];
      keys.forEach(function(key){
          arr.push(params[key]);
      });
      sign = md5(arr.join(''));
      params = {order_id: order_id,
        timestamp: TIMESTAMP, 
        apiKey: APIKEY,
        sign: sign
        //apiSecret: APISECRET
      };
      var content = querystring.stringify(params);
      var url = 'openapi.digifinex.kr';
      var options = {
                  host: url,
                  path: '/v2/cancel_order',
                  port: 443,
                  method: method,
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.52 Safari/537.17',
                  }
                };
      var req = https.request(options, (resp) => {
      data = '';
      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
          data += chunk;
      });

      // The whole response has been received. Print out the result.
      resp.on('end', () => {
          chunk_parse_buy = JSON.parse(data);
          console.log(chunk_parse_buy);
          resolve(chunk_parse_buy);
      });

    })
    req.on('error', (err) => {
      console.log('problem with request: ' + err.message);
      resolve(err.message);
  });
  if (method != 'GET') {
      req.write(content);
  }
  req.end();
  });
}
cancel();
*/
/*
var order_id = '3fd912177d098e20f01841c2a4aa6026, a3ef377d9b598ec0e45ab236a3508c81';
async function info() {
  return new Promise(function(resolve, reject){
      TIMESTAMP = parseInt(Date.now() / 1000);
      params = {order_id: order_id, timestamp: TIMESTAMP, apiKey: APIKEY, apiSecret: APISECRET};
      keys = Object.keys(params).sort(), arr = [];
      keys.forEach(function(key){
          arr.push(params[key]);
      });
      sign = md5(arr.join(''));
      var url = 'https://openapi.digifinex.kr/v2/order_info?apiKey='+APIKEY+'&timestamp='+TIMESTAMP+'&sign='+sign+'&order_id='+order_id;
      https.get(url, (resp) => {
      data = '';
      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
          data += chunk;
      });

      // The whole response has been received. Print out the result.
      resp.on('end', () => {
          chunk_parse_buy = JSON.parse(data);
          console.log(chunk_parse_buy);
          resolve(chunk_parse_buy);
      });

    }).on("error", (err) => {
      console.log("Error: " + err.message);
      resolve(err.message);
    });
  });
}
info();
*/
/*
var test1 = [];
function open1() {

      TIMESTAMP = parseInt(Date.now() / 1000);
      params = {symbol: stock, timestamp: TIMESTAMP, apiKey: APIKEY1, apiSecret: APISECRET1};
      keys = Object.keys(params).sort(), arr = [];
      keys.forEach(function(key){
          arr.push(params[key]);
      });
      sign = md5(arr.join(''));
      var url = 'https://openapi.digifinex.kr/v2/open_orders?apiKey='+APIKEY1+'&timestamp='+TIMESTAMP+'&sign='+sign+'&symbol='+stock;
      https.get(url, (resp) => {
      data = '';
      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
          data += chunk;
          //chunk_parse_buy = JSON.parse(chunk);
          //console.log(chunk_parse_buy);
          //test1 = chunk_parse_buy.orders;
          //console.log(test1[1]);
      });

      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        let json = JSON.parse(data);
        chunk_parse_buy = JSON.stringify(json, ["orders", "order_id"]);
        //test1 = JSON.parse(data);
          //chunk_parse_buy = JSON.parse(data);
          //console.log(json);
          console.log(chunk_parse_buy);
          //resolve(chunk_parse_buy);
      });

    }).on("error", (err) => {
      console.log("Error: " + err.message);

    });

}
//open1(); 

/*
function open2() {

  TIMESTAMP = parseInt(Date.now() / 1000);
  params = {symbol: stock, timestamp: TIMESTAMP, apiKey: APIKEY2, apiSecret: APISECRET2};
  keys = Object.keys(params).sort(), arr = [];
  keys.forEach(function(key){
      arr.push(params[key]);
  });
  sign = md5(arr.join(''));
  var url = 'https://openapi.digifinex.kr/v2/open_orders?apiKey='+APIKEY2+'&timestamp='+TIMESTAMP+'&sign='+sign+'&symbol='+stock;
  https.get(url, (resp) => {
  data = '';
  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
      data += chunk;
      //chunk_parse_buy = JSON.parse(chunk);
      //console.log(chunk_parse_buy);
      //test1 = chunk_parse_buy.orders;
      //console.log(test1[1]);
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    let json = JSON.parse(data);
    chunk_parse_buy = JSON.stringify(json, ["orders", "order_id"]);
    //test1 = JSON.parse(data);
      //chunk_parse_buy = JSON.parse(data);
      //console.log(json);
      console.log(chunk_parse_buy);
      //resolve(chunk_parse_buy);
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);

});

}
//open2(); 
/*
var timeout1 = setTimeout(() => {
  //test1 = JSON.stringify(json["order_id"])
  test1 = chunk_parse_buy;
  test1 = JSON.parse(chunk_parse_buy);
  console.log("orders : " + chunk_parse_buy);
  //console.log("data : " + data);
  console.log("test1 : " + test1);
  console.log("test1[0] : " + test1[0]);
  test1 = JSON.stringify(test1, ["order_id"])
  console.log("test1 : " + test1);
}, 2000);
var timeout2 = setTimeout(() => {
  clearTimeout(timeout1);
}, 3000);

//let lastPrice = JSON.stringify(json["ticker"]["krw_mch"]["last"]);*/