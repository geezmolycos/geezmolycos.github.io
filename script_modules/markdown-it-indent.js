'use strict';

module.exports = function indent_plugin(md) {

    function processIndent(tokens, idx) {
        const token = tokens[idx];
        // no indentation indicator
        if (token.content[0] !== '^'){
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
        if (token.content.match(/^\^[\^\s]*$/)){
            token.content = token.content.replace(/^\^[\^\s]*/, '');
            return;
        }
        let initialIndent = (token.content.match(/^(\^[\^ ]*)/) || ['', ''])[1].length;
        // use indentation indicator count on the second line as on all following lines
        let followingIndent = (token.content.match(/\n(\^[\^ ]*)/) || ['', ''])[1].length;
        // clean up used indicators
        token.content = token.content.replace(/^\^[\^ ]*/, '').replace((/\n\^[\^ ]*/), '');

        // make style list for opening token
        var styleList = new Array();
        if (initialIndent) styleList.push('--initial-indent: ' + initialIndent / 2 + 'em;');
        if (followingIndent) styleList.push('--following-indent: ' + followingIndent / 2 + 'em;');
        tokens[idx-1].attrJoin('style', styleList.join(' '));
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
