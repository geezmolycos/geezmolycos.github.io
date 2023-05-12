---
title: 链接中的蛇怪
categories:
  - virt
  - site
tags:
  - tech
author:
  - geezmolycos
  - yhkrbis
lang: zh-cn-cmn-hans
date: 2023-05-07 22:14:44
updated: 2023-05-07 22:14:49
---

这个网站的每一篇文章，链接里都有一个隐藏的[*蛇怪之眼*(*eye of the basilisk*)](https://explainxkcd.com/wiki/index.php/380:_Emoticon)。

<!-- more -->

将网站迁移到 Hexo 生成器以后，它的文章链接可以自定义了，更加灵活。在[Hexo 官方文档]中，给出了若干个文章链接中可以应用的变量。
网站上有一张表格给出了几个示例：

[Hexo 官方文档]: https://hexo.io/docs/permalinks#Variables

Setting | Result
--- | ---
`:year/:month/:day/:title/` | 2013/07/14/hello-world/
`:year-:month-:day-:title.html` | 2013-07-14-hello-world.html
`:category/:title/` | foo/bar/hello-world/
`:title-:hash/` | hello-world-a2c8ac003b43/

为了便于整理文件和按日期排序，我将所有文章归类到年文件夹中，而在文件名前端加上创建时的月和日。这样可以方便整理文章。
就像：`_posts/2023/0501-hexo-first.md`

但是我想根据 front-matter 中写的日期自动生成链接，而我想生成的链接是 `/blog/virt/site/2023-05-hexo-first/`，需要把文件名中的日期去掉。
其实也可以重新设计文件命名方式或者链接，但是我感觉这样更好。

我首先看了 Hexo 的源码，发现里面的变量是固定的几个，也没有提供可以添加变量的接口。
随后，我找到了一篇讲怎么修改链接格式的文章[^link]，里面说到可以用 API (`hexo.extend.filter.register('post_permalink', ...)`) 修改链接的格式。我就使用了这个方法。但是，如何判断哪里是需要删除的日期前缀呢？原文里面的链接格式是固定的，容易判断。我的链接格式万一要改，那到时候还要记得改这个脚本。

我想了一个聪明的办法，利用一个特殊字符来表示需要删除的日期前缀，我选择了 `U+FDD0`，它是一个不被使用的码位，可以给程序内部使用。我感觉这是这个字符绝佳的使用条件，于是就使用了。这个字符被 xkcd 称为蛇怪之眼[^eye]，很有意思。

修改完以后，另外一个问题出现了，{% post_link 2023/0502-hexo-playground %} 前面的图片显示不出来了。我一看，发现它本来应该解析成`/blog/virt/site/2023-05-hexo-playground/example.png`，结果解析成 `/blog/virt/site/2023-05-0502-hexo-playground/example.png` 了，就是日期前缀没去掉。

我想办法调试[^debug]了一下 [markdown-it] 的代码，发现没问题。这时候发现问题已经解决了。原来是我忘记 `hexo clean` 了。调试之前运行了一次 `hexo clean`，问题就修好了。

脚本大概是这样：

```js
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
```

[markdown-it]: https://github.com/markdown-it/markdown-it

[^link]: [Hexo修改永久链接格式并向后兼容](https://finisky.github.io/changepermalinkformat/)
[^eye]: [*蛇怪之眼*(*eye of the basilisk*)](https://explainxkcd.com/wiki/index.php/380:_Emoticon)
[^debug]: [Debug Hexo with VS Code](https://gary5496.github.io/2018/03/nodejs-debugging/)
