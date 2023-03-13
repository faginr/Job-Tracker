# Job Tracker

## Overview

Job Tracker is a modern web application that allows users to track their internship/job hunting efforts. Users can use the application to track applications, contacts, and skills as well as the relationships between each. Skills can be added to applications from the existing skills database or created brand new on the fly. Users can also rate their proficiency in each skill. Applications can link to multiple contacts and vice versa. Links to external postings such as glassdoor can also be included in each application.

## Who it's for

The target audience for Job Tracker is computer science students attempting to land internships and/or jobs as they complete their studies. However, the application user interface is non-technical and can easily accomodate by anyone seeking to organize their job seeking efforts.

## What the goal is

The goal of the project is to give users a single centralized application to organize and to a lesser extent analyze their own personal job hunting efforts. Each user's data is privately stored and authenticated to ensure privacy and data integrity. User's are able to search their own data in a variety of ways, and edit/add attributes on the fly from each section of the application. The focus is providing a non-technical and user friendly experience that will improve the user's application management process.

## Communincation

Job Tracker has its own Gitter channel (what is [Gitter](https://blog.gitter.im/about/)?).

If you would like to send a message through Gitter, click the link below:

[![Job Tracker Gitter https://gitter.im/job-tracker](https://badges.gitter.im/Join%20Chat.svg)](https://app.gitter.im/#/room/#job-tracker:gitter.im?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

For Technical Assistance/Troubleshooting, please submit a request using the following form:

[Support Request Form](https://docs.google.com/forms/d/e/1FAIpQLSd7J5aOhvH-SSR2rKGSdWqwFDpwvSUAHCXQLzTQH5MZEUY8fg/viewform)

## How to run

The web application is hosted live on Gcloud, and can also be run locally for development purposes by cloning the repository. Please refer to the following sections depending on which version is appropriate.

#### Live Application

The live application is deployed here:

[Job Tracker](https://capstone-frontend-377023.uc.r.appspot.com)

#### Local Development Build

The application can be built and run locally by cloning the repository and following the steps laid out in this section.

## How to build

Job Tracker requires two separate servers to run the backend/database and the frontend/ui portions of the application. It is recommended to clone the repository using git (Learn more about git [git](https://git-scm.com/)). Download and install the latest version of git before proceeding. You can verify that git is installed and what version you are using with the following command in a commnad line prompt:

```
git -v
```
To clone the repository to a local machine, navigate to an appropriate folder using the command prompt and use the following command:
```
git clone https://github.com/faginr/Job-Tracker.git
```
Please note that the datastore-backend folder and the react-frontend folder each contain seperate node-modules and both must be installed and running for the application to run properly.

To install the proper packages for use of the datastore-backend, make sure you have installed npm and nodejs prior to the following directions (Learn more about [nodejs](https://nodejs.org/en/) and [npm](https://www.npmjs.com/)) 

from the datastore-backend folder, run the following command:
```
npm install
```
This should effectively download all necessary libraries for starting the server. Once the installation is complete, the server can be started manually using the following command:
```
npm start
```
Note the default port the server listens to is port 8080. This can be changed by editing the port number in server.js

To install the proper packages for use of the react-frontend, make sure you have installed npm and nodejs prior to the following directions (Learn more about [nodejs](https://nodejs.org/en/) and [npm](https://www.npmjs.com/))

from the react-frontend folder, run the following command:
```
npm install
```
This should effectively download all necessary libraries for starting the server. Once the installation is complete, the server can be started manually using the following command:
```
npm start
```
Once started the react app should open a browser to the index route automatically. Please note that any CRUD operations run through the react-frontend app require the datastore-backend server to be running in parallel. It is recommended to run each in seperate command line prompts.

***Note***
Job Tracker is built using the following package versions:
```
npm - 8.19.3
react - 18.2.0
```
## How to test

The datastore-backend portion of the application can be tested using postman. (Learn more about [Postman](https://www.postman.com/)).

Please note that testing requires user authentication through bearer tokens and should only be attempted after gaining familiarity with the project codebase. It is recommended to run postman collections with a delay of 1000ms to avoid latency issues when testing.

## How you can help

Please submit any questions or comments using Gitter or the Support Request Form which can be found in the Communication section above.

## Pull Requests

The project is currently in development and not accepting pull requests at this time.

## License

Job Tracker falls under the [MIT License](https://opensource.org/licenses/MIT).
