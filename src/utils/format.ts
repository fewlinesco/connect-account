export function capitalizeFirstLetter(word: string): string {
  const normalizedWord = word.toLocaleLowerCase();
  return normalizedWord.charAt(0).toLocaleUpperCase() + normalizedWord.slice(1);
}
