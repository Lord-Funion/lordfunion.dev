(() => {
  'use strict';

  const releasesUrl = 'https://api.github.com/repos/Lord-Funion/CEleste/releases?per_page=50';
  const status = document.querySelector('[data-release-status]');

  function prettyTag(tag) {
    return String(tag || '').replace('auto-build-', 'Game build #').replace('celedit-build-', 'CELEDIT build #');
  }

  fetch(releasesUrl, {headers: {Accept: 'application/vnd.github+json'}})
    .then(response => {
      if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
      return response.json();
    })
    .then(releases => {
      const found = new Map();
      for (const release of releases) {
        for (const asset of release.assets || []) {
          if (!found.has(asset.name)) found.set(asset.name, {asset, release});
        }
      }

      for (const [name, info] of found) {
        document.querySelectorAll(`[data-release-asset="${name}"]`).forEach(link => {
          link.href = info.asset.browser_download_url;
        });
        document.querySelectorAll(`[data-release-label="${name}"]`).forEach(label => {
          label.textContent = `${prettyTag(info.release.tag_name)} · ${(info.asset.size / 1024).toFixed(0)} KB`;
        });
      }

      const count = ['CELESTE.8xp', 'CELEDIT.8xp'].filter(name => found.has(name)).length;
      if (status) status.textContent = count === 2 ? 'Newest game and editor builds found.' : 'Game links are ready. Open all releases if an automatic build is missing.';
    })
    .catch(() => {
      if (status) status.textContent = 'Release links are ready. Use “All releases” for the full build history.';
    });
})();
