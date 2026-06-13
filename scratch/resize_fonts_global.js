const fs = require('fs');
const path = require('path');

const sizeMap = {
  'text-[8px]': 'text-[10px]',
  'text-[9px]': 'text-[11px]',
  'text-[10px]': 'text-xs',
  'text-[11px]': 'text-sm',
  'text-[12px]': 'text-sm',
  'text-xs': 'text-sm',
  'text-sm': 'text-base',
  'text-base': 'text-lg',
  'text-lg': 'text-xl',
  'text-xl': 'text-2xl',
  'text-2xl': 'text-3xl',
  'text-3xl': 'text-4xl',
  'text-4xl': 'text-5xl',
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

  // We want to replace these classes safely, so we don't chain-replace them.
  // Using a regex with a replacer function based on the sizeMap.
  // The regex looks for exact class names.
  
  const regex = new RegExp(`\\b(${Object.keys(sizeMap).map(k => k.replace(/\[/g, '\\[').replace(/\]/g, '\\]')).join('|')})\\b`, 'g');

  content = content.replace(regex, (match) => {
    return sizeMap[match] || match;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated sizes in: ${filePath}`);
  }
}

const targetDir = path.join(__dirname, '../src');
walkDir(targetDir, processFile);
console.log('Global font sizes increased successfully!');
