import axios from "axios";

export default async function handler(req, res) {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: "Username required" });
  }

  try {
    const response = await axios.get(
      `https://api.github.com/users/${username}/repos`
    );

    let languageCount = {};
    let totalProjects = 0;

    response.data.forEach(repo => {
      if (repo.language) {
        totalProjects++;
        languageCount[repo.language] =
          (languageCount[repo.language] || 0) + 1;
      }
    });

    const languages = Object.keys(languageCount).map(lang => ({
      language: lang,
      projects: languageCount[lang],
      percentage: (
        (languageCount[lang] / totalProjects) *
        100
      ).toFixed(1)
    }));

    res.status(200).json({
      username,
      total_projects: totalProjects,
      languages
    });

  } catch (err) {
    res.status(500).json({ error: "GitHub API failed" });
  }
}
