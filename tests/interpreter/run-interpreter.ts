import { Interpreter } from "../../src/interpreter";

const interpreter = new Interpreter();
interpreter.evaluate(
  [
    ["A"],
    [
      ["write", ["+", 1, 1231231212312321]],
      ["read", "A"],
      ["write", "A"],
    ],
  ],
);
