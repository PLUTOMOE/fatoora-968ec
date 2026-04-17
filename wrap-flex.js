const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir('./src', function(filePath) {
    if (!filePath.endsWith('.tsx')) return;
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    content = content.replace(/className="flex items-center justify-between mb-8"/g, 'className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"');
    content = content.replace(/className="flex items-center gap-3"/g, 'className="flex flex-wrap items-center gap-3"');
    
    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Flex fixed in: ' + filePath);
    }
});
