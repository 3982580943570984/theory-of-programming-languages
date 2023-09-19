import * as assert from "assert";
import { ExpressionParser } from "../src/parser";
import variableDeclaration from "./variable-declaration";

const parser = new ExpressionParser();

const exec = () => {
  const program = `
var a, b, c : integer;
`;
  const ast = parser.parseExpression(program);
  console.log(JSON.stringify(ast, null, 2));
};

exec();

const test = (program: string, expected: any) => {
  const ast = parser.parseExpression(program);
  assert.deepStrictEqual(ast, expected);
};

variableDeclaration(test);
console.log("All assertions passed");

