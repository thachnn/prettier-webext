<script setup>
import { ref, computed, watchEffect, nextTick } from 'vue';
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

const showSidebar = ref(window.innerWidth > window.innerHeight);
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
    console[console.warn ? 'warn' : 'log'](err);
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
      v-model="formData"
      @change="formatSource"
    />
    <a
      href="#"
      id="divider"
      title="Hide/show options"
      @click.prevent="showSidebar = !showSidebar"
    ></a>

    <section>
      <article>
        <textarea
          class="editor"
          placeholder="Enter your source code"
          spellcheck="false"
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
header {
  height: 2.834em;
  padding: 0.75em 1.75em;
  background-color: #1a2b34;
  color: #e0e0e0;
}

/*footer {
  border-top: 1px solid #ddd;
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
  min-height: 0.75em;
  background-image:
    radial-gradient(circle at 25% 25%, #ddd 24%, transparent 25%),
    radial-gradient(circle at 75% 75%, #ccc 24%, transparent 25%);
  background-image: repeating-conic-gradient(#ddd 0 25%, transparent 0 50%);
  /*background-position: 0 0, 50% 50%;*/
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
  border-color: #ddd;
  font-family: var(--font-mono);
  resize: none;
  white-space: nowrap;
}
</style>
