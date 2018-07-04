# HelpYou-Webapp

<p align="center"><img src="http://i68.tinypic.com/wiol0o.png"/></p>

A 3-screen webapp that allows users to share jobs with other users and maintenance workers registered on the site. Allows maintenance workers to pick up jobs, schedule the timing and arrive to complete the required work. 

Developed as a part of an 8-week internship as Product Development Intern at Hasura.

## Setup
- Install <a href="https://docs.platform.hasura.io/0.15/platform/manual/install-hasura-cli.html">Hasura CLI</a>, and create an account/cluster at <a href="https://dashboard.platform.hasura.io/register">Hasura</a>.
- Clone this repository.
  ```bash
  $ git clone https://github.com/NitheeshPrabu/HelpYou-Webapp.git
  ```
- Navigate to the project folder, and install the node dependencies.
  ```bash
  $ npm install 
  ```
- Change the API endpoints in all the controllers inside the `html` folder and the `server.js` file to point to the ones that your new cluster uses.
- Start the `nodejs` server.
  ```bash
  $ node server.js
  ```

**EDIT:** This project will not run _as-is_. The API model and project structure of Hasura-based apps has changed since the creation of this project. Make changes as necessary.

## Using the Webapp
The user of this app will need to have a registered account to use the service. Once registered, the user can opt to be either a _normal user_, who can make new requests, or a _maintenance worker_ who can accept requests of other normal users (the above two are the _roles_ a user can have).

### Login Screen
Here the user can login using their registered email ID and password.
<p align="center"><img src="http://i64.tinypic.com/124x1s8.png"/></p>

### Registration Screen
Here the new user can register for an account using a valid email ID and mobile number.
<p align="center"><img src="http://i68.tinypic.com/mcg8k1.png"/></p>

### Ask for Requests Screen
This will be the main screen for a _normal user_. Once logged in, the user will be redirected here. From this screen, new requests can be made. These requests are sorted based on category, and are populated into each maintenance worker's views.
<p align="center"><img src="http://i67.tinypic.com/98a92v.png"/></p>

_(This screen is not available for a maintenance worker)_

### My Requests Screen
This screen is available for both types of users, and the content of this screen varies according to their roles.

A _normal user_ will see a list of the requests they have made previously. Each request can have any one of three _statuses_: `not_accepted` (an X mark), `accepted` (a tick mark), and `completed` (a thumbs-up).
<p align="center"><img src="http://i66.tinypic.com/2w1rxg7.png"/><br><em>Normal User's My Requests Screen</em></p>

A _maintenance worker_ will see a list of the requests that other users have made under the category they opted for while registering. For example, a carpenter will see all requests labeled `Carpentry`. Only the pending requests are displayed here. Requests that are `accepted` or `completed` cannot be taken up by other users.
<p align="center"><img src="http://i66.tinypic.com/6ftrwg.png"/><br><em>Maintenance Worker's My Requests Screen</em></p>

Once a maintenance worker accepts a request, the contact details (mobile number) of both parties are exchanged with each other. Either one of the user can contact the other, and fix up the schedule and dates for the job.

Once a job is completed on the scheduled date, the user can mark the job as `completed`.

### My Profile Screen
This screen is available for both types of users, and the content of this screen varies according to their roles.

Here, both the users will be able to change their username, email ID, contact number, and password. Each change has to be authenticated by entering the current password.
<p align="center"><img src="http://i67.tinypic.com/300xgm0.png"/><br><em>Normal User's My Profile Screen</em></p>

<p align="center"><img src="http://i68.tinypic.com/zybvo7.png"/><br><em>Maintenance Worker's My Profile Screen</em></p>

The maintenance worker is given the additional option to change their category of work also.

## Todo
- Update API endpoints and project structure to current Hasura specs.
- Add OTP verification for registration and mobile number update.
- Add email verification for registration and email ID update.
