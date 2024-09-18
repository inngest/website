import { useEffect, useRef, useState } from "react";
import { Button } from "src/shared/Button";

type AutoplayVideoProps = {
  src: string;
  loop?: boolean;
};

export default function AutoplayVideo({
  src,
  loop = true,
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
      onClick={handleVideoPress}
      ref={videoRef}
      playsInline
      loop={loop}
      preload="auto"
      autoPlay
      muted
    ></video>
  );
}
