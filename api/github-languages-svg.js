import axios from "axios";

export default async function handler(req, res) {
  const { username } = req.query;

  if (!username) {
    res.setHeader("Content-Type", "image/svg+xml");
    return res.send(`<svg><text x="10" y="20">Username missing</text></svg>`);
  }

  const repoRes = await axios.get(
    `https://api.github.com/users/${username}/repos`
  );

  let langCount = {};
  let total = 0;

  repoRes.data.forEach(repo => {
    if (repo.language) {
      total++;
      langCount[repo.language] =
        (langCount[repo.language] || 0) + 1;
    }
  });

  let y = 40;
  let rows = "";

  Object.keys(langCount).forEach(lang => {
    const percent = ((langCount[lang] / total) * 100).toFixed(1);
    const barWidth = percent * 2;

    rows += `
      <text x="20" y="${y}" fill="#fff" font-size="14">${lang}</text>
      <rect x="120" y="${y - 12}" width="${barWidth}" height="10" fill="#4cc9f0"/>
      <text x="${130 + barWidth}" y="${y}" fill="#aaa" font-size="12">
        ${percent}% | ${langCount[lang]} projects
      </text>
    `;
    y += 30;
  });

  const svg = `
  <svg width="600" height="${y}" xmlns="http://www.w3.org/2000/svg">
    <style>
      text { font-family: Arial, sans-serif; }
    </style>
    <rect width="100%" height="100%" fill="#0d1117"/>
    <text x="20" y="25" fill="#58a6ff" font-size="18">
      ${username}'s Language Stats
    </text>
    ${rows}
  </svg>
  `;

  res.setHeader("Content-Type", "image/svg+xml");
  res.send(svg);
}
