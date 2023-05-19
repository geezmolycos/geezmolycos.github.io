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

## Post

{% render ./fb.md %}
