const fs = require("fs");
const f = "C:\\Users\\User\\Desktop\\Suite-Hub-Vitrine\\demo-restaurante-02.html";
const h = fs.readFileSync(f, "utf8");
console.log("SIZE:", h.length);
console.log("HAS_HERO_TITLE:", h.includes("FOME DE VERDADE"));
console.log("RV_COUNT:", (h.match(/rv[\s"']/g) || []).length);
const blocks = [...h.matchAll(/<script>([\s\S]*?)<\/script>/g)];
console.log("SCRIPT_BLOCKS:", blocks.length);
blocks.forEach((b, i) => {
  try {
    new Function(b[1]);
    console.log("JS" + i + ": OK");
  } catch (e) {
    console.log("JS" + i + " ERROR:", e.message);
  }
});
console.log("TAIL:", JSON.stringify(h.slice(-160)));
