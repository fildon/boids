# Boids

[![Coverage Status](https://coveralls.io/repos/github/fildon/boids/badge.svg?branch=master)](https://coveralls.io/github/fildon/boids?branch=master)

Boids is an implementation of an artificial life program originally developed in the 1980s. 

The concept is simple, flocking can be simulated with just three fundamental rules:
- Separation (avoid crashing into other birds)
- Alignment (travel in the same direction as nearby birds)
- Cohesion (get close to nearby birds)

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

Test coverage reports should be kept in sync with coveralls.io.
For this to work you'll need to add a .coveralls.yml file with only a single line:

    repo_token: 'put coveralls auth token here'
