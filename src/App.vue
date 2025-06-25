<script setup>
import { ref, computed, watchEffect, useTemplateRef, nextTick } from 'vue';
import { fetchManifest } from './shared/utils.js';
import { importPrettier, buildOptionDefs, getParserLang } from './shared/prettier-helper.js';
import VersionLogo from './components/VersionLogo.vue';
import OptionsForm from './components/OptionsForm.vue';
import OutputPanel from './components/OutputPanel.vue';

const libVersion = ref('3.5.3');
let prettier;
const optionDefs = ref({});
const formData = ref({ parser: 'babel' });

// This effect will run immediately
watchEffect(async () => {
  const manifest = await fetchManifest('https://unpkg.com/prettier', 'node_modules/prettier');
  libVersion.value = manifest.version;

  prettier = await importPrettier(manifest);
  optionDefs.value = await buildOptionDefs(prettier);
});

const showSidebar = ref(typeof window != 'undefined' && window.innerWidth > window.innerHeight);
const sourceRef = useTemplateRef('inputCode');

const sourceCode = ref('');
const formattedCode = ref('');
const codeLanguage = computed(() => getParserLang(formData.value.parser));

let isBusy;
const formatSource = async () => {
  if (isBusy) return;
  if (!sourceCode.value || !sourceCode.value.trim().length) {
    formattedCode.value = '';
    return;
  }

  isBusy = true;
  try {
    formattedCode.value = await prettier.format(sourceCode.value, {
      ...formData.value,
      plugins: prettier.plugins,
    });
  } catch (err) {
    console.warn(err);
    formattedCode.value = err.message;
  } finally {
    // Release the busy state
    nextTick(() => (isBusy = false));
  }
};
</script>

<template>
  <header>
    <VersionLogo :version="libVersion" />
  </header>

  <main>
    <OptionsForm
      :visible="showSidebar"
      :components="optionDefs"
      :inputRef="sourceRef"
      v-model="formData"
      @change="formatSource"
    />
    <a href="#" id="divider" title="Hide/show options" @click.prevent="showSidebar = !showSidebar"
      >&nbsp;</a
    >

    <section>
      <article>
        <textarea
          class="editor"
          placeholder="Enter your source code"
          spellcheck="false"
          ref="inputCode"
          v-model="sourceCode"
          @input="formatSource"
        ></textarea>
      </article>

      <article>
        <OutputPanel :code="formattedCode" :language="codeLanguage" />
      </article>
    </section>
  </main>

  <!-- <footer><p>Released at 2025</p></footer> -->
</template>

<style>
:root {
  --header-bg: #1a2b34;
  --header-color: #fff;
}
@media (prefers-color-scheme: dark) {
  :root {
    --header-bg: #1a2b34;
    --header-color: #fff;
  }
}

header {
  height: 2.834em;
  padding: 0.75em 1.75em;
  background-color: var(--header-bg);
  /*color: #e0e0e0;*/
}

/*footer {
  border-top: 1px solid var(--hr-color);
  padding: 0.67em;
}
footer > * {
  margin: 0 0.8em;
}*/

main {
  flex: auto;
  display: flex;
  flex-direction: column;
}
main > form {
  min-width: 18.75em;
}
#divider {
  display: block;
  line-height: 0.75;
  /*background-image:
    radial-gradient(circle at 25% 25%, var(--hr-color) 24%, transparent 25%),
    radial-gradient(circle at 75% 75%, var(--hr-color) 24%, transparent 25%);*/
  background-image: repeating-conic-gradient(var(--hr-color) 0 25%, transparent 25% 50%);
  background-size: 0.75em 0.75em;
}
@media (min-width: 600px) {
  main {
    overflow: hidden;
    flex-direction: row;
  }
  main > form {
    width: 18.75em;
    overflow-y: auto;
  }
  #divider {
    width: 0.75em;
    min-width: 0.75em;
  }
}

main > section {
  flex: auto;
  display: flex;
  flex-flow: row wrap;
}
main section > * {
  flex: 100%;
  height: 100%;
  overflow: hidden;
}
@media (min-width: 600px) {
  main > section {
    overflow: hidden;
  }
  main section > * {
    height: 50%;
  }
}
@media (min-width: 992px) {
  main section > * {
    flex-basis: 50%;
    height: 100%;
  }
  section textarea.editor {
    border-width: 0 1px 0 0;
  }
}

.editor {
  box-sizing: border-box;
  height: 100%;
  padding: 0.545em 0.415em;
}
textarea.editor {
  width: 100%;
  border-width: 0 0 1px;
  border-color: var(--hr-color);
  font-family: var(--font-mono);
  resize: none;
  white-space: nowrap;
}
</style>
