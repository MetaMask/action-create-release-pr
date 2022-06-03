import { ExecaError } from 'execa';

/**
 * Records and reports the time that a section of code takes to run.
 *
 * @param label - How to label this section of code in the output.
 * @param code - The section of code to run.
 * @returns Whatever `code` returns.
 */
export async function benchmark<T>(
  label: string,
  code: (...args: any[]) => T,
): Promise<T> {
  const then = new Date().getTime();
  const value = await code();
  const now = new Date().getTime();
  const diff = now - then;
  if (process.env.DEBUG) {
    console.log(`${label} took ${diff}ms`);
  }
  return value;
}

/**
 * `Object.keys()` is intentionally generic: it returns the keys of an object,
 * yes, but it cannot make guarantees about the contents of that object, so the
 * type of the keys is merely `string[]`. While this is technically accurate, it
 * is also unnecessary if we have an object that we own and whose contents are
 * known exactly.
 *
 * @param object - The object.
 * @returns The keys of an object, typed according to the type of the object
 * itself.
 */
export function knownKeysOf<K extends string | number | symbol, V>(
  object: Record<K, V>,
) {
  return Object.keys(object) as K[];
}

/**
 * Type guard to determine whether the given error comes from a call to `execa`.
 *
 * @param error - The possible error object.
 * @returns The boolean result.
 */
export function isExecaError(error: unknown): error is ExecaError<string> {
  return typeof error === 'object' && error !== null && 'all' in error;
}

/**
 * Type guard to check for an error object that has a `code` property.
 *
 * @param error - The possible error object.
 * @returns True or false, depending on the result of the check.
 */
export function isErrorWithCode(error: unknown): error is { code: string } {
  return typeof error === 'object' && error !== null && 'code' in error;
}

/**
 * Given a string, resets its indentation and removes leading and trailing
 * whitespace (except for a trailing newline).
 *
 * @param string - The string.
 * @returns The normalized string.
 */
export function normalizeMultilineString(string: string): string {
  const lines = string
    .replace(/^[\n\r]+/u, '')
    .replace(/[\n\r]+$/u, '')
    .split('\n');
  const indentation = lines[0].match(/^([ ]+)/u)?.[1] ?? '';
  const normalizedString = lines
    .map((line) => {
      return line.replace(new RegExp(`^${indentation}`, 'u'), '');
    })
    .join('\n')
    .trim();
  return `${normalizedString}\n`;
}

/**
 * Pauses execution for some time.
 *
 * @param duration - The number of milliseconds to pause.
 */
export async function sleepFor(duration: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, duration));
}

/**
 * Builds a changelog by filling in the first part automatically, which never
 * changes.
 *
 * @param variantContent - The part of the changelog that can change depending
 * on what is expected or what sort of changes have been made to the repo so
 * far.
 * @returns The full changelog.
 */
export function buildChangelog(variantContent: string): string {
  const invariantContent = normalizeMultilineString(`
    # Changelog
    All notable changes to this project will be documented in this file.

    The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
    and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
  `);

  return `${invariantContent}\n${normalizeMultilineString(variantContent)}`;
}
