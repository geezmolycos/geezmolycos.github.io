
// add custom layouts to theme

// also enables to load layout directly from source folder
// specify 'layout_from' in front matter to use relative path

// also provides with a tag to render and insert a layout partial

'use strict';

const fs = require('hexo-fs');
const path = require('path');
const Promise = require('bluebird');
const micromatch = require('micromatch');
const { parse: yfm } = require('hexo-front-matter');

const source_prefix = 'source/';

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

// Exclude layout files
hexo.config.exclude ??= new Array();
hexo.config.skip_render ??= new Array();
hexo.config.exclude.push('(**).layout.+([^./\\\\])');
hexo.config.skip_render.push('(**).layout.+([^./\\\\])');

// Match files like "main.layout.njk" "example.layout.ejs"
hexo.extend.processor.register(/\.layout\.[^./\\]*$/, function(file){
    // remove ".layout" part
    let virtualPath = source_prefix + file.path.replace(/\\/g, '/').replace(/\.layout\.([^./\\]*)$/, '.$1');
    return file.read().then((content) => hexo.theme.setView(virtualPath, content));
});

function getRelativeLayoutPath(source, relative, prefix=source_prefix){
    return prefix + path.posix.join(path.posix.dirname(source.replace(/\\/g, '/')), relative.replace(/\\/g, '/'));
}

function getAssetLayoutPath(source, relative, prefix=source_prefix){
    return prefix + path.posix.join(source.replace(/\\/g, '/').replace(/\.[^/\\.]+$/, ""), relative.replace(/\\/g, '/'));
}

function getActualLayoutPath(data, prefix){
    // compute actual layout path
    let layout = data.layout;
    if (data.layout_asset){
        layout = getAssetLayoutPath(data.source, data.layout_asset, prefix);
    }
    if (data.layout_from){
        layout = getRelativeLayoutPath(data.source, data.layout_from, prefix);
    }
    return layout;
}

function getActualLayoutPathFromArgs(layoutPath, pathType, source, prefix){
    if (!pathType){
        pathType = 'from';
    }
    if (pathType === 'from'){
        layoutPath = getRelativeLayoutPath(source, layoutPath, prefix);
    } else if (pathType == 'asset'){
        layoutPath = getAssetLayoutPath(source, layoutPath, prefix);
    }
    return layoutPath;
}

hexo.extend.filter.register('before_post_render', function(data){
    // If relative layout path is not used, return
    if (!data.layout_from && !data.layout_asset){
        return data;
    }
    data.layout = getActualLayoutPath(data);
    return data;
});

// render layout
hexo.extend.tag.register('layout', function(args){
    let layoutPath = args[0];
    let pathType = args[1];
    layoutPath = getActualLayoutPathFromArgs(layoutPath, pathType, this.source);
    return hexo.theme.getView(layoutPath).render();
}, {async: true});

hexo.extend.tag.register('layoutwith', function(args, content){
    let yamlRenderer = hexo.extend.renderer.get('yml', false);
    return yamlRenderer({text: content}).then(contentObject => {
        let layoutPath = args[0];
        let pathType = args[1];
        if (layoutPath){
            layoutPath = getActualLayoutPathFromArgs(layoutPath, pathType, this.source);
        } else {
            // get layoutPath from content
            contentObject.source ??= this.source;
            layoutPath = getActualLayoutPath(contentObject);
        }
        return hexo.theme.getView(layoutPath).render(contentObject);
    });
}, {ends: true, async: true});

// Disable rendering for snippet
hexo.config.exclude ??= new Array();
hexo.config.skip_render ??= new Array();
hexo.config.exclude.push('(**).snippet.+([^./\\\\])');
hexo.config.skip_render.push('(**).snippet.+([^./\\\\])');

// render text with engine
hexo.extend.tag.register('render', function(args, content) {
    let engine = args[0];
    return hexo.render.render({text: content, engine: engine});
}, {ends: true, async: true});

// render text with front matter
hexo.extend.tag.register('renderwith', function(args, content) {
    let engine = args[0];
    let data = yfm(content);
    return hexo.render.render({text: data._content, engine: engine}, data);
}, {ends: true, async: true});

// render snippet file
hexo.extend.tag.register('snippet', function(args) {
	let sourcePath = args[0];
    let pathType = args[1];
    sourcePath = getActualLayoutPathFromArgs(sourcePath, pathType, this.source, hexo.source_dir);
    sourcePath = sourcePath.replace(/.([^./\\]*)$/, '.snippet.$1');
    return hexo.render.render({path: sourcePath});
}, {async: true});

hexo.extend.tag.register('snippetwith', function(args, content) {
	let yamlRenderer = hexo.extend.renderer.get('yml', false);
    return yamlRenderer({text: content}).then(contentObject => {
        let sourcePath = args[0];
        let pathType = args[1];
        if (sourcePath){
            sourcePath = getActualLayoutPathFromArgs(sourcePath, pathType, this.source, hexo.source_dir);
        } else {
            // get sourcePath from content
            contentObject.source ??= this.source;
            sourcePath = path.join(hexo.source_dir, contentObject.source);
        }
        sourcePath = sourcePath.replace(/.([^./\\]*)$/, '.snippet.$1');
        return hexo.render.render({path: sourcePath}, contentObject);
    });
}, {ends: true, async: true});

// makes renderable files under post asset folder to be pages

// find the processor responsible for pages
const originalExclude = hexo.config.exclude;
hexo.config.exclude = []; // temporarily remove exclude rules
const pageProcessor = hexo.extend.processor.list().find(processor => processor.pattern.test('dummy'));
hexo.config.exclude = originalExclude;

const File = hexo.source.File;

hexo.extend.filter.register('before_generate', function(){
    const PostAsset = this.model('PostAsset');
    return Promise.map(PostAsset.toArray(), asset => {
        const { source, path } = asset;
        if (asset.renderable && this.render.isRenderable(path)) {
            // remove this post asset and load it as a page
            asset.remove();
            const dummyFile = new File({
                source: source,
                path: path,
                params: {renderable: true},
                type: File.TYPE_CREATE
            });
            return pageProcessor.process(dummyFile);
        }
        return;
    });
}, 9); // make it earlier than page rendering
