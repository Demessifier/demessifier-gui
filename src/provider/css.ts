export type CSSStyleDeclarationSubset = {
  [K in keyof CSSStyleDeclaration]?: CSSStyleDeclaration[K];
};
