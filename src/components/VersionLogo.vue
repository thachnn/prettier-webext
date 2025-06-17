<script setup>
import { computed } from 'vue';

const props = defineProps({
  version: { type: String, required: true }, //
});

const href = computed(() =>
  props.version.endsWith('.0')
    ? 'releases/tag/' + props.version
    : 'blob/main/CHANGELOG.md#' + props.version.replaceAll('.', ''),
);
</script>

<template>
  <a href="https://prettier.io/" target="_blank" class="logo">
    <img src="/icon.png" alt="P" />
    <h2>
      Prettier
      <a
        id="version"
        :href="'https://github.com/prettier/prettier/' + href"
        target="_blank"
        rel="noreferrer noopener"
        >v{{ version }}</a
      >
    </h2>
  </a>
</template>

<style>
header a:active,
header a {
  color: #fff;
}

.logo {
  display: inline-flex;
  align-items: center;
}
.logo img {
  height: 2.83em;
}
.logo h2 {
  font-weight: 400;
  font-size: 167%;
  line-height: 0.9;
  margin: 0 0 0 0.5em;
}

#version {
  font-size: 50%;
  opacity: 0.5;
}
</style>
