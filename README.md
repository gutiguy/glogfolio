# Glogfolio

A light-weight and opinionated CMS I made for personal usage. Comes with a gallery, blog and static pages management. It’s rigged to work with AWS S3 for image hosting and comes with dynamic categorization and tagging features. This repo contains the client and server, feel free to fork, develop and deploy this independantly.

## Requirements

1. Proper AWS S3 API keys with read/write permissions.
2. A running postgresql server.

## Disclaimer

You're welcome to fork, develop and use this code under the MIT license, but this is an ongoing personal development project - meaning It's prone to rapid and crude changes. As such, you should use this code with caution and make sure to push it through your own testing pipeline if you plan to use it in production.

### Development

With CRA 2.0 on the client and nodemon on the server developing each of them independantly is straightforward, I've also set this project to easily allow concurrent development.

1.  Make a copy of the .env.example files in the client and server folders, rename the copies to .env and fill in the data (the names of the variables are pretty straightforward - note that you need a running postgresql database though).

2.  You can use the package.json scripts of the server/client folders to install their dependencies:

```
(from root)
cd client
npm install
cd ../
cd server
npm install
```

or simply use this command from the root folder:

```
(from root)
npm run install:root
```

3. Before you can run the development server, you'll need to run database migrations using knex. Make sure your DB server is running and properly set up and then run this from the server folder:

```
knex migrate:latest
```

4.  Now whenever you wish to start a fullstack development server on your local machine run:

```
npm run dev
```

Which would run the client and server development servers concurrently.

## Built With

- [ReactJS](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
- [Express](https://maven.apache.org/) - Dependency Management
- [Knex](https://maven.apache.org/) - Dependency Management
- [Apollo](https://rometools.github.io/rome/) - Used to run the GraphQL server

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
