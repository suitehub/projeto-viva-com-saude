const fs = require("fs");
const path = require("path");
console.log("DIR:", __dirname);
console.log(fs.readdirSync(path.join(__dirname, "..", "scripts")));
const d = "C:\\Users\\User\\Desktop";
console.log("DESKTOP:", fs.readdirSync(d).filter((f) => /suite|Suite|projeto|Projeto/i.test(f)));
const out = "C:\\Users\\User\\Desktop\\Suite-Hub-Vitrine";
try {
  console.log("VITRINE_FILES:", fs.readdirSync(out).length);
} catch (e) {
  console.log("VITRINE_MISSING:", e.message);
}
