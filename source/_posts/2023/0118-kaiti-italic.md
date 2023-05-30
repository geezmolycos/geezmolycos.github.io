---
title: "楷体和斜体"
author: geezmolycos
categories:
  - virt
  - site
tags:
  - tech
  - web
  - 中文
  - jekyll-post
date: 2023-01-18 00:48:33 +0800
updated: 2023-01-18 00:48:33 +0800
---

:::warning
注：已过时，请参考{% post_link 2023/0507-new-kaiti-for-zh-em %}
:::

HTML中的`<i>`, `<em>`等标签，默认是使用斜体样式，中文内容观感不好。我将中文采用楷体，英文采用斜体。

本来，打算用css写个样式，把这些标签的所有中文字符弄成直体，英文字符弄成斜体，发现不好做。遂采用手动在markdown中标记语言的方式，用`lang`属性完成了需求。

<!-- more -->

以下是测试：

This is an sentence written in English. *Harry Potter and the Philosopher's stone* is an book written by *J.K.Rowling*.
{: lang='en'}
It is written in this book that:
{: lang='en'}
> There is an wizard who is named *Harry Potter*.
{: lang='en'}

以上内容使用Kramdown的添加属性的语法，在每一段落后添加了`{: lang='en'}`，也可以这样：

<div markdown='1'>
This is an sentence written in English. *Harry Potter and the Philosopher's stone* is an book written by *J.K.Rowling*.

It is written in this book that:
> There is an wizard who is named *Harry Potter*.
</div>{: lang='en'}

使用`<div>`标签整体包裹起来，在`</div>`后面加入`{: lang='en'}`。

因为默认语言是汉语(`zh-cmn-hans-cn`)，所以会套用css规则，使得强调字体为楷体。例如：

课本上写道：『*第13课 论语 子曰：「*学而时习之，不亦说乎？*」*』

也顺便测试一下`blockquote`能不能多层嵌套

> 这是第一层
> > 第二层
> > > 我在*第三层*

这是*单星号*，**双星号**
