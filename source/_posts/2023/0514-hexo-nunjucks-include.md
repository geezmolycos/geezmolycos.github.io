---
title: Hexo 的渲染流程和 include
author: geezmolycos
categories:
  - virt
tags:
  - tech
  - web
  - site
lang: zh-cmn-hans-cn
date:    2023-05-14 00:16:07
updated: 2023-05-30 23:05:44
---

Hexo渲染一个（或多个）页面的流程，可以分为以下几个步骤

- [`generate`](https://github.com/hexojs/hexo/blob/8b95bbc722e5c77a7e8125441ed64d2ea3524ac0/lib/hexo/index.js#L442)~[链接可以点击]
  - 执行 [`before_generate` filters](https://github.com/hexojs/hexo/blob/8b95bbc722e5c77a7e8125441ed64d2ea3524ac0/lib/hexo/index.js#LL452C9-L452C9)
    - 渲染页面内容~[* 指文章正文的内容，即 markdown 中写的东西] [`render_post`](https://github.com/hexojs/hexo/blob/8b95bbc722e5c77a7e8125441ed64d2ea3524ac0/lib/plugins/filter/before_generate/render_post.js)
      - [执行 `before_post_render` filter](https://github.com/hexojs/hexo/blob/8b95bbc722e5c77a7e8125441ed64d2ea3524ac0/lib/hexo/post.js#LL413C30-L413C48)
      - [转义内嵌 nunjucks 标签](https://github.com/hexojs/hexo/blob/8b95bbc722e5c77a7e8125441ed64d2ea3524ac0/lib/hexo/post.js#L418)~[+ 将 nunjucks 标签替换成编号的 HTML 注释，详见[相关代码](https://github.com/hexojs/hexo/blob/8b95bbc722e5c77a7e8125441ed64d2ea3524ac0/lib/hexo/post.js#L67)]
      - 根据文件类型，使用渲染器渲染其他内容
      - 恢复上述内嵌 nunjucks 标签，[使用 tag 渲染其内容](https://github.com/hexojs/hexo/blob/8b95bbc722e5c77a7e8125441ed64d2ea3524ac0/lib/hexo/post.js#L439)
      - 执行 `after_post_render` filter
    - [渲染和应用 layout 文件](https://github.com/hexojs/hexo/blob/8b95bbc722e5c77a7e8125441ed64d2ea3524ac0/lib/hexo/index.js#L453)~[# 指正文以外的内容，例如导航栏、索引]
    - [运行 `generator`](https://github.com/hexojs/hexo/blob/8b95bbc722e5c77a7e8125441ed64d2ea3524ac0/lib/hexo/index.js#L392)

其中，渲染 layout 文件时所使用的变量，和渲染页面内容时所用的变量是不同的，才会使 [Templates] 不能放到 source 文件夹中使用，而且文章中也不能使用 [Helpers] 或 [Variables]。这些官方文档中所述的内容，只适用于编写主题时。主题里面可以使用这些，但是平时的文章中不能使用，也不能自己自定义文章中的 layout。要自己添加 layout，必须要修改主题的文件。

为了解决上述问题，我编写了可以自己加载和嵌入主题文件的插件，会在将来发布。如果现在想使用，也可以到该[网站的 github repo] 中查看脚本。结果请见 {% post_link 2023/0520-custom-layout %}。里面也包括我自己写的 markdown-it 的插件，未来也会发布。

另外，在渲染页面内容的 tag 标签时，其 include 标签也是可以正常工作的，不过因为没有设置目录，它使用了[默认的目录，是 `views`](https://github.com/mozilla/nunjucks/blob/ea0d6d5396d39d9eed1b864febb36fbeca908f23/nunjucks/src/environment.js#LL68C56-L68C56)。所以如果不想使用插件，而且只是想插入纯文本或固定 HTML 内容的话，还是可以正常用。只需要在项目根目录创建一个 `views` 文件夹，把要 include 的文件都放到里面，就可以了。

[Templates]: https://hexo.io/docs/templates
[Helpers]: https://hexo.io/docs/helpers
[Variables]: https://hexo.io/docs/variables
[网站的 github repo]: https://github.com/geezmolycos/geezmolycos.github.io
