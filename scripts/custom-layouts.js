
// add custom layouts to theme

'use strict';

const fs = require('hexo-fs');
const path = require('path');

const layoutDir = (hexo.config.layout_dir || 'layout').replace(/\\/g, '/').replace(/\/$/, '');
const files = fs.listDirSync(layoutDir);

files.forEach(function(file) {
    file = file.replace(/\\/g, '/');
    let filePath = layoutDir + '/' + file;
    let content = fs.readFileSync(filePath);
    hexo.theme.setView(file, content);
    hexo.log.debug(`Loaded custom layout ${file}`);
});
