---
title: 自定义布局和插入嵌入片段测试
author: geezmolycos
categories:
  - virt
tags:
  - tech
  - web
  - site
  - hexo
lang: zh-cmn-hans-cn
date:    2023-05-20 16:59:40
updated: 2023-05-23 00:48:22
---

这篇文章可以插入自定义布局，或插入嵌入片段。原理和动机详见 {% post_link 2023/0514-hexo-nunjucks-include %}

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

- [子页面](render.html)
- [目录下的子页面](subsub/sub.html)

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

content::span::{.note}content

:::spoiler test {.note .warning}
content
:::

:::spoiler
content
:::

## Indentation

- lolol
  - lolol2
- lolol3
  
  llol

- lol4

This is an example paragraph with\
a hard break

This is an example paragraph, a piece ~[* Actually, *this* is side note instead of the paragraph] of side note

This is a paragraph^[paragraph]
    with uneven
      indentation

    This is a code block
    with uneven
  indentation

^ This is a indented paragraph

^

^ \
^ ^ before is an empty paragraph, and this is another indented paragraph. Because the indentation is set for different lines, this is an example of hanging indentation.

### Indentation testing

Head indent:

^ ^
This is 2em head indentation. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

First line indent:

^ ^ This is 2em first line indentation. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Hanging indent:

\
^ ^ This is 2em following line indentation without first line. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

All three indent:

^
^ ^ ^ \
^ ^ All three types of indentation. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

| The limerick packs laughs anatomical
| In space that is quite economical.
|    	But the good ones I've seen
|    So seldom are clean
| And the clean ones so seldom are comical

| 200 Main St.
| Berkeley, CA 94718

_test_

:::indent 2
This is a normal paragraph in an indented div

^ This is a indented paragraph in an indented div
:::

i. foo
ii. bar
iii. baz

^

c. charlie
#. delta
   iv) subfour
   #) subfive
   #) subsix
#. echo
