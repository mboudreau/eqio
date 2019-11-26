import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import * as path from 'path';

export const config: Config = {
  namespace: 'eqio',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader'
    },
    {
      type: 'docs-readme'
    },
    {
      type: 'www',
      serviceWorker: null // disable service workers
    }
  ],
  plugins: [
    sass({
      importer: (url) => ({ file: url.charAt(0) === '~' ? path.resolve('./node_modules', url.substr(1)): url })
    })
  ]
};
