---
title: 新的 CSS 中文强调楷体规则
author: geezmolycos
categories:
  - virt
  - site
tags:
  - tech
  - lit
lang: zh-cn
date: 2023-05-07 17:28:03
updated: 2023-05-07 17:28:03
---

现在我使用了新的中文强调楷体规则，让强调用得更放心，写作更容易。

新的规则改变了思路，总体上只改变中文的强调格式。现在利用`@font-face`创建了虚拟字体，其斜体对应着普通的楷体。之后将该虚拟字体只限定在中文的范围内，如果遇到英文就会 fallback 到默认的斜体上。

<!-- more -->

以下是新的测试

## 语言设置为英文

<div lang=en>

This is an sentence written in English. *Harry Potter and the Philosopher's stone* is an book written by *J.K.Rowling*.
It is written in this book that:
> There is an wizard who is named *Harry Potter*.

课本上写道：『*第13课 论语 子曰：「*学而时习之，不亦说乎？*」*』

也顺便测试一下`blockquote`能不能多层嵌套

> 这是第一层
> > 第二层
> > > 我在*第三层*

这是*单星号*，**双星号**，***三星号***

</div>

## 语言设置为简体中文

<div lang=zh-cmn-hans-cn>

This is an sentence written in English. *Harry Potter and the Philosopher's stone* is an book written by *J.K.Rowling*.
It is written in this book that:
> There is an wizard who is named *Harry Potter*.

课本上写道：『*第13课 论语 子曰：「*学而时习之，不亦说乎？*」*』

也顺便测试一下`blockquote`能不能多层嵌套

> 这是第一层
> > 第二层
> > > 我在*第三层*

这是*单星号*，**双星号**，***三星号***

</div>

## 语言设置为繁体中文(台湾)

<div lang=zh-cmn-hant-tw>

This is an sentence written in English. *Harry Potter and the Philosopher's stone* is an book written by *J.K.Rowling*.
It is written in this book that:
> There is an wizard who is named *Harry Potter*.

课本上写道：『*第13课 论语 子曰：「*学而时习之，不亦说乎？*」*』

也顺便测试一下`blockquote`能不能多层嵌套

> 这是第一层
> > 第二层
> > > 我在*第三层*

这是*单星号*，**双星号**，***三星号***

</div>
