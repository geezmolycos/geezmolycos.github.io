
// Use date in filenames to better sort articles, but strip it for permalinks
// U+FDD0 indicates the position of filename
hexo.extend.filter.register('post_permalink', function(original_link){
    var pivot = original_link.lastIndexOf("\ufdd0", original_link.length - 2);
    var original_prefix = original_link.substring(0, pivot);
    var original_title = original_link.substring(pivot + 1);

    var changed_title = original_title.replace(/^\d+-/, ''); // remove date prefix

    if (pivot === -1){ // no slash
        return changed_title;
    } else {
        return original_prefix + changed_title;
    }
});