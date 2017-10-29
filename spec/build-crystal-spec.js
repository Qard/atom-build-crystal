'use babel';

import temp from 'temp';
import fs from 'fs-extra';
import { vouch } from 'atom-build-spec-helpers';
import { provideBuilder } from '../lib/crystal';

describe('crystal provider', () => {
  let directory;
  let builder;
  const Builder = provideBuilder();

  beforeEach(() => {
    waitsForPromise(() => {
      return vouch(temp.mkdir, 'atom-build-spec-crystal-')
        .then((dir) => vouch(fs.realpath, dir))
        .then((dir) => directory = `${dir}/`)
        .then((dir) => builder = new Builder(dir));
    });
  });

  afterEach(() => {
    fs.removeSync(directory);
  });

  describe('when package.json exists, but no engines', () => {
    it('should be eligible', () => {
      fs.writeFileSync(`${directory}/shard.yml`, fs.readFileSync(`${__dirname}/shard.yml`));
      expect(builder.isEligible()).toBe(true);
    });

    it('should use it with crystal', () => {
      fs.writeFileSync(`${directory}/shard.yml`, fs.readFileSync(`${__dirname}/shard.yml`));
      expect(builder.isEligible()).toBe(true);
      waitsForPromise(() => {
        return Promise.resolve(builder.settings()).then(settings => {
          expect(settings.length).toBe(1);

          const defaultTarget = settings.find(s => s.name === 'crystal: deps');
          expect(defaultTarget.exec).toBe('npm');
          expect(defaultTarget.sh).toBe(false);
          expect(defaultTarget.args).toEqual([ 'deps' ]);
        });
      });
    });
  });

  describe('when no package.json exists', () => {
    it('should not be eligible', () => {
      expect(builder.isEligible()).toBe(false);
    });
  });
});
