import assert = require("assert");
import { Interpreter } from "../../src/interpreter";

module.exports = (interpreter: Interpreter) => {
  assert.strictEqual(
    interpreter.evaluate(
      ["begin", ["var", "x", 10], ["write", 30, "x"]],
    ),
    undefined,
  );
};
