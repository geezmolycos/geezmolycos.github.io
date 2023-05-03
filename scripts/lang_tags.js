hexo.extend.tag.register('hello', function(args) {
    return '<p>Hello, ' + args[0] + '!</p>';
});
