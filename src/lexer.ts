const Specifications: [RegExp, string | null][] = [
  // Whitespace:
  [/^\s+/, null],

  // Symbols, delimiters
  [/^;/, ";"],
  [/^\(/, "("],
  [/^\)/, ")"],
  [/^,/, ","],
  [/^:/, ":"],

  // Keywords
  [/^\b(var|VAR)\b/, "VAR"],
  [/^\b(begin|BEGIN)\b/, "BEGIN"],
  [/^\b(end|END)\b/, "END"],
  [/^\b(integer|INTEGER)\b/, "INTEGER"],
  [/^\b(read|READ)\b/, "READ"],
  [/^\b(write|WRITE)\b/, "WRITE"],
  [/^\b(for|FOR)\b/, "FOR"],
  [/^\b(to|TO)\b/, "TO"],
  [/^\b(do|DO)\b/, "DO"],
  [/^\b(end_for|END_FOR)\b/, "END_FOR"],


  // Numbers
  [/^\d+/, "NUMBER"],

  // Identifiers
  [/^\w+/, "IDENTIFIER"],

  // Assignment operator
  [/^=/, "ASSIGNMENT_OPERATOR"],

  // Math operators: +, -, *, /
  [/^[+\-]/, "ADDITIVE_OPERATOR"],
  [/^[*\/]/, "MULTIPLICATIVE_OPERATOR"],
];

export class TokenLexer {
  private inputString = "";
  private cursorPosition = 0;

  public resetInput(input: string): void {
    this.inputString = input;
    this.cursorPosition = 0;
  }

  public fetchNextToken(): { type: string; value: string } | null {
    if (this.isEndOfFile()) return null;

    const substringFromCursor = this.inputString.slice(this.cursorPosition);
    for (const [pattern, tokenType] of Specifications) {
      const matchedValue = this.matchPattern(pattern, substringFromCursor);

      // There are no rule for a substring
      if (matchedValue === null) continue;

      // Skip tokens like whitespace etc.
      if (tokenType === null) return this.fetchNextToken();

      return { type: tokenType, value: matchedValue };
    }

    throw new SyntaxError(`Unexpected token => ${substringFromCursor[0]}`);
  }

  private isEndOfFile(): boolean {
    return this.cursorPosition >= this.inputString.length;
  }

  private matchPattern(pattern: RegExp, targetString: string): string | null {
    const matchResult = pattern.exec(targetString);
    if (matchResult === null) return null;

    const [matchedString] = matchResult;
    this.cursorPosition += matchedString.length;
    return matchedString;
  }
}
