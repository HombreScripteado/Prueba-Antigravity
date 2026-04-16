const fs = require('fs');
const data = fs.readFileSync('data/menu.json', 'utf8');
const result = data.replace(/"arModel":\s*"[^"]*"/g, '"hasAR": true');
fs.writeFileSync('data/menu.json', result);
console.log('Done');
