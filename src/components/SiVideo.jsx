// Structural Integration explainer (1 min 14 s), in two cuts:
//   · vertical (1080×1920) for phones held upright
//   · wide (1920×1080) for everything else
// CSS shows exactly one of them. Both are click-to-play with preload="none", so no video
// data is downloaded until a visitor presses play, and the hidden cut is never fetched.
const frame = {
  display: 'block', width: '100%', height: 'auto',
  borderRadius: 20, border: '1px solid rgba(237, 230, 218, 0.12)', background: '#0b0f1a',
};

const css = `
.si-video-tall{display:none}
@media (max-width:767px) and (orientation:portrait){
  .si-video-wide{display:none}
  .si-video-tall{display:block;max-width:420px;margin-inline:auto}
}`;

export default function SiVideo({ style }) {
  const label = 'Video: what Structural Integration is, in 74 seconds';
  return (
    <figure style={{ margin: 0, ...style }}>
      <style>{css}</style>
      <div className="si-video-wide">
        <video controls playsInline preload="none" width={1920} height={1080} aria-label={label}
          poster="/video/structural-integration-poster.jpg" style={{ ...frame, aspectRatio: '16 / 9' }}>
          <source src="/video/structural-integration.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="si-video-tall">
        <video controls playsInline preload="none" width={1080} height={1920} aria-label={label}
          poster="/video/structural-integration-vertical-poster.jpg" style={{ ...frame, aspectRatio: '9 / 16' }}>
          <source src="/video/structural-integration-vertical.mp4" type="video/mp4" />
        </video>
      </div>
      <figcaption style={{ marginTop: 12, fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.55 }}>
        Watch · What Structural Integration is · 1 min 14 s
      </figcaption>
    </figure>
  );
}
