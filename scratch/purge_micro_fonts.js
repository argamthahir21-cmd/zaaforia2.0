const fs = require('fs');
const path = require('path');

const sizeMap = {
  'text-[8px]': 'text-xs',
  'text-[9px]': 'text-xs',
  'text-[10px]': 'text-xs',
  'text-[11px]': 'text-sm',
  'text-[12px]': 'text-sm',
  'text-[13px]': 'text-sm',
};

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

  const regex = new RegExp(`\\b(${Object.keys(sizeMap).map(k => k.replace(/\[/g, '\\[').replace(/\]/g, '\\]')).join('|')})\\b`, 'g');

  content = content.replace(regex, (match) => {
    return sizeMap[match] || match;
  });

  // Also fix tightly tracked text to use Tailwind's tracking-widest for better breathability on small caps
  content = content.replace(/tracking-\[0\.1em\]/g, 'tracking-widest');
  content = content.replace(/tracking-\[0\.12em\]/g, 'tracking-widest');
  content = content.replace(/tracking-\[0\.14em\]/g, 'tracking-[0.2em]');
  content = content.replace(/tracking-\[0\.15em\]/g, 'tracking-[0.2em]');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Purged micro-fonts in: ${filePath}`);
  }
}

const targetDir = path.join(__dirname, '../src');
walkDir(targetDir, processFile);
console.log('Micro-fonts purged and tracking adjusted successfully!');
