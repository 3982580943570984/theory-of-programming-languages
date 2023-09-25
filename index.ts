import { SExpressionParser } from "./src/sexp-parser";
import { Interpreter } from "./src/interpreter";

const interpreter = new Interpreter();
const parser = new SExpressionParser();

// const program = `
//
// var a, b, result : integer;
// begin
//   read(b)
//   
//   result = 1;
//   
//   for a = 1 to b + 1 do
//     result = result * a;
//   end_for
//   
//   write(result)
//   
// end
//
// `;

const program = `
var n, a, b, c, i : integer;
begin
  read(n)
  
  a = 0;
  b = 1;
  
  write(a)
  write(b)
  
  for i = 3 to n do
    c = a + b;
    write(c)
    a = b;
    b = c;
  end_for
  
end
`;

const ast = parser.parseExpression(program);
console.log(ast);
interpreter.evaluate(ast);
