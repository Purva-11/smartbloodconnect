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
  content = content.replace(/from '\.\.\/ui\//g, "from '../../components/ui/");
  content = content.replace(/from '\.\.\/forms\//g, "from '../../components/forms/");
  content = content.replace(/from '\.\.\/qr\//g, "from '../../components/qr/");
  
  // also fix implicitly any 'e' parameters in form event handlers
  content = content.replace(/onChange=\{e =>/g, "onChange={(e: any) =>");
  content = content.replace(/onSubmit=\{e =>/g, "onSubmit={(e: any) =>");
  content = content.replace(/onKeyDown=\{e =>/g, "onKeyDown={(e: any) =>");
  content = content.replace(/onClick=\{e =>/g, "onClick={(e: any) =>");
  content = content.replace(/v =>/g, "(v: any) =>");
  
  // fix specific ticketId implicit any in CampDiscoveryPage
  content = content.replace(/ticketId =>/g, "(ticketId: string) =>");
  
  fs.writeFileSync(file, content);
});
console.log('Imports and types fixed');
