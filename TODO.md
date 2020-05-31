## Perception

Input vector should abstract out boid heading and position
- Instead hunter positions and headings should be relative
- Net should dynamically adapt to number of hunters in pack, by increasing or decreasing the size of the input and output layers

## Loss function

- Over fixed amount of frames
- Each frame measure the distance between boid and nearest hunter
- If the boid is consumed then all subsequent distances are treated as zero
- Score is the sum of such distances over the time period
- Given the above, evolution's task is to minimize the loss

## Serialization strategy

- Need a way to serialize a net to file
- Need a way to load a net from a file
- This will allow learning to take place over multiple separate training runs

## Training
- Need to fix world size. Clip rendering to a box?

Fix favicon
