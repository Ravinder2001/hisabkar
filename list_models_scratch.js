require("dotenv").config();
const key = process.env.GEMINI_API_KEY;
if (!key) {
  console.log("NO KEY");
  process.exit(1);
}
fetch("https://generativelanguage.googleapis.com/v1beta/models?key=" + key)
  .then((r) => r.json())
  .then((d) => {
    if (d.models) {
      console.log(d.models.map((m) => m.name).filter((n) => n.includes("gemini")));
    } else {
      console.log("Error", d);
    }
  })
  .catch(console.log);
