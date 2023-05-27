
// Combine markdown-it-attributes, span, bracketed spans, and container

'use strict';

const markdown_it_attributes = require('markdown-it-attributes');
const markdown_it_span = require('../script_modules/markdown-it-span');
const markdown_it_indent = require('../script_modules/markdown-it-indent');
const markdownItFancyListPlugin = require("markdown-it-fancy-lists").markdownItFancyListPlugin;

let markdown_it_attributes_opts = {
    // optional, these are default options
    leftDelimiter: '{',
    rightDelimiter: '}',
    allowedAttributes: []  // empty array = all attributes are allowed
};

// combine attributes, span and container

// modified to eat empty attributes
function bracketed_spans(md) {

    function span(state) {
        var max = state.posMax
  
        if (state.src[state.pos] !== '[') {
            // opening [
            return false;
        }
  
        var labelStart = state.pos + 1;
        var labelEnd = state.md.helpers.parseLinkLabel(state, state.pos, true);
  
        if (labelEnd < 0) {
            // parser failed to find closing ]
            return false;
        }
  
        var pos = labelEnd + 1;
        if (pos < max && state.src[pos] === '{') {
            // probably found span
  
            // check for empty braces
            
            let emptyBrace = /{\s+}/y;
            emptyBrace.lastIndex = pos;
            emptyBrace.exec(state.src);
  
            state.pos = labelStart;
            state.posMax = labelEnd;
  
            state.push('span_open', 'span', 1);
            state.md.inline.tokenize(state);
            state.push('span_close', 'span', -1);
  
            state.pos = emptyBrace.lastIndex !== 0 ? emptyBrace.lastIndex : pos;
            state.posMax = max;
            return true;
        } else {
            return false;
        }
    }
  
    md.inline.ruler.push('bracketed-spans', span);
}

function containerRenderAttrs(token, slf){
    const info = markdown_it_attributes.parseInfo(markdown_it_attributes_opts, token.info);
    if (info) {
        const attrs = markdown_it_attributes.getAttrs(info.exp);
        token.info = info.text;
        markdown_it_attributes.applyAttrs(markdown_it_attributes_opts, token, attrs);
    }
    return slf.renderAttrs(token);
}

let pluginsLoaded = false;
hexo.extend.filter.register('markdown-it:renderer', function (md) {
    if (pluginsLoaded){
        return;
    }
    pluginsLoaded = true;
    md
    .use(markdown_it_indent)
    .use(bracketed_spans)
    .use(markdown_it_span)
    .use(markdown_it_attributes.default, markdown_it_attributes_opts)
    .use(require('markdown-it-implicit-figures'), { figcaption: true }) // need to load after attributes to let attributes parse first
    .use(markdownItFancyListPlugin)
    .use(require('../script_modules/markdown-it-sidenote'));

    md.use(require('markdown-it-container'), 'dynamic', {

        validate: function(params) {
            return params.trim().match(/^{/);
        },
        
        render: function (tokens, idx, options, env, slf) {
            var token = tokens[idx];
            var renderedAttrs = containerRenderAttrs(token, slf);
            if (token.nesting === 1) {
                return '<div' + renderedAttrs + '>';
            } else {
                return '</div>';
            }
        }
    });
    // simple spoiler
    md.use(require('markdown-it-container'), 'spoiler', {

        validate: function(params) {
            return params.trim().match(/^spoiler/);
        },
        
        render: function (tokens, idx, options, env, slf) {
            var token = tokens[idx];
            var renderedAttrs = containerRenderAttrs(token, slf);

            var m = token.info.trim().match(/^spoiler\s*(.*)/);
        
            if (tokens[idx].nesting === 1) {
                // opening tag
                return '<details' + renderedAttrs + '><summary>' + md.renderInline(m[1]) + '</summary>\n';
        
            } else {
                // closing tag
                return '</details>\n';
            }
        }
    });
    // indentation
    md.use(require('markdown-it-container'), 'indent', {

        validate: function(params) {
            return params.trim().match(/^indent/);
        },
        
        render: function (tokens, idx, options, env, slf) {
            var token = tokens[idx];
            var renderedAttrs = containerRenderAttrs(token, slf);

            var m = token.info.trim().match(/^indent\s*(\S*)\s*(\S*)/) || ['', '0', '0'];

            var initialIndent = parseFloat(m[1])
            var followingIndent = parseFloat(m[2]) || initialIndent;
            // make style list for token
            var styleList = new Array();
            if (initialIndent) styleList.push('--initial-indent: ' + initialIndent / 2 + 'em;');
            if (followingIndent) styleList.push('--following-indent: ' + followingIndent / 2 + 'em;');
            token.attrJoin('style', styleList.join(''));
            token.attrJoin('class', 'indented');

            renderedAttrs = slf.renderAttrs(token);
        
            if (tokens[idx].nesting === 1) {
                // opening tag
                return '<div' + renderedAttrs + '>\n';
        
            } else {
                // closing tag
                return '</div>\n';
            }
        }
    });
});

