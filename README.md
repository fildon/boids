# Boids

[![Coverage Status](https://coveralls.io/repos/github/fildon/boids/badge.svg?branch=master)](https://coveralls.io/github/fildon/boids?branch=master)

Boids is an implementation of an artificial life program originally developed in the 1980s. 

The concept is simple, flocking can be simulated with just three fundamental rules:
- Separation (avoid crashing into other birds)
- Alignment (travel in the same direction as nearby birds)
- Cohesion (get close to nearby birds)

You can view the currently deployed simulation here:
https://fildon.github.io/boids/

## Local Development

    yarn install
    yarn run build

Then open index.html in the root folder of the project

## Testing

Unit tests and test coverage are provided by Jest

    yarn test
    yarn coverage

Additionally mutation can be run by Stryker with

    yarn mutation

## Coveralls

This project synchronizes with Coveralls
https://coveralls.io/github/fildon/boids
A pre-commit hook lints, generates a coverage report and then uploads the report to coveralls. For the upload to work you'll need to add a .coveralls.yml file with only a single line:

    repo_token: 'put coveralls auth token here'
