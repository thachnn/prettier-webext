<script setup>
import { ref } from 'vue';
import { copyToClipboard } from '../shared/utils.js';

const props = defineProps({
  copy: { type: [String, Function], required: true },
  successTip: { type: String, default: 'Copied!' },
  tipTimeout: { type: Number, default: 2000 },
});

const tooltipText = ref(null);
let timer;

const handleClick = async () => {
  const text = typeof props.copy == 'function' ? props.copy() : props.copy;
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.warn(error);
    try {
      copyToClipboard(text);
    } catch (err) {
      console.warn(err);
      tooltipText.value = error.message;
    }
  }

  tooltipText.value || (tooltipText.value = props.successTip);
  // Auto-hide tooltip
  timer && clearTimeout(timer);
  timer = setTimeout(() => (tooltipText.value = timer = null), props.tipTimeout);
};
</script>

<template>
  <button class="relative" @click.prevent="handleClick">
    <span v-if="tooltipText" class="tooltip tooltip-top">{{ tooltipText }}</span>
    <slot></slot>
  </button>
</template>

<style>
:root {
  --tooltip-color: #fff;
  --tooltip-bg: #000;
}
@media (prefers-color-scheme: dark) {
  :root {
    --tooltip-color: #fff;
    --tooltip-bg: #000;
  }
}

.tooltip {
  position: absolute;
  background-color: var(--tooltip-bg);
  color: var(--tooltip-color);
  padding: 0.2em 0.8em;
  border-radius: 0.4em;
  z-index: 1;
  pointer-events: none;
}
.tooltip::before {
  content: '';
  position: absolute;
}

.tooltip-top {
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 0.35em;
}
.tooltip-top::before {
  top: 100%;
  left: 50%;
  margin-left: -0.45em;
  border: 0.45em solid transparent;
  border-bottom: 0;
  border-top-color: var(--tooltip-bg);
}

.relative {
  position: relative;
}
</style>
