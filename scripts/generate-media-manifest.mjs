// Scans public/media/* and writes src/data/mediaManifest.json.
// Runs automatically before `npm run dev` and `npm run build`.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mediaDir = path.join(root, 'public', 'media');
const outFile = path.join(root, 'src', 'data', 'mediaManifest.json');

const IMG = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);
const VID = new Set(['.mp4', '.webm', '.mov', '.m4v', '.ogg']);

const list = (folder) => {
  const dir = path.join(mediaDir, folder);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => !f.startsWith('.')).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
};
const readJson = (folder, name) => {
  try { return JSON.parse(fs.readFileSync(path.join(mediaDir, folder, name), 'utf8')); } catch { return null; }
};
const ext = (f) => path.extname(f).toLowerCase();
const base = (f) => path.basename(f, path.extname(f));
const url = (folder, f) => `/media/${folder}/${encodeURIComponent(f)}`;
const pretty = (f) => {
  const t = base(f).replace(/^\d+[\s._-]*/, '').replace(/[-_]+/g, ' ').replace(/\s+,/g, ',').replace(/\s{2,}/g, ' ').trim();
  // keep the wording as written if it already has capitals; only tidy all-lowercase names
  return /[A-Z]/.test(t) ? t : t.replace(/\b\w/g, (c) => c.toUpperCase());
};

// ---- travels: every image is a photo ----
const travels = list('travels').filter((f) => IMG.has(ext(f))).map((f, i) => {
  const c = (readJson('travels', 'captions.json') || {})[f] || {};
  return { id: `travel-${i}`, title: c.title || pretty(f), description: c.description || null, image_url: url('travels', f) };
});

// ---- updates: videos play in a modal, images show as flyers; a same-name image next to a video is its poster ----
const uFiles = list('updates');
const uCaps = readJson('updates', 'captions.json') || {};
const uVideoBases = new Set(uFiles.filter((f) => VID.has(ext(f))).map(base));
const updates = [];
uFiles.forEach((f) => {
  const c = uCaps[f] || {};
  if (VID.has(ext(f))) {
    const poster = uFiles.find((p) => IMG.has(ext(p)) && base(p) === base(f));
    updates.push({ id: `update-${updates.length}`, title: c.title || pretty(f), description: c.description || null, content_type: 'video', image_url: poster ? url('updates', poster) : null, link_url: url('updates', f), display_order: updates.length, expires_at: null });
  } else if (IMG.has(ext(f)) && !uVideoBases.has(base(f))) {
    updates.push({ id: `update-${updates.length}`, title: c.title || pretty(f), description: c.description || null, content_type: c.type || 'flyer', image_url: url('updates', f), link_url: c.link || null, display_order: updates.length, expires_at: null });
  }
});
// YouTube / Vimeo links: updates/links.json -> [{ "title": "...", "description": "...", "url": "https://youtube.com/watch?v=..." }]
(readJson('updates', 'links.json') || []).forEach((l) =>
  updates.push({ id: `update-${updates.length}`, title: l.title, description: l.description || null, content_type: 'video', image_url: l.thumbnail || null, link_url: l.url, display_order: updates.length, expires_at: null })
);

// ---- testimonials (video): file name -> student; captions.json adds university / destination ----
const tFiles = list('testimonials');
const tCaps = readJson('testimonials', 'captions.json') || {};
const testimonials = [];
tFiles.filter((f) => VID.has(ext(f))).forEach((f) => {
  const c = tCaps[f] || {};
  const poster = tFiles.find((p) => IMG.has(ext(p)) && base(p) === base(f));
  testimonials.push({ id: `testimonial-${testimonials.length}`, student_name: c.student_name || pretty(f), university: c.university || '', destination: c.destination || '', video_url: url('testimonials', f), thumbnail_url: poster ? url('testimonials', poster) : null, quote: null, display_order: testimonials.length });
});
(readJson('testimonials', 'links.json') || []).forEach((l) =>
  testimonials.push({ id: `testimonial-${testimonials.length}`, student_name: l.student_name, university: l.university || '', destination: l.destination || '', video_url: l.url, thumbnail_url: l.thumbnail || null, quote: null, display_order: testimonials.length })
);

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify({ travels, updates, testimonials }, null, 2));
console.log(`[media] travels: ${travels.length}, updates: ${updates.length}, video testimonials: ${testimonials.length}`);
