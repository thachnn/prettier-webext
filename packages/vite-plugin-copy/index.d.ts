import { Plugin } from 'vite';

export interface CopyOptions {
  root?: string;
  outDir?: string;
  apply?: 'build' | 'serve';
  hook?: string;
}

export interface CopyPattern {
  from: string;
  to?: string | ((sourceFilename: string) => string | PromiseLike<string>);
  context?: string;
  transform?: (
    content: Buffer,
    absoluteFrom: string,
  ) => string | Buffer | PromiseLike<string | Buffer>;
}

export default function (patterns: CopyPattern | CopyPattern[], options?: CopyOptions): Plugin;
