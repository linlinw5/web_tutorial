[← Back to Chapter Home](../../readme.md)

# Step 05: The Snake Now Has a Body

Expand the snake from a single square to a multi-segment structure with a head and body: the head is red, the body is blue, and the initial length is 3 segments.

## Core Change: the `segments` Array

```typescript
interface Point {
    x: number;
    y: number;
    fillStyle: string;
    strokeStyle: string;
}

class Snake {
    segments: Point[] = [];
    direction: Direction = Direction.Left; // Default direction: left

    constructor(x, y, headstyle = "red", bodystyle = "lightblue",
                strokeStyle = "white", initLength = 3) {
        for (let i = 0; i < initLength; i++) {
            this.segments.push({
                x: x + i * unit,
                y: y,
                fillStyle: i === 0 ? headstyle : bodystyle, // Special color for the head
                strokeStyle
            });
        }
    }
}
```

On initialization the head is at the leftmost position (index 0), with the remaining segments arranged to the right.

## Movement Algorithm: unshift + pop

```typescript
move(direction: Direction) {
    const currentHead = this.segments[0];
    const firstBody   = this.segments[1];

    // 1. Calculate new head coordinates based on direction (includes wrap-around)
    let newHead: Point = { ...currentHead, x: ..., y: ... };

    // 2. The current head becomes a body segment
    currentHead.fillStyle = firstBody.fillStyle;

    // 3. Insert the new head at the front of the array
    this.segments.unshift(newHead);

    // 4. Remove the tail (keeps the snake's length constant)
    this.segments.pop();
}
```

| Operation | Effect |
|---|---|
| `unshift(newHead)` | Insert new head at the front of the array — snake advances one cell |
| `pop()` | Remove the last element — tail disappears, total length unchanged |

Together, these two steps implement the entire snake's translation without needing to update every segment's coordinates individually.
