import { Plugin } from 'vite';

export interface CopyOptions {
  hook?: string;
  root?: string;
  outDir?: string;
}

export interface CopyPattern {
  from: string;
  to?: string | ((absoluteFrom: string) => string | PromiseLike<string>);
  context?: string;
  transform?: (
    content: Buffer,
    sourceFilename: string,
  ) => string | Buffer | PromiseLike<string | Buffer>;
}

export default function (patterns: CopyPattern | CopyPattern[], options?: CopyOptions): Plugin;
