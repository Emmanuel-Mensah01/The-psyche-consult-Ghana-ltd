export type VideoSource =
  | { kind: 'youtube'; id: string; embedUrl: string; thumbnail: string }
  | { kind: 'vimeo'; id: string; embedUrl: string; thumbnail: null }
  | { kind: 'file'; url: string; embedUrl: string; thumbnail: null };

/** Works out how a stored video link should be played (YouTube, Vimeo, or a direct uploaded file). */
export function getVideoSource(url: string): VideoSource {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/);
  if (yt) {
    return {
      kind: 'youtube',
      id: yt[1],
      embedUrl: `https://www.youtube.com/embed/${yt[1]}?autoplay=1&rel=0`,
      thumbnail: `https://img.youtube.com/vi/${yt[1]}/hqdefault.jpg`,
    };
  }
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) {
    return { kind: 'vimeo', id: vm[1], embedUrl: `https://player.vimeo.com/video/${vm[1]}?autoplay=1`, thumbnail: null };
  }
  return { kind: 'file', url, embedUrl: url, thumbnail: null };
}
