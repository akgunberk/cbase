/**
 * xml-to-json parser may return the object directly for singular xml tags
 *
 * it return an array of objects for multiple tags
 */
export function makeArray(input: Record<string, any> | any): any[] {
  if (Array.isArray(input)) return input;

  return [input];
}
