export default function AboutTab() {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">About</h3>
      <p className="text-white/60 text-sm mb-6">
        System created by{" "}
        <a
          href="https://github.com/florentlalise"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-white/80 underline transition-colors"
        >
          EmiStla
        </a>
      </p>

      <div className="mt-8">
        <h4 className="text-base font-semibold mb-3">Credits</h4>
        <div className="space-y-2">
          <div className="text-sm">
            <span className="text-white/60">Default Wallpaper: </span>
            <a
              href="https://www.artstation.com/artwork/WKqX32"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-white/80 underline transition-colors"
            >
              Camila Nogueira
            </a>
          </div>
          <div className="text-sm">
            <span className="text-white/60">Cursors: </span>
            <a
              href="https://www.deviantart.com/jepricreations"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-white/80 underline transition-colors"
            >
              jepricreations
            </a>
          </div>
          <div className="text-sm">
            <span className="text-white/60">Starting sound: </span>
            <a
              href="https://pixabay.com/users/moodmode-33139253/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-white/80 underline transition-colors"
            >
              moodmode
            </a>
          </div>
          <div className="text-sm">
            <span className="text-white/60">Button click sounds: </span>
            <a
              href="https://www.zapsplat.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-white/80 underline transition-colors"
            >
              zapsplat
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
