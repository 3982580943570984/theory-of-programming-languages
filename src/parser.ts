import { Lexer } from "./lexer";

export class Parser {
  private _input: string = "";
  private _lexer: Lexer = new Lexer();
  private _lookahead: { type: string; value: string } | null | undefined;

  public parse(input: string) {
    this._input = input;
    this._lexer.reset(this._input);
    this._lookahead = this._lexer.getNextToken();
    return this.program();
  }

  public program() {
    return {
      type: "program",
      value: "",
    };
  }
}
