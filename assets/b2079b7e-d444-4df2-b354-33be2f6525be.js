/* Tweaks app — mounts the Tweaks panel and applies choices to the page.
   The main site is vanilla; this only writes attributes / CSS vars on <html>. */
const { useEffect } = React;

const PORTFOLIO_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "burgundy",
  "hero": "right",
  "display": "cormorant"
}/*EDITMODE-END*/;

const DISPLAY_FONTS = {
  cormorant: '"Cormorant Garamond", Georgia, serif',
  newsreader: '"Newsreader", Georgia, serif'
};

function TweaksApp() {
  const [t, setTweak] = useTweaks(PORTFOLIO_TWEAK_DEFAULTS);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-accent", t.accent === "burgundy" ? "burgundy" : "balanced");
    root.setAttribute("data-hero", t.hero === "left" ? "left" : "right");
    root.style.setProperty("--serif", DISPLAY_FONTS[t.display] || DISPLAY_FONTS.cormorant);
  }, [t.accent, t.hero, t.display]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Accent" />
      <TweakRadio
        label="Lead colour"
        value={t.accent}
        options={["blue", "burgundy"]}
        onChange={(v) => setTweak("accent", v)}
      />
      <TweakSection label="Layout" />
      <TweakRadio
        label="Portrait side"
        value={t.hero}
        options={["right", "left"]}
        onChange={(v) => setTweak("hero", v)}
      />
      <TweakSection label="Typography" />
      <TweakRadio
        label="Display font"
        value={t.display}
        options={["cormorant", "newsreader"]}
        onChange={(v) => setTweak("display", v)}
      />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById("tweaks-root")).render(<TweaksApp />);
