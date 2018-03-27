http = require("http")
exports.post = function(link, page, callback){
	var gotoLink = function(action, value, page, callback){
		const cheerio = require('cheerio')
          	var $ = cheerio.load(page)
		var formValue = {};
		$('#pbForm').find('input').each(
			function(index, e) {
				var name = $(this).attr('name');
				var value = $(this).val();
				formValue[name] = value;
			});
		formValue.pbAction = action;
		formValue.pbValue = value;
	
		var request = require("request");

		var options = { method: 'POST',
		  url: 'http://chooseyourstory.com/story/viewer/default.aspx',
		  qs: { StoryId: '11246' },
		  headers: 
		   { 
		     'Cache-Control': 'no-cache',
		     'content-type': 'multipart/form-data' },
		  formData:  formValue
		      };

		request(options, function (error, response, body) {
		  if (error) throw new Error(error);

		  callback(body);
		});
	}
	gotoLink('FollowLink', link, page, callback);

}

exports.parse = function(c){
        var parseLinks = function(c){
          const cheerio = require('cheerio')
          var $ = cheerio.load(c)
          var getLink = function(str){
            var reg = /.*PostBack\('[A-Za-z]*','([0-9]*)'\).*/;
            var result = str.match(reg);
            if(result) return(result[1]);
            return(0);
          }
          var result = {};
          $('ul').find("li a").each(
                function(index, e) {
                  result[ getLink($(this).attr('onclick')) ] = $(this).text();
                });
          return(result);
        }

	var parse = function(c) {
	  var lines = c.split("\n");
	  var main_start = false;
	  var links_start = false;
	  var main = "";
	  var links = "";
	  lines.forEach(function(line) {
	    if(line.indexOf( "<!-- BEGIN MAIN -->" )> -1 ){
	      main_start = true;        
	    }

	    if(line.indexOf( "<!-- END MAIN -->" )> -1 ){
	      main_start = false;
	    }
	    if(line.indexOf( "<!-- Links -->" )> -1 ){
	      links_start = true;
	      main_start = false;
	    }
	    if(line.indexOf( "<!-- Inventory -->" )> -1 ){
	      links_start = false;
	      main_start = true;
	    }
	    if(main_start) main = main + line;
	    if(links_start) links = links + line;
	  });
	  var h2p = require('html2plaintext');
	  return({main: h2p(main), links: parseLinks(links)});
	}
	return(parse(c));
}
exports.get = function(callback){
	var options = {
	  host: 'chooseyourstory.com',
	  port: 80,
	  path: '/story/viewer/default.aspx?StoryId=11246',
	  method: 'GET'
	};
	var req = http.request(options, function(res) {
	  console.log('STATUS: ' + res.statusCode);
	  console.log('HEADERS: ' + JSON.stringify(res.headers));
	  res.setEncoding('utf8');
	  var body = '';
	  res.on('data', function (chunk) {
	    body += chunk;
	  });
	  res.on('end', function () {
	    callback(body);
	  });
	});
	req.on('error', function(e) {
	  console.log('problem with request: ' + e.message);
	});

	req.end();
}
