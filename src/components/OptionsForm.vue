<script setup>
import { watch } from 'vue';
import ClipboardButton from './ClipboardButton.vue';

const props = defineProps({
  visible: { type: Boolean, default: true },
  components: { type: Object, required: true },
});
const formData = defineModel({ type: Object, required: true });

const emit = defineEmits(['change']);
const formDefaults = {};

watch(
  () => props.components,
  (definitions) => {
    for (const descriptors of Object.values(definitions))
      for (const option of descriptors)
        if (option.default != null) formData.value[option.name] = option.default;

    Object.assign(formDefaults, formData.value);
    // DEBUG
    console.log('Default options:', formDefaults);
  },
);

const handleChange = () => emit('change', formDefaults);

const handleReset = () => {
  formData.value = Object.assign({}, formDefaults);
};

const buildConfigJSON = () => {
  const opts = Object.fromEntries(
    Object.entries(formData.value).filter(([k, v]) => k !== 'parser' && v !== formDefaults[k]),
  );
  return JSON.stringify(opts, null, 2);
};
</script>

<template>
  <form
    action="#"
    autocomplete="off"
    :hidden="!visible"
    @submit.prevent
    @reset.prevent="handleReset"
  >
    <details v-for="(fields, catName) in components" :key="catName" open>
      <summary>{{ catName }}</summary>

      <fieldset
        v-for="field in fields"
        :key="field.name"
        :title="field.oppositeDescription || field.description"
        :disabled="!!field.parsers && !field.parsers[formData.parser]"
      >
        <select
          v-if="field.type === 'choice'"
          :name="field.name"
          :id="field.name"
          v-model="formData[field.name]"
          @change="handleChange"
        >
          <option v-for="item in field.choices" :key="item.value" :value="item.value">
            {{ item.value }}
          </option>
        </select>
        <input
          v-else-if="field.type === 'int'"
          type="number"
          :name="field.name"
          :id="field.name"
          :min="field.range && field.range.start"
          :max="field.range && isFinite(field.range.end) && field.range.end"
          :step="field.range && field.range.step"
          v-model.number="formData[field.name]"
          @input="handleChange"
        />
        <input
          v-else-if="field.type === 'boolean'"
          type="checkbox"
          :name="field.name"
          :id="field.name"
          v-model="formData[field.name]"
          :true-value="!field.oppositeDescription"
          :false-value="!!field.oppositeDescription"
          @change="handleChange"
        />
        <input
          v-else
          type="text"
          :name="field.name"
          :id="field.name"
          v-model="formData[field.name]"
          @input="handleChange"
        />

        <label :for="field.name">{{ field.cliName }}</label>
      </fieldset>
    </details>

    <p>
      <!-- TODO <button class="btn">Set selected text as range</button> -->
      <ClipboardButton class="btn" :copy="buildConfigJSON">Copy conf. JSON</ClipboardButton>
      <button type="reset" class="btn">Reset to defaults</button>
    </p>
  </form>
</template>

<style>
form > * {
  margin: 1.25em 0;
}
form details > *,
form > p {
  padding-left: 0.67em;
  padding-right: 0.5em;
}

form > details {
  padding-bottom: 0.75em;
  border-bottom: 1px solid var(--hr-color);
}
form summary {
  font-size: 117%;
  font-weight: 700;
  padding-bottom: 0.35em;
}

form label {
  font-family: var(--font-mono);
}
form input[type='number'] {
  width: 3.5em;
}

form select,
form input {
  float: right;
  margin-left: 0.35em;
}
form input[type='checkbox'] {
  float: left;
  margin: 0.125em 0.415em 0 0;
}
form fieldset {
  clear: both;
  margin: 0.75em 0;
}

form > p {
  display: flex;
  justify-content: space-between;
}
</style>
