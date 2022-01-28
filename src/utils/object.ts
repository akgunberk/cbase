function pickXmlContent(obj: Record<string, any>, keys: string[]) {
  const pickedObject: Record<string, any> = {};

  for (const key of keys) {
    if (key in obj) pickedObject[kebabToCamelCase(key)] = obj[key].text;
  }
  return pickedObject;
}

function kebabToCamelCase(word: string): string {
  return word
    .split("-")
    .map((word, index) =>
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join("");
}

export { pickXmlContent };
