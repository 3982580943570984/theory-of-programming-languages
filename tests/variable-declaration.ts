type TestFunction = (program: string, expected: any) => void;

export default (test: TestFunction) => {
  test(
    `
var a, b, c : integer;
`,
    {
      type: "Program",
      body: [
        {
          type: "VariableDeclarationStatement",
          variables: [
            {
              type: "Identifier",
              value: "a",
            },
            {
              type: "Identifier",
              value: "b",
            },
            {
              type: "Identifier",
              value: "c",
            },
          ],
        },
        undefined
      ],
    },
  );
};
