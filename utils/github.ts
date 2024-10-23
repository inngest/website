async function getRepoStars(org) {
  const response = await fetch(`https://api.github.com/orgs/${org}/repos`);
  const data = await response.json();
  const repos = data.map((repo) => ({
    name: repo.name,
    stars: repo.stargazers_count,
  }));
  return repos;
}

export async function getTotalStars(org) {
  const repos = await getRepoStars(org);
  const totalStars = repos.reduce((acc, repo) => acc + repo.stars, 0);
  return totalStars;
}
