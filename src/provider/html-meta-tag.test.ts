import { test, expect } from "vitest";
import * as htmlUtils from "./html-meta-tag";

function getMetaTags(name: string): HTMLMetaElement[] {
  const metasCollection = document.head.getElementsByTagName(
    "meta",
  ) as HTMLCollectionOf<HTMLMetaElement>;
  const metasArray = [...metasCollection];
  return metasArray.filter((meta) => meta.name === name);
}

test("HTML meta tags", async () => {
  expect(htmlUtils).to.be.ok;

  const META_NAME_1 = "someRandom_nonexistent-name";
  const META_CONTENT_1 = "content 1 ...";

  let count_1 = 0;
  expect(getMetaTags(META_NAME_1)).to.have.length(0);
  htmlUtils.addMetaTag(META_NAME_1, META_CONTENT_1);
  count_1 += 1;
  const meta_1 = getMetaTags(META_NAME_1);
  expect(meta_1).to.have.length(count_1);
  const meta_1_0 = meta_1[0];
  expect(htmlUtils.getMetaTag(META_NAME_1)).to.be.equal(meta_1_0);
  expect(meta_1_0.name).to.be.equal(META_NAME_1);
  expect(meta_1_0.content).to.be.equal(META_CONTENT_1);
  htmlUtils.addMetaTag(META_NAME_1, META_CONTENT_1);
  count_1 += 1;
  expect(getMetaTags(META_NAME_1)).to.have.length(count_1);
  htmlUtils.addMetaTag(META_NAME_1, META_CONTENT_1 + META_CONTENT_1);
  count_1 += 1;
  expect(getMetaTags(META_NAME_1)).to.have.length(count_1);
  htmlUtils.ensureMetaTagExistence(META_NAME_1, META_CONTENT_1);
  expect(getMetaTags(META_NAME_1)).to.have.length(count_1);

  const META_NAME_2 = "another_nonexistent-name";
  const META_CONTENT_2 = "This-is content 2! (Funny thing: 2! = 2)";

  let count_2 = 0;
  expect(getMetaTags(META_NAME_2)).to.have.length(count_2);
  htmlUtils.ensureMetaTagExistence(META_NAME_2, META_CONTENT_2);
  count_2 += 1;
  const meta_2 = getMetaTags(META_NAME_2);
  const meta_2_0 = meta_2[0];
  expect(htmlUtils.getMetaTag(META_NAME_2)).to.be.equal(meta_2_0);
  expect(meta_2_0.name).to.be.equal(META_NAME_2);
  expect(meta_2_0.content).to.be.equal(META_CONTENT_2);
  expect(getMetaTags(META_NAME_2)).to.have.length(count_2);
  htmlUtils.ensureMetaTagExistence(META_NAME_2, META_CONTENT_2);
  expect(getMetaTags(META_NAME_2)).to.have.length(count_2);
  htmlUtils.ensureMetaTagExistence(META_NAME_2, META_CONTENT_2);
  expect(getMetaTags(META_NAME_2)).to.have.length(count_2);
  htmlUtils.addMetaTag(META_NAME_2, META_CONTENT_2);
  count_2 += 1;
  expect(getMetaTags(META_NAME_2)).to.have.length(count_2);
  htmlUtils.ensureMetaTagExistence(META_NAME_2, META_CONTENT_2);
  expect(getMetaTags(META_NAME_2)).to.have.length(count_2);

  const META_NAME_3 = "just_meta_3";
  const META_CONTENT_3_0 = "just 3";
  const META_CONTENT_3_1 = "just 3 + 1";
  const META_CONTENT_3_2 = "just 3 + 2";
  const META_CONTENT_3 = [META_CONTENT_3_0, META_CONTENT_3_1, META_CONTENT_3_2];

  expect(getMetaTags(META_NAME_3)).to.have.length(0);
  for (const content_3 of META_CONTENT_3) {
    htmlUtils.ensureMetaTagContent(META_NAME_3, content_3);
    expect(getMetaTags(META_NAME_3)).to.have.length(1);
    const meta_3_0 = getMetaTags(META_NAME_3)[0];
    expect(htmlUtils.getMetaTag(META_NAME_3)).to.be.equal(meta_3_0);
    expect(meta_3_0.name).to.be.equal(META_NAME_3);
    expect(meta_3_0.content).to.be.equal(content_3);
  }
  const meta = getMetaTags(META_NAME_3)[0];
  for (const content_3 of META_CONTENT_3) {
    htmlUtils.setMetaTagContent(meta, content_3);
    expect(getMetaTags(META_NAME_3)).to.have.length(1);
    const meta_3_0 = getMetaTags(META_NAME_3)[0];
    expect(htmlUtils.getMetaTag(META_NAME_3)).to.be.equal(meta_3_0);
    expect(meta_3_0.name).to.be.equal(META_NAME_3);
    expect(meta_3_0.content).to.be.equal(content_3);
    expect(meta.name).to.be.equal(META_NAME_3);
    expect(meta.content).to.be.equal(content_3);
  }
});
