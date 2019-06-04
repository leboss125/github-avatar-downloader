// command line to use: node download_avatars.js jquery jquery
var request = require('request');
var gitToken = require('./secrets');
var arg = process.argv.slice(2);
var fs = require('fs');

function getRepoContributors(repoOwner, repoName, cb) {
    var options = {
        url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
        headers: {
            'User-Agent': 'request',
            'Authorization': gitToken.GITHUB_TOKEN
        }
    };
    request(options, function (err, res, body) {
        if(err){
            console.log('there is an error : ', err);
        }
        let parsed = JSON.parse(body);
        cb(parsed);
    });
}

function downloadImageByURL(url, path) {
    request.get(url).on('response', function (response) {
        response.on('data', function () {
            console.log('creating files .....');
        });
        let result = response.pipe(fs.createWriteStream(__dirname + path));

        response.on('end', function () {
            console.log('all files have been created');
        });
    });
}
getRepoContributors(arg[0], arg[1], function (data) {
    data.forEach(function (el) {
        downloadImageByURL(el.avatar_url, `/avatars/${el.login}${'.jpeg'}`);
    });
});