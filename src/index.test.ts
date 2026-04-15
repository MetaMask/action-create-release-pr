import * as actionsCore from '@actions/core';
import { describe, expect, it, vi } from 'vitest';

import * as actionModule from './update.js';
import * as utils from './utils.js';

vi.mock('@actions/core', () => {
  return {
    error: vi.fn(),
    setFailed: vi.fn(),
  };
});

vi.mock(import('./update.js'), () => {
  return {
    performUpdate: vi.fn(),
  };
});

vi.mock(import('./utils.js'), () => {
  return {
    getActionInputs: vi.fn(),
  };
});

describe('main entry file', () => {
  it('calls performUpdate and catches thrown errors', async () => {
    const getActionInputsMock = vi
      .spyOn(utils, 'getActionInputs')
      .mockImplementationOnce(() => {
        return { ReleaseType: null, ReleaseVersion: '1.0.0' };
      });
    const performUpdateMock = vi
      .spyOn(actionModule, 'performUpdate')
      .mockImplementationOnce(async () => {
        throw new Error('error');
      });
    const logErrorMock = vi.spyOn(actionsCore, 'error');
    const setFailedMock = vi.spyOn(actionsCore, 'setFailed');

    await import('./index.js');
    await new Promise<void>((resolve) => {
      setImmediate(() => {
        expect(getActionInputsMock).toHaveBeenCalledTimes(1);
        expect(performUpdateMock).toHaveBeenCalledTimes(1);
        expect(logErrorMock).toHaveBeenCalledTimes(1);
        expect(setFailedMock).toHaveBeenCalledTimes(1);
        expect(setFailedMock).toHaveBeenCalledWith(new Error('error'));
        resolve();
      });
    });
  });
});
