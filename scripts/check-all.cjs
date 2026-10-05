const fs = require("fs");
const { execSync } = require("child_process");
const dir = "C:\\Users\\User\\Desktop\\Suite-Hub-Vitrine";
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".html"));
for (const f of files) {
  const h = fs.readFileSync(dir + "\\" + f, "utf8");
  const blocks = [...h.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  blocks.forEach((b, i) => {
    try {
      new Function(b[1]);
    } catch (e) {
      const tmp = dir + "\\_tmpcheck.js";
      fs.writeFileSync(tmp, b[1]);
      try {
        execSync('node --check "' + tmp + '"', { stdio: "pipe" });
      } catch (e2) {
        const out = (e2.stdout || "") + (e2.stderr || "");
        console.log(f + " block" + i + " => " + out.split("\n").slice(0, 6).join(" | "));
      }
      try { fs.unlinkSync(tmp); } catch (_) {}
    }
  });
}
console.log("done");
