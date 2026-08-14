(() => {
  'use strict';

  const RELEASES_URL = 'https://api.github.com/repos/Lord-Funion/CEleste/releases?per_page=50';
  const fallback = 'https://github.com/Lord-Funion/CEleste/releases';

  const byId = id => document.getElementById(id);
  const gameLinks = [byId('gameDownload'), byId('gameDownloadCard')].filter(Boolean);
  const editorLinks = [byId('celeditDownload'), byId('celeditDownloadCard')].filter(Boolean);
  const status = byId('releaseStatus');

  function newestAsset(releases, filename) {
    for (const release of releases) {
      if (release?.draft) continue;
      const asset = release?.assets?.find(item => item?.name === filename);
      if (asset?.browser_download_url) return { release, asset };
    }
    return null;
  }

  function applyLinks(links, result, defaultLabel) {
    if (!result) return false;
    for (const link of links) {
      link.href = result.asset.browser_download_url;
      link.title = `${defaultLabel} — ${result.release.name || result.release.tag_name}`;
    }
    return true;
  }

  async function loadReleases() {
    try {
      const response = await fetch(RELEASES_URL, {
        headers: { Accept: 'application/vnd.github+json' }
      });
      if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
      const releases = await response.json();
      if (!Array.isArray(releases)) throw new Error('Unexpected GitHub response');

      const game = newestAsset(releases, 'CELESTE.8xp');
      const celedit = newestAsset(releases, 'CELEDIT.8xp');
      const gameReady = applyLinks(gameLinks, game, 'Download latest CEleste');
      const editorReady = applyLinks(editorLinks, celedit, 'Download latest CELEDIT');

      if (status) {
        if (gameReady && editorReady) {
          status.textContent = `Latest builds: CEleste ${game.release.tag_name} · CELEDIT ${celedit.release.tag_name}`;
        } else if (gameReady || editorReady) {
          status.textContent = 'One latest build was found. Use All calculator releases for anything missing.';
        } else {
          status.textContent = 'No calculator assets were found in recent releases. Open All calculator releases.';
        }
      }
    } catch (error) {
      for (const link of [...gameLinks, ...editorLinks]) link.href = fallback;
      if (status) status.textContent = 'Live build lookup is unavailable right now — the buttons open All calculator releases instead.';
      console.warn('Could not resolve current CEleste release assets:', error);
    }
  }

  loadReleases();
})();
