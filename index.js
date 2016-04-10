var http = require("http");
var cheerio = require("cheerio");
var ejs = require("ejs");
var fs = require("fs");

function download(url, callback) {
	http.get(url, function(res) {
		var data = "";
		res.on('data', function(chunk) {
			data += chunk;
		});
		res.on('end', function() {
			callback(data);
		})
	}).on("err", function(e) {
		console.log(e);
		callback(null);
	});
}

function render(accounts) {
	console.log('xxx');
	fs.readFile('./template.ejs', function (e, v) {
      var ret = v.toString();
        
      var options = {servers: accounts}
      var template = ejs.render(ret, options);
      fs.writeFile('./index.html', template, function (err) {
        if (err) throw err;         
      });
    });
}

download("http://ss.uprogrammer.cn/", function(data) {
	if (!data) {
		console.log('no data found');
		return;
	}

    var accounts = [];
    
	$ = cheerio.load(data);

    // 通过 cheerio 的选择器获取免费账号信息单元
	var ss = $('#account_container > .col-md-4');
	
	for (var i = 0; i < ss.length; i++) {
		var s = {};
		
		// 解析服务器
		var server = $(ss[i]).children().first();
		s['server'] = server.text().substr(7);
		console.log(s['server']);

        // 解析端口
		var port = $(server).next();
		s['port'] = port.text().substr(3);
		console.log(s['port']);

        // 解析密码
		var password = $(port).next();
		s['password'] = password.text().substr(4);
		console.log(s['password']);

        // 解析加密方式
		var encrypt = $(password).next();
		s['encrypt'] = encrypt.text().substr(5);
		console.log(s['encrypt']);

        // 解析状态
		var status = $(encrypt).next();
		s['status'] = status.text().substr(3);
		console.log(s['status']);

        // 解析说明
		var tip = $(status).next();
		s['tip'] = tip.text();
		console.log(s['tip']);
		
		accounts.push(s);
		console.log("===");
	}

	render(accounts);
});