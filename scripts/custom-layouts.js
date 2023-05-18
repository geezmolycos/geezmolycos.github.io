
// add custom layouts to theme

// also enables to load layout directly from source folder
// specify 'layout_from' in front matter to use relative path

// also provides with a tag to render and insert a layout partial

'use strict';

const fs = require('hexo-fs');
const path = require('path');
const micromatch = require('micromatch');

function load_layout_file(path, virtualPath){
    let content = fs.readFileSync(path);
    hexo.theme.setView(virtualPath, content);
}

// load global layouts from "layout" directory
const layoutDir = (hexo.config.layout_dir || 'layout').replace(/\\/g, '/').replace(/\/$/, '');
const files = fs.listDirSync(layoutDir);

files.forEach(function(file) {
    file = file.replace(/\\/g, '/');
    let filePath = layoutDir + '/' + file;
    load_layout_file(filePath, file);
    hexo.log.debug(`Loaded custom layout ${file}`);
});

// Match files like "main.layout.njk" "example.layout.ejs"
hexo.extend.processor.register(/\.layout\.[^./\\]*$/, function(file){
    // remove ".layout" part
    let virtualPath = 'source/' + file.path.replace(/\\/g, '/').replace(/\.layout\.([^./\\]*)$/, '.$1');
    return file.read().then((content) => hexo.theme.setView(virtualPath, content));
});

hexo.extend.filter.register('before_post_render', function(data){
    if (!data.layout_from && !data.layout_asset){
        return data;
    }
    if (data.layout_asset){
        data.layout = 'source/' + path.posix.join(data.source.replace(/\\/g, '/').replace(/\.[^/\\.]+$/, ""), data.layout_asset.replace(/\\/g, '/'));
    }
    if (data.layout_from){
        data.layout = 'source/' + path.posix.join(path.posix.dirname(data.source.replace(/\\/g, '/')), data.layout_from.replace(/\\/g, '/'));
    }
});
