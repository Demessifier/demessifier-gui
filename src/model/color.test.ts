import { test, expect } from "vitest";
import { Color, ColorHSLA, ColorRGBA } from "./color";
import { getRandomInteger } from "../provider/randomness";
import { getPairs } from "../provider/combinations";
import { AnyColorType, defaultColors } from "../provider/color-palette";

test("color", async () => {
  expect(Color).to.be.ok;
  expect(ColorRGBA).to.be.ok;
  expect(ColorHSLA).to.be.ok;

  expect(() => new ColorRGBA(999, 88, 4)).to.throw(
    "Color component value 999 > 255.",
  );
  expect(() => Color.parse("#badbadbad")).to.throw(
    "Unexpected format of color: #badbadbad",
  );
  expect(() => Color.parse("#xyz")).to.throw(
    "Unexpected format of color: #xyz",
  );
  expect(() => Color.parse("rgbhsl(42,42,42)")).to.throw(
    "Unexpected format of color: rgbhsl(42,42,42)",
  );
});

test("color: RGB -> HSL -> RGB", async () => {
  for (let _ = 0; _ < 30; _++) {
    const r = getRandomInteger(255);
    const g = getRandomInteger(255);
    const b = getRandomInteger(255);
    const a = getRandomInteger(100);
    const msg = `RGBA=[${r},${g},${b},${a}]`;
    const rgba = new ColorRGBA(r, g, b, a);
    const rgb = new ColorRGBA(r, g, b);
    const rgba_rgba = rgba.rgba;
    const rgb_rgba = rgb.rgba;

    for (const pair of getPairs([rgba, rgb, rgba_rgba, rgb_rgba])) {
      expect(pair[0].red255).to.be.equal(pair[1].red255, msg);
      expect(pair[0].green255).to.be.equal(pair[1].green255, msg);
      expect(pair[0].blue255).to.be.equal(pair[1].blue255, msg);
      expect(pair[0].equals(pair[1], true)).to.be.true;
    }
    expect(rgba.alpha100).to.be.equal(rgba_rgba.alpha100, msg);
    expect(rgb.alpha100).to.be.equal(rgb_rgba.alpha100, msg);
    expect(rgba.equals(rgba_rgba)).to.be.true;
    expect(rgb.equals(rgb_rgba)).to.be.true;

    const rgba_hsla = rgba.hsla;
    const rgb_hsla = rgb.hsla;
    expect(rgba_hsla.hue360).to.be.equal(rgb_hsla.hue360, msg);
    expect(rgba_hsla.saturation100).to.be.equal(rgb_hsla.saturation100, msg);
    expect(rgba_hsla.lightness100).to.be.equal(rgb_hsla.lightness100, msg);
    expect(rgba_hsla.equals(rgb_hsla, true)).to.be.true;
    expect(rgba_hsla.alpha100).to.be.equal(rgba.alpha100, msg);
    expect(rgb_hsla.alpha100).to.be.equal(rgb.alpha100, msg);

    const rgba_hsla_rgba = rgba_hsla.rgba;
    const rgb_hsla_rgba = rgb_hsla.rgba;
    expect(rgba_hsla_rgba.red255).to.be.equal(rgb_hsla_rgba.red255, msg);
    expect(rgba_hsla_rgba.green255).to.be.equal(rgb_hsla_rgba.green255, msg);
    expect(rgba_hsla_rgba.blue255).to.be.equal(rgb_hsla_rgba.blue255, msg);
    expect(rgba_hsla_rgba.equals(rgb_hsla_rgba, true)).to.be.true;
    expect(rgba_hsla_rgba.alpha100).to.be.equal(a, msg);
    expect(rgb_hsla_rgba.alpha100).to.be.equal(100, msg);
    const DELTA = 0.001;
    expect(rgba_hsla_rgba.red255).to.be.approximately(r, DELTA, msg);
    expect(rgba_hsla_rgba.green255).to.be.approximately(g, DELTA, msg);
    expect(rgba_hsla_rgba.blue255).to.be.approximately(b, DELTA, msg);
    expect(rgba_hsla_rgba.equals(rgba, false, DELTA)).to.be.true;
    expect(rgb_hsla_rgba.red255).to.be.approximately(r, DELTA, msg);
    expect(rgb_hsla_rgba.green255).to.be.approximately(g, DELTA, msg);
    expect(rgb_hsla_rgba.blue255).to.be.approximately(b, DELTA, msg);
    expect(rgb_hsla_rgba.equals(rgb, false, DELTA)).to.be.true;
  }
});

