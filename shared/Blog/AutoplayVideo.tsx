import { useEffect, useRef, useState } from "react";

type AutoplayVideoProps = {
  src: string;
  loop?: boolean;
  controls?: boolean;
  autoPlay?: boolean;
  poster?: string;
};

export default function AutoplayVideo({
  src,
  loop = true,
  controls = true,
  autoPlay = true,
  poster,
}: AutoplayVideoProps) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const startVideo = () => {
    videoRef.current.pause();
    setPlaying(false);
  };

  const pauseVideo = () => {
    videoRef.current.play();
    setPlaying(true);
  };

  const handleScroll = (e) => {
    if (playing) {
      pauseVideo();
    }
  };

  const handleVideoPress = () => {
    if (playing) {
      startVideo();
    } else {
      pauseVideo();
    }
  };

  return (
    <video
      src={src}
      poster={poster}
      onClick={handleVideoPress}
      ref={videoRef}
      playsInline
      loop={loop}
      controls={controls}
      preload="auto"
      autoPlay={autoPlay}
      muted
    ></video>
  );
}
