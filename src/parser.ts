import { TokenLexer } from "./lexer";

export class ExpressionParser {
  private inputString = "";
  private tokenLexer = new TokenLexer();
  private nextToken: { type: string; value: string } | null | undefined;

  private consumeToken(expectedTokenType: string) {//{{{
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
  }//}}}

  public parseExpression(input: string) {//{{{
    this.inputString = input;
    this.tokenLexer.resetInput(this.inputString);
    this.nextToken = this.tokenLexer.fetchNextToken();
    return this.Program();
  }//}}}

  public Program() {//{{{
    return {
      type: "Program",
      body: [
        this.VariableDeclarationList(),
        this.StatementDeclarationList(),
      ],
    };
  }//}}}

  public VariableDeclarationList() {//{{{
    this.consumeToken("VAR");

    const variableList = this.VariableList();

    this.consumeToken(":");
    this.consumeToken("INTEGER");
    this.consumeToken(";");

    return {
      type: "VariableDeclarationList",
      variableList,
    };
  }//}}}

  public VariableList() {
    const variableList = [];
    do {
      variableList.push(this.VariableDeclaration());
    } while (this.nextToken.type === "," && this.consumeToken(","));
    return variableList;
  }

  public VariableDeclaration() {
    return this.Identifier();
  }

  public Identifier() {
    return {
      type: "Identifier",
      name: this.consumeToken("IDENTIFIER").value,
    };
  }

  public StatementDeclarationList() {
    this.consumeToken("BEGIN");

    const statementList = this.StatementList("END");

    this.consumeToken("END");

    return {
      type: "StatementDeclarationList",
      statementList,
    };
  }

  public StatementList(stopStatementList: string = null) {
    const statementList = [];
    do {
      statementList.push(this.StatementDeclaration());
    } while (this.nextToken.type !== stopStatementList && this.nextToken.type !== null);
    return statementList;
  }

  public StatementDeclaration() {
    switch (this.nextToken.type) {
      case "READ":
        return this.ReadStatement();

      case "FOR":
        return this.ForStatement();

      case "WRITE":
        return this.WriteStatement();

      default:
        return this.AssignmentStatement();
    }
  }

  public ReadStatement() {
    this.consumeToken("READ");
    this.consumeToken("(");
    const variableList = this.VariableList();
    this.consumeToken(")");
    return {
      type: "ReadStatement",
      variableList,
    };
  }

  public ForStatement() {
    this.consumeToken("FOR");
    const loopInitializer = this.AssignmentStatement(false);

    this.consumeToken("TO");
    const constraint = this.Expression();

    this.consumeToken("DO");
    const statementList = this.StatementList("END_FOR");

    this.consumeToken("END_FOR");

    return {
      type: "ForStatement",
      loopInitializer,
      constraint,
      statementList,
    };
  }

  public WriteStatement() {
    this.consumeToken("WRITE");
    this.consumeToken("(");
    const variableList = this.VariableList();
    this.consumeToken(")");
    return {
      type: "WriteStatement",
      variableList,
    };
  }

  public AssignmentStatement(consumeSemicolon: boolean = true) {
    const identifier = this.Identifier();
    this.consumeToken("ASSIGNMENT_OPERATOR");
    const expression = this.Expression();
    if (consumeSemicolon) {
      this.consumeToken(";");
    }
    return {
      type: "AssignmentStatement",
      identifier,
      expression,
    };
  }

  public Expression() {
    let negate = false;
    if (this.nextToken.type === "ADDITIVE_OPERATOR") {
      this.consumeToken("ADDITIVE_OPERATOR");
      negate = true;
    }

    const subexpression = this.Subexpression();

    return {
      type: "Expression",
      negate,
      subexpression,
    };
  }

  public Subexpression() {
    if (this.nextToken.type === "(") {
      this.consumeToken("(");
      const expr = this.Expression();
      this.consumeToken(")");
      return expr;
    }

    const left = this.Operand();

    if (
      ["ADDITIVE_OPERATOR", "MULTIPLICATIVE_OPERATOR"].includes(
        this.nextToken.type,
      )
    ) {
      const operator = this.BinaryOperator();
      const right = this.Subexpression();
      return {
        type: "BinaryExpression",
        left,
        operator,
        right,
      };
    }

    return left;
  }

  public Operand() {
    if (this.nextToken.type === "IDENTIFIER") {
      return this.Identifier();
    } else if (this.nextToken.type === "NUMBER") {
      return this.Constant();
    }

    throw new SyntaxError(`Unexpected token => "${this.nextToken?.value}"`);
  }

  public Constant() {
    const value = this.consumeToken("NUMBER").value;
    return {
      type: "NumberLiteral",
      value,
    };
  }

  public BinaryOperator() {
    const operator = this.consumeToken(this.nextToken.type).value;
    return operator;
  }
}
