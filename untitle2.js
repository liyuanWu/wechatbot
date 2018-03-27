        var parseLinks = function(c){
          const cheerio = require('cheerio')
          const $ = cheerio.load(c)
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
result = parseLinks(`<ul>
			
				<li>
					
					<a onclick="PostBack('FollowLink','1');return false;" href="#">Wait quietly for help to arrive</a>
				</li>
			
				<li>
					
					<a onclick="PostBack('FollowLink','2');return false;" href="#"> Bind your head with cloth from your shirt</a>
				</li>
			
				<li>
					
					<a onclick="PostBack('FollowLink','3');return false;" href="#">Call out to whoever is there</a>
				</li>
			
				<li>
					
					<a onclick="PostBack('FollowLink','4');return false;" href="#">Try to sneak toward the source of the sound without revealing your presence</a>
				</li>
			
				<li>
					
					<a onclick="PostBack('FollowLink','5');return false;" href="#">Ignore the sound and climb through the wreckage to the front of the subway train</a>
				</li>
			
				<li>
					
					<a onclick="PostBack('FollowLink','6');return false;" href="#">Ignore the sound and climb through the wreckage to the rear of the subway train</a>
				</li>
			
				</ul>`);
console.log(result);

result = parseLinks(`            <!-- Links -->
            <ul>
                <li>
                    <a onclick="PostBack(&#39;FollowLink&#39;,&#39;6924&#39;);return false;" href="#">Begin...</a>
                </li>
            </ul>`)
linkStr = "";
          Object.keys(result).forEach( function(key){ linkStr += "type " + key + " - " + result[key] });
console.log(linkStr);

console.log(result);
