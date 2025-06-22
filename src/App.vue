<script setup>
import { ref, computed, watchEffect } from 'vue';
import { fetchManifest } from './shared/utils.js';
import { importPrettier, buildOptionDefs, getParserLang } from './shared/prettier-helper.js';
import VersionLogo from './components/VersionLogo.vue';
import OptionsForm from './components/OptionsForm.vue';
import OutputPanel from './components/OutputPanel.vue';

const libVersion = ref(''); // 3.5.3
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

//let isBusy;
const formatSource = async () => {
  if (!sourceCode.value || !sourceCode.value.trim().length) {
    formattedCode.value = '';
    return;
  }
  try {
    formattedCode.value = await prettier.format(sourceCode.value, {
      ...formData.value,
      plugins: prettier.plugins,
    });
  } catch (err) {
    console[console.warn ? 'warn' : 'error'](err);
    formattedCode.value = err.message; // TODO
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
    <a href="#" id="divider" @click.prevent="showSidebar = !showSidebar"></a>

    <section>
      <article>
        <textarea
          id="editor"
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
}
main > form {
  width: 18.75em;
  overflow-y: auto;
}
main > a {
  display: block;
  width: 0.75em;
}

main > section {
  flex: auto;
  display: flex;
  flex-flow: row wrap;
}
main section > * {
  flex: 100%;
}
@media (min-width: 800px) {
  main section > * {
    flex-basis: 50%;
  }
}

#editor {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 0.25em 0.45em;
  resize: none;
}
</style>
