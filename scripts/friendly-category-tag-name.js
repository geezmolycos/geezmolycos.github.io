
// Transform short category name and tag name (path name) to full display name

hexo.extend.filter.register('before_generate', function(){
    if (!this.config.category_map && !this.config.tag_map){
        return;
    }
    const Post = hexo.model('Post');
    const Tag = hexo.model('Tag');
    const Category = hexo.model('Category');
    return Promise.all(Post.map(post => {
        if (!hexo.config.render_drafts && post.source.startsWith("_drafts/")){
            return;
        }
        // Should transform

        let promises = [];

        if (hexo.config.category_map && post.categories.length > 0){
            let reverseMap = new Map(Object.entries(hexo.config.category_map).map(x => [x[1], x[0]]));
            let idCategories = new Map();
            for (let { name, _id, parent } of post.categories.data){
                name = reverseMap.get(name) ?? name; // translate name to friendly name
                if (parent){ // append this to parent category hierarchy
                    let before = idCategories.get(parent);
                    before.push(name);
                    idCategories.delete(parent);
                    idCategories.set(_id, before);
                } else { // new category
                    idCategories.set(_id, [name]);
                }
            }
            promises.push(post.setCategories(Array.from(idCategories.values())));
        }
        if (hexo.config.tag_map && post.tags.length > 0){
            let reverseMap = new Map(Object.entries(hexo.config.tag_map).map(x => [x[1], x[0]]))
            let transformedTags = [];
            for (let { name } of post.tags.data){
                name = reverseMap.get(name) ?? name;
                transformedTags.push(name);
            }
            promises.push(post.setTags(transformedTags));
        }
        return Promise.all(promises);
    })).then(() => {
        // remove empty tags and categories
        return Promise.all([
            Promise.all(Tag.map(tag => {
                if (tag.length === 0){
                    return tag.remove();
                }
            })),
            Promise.all(Category.map(cat => {
                if (cat.length === 0){
                    return cat.remove();
                }
            }))
        ]);
    });
}, 9); // before rendering
