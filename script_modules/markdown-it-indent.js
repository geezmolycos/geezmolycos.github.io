'use strict';

module.exports = function indent_plugin(md) {

    function processIndent(tokens, idx) {
        const token = tokens[idx];
        // no indentation indicator
        if (!token.content.match(/(?:^|\n)\^/)){
            return;
        }
        // treat as hidden paragraph
        if (token.content.match(/^\^\s*$/)){
            token.content = '';
            tokens[idx-1].hidden = true;
            let i;
            for (i = idx; tokens[i].level !== tokens[idx-1].level; ++i){
                tokens[i].hidden = true;
            }
            tokens[i].hidden = true;
            return;
        }
        // treat as no content
        if (token.content.match(/^(?:\^ )*\^ *$/)){
            token.content = '';
            return;
        }
        // initialize variables first
        let headIndent;
        let bodyIndent = [];

        let pendingContent = token.content;
        let newContent = '';
        // match headIndent (^ ^ ..., otherwise empty for the first line)
        let headLineMatch = pendingContent.match(/^((?:\^ )*\^) *\n/);
        if (headLineMatch){
            headIndent = Math.floor((headLineMatch[1].length + 1) / 2);
            pendingContent = pendingContent.substring(headLineMatch[0].length);
        }
        for (let i of [0, 1]){
            let lineMatch = pendingContent.match(/^((?:\^ )+)/);
            if (lineMatch){
                bodyIndent[i] = Math.floor((lineMatch[1].length + 1) / 2);
                pendingContent = pendingContent.substring(lineMatch[0].length);
            }
            // skip line content
            let lineContentMatch = pendingContent.match(/^.*?(?:\n|$)/);
            if (lineContentMatch[0] !== '\\' && lineContentMatch[0] !== '\\\n'){
                newContent += lineContentMatch[0];
            }
            pendingContent = pendingContent.substring(lineContentMatch[0].length);
        }
        newContent += pendingContent;

        token.content = newContent;
        
        // make style list for opening token
        var styleList = new Array();
        if (headIndent) styleList.push('--head-indent: ' + headIndent + 'em;');
        if (bodyIndent[0]) styleList.push('--initial-indent: ' + bodyIndent[0] + 'em;');
        if (bodyIndent[1]) styleList.push('--following-indent: ' + bodyIndent[1] + 'em;');
        tokens[idx-1].attrJoin('style', styleList.join(' '));
        tokens[idx-1].attrJoin('class', 'indented');
    }

    // Borrowed from <https://pandoc.org/MANUAL.html#line-blocks>
    function processLineBlock(tokens, idx){
        const token = tokens[idx];
        let contentLines = token.content.split(/(?<=\n)/g);
        contentLines = contentLines.map(line => {
            if (line[0] == '|' && line[1] == ' '){
                return line.substring(2).replace(/\n$/, '<br>\n').replace(/\t/g, function(match, offset) {
                    // calculate number of spaces to replace tab with
                    // since we start at index 2, we need to add 2
                    let spaces = 4 - ((offset + 2) % 4);
                    return ' '.repeat(spaces); // return replacement string
                  }).replaceAll(' ', '&nbsp;');
            } else {
                return line;
            }
        });
        token.content = contentLines.join('');
    }

    function indent(state) {
        const tokens = state.tokens;

        for (let i = 0; i < tokens.length; i++) {
            // the first inline tag under an opening tag
            if (tokens[i].type === 'inline' && i > 0 && tokens[i-1].nesting === 1){
                processIndent(tokens, i);
                processLineBlock(tokens, i);
            }
        }
    }
    
    md.core.ruler.after('block', 'indent', indent);

}
