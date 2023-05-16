
// Add author info for posts
// Based on https://github.com/theme-next/hexo-next-coauthor
// and https://github.com/qzchenwl/hexo-generator-author

'use strict';

const pagination = require('hexo-pagination');

if (typeof Array.prototype.unique === 'undefined') {
    Array.prototype.unique = function() { return Array.from(new Set(this)); };
}

function authorToLink(author) {
    return ((this.config.author_map ?? {})[author] ?? author) + '/';
}

function regulateAuthors(post){
    if (post.author && !post.authors){
        post.authors = post.author;
        post.author = undefined;
    }
    if (post.authors && !Array.isArray(post.authors)) {
        post.authors = [post.authors];
    }
    post.authors = post.authors || [];
    return post;
}

hexo.extend.filter.register('template_locals', function(locals){
    if (locals.page.layout !== 'post'){
        return locals;
    }
    regulateAuthors(locals.page);
    return locals;
});

hexo.locals.set('authors', ()=>{
    let authorSet = new Set();
    hexo.locals.get('posts').forEach(
        post => regulateAuthors(post).authors.forEach(author => authorSet.add(author))
    );
    let authorPosts = new Map();
    authorSet.forEach(author => authorPosts.set(author, hexo.locals.get('posts').filter(
        post => post.authors.some(otherAuthor => author === otherAuthor)
    )));
    return authorPosts;
});

hexo.extend.helper.register('list_authors', function() {
    const count_posts = author => this.site.authors.get(author).length;
    const authors = Array.from(this.site.authors.keys()).map(author => `
        <li class="author-list-item category-list-item">
            <a class="author-list-link category-list-link" href="${this.url_for('/' + ((this.config.author_generator || {}).authors_dir || "authors/") + authorToLink.call(this, author))}">${author}</a>
            <span class="author-list-count category-list-count">${count_posts(author)}</span>
        </li>`).join('');

    return `<ul class="author-list category-list">${authors}</ul>`;
});

hexo.extend.helper.register('author_to_link', function(author) {
    return authorToLink.call(this, author);
});

hexo.extend.generator.register('author', function(locals) {
    const per_page = (this.config.author_generator || {}).per_page || this.config.per_page || 10;
    const paginationDir = (this.config.author_generator || {}).pagination_dir || 'page';
    const orderBy = (this.config.author_generator || {}).order_by || '-date';
    const authorsDir = (this.config.author_generator || {}).authors_dir || "authors/";
    if (authorsDir[authorsDir.length - 1] !== '/') authorsDir += '/';
    return Array.from(locals.authors.entries()).reduce((result, author) => {
        const posts = author[1].sort(orderBy);
        const data = pagination(authorsDir + authorToLink.call(hexo, author[0]), posts, {
            layout: ['author', 'archive', 'index'],
            format: paginationDir + '/%d/',
            perPage: per_page,
            data: {
                author: author[0]
            }
        });
        return result.concat(data);
    }, []);
});

function createAuthorPostMeta(author) {
    const authorsDir = (this.config.author_generator || {}).authors_dir || "authors/";
    return `<a href="${this.url_for(authorsDir + authorToLink.call(this, author))}">${author}</a>`;
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
    let authors = hexo.config.author_generator || {};

    injects.postMeta.raw('post-meta-author', `
    {%- if post.authors.length > 0 %}
    <span class="post-meta-item">
        <span class="post-meta-item-icon">
            <i class="fa-solid fa-at"></i>
        </span>
        <span class="post-meta-item-text">{{ __('post.author') }}</span>
        {{ author_post_meta(post.authors) }}
    </span>
    {%- endif %}
    `, {}, {}, authors.post_meta_order);

});
