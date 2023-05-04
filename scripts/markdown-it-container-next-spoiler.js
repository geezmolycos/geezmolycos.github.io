// NexT style note blocks and spoiler (as well as simple spoiler) for markdown-it-container

hexo.extend.filter.register('markdown-it:renderer', function(md) {
    // simple spoiler
    md.use(require('markdown-it-container'), 'spoiler', {

        validate: function(params) {
            return params.trim().match(/^spoiler\s+(.*)$/);
        },
        
        render: function (tokens, idx) {
            var m = tokens[idx].info.trim().match(/^spoiler\s+(.*)$/);
        
            if (tokens[idx].nesting === 1) {
                // opening tag
                return '<details><summary>' + md.renderInline(m[1]) + '</summary>\n';
        
            } else {
                // closing tag
                return '</details>\n';
            }
        }
    });
    // note
    md.use(require('markdown-it-container'), 'note', {

        validate: function(params) {
            return params.trim().match(/^note.*$/);
        },
        
        render: function (tokens, idx) {
            var m = tokens[idx].info.trim().match(/^note(?:\s+(default|primary|info|success|warning|danger))?(?:\s+(no-icon))?\s*(.*)$/);
            var m_class = '';
            var m_summary = '';
            if (m){
                m_class = 'note ' + (m[1] || '') + ' ' + (m[2] || '');
                m_summary = m[3];
            }

            if (!m_summary){
                if (tokens[idx].nesting === 1) {
                    // opening tag
                    return '<div class="' + md.utils.escapeHtml(m_class) + '">\n';
                } else {
                    // closing tag
                    return '</div>\n';
                }
            } else {
                if (tokens[idx].nesting === 1) {
                    // opening tag
                    return '<details class="' + md.utils.escapeHtml(m_class) + '"><summary>' + md.renderInline(m_summary) + '</summary>\n';
                } else {
                    // closing tag
                    return '</details>\n';
                }
            }
        }
    });
    // quick notes
    for (let key of ['info', 'success', 'warning', 'danger']){
        md.use(require('markdown-it-container'), key, {
            
            render: function (tokens, idx) {

                if (tokens[idx].nesting === 1) {
                    // opening tag
                    return '<div class="note no-icon ' + key + '">\n';
                } else {
                    // closing tag
                    return '</div>\n';
                }
            }
        });
    }
});
