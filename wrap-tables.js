const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

let modifiedFiles = 0;

walkDir('./src', function(filePath) {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Check if it has a table that isn't already wrapped in overflow-x-auto
    // This is a naive but effective replacement for our pattern
    if(content.includes('<table') && !content.includes('<div className="overflow-x-auto"><table')) {
        content = content.replace(/<table/g, '<div className="overflow-x-auto overflow-y-hidden">\n<table');
        content = content.replace(/<\/table>/g, '</table>\n</div>');
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Wrapped tables in: ' + filePath);
        modifiedFiles++;
    }
});

console.log(`Successfully wrapped tables in ${modifiedFiles} files!`);
