// Terminal display utilities — ANSI colors + formatting

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const MAGENTA = '\x1b[35m';
const CYAN = '\x1b[36m';
const WHITE = '\x1b[37m';

const BG_RED = '\x1b[41m';
const BG_GREEN = '\x1b[42m';
const BG_YELLOW = '\x1b[43m';
const BG_BLUE = '\x1b[44m';
const BG_DARK = '\x1b[40m';

function color(text: string, code: string): string {
  return `${code}${text}${RESET}`;
}

export const clr = {
  red: (t: string) => color(t, RED),
  green: (t: string) => color(t, GREEN),
  yellow: (t: string) => color(t, YELLOW),
  blue: (t: string) => color(t, BLUE),
  magenta: (t: string) => color(t, MAGENTA),
  cyan: (t: string) => color(t, CYAN),
  white: (t: string) => color(t, WHITE),
  bold: (t: string) => color(t, BOLD),
  dim: (t: string) => color(t, DIM),
  gradient: (t: string) => {
    // Simulate gradient with red→orange→yellow
    const chars = t.split('');
    const colors = [RED, '#ff4500', YELLOW];
    return chars.map((c, i) => {
      const colorIdx = Math.min(Math.floor(i / chars.length * colors.length), colors.length - 1);
      return `${colors[colorIdx]}${c}${RESET}`;
    }).join('');
  },
};

export function printBanner() {
  console.log(`
${clr.red(BOLD)}╔══════════════════════════════════════════════════════╗${RESET}
${clr.red(BOLD)}║${RESET}  ${clr.gradient('🎯  YouTube Niche Band  v6')}         ${clr.red(BOLD)}║${RESET}
${clr.red(BOLD)}║${RESET}  ${clr.dim('Discover • Analyze • Validate • Build')}    ${clr.red(BOLD)}║${RESET}
${clr.red(BOLD)}╚══════════════════════════════════════════════════════╝${RESET}
`);
}

export function printPhaseHeader(phase: string, title: string) {
  console.log(`\n${clr.cyan('━'.repeat(56))}`);
  console.log(`${clr.cyan('┃')}  ${clr.bold(phase)}  ${clr.white(title)}`);
  console.log(`${clr.cyan('━'.repeat(56))}\n`);
}

export function printSuccess(msg: string) {
  console.log(`  ${clr.green('✅')} ${msg}`);
}

export function printInfo(msg: string) {
  console.log(`  ${clr.blue('ℹ')}  ${msg}`);
}

export function printWarning(msg: string) {
  console.log(`  ${clr.yellow('⚠')}  ${msg}`);
}

export function printError(msg: string) {
  console.log(`  ${clr.red('✖')}  ${msg}`);
}

export function printTable(headers: string[], rows: string[][]) {
  const colWidths = headers.map((h, i) => {
    const maxData = rows.reduce((max, row) => Math.max(max, (row[i] || '').length), 0);
    return Math.max(h.length, maxData) + 2;
  });

  const separator = colWidths.map((w) => '─'.repeat(w)).join('─┬─');

  const headerRow = headers.map((h, i) => h.padEnd(colWidths[i])).join(' │ ');
  console.log(`  ┌${separator}┐`);
  console.log(`  │ ${clr.bold(headerRow)} │`);
  console.log(`  ├${separator}┤`);

  for (const row of rows) {
    const dataRow = row.map((cell, i) => cell.padEnd(colWidths[i])).join(' │ ');
    console.log(`  │ ${dataRow} │`);
  }

  console.log(`  └${separator}┘`);
}

export function printDivider() {
  console.log(`\n  ${clr.dim('─'.repeat(50))}\n`);
}

export function printMetric(label: string, value: string, colorFn: (s: string) => string = clr.white) {
  console.log(`  ${clr.dim(label.padEnd(20))} ${colorFn(value)}`);
}

export function printCard(title: string, lines: string[]) {
  const width = Math.max(title.length, ...lines.map(l => l.length)) + 4;
  const border = '─'.repeat(width);
  console.log(`  ┌${border}┐`);
  console.log(`  │ ${clr.bold(title.padEnd(width - 2))} │`);
  console.log(`  ├${border}┤`);
  for (const line of lines) {
    console.log(`  │ ${line.padEnd(width - 2)} │`);
  }
  console.log(`  └${border}┘`);
}

export function printGauge(label: string, value: number, max: number = 100) {
  const barWidth = 30;
  const filled = Math.round((value / max) * barWidth);
  const empty = barWidth - filled;
  const bar = clr.green('█'.repeat(filled)) + clr.dim('░'.repeat(empty));
  const pct = Math.round((value / max) * 100);
  console.log(`  ${label.padEnd(20)} ${bar} ${pct}%`);
}

export function askQuestion(query: string): Promise<string> {
  return new Promise((resolve) => {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    readline.question(`  ${clr.cyan('?')} ${clr.bold(query)} `, (answer: string) => {
      readline.close();
      resolve(answer.trim());
    });
  });
}

export async function selectOption(
  question: string,
  options: { key: string; label: string; desc: string }[]
): Promise<string> {
  console.log(`\n  ${clr.cyan('?')} ${clr.bold(question)}\n`);
  for (const opt of options) {
    console.log(`    ${clr.red(opt.key)}) ${clr.white(opt.label)}`);
    console.log(`       ${clr.dim(opt.desc)}`);
  }
  const answer = await askQuestion(`\n  ${clr.dim('Enter choice')} (${options.map(o => o.key).join('/')}):`);
  const found = options.find((o) => o.key.toLowerCase() === answer.toLowerCase());
  return found ? found.key : options[0].key;
}

export function printReportHeader(channelName: string, date: string) {
  console.log(`\n${clr.yellow(BOLD)}╔══════════════════════════════════════════════════════╗${RESET}`);
  console.log(`${clr.yellow(BOLD)}║${RESET}  ${clr.bold('📋  NICHE ANALYSIS REPORT')}                 ${clr.yellow(BOLD)}║${RESET}`);
  console.log(`${clr.yellow(BOLD)}║${RESET}  ${clr.dim(`Channel: ${channelName}`)}                        ${clr.yellow(BOLD)}║${RESET}`);
  console.log(`${clr.yellow(BOLD)}║${RESET}  ${clr.dim(`Date: ${date}`)}                          ${clr.yellow(BOLD)}║${RESET}`);
  console.log(`${clr.yellow(BOLD)}╚══════════════════════════════════════════════════════╝${RESET}\n`);
}
