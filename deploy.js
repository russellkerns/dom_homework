const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// copy all files but script.js to deploy directory
const filesToCopy = ['index.html', 'favicon.ico', 'style.css', 'data.js'];
filesToCopy.forEach(filename => {
  fs.copyFile(filename, path.join('.', 'deploy', filename), err => {
    if (err) throw err;
  });
});

// base64 script.js and copy it in
fs.readFile('script.js', 'UTF-8', function(err, data) {
  if (err) throw err;
  const base64 = Buffer.from(data).toString('base64');
  fs.appendFile(path.join('.', 'deploy', 'script.js'), 'eval(atob("', function(
    err
  ) {
    if (err) throw err;
    fs.appendFile(path.join('.', 'deploy', 'script.js'), base64, function(err) {
      if (err) throw err;
      fs.appendFile(path.join('.', 'deploy', 'script.js'), '"))', function(
        err
      ) {
        if (err) throw err;
      });
    });
  });
});

// deploy to gh-pages branch
let output = execSync('git subtree push --prefix deploy origin gh-pages');
console.log('shell out: ', output.toString('binary'));
