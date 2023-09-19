const Specifications: [RegExp, string | null][] = [
  // Whitespace:
  [/^\s+/, null],

  // Comments
  [/^\/\/.*/, null],
  [/^\/\*[\s\S]*?\*\//, null],

  // Strings
  [/^"[^"]*"/, "STRING"],
  [/^'[^']*'/, "STRING"],

  // Symbols, delimiters
  [/^;/, ";"],
  [/^\{/, "{"],
  [/^\}/, "}"],
  [/^\(/, "("],
  [/^\)/, ")"],
  [/^,/, ","],
  [/^\./, "."],
  [/^\[/, "["],
  [/^\]/, "]"],

  // Keywords
  [/^\blet\b/, "LET"],
  [/^\bif\b/, "IF"],
  [/^\belse\b/, "ELSE"],
  [/^\btrue\b/, "TRUE"],
  [/^\bfalse\b/, "FALSE"],
  [/^\bwhile\b/, "WHILE"],
  [/^\bdo\b/, "DO"],
  [/^\bfor\b/, "FOR"],
  [/^\bdef\b/, "DEF"],
  [/^\breturn\b/, "RETURN"],
  [/^\bclass\b/, "CLASS"],
  [/^\bextends\b/, "EXTENDS"],
  [/^\bsuper\b/, "SUPER"],
  [/^\bnew\b/, "NEW"],
  [/^\bthis\b/, "THIS"],

  // Numbers
  [/^\d+/, "NUMBER"],

  // Identifiers
  [/^\w+/, "IDENTIFIER"],

  // Equality operator
  [/^[=!]=/, "EQUALITY_OPERATOR"],

  // Assignment operators: =, +=, -=, *=, /=
  [/^=/, "SIMPLE_ASSIGN"],
  [/^[\+\-\*\/]=/, "COMPLEX_ASSIGN"],

  // Math operators: +, -, *, /
  [/^[+\-]/, "ADDITIVE_OPERATOR"],
  [/^[*\/]/, "MULTIPLICATIVE_OPERATOR"],

  // Relational operators
  [/^[><]=?/, "RELATIONAL_OPERATOR"],

  // Logical operators
  [/^&&/, "LOGICAL_AND"],
  [/^\|\|/, "LOGICAL_OR"],
  [/^!/, "LOGICAL_NOT"],
];

export class Lexer {
  private _input: string = "";
  private _cursor: number = 0;
  public get cursor(): number {
    return this._cursor;
  }

  public reset(input: string): void {
    this._input = input;
    this._cursor = 0;
  }

  public getNextToken(): { type: string; value: string } | null {
    if (this.isEOF()) {
      return null;
    }

    const string = this._input.slice(this._cursor);
    for (const [regex, tokenType] of Specifications) {
      const tokenValue = this._match(regex, string);

      if (tokenValue === null) continue;

      if (tokenType === null) return this.getNextToken();

      return { type: tokenType, value: tokenValue };
    }

    throw new SyntaxError(`Unexpected token => ${string[0]}`);
  }

  private _match(regex: RegExp, string: string): string | null {
    const match = regex.exec(string);
    if (match === null) return null;

    const [matchedString] = match;
    this._cursor += matchedString.length;
    return matchedString;
  }

  public isEOF(): boolean {
    return this._cursor >= this._input.length;
  }
}
