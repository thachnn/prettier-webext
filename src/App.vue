<script setup>
import { ref, computed, watchEffect } from 'vue';
import { fetchManifest } from './shared/utils.js';
import { importPrettier } from './shared/prettier-loader.js';
import VersionLogo from './components/VersionLogo.vue';
import OptionsForm from './components/OptionsForm.vue';
import OutputPanel from './components/OutputPanel.vue';

const version = ref(''); // 3.5.3
let prettier;
const optionDefs = ref({});

// This effect will run immediately
watchEffect(async () => {
  const manifest = await fetchManifest('https://unpkg.com/prettier', 'node_modules/prettier');
  version.value = manifest.version;

  prettier = await importPrettier(manifest);
  // TODO optionDefs.value = await buildOptDefinitions(prettier);
});

const formattedCode = ref('');
const codeLanguage = computed(() => 'javascript'); // TODO formData.parser
</script>

<template>
  <header>
    <VersionLogo :version="version" />
  </header>

  <main>
    <OptionsForm :components="optionDefs" />
    <a href="" class="divider"></a>

    <section>
      <article id="editor">
        <textarea placeholder="Enter your source code" spellcheck="false"></textarea>
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
  box-sizing: border-box;
}
@media (min-width: 800px) {
  main section > * {
    flex-basis: 50%;
  }
}

#editor {
  padding: 0.5em 0.75em;
}
#editor textarea {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  resize: none;
}
</style>
