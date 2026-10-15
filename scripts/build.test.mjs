import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  mkdtempSync, copyFileSync, mkdirSync, writeFileSync,
  readFileSync, readdirSync, rmSync,
} from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

function fixture(t) {
  const directory = mkdtempSync(join(tmpdir(), 'harness-github-build-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const run = (command, args, environment = {}) => {
    const env = {
      ...process.env,
      GITHUB_OUTPUT: '',
      GITHUB_STEP_SUMMARY: '',
      GITHUB_REF_TYPE: '',
      GITHUB_REF_NAME: '',
      ...environment,
    };
    delete env.NODE_TEST_CONTEXT;
    return spawnSync(command, args, { cwd: directory, encoding: 'utf8', env });
  };
  mkdirSync(join(directory, 'scripts'));
  copyFileSync(new URL('./build.sh', import.meta.url), join(directory, 'scripts/build.sh'));
  writeFileSync(join(directory, 'scripts/fixture.test.mjs'), "import { test } from 'node:test'; test('fixture', () => {});\n");
  mkdirSync(join(directory, 'github-fixture/references'), { recursive: true });
  writeFileSync(join(directory, 'github-fixture/SKILL.md'), '---\nname: github-fixture\ndescription: Test fixture\n---\n');
  writeFileSync(join(directory, 'github-fixture/references/data.md'), 'required resource\n');
  writeFileSync(join(directory, '.tracked-config'), 'required hidden file\n');
  writeFileSync(join(directory, 'VERSION'), '0.1.0\n');
  writeFileSync(join(directory, 'CHANGELOG.md'), '# Changes\n\n## 0.1.0\n\n- Initial fixture.\n');
  assert.equal(run('git', ['init', '-q']).status, 0);
  assert.equal(run('git', ['add', '.']).status, 0);
  assert.equal(run('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.invalid', '-c', 'commit.gpgsign=false', 'commit', '-qm', 'fixture']).status, 0);
  return { directory, run };
}

test('build refuses invalid versions, mismatched tag commits and dirty tracked inputs', (t) => {
  const { directory, run } = fixture(t);
  const mismatch = run('bash', ['scripts/build.sh'], { GITHUB_REF_TYPE: 'tag', GITHUB_REF_NAME: 'v9.9.9' });
  assert.notEqual(mismatch.status, 0);
  assert.match(mismatch.stderr, /Tag\/version mismatch/);
  writeFileSync(join(directory, 'VERSION'), '01.2.3\n');
  const malformed = run('bash', ['scripts/build.sh']);
  assert.notEqual(malformed.status, 0);
  assert.match(malformed.stderr, /VERSION must be/);
  writeFileSync(join(directory, 'VERSION'), '0.1.0\n');
  assert.equal(run('git', ['tag', 'v0.1.0']).status, 0);
  writeFileSync(join(directory, '.tracked-config'), 'changed\n');
  const dirty = run('bash', ['scripts/build.sh']);
  assert.notEqual(dirty.status, 0);
  assert.match(dirty.stderr, /Commit tracked changes/);
  assert.equal(run('git', ['add', '.tracked-config']).status, 0);
  assert.equal(run('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.invalid', '-c', 'commit.gpgsign=false', 'commit', '-qm', 'next revision']).status, 0);
  const wrongCommit = run('bash', ['scripts/build.sh'], { GITHUB_REF_TYPE: 'tag', GITHUB_REF_NAME: 'v0.1.0' });
  assert.notEqual(wrongCommit.status, 0);
  assert.match(wrongCommit.stderr, /Tag\/commit mismatch/);
});

test('package contains tracked hidden resources and exact provenance, excluding untracked files', (t) => {
  const { directory, run } = fixture(t);
  const tag = run('git', [
    '-c', 'user.name=Test', '-c', 'user.email=test@example.invalid',
    '-c', 'tag.gpgsign=false', 'tag', '-a', 'v0.1.0', '-m', 'fixture release',
  ]);
  assert.equal(tag.status, 0, tag.stderr);
  writeFileSync(join(directory, 'untracked-secret'), 'must not ship\n');
  const result = run('bash', ['scripts/build.sh'], {
    GITHUB_REF_TYPE: 'tag', GITHUB_REF_NAME: 'v0.1.0',
    GITHUB_RUN_ID: '123', GITHUB_RUN_ATTEMPT: '2',
  });
  assert.equal(result.status, 0, result.stdout + result.stderr);
  const archive = readdirSync(join(directory, 'dist')).find((name) => name.endsWith('.tar.gz'));
  assert.ok(archive, 'source archive was not produced');
  const path = join(directory, 'dist', archive);
  const listing = run('tar', ['-tzf', path]);
  assert.equal(listing.status, 0, listing.stderr);
  const entries = listing.stdout.split('\n').map((name) => name.replace(/^\.\//, ''));
  assert.ok(entries.includes('.tracked-config'));
  assert.ok(entries.includes('github-fixture/references/data.md'));
  assert.ok(!entries.includes('untracked-secret'));
  const info = JSON.parse(run('tar', ['-xOf', path, './build-info.json']).stdout);
  assert.equal(info.version, '0.1.0');
  assert.equal(info.sha, run('git', ['rev-parse', 'HEAD']).stdout.trim());
  assert.equal(info.runId, '123');
  assert.equal(info.runAttempt, '2');
  assert.deepEqual(info.skills, ['github-fixture']);
  const notes = run('tar', ['-xOf', path, './release-notes.md']).stdout;
  assert.match(notes, /Initial fixture/);
  const checksum = readFileSync(path.replace(/\.tar\.gz$/, '.sha256'), 'utf8').split(/\s+/)[0];
  assert.equal(createHash('sha256').update(readFileSync(path)).digest('hex'), checksum);
});

test('build refuses missing or empty notes for the current version', (t) => {
  const { directory, run } = fixture(t);
  for (const changelog of ['## 0.2.0\n\n- Future release.\n', '## 0.1.0\n\n## 0.0.1\n\n- Earlier release.\n']) {
    writeFileSync(join(directory, 'CHANGELOG.md'), changelog);
    assert.equal(run('git', ['add', 'CHANGELOG.md']).status, 0);
    const commit = run('git', [
      '-c', 'user.name=Test', '-c', 'user.email=test@example.invalid',
      '-c', 'commit.gpgsign=false', 'commit', '-qm', 'notes fixture',
    ]);
    assert.equal(commit.status, 0, commit.stderr);
    const result = run('bash', ['scripts/build.sh']);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Current version release notes are (missing|empty)/);
  }
});
