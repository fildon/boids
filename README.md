# Boids

[![.github/workflows/deploy.yml](https://github.com/fildon/boids/actions/workflows/deploy.yml/badge.svg)](https://github.com/fildon/boids/actions/workflows/deploy.yml)
[![.github/workflows/test.yml](https://github.com/fildon/boids/actions/workflows/test.yml/badge.svg)](https://github.com/fildon/boids/actions/workflows/test.yml)

Boids is an implementation of an artificial life program originally developed in the 1980s.

The concept is simple, flocking can be simulated with just three fundamental rules:

- Separation (avoid crashing into other birds)
- Alignment (travel in the same direction as nearby birds)
- Cohesion (get close to nearby birds)

You can view the currently deployed simulation here:
[Boids](https://fildon.github.io/boids/)

## Local Development

```shell
yarn install
yarn build
```

Then open dist/index.html in any browser

## Testing

Unit tests and test coverage are provided by Jest

```shell
yarn test
yarn test --coverage
```
