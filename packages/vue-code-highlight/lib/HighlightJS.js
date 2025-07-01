import { createElementVNode as h, Fragment, Text } from 'vue';

const newNode = (klass, children = []) => h('span', { class: klass }, children);
const newText = (text) => h(Text, null, text, 0, null, 0);

/** @implements {module:"highlight.js".Emitter} */
class VNodeEmitter {
  /** @param {HLJSOptions} options */
  constructor(options) {
    this.root = { children: [] };
    this.stack = [this.root];

    this.classPrefix = options.classPrefix;
  }

  get top() {
    return this.stack[this.stack.length - 1];
  }

  /** @private */
  _add(node) {
    this.top.children.push(node);
  }

  /** @param {string} scope */
  openNode(scope) {
    const classes = scope.split('.').map(
      (pie, i) => (i > 0 ? pie + '_'.repeat(i) : this.classPrefix + pie), //
    );
    const node = newNode(classes.join(' '));
    this._add(node);
    this.stack.push(node);
  }

  closeNode() {
    this.stack.length > 1 && this.stack.pop();
  }

  /** @param {string} text */
  addText(text) {
    text && this._add(newText(text));
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
    const nodes = other.toHTML();
    name
      ? this._add(newNode('language-' + name, nodes))
      : typeof nodes == 'string'
        ? this._add(newText(nodes))
        : [].push.apply(this.top.children, nodes);
  }

  /** @returns {*} */
  toHTML() {
    return this.root.children;
  }

  finalize() {
    this.stack.length = 0;
  }
}

export default {
  props: {
    hljs: { type: Object, required: true },
    code: { type: String, default: '' },
    language: String,
    ignoreIllegals: { type: Boolean, default: true },
  },
  /** @param {import("highlight.js")} p.hljs */
  setup(p) {
    p.hljs.configure({ __emitter: VNodeEmitter });

    // Return the render function
    return () =>
      h(
        Fragment,
        null,
        p.hljs.highlight(p.code, { language: p.language, ignoreIllegals: p.ignoreIllegals }).value,
        //64, // STABLE_FRAGMENT
      );
  },
};
