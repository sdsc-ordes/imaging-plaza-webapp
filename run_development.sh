#!/bin/bash

# Start Docker container in interactive mode
sudo docker run -it -v "$(pwd)/src/imaging-plaza-webapp":/app -p 3000:3000 --env-file .env --entrypoint /bin/sh imaging-plaza-webapp -c "
    npm install &&
    npx browserslist@latest --update-db --yes &&
    npm run build &&
    npm run dev
"
