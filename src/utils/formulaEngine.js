import { parseCellKey } from './cellUtils.js';

const FUNCTIONS = new Set(['SUM', 'AVERAGE', 'MIN', 'MAX', 'COUNT']);

function numeric(value) {
  if (value === '' || value === null || value === undefined) return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function expandRange(start, end) {
  const a = parseCellKey(start);
  const b = parseCellKey(end);
  if (!a || !b) return [];
  const cells = [];
  const r1 = Math.min(a.row, b.row);
  const r2 = Math.max(a.row, b.row);
  const c1 = Math.min(a.col, b.col);
  const c2 = Math.max(a.col, b.col);
  for (let r = r1; r <= r2; r += 1) {
    for (let c = c1; c <= c2; c += 1) {
      cells.push({ row: r, col: c });
    }
  }
  return cells;
}

function tokenizeExpression(input) {
  const tokens = [];
  const pattern = /\s*([A-Z]+[1-9]\d*|\d+(?:\.\d+)?|[()+\-*/])\s*/gy;
  let match;
  let consumed = 0;
  while ((match = pattern.exec(input)) !== null) {
    if (match.index !== consumed) throw new Error('Invalid formula');
    tokens.push(match[1]);
    consumed = pattern.lastIndex;
  }
  if (consumed !== input.length) throw new Error('Invalid formula');
  return tokens;
}

function toRpn(tokens) {
  const output = [];
  const operators = [];
  const precedence = { '+': 1, '-': 1, '*': 2, '/': 2 };

  tokens.forEach((token) => {
    if (/^\d/.test(token) || /^[A-Z]+[1-9]\d*$/i.test(token)) {
      output.push(token);
      return;
    }
    if (token in precedence) {
      while (
        operators.length &&
        operators.at(-1) in precedence &&
        precedence[operators.at(-1)] >= precedence[token]
      ) {
        output.push(operators.pop());
      }
      operators.push(token);
      return;
    }
    if (token === '(') {
      operators.push(token);
      return;
    }
    if (token === ')') {
      while (operators.length && operators.at(-1) !== '(') output.push(operators.pop());
      if (operators.pop() !== '(') throw new Error('Mismatched parentheses');
    }
  });

  while (operators.length) {
    const op = operators.pop();
    if (op === '(' || op === ')') throw new Error('Mismatched parentheses');
    output.push(op);
  }
  return output;
}

function evalRpn(rpn, getCellValue) {
  const stack = [];
  rpn.forEach((token) => {
    if (/^\d/.test(token)) {
      stack.push(Number(token));
    } else if (/^[A-Z]+[1-9]\d*$/i.test(token)) {
      stack.push(numeric(getCellValue(token)));
    } else {
      if (stack.length < 2) throw new Error('Invalid arithmetic');
      const right = stack.pop();
      const left = stack.pop();
      if (token === '+') stack.push(left + right);
      if (token === '-') stack.push(left - right);
      if (token === '*') stack.push(left * right);
      if (token === '/') {
        if (right === 0) throw new Error('Division by zero');
        stack.push(left / right);
      }
    }
  });
  if (stack.length !== 1) throw new Error('Invalid arithmetic');
  return stack[0];
}

export function evaluateFormula(raw, getCellValue) {
  if (typeof raw !== 'string' || !raw.startsWith('=')) return raw;
  const expression = raw.slice(1).trim();

  const fnMatch = /^([A-Z]+)\(([A-Z]+[1-9]\d*):([A-Z]+[1-9]\d*)\)$/i.exec(expression);
  if (fnMatch) {
    const fn = fnMatch[1].toUpperCase();
    if (!FUNCTIONS.has(fn)) return '#NAME?';
    const rawValues = expandRange(fnMatch[2], fnMatch[3]).map(({ row, col }) => getCellValue({ row, col }));
    const numericValues = rawValues
      .map((value) => (value === '' || value === null || value === undefined ? NaN : Number(value)))
      .filter((value) => Number.isFinite(value));
    if (fn === 'SUM') return rawValues.reduce((sum, value) => sum + numeric(value), 0);
    if (fn === 'AVERAGE') return numericValues.length ? numericValues.reduce((a, b) => a + b, 0) / numericValues.length : 0;
    if (fn === 'MIN') return numericValues.length ? Math.min(...numericValues) : 0;
    if (fn === 'MAX') return numericValues.length ? Math.max(...numericValues) : 0;
    if (fn === 'COUNT') return numericValues.length;
  }

  try {
    // Safe parser: tokenization + shunting-yard + RPN evaluation. No eval()/Function().
    return evalRpn(toRpn(tokenizeExpression(expression)), (ref) => getCellValue(ref));
  } catch {
    return '#ERROR!';
  }
}
