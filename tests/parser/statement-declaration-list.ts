type TestFunction = (program: string, expected: any) => void;

export default (test: TestFunction) => {
  test(
    `
var a, b, c : integer;
begin
read(a)
end
`,
    {
      type: "Program",
      body: [
        {
          type: "VariableDeclarationList",
          variableList: [
            {
              type: "Identifier",
              name: "a",
            },
            {
              type: "Identifier",
              name: "b",
            },
            {
              type: "Identifier",
              name: "c",
            },
          ],
        },
        {
          type: "StatementDeclarationList",
          statementList: [
            {
              type: "ReadStatement",
              variableList: [
                {
                  type: "Identifier",
                  name: "a",
                },
              ],
            },
          ],
        },
      ],
    },
  );
};
