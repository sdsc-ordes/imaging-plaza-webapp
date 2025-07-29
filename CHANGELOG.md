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