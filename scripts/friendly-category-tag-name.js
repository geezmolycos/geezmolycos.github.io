
// Transform short category name and tag name (path name) to full display name

hexo.extend.filter.register('before_post_render', function(data){
    if (!this.config.category_map && !this.config.tag_map){
        return data;
    }
    if (data.layout != 'post'){
        return data;
    }
    if (!this.config.render_drafts && data.source.startsWith("_drafts/")){
        return data;
    }

    // Should transform

    if (this.config.category_map && data.categories.length > 0){
        let reverseMap = new Map(Object.entries(this.config.category_map).map(x => [x[1], x[0]]));
        let idCategories = new Map();
        for (let { name, _id, parent } of data.categories.data){
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
        data.setCategories(Array.from(idCategories.values()));
    }
    if (this.config.tag_map && data.tags.length > 0){
        let reverseMap = new Map(Object.entries(this.config.tag_map).map(x => [x[1], x[0]]))
        let transformedTags = [];
        for (let { name } of data.tags.data){
            name = reverseMap.get(name) ?? name;
            transformedTags.push(name);
        }
        data.setTags(transformedTags);
    }
    return data;
});
