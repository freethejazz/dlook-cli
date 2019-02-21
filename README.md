# dlook-cli

Search for official containers in docker hub.

<img src="dlook.gif" width="400">

## Installation

```
$ npm install --global dlook-cli
```

## Usage
```
dlook --help

  A cli tool to search official docker containers

  Usage
    $ dlook <search-term>

  Options
    --with-latest-tags, -t Return 5 latest tags for each results

  Examples
    $ dlook graph database
    Found 4 results for graph database

    neo4j
    Neo4j is a highly scalable, robust native graph database.

    r-base
    R is a system for statistical computation and graphics.

    orientdb
    OrientDB a Multi-Model Open Source NoSQL DBMS that combines graphs and documents.

    arrangodb
    ArangoDB - a distributed database with a flexible data model for documents, graphs, and key-values.
```

## Thanks
 - Big thanks to [Sindre Sorhus](https://github.com/sindresorhus) for
inspiration and libraries that helped me put this thing together.
 - To [Roberto Guerra](https://github.com/uris77) for letting me know
   about [@pika/pack](https://github.com/pikapkg/pack)
 - To [@pika/pack](https://github.com/pikapkg/pack) for making it easy
   to build and publish npm packages.
