import { Rule } from "./model.js";

class Node {
    constructor(type, left = null, right = null, value = null) {
        this.type = type; // "operator" or "operand"
        this.left = left;  // Reference to left child
        this.right = right; // Reference to right child (for operators)
        this.value = value; // Value for operand nodes (e.g., comparison value)
    }
}

function parseRuleString(ruleString) {
    const operatorRegex = /AND|OR/;
    const operandRegex = /(\w+)\s*([<>=]+)\s*([\w']+)/;
    const tokens = tokenize(ruleString);
    const outputQueue = [];
    const operatorStack = [];

    tokens.forEach(token => {
        if (operandRegex.test(token)) {
            const match = operandRegex.exec(token);
            outputQueue.push(new Node("operand", null, null, {
                field: match[1],
                operator: match[2],
                value: match[3]
            }));
        } else if (operatorRegex.test(token)) {
            while (operatorStack.length > 0 && precedence(operatorStack[operatorStack.length - 1]) >= precedence(token)) {
                outputQueue.push(new Node("operator", outputQueue.pop(), outputQueue.pop(), operatorStack.pop()));
            }
            operatorStack.push(token);
        } else if (token === '(') {
            operatorStack.push(token);
        } else if (token === ')') {
            while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
                outputQueue.push(new Node("operator", outputQueue.pop(), outputQueue.pop(), operatorStack.pop()));
            }
            operatorStack.pop(); // Remove the '('
        }
    });

    while (operatorStack.length > 0) {
        outputQueue.push(new Node("operator", outputQueue.pop(), outputQueue.pop(), operatorStack.pop()));
    }

    return outputQueue[0]; // The root of the AST
}

function tokenize(ruleString) {
    const tokenRegex = /\s*([()|AND|OR]|[<>=]+|\w+\s*([<>=]+)?\s*[\w']+)\s*/g;
    const tokens = [];
    let match;

    while ((match = tokenRegex.exec(ruleString)) !== null) {
        if (match[1]) {
            tokens.push(match[1]);
        }
    }

    return tokens;
}

function precedence(operator) {
    if (operator === 'AND') return 2;
    if (operator === 'OR') return 1;
    return 0; // Base case for any other operators
}

export async function createRule(ruleString) {
    const ast = parseRuleString(ruleString);
    const rule = new Rule({ rule_string: ruleString, ast: JSON.stringify(ast) });

    const result = await rule.save();
    return { id: result._id, ast };
}

export async function getRules() {
    return await Rule.find().exec(); // Fetch all rules using Mongoose
}

export function evaluateRule(astNode, data) {
    if (astNode.type === "operand") {
        const { field, operator, value } = astNode.value;
        const dataValue = data[field];

        switch (operator) {
            case '>':
                return dataValue > value;
            case '<':
                return dataValue < value;
            case '=':
                return dataValue == value;
            default:
                throw new Error("Invalid operator");
        }
    } else if (astNode.type === "operator") {
        const leftEval = evaluateRule(astNode.left, data);
        const rightEval = evaluateRule(astNode.right, data);
        return astNode.value === "AND" ? leftEval && rightEval : leftEval || rightEval;
    }
}

export async function combineRules(ruleIds) {
    const selectedRules = await Rule.find({ _id: { $in: ruleIds } }).exec();
    const combinedAst = selectedRules.map(rule => JSON.parse(rule.ast)).reduce((acc, curr) => {
        return new Node("operator", acc, curr, "AND"); // Change to "OR" as needed
    });
    return combinedAst;
}