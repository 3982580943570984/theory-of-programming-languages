import assert = require("assert");
import { Interpreter } from "../../src/interpreter";

module.exports = (interpreter: Interpreter) => {
  assert.strictEqual(
    interpreter.evaluate(
      ["for", ["var", "x", 0], 10, ["begin", 
        ["write", "x"]]
      ]
    ),
    undefined,
  );
};
