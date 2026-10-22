import test from "node:test";
import assert from "node:assert/strict";
import {
  sanitizeRichText,
  stripHtml,
  plainParagraphsFromHtml,
  toEditorHtml,
  normalizeEditorHtml,
  excerptFromDescription,
  hasHtmlTags,
} from "./src/lib/rich-text.ts";

test("saneador remove scripts e handlers perigosos", () => {
  assert.equal(sanitizeRichText("<p>oi</p><script>alert(1)</script>"), "<p>oi</p>alert(1)");
  assert.equal(sanitizeRichText('<img src=x onerror="alert(1)">'), "");
  assert.equal(sanitizeRichText('<a href="javascript:alert(1)">x</a>'), "<a>x</a>");
  assert.equal(
    sanitizeRichText('<p style="background:url(javascript:alert(1))">x</p>'),
    "<p>x</p>",
  );
});

test("saneador mantém formatação permitida", () => {
  assert.equal(
    sanitizeRichText('<a href="https://exemplo.com">x</a>'),
    '<a href="https://exemplo.com" target="_blank" rel="noopener noreferrer nofollow">x</a>',
  );
  assert.equal(
    sanitizeRichText('<span style="font-size: 1.35em">x</span>'),
    '<span style="font-size: 1.35em">x</span>',
  );
  assert.ok(sanitizeRichText("<p><strong>a</strong> <em>b</em></p><ul><li>c</li></ul>").includes("<ul>"));
  assert.ok(!sanitizeRichText('<font color="#ff0000">x</font>').includes("font"));
});

test("texto simples não vira tag", () => {
  assert.equal(hasHtmlTags("Vitamina C < 100mg"), false);
  assert.equal(hasHtmlTags("<p>a</p>"), true);
  assert.ok(toEditorHtml("a < b").includes("&lt;"));
});

test("entidades não são escapadas duas vezes", () => {
  const once = sanitizeRichText(toEditorHtml("Tom & Jerry <3"));
  const twice = sanitizeRichText(once);
  assert.equal(once, twice);
  assert.ok(once.includes("&amp;"));
  assert.equal(stripHtml(once), "Tom & Jerry <3");
});

test("parágrafos em texto simples", () => {
  assert.equal(stripHtml("<p>a</p><p>b</p>"), "a\nb");
  assert.deepEqual(plainParagraphsFromHtml("<p>a</p><p><b>b</b></p>"), ["a", "b"]);
});

test("preparação do conteúdo para o editor", () => {
  assert.equal(toEditorHtml("linha1\nlinha2"), "<p>linha1<br />linha2</p>");
  assert.equal(normalizeEditorHtml("<div>a</div><div>b</div>"), "<p>a</p><p>b</p>");
  assert.equal(normalizeEditorHtml("<p>a</p><p><br /></p>"), "<p>a</p>");
  assert.equal(normalizeEditorHtml("<br />"), "");
  assert.equal(normalizeEditorHtml("   "), "");
});

test("resumo para SEO e WhatsApp", () => {
  assert.equal(excerptFromDescription("<p><b>Oi</b> tudo bem</p>"), "Oi tudo bem");
  assert.equal(excerptFromDescription(`<p>${"a".repeat(400)}</p>`).length, 160);
});
