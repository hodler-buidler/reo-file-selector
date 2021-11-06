import shortenStr from './shortenStr';

function shortenFileName(
  name: string,
  startSymbols = 5,
  endSymbols = 3,
  minShortenLength = 20,
): string {
  const splittedName = name.split('.');
  const mimeType = splittedName.pop() || '';
  const fileName = splittedName.join('.');

  if (name.length < minShortenLength) return name;

  const shortenedName = shortenStr(fileName, startSymbols, endSymbols);
  const shortenedMime = shortenStr(mimeType, 2, 3);

  return `${shortenedName}.${shortenedMime}`;
}

export default shortenFileName;
