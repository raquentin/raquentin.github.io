---
title: Pin health check tutorial
date: 08-08-2025
tags:
  - pin
---

Hi! Again welcome to Pin and thanks a lot for choosing this proj, we're glad to have you.

The goals of this tutorial are to:
- introduce you to the file structure
- explain Pin architecture
- ensure you have all dev dependencies
- show you how to run the app!

So far, the app is pretty simple. It has 1 real page, which calls a health check endpoint on the backend and shows the result. The backend health check returns success if the server is up and working; it fails if the server is not running. The backend is also configured to log calls to the health check route in a PostgreSQL database instance. The db will maintain these logs regardless of the state of the backend.

In the tutorial, we'll test these simple features like this (sry font small):

![[pin-health-flow.png]]

But first, let's learn a bit more ab the project.

## File structure

To start looking at Pin files, you'll need a local copy of the repository.

```bash
git clone git@github.com:pin-app/pin.git   # clone the files to a folder locally
git checkout health-check-tutorial         # checkout the version for this tutorial
```

Now you have the folder locally, let's look into it:
```
pin/
├── README.md
├── docker-compose.yml                    # postgres & migration services config
│
├── backend/                              # go backend service
│   ├── go.mod                            # go dependencies
│   ├── go.sum                            # module checksums
│   ├── Makefile                          # dev & build commands
│   │
│   ├── cmd/server/                       # entry point
│   │   └── main.go                       # startup, db migration, load routes
│   │
│   ├── internal/                         # application core
│   │   ├── handlers/                     # http request handlers
│   │   │   ├── health.go                 # health check handler
│   │   │   └── routes.go                 # url mapping
│   │   └── server/
│   │       └── server.go                 # exported server w/ middleware
│   │
│   └── migrations/                       # db schema migrations
│       ├── 000001_init.up.sql            # create health_checks table
│       ├── 000001_init.down.sql          # drop health_checks table
│       └── embed.go                      # embed sql files in go bin
│
└── mobile/                               # react native mobile app
    ├── app.json                          # expo configuration
    ├── package.json                      # nodesjs dependencies, scripts
    ├── package-lock.json
    ├── tsconfig.json                     # TypeScript config
    ├── index.ts                          # app entry point
    ├── App.tsx                           # head app component
    │
    ├── assets/                           # icons & images
    │   ├── adaptive-icon.png
    │   ├── favicon.png
    │   ├── icon.png
    │   └── splash-icon.png
    │
    └── src/                              # application core
        ├── navigation/
        │   └── BottomTabNavigator.tsx
        │
        ├── pages/                        # screen components
        │   ├── index.ts                  # exports
        │   ├── FeedPage.tsx
        │   ├── MapPage.tsx
        │   └── ProfilePage.tsx
        │
        ├── services/                     # bridge to API & external services
        │   └── api.ts
        │
        └── theme/                        # global design objects
            ├── index.ts
            ├── colors.ts
            ├── spacing.ts
            └── typography.ts
```

Understanding that the repo contains both code and build scripts for the frontend and backend is enough for now.

## Architecture

The diagram below models interactions between the three discrete services powering Pin in the health check example mentioned above. `hc` means health check.
![[pin-basic-arch.png]]

Multiple indepdenent programs power Pin. The most obvious one is the mobile app. The TypeScript mobile app contains UI components and functions for performing web and system requests. React Native compiles transpiles our ts codebase to two runnable programs: one in Swift for iOS devices, and another in Java for android devices. The appeal of React Native is that it lets us write one codebase to distribute to both platforms.

Second, we have the backend. The backend is an entirely separate service from the frontend; the frontend runs on end user mobile devices, the backend runs on our own server(s) and actually powers the app. When a user clicks the "Check Health" button, (or later loads the Pin feed, makes a pin on the map, etc), the button evokes an event handler function that makes a request to the backend to get the relevant data. The backend collects requests from all end users and performs them in parallel.

The final discrete service is the PostgreSQL database. Consider the example in the beginning; we load up the backend, send two health check requests, restart it, and send another. The health check counter on the frontend is 3. Without some permanent data store, this would be impossible as the data maintained by the running backend is transient by default. Once the backend is stopped, its running data is lost. In our case, the backend's health check request handler logs its calls into the database. This way, when the health check endpoint is called later, the backend reads the amount of entries in the health check table in the database and returns that number as the total access count.


## Running Pin

Enough yap. Let's run Pin.

First, ensure you have the [dependencies](https://github.com/pin-app/pin/wiki/Dev-Dependencies) installed.

`cd` into the Pin folder.

Open three terminals, you'll need one for each of:
- running the frontend with Expo
- running the Go backend
- starting the database with docker

### Running the frontend

`cd frontend` to enter the frontend subdirectory.

You've downloaded Node, but node itself needs to download some dependencies for our project (via npm). Run `npm i` to get them.

`npm run start` to run the Expo start script. After a bit you should see a QR code inviting you to load the Pin app on your actual phone. Download the Expo app from the app store to do that. You can also use an emulator on your computer via Simulator on macOS or Android Studio elsewhere.

You've opened the app now. Navigate the the Maps page, and you should see a failed health check. This is failing because the backend has not ran yet.

### Running the database

The backend depends on the database for basic functions, so we need to load the database first.

Start the docker daemon. On macos, start docker desktop. On linux, `sudo systemctl start docker. On windows, idk look it up.

In a new terminal pane, `cd backend`. The backend contains all the scripts to interact with the database. Run 'make db-up'. It's a good habit to find what this command is actually doing before running it, you'll find that mapping in the 'Makefile'.

Later, you may want to remove and reset the database:
```bash
make db-down
docker volume rm pin_pg_data # this removes the db volume, don't do this on accident
```

### Running the backend

Enter your third terminal pane and `cd backend`. Now `make run`.

### Using the app

Now you have all three services running. Go back to your emulator and refresh. You should see the first health check passing. If not, debug by revisiting your terminal panes. The backend has a verbose logging setup, you'll probably find the error there.

Recall the app flow shown at the beginning of the tutorial. Experiment with turning off the backend, closing and reopening the app, and observe how our system behaves.


## Conclusion

At this point, you've cloned the repo, ran all three of our services, and used the app on your on phone. Nice! Send a msg in discord and we'll help you move on and pick up a real issue. Any questions just ask in #pin or dm.
