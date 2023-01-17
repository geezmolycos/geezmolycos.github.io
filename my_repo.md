---
layout: page
title: My github repos
---

{%- assign date_format = site.minima.date_format | default: "%b %-d, %Y" -%}

{% for repo in site.github.public_repositories %}

{% if repo.fork == false %}

## [{{ repo.name }}]({{ repo.html_url }})

{{ repo.description }}

{% if repo.stargazers_count == 0 %}
No
{% else %}
{{ repo.stargazers_count }}
{% endif %} stargazer(s). Last updated: {{ repo.updated_at | date: date_format }}

{% endif %}

{% endfor %}
