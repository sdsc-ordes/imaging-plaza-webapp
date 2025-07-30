# Changelog

All notable changes to this project will be documented in this file.

## [1.7.0] - 2025-07-29

### Added
- Complete project restructuring following SDSC ORDES Template
- Bundled Coteries dependencies in dedicated `lib` directory for better dependency management
- Enhanced search functionality based on pyfuzon integration
- Compatibility with new `git-metadata-extraction` integration
- Search microservices architecture support
- Improved Dockerfile with optimized build process and multi-stage builds
- Enhanced variable parsing system with better type validation and error handling
- GitHub Actions workflow for automated CI/CD, publishing, and releases

### Changed
- Restructured project architecture for better maintainability and scalability
- Improved containerization strategy with optimized Docker layers
- Enhanced environment variable handling with better parsing logic

### Technical Improvements
- Modularized dependencies for easier maintenance
- Better separation of concerns in project structure
- Improved build performance through Docker optimizations including using Node as the base image

## [1.6.1] - Hot fix for Coteries Utils building bug

### Fixed

- Resolved Coteries Utils building bug that was preventing proper compilation

## [1.6.0] - Runnable examples, examples datasets, tooltip, new filter added

### Added

- Runnable examples functionality
- Examples datasets integration
- Tooltip component implementation
- New filter options for improved search capabilities

## [1.5.0] - Many bugs, and software page refactoring

### Fixed

- Multiple bug fixes across the application

### Changed

- Complete refactoring of software page for better user experience and maintainability

## [1.3.0] - Filters on search page. Authors Dropped. List of examples datasets

### Added

- Filter functionality on search page
- List of examples datasets

### Removed

- Authors field (dropped from the system)

## [1.2.0] - Gimie is compatible with Citation.cff. Authors included in ontology. Maintainer / Producers has been dropped

### Added

- Gimie compatibility with Citation.cff format
- Authors included in ontology system

### Removed

- Maintainer/Producers field (dropped from the system)

## [1.1.2] - Updated F.A.Q., About, and ontology menu. Updated GRAPH DB Link

### Changed

- Updated F.A.Q. section content
- Updated About page information
- Updated ontology menu interface
- Updated GRAPH DB Link

## [1.1.1] - Fix for table formating

### Fixed

- Table formatting issues resolved

## [1.1.0] - Executable Notebooks added

### Added

- Executable Notebooks functionality

## [1.0.1] - Hot fix for search engine

### Fixed

- Critical search engine bug fix

## [1.0.0] - First version published in `https://imaging-plaza.epfl.ch`

### Added

- Initial public release
- Full application functionality
- Deployed to production environment at imaging-plaza.epfl.ch

## [0.1.0] - First version published in `https://imagingplazadev.epfl.ch`

### Added

- Initial development version
- Core application features
- Deployed to development environment at imagingplazadev.epfl.ch

## [0.0.1] - Version Delivered by Coteries

### Added

- Initial version delivered by Coteries team
- Base application structure and functionality
