---
title: 玩耍 Hexo 各种特性
categories:
  - virt
  - site
tags:
  - author:geezmolycos
  - tech
lang: zh-cn
date: 2023-05-02 21:39:38
updated: 2023-05-03 17:11:32
---

刚学习 Hexo，以为 EJS 是模板语言。后来发现 Markdown 和 EJS 是同级的关系，而 Nunjucks 是模板语言。

后面玩耍一下 Hexo 的各种特性，以便于实现斜体和楷体等功能。

![](example.png){width=64px height=64px}
*what*{lang=en}

<!-- more -->

## 引用测试

{% filter replace("<blockquote>", "<blockquote lang='en'>") %}
{% blockquote Seth Godin http://sethgodin.typepad.com/seths_blog/2009/07/welcome-to-island-marketing.html Welcome to Island Marketing %}
Every interaction is both precious and an opportunity to delight.
{% endblockquote %}
{% endfilter %}



## 标题测试

你好呀，这是标题测试。

### 你好吗

你吃了吗？

#### 我好吗

##### 他好吗

###### 它好吗

- Unordered List 测试
- 你好吗
  - 我好吗
    - 他好吗
      - 它好吗
        - 你吃了吗
          - 我吃了吗
            - 他吃了吗
              - 它吃了吗
  - 你吃了吗

### 你吃了吗？

两种代码块

{% codeblock Array.map lang:javascript %}
array.map(callback[, thisArg])
{% endcodeblock %}

```javascript Array.map
array.map(callback[, thisArg])
```
超长代码块
```javascript Array.map
array.map.map.map.map.map.map.map.map.map.map.map.map.map.map.map.map.map.map.map.map.map.map.map.map.map.map.map.map.map.map.map.map.map.map.map.map.map.map.map.map.map.map.map.map.map.map.map.map.map.map.map.map.map.map.map.map(callback[, thisArg])
array.map(callback[, thisArg])
```

{% pullquote what %}
content
{% endpullquote %}

{% post_link 2023/05/hexo-first %}

*[HTML]: Hyper Text Markup Language
*[W3C]:  World Wide Web Consortium
The HTML specification
is maintained by the W3C.

我哭，[喵喵喵]{lang=zh}

::: warning
*here be dragons*
local
:::

{% note info %}
**Welcome** to [Hexo!](https://hexo.io)
{% endnote %}

::: spoiler Are you OK?
Hello, thank you. Thank you very much.
:::

:)
:no_mouth: :frog:

|   Markdown   | Rendered HTML |
|--------------|---------------|
|    *Italic*  | *Italic*      | \
|              |               |
|    - Item 1  | - Item 1      | \
|    - Item 2  | - Item 2      |
|    ```python | ```python       \
|    .1 + .2   | .1 + .2         \
|    ```       | ```           |


Stage | Direct Products | ATP Yields
----: | --------------: | ---------:
Glycolysis | 2 ATP ||
^^ | 2 NADH | 3--5 ATP |
Pyruvaye oxidation | 2 NADH | 5 ATP |
Citric acid cycle | 2 ATP ||
^^ | 6 NADH | 15 ATP |
^^ | 2 FADH2 | 3 ATP |
**30--32** ATP |||
[Net ATP yields per hexose]

|--|--|--|--|--|--|--|--|
|♜|  |♝|♛|♚|♝|♞|♜|
|  |♟|♟|♟|  |♟|♟|♟|
|♟|  |♞|  |  |  |  |  |
|  |♗|  |  |♟|  |  |  |
|  |  |  |  |♙|  |  |  |
|  |  |  |  |  |♘|  |  |
|♙|♙|♙|♙|  |♙|♙|♙|
|♖|♘|♗|♕|♔|  |  |♖|

33^22^22~11~22

$\alpha$

$$
\sum_{i=0}^{+\infty} \alpha x_i
$$

{% note info %}
**Welcome** to [Hexo!](https://hexo.io)
{% note info %}
**Welcome** to [Hexo!](https://hexo.io)
{% endnote %}
{% endnote %}

:::note warning
There are bears!
:::

:::warning
There are bears, wow!
:::

Here is a footnote reference,[^1] and another.[^longnote]

[^1]: Here is the footnote.

[^longnote]: Here's one with multiple blocks.

    Subsequent paragraphs are indented to show that they
belong to the previous footnote.

markdown-it 还有它的各种插件真是好用呀^[个人观点]，太好玩了。就是太多插件了，语法上可能有不一致的地方，但是我现在还没发现呢，用起来感觉挺不错的。


::: warning
There are *bears* {lang=en}

There are *bears* {lang=en}

There are *bears* {lang=en}

:::

There are *bears* {lang=en}

*汉语*


## Render

``` js
hexo.post.render(source, data);
```

Argument | Description
--- | ---
`source` | Full path of a file (Optional)
`data` | Data

The data must contain the `content` attribute. If not, Hexo will try to read the original file. The execution steps of this function are as follows:

- Execute `before_post_render` filters
- Render with Markdown or other renderers (depending on the extension name)
- Render with [Nunjucks]
- Execute `after_post_render` filters

[Nunjucks]: https://mozilla.github.io/nunjucks/
