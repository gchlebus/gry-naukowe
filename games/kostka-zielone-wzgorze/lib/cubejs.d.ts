declare module "cubejs/lib/cube.js" {
  export default class Cube {
    cp: number[];
    co: number[];
    ep: number[];
    eo: number[];
    center: number[];
    constructor(
      other?:
        | Cube
        | {
            cp: number[];
            co: number[];
            ep: number[];
            eo: number[];
            center?: number[];
          },
    );
    static fromString(s: string): Cube;
    static inverse(s: string): string;
    clone(): Cube;
    move(s: string): Cube;
    asString(): string;
    isSolved(): boolean;
  }
}
