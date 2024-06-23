import { test, expect } from "vitest";
import { Color, ColorHSLA, ColorRGBA } from "./color";
import { getPseudoRandomIntegers } from "../provider/randomness";
import { getPairs } from "../provider/combinations";
import { defaultColors } from "../provider/color-palette";

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
  expect(() => new ColorRGBA(-42, 42, 42)).to.throw(
    "Color component value -42 < 0.",
  );
  const sevens = Color.parse("#777");
  const moreSevens = Color.parse("#7777");
  expect(sevens.equals(moreSevens, true)).to.be.true;
  expect(sevens.equals(moreSevens, false)).to.be.false;
  expect(
    Color.parse("rgba(20%, 40%,    60%,80%)").equals(Color.parse("#336699CC")),
  ).to.be.true; // spaces, percentages
  expect(
    Color.parse("hsl(-60, 42, 66.6%)").equals(
      Color.parse("hsla(300,42,66.6,100)"),
    ),
  ).to.be.true; // spaces, negative hue, percentage, decimal
});

test("color rgbHexString", async () => {
  for (const invalidColor of [
    "#",
    "#0",
    "#00",
    "#00000",
    "#XXYYZZ",
    "#xxyyzz",
    "#0000000",
    "#000000000",
  ]) {
    expect(() => Color.parse(invalidColor)).to.throw(
      `Unexpected format of color: ${invalidColor.toLowerCase()}`,
    );
  }
  expect(Color.parse("#000000").rgbString).to.be.equal("rgb(0, 0, 0)");
  expect(Color.parse("#FFFFFF").rgbString).to.be.equal("rgb(255, 255, 255)");
  expect(Color.parse("#DEADFF").rgbString).to.be.equal("rgb(222, 173, 255)");
  expect(Color.parse("#00BEEF").rgbString).to.be.equal("rgb(0, 190, 239)");
});

