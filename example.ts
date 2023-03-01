import ts from 'typescript';

const filename = 'test.ts';
const code = `
export default class AuthController {
    @POST({
        url: '/login',
        options: {
            schema: LoginSchema,
            bodyLimit: 1024 * 1024 * 8,
        },
    })
    async loginHandler(req: FastifyRequest<LoginSchemaType>, res: FastifyReply) {
        // TODO: user code goes here
    }
}
`;

interface DesiredData {
  className: string;
  imports: Record<string, string[]>;
  methods: Record<string, {
    reqTypeName: string;
    resTypeName: string;
    decorators: Record<string, {
      url: string;
      options: Record<string, string>;
    }>;
  }>;
}

const sourceFile = ts.createSourceFile(filename, code, ts.ScriptTarget.Latest);

function printRecursiveFrom(node: ts.Node, indentLevel: number, sourceFile: ts.SourceFile) {
    const indentation = ' '.repeat(indentLevel);
    const syntaxKind = ts.SyntaxKind[node.kind];
    const nodeText = node.getText(sourceFile);
    console.log(`${indentation}(${syntaxKind}): ${nodeText}`);

    if (ts.isMethodDeclaration(node)) {
        if (ts.isIdentifier(node.name)) {
            console.log('!!!!!!!!!!!!!!!!!!!!!!!!! i am a MethodDeclaration:', node.name.escapedText);

            node.forEachChild(child => {
                if (ts.isDecorator(child)) {
                    const callExpression = child.expression;
                    if (ts.isCallExpression(callExpression)) {
                        const decoratorName = (callExpression.expression as ts.Identifier).escapedText;
                        console.log('i have a decorator:', decoratorName);

                        if (callExpression.arguments.length === 0) {
                            console.log(
                                `TODO: pass { url: /blalba, options: {} } argument to the ${decoratorName} decorator`
                            );
                        } else if (callExpression.arguments.length === 1) {
                            const arg = callExpression.arguments[0];

                            console.log('decorators argument is:', arg, ts.SyntaxKind[arg.kind]);

                            if (ts.isObjectLiteralExpression(arg)) {
                                const existingParameterNodes = new Map<string, ts.Node>();

                                for (const param of arg.properties) {
                                    (param as any)['kindName'] = ts.SyntaxKind[param.kind];
                                    existingParameterNodes.set((param.name as any).escapedText, param);
                                }

                                console.log('existing decorators:', existingParameterNodes);
                            } else {
                                console.error('Incorrect code. The decorator must take an object as one argument.');
                            }
                        } else {
                            console.error('Incorrect code. The decorator takes exactly one argument.');
                        }
                    }
                }
            });
        }
    }

    node.forEachChild(child => printRecursiveFrom(child, indentLevel + 1, sourceFile));
}

printRecursiveFrom(sourceFile, 0, sourceFile);
