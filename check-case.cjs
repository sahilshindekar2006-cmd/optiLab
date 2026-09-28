const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.resolve(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            results.push(file);
        }
    });
    return results;
}

const files = walk('./src');
const allPathsSet = new Set(files);

files.filter(f => f.endsWith('.ts') || f.endsWith('.tsx')).forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const regex = /import.*from\s+['"]([^'"]+)['"]/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        let importPath = match[1];
        if (importPath.startsWith('.')) {
            let resolved = path.resolve(path.dirname(file), importPath);
            let possiblePaths = [
                resolved + '.ts', 
                resolved + '.tsx', 
                resolved + '/index.ts', 
                resolved + '/index.tsx',
                resolved + '.css'
            ];
            
            // Check if ANY of the possible paths exist in a case-INsensitive way
            let foundExact = false;
            let foundCaseInsensitive = null;
            
            for (let p of possiblePaths) {
                if (fs.existsSync(p)) {
                    // Check if the exact case matches the actual file system case
                    let dir = path.dirname(p);
                    let base = path.basename(p);
                    let actualFiles = fs.readdirSync(dir);
                    if (!actualFiles.includes(base)) {
                       foundCaseInsensitive = p;
                    } else {
                       foundExact = true;
                    }
                }
            }
            
            if (!foundExact && foundCaseInsensitive) {
                console.log(`CASE MISMATCH IN ${file}:`);
                console.log(`  Imported: ${importPath}`);
                console.log(`  Actual file exists but case is different: ${foundCaseInsensitive}`);
            }
        }
    }
});
