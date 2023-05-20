---
layout_asset: 'test'
---
This is a post
path is {{path}}

---

## Layout

{% layout test asset %}

{% layoutwith %}
layout_asset: 'test'
page:
  content: 'lol'
{% endlayoutwith %}

## Snippet

{% snippet ./fb.snippet.md %}

## render

{% render markdown %}
test markdown text *italics* **bold**
{% endrender %}

{% renderwith njk %}
{% raw %}
---
title: 'hello'
---
{{title}}
test nunjucks
{% endraw %}
{% endrenderwith %}
