---
title: 玩耍 Hexo 各种特性
date: 2023-05-02 21:39:38
categories:
  - virtual
  - site
tags:
  - tech
---

刚学习 Hexo，以为 EJS 是模板语言。后来发现 Markdown 和 EJS 是同级的关系，而 Nunjucks 是模板语言。

后面玩耍一下 Hexo 的各种特性，以便于实现斜体和楷体等功能。

![](example.png)

<!-- more -->

## 引用测试

{% blockquote David Levithan, Wide Awake %}
Do not just seek happiness for yourself. Seek happiness for all. Through kindness. Through mercy.
{% endblockquote %}

{% hello foo %}


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
