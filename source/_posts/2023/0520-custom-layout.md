---
title: 自定义布局和插入嵌入片段测试
author: geezmolycos
categories:
  - virt
  - site
tags:
  - tech
  - web
lang: zh-cmn-hans-cn
date:    2023-05-20 16:59:40
updated: 2023-05-23 00:48:22
---

这篇文章可以插入自定义布局，或插入嵌入片段。

## 插入一个 post asset folder 中的自定义布局

{% layoutwith example asset %}
name: 宋冬
mytime: {{date}}
{% endlayoutwith %}

<!-- more -->

## 插入 ejs 片段

{% render ejs %}
<div id="my-ejs-page">
  <% var fruits = ['apple', 'banana', 'orange']; %>
  <p>Here's a list of my favorite fruits:</p>
  <ul>
    <% fruits.forEach(function(fruit) { %>
      <li><%= fruit %></li>
    <% }); %>
  </ul>
</div>
{% endrender %}

## 插入其他文件

以下是 asset folder 中的 `example.snippet.md`，将其插入

{% snippet example.md asset %}

## 在 post asset folder 中建立子页面

[子页面](render.html)

## Definition list

This is a term
: this is an explanation
: and
{lang=en}

## Container

::: {.wang}

loal {.miao}
:::

lololo aaa [bbb] ccc

content::span::content
