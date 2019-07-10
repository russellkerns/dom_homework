const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { exec } = require('child_process');

// settings
const deployDir = 'deploy';

// make dir
if (!fs.existsSync(path.join('.', deployDir))) {
  fs.mkdirSync(path.join('.', deployDir));
}

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

// save the obfuscated file
try {
  fs.writeFileSync(
    path.join('.', deployDir, 'script.js'),
    '// please, no cheating! \n eval(atob("'
  );
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
