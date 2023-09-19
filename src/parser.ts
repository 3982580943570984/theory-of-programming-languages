import { TokenLexer } from "./lexer";

export class ExpressionParser {
  private inputString = "";
  private tokenLexer = new TokenLexer();
  private nextToken: { type: string; value: string } | null | undefined;

  private consumeToken(expectedTokenType: string) {
    const currentToken = this.nextToken;

    if (currentToken == null) {
      throw new SyntaxError(
        `Unexpected end of input, expected => "${expectedTokenType}"`,
      );
    }

    if (currentToken.type !== expectedTokenType) {
      throw new SyntaxError(
        `Unexpected token => "${currentToken.value}", expected => "${expectedTokenType}"`,
      );
    }

    this.nextToken = this.tokenLexer.fetchNextToken();

    return currentToken;
  }

  public parseExpression(input: string) {
    this.inputString = input;
    this.tokenLexer.resetInput(this.inputString);
    this.nextToken = this.tokenLexer.fetchNextToken();
    return this.Program();
  }

  public Program() {
    return {
      type: "Program",
      body: [
        this.VariableDeclarationStatement(),
        this.AssignmentDeclarationStatement(),
      ],
    };
  }

  public VariableDeclarationStatement() {
    this.consumeToken("VAR");

    const variables = [];

    do {
      variables.push(this.VariableDeclaration());
    } while (this.nextToken.type === "," && this.consumeToken(","));

    this.consumeToken(":");
    this.consumeToken("INTEGER");
    this.consumeToken(";");

    return {
      type: "VariableDeclarationStatement",
      variables,
    };
  }

  public VariableDeclaration() {
    return this.Identifier();
  }

  public Identifier() {
    return {
      type: "Identifier",
      value: this.consumeToken("IDENTIFIER").value,
    };
  }

  public AssignmentDeclarationStatement() {
  }
}
