Input vector should abstract out boid heading and position
- Instead hunter positions and headings should be relative

Weights should be clipped between 0 and 1

Output should be allowed to be linear
Or maybe just change to a three-output step function (thirds 0, 0.5, 1)

Loss function
Over fixed amount of frames
Each frame measure the distance between boid and nearest hunter
If the boid is consumed then all subsequent distances are treated as zero
Score is the sum of such distances over the time period
Given the above, evolution's task is to minimize the loss

Serialization strategy
Need a way to serialize a net to file
Need a way to load a net from a file
This will allow learning to take place over multiple separate training runs

Convert to jest
ignore file currently mentions mocha etc
Stryker will need reconfiguring

Update all dependencies

Nice to have:
build flag for source map or no
- Notes: would need to coordinate with both webpack and typescript
- Probably have webpack.config.js and tsconfig.json read from an env_var

Fix favicon

Lint rules
Enforce trailing slashes in the linter
Prefer single quoted strings
Prefer default export for classes
Warn about todo notes
