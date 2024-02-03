import { test, expect } from "vitest";
import { Color, ColorHSLA, ColorRGBA } from "./color";
import { getRandomInteger } from "../provider/randomness";
import { getPairs } from "../provider/combinations";

test("color", async () => {
  expect(Color).to.be.ok;
  expect(ColorRGBA).to.be.ok;
  expect(ColorHSLA).to.be.ok;
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
    const rgba_rgba = rgba.getRGBA();
    const rgb_rgba = rgb.getRGBA();

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

    const rgba_hsla = rgba.getHSLA();
    const rgb_hsla = rgb.getHSLA();
    expect(rgba_hsla.hue360).to.be.equal(rgb_hsla.hue360, msg);
    expect(rgba_hsla.saturation100).to.be.equal(rgb_hsla.saturation100, msg);
    expect(rgba_hsla.lightness100).to.be.equal(rgb_hsla.lightness100, msg);
    expect(rgba_hsla.equals(rgb_hsla, true)).to.be.true;
    expect(rgba_hsla.alpha100).to.be.equal(rgba.alpha100, msg);
    expect(rgb_hsla.alpha100).to.be.equal(rgb.alpha100, msg);

    const rgba_hsla_rgba = rgba_hsla.getRGBA();
    const rgb_hsla_rgba = rgb_hsla.getRGBA();
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
    const hsla_hsla = hsla.getHSLA();
    const hsl_hsla = hsl.getHSLA();

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

    const hsla_rgba = hsla.getRGBA();
    const hsl_rgba = hsl.getRGBA();
    expect(hsla_rgba.red255).to.be.equal(hsl_rgba.red255, msg);
    expect(hsla_rgba.green255).to.be.equal(hsl_rgba.green255, msg);
    expect(hsla_rgba.blue255).to.be.equal(hsl_rgba.blue255, msg);
    expect(hsla_rgba.equals(hsl_rgba, true)).to.be.true;
    expect(hsla_rgba.alpha100).to.be.equal(hsla.alpha100, msg);
    expect(hsl_rgba.alpha100).to.be.equal(hsl.alpha100, msg);

    const hsla_rgba_hsla = hsla_rgba.getHSLA();
    const hsl_rgba_hsla = hsl_rgba.getHSLA();
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
