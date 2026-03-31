export function toBigCase(str: string): string {
  return str.toUpperCase();
}

export class LittelCalc {
  public add(a: number, b: number): number {
    return a + b;
  }
  public substract(a: number, b: number): number {
    return a - b;
  }
  public multiply(a: number, b: number): number {
    return a * b;
  }
  public divide(a: number, b: number): number {
    if (b === 0) {
      throw new Error("Cannot divide by zero");
    }
    return a / b;
  }
}
