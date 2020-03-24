const schema = [
  {
    enum: ['always', 'never'],
    type: 'string',
  },
];

const meta = {
  fixable: 'code',
};

const create = (context) => {
  const always = (context.options[0] || 'always') === 'always';
  const sourceCode = context.getSourceCode();

  return {
    ObjectTypeAnnotation (node) {
      const {exact, indexers} = node;

      if (node.parent.type !== 'InterfaceDeclaration' && always && !exact && indexers.length === 0) {
        context.report({
          fix: (fixer) => {
            return [
              fixer.replaceText(sourceCode.getFirstToken(node), '{|'),
              fixer.replaceText(sourceCode.getLastToken(node), '|}'),
            ];
          },
          message: 'Object type must be exact.',
          node,
        });
      }

      if (!always && exact) {
        context.report({
          fix: (fixer) => {
            return [
              fixer.replaceText(sourceCode.getFirstToken(node), '{'),
              fixer.replaceText(sourceCode.getLastToken(node), '}'),
            ];
          },
          message: 'Object type must not be exact.',
          node,
        });
      }
    },
  };
};

export default {
  create,
  meta,
  schema,
};
