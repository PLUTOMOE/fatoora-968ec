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

    // Backgrounds
    content = content.replace(/bg-\[\#FAFAFA\]/g, 'bg-background');
    content = content.replace(/bg-white/g, 'bg-card');
    content = content.replace(/bg-\[\#1A1A1A\]/g, 'bg-primary');
    content = content.replace(/hover:bg-\[\#000000\]/g, 'hover:bg-primary');
    content = content.replace(/bg-\[\#F4F4F4\]/g, 'bg-muted');
    content = content.replace(/bg-\[\#EBEBEB\]/g, 'bg-border');
    
    // Borders
    content = content.replace(/border-\[\#EBEBEB\]/g, 'border-border');
    content = content.replace(/border-\[\#D4D4D4\]/g, 'border-border/80');
    content = content.replace(/border-\[\#F4F4F4\]/g, 'border-border/50');
    
    // Text
    content = content.replace(/text-\[\#1A1A1A\]/g, 'text-foreground');
    content = content.replace(/text-\[\#2A2A2A\]/g, 'text-foreground');
    content = content.replace(/text-\[\#6A6A6A\]/g, 'text-muted-foreground');
    content = content.replace(/text-\[\#9B9B9B\]/g, 'text-muted-foreground/80');
    content = content.replace(/text-\[\#D4D4D4\]/g, 'text-muted-foreground/40');
    
    // Text primary states
    content = content.replace(/text-white/g, 'text-primary-foreground');
    content = content.replace(/hover:text-\[\#1A1A1A\]/g, 'hover:text-foreground');
    
    // Hovers
    content = content.replace(/hover:bg-\[\#FAFAFA\]/g, 'hover:bg-accent');
    content = content.replace(/hover:bg-\[\#EBEBEB\]/g, 'hover:bg-accent');
    content = content.replace(/hover:border-\[\#D4D4D4\]/g, 'hover:border-foreground\/20');
    content = content.replace(/hover:bg-\[\#F4F4F4\]/g, 'hover:bg-accent');

    // Remove any text-white that got doubled or we can just leave it since the mapping was exact.
    
    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated: ' + filePath);
        modifiedFiles++;
    }
});

console.log(`Successfully refactored ${modifiedFiles} files to support Theme Variables!`);
