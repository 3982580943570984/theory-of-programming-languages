import { TokenLexer } from "./lexer";

export class SExpressionParser {
  private inputString = "";
  private tokenLexer = new TokenLexer();
  private nextToken: { type: string; value: string } | null | undefined;

  private consumeToken(expectedTokenType: string) { //{{{
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
  } //}}}

  public parseExpression(input: string) { //{{{
    this.inputString = input;
    this.tokenLexer.resetInput(this.inputString);
    this.nextToken = this.tokenLexer.fetchNextToken();
    return this.Program();
  } //}}}

  public Program() { //{{{
    return [
      this.VariableDeclarationList(),
      this.StatementDeclarationList(),
    ];
  } //}}}

  public VariableDeclarationList() { //{{{
    this.consumeToken("VAR");

    const variableList = this.VariableList();

    this.consumeToken(":");
    this.consumeToken("INTEGER");
    this.consumeToken(";");

    // variableList represented as array
    return variableList;
  } //}}}

  public VariableList() { //{{{
    const variableList = [];
    do {
      variableList.push(this.VariableDeclaration());
    } while (this.nextToken.type === "," && this.consumeToken(","));
    return variableList;
  } //}}}

  public VariableDeclaration() { //{{{
    return this.Identifier();
  } //}}}

  public Identifier() { //{{{
    return this.consumeToken("IDENTIFIER").value;
  } //}}}

  public StatementDeclarationList() { //{{{
    this.consumeToken("BEGIN");

    const statementList = this.StatementList("END");

    this.consumeToken("END");

    return statementList;
  } //}}}

  public StatementList(stopStatementList: string = null) { //{{{
    const statementList = [];
    do {
      statementList.push(this.StatementDeclaration());
    } while (
      this.nextToken.type !== stopStatementList && this.nextToken.type !== null
    );
    return statementList;
  } //}}}

  public StatementDeclaration() { //{{{
    switch (this.nextToken.type) {
      case "READ":
        return this.ReadStatement();

      case "FOR":
        return this.ForStatement();

      case "WRITE":
        return this.WriteStatement();

      default:
        return this.ExpressionStatement();
    }
  } //}}}

  public ReadStatement() { //{{{
    this.consumeToken("READ");
    this.consumeToken("(");
    const variableList = this.VariableList();
    this.consumeToken(")");
    return [
      "read",
      ...variableList,
    ];
  } //}}}

  public ForStatement() { //{{{
    this.consumeToken("FOR");
    const loopInitializer = this.Expression();

    this.consumeToken("TO");
    const constraint = this.Expression();

    this.consumeToken("DO");
    const statementList = this.StatementList("END_FOR");

    this.consumeToken("END_FOR");

    return [
      "for",
      loopInitializer,
      constraint,
      ...statementList,
    ];
  } //}}}

  public WriteStatement() { //{{{
    this.consumeToken("WRITE");
    this.consumeToken("(");
    const variableList = this.VariableList();
    this.consumeToken(")");
    return [
      "write",
      ...variableList,
    ];
  } //}}}

  public ExpressionStatement() { //{{{
    const expression = this.Expression();
    this.consumeToken(";");
    return expression;
  } //}}}

  public Expression() { //{{{
    return this.AssignmentExpression();
  } //}}}

  public AssignmentExpression() { //{{{
    const left = this.AdditiveExpression();

    const isAssignmentOperator = (type: string) =>
      type === "ASSIGNMENT_OPERATOR";
    if (!isAssignmentOperator(this.nextToken.type)) return left;

    const checkValidAssignmentTarget = (node: string) => { //{{{
      if (/^\w+/.test(node)) {
        return node;
      }
      throw new SyntaxError(`Invalid left-hand side in assignment expression`);
    }; //}}}

    this.consumeToken("ASSIGNMENT_OPERATOR").value;
    return [
      "assignment",
      checkValidAssignmentTarget(left),
      this.AssignmentExpression(),
    ];
  } //}}}

  public BinaryExpression(builderName: string, operatorToken: string) { //{{{
    let left: any = this[builderName]();
    while (this.nextToken.type === operatorToken) {
      const operator = this.consumeToken(operatorToken).value;
      const right = this[builderName]();
      left = [
        operator,
        left,
        right,
      ];
    }
    return left;
  } //}}}

  public AdditiveExpression() { //{{{
    return this.BinaryExpression(
      "MultiplicativeExpression",
      "ADDITIVE_OPERATOR",
    );
  } //}}}

  public MultiplicativeExpression() { //{{{
    return this.BinaryExpression("UnaryExpression", "MULTIPLICATIVE_OPERATOR");
  } //}}}

  public UnaryExpression() { //{{{
    let operator = null;

    if (this.nextToken.type === "ADDITIVE_OPERATOR") {
      operator = this.consumeToken("ADDITIVE_OPERATOR").value;
    }

    if (operator !== null) {
      return [
        operator,
        this.UnaryExpression(),
      ];
    }

    return this.PrimaryExpression();
  } //}}}

  public PrimaryExpression() { //{{{
    const isLiteral = (type: string) => type === "NUMBER" || type === "STRING";
    if (isLiteral(this.nextToken.type)) return this.Literal();

    switch (this.nextToken.type) {
      case "(":
        return this.ParenthesizedExpression();
      case "IDENTIFIER":
        return this.Identifier();
      default:
        return this.PrimaryExpression();
    }
  } //}}}

  public ParenthesizedExpression() { //{{{
    this.consumeToken("(");
    const expression = this.Expression();
    this.consumeToken(")");
    return expression;
  } //}}}

  public Literal() { //{{{
    switch (this.nextToken.type) {
      case "NUMBER":
        return this.NumericLiteral();
      case "STRING":
        return this.StringLiteral();
    }
  } //}}}

  public NumericLiteral() { //{{{
    return Number(this.consumeToken("NUMBER").value);
  } //}}}

  public StringLiteral() { //{{{
    return this.consumeToken("STRING").value;
  } //}}}
}
