<script>
import hljs from 'highlight.js/lib/core.js';

const modules = import.meta.glob(
  '/node_modules/highlight.js/es/languages/{xml,bash,c,cmake,cpp,csharp,css,markdown,dart,delphi,diff,ruby,go,graphql,handlebars,ini,java,javascript,json,kotlin,less,lua,makefile,perl,objectivec,php,php-template,plaintext,python,python-repl,r,rust,scala,scss,shell,sql,swift,yaml,typescript,vbnet,wasm}.js',
  { import: 'default', eager: true },
);
Object.entries(modules).forEach(([fn, mod]) =>
  hljs.registerLanguage(fn.slice(1 + fn.lastIndexOf('/'), -3), mod),
);
</script>

<script setup>
import SyntaxHighlighter from './SyntaxHighlighter.js';
// TODO SyntaxLineNumbers

defineProps({
  code: { type: String, required: true },
  language: { type: String, required: true },
});
</script>

<template>
  <pre><code
      class="editor hljs line-numbers"
      :class="['language-' + language]"
      tabindex="0"
      contenteditable="true"
      spellcheck="false"
      @beforeinput.prevent
      ><SyntaxHighlighter :code="code" :language="language" /></code
  ></pre>
</template>

<style>
section pre {
  margin: 0;
  height: 100%;
}
pre > code {
  display: block;
  overflow: auto;
}

/* GitHub theme */
:root {
  --highlight-color: #24292e;
  --highlight-bg: #fff;
  --highlight-keyword: #d73a49;
  --highlight-entity: #6f42c1;
  --highlight-const: #005cc5;
  --highlight-string: #032f62;
  --highlight-var: #e36209;
  --highlight-comment: #6a737d;
  --highlight-tag: #22863a;
  --highlight-subst: #24292e;
  --highlight-heading: #005cc5;
  --highlight-list: #735c0f;
  --highlight-italic: #24292e;
  --highlight-bold: #24292e;
  --highlight-add: #22863a;
  --highlight-add-bg: #f0fff4;
  --highlight-del: #b31d28;
  --highlight-del-bg: #ffeef0;
}
@media (prefers-color-scheme: dark) {
  :root {
    --highlight-color: #c9d1d9;
    --highlight-bg: #0d1117;
    --highlight-keyword: #ff7b72;
    --highlight-entity: #d2a8ff;
    --highlight-const: #79c0ff;
    --highlight-string: #a5d6ff;
    --highlight-var: #ffa657;
    --highlight-comment: #8b949e;
    --highlight-tag: #7ee787;
    --highlight-subst: #c9d1d9;
    --highlight-heading: #1f6feb;
    --highlight-list: #f2cc60;
    --highlight-italic: #c9d1d9;
    --highlight-bold: #c9d1d9;
    --highlight-add: #aff5b4;
    --highlight-add-bg: #033a16;
    --highlight-del: #ffdcd7;
    --highlight-del-bg: #67060c;
  }
}

.hljs {
  color: var(--highlight-color);
  background: var(--highlight-bg);
}
.hljs-doctag,
.hljs-keyword,
.hljs-meta .hljs-keyword,
.hljs-template-tag,
.hljs-template-variable,
.hljs-type,
.hljs-variable.language_ {
  color: var(--highlight-keyword);
}
.hljs-title,
.hljs-title.class_,
.hljs-title.class_.inherited__,
.hljs-title.function_ {
  color: var(--highlight-entity);
}
.hljs-attr,
.hljs-attribute,
.hljs-literal,
.hljs-meta,
.hljs-number,
.hljs-operator,
.hljs-variable,
.hljs-selector-attr,
.hljs-selector-class,
.hljs-selector-id {
  color: var(--highlight-const);
}
.hljs-regexp,
.hljs-string,
.hljs-meta .hljs-string {
  color: var(--highlight-string);
}
.hljs-built_in,
.hljs-symbol {
  color: var(--highlight-var);
}
.hljs-comment,
.hljs-code,
.hljs-formula {
  color: var(--highlight-comment);
}
.hljs-name,
.hljs-quote,
.hljs-selector-tag,
.hljs-selector-pseudo {
  color: var(--highlight-tag);
}
.hljs-subst {
  color: var(--highlight-subst);
}
.hljs-section {
  color: var(--highlight-heading);
  font-weight: bold;
}
.hljs-bullet {
  color: var(--highlight-list);
}
.hljs-emphasis {
  color: var(--highlight-italic);
  font-style: italic;
}
.hljs-strong {
  color: var(--highlight-bold);
  font-weight: bold;
}
.hljs-addition {
  color: var(--highlight-add);
  background-color: var(--highlight-add-bg);
}
.hljs-deletion {
  color: var(--highlight-del);
  background-color: var(--highlight-del-bg);
}
.hljs-char.escape_,
.hljs-link,
.hljs-params,
.hljs-property,
.hljs-punctuation,
.hljs-tag {
  /* purposely ignored */
}
</style>
