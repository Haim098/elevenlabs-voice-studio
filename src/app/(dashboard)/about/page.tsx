export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:px-6">
      <div className="rounded-xl border border-white/10 bg-black/30 p-6 md:p-8">
        <h1 className="text-3xl font-bold text-foreground">About AI Voice Studio</h1>

        <p className="mt-6 text-sm leading-7 text-muted-foreground md:text-base">
          AI Voice Studio is an early-stage startup building accessible AI-powered
          voice generation tools for developers, content creators, and businesses.
          Our platform enables natural-sounding text-to-speech, voice cloning, and
          custom voice design - all through a simple, intuitive interface.
        </p>

        <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">
          We are a self-funded startup founded in 2025, currently in the pre-seed
          stage.
        </p>

        <div className="mt-8 border-t border-white/10 pt-4">
          <p className="text-sm text-muted-foreground">
            Contact us: hello@aivoicestudio.cloud
          </p>
        </div>
      </div>
    </div>
  );
}
