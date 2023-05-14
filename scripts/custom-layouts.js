
// add custom layouts to theme

'use strict';

const fs = require('hexo-fs');
const path = require('path');

const customLayouts = hexo.config.custom_layouts || {};

for (let [name, file] of Object.entries(customLayouts)){
    let content = fs.readFileSync(path.resolve(hexo.base_dir, file));
    hexo.theme.setView(name, content);
    hexo.log.debug(`Loaded custom layout ${name}`);
}
