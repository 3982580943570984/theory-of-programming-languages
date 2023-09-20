import * as assert from "assert";
import { ExpressionParser } from "../src/parser";
import variableDeclarationList from "./variable-declaration-list";
import statementDeclarationList from "./statement-declaration-list";

const parser = new ExpressionParser();

const exec = () => {
  const program = `
VAR A, B : INTEGER;
BEGIN
  A = -(((A - B)) + ((A + B)));
  WRITE(A)
END
`;
  const ast = parser.parseExpression(program);
  console.log(JSON.stringify(ast, null, 2));
};

exec();

const test = (program: string, expected: any) => {
  const ast = parser.parseExpression(program);
  assert.deepStrictEqual(ast, expected);
};

variableDeclarationList(test);
statementDeclarationList(test);
console.log("All assertions passed");

