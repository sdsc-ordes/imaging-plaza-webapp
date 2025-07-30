# Imaging plaza Frontend

## How to run this repository?

The easier way to execute this repository is to use Docker. 

``` bash
docker build -f tools/image/Dockerfile -t imaging-plaza-webapp .
```

Now in order to run the tool please fill `.env` file from `.env.dist`, and run: 

``` bash
docker run --env-file .env -p 80:3000 imaging-plaza-webapp
```

This command will run `entrypoint.sh` in order to build the react app and start serving the web in production. 

## How to develop?

Please run `bash run_development.sh`. This will mount the src volume into the app and run `npm run dev`. All changes in the project will be detected by the app.

## Credits

Developed and maintained by SDSC. Frontend originally developed by Coteries in collaboration with SDSC and the EPFL Center for Imaging.