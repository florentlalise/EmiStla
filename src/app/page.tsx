export default function Home() {
  return (
    <div>
      <div className="flex flex-col justify-center min-h-screen p-24 _halftone">
        <video
          autoPlay
          muted
          loop
          className="absolute top-0 left-0 w-full h-full object-cover -z-10 brightness-40"
        >
          <source src="/bg-video-wide.webm" type="video/webm" />
        </video>
        <div className="z-10">
          <main>
            <h1>emistla.me is under construction</h1>
          </main>

          <a
            href="https://www.youtube.com/watch?v=DFJRMGHLnZ0"
            className="text-sm absolute bottom-5 right-5 p-3 text-center text-white border border-white rounded-full bg-black/50"
          >
            Video credits
          </a>
        </div>
      </div>
    </div>
  );
}
