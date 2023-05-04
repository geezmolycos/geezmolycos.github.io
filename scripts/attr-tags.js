// Add attrributes to html piece with Nunjucks
var utils = require('markdown-it-attrs/utils');

hexo.extend.tag.register('attr', function(args, content){
    var tagStartMatch = content.match(/^\s*<[^\s>]+/);
    if (!tagStartMatch){
        throw new Error('html tag match failed (' + content.substring(0, 10) + ')');
    }
    var joinedArgs = args.join(' ');
    var attrList = utils.getAttrs('\ufdd0' + joinedArgs + '\ufdd1', 0, {leftDelimiter: '\ufdd0', rightDelimiter: '\ufdd1'});
    var attrMap = new Map();
    for (let [k, v] of attrList){
        if (k === 'class' || k === 'css-module'){
            attrMap.set(k, (attrMap.get(k) ?? '') + ' ' + v);
        } else {
            attrMap.set(k, v);
        }
    }
    var attrStr = '';
    for (let [k, v] of attrMap){
        attrStr += ' ' + utils.escapeHtml(k) + '="' + utils.escapeHtml(v) + '"';
    }
    return content.substring(0, tagStartMatch[0].length) + attrStr + content.substring(tagStartMatch[0].length);
    
}, {ends: true});
