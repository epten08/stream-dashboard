import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface HLSPlayerProps {
  src: string;
  autoplay?: boolean;
  controls?: boolean;
  muted?: boolean;
  className?: string;
}

const HLSPlayer: React.FC<HLSPlayerProps> = ({ 
  src, 
  autoplay = true, 
  controls = true, 
  muted = true,
  className = "w-full h-full object-cover"
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: false,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      
      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (autoplay) {
          video.play().catch(console.error);
        }
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.log('Network error encountered, trying to recover...');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log('Media error encountered, trying to recover...');
              hls.recoverMediaError();
              break;
            default:
              console.error('Unrecoverable error encountered:', data);
              hls.destroy();
              break;
          }
        }
      });

    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      video.addEventListener('loadedmetadata', () => {
        if (autoplay) {
          video.play().catch(console.error);
        }
      });
    } else {
      console.error('HLS is not supported in this browser');
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src, autoplay]);

  return (
    <video
      ref={videoRef}
      controls={controls}
      muted={muted}
      className={className}
      playsInline
      preload="metadata"
    />
  );
};

export default HLSPlayer;