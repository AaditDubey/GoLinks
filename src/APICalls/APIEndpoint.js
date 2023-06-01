import { Octokit } from '@octokit/rest';
import express from 'express';
import cors from 'cors';
const app = express();
const TOKEN = "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"
const octokit = new Octokit({auth: TOKEN});
app.use(cors());
app.get('/stats', async (req, res) => {
  try {
    const { username, forked } = req.query;

    const { status } = await octokit.users.getByUsername({
        username,
    });
      
    if (status !== 200) {
        throw new Error("error")
      }
    const { data: repositories } = await octokit.repos.listForUser({
      username,
    });
    
    const filteredRepositories = forked === 'false'
      ? repositories.filter(repo => !repo.fork)
      : repositories;

    let totalCount = 0;
    let stargazersCount = 0;
    let forkCount = 0;
    let totalSize = 0;

    for (const repo of filteredRepositories) {
      totalCount++;
      stargazersCount += repo.stargazers_count;
      forkCount += repo.fork ? 1 : 0;
      totalSize += repo.size;
    }

    const averageSize = totalSize / totalCount;

    const languageCounts = {};
    for (const repo of filteredRepositories) {
      const language = repo.language;
      if (language) {
        if (languageCounts[language]) {
          languageCounts[language]++;
        } else {
          languageCounts[language] = 1;
        }
      }
    }

    const sortedLanguageCounts = Object.entries(languageCounts)
      .sort((a, b) => b[1] - a[1])
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});

    const response = {
      totalCount,
      stargazersCount,
      forkCount,
      averageSize: formatSize(averageSize),
      languageCounts: sortedLanguageCounts,
    };

    res.json(response);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while fetching the statistics.' });
  }
});

function formatSize(size) {
  if (size < 1024) {
    return `${size} KB`;
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} MB`;
  } else {
    return `${(size / (1024 * 1024)).toFixed(2)} GB`;
  }
}

app.listen(3002, () => {
  console.log('Server is running on port 3002');
});