test("color: HSL -> RGB -> HSL", async () => {
  for (let _ = 0; _ < 30; _++) {
    const h = getRandomInteger(360);
    const s = getRandomInteger(100);
    const l = getRandomInteger(100);
    const a = getRandomInteger(100);
    const msg = `HSLA=[${h},${s},${l},${a}]`;
    const hsla = new ColorHSLA(h, s, l, a);
    const hsl = new ColorHSLA(h, s, l);
    const hsla_hsla = hsla.hsla;
    const hsl_hsla = hsl.hsla;

    for (const pair of getPairs([hsla, hsl, hsla_hsla, hsl_hsla])) {
      expect(pair[0].hue360).to.be.equal(pair[1].hue360, msg);
      expect(pair[0].saturation100).to.be.equal(pair[1].saturation100, msg);
      expect(pair[0].lightness100).to.be.equal(pair[1].lightness100, msg);
      expect(pair[0].equals(pair[1], true)).to.be.true;
    }
    expect(hsla.alpha100).to.be.equal(hsla_hsla.alpha100, msg);
    expect(hsl.alpha100).to.be.equal(hsl_hsla.alpha100, msg);
    expect(hsla.equals(hsla_hsla)).to.be.true;
    expect(hsl.equals(hsl_hsla)).to.be.true;

    const hsla_rgba = hsla.rgba;
    const hsl_rgba = hsl.rgba;
    expect(hsla_rgba.red255).to.be.equal(hsl_rgba.red255, msg);
    expect(hsla_rgba.green255).to.be.equal(hsl_rgba.green255, msg);
    expect(hsla_rgba.blue255).to.be.equal(hsl_rgba.blue255, msg);
    expect(hsla_rgba.equals(hsl_rgba, true)).to.be.true;
    expect(hsla_rgba.alpha100).to.be.equal(hsla.alpha100, msg);
    expect(hsl_rgba.alpha100).to.be.equal(hsl.alpha100, msg);

    const hsla_rgba_hsla = hsla_rgba.hsla;
    const hsl_rgba_hsla = hsl_rgba.hsla;
    expect(hsla_rgba_hsla.hue360).to.be.equal(hsl_rgba_hsla.hue360, msg);
    expect(hsla_rgba_hsla.saturation100).to.be.equal(
      hsl_rgba_hsla.saturation100,
      msg,
    );
    expect(hsla_rgba_hsla.lightness100).to.be.equal(
      hsl_rgba_hsla.lightness100,
      msg,
    );
    expect(hsla_rgba_hsla.equals(hsl_rgba_hsla, true)).to.be.true;
    expect(hsla_rgba_hsla.alpha100).to.be.equal(a, msg);
    expect(hsl_rgba_hsla.alpha100).to.be.equal(100, msg);
    const DELTA = 0.001;
    expect(hsla_rgba_hsla.hue360).to.be.approximately(h, DELTA, msg);
    expect(hsla_rgba_hsla.saturation100).to.be.approximately(s, DELTA, msg);
    expect(hsla_rgba_hsla.lightness100).to.be.approximately(l, DELTA, msg);
    expect(hsla_rgba_hsla.equals(hsla, false, DELTA)).to.be.true;
    expect(hsl_rgba_hsla.hue360).to.be.approximately(h, DELTA, msg);
    expect(hsl_rgba_hsla.saturation100).to.be.approximately(s, DELTA, msg);
    expect(hsl_rgba_hsla.lightness100).to.be.approximately(l, DELTA, msg);
    expect(hsl_rgba_hsla.equals(hsl, false, DELTA)).to.be.true;
  }
});

test("contrast ratio", async () => {
  for (const [colorName, color] of Object.entries(defaultColors)) {
    const colorToComplementContrastRatio = color.value.colorsContrastRatio(
      color.complementValue,
    );
    expect(
      colorToComplementContrastRatio,
      `symmetry - ${colorName}`,
    ).to.be.equal(color.complementValue.colorsContrastRatio(color.value));
    expect(
      color.value.colorsContrastRatio(color.value),
      `same color - ${colorName}`,
    ).to.be.equal(1);
    expect(
      color.complementValue.colorsContrastRatio(color.complementValue),
      `same complement - ${colorName}`,
    ).to.be.equal(1);
    expect(
      colorToComplementContrastRatio,
      `defaults are contrasting enough - ${colorName}`,
    ).to.be.at.least(7); // technical minimum is 1, but we have contrasting colors
    expect(
      colorToComplementContrastRatio,
      `less than maximum - ${colorName}`,
    ).to.be.at.most(21);
  }
  const exampleContrastRation = Color.parse("#123").colorsContrastRatio(
    Color.parse("#987"),
  );
  expect(exampleContrastRation, "RGB ~ RRGGBB").to.be.equal(
    Color.parse("#112233").colorsContrastRatio(Color.parse("#998877")),
  );
  expect(exampleContrastRation, "RGB ~ RGBA").to.be.equal(
    Color.parse("#1234").colorsContrastRatio(Color.parse("#9876")),
  );
  expect(exampleContrastRation, "RGB ~ RRGGBBAA").to.be.equal(
    Color.parse("#11223344").colorsContrastRatio(Color.parse("#99887766")),
  );
  expect(exampleContrastRation, "RGB ~ RGB(A)").to.be.equal(
    Color.parse("#123f").colorsContrastRatio(Color.parse("#987f")),
  );
  expect(exampleContrastRation, "RGB ~ RRGGBB(AA)").to.be.equal(
    Color.parse("#112233ff").colorsContrastRatio(Color.parse("#998877ff")),
  );
  expect(exampleContrastRation, "RGB ~ [RR GG BB]").to.be.equal(
    new ColorRGBA(0x11, 0x22, 0x33).colorsContrastRatio(
      new ColorRGBA(0x99, 0x88, 0x77),
    ),
  );
  expect(
    Color.parse("#000").colorsContrastRatio(Color.parse("#fff")),
    "black and white",
  ).to.be.equal(21);
});
