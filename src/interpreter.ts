const prompt = require("prompt-sync")();
import { Environment } from "./environment";

export class Interpreter {
  public globalEnv: Environment = new Environment();

  public evaluate(expression: any): void {
    const [variableList, statementList] = expression;

    this.defineVariables(variableList);
    this.executeStatements(statementList);
  }

  public defineVariables(variableList: any[]): void {
    variableList.forEach((variable) => this.globalEnv.defineVariable(variable, 0));
  }

  public executeStatements(statementList: any[]): void {
    statementList.forEach((statement) => this.executeSingleStatement(statement));
  }

  public executeSingleStatement(statement: [any, ...any[]]): void {
    const [operator, ...operands] = statement;

    if (operator === "assignment") {
      const [variable, expression] = operands;
      this.globalEnv.assignVariable(variable, this.evaluateExpression(expression));
      return;
    }

    if (operator === "read") {
      operands.forEach((variable) => {
        const value = Number(prompt());
        if (this.isNumber(value) || this.isBigInt(value)) {
          this.globalEnv.assignVariable(variable, BigInt(value));
          return;
        }
        throw `Bad input: ${value}`;
      });
      return;
    }

    if (operator === "write") {
      operands.forEach((operand: any) => console.log(this.evaluateExpression(operand).toString()));
      return;
    }

    if (operator === "for") {
      const [initializer, constraint, ...body] = operands;
      const [, variable, expression] = initializer;

      this.globalEnv.assignVariable(variable, this.evaluateExpression(expression));
      body.push(["assignment", variable, ["+", variable, 1]]);
      
      while (this.evaluateExpression(variable) < this.evaluateExpression(constraint)) {
        this.executeStatements(body);
      }
      return;
    }
  }

  public evaluateExpression(expression: any): any {
    if (this.isNumber(expression)) return BigInt(expression);
    if (this.isBigInt(expression)) return expression;
    if (this.isString(expression)) return expression.slice(1, -1);
    if (this.isVariableName(expression)) return this.globalEnv.lookupVariable(expression);

    const [operator, left, right] = expression;

    // Implementing arithmetic operations
    switch (operator) {
      case '+':
        return this.evaluateExpression(left) + this.evaluateExpression(right);
      case '-':
        return right === undefined ? -this.evaluateExpression(left) : this.evaluateExpression(left) - this.evaluateExpression(right);
      case '*':
        return this.evaluateExpression(left) * this.evaluateExpression(right);
      case '/':
        return this.evaluateExpression(left) / this.evaluateExpression(right);
      default:
        throw `Unimplemented operator: ${operator}`;
    }
  }

  public isNumber(expression: any): boolean {//{{{
    return typeof expression === "number" && !Number.isNaN(expression);
  }//}}}

  public isBigInt(expression: any): boolean {
    return typeof expression === "bigint";
  }

  public isString(expression: any) { //{{{
    return typeof expression === "string" && expression.at(0) === `"` &&
      expression.at(-1) === `"`;
  } //}}}

  public isVariableName(expression: any): boolean {//{{{
    return typeof expression === "string" && /^[a-zA-Z][a-zA-Z0-9_]*$/.test(expression);
  }//}}}
}

