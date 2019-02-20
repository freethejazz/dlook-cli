import axios from 'axios';
import meow from 'meow';
import chalk from 'chalk';
import ora from 'ora';
import terminalLink from 'terminal-link';

export const run = async () => {
  const cli = meow(`
Usage
  $ dlook <search-term>

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
`);

  if (cli.input.length === 0) {
    console.error('Please include search terms.');
    cli.showHelp();
  }

  const searchString = cli.input.join(' ');
  const q = encodeURIComponent(searchString);

  const params = {
    page_size: 25,
    type: 'image',
    image_filter: 'official',
    q
  }

  const printResult = (image) => {
    const formattedName = chalk.bold(image.name)
    const linkedName = terminalLink(formattedName, `https://hub.docker.com/_/${image.name}`)
    console.log(linkedName);
    console.log(`${image.short_description}\n`);
  };

  const spinner = ora(`Searching '${searchString}' on Docker Hub`).start();

  axios.get('https://hub.docker.com/api/content/v1/products/search', { params })
    .then((response) => {
      const results = response.data;
      spinner.stop();
      if (results.count > 0) {
        console.log(`Found ${results.count} results for ${searchString}\n`);
        results.summaries.forEach(printResult);
      } else {
        console.log(`Could not find any images matching ${searchString}`);
      }
    }).catch((error) => {
      spinner.stop();
      console.error(`Failed to search for ${searchString}`);
      console.error(error);
    });

}
