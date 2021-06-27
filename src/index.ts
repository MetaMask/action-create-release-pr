import {
  error as logError,
  setFailed as setActionToFailed,
} from '@actions/core';
import { performUpdate } from './update';
import { getActionInputs } from './utils';

performUpdate(getActionInputs()).catch((error) => {
  logError(error?.stack || 'The error has no stack.');
  setActionToFailed(error);
});
