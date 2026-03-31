/**
 * 将字符串中每个单词的首字母大写，其余字母小写。
 * 例："hello world" → "Hello World"
 */
export function capitalize(str: string): string {
    return str
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
}

/**
 * 将数字限制在 [min, max] 范围内。
 * 小于 min 则返回 min，大于 max 则返回 max，否则原样返回。
 */
export function clamp(value: number, min: number, max: number): number {
    if (value < min) return min;
    if (value > max) return max;
    return value;
}

/**
 * 一个简单的栈（先进后出）。
 */
export class Stack<T> {
    private items: T[] = [];

    push(item: T): void {
        this.items.push(item);
    }

    pop(): T {
        if (this.isEmpty()) {
            throw new Error("Stack is empty");
        }
        return this.items.pop()!;
    }

    peek(): T {
        if (this.isEmpty()) {
            throw new Error("Stack is empty");
        }
        return this.items[this.items.length - 1];
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }

    size(): number {
        return this.items.length;
    }
}
