'use babel';

import fs from 'fs';
import path from 'path';
import EventEmitter from 'events';

export function provideBuilder() {
  return class CrystalBuildProvider extends EventEmitter {
    constructor(cwd) {
      super();
      this.cwd = cwd;
    }

    getNiceName() {
      return 'crystal';
    }

    isEligible() {
      return fs.existsSync(path.join(this.cwd, 'shard.yml'));
    }

    settings() {
      const name = path.basename(this.cwd);
      const actions = [
        'build',
        'deps',
        'run',
        'spec'
      ];

      const config = actions.map(action => {
        const data = {
          name: `crystal ${action}`,
          exec: 'crystal',
          args: [ action ],
          sh: false
        };

        if (action === 'run' || action === 'build') {
          data.args.push(`src/${name}.cr`);
        }

        return data;
      });

      return config;
    }
  };
}
