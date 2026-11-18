// Keep three nginx distributions across all branches; leave other artifacts alone.
module.exports = async function pruneArchives({ github, context, core }) {
  const artifacts = await github.paginate(github.rest.actions.listArtifactsForRepo, {
    ...context.repo,
    per_page: 100,
  });
  const distributions = artifacts
    .filter(artifact => !artifact.expired && /^mu-hospital-[0-9a-f]{40}$/.test(artifact.name))
    .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at) || b.id - a.id);

  for (const artifact of distributions.slice(3)) {
    await github.rest.actions.deleteArtifact({
      ...context.repo,
      artifact_id: artifact.id,
    });
    core.info(`Deleted old distribution ${artifact.name} (${artifact.id})`);
  }
  core.info(`Retained ${Math.min(distributions.length, 3)} distributions`);
};
