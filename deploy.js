const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const deployDir = 'deploy';

// copy all project files but script.js to deploy directory
const filesToCopy = ['index.html', 'favicon.ico', 'style.css', 'data.js'];
filesToCopy.forEach(filename => {
  try {
    fs.copyFileSync(filename, path.join('.', deployDir, filename));
  } catch (err) {
    console.error(err);
  }
});

// load plaintest
let plaintext;
try {
  plaintext = fs.readFileSync('script.js');
} catch (err) {
  console.error(err);
}

// convert
const base64 = Buffer.from(plaintext).toString('base64');

// save
try {
  fs.writeFileSync(path.join('.', deployDir, 'script.js'), 'eval(atob("');
} catch (err) {
  console.error(err);
}
try {
  fs.appendFileSync(path.join('.', deployDir, 'script.js'), base64);
} catch (err) {
  console.error(err);
}
try {
  fs.appendFileSync(path.join('.', deployDir, 'script.js'), '"));');
} catch (err) {
  console.error(err);
}
