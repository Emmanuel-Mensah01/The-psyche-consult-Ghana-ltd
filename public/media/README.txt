Drop your files here. No database needed. Restart `npm run dev` (or run `npm run media`) after adding files.

travels/        photos for "CEO Travels"           (jpg, png, webp)
updates/        flyers (images) and videos (mp4) for "Latest Updates"
                a picture with the SAME name as a video is used as its thumbnail
testimonials/   student video testimonials (mp4)   file name = student name, e.g. 01-gifty-sarpong.mp4
                same-name image = thumbnail

Order: files are sorted by name, so prefix 01-, 02-, 03- to control order.
Titles come from the file name. To set exact text, add captions.json in the folder:
  travels/updates: { "01-file.jpg": { "title": "...", "description": "..." } }
  testimonials:    { "01-gifty-sarpong.mp4": { "university": "...", "destination": "Now in USA" } }
YouTube/Vimeo links: add links.json in updates/ or testimonials/:
  [ { "title": "...", "url": "https://youtube.com/watch?v=..." } ]
Keep videos small (under ~50 MB; GitHub blocks files over 100 MB). Compress with HandBrake or use a YouTube link.
