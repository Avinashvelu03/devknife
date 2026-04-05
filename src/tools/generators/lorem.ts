/**
 * Lorem Ipsum text generator.
 * Zero-dependency.
 */

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'perspiciatis', 'unde',
  'omnis', 'iste', 'natus', 'error', 'voluptatem', 'accusantium', 'doloremque',
  'laudantium', 'totam', 'rem', 'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo',
  'inventore', 'veritatis', 'quasi', 'architecto', 'beatae', 'vitae', 'dicta',
  'explicabo', 'nemo', 'ipsam', 'voluptas', 'aspernatur', 'aut', 'odit',
  'fugit', 'consequuntur', 'magni', 'dolores', 'eos', 'ratione', 'sequi', 'nesciunt',
];

function randomIndex(max: number): number {
  return Math.floor(Math.random() * max);
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function word(count: number = 1): string {
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    words.push(LOREM_WORDS[randomIndex(LOREM_WORDS.length)]!);
  }
  return words.join(' ');
}

export function sentence(wordCount?: number): string {
  const count = wordCount ?? (8 + Math.floor(Math.random() * 8));
  const words = word(count);
  return capitalize(words) + '.';
}

export function paragraph(sentenceCount?: number): string {
  const count = sentenceCount ?? (4 + Math.floor(Math.random() * 4));
  const sentences: string[] = [];
  for (let i = 0; i < count; i++) {
    sentences.push(sentence());
  }
  return sentences.join(' ');
}

export function paragraphs(count: number = 1, separator: string = '\n\n'): string {
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    result.push(paragraph());
  }
  return result.join(separator);
}

export function title(wordCount?: number): string {
  const count = wordCount ?? (3 + Math.floor(Math.random() * 4));
  const words = word(count);
  return words
    .split(' ')
    .map((w) => capitalize(w))
    .join(' ');
}
