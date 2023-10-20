import {
  error as logError,
  setFailed as setActionToFailed,
} from '@actions/core';

import { performUpdate } from './update';
import { getActionInputs } from './utils';

performUpdate(getActionInputs()).catch((error) => {
  // istanbul ignore else
  if (error.stack) {
    logError(error.stack);
  }
  setActionToFailed(error);
});
