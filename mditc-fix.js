var md = require('markdown-it')();
var attributes = require('markdown-it-attributes');

let attributes_opts = {
  // optional, these are default options
  leftDelimiter: '{',
  rightDelimiter: '}',
  allowedAttributes: []  // empty array = all attributes are allowed
};

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
  };

  md.inline.ruler.push('bracketed-spans', span);
}

md.use(bracketed_spans)
.use(attributes.default, attributes_opts)
        .use(require('markdown-it-container'), 'dynamic', {
            validate: function () { return true; },
            render: function (tokens, idx, options, env, slf) {
                var token = tokens[idx];
                const info = attributes.parseInfo(attributes_opts, token.info);
                if (info) {
                  const attrs = attributes.getAttrs(info.exp);
                  token.info = info.text;
                  attributes.applyAttrs(attributes_opts, token, attrs);
                }
                var renderedAttrs = slf.renderAttrs(token);
                if (token.nesting === 1) {
                    return '<div' + renderedAttrs + '>';
                } else {
                    return '</div>';
                }
            }
        });

md.use(require('./script_modules/markdown-it-indent'));

// var src = `
// ::: {.outer}
// content {.inner}
// :::

// kkk{}

// ls[ls]{.c}
// la[la]{ }lol
// `;

var src = `
This is a paragraph
    with uneven
      indentation

    This is a paragraph
    with uneven
  indentation
`;

var res = md.render(src);

console.log(res);