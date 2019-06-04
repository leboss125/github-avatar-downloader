var request = require('request');
var gitToken =  require('./secrets');
var fs = require('fs');
function getRepoContributors(repoOwner, repoName, cb) {
    var options = {
      url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
      headers: {
        'User-Agent': 'request',
        'Authorization': gitToken.GITHUB_TOKEN
      }
    };
    request(options, function(err, res,body) {
        // cb(JSON.parse(res));
        
        let parsed = JSON.parse(body)
        cb(parsed)
    });
  }
  function downloadImageByURL(url,path) {
    request.get(url).on('response',  function(response){
       let result =  response.pipe(fs.createWriteStream(__dirname + path));
       request.on('data', function(data){
           console.log('creating files .....')
       })
    })
  }

  getRepoContributors("jquery", "jquery", function(data) {
        data.forEach(function(el){
         downloadImageByURL(el.avatar_url,`/avatars/${el.login}${'.jpeg'}`)
        })
  });
