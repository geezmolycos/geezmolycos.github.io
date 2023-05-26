// Add attrributes to html piece with Nunjucks
const getAttrs = require('markdown-it-attributes').getAttrs;

const escapeHtml = hexo.extend.helper.get('escape_html').bind(hexo);

hexo.extend.tag.register('attr', function(args, content){
    var tagStartMatch = content.match(/^\s*<[^\s>]+/);
    if (!tagStartMatch){
        throw new Error('html tag match failed (' + content.substring(0, 10) + ')');
    }
    var joinedArgs = args.join(' ');
    var attrList = getAttrs(joinedArgs);
    var attrMap = new Map();
    for (let {key, value} of attrList){
        if (key === 'class' || key === 'css-module'){
            attrMap.set(key, (attrMap.get(key) ?? '') + ' ' + value.join(' '));
        } else {
            attrMap.set(key, value.join(' '));
        }
    }
    var attrStr = '';
    for (let [k, v] of attrMap){
        attrStr += ' ' + escapeHtml(k) + '="' + escapeHtml(v) + '"';
    }
    return content.substring(0, tagStartMatch[0].length) + attrStr + content.substring(tagStartMatch[0].length);
    
}, {ends: true});
