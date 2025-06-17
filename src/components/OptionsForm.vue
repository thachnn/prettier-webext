<script setup>
defineProps({
  components: { type: Object, required: true }, //
});
</script>

<template>
  <form action="#" autocomplete="off" @submit.prevent>
    <p>
      <button class="btn">Copy config JSON</button>
      <button type="reset" class="btn">Reset to defaults</button>
    </p>
  </form>
</template>

<style>
form > p {
  display: flex;
  justify-content: space-between;
}
</style>
