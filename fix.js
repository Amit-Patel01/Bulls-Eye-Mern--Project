const fs = require('fs');
const path = require('path');
function walk(dir) {
  let files = [];
  fs.readdirSync(dir).forEach(f => {
    let p = path.join(dir, f);
    if(fs.statSync(p).isDirectory()) files = files.concat(walk(p));
    else if(p.endsWith('.js') || p.endsWith('.jsx')) files.push(p);
  });
  return files;
}

const files = walk('d:/6 Sem/bullsmearn/AI-Learn/src');
files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  
  // Fix powershell damaged template literal like `(import.meta...)/api/...` OR `(import.meta...)/api/...\"`
  c = c.replace(/\(import\.meta\.env\.VITE_BACKEND_URL\s*\|\|\s*"http:\/\/localhost:5000"\)(\/[^"]*)"/g, '`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}$1`');
  
  // Fix the previously clean ones that got double quotes at end 
  c = c.replace(/\(import\.meta\.env\.VITE_BACKEND_URL\s*\|\|\s*"http:\/\/localhost:5000"\)"/g, '(import.meta.env.VITE_BACKEND_URL || "http://localhost:5000")');

  // Fix the backtick replacements that went wrong: ``${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/...`
  c = c.replace(/``\$\{import\.meta\.env\.VITE_BACKEND_URL\s*\|\|\s*"http:\/\/localhost:5000"\}/g, '`${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}');

  fs.writeFileSync(f, c);
});
console.log('Fixed syntax');
