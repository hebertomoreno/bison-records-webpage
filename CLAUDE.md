# Bison Records — Developer Notes

## Video uploads

Whenever a new video is added to `public/media/video/`, run ffmpeg to create optimized versions before using it in the site. The hero and other video components look for `.webm` first, then `-opt.mp4`, then `.mp4` as a fallback.

```bash
# Replace FILENAME with the base name (no extension)

# Optimized MP4 (H.264, web-ready)
ffmpeg -i public/media/video/FILENAME.mp4 \
  -c:v libx264 -crf 28 -preset slow -movflags +faststart -an \
  public/media/video/FILENAME-opt.mp4 -y

# WebM (VP9, smaller for modern browsers)
ffmpeg -i public/media/video/FILENAME.mp4 \
  -c:v libvpx-vp9 -crf 33 -b:v 0 -an -deadline good -cpu-used 2 \
  public/media/video/FILENAME.webm -y
```

The `-opt.mp4` is typically ~60% smaller than the raw export. The `.webm` is another option browsers prefer when available.
