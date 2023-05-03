// NexT style note blocks and spoiler (as well as simple spoiler) for markdown-it-container

hexo.extend.filter.register('markdown-it:renderer', function(md) {
    md.use(require('markdown-it-container'), 'spoiler', {

    validate: function(params) {
        return params.trim().match(/^spoiler\s+(.*)$/);
    },
    
    render: function (tokens, idx) {
        var m = tokens[idx].info.trim().match(/^spoiler\s+(.*)$/);
    
        if (tokens[idx].nesting === 1) {
            // opening tag
            return '<details><summary>' + md.utils.escapeHtml(m[1]) + '</summary>\n';
    
        } else {
            // closing tag
            return '</details>\n';
        }
    }
    });
});
