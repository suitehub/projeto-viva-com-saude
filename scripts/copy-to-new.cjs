const fs = require("fs");
const path = require("path");
const dst = "C:\\Users\\User\\Desktop\\SuiteHub-Showroom\\scripts";
fs.mkdirSync(dst, { recursive: true });
for (const f of ["generate-static-preview.mjs", "check-all.cjs"]) {
  fs.copyFileSync(path.join(__dirname, f), path.join(dst, f));
  console.log("copied", f);
}
