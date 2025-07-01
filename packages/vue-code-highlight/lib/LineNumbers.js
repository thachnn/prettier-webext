import { computed, openBlock, createElementBlock, Fragment } from 'vue';

export default {
  props: {
    code: { type: String, default: '' }, //
  },
  setup(props) {
    const linesCount = computed(() => {
      let count = 1;
      for (let i = 0; (i = props.code.indexOf('\n', i)) > -1; i++) count++;
      return count;
    });

    // Return the render function
    return () => (
      openBlock(),
      createElementBlock(
        'span',
        { 'aria-hidden': 'true', class: 'line-numbers-row', contenteditable: 'false' },
        [
          (openBlock(true),
          createElementBlock(
            Fragment,
            null,
            Array.from(
              { length: linesCount.value },
              (_, n) => (openBlock(), createElementBlock('i', { key: n + 1 })),
            ),
            128, // KEYED_FRAGMENT
          )),
        ],
      )
    );
  },
};
