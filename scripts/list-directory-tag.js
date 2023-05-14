
// Generate a list of files under a directory

'use strict';

const fs = require('hexo-fs');

const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
};

hexo.extend.tag.register('list_files', function(args) {
    const dirFromSource = args[0].replace(/\\/g, '/').replace(/\/$/, '');
    const dirFromRoot = hexo.source_dir.replace(/\\/g, '/').replace(/\/$/, '') + '/' + dirFromSource;
    const files = fs.listDirSync(dirFromRoot);
    let html = '<table><tbody>';

    files.forEach(function(file) {
        file = file.replace(/\\/g, '/');
        const stats = fs.statSync(dirFromRoot + '/' + file);
        const size = numberWithCommas(stats.size);
        const link = hexo.extend.helper.get('url_for').bind(hexo)(dirFromSource + '/' + file);

        html += '<tr><td><a href="' + link + '">' + file + '</a></td><td style="text-align: right;">' + size + '</td></tr>';
    });

    html += '</tbody></table>';
    return html;
});

hexo.extend.filter.register('after_generate', function(){
    // ...
  });
