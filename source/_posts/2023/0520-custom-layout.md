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

::: {.sidenote}
This is a piece of side note
:::

<style>
.sidenote__content-parenthesis{
  /* // Hide from view, but not from screen readers. */
  text-indent: -99999px;
}

@media (max-width: 1000px){
  .sidenote__content{
    /* // Hide from view, but not from screen readers. */
    /* // The vertical position doesn't change, which is better for handling keyboard focus than 'text-indent: -99999px;' */
    position: absolute;
    left: -99999px;
    top: auto;
  }
  .sidenote.active .sidenote__content{
    position: relative;
    left: auto;
  }
}

@media (min-width: 1000px){
  .sidenote__content{
    display: block;
    float: right;
    margin-right: -250px;
    /* margin-right: -300px; */
    width: 200px;
  }
}
</style>

<!-- line breaks added for readability.
Remove them to avoid rendering of superfluous spaces. -->
<p> A paragraph with a
  <span class="sidenote">
    <label
      tabindex="0"
      title="The content of the sidenote."
      aria-describedby="sidenote-1"
      class="sidenote__button" onclick="this.parentElement.classList.toggle('active');"
      onKeypress="if(event.key === 'Enter' || event.key === ' '){event.preventDefault(); this.parentNode.classList.toggle('active');"
    >
      clickable element
    </label>
    <small class="sidenote__content sidebar-inner" >
      <span class="sidenote__content-parenthesis"> (sidenote: </span>
      The content of the sidenote.
      <span class="sidenote__content-parenthesis">)</span>
    </small>
  </span>
that can be clicked to show more details.
</p>

This is a paragraph
    with uneven
      indentation

    This is a code block
    with uneven
  indentation

^ This is a indented paragraph

^

^^
^^^^before is an empty paragraph, and this is another indented paragraph. Because the indentation is set for different lines, this is an example of hanging indentation.

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
