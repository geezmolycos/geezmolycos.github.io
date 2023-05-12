
// Transform short category name and tag name (path name) to full display name

// dynamically change the function responsible for processing posts

// let postProcessorIndex = hexo.extend.processor.store.findIndex((element) => {
//     if (element.pattern.test('_posts/')){
//         // is the processor for posts
//         return true;
//     }
//     return false;
// });

// if (postProcessorIndex === -1){
//     hexo.log.warn('can\'t found processor for posts');
// } else {
//     // patch the original processor with our own one;
//     let { pattern: origPattern, process: origProcess } = hexo.extend.processor.store[postProcessorIndex];

//     function newProcess(file){
//         console.log(file);
//         let processed = origProcess(file);
//         processed.then(() => {
//             const Post = hexo.model('Post');
//             console.log(file.path);
//             const doc = Post.findOne({source: file.path});
//             if (doc === undefined){
//                 console.log('failed');
//             } else {
//                 doc.setCategories(['okay']);
//             }
//         });
//         console.log(processed);
//         return processed;
//     }

//     hexo.extend.processor.store[postProcessorIndex].process = newProcess;
// }

const { parse: yfm } = require('hexo-front-matter');

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


    if (data.categories && this.config.category_map){
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
    if (data.tags && this.config.tags_map){
        let reverseMap = new Map(Object.entries(this.config.tags_map).map(x => [x[1], x[0]]))
        let transformedTags = [];
        for (let tag of data.tags){
            let transformedTag = reverseMap.get(tag) ?? tag;
            transformedTags.push(transformedTag);
        }
        data.setTags(transformedTags);
    }
    return data;
});
