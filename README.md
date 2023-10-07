# Passage

> A way for you to clip Spotify songs

Envisioned as a productivity tool for musicians, Passage allows you to clip the most interesting segments from Spotify songs for easy reference in the future.

Built using [MongoDB](https://www.mongodb.com/), [Express](https://expressjs.com/), [React](https://reactjs.org/), [Node.js](https://nodejs.org/), [Three.js](https://threejs.org/), and the [Spotify API](https://developer.spotify.com/documentation/web-api/).

---

#### **Try it out at [https://passage.onrender.com/](https://passage.onrender.com/)**

<div style="display: flex; justify-content: space-between;">
    <img src="https://github.com/levgrishchuk/Passage/assets/68343698/49826df7-213c-4586-8295-b540fe5ad931" alt="First GIF"/>
    <img src="https://github.com/levgrishchuk/Passage/assets/68343698/805baa18-020d-4877-ac1a-9156af57c10c" alt="Second GIF"/>
</div>



![ezgif com-optimize](https://github.com/levgrishchuk/Passage/assets/68343698/49826df7-213c-4586-8295-b540fe5ad931)          ![passagetest14finalsmall3](https://github.com/levgrishchuk/Passage/assets/68343698/805baa18-020d-4877-ac1a-9156af57c10c)

## Demo Video
Check out this [YouTube video](link) for a demo of Passage.

## Features
- **Clip and Annotate Passages:** Save favorite music segments using a dual-thumb seek bar, and annotate with personal notes and tags.
- **Spotify Integration:** Control playback of your Spotify client with Passage's mirrored controls. Stays synchronized through continuous polling.
- **Spotify-Inspired Design:** Features a familiar UI, including an equalizer animation during track playback.
- **Responsive Design:** Optimized for all screen sizes, from small devices to 4K+ resolutions.
- **CRUD Functionality:** Easily create, read, update, and delete passages.
- **Immersive Animation:** Visually engaging backdrop animation created with Three.js.
- **Preview Page:** Explore the user interface without Spotify functionality.

## Getting Started

To get the most out of Passage, you'll need a **Spotify Premium account**. This allows Passage to control Spotify playback and access your Spotify library.

However, if you don't have a **Spotify Premium account**, you can still explore the interface with the "Preview" feature. This will allow you to navigate the Passage interface and browse through a few preloaded passages. Please note that actual playback will not be available in this mode.

For the full functionality:

1. Visit [https://passage.onrender.com/](https://passage.onrender.com/).
2. Login with a **Spotify Premium account**.
3. Play a song on your Spotify client.
4. Switch to Passage to gain control of the Spotify playback.
5. Use the two-thumb seek bar to select a segment of the song.
6. Add a note and tags to the selected passage.
7. Save the passage—it will now appear in your Passage library.

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
git clone https://github.com/levgrishchuk/Passage.git
```

#### Step 2: Create Spotify Developer App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/applications) and log in.
2. Click on "Create an App", fill out the necessary information, and note your `client id` and `client secret`.
3. Add `http://localhost:3000/` (make sure to include the trailing "/") as a Redirect URI in the app settings.

#### Step 3: Setup MongoDB

Follow [MongoDB's official guide](https://docs.mongodb.com/manual/installation/) to create a new Atlas project, build a database, whitelist your IP, add a database user, and obtain the `connection URI`. If you prefer a video guide, [this tutorial](https://www.youtube.com/watch?v=KKyag6t98g8) can help you set it up.

#### Step 4: Create Environment Files

1. In the root directory, create a `.env` file and populate it like so:
    ```shell
    NODE_ENV = "development"
    client_id = "<your-client-id>"
    client_secret = "<your-client-secret>"
    redirect_uri = "http://localhost:3000/"
    mongoURI = "<your-mongoURI>"
    ```
2. In the `client` directory, create a `.env` file and populate it like so:
    ```shell
    NODE_ENV = "development"
    REACT_APP_client_id = "<your-client-id>"
    client_secret = "<your-client-secret>"
    REACT_APP_redirect_uri = "http://localhost:3000/"
    mongoURI = "<your-mongoURI>"
    ```
Replace `<your-client-id>`, `<your-client-secret>`, and `<your-mongoURI>` with the values you obtained in Steps 2 and 3. Remember to include quotation marks ("") around your values.

For the `<your-mongoURI>`, remember to replace PASSWORD with your MongoDB user password. Special characters like %, @, and others should be URL-encoded.

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

