
// Add author info for posts
// Based on https://github.com/theme-next/hexo-next-coauthor
// and https://github.com/qzchenwl/hexo-generator-author

'use strict';

const pagination = require('hexo-pagination');

if (typeof Array.prototype.unique === 'undefined') {
    Array.prototype.unique = function() { return Array.from(new Set(this)); };
}

function author_to_url(author) {
    return ((this.config.authors ?? {})[author] ?? {}).link ?? author;
}

hexo.extend.filter.register('template_locals', function(locals) {
    if (typeof locals.site.authors === 'undefined') {
        locals.site.authors = locals.site.posts.map(post => post.author).flat().unique();
    }
});

hexo.extend.helper.register('list_authors', function() {
    const count_posts = author => this.site.posts.filter(post => (
        post.author instanceof Array ? post.author.includes(author) : post.author === author)).length;
    const authors = this.site.authors.map(author => `
        <li class="author-list-item">
            <a class="author-list-link" href="${author_to_url.call(this, author)}">${author}</a>
            <span class="author-list-count">${count_posts(author)}</span>
        </li>`).join('');

    return `<ul class="author-list">${authors}</ul>`;
});

hexo.extend.helper.register('author_to_url', function(author) {
    return author_to_url.call(this, author);
});

hexo.extend.generator.register('author', function(locals) {
    const posts = locals.posts;
    const authors = posts.map(post => post.author).flat().unique().map(author => (
        {name: author, posts: posts.filter((post) => (
            post.author instanceof Array ? post.author.includes(author) : post.author === author
        ))}
    ));
    const per_page = this.config.authors_per_page || this.config.per_page || 10;
    return authors.reduce((result, author) => {
        const posts = author.posts.sort('-date');
        const data = pagination('author/' + author_to_url.call(hexo, author.name), posts, {
            layout: ['author', 'archive', 'index'],
            perPage: per_page,
            data: {
                author: author.name
            }
        });
        return result.concat(data);
    }, []);
});

function createAuthorPostMeta(author) {
    return `<a href="${this.url_for('/author/' + author_to_url.call(this, author))}">${author}</a>`;
}

hexo.extend.helper.register('author_post_meta', function(names) {
    if (!Array.isArray(names)) {
        return createAuthorPostMeta.call(this, names);
    }
    return names.map(name => createAuthorPostMeta.call(this, name)).join(
        hexo.theme.i18n.get(hexo.config.language)['symbol.comma']
    );
});

hexo.extend.filter.register('theme_inject', function(injects) {
    let authors = hexo.config.authors || {};

    injects.postMeta.raw('post-meta-author', `
    {%- if post.author %}
    <span class="post-meta-item">
        <span class="post-meta-item-icon">
            <i class="fa fa-copyright"></i>
        </span>
        <span class="post-meta-item-text">{{ __('writer') + __('symbol.colon') }}</span>
        {{- author_post_meta(post.author) }}
    </span>
    {%- endif %}
    `, {}, {}, authors.post_meta_order);

});
