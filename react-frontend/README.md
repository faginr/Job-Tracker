# Job Tracker

## Overview

Job Tracker is a modern web application that allows users to track their internship/job hunting efforts. Users can use the appllication to track applications, contacts, and skills as well as the relationships between each. Skills can be added to applications from the existing skills database or created brand new on the fly. Users can also rate their proficiency in each skill. Applications can link to multiple contacts and vice versa. Links to external postings such as glassdoor can also be included in each application.

## How it works

## Who it's for

The target audience for Job Tracker is computer science students attempting to land internships and/or jobs as they complete their studies. However, the application user interface is non-technical and can easily accomodate by anyone seeking to organize their job seeking efforts.

## What the goal is

The goal of the project is to give users a single centralized application to organize and to a lesser extent analyze their own personal job hunting efforts. Each user's data is privately stored and authenticated to ensure privacy and data integrity. User's are able to search their own data in a variety of ways, and edit/add attributes on the fly from each section of the application. The focus is providing a non-technical and user friendly experience that will improve the user's application management process.

## Communincation

Job Tracker has its own Gitter channel (what is [Gitter](https://blog.gitter.im/about/)?).

If you would like to send a message through Gitter, click the link below:

[Job Tracker Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/job-tracker?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

For Technical Assistance/Troubleshooting, please submit a request using the following form:

[Support Request Form](https://docs.google.com/forms/d/e/1FAIpQLSd7J5aOhvH-SSR2rKGSdWqwFDpwvSUAHCXQLzTQH5MZEUY8fg/viewform)

## How to run

The web application is hosted live on Gcloud, and can also be run locally for development purposes by cloning the repository. Please refer to the following sections depending on which version is appropriate.

### Live Application

The live application is deployed here:

[Job Tracker](https://capstone-frontend-377023.uc.r.appspot.com)

### Local Development Build

The application can be built and run locally by cloning the repository and following the steps laid out in this section.

## How to build

Job Tracker requires two separate servers to run the backend/database and the frontend/ui portions of the application. It is recommended to clone the repository using git (Learn more about git [git](https://git-scm.com/)). Download and install the latest version of git before proceeding. You can verify that git is installed and what version you are using with the following command in a commnad line prompt:

git -v

To clone the repository to a local machine, navigate to an appropriate folder using the command prompt and use the following command:

git clone https://github.com/faginr/Job-Tracker.git

Please note that the datastore-backend folder and the react-frontend folder each contain seperate node-modules and both must be installed and running for the application to run properly.

To install the proper packages for use of the datastore-backend, make sure you have installed npm and nodejs prior to the following directions (Learn more about [nodejs](https://nodejs.org/en/) and [npm](https://www.npmjs.com/)) 

from the datastore-backend folder, run the following command:

npm install

This should effectively download all necessary libraries for starting the server. Once the installation is complete, the server can be started manually using the following command:

npm start

Note the default port the server listens to is port 8080. This can be changed by editing the port number in server.js

To install the proper packages for use of the react-frontend, make sure you have installed npm and nodejs prior to the following directions (Learn more about [nodejs](https://nodejs.org/en/) and [npm](https://www.npmjs.com/))

from the react-frontend folder, run the following command:

npm install

This should effectively download all necessary libraries for starting the server. Once the installation is complete, the server can be started manually using the following command:

npm start

Once started the react app should open a browser to the index route automatically. Please note that any CRUD operations run through the react-frontend app require the datastore-backend server to be running in parallel. It is recommended to run each in seperate command line prompts.

***Note***
Job Tracker is built using the following package versions:

npm - 8.19.3
react - 18.2.0

## How to test

The datastore-backend portion of the application can be tested using the postman collection and environment included in the repository (Learn more about [Postman](https://www.postman.com/)).

A guide for importing postman collections and environments can be found here: [Importing in Postman](https://docs.saucelabs.com/api-testing/import-postman-collection/)

Please note that these tests are in development and should be run only after gaining familiarity with the backend routes. It is recommended to run collections with a delay of 1000ms to avoid latency issues when testing.

## How you can help

## Pull Requests

## License

Job Tracker falls under the [MIT License](https://opensource.org/licenses/MIT).

## React Notes - 

# Getting Started with React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
