import axios from 'axios';
import meow from 'meow';
import chalk from 'chalk';
import ora from 'ora';
import terminalLink from 'terminal-link';
import Table from 'cli-table';

const addLatestTags = (image) => {
  return axios.get(
    `https://hub.docker.com/v2/repositories/library/${image.slug}/tags/`,
    {
      params: {
        page_size: 5,
        page: 1
      }
    }).then((res) => {
      return {
        ...image,
        tags: res.data.results,
      };
    });
};

const generateTagTable = (tags) => {
  const table = new Table({
    head: ['Tag', 'Last Updated']
  });
  tags.forEach((tag) => {
    table.push([tag.name, tag.last_updated])
  });
  return table.toString();
};

export const run = async () => {
  const cli = meow(`
    Usage
      $ dlook <search-term>

    Options
      --with-latest-tags, -t Return 5 latest tags for each results

    Examples
      $ dlook graph database
      Found 4 results for graph database

      ${chalk.bold('neo4j')}
      Neo4j is a highly scalable, robust native graph database.

      ${chalk.bold('r-base')}
      R is a system for statistical computation and graphics.

      ${chalk.bold('orientdb')}
      OrientDB a Multi-Model Open Source NoSQL DBMS that combines graphs and documents.

      ${chalk.bold('arrangodb')}
      ArangoDB - a distributed database with a flexible data model for documents, graphs, and key-values.
    `,
    {
      flags: {
        withLatestTags: {
          type: 'boolean',
          alias: 't',
        },
      },
    });

  if (cli.input.length === 0) {
    console.error('Please include search terms.');
    cli.showHelp();
  }

  const searchString = cli.input.join(' ');

  const params = {
    page_size: 25,
    type: 'image',
    image_filter: 'official',
    q: searchString
  }

  const printResult = (image) => {
    const formattedName = chalk.bold(image.name)
    const linkedName = terminalLink(
      formattedName,
      `https://hub.docker.com/_/${image.slug}`
    );
    console.log(`${linkedName} - ${image.slug}`);
    console.log(`${image.short_description}`);
    if (image.tags) {
      console.log(generateTagTable(image.tags))
    }
    console.log(``);
  };

  const spinner = ora(`Searching '${searchString}' on Docker Hub`).start();

  axios.get('https://hub.docker.com/api/content/v1/products/search', {
    params,
    headers: {
      'Search-Version': 'v3',
    },
  })
    .then((response) => {
      const results = response.data;
      spinner.stop();
      if (results.count > 0) {
        console.log(`Showing ${Math.min(25, results.count)} of ${results.count} results for ${searchString}\n`);
        if (cli.flags.withLatestTags) {
          const spinner2 = ora(`Getting tags for ${Math.min(25, results.count)} results`).start();
          Promise.all(results.summaries.map(addLatestTags))
            .then((images) => {
              spinner2.stop();
              images.forEach(printResult);
            }).catch((error) => {
              spinner2.stop();
              console.error(`Failed to search get tags`);
              results.summaries.forEach(printResult);
            });
        } else {
          results.summaries.forEach(printResult);
        }
      } else {
        console.log(`Could not find any images matching ${searchString}`);
      }
    }).catch((error) => {
      spinner.stop();
      console.error(`Failed to search for ${searchString}`);
      console.error(error);
    });
}
