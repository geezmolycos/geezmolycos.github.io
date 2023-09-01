// Process sidenotes
//
'use strict';

////////////////////////////////////////////////////////////////////////////////
// Renderer

function render_sidenote_open(tokens, idx, options, env, slf) {
  let referenceString = '';
  let markerString = '';
  if (tokens[idx].meta && tokens[idx].meta.symbol){
    referenceString = '<sup class="sidenote-ref">' + tokens[idx].meta.symbol + '</sup>';
    markerString = '<span class="sidenote-marker">' + tokens[idx].meta.symbol + '</span>';
  }
  return (
    '<span class="sidenote">' + referenceString +
    '<small class="sidenote-content">' + markerString
    );
}

function render_sidenote_close(tokens, idx, options, env, slf) {
  return '</small></span>';
}

module.exports = function sidenote_plugin(md) {
  var parseLinkLabel = md.helpers.parseLinkLabel;

  md.renderer.rules.sidenote_open = render_sidenote_open;
  md.renderer.rules.sidenote_close = render_sidenote_close;

  // Process inline sidenotes (~[...])
  function sidenote_inline(state, silent) {
    var labelStart,
        labelEnd,
        max = state.posMax,
        start = state.pos;

    if (start + 2 >= max) { return false; }
    if (state.src.charCodeAt(start) !== 0x7E/* ~ */) { return false; }
    if (state.src.charCodeAt(start + 1) !== 0x5B/* [ */) { return false; }

    labelStart = start + 2;
    labelEnd = parseLinkLabel(state, start + 1);

    // parser failed to find ']', so it's not a valid note
    if (labelEnd < 0) { return false; }

    // We found the end of the link, and know for a fact it's a valid link;
    // so all that's left to do is to call tokenizer.
    //
    if (!silent) {
    
      var token = state.push('sidenote_open', '', 1);

      if (
        labelEnd - labelStart >= 2
        && state.src[labelStart + 1] == ' '
        && '*+#$|?'.includes(state.src[labelStart])
      ){
        // has reference symbol
        token.meta = token.meta || {};
        token.meta.symbol = new Map([
          ['*', '*'],
          ['+', '†'],
          ['#', '‡'],
          ['$', '§'],
          ['|', '‖'],
          ['?', '¶'],
        ]).get(state.src[labelStart]);
        labelStart += 2;
      }

      state.md.inline.parse(
        state.src.slice(labelStart, labelEnd),
        state.md,
        state.env,
        state.tokens
      );

      state.push('sidenote_close', '', -1);
    }

    state.pos = labelEnd + 1;
    state.posMax = max;
    return true;
  }

  md.inline.ruler.after('image', 'sidenote_inline', sidenote_inline);
};
