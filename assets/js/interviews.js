/* ============================================================
   STATUS PROJECT VOICES — edit this block only.
   youtubePlaylistId: paste the playlist ID, the part after list=
   in https://www.youtube.com/playlist?list=PASTE_THE_ID_HERE
   A full playlist URL is also accepted. Leave "" until it exists.
   podcasts: paste full https links, or leave "" to keep that
   button hidden.
   episodes: add one object per published episode. Leave [] until
   a real episode exists. Do not add placeholder guests.
   ============================================================ */
var INTERVIEWS = {
  youtubePlaylistId: "",
  podcasts: {
    spotify: "",
    apple: "",
    youtubeMusic: ""
  },
  episodes: []
};

(function () {
  function playlistId(value) {
    var raw = String(value || "").trim();
    if (!raw) return "";
    var fromUrl = raw.match(/[?&]list=([A-Za-z0-9_-]+)/);
    if (fromUrl) return fromUrl[1];
    if (/^[A-Za-z0-9_-]{8,}$/.test(raw)) return raw;
    return "";
  }

  function httpsUrl(value) {
    try {
      var url = new URL(String(value || "").trim());
      return url.protocol === "https:" ? url.href : "";
    } catch (error) {
      return "";
    }
  }

  function addText(parent, tag, className, text) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    el.textContent = text;
    parent.appendChild(el);
    return el;
  }

  function showPlaylist(id) {
    var slot = document.getElementById("interview-player");
    if (!slot || !id) return;
    var soon = document.getElementById("interview-soon");
    if (soon) soon.hidden = true;
    var frame = document.createElement("iframe");
    frame.src = "https://www.youtube-nocookie.com/embed/videoseries?list=" + encodeURIComponent(id);
    frame.title = "Status Project Voices interviews playlist";
    frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    frame.allowFullscreen = true;
    frame.loading = "lazy";
    frame.referrerPolicy = "strict-origin-when-cross-origin";
    slot.appendChild(frame);
  }

  function showPodcasts(podcasts) {
    var row = document.getElementById("listen-row");
    if (!row || !podcasts) return;
    var shown = 0;
    row.querySelectorAll("[data-podcast]").forEach(function (link) {
      var href = httpsUrl(podcasts[link.getAttribute("data-podcast")]);
      if (!href) return;
      link.href = href;
      link.hidden = false;
      shown += 1;
    });
    if (shown) row.hidden = false;
  }

  function showEpisodes(episodes) {
    var list = document.getElementById("episode-list");
    var empty = document.getElementById("episode-empty");
    if (!list || !Array.isArray(episodes) || !episodes.length) return;
    var added = 0;
    episodes.forEach(function (episode) {
      if (!episode || !String(episode.title || "").trim()) return;
      var item = document.createElement("li");
      var card = document.createElement("article");
      card.className = "episode-card";
      addText(card, "h3", "", String(episode.title).trim());
      if (String(episode.guest || "").trim()) addText(card, "p", "episode-guest", String(episode.guest).trim());
      if (String(episode.date || "").trim()) {
        var time = addText(card, "time", "episode-date", String(episode.date).trim());
        if (/^\d{4}-\d{2}-\d{2}$/.test(String(episode.date).trim())) time.dateTime = String(episode.date).trim();
      }
      if (String(episode.summary || "").trim()) addText(card, "p", "", String(episode.summary).trim());
      item.appendChild(card);
      list.appendChild(item);
      added += 1;
    });
    if (added && empty) empty.hidden = true;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var config = window.INTERVIEWS || {};
    showPlaylist(playlistId(config.youtubePlaylistId));
    showPodcasts(config.podcasts || {});
    showEpisodes(config.episodes || []);
  });
})();
