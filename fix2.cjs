const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (dirFile.endsWith('.tsx') || dirFile.endsWith('.ts')) filelist.push(dirFile);
    }
  });
  return filelist;
};

const files = walkSync(path.join(__dirname, 'src', 'pages'));
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/<StatCard(\s+)title=/g, '<StatCard=');
  content = content.replace(/<StatCard([^>]*?)title=/g, '<StatCard=');
  
  // ProgressBar missing max
  content = content.replace(/<ProgressBar([\s\S]*?)(?!\bmax=)\/?>/g, (match) => {
    if (match.includes('max=')) return match;
    return match.replace(/\/?(?:>)$/, ' max={100} />');
  });

  // default variant to gray
  content = content.replace(/variant="default"/g, 'variant="gray"');
  content = content.replace(/variant=\{([^}]+)\? 'default' :([^}]+)\}/g, "variant={ 'gray' :}");
  content = content.replace(/:\s*'default'/g, ": 'gray'");

  fs.writeFileSync(file, content);
});
console.log('Fixed StatsCard, ProgressBar, Badge issues');
