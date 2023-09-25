import { SExpressionParser } from "../../src/sexp-parser";

const parser = new SExpressionParser();

const exec = () => {
  const program = `
VAR A, B : INTEGER;
BEGIN
  A = -(((A - B)) + ((A + B)));
  WRITE(A)
  READ(B,B,B,B)
for i = 0 to 10 do
  write(a)
  read(a)
  for j = 0 to 20 do
    write(j)
    read(j)
  end_for
end_for
END
`;
  // const program = `var a : integer; begin write(a) end`
  const ast = parser.parseExpression(program);
  console.log(JSON.stringify(ast, null, 2));
};

exec();
