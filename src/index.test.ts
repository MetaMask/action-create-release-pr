import * as actionsCore from '@actions/core';
import * as actionModule from './update';
import * as utils from './utils';

jest.mock('@actions/core', () => {
  return {
    error: jest.fn(),
    setFailed: jest.fn(),
  };
});

jest.mock('./update', () => {
  return {
    performUpdate: jest.fn(),
  };
});

jest.mock('./utils', () => {
  return {
    getActionInputs: jest.fn(),
  };
});

describe('main entry file', () => {
  it('calls performUpdate and catches thrown errors', async () => {
    const getActionInputsMock = jest
      .spyOn(utils, 'getActionInputs')
      .mockImplementationOnce(() => {
        return { ReleaseType: null, ReleaseVersion: '1.0.0' };
      });
    const performUpdateMock = jest
      .spyOn(actionModule, 'performUpdate')
      .mockImplementationOnce(async () => {
        throw new Error('error');
      });
    const logErrorMock = jest.spyOn(actionsCore, 'error');
    const setFailedMock = jest.spyOn(actionsCore, 'setFailed');

    import('.');
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
