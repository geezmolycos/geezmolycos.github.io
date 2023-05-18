
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

function getRelativeLayoutPath(source, relative){
    return data.layout = 'source/' + path.posix.join(path.posix.dirname(source.replace(/\\/g, '/')), relative.replace(/\\/g, '/'));
}

function getAssetLayoutPath(source, relative){
    return 'source/' + path.posix.join(source.replace(/\\/g, '/').replace(/\.[^/\\.]+$/, ""), relative.replace(/\\/g, '/'));
}

function getActualLayout(data){
    // compute actual layout path
    let layout = data.layout;
    if (data.layout_asset){
        layout = getAssetLayoutPath(data.source, data.layout_asset);
    }
    if (data.layout_from){
        layout = getRelativeLayoutPath(data.source, data.layout_from);
    }
    return layout;
}

hexo.extend.filter.register('before_post_render', function(data){
    // If relative layout path is not used, return
    if (!data.layout_from && !data.layout_asset){
        return data;
    }
    data.layout = getActualLayout(data);
    return data;
});

// render layout
hexo.extend.tag.register('layout', function(args, content){
    let yamlRenderer = hexo.extend.renderer.get('yml', false);
    return yamlRenderer({text: content}).then(contentObject => {
        contentObject.source ??= this.source;
        let pathType = args[0];
        let layoutPath = args[1];
        if (layoutPath){
            if (pathType === 'from'){
                layoutPath = getRelativeLayoutPath(this.source, layoutPath);
            } else if (pathType == 'asset'){
                layoutPath = getAssetLayoutPath(this.source, layoutPath);
            }
        } else {
            // get layoutPath from content
            layoutPath = getActualLayout(contentObject);
        }
        return hexo.theme.getView(layoutPath).render(contentObject);
    });
}, {ends: true, async: true});
