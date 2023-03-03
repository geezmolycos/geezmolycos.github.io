---
layout: base
title: QQ空间归档
permalink: /qq-zone/
---

<style>

  .avatar-image {
    width: 50px;
    height: 50px;
    border-radius: 3px;
  }

  .avatar {
    float: left;
    width: 70px;
  }

  .shuoshuo-body {
    overflow: hidden;
    vertical-align: top;
    border: 1px solid gray;
    border-radius: 5px;
    padding: 8px 12px;
  }
</style>

<div class="home">
  {%- if page.title -%}
    <h1 class="page-heading">{{ page.title }}</h1>
  {%- endif -%}

  <div markdown='1'>
  该页收集了金毛在2023年之前在国内社交平台「[*QQ空间*](https://i.qq.com/)」上发送的「*说说*」及「*相册*」中发送的图片和文字。及对应的点赞和评论情况。
  
  这些信息在2023年後发生变动的可能性较小；考虑到商业运营社交平台的不稳定性，我将其中信息转移到该处，并给大众观看，无需注册*QQ号*即可自由观看。回复者的名字收集于2023年02月14日。

  「[*QQ空间*](https://i.qq.com/)」是中国大陆的一个社交平台，附属于[*QQ*](https://im.qq.com/index/)聊天工具，是[*腾讯公司*](https://www.tencent.com/)的免费商业软件。该软件兴起于[公元](https://en.wikipedia.org/wiki/Common_Era)[21世纪00年代](https://en.wikipedia.org/wiki/2000s)。*QQ空间*是*QQ好友*间互相分享图片（相册）和文字（说说）的平台，用户发送说说时可以设置哪些人可见，也可以设置超过多长时间自动隐藏。

  以下是内容，按时间倒序排序，点击名字和时间并复制网址可以获取跳转到该条说说的链接。
  </div>

  {% assign posts = site.qq-zone | reverse %}

  {%- if posts.size > 0 -%}
  <ul class="post-list">
    {%- assign date_format = site.minima.date_format | default: "%b %-d, %Y" -%}
    {%- for post in posts -%}
    <li class="shuoshuo" id="{{ post.date | date: '%Y-%m-%d' }}-{{ post.title | escape }}">
      <div class="avatar"><img src="/assets/images/qq-zone/avatars/{{ post.author | escape}}.png" alt="{{ post.author | escape }}" class="avatar-image"></div>
      <div class="shuoshuo-body"><p><a href="#{{ post.date | date: '%Y-%m-%d' }}-{{ post.title | escape }}"><b>{{ post.author }}</b> {{ post.date | date: date_format }}</a></p>
      {{ post.content }}
      </div>
    </li>
    {%- endfor -%}
  </ul>
  {%- endif -%}
</div>
