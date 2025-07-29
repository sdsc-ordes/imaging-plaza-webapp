# Imaging plaza Frontend

## How to run this repository?

The easier way to execute this repository is to use Docker. 

``` bash
docker build -f tools/image/Dockerfile -t imaging-plaza-webapp .
```

Now in order to run the tool please fill `./config/.env.local` file, and run: 

``` bash
docker run --env-file .env -p 80:3000 imaging-plaza-webapp
```

This command will run `entrypoint.sh` in order to build the react app and start serving the web. 

## Changelog

- v1.7.0 - Search engine and multiple project improvement
- v1.6.1 - Hot fix for Coteries Utils building bug
- v1.6.0 - Runnable examples, examples datasets, tooltip, new filter added.
- v1.5.0 - Many bugs, and software page refactoring
- v1.3.0 - Filters on search page. Authors Dropped. List of examples datasets.
- v1.2.0 - Gimie is compatible with Citation.cff. Authors included in ontology. Maintainer / Producers has been dropped. 
- v1.1.2 - Updated F.A.Q., About, and ontology menu. Updated GRAPH DB Link.
- v1.1.1 - Fix for table formating
- v1.1.0 - Executable Notebooks added
- v1.0.1 - Hot fix for search engine
- v1.0.0 - First version published in `https://imaging-plaza.epfl.ch`
- v0.1.0 - First version published in `https://imagingplazadev.epfl.ch`
- v0.0.1 - Version Delivered by Coteries

## Credits

Frontend originally developed by Coteries in collaboration with SDSC and the EPFL Center for Imaging. Currently expanded and maintained by SDSC.