import { setFailed as setActionToFailed } from '@actions/core';
import { performUpdate } from './update';
import { getActionInputs } from './utils';

performUpdate(getActionInputs()).catch((error) => {
  setActionToFailed(error);
});
