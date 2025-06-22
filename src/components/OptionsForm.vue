<script setup>
import { watch } from 'vue';

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
  },
);

const handleChange = () => emit('change', formDefaults);

const handleReset = () => {
  formData.value = Object.assign({}, formDefaults);
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
      <button class="btn">Copy config JSON</button>
      <button type="reset" class="btn">Reset to defaults</button>
    </p>
  </form>
</template>

<style>
form label {
  font-family: var(--font-mono);
}

form select,
form input {
  float: right;
}
form input[type='checkbox'] {
  float: left;
}
form fieldset {
  clear: both;
  padding: 0.25em 0.5em;
}

form > p {
  display: flex;
  justify-content: space-between;
}
</style>
