import React from 'react';

const Stats = ({ data }) => {
    if(!data)return null
  return (
    <div>
      <h2>Statistics</h2>
      <p>Total Count of Repositories: {data.totalCount}</p>
      <p>Total Stargazers: {data.stargazersCount}</p>
      <p>Total Fork Count: {data.forkCount}</p>
      <p>Average Size: {data.averageSize}</p>
      <p>Languages:</p>
      <ul>
        {Object.entries(data.languageCounts).map(([language, count]) => (
          <li key={language}>
            {language}: {count}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Stats;