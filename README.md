# syntax
*COMPSCI 399 Project 10 (Extended note-taking app for programming students)*

**syntax** is a multi-platform note-taking application designed specifically for programming students. In order to meet the needs of its target audience, the application supports writing, compiling, and executing code. It also contains many additional note-taking features, including searchable code snippets, drawing & stylus support, exportable notes, image upload, Youtube video embeds, and collaborative note creation.

*Further information, documentation, and considerations can be found at https://github.com/uoa-compsci399-s2-2022/syntax/wiki*

Deployed at http://syntaxapp.vercel.app/

[![https://vercel.com/?utm_source=10outof10&utm_campaign=oss](powered-by-vercel.svg)](https://vercel.com/?utm_source=10outof10&utm_campaign=oss)

## Interface
#### Editor
<img src="https://i.imgur.com/GbcE0gK.png" alt="Editor (dark mode)" width="50%" /><img src="https://i.imgur.com/8wLahnf.png" alt="Editor (light mode)" width="50%" />

#### Home Page
<img src="https://i.imgur.com/WjYekpE.png" alt="Home page (dark mode)" width="50%" /><img src="https://i.imgur.com/6Gxf73k.png" alt="Home page (light mode)" width="50%" />

#### Sign In Page (via Google)
<img src="https://i.imgur.com/DjeHkxX.png" alt="Sign in page (dark mode)" width="50%" /><img src="https://i.imgur.com/t1nY8nY.png" alt="Sign in page (light mode)" width="50%" />

## Technologies

### Languages
* Typescript
* Javascript

### Libraries/Frameworks/APIs
* React (17.0.2)
* Prisma (4.2.1)
    * prisma-client (4.3.1)
* Next.js (12.3.1)
* NextAuth.js (4.10.3)
    * next-auth/prisma-adapter (1.0.4)
* next-pwa (5.5.4)
* next-themes (0.2.0)
* NextUI (1.0.0-beta.9)
* heroicons (2.0.11)
* Tiptap (2.0.0-beta.199)
* Prosemirror 
    * prosemirror-state (1.4.1)
    * prosemirror-view (1.28.2)
* CodeMirror 
    * codemirror/view (6.2.4)
    * codemirror/commands (6.1.0)
    * codemirror/language (6.2.1)
* TIO.run ([AviFS/tio-api](https://github.com/AviFS/tio-api/))
* Turndown (7.1.1)
* Y.js (13.5.41)
* lodash (4.17.21)
* AWS SDK (2.1204.0)
* tldraw (1.24.5)
* md-to-pdf (5.1.0)
* lru-cache (7.14.0)

### Cloud Services
* Amazon S3 (AWS)

## Getting Started
To get started clone this repo and install all dependancies 
```
$ git clone https://github.com/uoa-compsci399-s2-2022/syntax.git
$ npm install
```
To use Prisma with the application, generate the schema bindings via
```
$ npx prisma generate
```
*this is a required step, not doing so will cause the compile to fail*
Any changes made to the schema will require you to re-generate the Prisma client.

this will also mean, any previously created objects that now break the schema could fail.

These Enviroment variables will need to be set

* `S3_SECRET_KEY`
* `S3_ACCESS_KEY`
* `AWS_BUCKET_REGION`
* `AWS_BUCKET_NAME`
* `NEXTAUTH_SECRET`
* `NEXTAUTH_URL`
* `GOOGLE_SECRET`
* `GOOGLE_ID`
* `DATABASE_URL`

[you can read more about them here](wiki/Environment-Variables)

If hosting through vercel, you can [link a project to handle storing these for dev, preview and prod](https://vercel.com/docs/concepts/projects/environment-variables#development-environment-variables)

```
$ npm install -g vercel
$ vercel link
. . .
$ vercel env pull
```

When deploying to Vercel, It might be likely that you do not wish to build every branch in your repo. you can [skip "build-steps"](https://vercel.com/docs/concepts/deployments/configure-a-build#skip-build-step).
An example to only track and build "Production"

```
[ "$VERCEL_ENV" != production ]
```


## Project Management Tools
* [Jira](https://10outof10.atlassian.net/jira/software/projects/TEN10/boards/1/roadmap) 
* [Notion](https://elegant-joke-27e.notion.site/CS399-Project-Team-10-c6ba4a95d1ae4e14bf42fd1657b88776)

## Future Plans
[Read here in the Wiki](wiki)

## Acknowledgements

Our client Paravmir and sponsor Vercel.

## Team 10 out of 10
| Name  | Role |
| --- | --- |
| [Lucy Jane Dionisio](https://github.com/momor1n)  | Team Leader, Frontend Developer, Designer  |
| [Lily Howan](https://github.com/lilyhowan)  | Frontend Developer, Designer  |
| [Sarah Kim](https://github.com/bonjuruu)  | Backend Developer  |
| [Hayden White](https://github.com/HFx6)  | Backend Developer, Designer  |
| [Kevin Yip](https://github.com/kyip053)  | Backend Developer  |
