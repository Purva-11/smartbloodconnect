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
  content = content.replace(/<StatCardlabel=/g, '<StatCard label=');
  fs.writeFileSync(file, content);
});
console.log('Fixed StatsCard space');
