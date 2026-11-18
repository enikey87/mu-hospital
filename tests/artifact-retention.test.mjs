import assert from 'node:assert/strict';
import { test } from 'node:test';
import pruneArchives from '../tools/prune-archives.cjs';

const repo = { owner: 'example', repo: 'mu-hospital' };
const artifact = (id, extra = {}) => ({
  id,
  name: `mu-hospital-${String(id).padStart(40, '0')}`,
  created_at: new Date(Date.UTC(2026, 0, id)).toISOString(),
  expired: false,
  ...extra,
});

async function prune(artifacts) {
  const deleted = [];
  const listArtifactsForRepo = () => {};
  await pruneArchives({
    context: { repo },
    core: { info() {} },
    github: {
      paginate: async (endpoint, params) => {
        assert.equal(endpoint, listArtifactsForRepo);
        assert.deepEqual(params, { ...repo, per_page: 100 });
        return artifacts;
      },
      rest: { actions: {
        listArtifactsForRepo,
        deleteArtifact: async params => {
          assert.deepEqual(params, { ...repo, artifact_id: params.artifact_id });
          deleted.push(params.artifact_id);
        },
      } },
    },
  });
  return deleted;
}

test('retention keeps the newest three distributions across branches', async () => {
  assert.deepEqual(await prune([
    artifact(2), artifact(5), artifact(1), artifact(4), artifact(3),
    artifact(6, { name: 'github-pages' }),
    artifact(7, { name: 'mu-hospital-test-report' }),
    artifact(8, { expired: true }),
  ]), [2, 1]);
});

test('retention does not delete archives when three or fewer exist', async () => {
  for (const count of [0, 1, 2, 3]) {
    assert.deepEqual(await prune(Array.from({ length: count }, (_, i) => artifact(i + 1))), []);
  }
});

test('reruns with the same SHA are ordered by creation time and artifact id', async () => {
  const same = { name: `mu-hospital-${'a'.repeat(40)}`, created_at: '2026-01-01T00:00:00Z' };
  assert.deepEqual(await prune([4, 1, 3, 2].map(id => artifact(id, same))), [1]);
});
