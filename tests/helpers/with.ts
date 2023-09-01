import fs from 'fs';
import os from 'os';
import path from 'path';
import MonorepoEnvironment, {
  MonorepoEnvironmentOptions,
} from './monorepo-environment';
import PolyrepoEnvironment, {
  PolyrepoEnvironmentOptions,
} from './polyrepo-environment';

/**
 * Ensures that a temporary directory, in which environments will be initialized
 * for these tests, exists for the duration of the given function and is removed
 * after the function is done.
 *
 * @param callback - The function to call with the temporary directory.
 * @returns Whatever the callback returns.
 */
export async function withInitializedEnvironmentsDir<T>(
  callback: (environmentsDir: string) => Promise<T>,
): Promise<T> {
  const environmentsDir = path.join(os.tmpdir(), 'action-create-release-pr');
  try {
    await fs.promises.rmdir(environmentsDir, { recursive: true });
  } catch (error) {
    if (error.code === 'ENOENT') {
      // continue
    } else {
      throw error;
    }
  }

  if (process.env.DEBUG) {
    console.log('Removed temp directory', environmentsDir);
  }
  await fs.promises.mkdir(environmentsDir, { recursive: true });
  if (process.env.DEBUG) {
    console.log('Created temp directory', environmentsDir);
  }

  return await callback(environmentsDir);
}

/**
 * Runs the given function and ensures that even if `process.env` is changed
 * during the function, it is restored afterward.
 *
 * @param callback - The function to call that presumably will change
 * `process.env`.
 * @returns Whatever the callback returns.
 */
export async function withProtectedProcessEnv<T>(callback: () => Promise<T>) {
  const originalEnv = { ...process.env };
  try {
    return await callback();
  } finally {
    Object.keys(originalEnv).forEach((key) => {
      process.env[key] = originalEnv[key];
    });
  }
}

/**
 * Builds a polyrepo project in a temporary directory, then yields the given
 * function with information about that project.
 *
 * @param options - The options with which to initialize the environment in
 * which the project will be interacted with.
 * @param callback - A function which will be called with an object that can be
 * used to interact with the project.
 * @returns Whatever the callback returns.
 */
export async function withPolyrepoProjectEnvironment<T>(
  options: Omit<PolyrepoEnvironmentOptions, 'name' | 'environmentsDir'>,
  callback: (environment: PolyrepoEnvironment) => Promise<T>,
) {
  return withProtectedProcessEnv(async () => {
    return withInitializedEnvironmentsDir(async (environmentsDir) => {
      const environment = new PolyrepoEnvironment({
        ...options,
        name: 'polyrepo',
        environmentsDir,
      });
      await environment.initialize();
      return await callback(environment);
    });
  });
}

/**
 * Builds a monorepo project in a temporary directory, then yields the given
 * function with information about that project.
 *
 * @param options - The options with which to initialize the environment in
 * which the project will be interacted with.
 * @param callback - A function which will be called with an object that can be
 * used to interact with the project.
 * @returns Whatever the callback returns.
 */
export async function withMonorepoProjectEnvironment<T>(
  options: Omit<MonorepoEnvironmentOptions, 'name' | 'environmentsDir'>,
  callback: (environment: MonorepoEnvironment) => Promise<T>,
) {
  return withProtectedProcessEnv(async () => {
    return withInitializedEnvironmentsDir(async (environmentsDir) => {
      const environment = new MonorepoEnvironment({
        ...options,
        name: 'monorepo',
        environmentsDir,
      });
      await environment.initialize();
      return await callback(environment);
    });
  });
}
