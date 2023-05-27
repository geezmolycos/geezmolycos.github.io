
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
const { escapeHTML } = require('hexo-util');

const source_prefix = 'source/';

function load_layout_file(path, virtualPath){
    let content = fs.readFileSync(path);
    hexo.theme.setView(virtualPath, content);
}

hexo.extend.filter.register('after_init', function(){
    // load global layouts from "layout" directory
    const layoutDir = (hexo.config.layout_dir || 'layout').replace(/\\/g, '/').replace(/\/$/, '');
    const files = fs.listDirSync(layoutDir);

    files.forEach(function(file) {
        file = file.replace(/\\/g, '/');
        let filePath = layoutDir + '/' + file;
        load_layout_file(filePath, file);
        hexo.log.debug(`Loaded custom layout ${file}`);
    });
});

// Exclude layout files
hexo.config.exclude ??= new Array();
hexo.config.skip_render ??= new Array();
hexo.config.exclude.push('(**).layout.*([^./\\\\])');
hexo.config.skip_render.push('(**).layout.*([^./\\\\])');

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

function wrapCommentsSync(name, string, args){
    let argLine = '';
    args.forEach(arg => {
        argLine += ' ' + escapeHTML(arg);
    });
    return (
        '<!-- ' + name + argLine + ' -->\n'
        + string
        + '\n<!-- end' + name + argLine + ' -->'
        );
}

function wrapComments(name, string, args){
    if (string instanceof Promise){
        return string.then(s => wrapCommentsSync(name, s, args));
    } else {
        return wrapCommentsSync(name, string, args);
    }
}

// render layout
hexo.extend.tag.register('layout', function(args){
    let layoutPath = args[0];
    let pathType = args[1];
    layoutPath = getActualLayoutPathFromArgs(layoutPath, pathType, this.source);
    return wrapComments('layout', hexo.theme.getView(layoutPath).render({page: this}), args);
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
        contentObject.page ??= this; // make parent variables available to layout
        return wrapComments('layout', hexo.theme.getView(layoutPath).render(contentObject), args);
    });
}, {ends: true, async: true});

// Disable rendering for snippet
hexo.config.exclude ??= new Array();
hexo.config.skip_render ??= new Array();
hexo.config.exclude.push('(**).snippet.*([^./\\\\])');
hexo.config.skip_render.push('(**).snippet.*([^./\\\\])');

// render text with engine
hexo.extend.tag.register('render', function(args, content) {
    let engine = args[0];
    return wrapComments('render', hexo.render.render({text: content, engine: engine}), args);
}, {ends: true, async: true});

// render text with front matter
hexo.extend.tag.register('renderwith', function(args, content) {
    let engine = args[0];
    let data = yfm(content);
    data._parent ??= this; // make parent variables available to layout
    return wrapComments('render', hexo.render.render({text: data._content, engine: engine}, data), args);
}, {ends: true, async: true});

// render snippet file
hexo.extend.tag.register('snippet', function(args) {
	let sourcePath = args[0];
    let pathType = args[1];
    sourcePath = getActualLayoutPathFromArgs(sourcePath, pathType, this.source, hexo.source_dir);
    sourcePath = sourcePath.replace(/.([^./\\]*)$/, '.snippet.$1');
    return wrapComments('snippet', hexo.render.render({path: sourcePath}), args);
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
        contentObject._parent ??= this; // make parent variables available to layout
        sourcePath = sourcePath.replace(/.([^./\\]*)$/, '.snippet.$1');
        return wrapComments('snippet', hexo.render.render({path: sourcePath}, contentObject), args);
    });
}, {ends: true, async: true});

// makes renderable files with '.page' under post asset folder to be pages

// find the processor responsible for pages (for later use)
const originalExclude = hexo.config.exclude;
hexo.config.exclude = []; // temporarily remove exclude rules
const pageProcessor = hexo.extend.processor.list().find(processor => processor.pattern.test('dummy'));
hexo.config.exclude = originalExclude;

// Disable rendering for page asset
hexo.config.exclude ??= new Array();
hexo.config.skip_render ??= new Array();
hexo.config.exclude.push('(**).page.*([^./\\\\])');
hexo.config.skip_render.push('(**).page.*([^./\\\\])');

let pendingFiles = [];
let basePost = new Map();

hexo.extend.processor.register(/.page.[^./\\]+?/, function(file){
    pendingFiles.push(file);
});

// as all posts required are loaded, generate pages
hexo.extend.filter.register('before_generate', function(){
    const Post = hexo.model('Post');
    const Page = hexo.model('Page');
    return Promise.all(pendingFiles.map(file => {
        // TODO: Better post searching
        const post = Post.toArray().find(post => file.source.startsWith(post.asset_dir));
        if (!post){
            hexo.log.warn(`No post found for ${file.source}. It may not be in a post asset folder.`);
            return;
        }
        let relativeToAssetDir = path.posix.normalize(path.relative(post.asset_dir, file.source));
        let fullpath = path.posix.join(post.path, relativeToAssetDir).replace(/.page.([^./\\]*)$/, '.$1');
        file.params.renderable = hexo.render.isRenderable(fullpath);
        file.path = fullpath;
        if (file.type == 'delete'){ // for binding variables to pages
            basePost.delete(fullpath);
        } else {
            basePost.set(fullpath, post.path);
        }
        return pageProcessor.process(file);
    })).then(() => {
        pendingFiles = [];
        return Promise.all(Array.from(basePost.entries()).map(([fullpath, basepath]) => {
            return Page.update({source: fullpath}, {
                base_post_path: basepath,
                base_post_link: hexo.extend.helper.get('url_for').bind(hexo)(basepath)
            }); // set variable to use in the page
        }));
    });
}, 9);
