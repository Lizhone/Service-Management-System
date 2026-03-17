import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative h-screen overflow-hidden">

      {/* 🎥 VIDEO BACKGROUND */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-1/2 left-1/2 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover z-0"
      >
        <source src="/assets/hero-video.mp4" type="video/mp4" />
      </video>

      {/* 🌑 DARK OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-b from-grey via-black/10 z-10" />

      {/* 🔥 CONTENT */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center text-white px-4">

        {/* TITLE */}
        <h1 className="text-5xl md:text-8xl font-semibold italic tracking-wide">
          FLEE
        </h1>

        {/* TAGLINE */}
        <p className="mt-4 text-lg md:text-2xl text-gray-200 max-w-2xl">
          Smart. Stylish. Sustainable Mobility for the Future
        </p>

      </div>

    </section>
  );
}