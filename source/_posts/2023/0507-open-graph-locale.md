---
title: 关于 og:locale 我想多了
author: geezmolycos
categories:
  - virt
  - site
tags:
  - tech
  - web
lang: zh-cn
date: 2023-05-07 23:43:07
updated: 2023-05-07 23:43:07
---

我以为 `og:locale` 的取值会影响浏览器对元素的语言判定，而且我以为它的值和 HTML 中的 [lang 属性]一样，可以包括 script 和 region subtag。

我以为 Hexo 的实现是有缺陷的，没在列表里的语言就会把这项留空，我甚至还特意为它写了个脚本，写到一半，想到去搜一下，发现自己想多了。其实它只能包括语言和地区。

我看 Jekyll 的实现就直接复制过去的，结果是 Jekyll 实现的不合规……

[lang 属性]: https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang
<!-- more -->

```js
const originalOpenGraph = hexo.extend.helper.get('open_graph');

hexo.extend.helper.register('open_graph', function(options = {}) {
    const { config, page } = this;
    const { content } = page;
    let og = originalOpenGraph.bind(this)(options);
    const language = options.language || page.lang || page.language || config.language;
    const renderedLanguage = og.match(/<meta property="og:locale" content="(.*?)">/)[1];
    if (renderedLanguage === ''){
        // no language in og:locale
        
    }
    return og;
});
```
