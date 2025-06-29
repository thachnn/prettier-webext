import { h } from 'vue';
import hljs from 'highlight.js/lib/core.js';

/** @implements {module:"highlight.js".Emitter} */
class VNodeTreeEmitter {
  /** @param {HLJSOptions} options */
  constructor(options) {
    this.root = { children: [] };
    this.stack = [this.root];

    this.classPrefix = options.classPrefix;
  }

  /** @private */
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

  /** @param {string} text */
  addText(text) {
    text && this._add(text);
  }

  /** @param {string} scope */
  startScope(scope) {
    this.openNode(scope);
  }

  endScope() {
    this.closeNode();
  }

  /**
   * @param {Emitter} other
   * @param {string} name
   */
  __addSublanguage(other, name) {
    const nodes = [].concat(other.toHTML());
    name
      ? this._add(h('span', { class: ['language-' + name] }, nodes)) //
      : this._add(...nodes);
  }

  /** @returns {*} */
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
      hljs.highlight(props.code, { language: props.language, ignoreIllegals: props.ignoreIllegals })
        .value;
  },
};
