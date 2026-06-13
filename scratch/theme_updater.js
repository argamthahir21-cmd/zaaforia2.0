const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, '../src/app/admin/(dashboard)');

const colorMap = {
  'bg-[#1A1A1A]': 'bg-[#FFFFFF]',
  'bg-[#1C1C1C]': 'bg-[#FAFAF7]',
  'bg-[#242424]': 'bg-[#F5F0EB]',
  'bg-[#2E2E2E]': 'bg-[#F5F0EB]',
  'border-[#2E2E2E]': 'border-[#E5E2DE]',
  'text-[#E8E5E0]': 'text-[#1A1A1A]',
  'text-[#F7F4EF]': 'text-[#1A1A1A]',
  'text-[#C8C4BC]': 'text-[#6B6B6B]',
  'text-[#D4A5A0]': 'text-[#D4B88A]',
  'border-[#D4A5A0]': 'border-[#D4B88A]',
  'bg-[#D4A5A0]': 'bg-[#D4B88A]',
  'bg-[#111111]': 'bg-[#FFFFFF]',
  'text-[#111111]': 'text-[#FFFFFF]', // For button texts on colored backgrounds
  'hover:bg-[#242424]': 'hover:bg-[#F5F0EB]',
  'hover:bg-[#2E2E2E]': 'hover:bg-[#E5E2DE]',
  'bg-[#1F1F1F]': 'bg-[#F5F0EB]'
};

const regexMap = [
  { re: /text-\[8px\]/g, rep: 'text-[10px]' },
  { re: /text-\[9px\]/g, rep: 'text-[11px]' },
  { re: /text-\[10px\]/g, rep: 'text-xs' },
  { re: /text-\[11px\]/g, rep: 'text-sm' },
  { re: /text-xs/g, rep: 'text-sm' },
  { re: /text-sm/g, rep: 'text-base' },
  { re: /size=\{10\}/g, rep: 'size={14}' },
  { re: /size=\{12\}/g, rep: 'size={16}' },
  { re: /size=\{13\}/g, rep: 'size={16}' },
  { re: /size=\{14\}/g, rep: 'size={18}' },
  { re: /size=\{16\}/g, rep: 'size={20}' }
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') && !fullPath.includes('pages/page.tsx') && !fullPath.includes('content/page.tsx') && !fullPath.includes('dashboard)/page.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Basic color replaces
      for (const [k, v] of Object.entries(colorMap)) {
        content = content.split(k).join(v);
      }
      
      // Regex replaces for text sizes
      for (const {re, rep} of regexMap) {
        content = content.replace(re, rep);
      }
      
      // Some specific fix-ups since text-[#111111] replacement might break something
      // Actually, if we change bg-[#111111] to bg-[#FFFFFF], we might need to revert text-[#111111] back to text-[#FFFFFF] in button.
      // Wait, let's revert the text-[#111111] to text-[#1A1A1A] for buttons? No, text-[#FFFFFF] is better for dark buttons.
      
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`Updated ${fullPath}`);
    }
  }
}

processDir(dirPath);
console.log('Done!');
