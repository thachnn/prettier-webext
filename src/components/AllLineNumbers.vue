<script setup>
import { computed } from 'vue';

const props = defineProps({
  code: { type: String, required: true }, //
});

const linesCount = computed(() => {
  let count = 1;
  for (let i = 0; (i = props.code.indexOf('\n', i)) > -1; i++) count++;
  return count;
});
</script>

<template>
  <span aria-hidden="true" class="line-numbers-row" contenteditable="false"
    ><i v-for="n in linesCount"></i
  ></span>
</template>

<style>
code.line-numbers {
  position: relative;
  padding-left: 3.5em;
  counter-reset: lineNumber;
}

.line-numbers-row {
  position: absolute;
  top: 0;
  left: 1px;
  box-sizing: border-box;
  padding: 0.545em 0;
  min-height: 100%;
  width: 3.08em;
  letter-spacing: -0.08em;
  background: var(--body-bg);
  border-right: 1px solid var(--hr-color);
  user-select: none;
}

:root {
  --line-numbers: #999;
}
@media (prefers-color-scheme: dark) {
  :root {
    --line-numbers: #999;
  }
}
.line-numbers-row > i {
  font-style: normal;
  counter-increment: lineNumber;
}
.line-numbers-row > i::before {
  content: counter(lineNumber);
  display: block;
  padding-right: 0.5em;
  color: var(--line-numbers);
  text-align: right;
}
</style>
