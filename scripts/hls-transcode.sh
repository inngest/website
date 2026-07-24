#!/usr/bin/env bash
#
# Transcode a video into an adaptive-bitrate HLS ladder (1080p / 720p / 480p)
# for smooth streaming behind the CDN.
#
# Usage:
#   pnpm video:hls <input-video> [output-dir]
#
# Examples:
#   pnpm video:hls ./durable-agent-in-8-minutes.mov
#     -> writes hls/durable-agent-in-8-minutes/{master.m3u8,stream_0,stream_1,stream_2}
#   pnpm video:hls ./demo.mp4 ./dist/demo
#
# Then upload the whole output folder to the CDN and reference
# <cdn-base>/<name>/master.m3u8 as the AutoplayVideo `src`.

set -eo pipefail

INPUT="${1:-}"
if [ -z "$INPUT" ]; then
  echo "Usage: pnpm video:hls <input-video> [output-dir]" >&2
  exit 1
fi
if [ ! -f "$INPUT" ]; then
  echo "Input file not found: $INPUT" >&2
  exit 1
fi

command -v ffmpeg >/dev/null 2>&1 || {
  echo "ffmpeg not found on PATH. Install it first: brew install ffmpeg" >&2
  exit 1
}

# Resolve the input to an absolute path before we change directories.
INPUT_ABS="$(cd "$(dirname "$INPUT")" && pwd)/$(basename "$INPUT")"

NAME="$(basename "${INPUT%.*}")"
OUT_DIR="${2:-hls/$NAME}"

# ffmpeg won't create the per-rendition segment directories itself.
mkdir -p "$OUT_DIR/stream_0" "$OUT_DIR/stream_1" "$OUT_DIR/stream_2"
cd "$OUT_DIR"

# Include audio only if the source actually has an audio track, so silent
# clips still transcode cleanly.
AUDIO_MAPS=()
VAR_MAP="v:0 v:1 v:2"
if ffprobe -v error -select_streams a -show_entries stream=index \
  -of csv=p=0 "$INPUT_ABS" | grep -q .; then
  AUDIO_MAPS=(-map "0:a:0" -map "0:a:0" -map "0:a:0" -c:a aac -b:a 128k -ac 2)
  VAR_MAP="v:0,a:0 v:1,a:1 v:2,a:2"
fi

ffmpeg -y -i "$INPUT_ABS" \
  -filter_complex "[0:v]split=3[v1][v2][v3];[v1]scale=w=1920:h=-2[v1out];[v2]scale=w=1280:h=-2[v2out];[v3]scale=w=854:h=-2[v3out]" \
  -map "[v1out]" -c:v:0 libx264 -b:v:0 5000k -maxrate:v:0 5350k -bufsize:v:0 7500k \
  -map "[v2out]" -c:v:1 libx264 -b:v:1 2800k -maxrate:v:1 2996k -bufsize:v:1 4200k \
  -map "[v3out]" -c:v:2 libx264 -b:v:2 1000k -maxrate:v:2 1070k -bufsize:v:2 1500k \
  "${AUDIO_MAPS[@]}" \
  -x264-params "keyint=48:min-keyint=48:scenecut=0" -preset veryfast \
  -f hls -hls_time 4 -hls_playlist_type vod \
  -hls_segment_filename "stream_%v/seg_%03d.ts" \
  -master_pl_name master.m3u8 \
  -var_stream_map "$VAR_MAP" "stream_%v/playlist.m3u8"

echo ""
echo "✅ HLS ladder written to: $OUT_DIR"
echo "   Upload the whole folder, then set AutoplayVideo src to:"
echo "   <cdn-base>/$NAME/master.m3u8"
