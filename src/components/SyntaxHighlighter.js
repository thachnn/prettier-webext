import { h } from 'vue';
import hljs from 'highlight.js/lib/core.js';

/** @implements {hljs.Emitter} */
class VNodeTreeEmitter {
  /** @param {hljs.HljsOptions} options */
  constructor(options) {
    this.root = { children: [] };
    this.stack = [this.root];

    this.classPrefix = options.classPrefix;
  }

  _add(...node) {
    const current = this.stack[this.stack.length - 1];
    current.children.push(...node);
  }

  /** @param {string} scope */
  openNode(scope) {
    const className = scope.split('.').map(
      (pie, i) => (i > 0 ? pie + '_'.repeat(i) : this.classPrefix + pie), //
    );
    const node = h('span', { class: className }, []);
    this._add(node);
    this.stack.push(node);
  }

  closeNode() {
    this.stack.length > 1 && this.stack.pop();
  }

  addText(text) {
    text && this._add(text);
  }

  startScope(scope) {
    this.openNode(scope);
  }

  endScope() {
    this.closeNode();
  }

  /**
   * @param {this} other
   * @param {string} name
   */
  __addSublanguage(other, name) {
    const nodes = other.root.children;
    name
      ? this._add(h('span', { class: ['language-' + name] }, nodes)) //
      : this._add(...nodes);
  }

  toHTML() {
    return this.root.children;
  }

  finalize() {
    this.stack.length = 0;
  }
}

hljs.configure({ __emitter: VNodeTreeEmitter });

export default {
  props: {
    code: { type: String, required: true },
    language: { type: String, required: true },
    ignoreIllegals: { type: Boolean, default: true },
  },
  setup(props) {
    // Return the render function
    return () =>
      hljs.highlight(props.code, {
        language: props.language,
        ignoreIllegals: props.ignoreIllegals,
      }).value;
  },
};
