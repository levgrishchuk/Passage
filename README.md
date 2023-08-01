# Passage
> A ***** made with ***** [Vue](https://github.com/vuejs/vue), [D3](https://github.com/d3/d3), and [Three.js](https://github.com/mrdoob/three.js/).

#### Try it out at *****[www.kaleidosync.com](https://www.kaleidosync.com)!

## Installation

Follow these steps to get the project up and running on your local machine.

### Prerequisites

Ensure the following software is installed on your machine:

- [Node.js and npm](https://nodejs.org/en/download/)
- [Git](https://git-scm.com/downloads)

### Setup

#### Step 1: Clone the Repository

In a directory of your choice, clone the repository using the following command:

```shell
git clone https://github.com/moonwane/Passage.git
```

#### Step 2: Create Spotify Developer App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/applications) and log in.
2. Click on "Create an App", fill out the necessary information, and get your `client id` and `secret client`.
3. Add `http://localhost:3000/` (make sure to include the trailing "/") as a Redirect URI in the app settings.

#### Step 3: Setup MongoDB

Follow [MongoDB's official guide](https://docs.mongodb.com/manual/installation/) to create a new Atlas project, build a database, whitelist your IP, add a database user, and obtain the connection URI. If you prefer a video guide, [this tutorial](https://www.youtube.com/watch?v=KKyag6t98g8) can help you set it up.

#### Step 4: Create Environment Files

1. In the root directory, create a `.env` file and populate it like so:
    ```shell
    # Provide your specific details here
    SPOTIFY_CLIENT_ID=<your-client-id>
    SPOTIFY_CLIENT_SECRET=<your-secret-client>
    MONGODB_URI=<your-mongodb-uri>
    ```
2. Repeat this process in the `client` directory.

#### Step 5: Install Dependencies

From the root directory, run the following commands:

```shell
# Install root dependencies
npm install
# Change into the client directory
cd client
# Install client dependencies
npm install
# Navigate back to root
cd ..
```

#### Step 6: Run the Application

Finally, start the application with:

```shell
npm run dev
```

