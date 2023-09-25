export class Environment {
  public variableMap: Record<string, any> = {};

  public defineVariable(variableName: string, value: any): any {
    this.variableMap[variableName] = value;
    return value;
  }

  public assignVariable(variableName: string, value: any): any {
    this.resolveVariableScope(variableName).variableMap[variableName] = value;
    return value;
  }

  public lookupVariable(variableName: string): any {
    return this.resolveVariableScope(variableName).variableMap[variableName];
  }

  private resolveVariableScope(variableName: string): Environment {
    if (this.variableMap.hasOwnProperty(variableName)) {
      return this;
    }
    throw new ReferenceError(`Variable ${variableName} is not defined`);
  }
}