test("color: RGB -> HSL -> RGB", async () => {
  const DELTA = 0.001;
  for (let _ = 0; _ < 30; _++) {
    const [r, g, b, a] = getPseudoRandomIntegers([255, 255, 255, 100]);
    const msg = `RGBA=[${r},${g},${b},${a}]`;
    const rgba = new ColorRGBA(r, g, b, a);
    const rgb = new ColorRGBA(r, g, b);
    const rgba_rgba = rgba.rgba;
    const rgb_rgba = rgb.rgba;

    expect(`${rgba}`).to.be.equal(rgba.hexStringWithAlpha);
    expect(rgba.hexStringWithAlpha).to.match(/^#[0-9abcdef]{8}$/);
    expect(rgb.hexStringWithAlpha).to.match(/^#[0-9abcdef]{6}ff$/);
    expect(rgba.hexStringNoAlpha).to.match(/^#[0-9abcdef]{6}$/);
    expect(rgb.hexStringNoAlpha).to.match(/^#[0-9abcdef]{6}$/);
    expect(rgba.hexStringNoAlpha).to.be.equal(rgb.hexStringNoAlpha);
    expect(rgba.hexStringNoAlpha).to.be.equal(
      rgba.hexStringWithAlpha.substring(0, 7),
    );
    expect(rgba.hexStringNoAlpha).to.be.equal(
      rgb.hexStringWithAlpha.substring(0, 7),
    );
    expect(Color.parse(`rgba(${r},${g},${b},${a})`).equals(rgba)).to.be.true;
    expect(Color.parse(`rgb(${r},${g},${b})`).equals(rgb)).to.be.true;

    for (const pair of getPairs([rgba, rgb, rgba_rgba, rgb_rgba])) {
      expect(pair[0].red255).to.be.equal(pair[1].red255, msg);
      expect(pair[0].green255).to.be.equal(pair[1].green255, msg);
      expect(pair[0].blue255).to.be.equal(pair[1].blue255, msg);
      expect(pair[0].equals(pair[1], true)).to.be.true;
    }
    expect(rgba.alpha100).to.be.equal(rgba_rgba.alpha100, msg);
    expect(rgba.alpha1).to.be.equal(rgba_rgba.alpha1, msg);
    expect(rgba.alpha1 * 100).to.be.approximately(rgba.alpha100, DELTA, msg);
    expect(rgba.alpha1 * 255).to.be.approximately(rgba.alpha255, DELTA, msg);
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
    expect(rgba_hsla_rgba.red255).to.be.approximately(r, DELTA, msg);
    expect(rgba_hsla_rgba.green255).to.be.approximately(g, DELTA, msg);
    expect(rgba_hsla_rgba.blue255).to.be.approximately(b, DELTA, msg);
    expect(rgba_hsla_rgba.equals(rgba, false, DELTA)).to.be.true;
    expect(rgb_hsla_rgba.red255).to.be.approximately(r, DELTA, msg);
    expect(rgb_hsla_rgba.green255).to.be.approximately(g, DELTA, msg);
    expect(rgb_hsla_rgba.blue255).to.be.approximately(b, DELTA, msg);
    expect(rgb_hsla_rgba.equals(rgb, false, DELTA)).to.be.true;
  }
  {
    // black
    const [r, g, b] = [0, 0, 0];
    const col1 = new ColorRGBA(r, g, b);
    const col2 = col1.hsla.rgba;
    expect(col2.equals(col1)).to.be.true;
    expect(col1.hexStringWithAlpha).to.be.equal("#000000ff");
    expect(col1.hexStringNoAlpha).to.be.equal("#000000");
  }
  {
    // gray
    const [r, g, b] = [0x42, 66, 0x42];
    const col1 = new ColorRGBA(r, g, b);
    const col2 = col1.hsla.rgba;
    expect(col2.equals(col1, false, DELTA)).to.be.true;
    expect(col1.hexStringWithAlpha).to.be.equal("#424242ff");
    expect(col1.hexStringNoAlpha).to.be.equal("#424242");
  }
  {
    // white
    const [r, g, b] = [255, 255, 255];
    const col1 = new ColorRGBA(r, g, b);
    const col2 = col1.hsla.rgba;
    expect(col2.equals(col1)).to.be.true;
    expect(col1.hexStringWithAlpha).to.be.equal("#ffffffff");
    expect(col1.hexStringNoAlpha).to.be.equal("#ffffff");
  }
});

test("color: HSL -> RGB -> HSL", async () => {
  for (let _ = 0; _ < 30; _++) {
    const [h, s, l, a] = getPseudoRandomIntegers([360, 100, 100, 100]);
    const msg = `HSLA=[${h},${s},${l},${a}]`;
    const hsla = new ColorHSLA(h, s, l, a);
    const hsl = new ColorHSLA(h, s, l);
    const hsla_hsla = hsla.hsla;
    const hsl_hsla = hsl.hsla;

    expect(`${hsla}`).to.be.equal(hsla.hexStringWithAlpha);
    expect(hsla.hexStringWithAlpha).to.match(/^#[0-9abcdef]{8}$/);
    expect(hsl.hexStringWithAlpha).to.match(/^#[0-9abcdef]{6}ff$/);
    expect(Color.parse(`hsla(${h},${s},${l},${a})`).equals(hsla)).to.be.true;
    expect(Color.parse(`hsl(${h},${s},${l})`).equals(hsl)).to.be.true;

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
    if (s !== 0 && l !== 0 && l !== 100)
      expect(hsla_rgba_hsla.hue360).to.be.approximately(h, DELTA, msg);
    if (l !== 0 && l !== 100)
      expect(hsla_rgba_hsla.saturation100).to.be.approximately(s, DELTA, msg);
    expect(hsla_rgba_hsla.lightness100).to.be.approximately(l, DELTA, msg);
    expect(hsla_rgba_hsla.equals(hsla, false, DELTA)).to.be.true;
    if (s !== 0 && l !== 0 && l !== 100)
      expect(hsl_rgba_hsla.hue360).to.be.approximately(h, DELTA, msg);
    if (l !== 0 && l !== 100)
      expect(hsl_rgba_hsla.saturation100).to.be.approximately(s, DELTA, msg);
    expect(hsl_rgba_hsla.lightness100).to.be.approximately(l, DELTA, msg);
    expect(hsl_rgba_hsla.equals(hsl, false, DELTA)).to.be.true;
  }
  {
    // black
    const [h, s, l] = [222, 42, 0];
    const col1 = new ColorHSLA(h, s, l);
    const col2 = col1.rgba.hsla;
    expect(col2.equals(col1)).to.be.true;
    expect(col1.hexStringWithAlpha).to.be.equal("#000000ff");
    expect(col1.hexStringNoAlpha).to.be.equal("#000000");
  }
  {
    // gray
    const [h, s, l] = [222, 0, 42];
    const col1 = new ColorHSLA(h, s, l);
    const col2 = col1.rgba.hsla;
    expect(col2.equals(col1)).to.be.true;
    expect(col1.hexStringWithAlpha).to.be.equal("#6b6b6bff");
    expect(col1.hexStringNoAlpha).to.be.equal("#6b6b6b");
  }
  {
    // white
    const [h, s, l] = [222, 42, 100];
    const col1 = new ColorHSLA(h, s, l);
    const col2 = col1.rgba.hsla;
    expect(col2.equals(col1)).to.be.true;
    expect(col1.hexStringWithAlpha).to.be.equal("#ffffffff");
    expect(col1.hexStringNoAlpha).to.be.equal("#ffffff");
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
