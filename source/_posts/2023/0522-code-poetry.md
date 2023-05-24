---
title: JavaScript 代码写诗
author: geezmolycos
categories:
  - virt
tags:
  - lit
  - tech
lang: zh-cmn-hans-cn
date:    2023-05-22 22:39:06
updated: 2023-05-22 22:39:06
---

```js
const generator = (hexo) => ({ posts, pages }) =>
    [
        ...posts
            .filter(({ redirect_from }) => redirect_from && Array.isArray(redirect_from) && redirect_from.length > 0)
            .map((page) => page.redirect_from.map((redirect) => ({ redirect, page })))
            .reduce((result, current) => [...result, ...current], []),
        ...pages
            .filter(({ redirect_from }) => redirect_from && Array.isArray(redirect_from) && redirect_from.length > 0)
            .map((page) => page.redirect_from.map((redirect) => ({ redirect, page })))
            .reduce((result, current) => [...result, ...current], [])
    ].map(({ redirect, page }) => ({
        path: `${redirect}/index.html`,
        data: { target: page, redirect_from: redirect, layout: hexo.config.redirect.layout },
        layout: hexo.config.redirect.layout
    }));

module.exports = generator;
```

来源: [sergeyzwezdin/hexo-generator-redirect](https://github.com/sergeyzwezdin/hexo-generator-redirect/blob/master/lib/generator.js)
