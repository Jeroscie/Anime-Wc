document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);
    const title = params.get('title');
    const episode = params.get('episode');

    if (title && episode) {
        fetchVideoUrl(title, episode);
    } else {
        console.error('Title or episode not provided.');
    }
});

function fetchVideoUrl(title, episode) {
    const episodeTitle = episode.replace(/-episode-/, '/');
    const apiUrl = `/api/episode/${encodeURIComponent(episodeTitle)}`.replace(/%2F/g, '/');
    console.log('Video API URL:', apiUrl);

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log('Video API Response:', data);

            const videoContainer = document.getElementById('video-container');
            videoContainer.innerHTML = '';

            const video = document.createElement('video');
            video.controls = true;

            // Check if HLS.js is supported
            if (Hls.isSupported()) {
                const hls = new Hls();
                hls.loadSource(data.results.stream.sources[0].file);
                hls.attachMedia(video);
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                // For Safari, use native HLS support
                video.src = data.results.stream.sources[0].file;
            } else {
                console.error('HLS.js is not supported, and native HLS playback is not available.');
            }

            videoContainer.appendChild(video);
        })
        .catch(error => console.error('Error fetching video:', error));
}
