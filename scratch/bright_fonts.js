const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      if (dirPath.endsWith('.tsx') || dirPath.endsWith('.ts')) {
        callback(dirPath);
      }
    }
  });
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // 1. Remove opacity from standard colors
  content = content.replace(/text-(espresso|white|black|gold|rose)(-\w+)?\/\d{1,2}/g, 'text-$1$2');

  // 2. Remove opacity from hex colors
  content = content.replace(/text-\[#[A-Fa-f0-9]{6}\]\/\d{1,2}/g, (match) => {
    return match.split('/')[0];
  });

  // 3. Replace dull grays with high-contrast espresso/black
  content = content.replace(/text-\[#6B6B6B\]/g, 'text-espresso');
  content = content.replace(/text-\[#9A9A9A\]/g, 'text-espresso');
  content = content.replace(/text-smoke/g, 'text-espresso');
  content = content.replace(/text-mist/g, 'text-espresso');
  content = content.replace(/text-\[#C8C4BC\]/g, 'text-espresso');

  // 4. In case opacity was used directly in class like opacity-40, text-opacity-50 etc.
  content = content.replace(/text-opacity-\d{1,2}/g, '');
  content = content.replace(/\bopacity-(30|40|50|60|70)\b/g, ''); // Be careful with this, but it might help readability

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

const targetDir = path.join(__dirname, '../src');
walkDir(targetDir, processFile);
console.log('Font contrast boost complete!');
