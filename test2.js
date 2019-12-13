let md5 = require('md5');
let https = require('https');
var querystring = require('querystring');
const APIKEY1 = "15dafe6216d648" //kr_wihte1
const APISECRET1 = "7868dde1d50c2b311391cb8cb97f05f205dafe621"
const APIKEY2 = "15d303e296b549" //kr_wihte2
const APISECRET2 = "ec8b3fb8f102c77297095faaf078dd1505d303e29"
    var stock = 'usdt_mch';
    var TIMESTAMP = parseInt(Date.now() / 1000);
    //let params = {type: 'kline_1m', symbol: 'usdt_btc',  apiKey: APIKEY, apiSecret: APISECRET}; 
    let params = {symbol: stock, timestamp: TIMESTAMP, apiKey: APIKEY1, apiSecret: APISECRET1};
	let keys = Object.keys(params).sort(), arr = [];
	keys.forEach(function(key){
		arr.push(params[key]);
	});
  let sign = md5(arr.join(''));
  var price = 0.172102;
  var amount = 21002.91;
  var post_only = 0;
  var method = 'POST';
    //console.log(sign);
    let data = '';

    var ask_buy = [10];
    var ask = [2];
    var bid_buy = [10];
    var bid = [2];
    let chunk_parse_buy;
/*
    async function depth1() {
        return new Promise(function(resolve, reject){
            TIMESTAMP = parseInt(Date.now() / 1000);
            params = {symbol: stock, timestamp: TIMESTAMP, apiKey: APIKEY1, apiSecret: APISECRET1};
            keys = Object.keys(params).sort(), arr = [];
            keys.forEach(function(key){
                arr.push(params[key]);
            });
            sign = md5(arr.join(''));
            var url = 'https://openapi.digifinex.kr/v2/depth?symbol='+stock+'&apiKey='+APIKEY1+'&timestamp='+TIMESTAMP+'&sign='+sign;
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
    depth1();
    var timeout1 = setTimeout(() => {
      ask_buy = chunk_parse_buy.asks;
      ask1 = ask_buy[9];
      bid_buy = chunk_parse_buy.bids;
      bid1 = bid_buy[0];
      console.log(ask1);
      console.log(bid1);
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
*/
    stock = 'krw_mch';
    price = 189;
    amount = 6000;
    var type = 'sell';
    //var order_id1;
    async function trade() {
      return new Promise(function(resolve, reject){
          TIMESTAMP = parseInt(Date.now() / 1000);
          params = {symbol: stock,
                    price: price,
                    amount: amount,
                    type: type,
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
            type: type,
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
              //order_id1 = JSON.stringify(chunk_parse_buy["order_id"]);
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
  //trade()
 


  async function position() {
    return new Promise(function(resolve, reject){
        TIMESTAMP = parseInt(Date.now() / 1000);
        params = {timestamp: TIMESTAMP, apiKey: APIKEY2, apiSecret: APISECRET2};
        keys = Object.keys(params).sort(), arr = [];
        keys.forEach(function(key){
            arr.push(params[key]);
        });
        sign = md5(arr.join(''));
        var url = 'https://openapi.digifinex.kr/v2/myposition?apiKey='+APIKEY2+'&timestamp='+TIMESTAMP+'&sign='+sign;
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


stock = 'usdt_mch';

async function history() {
  return new Promise(function(resolve, reject){
      TIMESTAMP = parseInt(Date.now() / 1000);
      params = {symbol: stock, timestamp: TIMESTAMP, apiKey: APIKEY2, apiSecret: APISECRET2};
      keys = Object.keys(params).sort(), arr = [];
      keys.forEach(function(key){
          arr.push(params[key]);
      });
      sign = md5(arr.join(''));
      var url = 'https://openapi.digifinex.kr/v2/order_history?apiKey='+APIKEY2+'&timestamp='+TIMESTAMP+'&sign='+sign+'&symbol='+stock;
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
//history();

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
var order_id = '2d952ad5d8c4641d3024bcdebc0376b5';
async function info() {
  return new Promise(function(resolve, reject){
      TIMESTAMP = parseInt(Date.now() / 1000);
      params = {order_id: order_id, timestamp: TIMESTAMP, apiKey: APIKEY1, apiSecret: APISECRET1};
      keys = Object.keys(params).sort(), arr = [];
      keys.forEach(function(key){
          arr.push(params[key]);
      });
      sign = md5(arr.join(''));
      var url = 'https://openapi.digifinex.kr/v2/order_info?apiKey='+APIKEY1+'&timestamp='+TIMESTAMP+'&sign='+sign+'&order_id='+order_id;
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
var timeout1 = setTimeout(() => {
  
  //console.log(chunk_parse_buy);
  //console.log(chunk_parse_buy.data);
  var order_id1 = JSON.stringify(chunk_parse_buy.data, ["executed_amount"]);
  console.log(order_id1);
  order_id1 = order_id1.substring(20,order_id1.length-2)
  console.log(order_id1);
}, 2000);
var timeout2 = setTimeout(() => {
  clearTimeout(timeout1);
}, 3000);
clearTimeout(timeout2);
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
open1(); 
*/
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
/*
stock = 'usdt_btc';
type = 'kline_1m';
TIMESTAMP = TIMESTAMP - 120;
async function candle() {
  return new Promise(function(resolve, reject){
      TIMESTAMP = parseInt(Date.now() / 1000);
      //params = {symbol: stock, type: type,timestamp: TIMESTAMP, apiKey: APIKEY1};
      params = {symbol: stock, type: type,timestamp: TIMESTAMP, apiKey: APIKEY1, apiSecret: APISECRET1};
      keys = Object.keys(params).sort(), arr = [];
      keys.forEach(function(key){
          arr.push(params[key]);
      });
      sign = md5(arr.join(''));
      //var url = 'https://openapi.digifinex.kr/v2/order_info?apiKey='+APIKEY1+'&timestamp='+TIMESTAMP+'&sign='+sign+'&symbol='+stock+'&type='+type;
      var url = 'https://openapi.digifinex.kr/v2/kline?apiKey='+APIKEY1+'&timestamp='+TIMESTAMP+'&sign='+sign+'&symbol='+stock+'&type='+type;
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
candle();
*/