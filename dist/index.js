/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 7351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issue = exports.issueCommand = void 0;
const os = __importStar(__nccwpck_require__(2037));
const utils_1 = __nccwpck_require__(5278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 2186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getIDToken = exports.getState = exports.saveState = exports.group = exports.endGroup = exports.startGroup = exports.info = exports.notice = exports.warning = exports.error = exports.debug = exports.isDebug = exports.setFailed = exports.setCommandEcho = exports.setOutput = exports.getBooleanInput = exports.getMultilineInput = exports.getInput = exports.addPath = exports.setSecret = exports.exportVariable = exports.ExitCode = void 0;
const command_1 = __nccwpck_require__(7351);
const file_command_1 = __nccwpck_require__(717);
const utils_1 = __nccwpck_require__(5278);
const os = __importStar(__nccwpck_require__(2037));
const path = __importStar(__nccwpck_require__(1017));
const oidc_utils_1 = __nccwpck_require__(8041);
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('ENV', file_command_1.prepareKeyValueMessage(name, val));
    }
    command_1.issueCommand('set-env', { name }, convertedVal);
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueFileCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.
 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
 * Returns an empty string if the value is not defined.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    if (options && options.trimWhitespace === false) {
        return val;
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Gets the values of an multiline input.  Each value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string[]
 *
 */
function getMultilineInput(name, options) {
    const inputs = getInput(name, options)
        .split('\n')
        .filter(x => x !== '');
    if (options && options.trimWhitespace === false) {
        return inputs;
    }
    return inputs.map(input => input.trim());
}
exports.getMultilineInput = getMultilineInput;
/**
 * Gets the input value of the boolean type in the YAML 1.2 "core schema" specification.
 * Support boolean input list: `true | True | TRUE | false | False | FALSE` .
 * The return value is also in boolean type.
 * ref: https://yaml.org/spec/1.2/spec.html#id2804923
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   boolean
 */
function getBooleanInput(name, options) {
    const trueValue = ['true', 'True', 'TRUE'];
    const falseValue = ['false', 'False', 'FALSE'];
    const val = getInput(name, options);
    if (trueValue.includes(val))
        return true;
    if (falseValue.includes(val))
        return false;
    throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}\n` +
        `Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
}
exports.getBooleanInput = getBooleanInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    const filePath = process.env['GITHUB_OUTPUT'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('OUTPUT', file_command_1.prepareKeyValueMessage(name, value));
    }
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, utils_1.toCommandValue(value));
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function error(message, properties = {}) {
    command_1.issueCommand('error', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds a warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function warning(message, properties = {}) {
    command_1.issueCommand('warning', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Adds a notice issue
 * @param message notice issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function notice(message, properties = {}) {
    command_1.issueCommand('notice', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.notice = notice;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    const filePath = process.env['GITHUB_STATE'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('STATE', file_command_1.prepareKeyValueMessage(name, value));
    }
    command_1.issueCommand('save-state', { name }, utils_1.toCommandValue(value));
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
function getIDToken(aud) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield oidc_utils_1.OidcClient.getIDToken(aud);
    });
}
exports.getIDToken = getIDToken;
/**
 * Summary exports
 */
var summary_1 = __nccwpck_require__(1327);
Object.defineProperty(exports, "summary", ({ enumerable: true, get: function () { return summary_1.summary; } }));
/**
 * @deprecated use core.summary
 */
var summary_2 = __nccwpck_require__(1327);
Object.defineProperty(exports, "markdownSummary", ({ enumerable: true, get: function () { return summary_2.markdownSummary; } }));
/**
 * Path exports
 */
var path_utils_1 = __nccwpck_require__(2981);
Object.defineProperty(exports, "toPosixPath", ({ enumerable: true, get: function () { return path_utils_1.toPosixPath; } }));
Object.defineProperty(exports, "toWin32Path", ({ enumerable: true, get: function () { return path_utils_1.toWin32Path; } }));
Object.defineProperty(exports, "toPlatformPath", ({ enumerable: true, get: function () { return path_utils_1.toPlatformPath; } }));
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// For internal use, subject to change.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.prepareKeyValueMessage = exports.issueFileCommand = void 0;
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(7147));
const os = __importStar(__nccwpck_require__(2037));
const uuid_1 = __nccwpck_require__(5840);
const utils_1 = __nccwpck_require__(5278);
function issueFileCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueFileCommand = issueFileCommand;
function prepareKeyValueMessage(key, value) {
    const delimiter = `ghadelimiter_${uuid_1.v4()}`;
    const convertedValue = utils_1.toCommandValue(value);
    // These should realistically never happen, but just in case someone finds a
    // way to exploit uuid generation let's not allow keys or values that contain
    // the delimiter.
    if (key.includes(delimiter)) {
        throw new Error(`Unexpected input: name should not contain the delimiter "${delimiter}"`);
    }
    if (convertedValue.includes(delimiter)) {
        throw new Error(`Unexpected input: value should not contain the delimiter "${delimiter}"`);
    }
    return `${key}<<${delimiter}${os.EOL}${convertedValue}${os.EOL}${delimiter}`;
}
exports.prepareKeyValueMessage = prepareKeyValueMessage;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 8041:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OidcClient = void 0;
const http_client_1 = __nccwpck_require__(6255);
const auth_1 = __nccwpck_require__(5526);
const core_1 = __nccwpck_require__(2186);
class OidcClient {
    static createHttpClient(allowRetry = true, maxRetry = 10) {
        const requestOptions = {
            allowRetries: allowRetry,
            maxRetries: maxRetry
        };
        return new http_client_1.HttpClient('actions/oidc-client', [new auth_1.BearerCredentialHandler(OidcClient.getRequestToken())], requestOptions);
    }
    static getRequestToken() {
        const token = process.env['ACTIONS_ID_TOKEN_REQUEST_TOKEN'];
        if (!token) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable');
        }
        return token;
    }
    static getIDTokenUrl() {
        const runtimeUrl = process.env['ACTIONS_ID_TOKEN_REQUEST_URL'];
        if (!runtimeUrl) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable');
        }
        return runtimeUrl;
    }
    static getCall(id_token_url) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const httpclient = OidcClient.createHttpClient();
            const res = yield httpclient
                .getJson(id_token_url)
                .catch(error => {
                throw new Error(`Failed to get ID Token. \n 
        Error Code : ${error.statusCode}\n 
        Error Message: ${error.result.message}`);
            });
            const id_token = (_a = res.result) === null || _a === void 0 ? void 0 : _a.value;
            if (!id_token) {
                throw new Error('Response json body do not have ID Token field');
            }
            return id_token;
        });
    }
    static getIDToken(audience) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // New ID Token is requested from action service
                let id_token_url = OidcClient.getIDTokenUrl();
                if (audience) {
                    const encodedAudience = encodeURIComponent(audience);
                    id_token_url = `${id_token_url}&audience=${encodedAudience}`;
                }
                core_1.debug(`ID token url is ${id_token_url}`);
                const id_token = yield OidcClient.getCall(id_token_url);
                core_1.setSecret(id_token);
                return id_token;
            }
            catch (error) {
                throw new Error(`Error message: ${error.message}`);
            }
        });
    }
}
exports.OidcClient = OidcClient;
//# sourceMappingURL=oidc-utils.js.map

/***/ }),

/***/ 2981:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toPlatformPath = exports.toWin32Path = exports.toPosixPath = void 0;
const path = __importStar(__nccwpck_require__(1017));
/**
 * toPosixPath converts the given path to the posix form. On Windows, \\ will be
 * replaced with /.
 *
 * @param pth. Path to transform.
 * @return string Posix path.
 */
function toPosixPath(pth) {
    return pth.replace(/[\\]/g, '/');
}
exports.toPosixPath = toPosixPath;
/**
 * toWin32Path converts the given path to the win32 form. On Linux, / will be
 * replaced with \\.
 *
 * @param pth. Path to transform.
 * @return string Win32 path.
 */
function toWin32Path(pth) {
    return pth.replace(/[/]/g, '\\');
}
exports.toWin32Path = toWin32Path;
/**
 * toPlatformPath converts the given path to a platform-specific path. It does
 * this by replacing instances of / and \ with the platform-specific path
 * separator.
 *
 * @param pth The path to platformize.
 * @return string The platform-specific path.
 */
function toPlatformPath(pth) {
    return pth.replace(/[/\\]/g, path.sep);
}
exports.toPlatformPath = toPlatformPath;
//# sourceMappingURL=path-utils.js.map

/***/ }),

/***/ 1327:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.summary = exports.markdownSummary = exports.SUMMARY_DOCS_URL = exports.SUMMARY_ENV_VAR = void 0;
const os_1 = __nccwpck_require__(2037);
const fs_1 = __nccwpck_require__(7147);
const { access, appendFile, writeFile } = fs_1.promises;
exports.SUMMARY_ENV_VAR = 'GITHUB_STEP_SUMMARY';
exports.SUMMARY_DOCS_URL = 'https://docs.github.com/actions/using-workflows/workflow-commands-for-github-actions#adding-a-job-summary';
class Summary {
    constructor() {
        this._buffer = '';
    }
    /**
     * Finds the summary file path from the environment, rejects if env var is not found or file does not exist
     * Also checks r/w permissions.
     *
     * @returns step summary file path
     */
    filePath() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._filePath) {
                return this._filePath;
            }
            const pathFromEnv = process.env[exports.SUMMARY_ENV_VAR];
            if (!pathFromEnv) {
                throw new Error(`Unable to find environment variable for $${exports.SUMMARY_ENV_VAR}. Check if your runtime environment supports job summaries.`);
            }
            try {
                yield access(pathFromEnv, fs_1.constants.R_OK | fs_1.constants.W_OK);
            }
            catch (_a) {
                throw new Error(`Unable to access summary file: '${pathFromEnv}'. Check if the file has correct read/write permissions.`);
            }
            this._filePath = pathFromEnv;
            return this._filePath;
        });
    }
    /**
     * Wraps content in an HTML tag, adding any HTML attributes
     *
     * @param {string} tag HTML tag to wrap
     * @param {string | null} content content within the tag
     * @param {[attribute: string]: string} attrs key-value list of HTML attributes to add
     *
     * @returns {string} content wrapped in HTML element
     */
    wrap(tag, content, attrs = {}) {
        const htmlAttrs = Object.entries(attrs)
            .map(([key, value]) => ` ${key}="${value}"`)
            .join('');
        if (!content) {
            return `<${tag}${htmlAttrs}>`;
        }
        return `<${tag}${htmlAttrs}>${content}</${tag}>`;
    }
    /**
     * Writes text in the buffer to the summary buffer file and empties buffer. Will append by default.
     *
     * @param {SummaryWriteOptions} [options] (optional) options for write operation
     *
     * @returns {Promise<Summary>} summary instance
     */
    write(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const overwrite = !!(options === null || options === void 0 ? void 0 : options.overwrite);
            const filePath = yield this.filePath();
            const writeFunc = overwrite ? writeFile : appendFile;
            yield writeFunc(filePath, this._buffer, { encoding: 'utf8' });
            return this.emptyBuffer();
        });
    }
    /**
     * Clears the summary buffer and wipes the summary file
     *
     * @returns {Summary} summary instance
     */
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.emptyBuffer().write({ overwrite: true });
        });
    }
    /**
     * Returns the current summary buffer as a string
     *
     * @returns {string} string of summary buffer
     */
    stringify() {
        return this._buffer;
    }
    /**
     * If the summary buffer is empty
     *
     * @returns {boolen} true if the buffer is empty
     */
    isEmptyBuffer() {
        return this._buffer.length === 0;
    }
    /**
     * Resets the summary buffer without writing to summary file
     *
     * @returns {Summary} summary instance
     */
    emptyBuffer() {
        this._buffer = '';
        return this;
    }
    /**
     * Adds raw text to the summary buffer
     *
     * @param {string} text content to add
     * @param {boolean} [addEOL=false] (optional) append an EOL to the raw text (default: false)
     *
     * @returns {Summary} summary instance
     */
    addRaw(text, addEOL = false) {
        this._buffer += text;
        return addEOL ? this.addEOL() : this;
    }
    /**
     * Adds the operating system-specific end-of-line marker to the buffer
     *
     * @returns {Summary} summary instance
     */
    addEOL() {
        return this.addRaw(os_1.EOL);
    }
    /**
     * Adds an HTML codeblock to the summary buffer
     *
     * @param {string} code content to render within fenced code block
     * @param {string} lang (optional) language to syntax highlight code
     *
     * @returns {Summary} summary instance
     */
    addCodeBlock(code, lang) {
        const attrs = Object.assign({}, (lang && { lang }));
        const element = this.wrap('pre', this.wrap('code', code), attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML list to the summary buffer
     *
     * @param {string[]} items list of items to render
     * @param {boolean} [ordered=false] (optional) if the rendered list should be ordered or not (default: false)
     *
     * @returns {Summary} summary instance
     */
    addList(items, ordered = false) {
        const tag = ordered ? 'ol' : 'ul';
        const listItems = items.map(item => this.wrap('li', item)).join('');
        const element = this.wrap(tag, listItems);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML table to the summary buffer
     *
     * @param {SummaryTableCell[]} rows table rows
     *
     * @returns {Summary} summary instance
     */
    addTable(rows) {
        const tableBody = rows
            .map(row => {
            const cells = row
                .map(cell => {
                if (typeof cell === 'string') {
                    return this.wrap('td', cell);
                }
                const { header, data, colspan, rowspan } = cell;
                const tag = header ? 'th' : 'td';
                const attrs = Object.assign(Object.assign({}, (colspan && { colspan })), (rowspan && { rowspan }));
                return this.wrap(tag, data, attrs);
            })
                .join('');
            return this.wrap('tr', cells);
        })
            .join('');
        const element = this.wrap('table', tableBody);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds a collapsable HTML details element to the summary buffer
     *
     * @param {string} label text for the closed state
     * @param {string} content collapsable content
     *
     * @returns {Summary} summary instance
     */
    addDetails(label, content) {
        const element = this.wrap('details', this.wrap('summary', label) + content);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML image tag to the summary buffer
     *
     * @param {string} src path to the image you to embed
     * @param {string} alt text description of the image
     * @param {SummaryImageOptions} options (optional) addition image attributes
     *
     * @returns {Summary} summary instance
     */
    addImage(src, alt, options) {
        const { width, height } = options || {};
        const attrs = Object.assign(Object.assign({}, (width && { width })), (height && { height }));
        const element = this.wrap('img', null, Object.assign({ src, alt }, attrs));
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML section heading element
     *
     * @param {string} text heading text
     * @param {number | string} [level=1] (optional) the heading level, default: 1
     *
     * @returns {Summary} summary instance
     */
    addHeading(text, level) {
        const tag = `h${level}`;
        const allowedTag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)
            ? tag
            : 'h1';
        const element = this.wrap(allowedTag, text);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML thematic break (<hr>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addSeparator() {
        const element = this.wrap('hr', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML line break (<br>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addBreak() {
        const element = this.wrap('br', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML blockquote to the summary buffer
     *
     * @param {string} text quote text
     * @param {string} cite (optional) citation url
     *
     * @returns {Summary} summary instance
     */
    addQuote(text, cite) {
        const attrs = Object.assign({}, (cite && { cite }));
        const element = this.wrap('blockquote', text, attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML anchor tag to the summary buffer
     *
     * @param {string} text link text/content
     * @param {string} href hyperlink
     *
     * @returns {Summary} summary instance
     */
    addLink(text, href) {
        const element = this.wrap('a', text, { href });
        return this.addRaw(element).addEOL();
    }
}
const _summary = new Summary();
/**
 * @deprecated use `core.summary`
 */
exports.markdownSummary = _summary;
exports.summary = _summary;
//# sourceMappingURL=summary.js.map

/***/ }),

/***/ 5278:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toCommandProperties = exports.toCommandValue = void 0;
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
/**
 *
 * @param annotationProperties
 * @returns The command properties to send with the actual annotation command
 * See IssueCommandProperties: https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionCommandManager.cs#L646
 */
function toCommandProperties(annotationProperties) {
    if (!Object.keys(annotationProperties).length) {
        return {};
    }
    return {
        title: annotationProperties.title,
        file: annotationProperties.file,
        line: annotationProperties.startLine,
        endLine: annotationProperties.endLine,
        col: annotationProperties.startColumn,
        endColumn: annotationProperties.endColumn
    };
}
exports.toCommandProperties = toCommandProperties;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 5526:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PersonalAccessTokenCredentialHandler = exports.BearerCredentialHandler = exports.BasicCredentialHandler = void 0;
class BasicCredentialHandler {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BasicCredentialHandler = BasicCredentialHandler;
class BearerCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Bearer ${this.token}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BearerCredentialHandler = BearerCredentialHandler;
class PersonalAccessTokenCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`PAT:${this.token}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.PersonalAccessTokenCredentialHandler = PersonalAccessTokenCredentialHandler;
//# sourceMappingURL=auth.js.map

/***/ }),

/***/ 6255:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

/* eslint-disable @typescript-eslint/no-explicit-any */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HttpClient = exports.isHttps = exports.HttpClientResponse = exports.HttpClientError = exports.getProxyUrl = exports.MediaTypes = exports.Headers = exports.HttpCodes = void 0;
const http = __importStar(__nccwpck_require__(3685));
const https = __importStar(__nccwpck_require__(5687));
const pm = __importStar(__nccwpck_require__(9835));
const tunnel = __importStar(__nccwpck_require__(4294));
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    const proxyUrl = pm.getProxyUrl(new URL(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
];
const HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'HttpClientError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpClientError.prototype);
    }
}
exports.HttpClientError = HttpClientError;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                let output = Buffer.alloc(0);
                this.message.on('data', (chunk) => {
                    output = Buffer.concat([output, chunk]);
                });
                this.message.on('end', () => {
                    resolve(output.toString());
                });
            }));
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    const parsedUrl = new URL(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
        });
    }
    get(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('GET', requestUrl, null, additionalHeaders || {});
        });
    }
    del(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('DELETE', requestUrl, null, additionalHeaders || {});
        });
    }
    post(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('POST', requestUrl, data, additionalHeaders || {});
        });
    }
    patch(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PATCH', requestUrl, data, additionalHeaders || {});
        });
    }
    put(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PUT', requestUrl, data, additionalHeaders || {});
        });
    }
    head(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('HEAD', requestUrl, null, additionalHeaders || {});
        });
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(verb, requestUrl, stream, additionalHeaders);
        });
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    getJson(requestUrl, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            const res = yield this.get(requestUrl, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    postJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.post(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    putJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.put(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    patchJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.patch(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    request(verb, requestUrl, data, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._disposed) {
                throw new Error('Client has already been disposed.');
            }
            const parsedUrl = new URL(requestUrl);
            let info = this._prepareRequest(verb, parsedUrl, headers);
            // Only perform retries on reads since writes may not be idempotent.
            const maxTries = this._allowRetries && RetryableHttpVerbs.includes(verb)
                ? this._maxRetries + 1
                : 1;
            let numTries = 0;
            let response;
            do {
                response = yield this.requestRaw(info, data);
                // Check if it's an authentication challenge
                if (response &&
                    response.message &&
                    response.message.statusCode === HttpCodes.Unauthorized) {
                    let authenticationHandler;
                    for (const handler of this.handlers) {
                        if (handler.canHandleAuthentication(response)) {
                            authenticationHandler = handler;
                            break;
                        }
                    }
                    if (authenticationHandler) {
                        return authenticationHandler.handleAuthentication(this, info, data);
                    }
                    else {
                        // We have received an unauthorized response but have no handlers to handle it.
                        // Let the response return to the caller.
                        return response;
                    }
                }
                let redirectsRemaining = this._maxRedirects;
                while (response.message.statusCode &&
                    HttpRedirectCodes.includes(response.message.statusCode) &&
                    this._allowRedirects &&
                    redirectsRemaining > 0) {
                    const redirectUrl = response.message.headers['location'];
                    if (!redirectUrl) {
                        // if there's no location to redirect to, we won't
                        break;
                    }
                    const parsedRedirectUrl = new URL(redirectUrl);
                    if (parsedUrl.protocol === 'https:' &&
                        parsedUrl.protocol !== parsedRedirectUrl.protocol &&
                        !this._allowRedirectDowngrade) {
                        throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                    }
                    // we need to finish reading the response before reassigning response
                    // which will leak the open socket.
                    yield response.readBody();
                    // strip authorization header if redirected to a different hostname
                    if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                        for (const header in headers) {
                            // header names are case insensitive
                            if (header.toLowerCase() === 'authorization') {
                                delete headers[header];
                            }
                        }
                    }
                    // let's make the request with the new redirectUrl
                    info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                    response = yield this.requestRaw(info, data);
                    redirectsRemaining--;
                }
                if (!response.message.statusCode ||
                    !HttpResponseRetryCodes.includes(response.message.statusCode)) {
                    // If not a retry code, return immediately instead of retrying
                    return response;
                }
                numTries += 1;
                if (numTries < maxTries) {
                    yield response.readBody();
                    yield this._performExponentialBackoff(numTries);
                }
            } while (numTries < maxTries);
            return response;
        });
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                function callbackForResult(err, res) {
                    if (err) {
                        reject(err);
                    }
                    else if (!res) {
                        // If `err` is not passed, then `res` must be passed.
                        reject(new Error('Unknown error'));
                    }
                    else {
                        resolve(res);
                    }
                }
                this.requestRawWithCallback(info, data, callbackForResult);
            });
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        if (typeof data === 'string') {
            if (!info.options.headers) {
                info.options.headers = {};
            }
            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        function handleResult(err, res) {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        }
        const req = info.httpModule.request(info.options, (msg) => {
            const res = new HttpClientResponse(msg);
            handleResult(undefined, res);
        });
        let socket;
        req.on('socket', sock => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error(`Request timeout: ${info.options.path}`));
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err);
        });
        if (data && typeof data === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof data !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        const parsedUrl = new URL(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port
            ? parseInt(info.parsedUrl.port)
            : defaultPort;
        info.options.path =
            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers['user-agent'] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            for (const handler of this.handlers) {
                handler.prepareRequest(info.options);
            }
        }
        return info;
    }
    _mergeHeaders(headers) {
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers || {}));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        const proxyUrl = pm.getProxyUrl(parsedUrl);
        const useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        // This is `useProxy` again, but we need to check `proxyURl` directly for TypeScripts's flow analysis.
        if (proxyUrl && proxyUrl.hostname) {
            const agentOptions = {
                maxSockets,
                keepAlive: this._keepAlive,
                proxy: Object.assign(Object.assign({}, ((proxyUrl.username || proxyUrl.password) && {
                    proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`
                })), { host: proxyUrl.hostname, port: proxyUrl.port })
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, {
                rejectUnauthorized: false
            });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
            const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
            return new Promise(resolve => setTimeout(() => resolve(), ms));
        });
    }
    _processResponse(res, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const statusCode = res.message.statusCode || 0;
                const response = {
                    statusCode,
                    result: null,
                    headers: {}
                };
                // not found leads to null obj returned
                if (statusCode === HttpCodes.NotFound) {
                    resolve(response);
                }
                // get the result from the body
                function dateTimeDeserializer(key, value) {
                    if (typeof value === 'string') {
                        const a = new Date(value);
                        if (!isNaN(a.valueOf())) {
                            return a;
                        }
                    }
                    return value;
                }
                let obj;
                let contents;
                try {
                    contents = yield res.readBody();
                    if (contents && contents.length > 0) {
                        if (options && options.deserializeDates) {
                            obj = JSON.parse(contents, dateTimeDeserializer);
                        }
                        else {
                            obj = JSON.parse(contents);
                        }
                        response.result = obj;
                    }
                    response.headers = res.message.headers;
                }
                catch (err) {
                    // Invalid resource (contents not json);  leaving result obj null
                }
                // note that 3xx redirects are handled by the http layer.
                if (statusCode > 299) {
                    let msg;
                    // if exception/error in body, attempt to get better error
                    if (obj && obj.message) {
                        msg = obj.message;
                    }
                    else if (contents && contents.length > 0) {
                        // it may be the case that the exception is in the body message as string
                        msg = contents;
                    }
                    else {
                        msg = `Failed request: (${statusCode})`;
                    }
                    const err = new HttpClientError(msg, statusCode);
                    err.result = response.result;
                    reject(err);
                }
                else {
                    resolve(response);
                }
            }));
        });
    }
}
exports.HttpClient = HttpClient;
const lowercaseKeys = (obj) => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9835:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkBypass = exports.getProxyUrl = void 0;
function getProxyUrl(reqUrl) {
    const usingSsl = reqUrl.protocol === 'https:';
    if (checkBypass(reqUrl)) {
        return undefined;
    }
    const proxyVar = (() => {
        if (usingSsl) {
            return process.env['https_proxy'] || process.env['HTTPS_PROXY'];
        }
        else {
            return process.env['http_proxy'] || process.env['HTTP_PROXY'];
        }
    })();
    if (proxyVar) {
        return new URL(proxyVar);
    }
    else {
        return undefined;
    }
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    const noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    const upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (const upperNoProxyItem of noProxy
        .split(',')
        .map(x => x.trim().toUpperCase())
        .filter(x => x)) {
        if (upperReqHosts.some(x => x === upperNoProxyItem)) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;
//# sourceMappingURL=proxy.js.map

/***/ }),

/***/ 4208:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.writeJsonFile = exports.readJsonObjectFile = void 0;
const fs_1 = __nccwpck_require__(7147);
/**
 * Reads the assumed JSON file at the given path, attempts to parse it, and
 * returns the resulting object.
 *
 * Throws if failing to read or parse, or if the parsed JSON value is not a
 * plain object.
 *
 * @param paths - The path segments pointing to the JSON file. Will be passed
 * to path.join().
 * @returns The object corresponding to the parsed JSON file.
 */
async function readJsonObjectFile(path) {
    const obj = JSON.parse(await fs_1.promises.readFile(path, 'utf8'));
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
        throw new Error(`Assumed JSON file at path "${path}" parsed to a non-object value.`);
    }
    return obj;
}
exports.readJsonObjectFile = readJsonObjectFile;
/**
 * Attempts to write the given JSON-like value to the file at the given path.
 * Adds a newline to the end of the file.
 *
 * @param path - The path to write the JSON file to, including the file itself.
 * @param jsonValue - The JSON-like value to write to the file. Make sure that
 * JSON.stringify can handle it.
 */
async function writeJsonFile(path, jsonValue) {
    await fs_1.promises.writeFile(path, `${JSON.stringify(jsonValue, null, 2)}\n`);
}
exports.writeJsonFile = writeJsonFile;
//# sourceMappingURL=file-utils.js.map

/***/ }),

/***/ 1281:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__nccwpck_require__(4208), exports);
__exportStar(__nccwpck_require__(279), exports);
__exportStar(__nccwpck_require__(8609), exports);
__exportStar(__nccwpck_require__(2064), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 279:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.tabs = exports.isTruthyString = exports.getStringRecordValue = void 0;
const TWO_SPACES = '  ';
/**
 * Utility function to get the value of a key from an object known to only
 * contain string values, such as process.env.
 *
 * Trims the value before returning it, and returns the empty string for any
 * undefined values.
 *
 * @param key - The key of process.env to access.
 * @returns The trimmed string value of the process.env key. Returns an empty
 * string if the key is not set.
 */
function getStringRecordValue(key, object) {
    var _a;
    return ((_a = object[key]) === null || _a === void 0 ? void 0 : _a.trim()) || '';
}
exports.getStringRecordValue = getStringRecordValue;
/**
 * @param value - The value to test.
 * @returns Whether the value is a non-empty string.
 */
function isTruthyString(value) {
    return Boolean(value) && typeof value === 'string';
}
exports.isTruthyString = isTruthyString;
/**
 * @param numTabs - The number of tabs to return. A tab consists of two spaces.
 * @param prefix - The prefix to prepend to the returned string, if any.
 * @returns A string consisting of the prefix, if any, and the requested number
 * of tabs.
 */
function tabs(numTabs, prefix) {
    if (!Number.isInteger(numTabs) || numTabs < 1) {
        throw new Error('Expected positive integer.');
    }
    const firstTab = prefix ? `${prefix}${TWO_SPACES}` : TWO_SPACES;
    if (numTabs === 1) {
        return firstTab;
    }
    return firstTab + new Array(numTabs).join(TWO_SPACES);
}
exports.tabs = tabs;
//# sourceMappingURL=misc-utils.js.map

/***/ }),

/***/ 8609:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getWorkspaceLocations = exports.validateMonorepoPackageManifest = exports.validatePolyrepoPackageManifest = exports.validatePackageManifestName = exports.validatePackageManifestVersion = exports.getPackageManifest = exports.ManifestFieldNames = exports.ManifestDependencyFieldNames = void 0;
const path_1 = __importDefault(__nccwpck_require__(1017));
const util_1 = __nccwpck_require__(3837);
const glob_1 = __importDefault(__nccwpck_require__(1957));
const misc_utils_1 = __nccwpck_require__(279);
const file_utils_1 = __nccwpck_require__(4208);
const semver_utils_1 = __nccwpck_require__(2064);
const glob = util_1.promisify(glob_1.default);
const PACKAGE_JSON = 'package.json';
var ManifestDependencyFieldNames;
(function (ManifestDependencyFieldNames) {
    ManifestDependencyFieldNames["Production"] = "dependencies";
    ManifestDependencyFieldNames["Development"] = "devDependencies";
    ManifestDependencyFieldNames["Peer"] = "peerDependencies";
    ManifestDependencyFieldNames["Bundled"] = "bundledDependencies";
    ManifestDependencyFieldNames["Optional"] = "optionalDependencies";
})(ManifestDependencyFieldNames = exports.ManifestDependencyFieldNames || (exports.ManifestDependencyFieldNames = {}));
var ManifestFieldNames;
(function (ManifestFieldNames) {
    ManifestFieldNames["Name"] = "name";
    ManifestFieldNames["Private"] = "private";
    ManifestFieldNames["Version"] = "version";
    ManifestFieldNames["Workspaces"] = "workspaces";
})(ManifestFieldNames = exports.ManifestFieldNames || (exports.ManifestFieldNames = {}));
/**
 * Read, parse, validate, and return the object corresponding to the
 * package.json file in the given directory.
 *
 * An error is thrown if validation fails.
 *
 * @param containingDirPath - The complete path to the directory containing
 * the package.json file.
 * @returns The object corresponding to the parsed package.json file.
 */
async function getPackageManifest(containingDirPath) {
    return await file_utils_1.readJsonObjectFile(path_1.default.join(containingDirPath, PACKAGE_JSON));
}
exports.getPackageManifest = getPackageManifest;
/**
 * Type guard to ensure that the given manifest has a valid "name" field.
 *
 * @param manifest - The manifest object to validate.
 * @returns Whether the manifest has a valid "name" field.
 */
function hasValidNameField(manifest) {
    return misc_utils_1.isTruthyString(manifest[ManifestFieldNames.Name]);
}
/**
 * Type guard to ensure that the given manifest has a valid "private" field.
 *
 * @param manifest - The manifest object to validate.
 * @returns Whether the manifest has a valid "private" field.
 */
function hasValidPrivateField(manifest) {
    return manifest[ManifestFieldNames.Private] === true;
}
/**
 * Type guard to ensure that the given manifest has a valid "version" field.
 *
 * @param manifest - The manifest object to validate.
 * @returns Whether the manifest has a valid "version" field.
 */
function hasValidVersionField(manifest) {
    return semver_utils_1.isValidSemver(manifest[ManifestFieldNames.Version]);
}
/**
 * Type guard to ensure that the given manifest has a valid "worksapces" field.
 *
 * @param manifest - The manifest object to validate.
 * @returns Whether the manifest has a valid "worksapces" field.
 */
function hasValidWorkspacesField(manifest) {
    return (Array.isArray(manifest[ManifestFieldNames.Workspaces]) &&
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        manifest[ManifestFieldNames.Workspaces].length > 0);
}
/**
 * Validates the "version" field of a package manifest object, i.e. a parsed
 * "package.json" file.
 *
 * @param manifest - The manifest to validate.
 * @param manifestDirPath - The path to the directory containing the
 * manifest file relative to the root directory.
 * @returns The unmodified manifest, with the "version" field typed correctly.
 */
function validatePackageManifestVersion(manifest, manifestDirPath) {
    if (!hasValidVersionField(manifest)) {
        throw new Error(`${getManifestErrorMessagePrefix(ManifestFieldNames.Version, manifest, manifestDirPath)} is not a valid SemVer version: ${manifest[ManifestFieldNames.Version]}`);
    }
    return manifest;
}
exports.validatePackageManifestVersion = validatePackageManifestVersion;
/**
 * Validates the "name" field of a package manifest object, i.e. a parsed
 * "package.json" file.
 *
 * @param manifest - The manifest to validate.
 * @param manifestDirPath - The path to the directory containing the
 * manifest file relative to the root directory.
 * @returns The unmodified manifest, with the "name" field typed correctly.
 */
function validatePackageManifestName(manifest, manifestDirPath) {
    if (!hasValidNameField(manifest)) {
        throw new Error(`Manifest in "${manifestDirPath}" does not have a valid "${ManifestFieldNames.Name}" field.`);
    }
    return manifest;
}
exports.validatePackageManifestName = validatePackageManifestName;
/**
 * Validates the "version" and "name" fields of a package manifest object,
 * i.e. a parsed "package.json" file.
 *
 * @param manifest - The manifest to validate.
 * @param manifestDirPath - The path to the directory containing the
 * manifest file relative to the root directory.
 * @returns The unmodified manifest, with the "version" and "name" fields typed
 * correctly.
 */
function validatePolyrepoPackageManifest(manifest, manifestDirPath) {
    return validatePackageManifestName(validatePackageManifestVersion(manifest, manifestDirPath), manifestDirPath);
}
exports.validatePolyrepoPackageManifest = validatePolyrepoPackageManifest;
/**
 * Validates the "workspaces" and "private" fields of a package manifest object,
 * i.e. a parsed "package.json" file.
 *
 * Assumes that the manifest's "version" field is already validated.
 *
 * @param manifest - The manifest to validate.
 * @param manifestDirPath - The path to the directory containing the
 * manifest file relative to the root directory.
 * @returns The unmodified manifest, with the "workspaces" and "private" fields
 * typed correctly.
 */
function validateMonorepoPackageManifest(manifest, manifestDirPath) {
    if (!hasValidWorkspacesField(manifest)) {
        throw new Error(`${getManifestErrorMessagePrefix(ManifestFieldNames.Workspaces, manifest, manifestDirPath)} must be a non-empty array if present. Received: ${manifest[ManifestFieldNames.Workspaces]}`);
    }
    if (!hasValidPrivateField(manifest)) {
        throw new Error(`${getManifestErrorMessagePrefix(ManifestFieldNames.Private, manifest, manifestDirPath)} must be "true" if "${ManifestFieldNames.Workspaces}" is present. Received: ${manifest[ManifestFieldNames.Private]}`);
    }
    return manifest;
}
exports.validateMonorepoPackageManifest = validateMonorepoPackageManifest;
/**
 * Gets the prefix of an error message for a manifest file validation error.
 *
 * @param invalidField - The name of the invalid field.
 * @param manifest - The manifest object that's invalid.
 * @param manifestDirPath - The path to the directory of the manifest file
 * relative to the root directory.
 * @returns The prefix of a manifest validation error message.
 */
function getManifestErrorMessagePrefix(invalidField, manifest, manifestDirPath) {
    return `${manifest[ManifestFieldNames.Name]
        ? `"${manifest[ManifestFieldNames.Name]}" manifest "${invalidField}"`
        : `"${invalidField}" of manifest in "${manifestDirPath}"`}`;
}
/**
 * Get workspace directory locations, given the set of workspace patterns
 * specified in the `workspaces` field of the root `package.json` file.
 *
 * @param workspaces - The list of workspace patterns given in the root manifest.
 * @param rootDir - The monorepo root directory.
 * @param recursive - Whether to search recursively.
 * @returns The location of each workspace directory relative to the root directory
 */
async function getWorkspaceLocations(workspaces, rootDir, recursive = false, prefix = '') {
    const resolvedWorkspaces = await workspaces.reduce(async (promise, pattern) => {
        const array = await promise;
        const matches = (await glob(pattern, { cwd: rootDir })).map((match) => path_1.default.join(prefix, match));
        return [...array, ...matches];
    }, Promise.resolve([]));
    if (recursive) {
        // This reads all the package JSON files in each workspace, checks if they are a monorepo, and
        // recursively calls `getWorkspaceLocations` if they are.
        const resolvedSubWorkspaces = await resolvedWorkspaces.reduce(async (promise, workspacePath) => {
            const array = await promise;
            const rawManifest = await getPackageManifest(workspacePath);
            if (ManifestFieldNames.Workspaces in rawManifest) {
                const manifest = validatePackageManifestVersion(rawManifest, workspacePath);
                const monorepoManifest = validateMonorepoPackageManifest(manifest, workspacePath);
                return [
                    ...array,
                    ...(await getWorkspaceLocations(monorepoManifest[ManifestFieldNames.Workspaces], workspacePath, recursive, workspacePath)),
                ];
            }
            return array;
        }, Promise.resolve(resolvedWorkspaces));
        return resolvedSubWorkspaces;
    }
    return resolvedWorkspaces;
}
exports.getWorkspaceLocations = getWorkspaceLocations;
//# sourceMappingURL=package-utils.js.map

/***/ }),

/***/ 2064:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isMajorSemverDiff = exports.isValidSemver = exports.SemverReleaseTypes = void 0;
const parse_1 = __importDefault(__nccwpck_require__(5925));
var SemverReleaseTypes;
(function (SemverReleaseTypes) {
    SemverReleaseTypes["Major"] = "major";
    SemverReleaseTypes["Premajor"] = "premajor";
    SemverReleaseTypes["Minor"] = "minor";
    SemverReleaseTypes["Preminor"] = "preminor";
    SemverReleaseTypes["Patch"] = "patch";
    SemverReleaseTypes["Prepatch"] = "prepatch";
    SemverReleaseTypes["Prerelease"] = "prerelease";
})(SemverReleaseTypes = exports.SemverReleaseTypes || (exports.SemverReleaseTypes = {}));
/**
 * Checks whether the given value is a valid, unprefixed SemVer version string.
 * The string must begin with the numerical major version.
 *
 * (The semver package has a similar function, but it permits v-prefixes.)
 *
 * @param value - The value to check.
 * @returns Whether the given value is a valid, unprefixed SemVer version
 * string.
 */
function isValidSemver(value) {
    var _a;
    if (typeof value !== 'string') {
        return false;
    }
    return ((_a = parse_1.default(value, { loose: false })) === null || _a === void 0 ? void 0 : _a.version) === value;
}
exports.isValidSemver = isValidSemver;
/**
 * Checks whether the given SemVer diff is a major diff, i.e. "major" or
 * "premajor".
 *
 * @param diff - The SemVer diff to check.
 * @returns Whether the given SemVer diff is a major diff.
 */
function isMajorSemverDiff(diff) {
    return diff.includes(SemverReleaseTypes.Major);
}
exports.isMajorSemverDiff = isMajorSemverDiff;
//# sourceMappingURL=semver-utils.js.map

/***/ }),

/***/ 6747:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const path = __nccwpck_require__(1017);
const childProcess = __nccwpck_require__(2081);
const crossSpawn = __nccwpck_require__(7881);
const stripFinalNewline = __nccwpck_require__(8174);
const npmRunPath = __nccwpck_require__(502);
const onetime = __nccwpck_require__(9082);
const makeError = __nccwpck_require__(1771);
const normalizeStdio = __nccwpck_require__(3390);
const {spawnedKill, spawnedCancel, setupTimeout, validateTimeout, setExitHandler} = __nccwpck_require__(1509);
const {handleInput, getSpawnedResult, makeAllStream, validateInputSync} = __nccwpck_require__(7788);
const {mergePromise, getSpawnedPromise} = __nccwpck_require__(4856);
const {joinCommand, parseCommand, getEscapedCommand} = __nccwpck_require__(3516);

const DEFAULT_MAX_BUFFER = 1000 * 1000 * 100;

const getEnv = ({env: envOption, extendEnv, preferLocal, localDir, execPath}) => {
	const env = extendEnv ? {...process.env, ...envOption} : envOption;

	if (preferLocal) {
		return npmRunPath.env({env, cwd: localDir, execPath});
	}

	return env;
};

const handleArguments = (file, args, options = {}) => {
	const parsed = crossSpawn._parse(file, args, options);
	file = parsed.command;
	args = parsed.args;
	options = parsed.options;

	options = {
		maxBuffer: DEFAULT_MAX_BUFFER,
		buffer: true,
		stripFinalNewline: true,
		extendEnv: true,
		preferLocal: false,
		localDir: options.cwd || process.cwd(),
		execPath: process.execPath,
		encoding: 'utf8',
		reject: true,
		cleanup: true,
		all: false,
		windowsHide: true,
		...options
	};

	options.env = getEnv(options);

	options.stdio = normalizeStdio(options);

	if (process.platform === 'win32' && path.basename(file, '.exe') === 'cmd') {
		// #116
		args.unshift('/q');
	}

	return {file, args, options, parsed};
};

const handleOutput = (options, value, error) => {
	if (typeof value !== 'string' && !Buffer.isBuffer(value)) {
		// When `execa.sync()` errors, we normalize it to '' to mimic `execa()`
		return error === undefined ? undefined : '';
	}

	if (options.stripFinalNewline) {
		return stripFinalNewline(value);
	}

	return value;
};

const execa = (file, args, options) => {
	const parsed = handleArguments(file, args, options);
	const command = joinCommand(file, args);
	const escapedCommand = getEscapedCommand(file, args);

	validateTimeout(parsed.options);

	let spawned;
	try {
		spawned = childProcess.spawn(parsed.file, parsed.args, parsed.options);
	} catch (error) {
		// Ensure the returned error is always both a promise and a child process
		const dummySpawned = new childProcess.ChildProcess();
		const errorPromise = Promise.reject(makeError({
			error,
			stdout: '',
			stderr: '',
			all: '',
			command,
			escapedCommand,
			parsed,
			timedOut: false,
			isCanceled: false,
			killed: false
		}));
		return mergePromise(dummySpawned, errorPromise);
	}

	const spawnedPromise = getSpawnedPromise(spawned);
	const timedPromise = setupTimeout(spawned, parsed.options, spawnedPromise);
	const processDone = setExitHandler(spawned, parsed.options, timedPromise);

	const context = {isCanceled: false};

	spawned.kill = spawnedKill.bind(null, spawned.kill.bind(spawned));
	spawned.cancel = spawnedCancel.bind(null, spawned, context);

	const handlePromise = async () => {
		const [{error, exitCode, signal, timedOut}, stdoutResult, stderrResult, allResult] = await getSpawnedResult(spawned, parsed.options, processDone);
		const stdout = handleOutput(parsed.options, stdoutResult);
		const stderr = handleOutput(parsed.options, stderrResult);
		const all = handleOutput(parsed.options, allResult);

		if (error || exitCode !== 0 || signal !== null) {
			const returnedError = makeError({
				error,
				exitCode,
				signal,
				stdout,
				stderr,
				all,
				command,
				escapedCommand,
				parsed,
				timedOut,
				isCanceled: context.isCanceled,
				killed: spawned.killed
			});

			if (!parsed.options.reject) {
				return returnedError;
			}

			throw returnedError;
		}

		return {
			command,
			escapedCommand,
			exitCode: 0,
			stdout,
			stderr,
			all,
			failed: false,
			timedOut: false,
			isCanceled: false,
			killed: false
		};
	};

	const handlePromiseOnce = onetime(handlePromise);

	handleInput(spawned, parsed.options.input);

	spawned.all = makeAllStream(spawned, parsed.options);

	return mergePromise(spawned, handlePromiseOnce);
};

module.exports = execa;

module.exports.sync = (file, args, options) => {
	const parsed = handleArguments(file, args, options);
	const command = joinCommand(file, args);
	const escapedCommand = getEscapedCommand(file, args);

	validateInputSync(parsed.options);

	let result;
	try {
		result = childProcess.spawnSync(parsed.file, parsed.args, parsed.options);
	} catch (error) {
		throw makeError({
			error,
			stdout: '',
			stderr: '',
			all: '',
			command,
			escapedCommand,
			parsed,
			timedOut: false,
			isCanceled: false,
			killed: false
		});
	}

	const stdout = handleOutput(parsed.options, result.stdout, result.error);
	const stderr = handleOutput(parsed.options, result.stderr, result.error);

	if (result.error || result.status !== 0 || result.signal !== null) {
		const error = makeError({
			stdout,
			stderr,
			error: result.error,
			signal: result.signal,
			exitCode: result.status,
			command,
			escapedCommand,
			parsed,
			timedOut: result.error && result.error.code === 'ETIMEDOUT',
			isCanceled: false,
			killed: result.signal !== null
		});

		if (!parsed.options.reject) {
			return error;
		}

		throw error;
	}

	return {
		command,
		escapedCommand,
		exitCode: 0,
		stdout,
		stderr,
		failed: false,
		timedOut: false,
		isCanceled: false,
		killed: false
	};
};

module.exports.command = (command, options) => {
	const [file, ...args] = parseCommand(command);
	return execa(file, args, options);
};

module.exports.commandSync = (command, options) => {
	const [file, ...args] = parseCommand(command);
	return execa.sync(file, args, options);
};

module.exports.node = (scriptPath, args, options = {}) => {
	if (args && !Array.isArray(args) && typeof args === 'object') {
		options = args;
		args = [];
	}

	const stdio = normalizeStdio.node(options);
	const defaultExecArgv = process.execArgv.filter(arg => !arg.startsWith('--inspect'));

	const {
		nodePath = process.execPath,
		nodeOptions = defaultExecArgv
	} = options;

	return execa(
		nodePath,
		[
			...nodeOptions,
			scriptPath,
			...(Array.isArray(args) ? args : [])
		],
		{
			...options,
			stdin: undefined,
			stdout: undefined,
			stderr: undefined,
			stdio,
			shell: false
		}
	);
};


/***/ }),

/***/ 3516:
/***/ ((module) => {

"use strict";

const normalizeArgs = (file, args = []) => {
	if (!Array.isArray(args)) {
		return [file];
	}

	return [file, ...args];
};

const NO_ESCAPE_REGEXP = /^[\w.-]+$/;
const DOUBLE_QUOTES_REGEXP = /"/g;

const escapeArg = arg => {
	if (typeof arg !== 'string' || NO_ESCAPE_REGEXP.test(arg)) {
		return arg;
	}

	return `"${arg.replace(DOUBLE_QUOTES_REGEXP, '\\"')}"`;
};

const joinCommand = (file, args) => {
	return normalizeArgs(file, args).join(' ');
};

const getEscapedCommand = (file, args) => {
	return normalizeArgs(file, args).map(arg => escapeArg(arg)).join(' ');
};

const SPACES_REGEXP = / +/g;

// Handle `execa.command()`
const parseCommand = command => {
	const tokens = [];
	for (const token of command.trim().split(SPACES_REGEXP)) {
		// Allow spaces to be escaped by a backslash if not meant as a delimiter
		const previousToken = tokens[tokens.length - 1];
		if (previousToken && previousToken.endsWith('\\')) {
			// Merge previous token with current one
			tokens[tokens.length - 1] = `${previousToken.slice(0, -1)} ${token}`;
		} else {
			tokens.push(token);
		}
	}

	return tokens;
};

module.exports = {
	joinCommand,
	getEscapedCommand,
	parseCommand
};


/***/ }),

/***/ 1771:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const {signalsByName} = __nccwpck_require__(2323);

const getErrorPrefix = ({timedOut, timeout, errorCode, signal, signalDescription, exitCode, isCanceled}) => {
	if (timedOut) {
		return `timed out after ${timeout} milliseconds`;
	}

	if (isCanceled) {
		return 'was canceled';
	}

	if (errorCode !== undefined) {
		return `failed with ${errorCode}`;
	}

	if (signal !== undefined) {
		return `was killed with ${signal} (${signalDescription})`;
	}

	if (exitCode !== undefined) {
		return `failed with exit code ${exitCode}`;
	}

	return 'failed';
};

const makeError = ({
	stdout,
	stderr,
	all,
	error,
	signal,
	exitCode,
	command,
	escapedCommand,
	timedOut,
	isCanceled,
	killed,
	parsed: {options: {timeout}}
}) => {
	// `signal` and `exitCode` emitted on `spawned.on('exit')` event can be `null`.
	// We normalize them to `undefined`
	exitCode = exitCode === null ? undefined : exitCode;
	signal = signal === null ? undefined : signal;
	const signalDescription = signal === undefined ? undefined : signalsByName[signal].description;

	const errorCode = error && error.code;

	const prefix = getErrorPrefix({timedOut, timeout, errorCode, signal, signalDescription, exitCode, isCanceled});
	const execaMessage = `Command ${prefix}: ${command}`;
	const isError = Object.prototype.toString.call(error) === '[object Error]';
	const shortMessage = isError ? `${execaMessage}\n${error.message}` : execaMessage;
	const message = [shortMessage, stderr, stdout].filter(Boolean).join('\n');

	if (isError) {
		error.originalMessage = error.message;
		error.message = message;
	} else {
		error = new Error(message);
	}

	error.shortMessage = shortMessage;
	error.command = command;
	error.escapedCommand = escapedCommand;
	error.exitCode = exitCode;
	error.signal = signal;
	error.signalDescription = signalDescription;
	error.stdout = stdout;
	error.stderr = stderr;

	if (all !== undefined) {
		error.all = all;
	}

	if ('bufferedData' in error) {
		delete error.bufferedData;
	}

	error.failed = true;
	error.timedOut = Boolean(timedOut);
	error.isCanceled = isCanceled;
	error.killed = killed && !timedOut;

	return error;
};

module.exports = makeError;


/***/ }),

/***/ 1509:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const os = __nccwpck_require__(2037);
const onExit = __nccwpck_require__(4931);

const DEFAULT_FORCE_KILL_TIMEOUT = 1000 * 5;

// Monkey-patches `childProcess.kill()` to add `forceKillAfterTimeout` behavior
const spawnedKill = (kill, signal = 'SIGTERM', options = {}) => {
	const killResult = kill(signal);
	setKillTimeout(kill, signal, options, killResult);
	return killResult;
};

const setKillTimeout = (kill, signal, options, killResult) => {
	if (!shouldForceKill(signal, options, killResult)) {
		return;
	}

	const timeout = getForceKillAfterTimeout(options);
	const t = setTimeout(() => {
		kill('SIGKILL');
	}, timeout);

	// Guarded because there's no `.unref()` when `execa` is used in the renderer
	// process in Electron. This cannot be tested since we don't run tests in
	// Electron.
	// istanbul ignore else
	if (t.unref) {
		t.unref();
	}
};

const shouldForceKill = (signal, {forceKillAfterTimeout}, killResult) => {
	return isSigterm(signal) && forceKillAfterTimeout !== false && killResult;
};

const isSigterm = signal => {
	return signal === os.constants.signals.SIGTERM ||
		(typeof signal === 'string' && signal.toUpperCase() === 'SIGTERM');
};

const getForceKillAfterTimeout = ({forceKillAfterTimeout = true}) => {
	if (forceKillAfterTimeout === true) {
		return DEFAULT_FORCE_KILL_TIMEOUT;
	}

	if (!Number.isFinite(forceKillAfterTimeout) || forceKillAfterTimeout < 0) {
		throw new TypeError(`Expected the \`forceKillAfterTimeout\` option to be a non-negative integer, got \`${forceKillAfterTimeout}\` (${typeof forceKillAfterTimeout})`);
	}

	return forceKillAfterTimeout;
};

// `childProcess.cancel()`
const spawnedCancel = (spawned, context) => {
	const killResult = spawned.kill();

	if (killResult) {
		context.isCanceled = true;
	}
};

const timeoutKill = (spawned, signal, reject) => {
	spawned.kill(signal);
	reject(Object.assign(new Error('Timed out'), {timedOut: true, signal}));
};

// `timeout` option handling
const setupTimeout = (spawned, {timeout, killSignal = 'SIGTERM'}, spawnedPromise) => {
	if (timeout === 0 || timeout === undefined) {
		return spawnedPromise;
	}

	let timeoutId;
	const timeoutPromise = new Promise((resolve, reject) => {
		timeoutId = setTimeout(() => {
			timeoutKill(spawned, killSignal, reject);
		}, timeout);
	});

	const safeSpawnedPromise = spawnedPromise.finally(() => {
		clearTimeout(timeoutId);
	});

	return Promise.race([timeoutPromise, safeSpawnedPromise]);
};

const validateTimeout = ({timeout}) => {
	if (timeout !== undefined && (!Number.isFinite(timeout) || timeout < 0)) {
		throw new TypeError(`Expected the \`timeout\` option to be a non-negative integer, got \`${timeout}\` (${typeof timeout})`);
	}
};

// `cleanup` option handling
const setExitHandler = async (spawned, {cleanup, detached}, timedPromise) => {
	if (!cleanup || detached) {
		return timedPromise;
	}

	const removeExitHandler = onExit(() => {
		spawned.kill();
	});

	return timedPromise.finally(() => {
		removeExitHandler();
	});
};

module.exports = {
	spawnedKill,
	spawnedCancel,
	setupTimeout,
	validateTimeout,
	setExitHandler
};


/***/ }),

/***/ 4856:
/***/ ((module) => {

"use strict";


const nativePromisePrototype = (async () => {})().constructor.prototype;
const descriptors = ['then', 'catch', 'finally'].map(property => [
	property,
	Reflect.getOwnPropertyDescriptor(nativePromisePrototype, property)
]);

// The return value is a mixin of `childProcess` and `Promise`
const mergePromise = (spawned, promise) => {
	for (const [property, descriptor] of descriptors) {
		// Starting the main `promise` is deferred to avoid consuming streams
		const value = typeof promise === 'function' ?
			(...args) => Reflect.apply(descriptor.value, promise(), args) :
			descriptor.value.bind(promise);

		Reflect.defineProperty(spawned, property, {...descriptor, value});
	}

	return spawned;
};

// Use promises instead of `child_process` events
const getSpawnedPromise = spawned => {
	return new Promise((resolve, reject) => {
		spawned.on('exit', (exitCode, signal) => {
			resolve({exitCode, signal});
		});

		spawned.on('error', error => {
			reject(error);
		});

		if (spawned.stdin) {
			spawned.stdin.on('error', error => {
				reject(error);
			});
		}
	});
};

module.exports = {
	mergePromise,
	getSpawnedPromise
};



/***/ }),

/***/ 3390:
/***/ ((module) => {

"use strict";

const aliases = ['stdin', 'stdout', 'stderr'];

const hasAlias = options => aliases.some(alias => options[alias] !== undefined);

const normalizeStdio = options => {
	if (!options) {
		return;
	}

	const {stdio} = options;

	if (stdio === undefined) {
		return aliases.map(alias => options[alias]);
	}

	if (hasAlias(options)) {
		throw new Error(`It's not possible to provide \`stdio\` in combination with one of ${aliases.map(alias => `\`${alias}\``).join(', ')}`);
	}

	if (typeof stdio === 'string') {
		return stdio;
	}

	if (!Array.isArray(stdio)) {
		throw new TypeError(`Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof stdio}\``);
	}

	const length = Math.max(stdio.length, aliases.length);
	return Array.from({length}, (value, index) => stdio[index]);
};

module.exports = normalizeStdio;

// `ipc` is pushed unless it is already present
module.exports.node = options => {
	const stdio = normalizeStdio(options);

	if (stdio === 'ipc') {
		return 'ipc';
	}

	if (stdio === undefined || typeof stdio === 'string') {
		return [stdio, stdio, stdio, 'ipc'];
	}

	if (stdio.includes('ipc')) {
		return stdio;
	}

	return [...stdio, 'ipc'];
};


/***/ }),

/***/ 7788:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const isStream = __nccwpck_require__(1554);
const getStream = __nccwpck_require__(7816);
const mergeStream = __nccwpck_require__(2621);

// `input` option
const handleInput = (spawned, input) => {
	// Checking for stdin is workaround for https://github.com/nodejs/node/issues/26852
	// @todo remove `|| spawned.stdin === undefined` once we drop support for Node.js <=12.2.0
	if (input === undefined || spawned.stdin === undefined) {
		return;
	}

	if (isStream(input)) {
		input.pipe(spawned.stdin);
	} else {
		spawned.stdin.end(input);
	}
};

// `all` interleaves `stdout` and `stderr`
const makeAllStream = (spawned, {all}) => {
	if (!all || (!spawned.stdout && !spawned.stderr)) {
		return;
	}

	const mixed = mergeStream();

	if (spawned.stdout) {
		mixed.add(spawned.stdout);
	}

	if (spawned.stderr) {
		mixed.add(spawned.stderr);
	}

	return mixed;
};

// On failure, `result.stdout|stderr|all` should contain the currently buffered stream
const getBufferedData = async (stream, streamPromise) => {
	if (!stream) {
		return;
	}

	stream.destroy();

	try {
		return await streamPromise;
	} catch (error) {
		return error.bufferedData;
	}
};

const getStreamPromise = (stream, {encoding, buffer, maxBuffer}) => {
	if (!stream || !buffer) {
		return;
	}

	if (encoding) {
		return getStream(stream, {encoding, maxBuffer});
	}

	return getStream.buffer(stream, {maxBuffer});
};

// Retrieve result of child process: exit code, signal, error, streams (stdout/stderr/all)
const getSpawnedResult = async ({stdout, stderr, all}, {encoding, buffer, maxBuffer}, processDone) => {
	const stdoutPromise = getStreamPromise(stdout, {encoding, buffer, maxBuffer});
	const stderrPromise = getStreamPromise(stderr, {encoding, buffer, maxBuffer});
	const allPromise = getStreamPromise(all, {encoding, buffer, maxBuffer: maxBuffer * 2});

	try {
		return await Promise.all([processDone, stdoutPromise, stderrPromise, allPromise]);
	} catch (error) {
		return Promise.all([
			{error, signal: error.signal, timedOut: error.timedOut},
			getBufferedData(stdout, stdoutPromise),
			getBufferedData(stderr, stderrPromise),
			getBufferedData(all, allPromise)
		]);
	}
};

const validateInputSync = ({input}) => {
	if (isStream(input)) {
		throw new TypeError('The `input` option cannot be a stream in sync mode');
	}
};

module.exports = {
	handleInput,
	makeAllStream,
	getSpawnedResult,
	validateInputSync
};



/***/ }),

/***/ 6579:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const {PassThrough: PassThroughStream} = __nccwpck_require__(2781);

module.exports = options => {
	options = {...options};

	const {array} = options;
	let {encoding} = options;
	const isBuffer = encoding === 'buffer';
	let objectMode = false;

	if (array) {
		objectMode = !(encoding || isBuffer);
	} else {
		encoding = encoding || 'utf8';
	}

	if (isBuffer) {
		encoding = null;
	}

	const stream = new PassThroughStream({objectMode});

	if (encoding) {
		stream.setEncoding(encoding);
	}

	let length = 0;
	const chunks = [];

	stream.on('data', chunk => {
		chunks.push(chunk);

		if (objectMode) {
			length = chunks.length;
		} else {
			length += chunk.length;
		}
	});

	stream.getBufferedValue = () => {
		if (array) {
			return chunks;
		}

		return isBuffer ? Buffer.concat(chunks, length) : chunks.join('');
	};

	stream.getBufferedLength = () => length;

	return stream;
};


/***/ }),

/***/ 7816:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const {constants: BufferConstants} = __nccwpck_require__(4300);
const stream = __nccwpck_require__(2781);
const {promisify} = __nccwpck_require__(3837);
const bufferStream = __nccwpck_require__(6579);

const streamPipelinePromisified = promisify(stream.pipeline);

class MaxBufferError extends Error {
	constructor() {
		super('maxBuffer exceeded');
		this.name = 'MaxBufferError';
	}
}

async function getStream(inputStream, options) {
	if (!inputStream) {
		throw new Error('Expected a stream');
	}

	options = {
		maxBuffer: Infinity,
		...options
	};

	const {maxBuffer} = options;
	const stream = bufferStream(options);

	await new Promise((resolve, reject) => {
		const rejectPromise = error => {
			// Don't retrieve an oversized buffer.
			if (error && stream.getBufferedLength() <= BufferConstants.MAX_LENGTH) {
				error.bufferedData = stream.getBufferedValue();
			}

			reject(error);
		};

		(async () => {
			try {
				await streamPipelinePromisified(inputStream, stream);
				resolve();
			} catch (error) {
				rejectPromise(error);
			}
		})();

		stream.on('data', () => {
			if (stream.getBufferedLength() > maxBuffer) {
				rejectPromise(new MaxBufferError());
			}
		});
	});

	return stream.getBufferedValue();
}

module.exports = getStream;
module.exports.buffer = (stream, options) => getStream(stream, {...options, encoding: 'buffer'});
module.exports.array = (stream, options) => getStream(stream, {...options, array: true});
module.exports.MaxBufferError = MaxBufferError;


/***/ }),

/***/ 9127:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
Object.defineProperty(exports, "__esModule", ({value:true}));exports.SIGNALS=void 0;

const SIGNALS=[
{
name:"SIGHUP",
number:1,
action:"terminate",
description:"Terminal closed",
standard:"posix"},

{
name:"SIGINT",
number:2,
action:"terminate",
description:"User interruption with CTRL-C",
standard:"ansi"},

{
name:"SIGQUIT",
number:3,
action:"core",
description:"User interruption with CTRL-\\",
standard:"posix"},

{
name:"SIGILL",
number:4,
action:"core",
description:"Invalid machine instruction",
standard:"ansi"},

{
name:"SIGTRAP",
number:5,
action:"core",
description:"Debugger breakpoint",
standard:"posix"},

{
name:"SIGABRT",
number:6,
action:"core",
description:"Aborted",
standard:"ansi"},

{
name:"SIGIOT",
number:6,
action:"core",
description:"Aborted",
standard:"bsd"},

{
name:"SIGBUS",
number:7,
action:"core",
description:
"Bus error due to misaligned, non-existing address or paging error",
standard:"bsd"},

{
name:"SIGEMT",
number:7,
action:"terminate",
description:"Command should be emulated but is not implemented",
standard:"other"},

{
name:"SIGFPE",
number:8,
action:"core",
description:"Floating point arithmetic error",
standard:"ansi"},

{
name:"SIGKILL",
number:9,
action:"terminate",
description:"Forced termination",
standard:"posix",
forced:true},

{
name:"SIGUSR1",
number:10,
action:"terminate",
description:"Application-specific signal",
standard:"posix"},

{
name:"SIGSEGV",
number:11,
action:"core",
description:"Segmentation fault",
standard:"ansi"},

{
name:"SIGUSR2",
number:12,
action:"terminate",
description:"Application-specific signal",
standard:"posix"},

{
name:"SIGPIPE",
number:13,
action:"terminate",
description:"Broken pipe or socket",
standard:"posix"},

{
name:"SIGALRM",
number:14,
action:"terminate",
description:"Timeout or timer",
standard:"posix"},

{
name:"SIGTERM",
number:15,
action:"terminate",
description:"Termination",
standard:"ansi"},

{
name:"SIGSTKFLT",
number:16,
action:"terminate",
description:"Stack is empty or overflowed",
standard:"other"},

{
name:"SIGCHLD",
number:17,
action:"ignore",
description:"Child process terminated, paused or unpaused",
standard:"posix"},

{
name:"SIGCLD",
number:17,
action:"ignore",
description:"Child process terminated, paused or unpaused",
standard:"other"},

{
name:"SIGCONT",
number:18,
action:"unpause",
description:"Unpaused",
standard:"posix",
forced:true},

{
name:"SIGSTOP",
number:19,
action:"pause",
description:"Paused",
standard:"posix",
forced:true},

{
name:"SIGTSTP",
number:20,
action:"pause",
description:"Paused using CTRL-Z or \"suspend\"",
standard:"posix"},

{
name:"SIGTTIN",
number:21,
action:"pause",
description:"Background process cannot read terminal input",
standard:"posix"},

{
name:"SIGBREAK",
number:21,
action:"terminate",
description:"User interruption with CTRL-BREAK",
standard:"other"},

{
name:"SIGTTOU",
number:22,
action:"pause",
description:"Background process cannot write to terminal output",
standard:"posix"},

{
name:"SIGURG",
number:23,
action:"ignore",
description:"Socket received out-of-band data",
standard:"bsd"},

{
name:"SIGXCPU",
number:24,
action:"core",
description:"Process timed out",
standard:"bsd"},

{
name:"SIGXFSZ",
number:25,
action:"core",
description:"File too big",
standard:"bsd"},

{
name:"SIGVTALRM",
number:26,
action:"terminate",
description:"Timeout or timer",
standard:"bsd"},

{
name:"SIGPROF",
number:27,
action:"terminate",
description:"Timeout or timer",
standard:"bsd"},

{
name:"SIGWINCH",
number:28,
action:"ignore",
description:"Terminal window size changed",
standard:"bsd"},

{
name:"SIGIO",
number:29,
action:"terminate",
description:"I/O is available",
standard:"other"},

{
name:"SIGPOLL",
number:29,
action:"terminate",
description:"Watched event",
standard:"other"},

{
name:"SIGINFO",
number:29,
action:"ignore",
description:"Request for process information",
standard:"other"},

{
name:"SIGPWR",
number:30,
action:"terminate",
description:"Device running out of power",
standard:"systemv"},

{
name:"SIGSYS",
number:31,
action:"core",
description:"Invalid system call",
standard:"other"},

{
name:"SIGUNUSED",
number:31,
action:"terminate",
description:"Invalid system call",
standard:"other"}];exports.SIGNALS=SIGNALS;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 2323:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";
Object.defineProperty(exports, "__esModule", ({value:true}));exports.signalsByNumber=exports.signalsByName=void 0;var _os=__nccwpck_require__(2037);

var _signals=__nccwpck_require__(5537);
var _realtime=__nccwpck_require__(7250);



const getSignalsByName=function(){
const signals=(0,_signals.getSignals)();
return signals.reduce(getSignalByName,{});
};

const getSignalByName=function(
signalByNameMemo,
{name,number,description,supported,action,forced,standard})
{
return{
...signalByNameMemo,
[name]:{name,number,description,supported,action,forced,standard}};

};

const signalsByName=getSignalsByName();exports.signalsByName=signalsByName;




const getSignalsByNumber=function(){
const signals=(0,_signals.getSignals)();
const length=_realtime.SIGRTMAX+1;
const signalsA=Array.from({length},(value,number)=>
getSignalByNumber(number,signals));

return Object.assign({},...signalsA);
};

const getSignalByNumber=function(number,signals){
const signal=findSignalByNumber(number,signals);

if(signal===undefined){
return{};
}

const{name,description,supported,action,forced,standard}=signal;
return{
[number]:{
name,
number,
description,
supported,
action,
forced,
standard}};


};



const findSignalByNumber=function(number,signals){
const signal=signals.find(({name})=>_os.constants.signals[name]===number);

if(signal!==undefined){
return signal;
}

return signals.find(signalA=>signalA.number===number);
};

const signalsByNumber=getSignalsByNumber();exports.signalsByNumber=signalsByNumber;
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 7250:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
Object.defineProperty(exports, "__esModule", ({value:true}));exports.SIGRTMAX=exports.getRealtimeSignals=void 0;
const getRealtimeSignals=function(){
const length=SIGRTMAX-SIGRTMIN+1;
return Array.from({length},getRealtimeSignal);
};exports.getRealtimeSignals=getRealtimeSignals;

const getRealtimeSignal=function(value,index){
return{
name:`SIGRT${index+1}`,
number:SIGRTMIN+index,
action:"terminate",
description:"Application-specific signal (realtime)",
standard:"posix"};

};

const SIGRTMIN=34;
const SIGRTMAX=64;exports.SIGRTMAX=SIGRTMAX;
//# sourceMappingURL=realtime.js.map

/***/ }),

/***/ 5537:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";
Object.defineProperty(exports, "__esModule", ({value:true}));exports.getSignals=void 0;var _os=__nccwpck_require__(2037);

var _core=__nccwpck_require__(9127);
var _realtime=__nccwpck_require__(7250);



const getSignals=function(){
const realtimeSignals=(0,_realtime.getRealtimeSignals)();
const signals=[..._core.SIGNALS,...realtimeSignals].map(normalizeSignal);
return signals;
};exports.getSignals=getSignals;







const normalizeSignal=function({
name,
number:defaultNumber,
description,
action,
forced=false,
standard})
{
const{
signals:{[name]:constantSignal}}=
_os.constants;
const supported=constantSignal!==undefined;
const number=supported?constantSignal:defaultNumber;
return{name,number,description,supported,action,forced,standard};
};
//# sourceMappingURL=signals.js.map

/***/ }),

/***/ 334:
/***/ ((module) => {

"use strict";

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// pkg/dist-src/index.js
var dist_src_exports = {};
__export(dist_src_exports, {
  createTokenAuth: () => createTokenAuth
});
module.exports = __toCommonJS(dist_src_exports);

// pkg/dist-src/auth.js
var REGEX_IS_INSTALLATION_LEGACY = /^v1\./;
var REGEX_IS_INSTALLATION = /^ghs_/;
var REGEX_IS_USER_TO_SERVER = /^ghu_/;
async function auth(token) {
  const isApp = token.split(/\./).length === 3;
  const isInstallation = REGEX_IS_INSTALLATION_LEGACY.test(token) || REGEX_IS_INSTALLATION.test(token);
  const isUserToServer = REGEX_IS_USER_TO_SERVER.test(token);
  const tokenType = isApp ? "app" : isInstallation ? "installation" : isUserToServer ? "user-to-server" : "oauth";
  return {
    type: "token",
    token,
    tokenType
  };
}

// pkg/dist-src/with-authorization-prefix.js
function withAuthorizationPrefix(token) {
  if (token.split(/\./).length === 3) {
    return `bearer ${token}`;
  }
  return `token ${token}`;
}

// pkg/dist-src/hook.js
async function hook(token, request, route, parameters) {
  const endpoint = request.endpoint.merge(
    route,
    parameters
  );
  endpoint.headers.authorization = withAuthorizationPrefix(token);
  return request(endpoint);
}

// pkg/dist-src/index.js
var createTokenAuth = function createTokenAuth2(token) {
  if (!token) {
    throw new Error("[@octokit/auth-token] No token passed to createTokenAuth");
  }
  if (typeof token !== "string") {
    throw new Error(
      "[@octokit/auth-token] Token passed to createTokenAuth is not a string"
    );
  }
  token = token.replace(/^(token|bearer) +/i, "");
  return Object.assign(auth.bind(null, token), {
    hook: hook.bind(null, token)
  });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (0);


/***/ }),

/***/ 6762:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// pkg/dist-src/index.js
var index_exports = {};
__export(index_exports, {
  Octokit: () => Octokit
});
module.exports = __toCommonJS(index_exports);
var import_universal_user_agent = __nccwpck_require__(5030);
var import_before_after_hook = __nccwpck_require__(3682);
var import_request = __nccwpck_require__(6234);
var import_graphql = __nccwpck_require__(8467);
var import_auth_token = __nccwpck_require__(334);

// pkg/dist-src/version.js
var VERSION = "5.2.2";

// pkg/dist-src/index.js
var noop = () => {
};
var consoleWarn = console.warn.bind(console);
var consoleError = console.error.bind(console);
function createLogger(logger = {}) {
  if (typeof logger.debug !== "function") {
    logger.debug = noop;
  }
  if (typeof logger.info !== "function") {
    logger.info = noop;
  }
  if (typeof logger.warn !== "function") {
    logger.warn = consoleWarn;
  }
  if (typeof logger.error !== "function") {
    logger.error = consoleError;
  }
  return logger;
}
var userAgentTrail = `octokit-core.js/${VERSION} ${(0, import_universal_user_agent.getUserAgent)()}`;
var Octokit = class {
  static {
    this.VERSION = VERSION;
  }
  static defaults(defaults) {
    const OctokitWithDefaults = class extends this {
      constructor(...args) {
        const options = args[0] || {};
        if (typeof defaults === "function") {
          super(defaults(options));
          return;
        }
        super(
          Object.assign(
            {},
            defaults,
            options,
            options.userAgent && defaults.userAgent ? {
              userAgent: `${options.userAgent} ${defaults.userAgent}`
            } : null
          )
        );
      }
    };
    return OctokitWithDefaults;
  }
  static {
    this.plugins = [];
  }
  /**
   * Attach a plugin (or many) to your Octokit instance.
   *
   * @example
   * const API = Octokit.plugin(plugin1, plugin2, plugin3, ...)
   */
  static plugin(...newPlugins) {
    const currentPlugins = this.plugins;
    const NewOctokit = class extends this {
      static {
        this.plugins = currentPlugins.concat(
          newPlugins.filter((plugin) => !currentPlugins.includes(plugin))
        );
      }
    };
    return NewOctokit;
  }
  constructor(options = {}) {
    const hook = new import_before_after_hook.Collection();
    const requestDefaults = {
      baseUrl: import_request.request.endpoint.DEFAULTS.baseUrl,
      headers: {},
      request: Object.assign({}, options.request, {
        // @ts-ignore internal usage only, no need to type
        hook: hook.bind(null, "request")
      }),
      mediaType: {
        previews: [],
        format: ""
      }
    };
    requestDefaults.headers["user-agent"] = options.userAgent ? `${options.userAgent} ${userAgentTrail}` : userAgentTrail;
    if (options.baseUrl) {
      requestDefaults.baseUrl = options.baseUrl;
    }
    if (options.previews) {
      requestDefaults.mediaType.previews = options.previews;
    }
    if (options.timeZone) {
      requestDefaults.headers["time-zone"] = options.timeZone;
    }
    this.request = import_request.request.defaults(requestDefaults);
    this.graphql = (0, import_graphql.withCustomRequest)(this.request).defaults(requestDefaults);
    this.log = createLogger(options.log);
    this.hook = hook;
    if (!options.authStrategy) {
      if (!options.auth) {
        this.auth = async () => ({
          type: "unauthenticated"
        });
      } else {
        const auth = (0, import_auth_token.createTokenAuth)(options.auth);
        hook.wrap("request", auth.hook);
        this.auth = auth;
      }
    } else {
      const { authStrategy, ...otherOptions } = options;
      const auth = authStrategy(
        Object.assign(
          {
            request: this.request,
            log: this.log,
            // we pass the current octokit instance as well as its constructor options
            // to allow for authentication strategies that return a new octokit instance
            // that shares the same internal state as the current one. The original
            // requirement for this was the "event-octokit" authentication strategy
            // of https://github.com/probot/octokit-auth-probot.
            octokit: this,
            octokitOptions: otherOptions
          },
          options.auth
        )
      );
      hook.wrap("request", auth.hook);
      this.auth = auth;
    }
    const classConstructor = this.constructor;
    for (let i = 0; i < classConstructor.plugins.length; ++i) {
      Object.assign(this, classConstructor.plugins[i](this, options));
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (0);


/***/ }),

/***/ 9440:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// pkg/dist-src/index.js
var dist_src_exports = {};
__export(dist_src_exports, {
  endpoint: () => endpoint
});
module.exports = __toCommonJS(dist_src_exports);

// pkg/dist-src/defaults.js
var import_universal_user_agent = __nccwpck_require__(5030);

// pkg/dist-src/version.js
var VERSION = "9.0.6";

// pkg/dist-src/defaults.js
var userAgent = `octokit-endpoint.js/${VERSION} ${(0, import_universal_user_agent.getUserAgent)()}`;
var DEFAULTS = {
  method: "GET",
  baseUrl: "https://api.github.com",
  headers: {
    accept: "application/vnd.github.v3+json",
    "user-agent": userAgent
  },
  mediaType: {
    format: ""
  }
};

// pkg/dist-src/util/lowercase-keys.js
function lowercaseKeys(object) {
  if (!object) {
    return {};
  }
  return Object.keys(object).reduce((newObj, key) => {
    newObj[key.toLowerCase()] = object[key];
    return newObj;
  }, {});
}

// pkg/dist-src/util/is-plain-object.js
function isPlainObject(value) {
  if (typeof value !== "object" || value === null)
    return false;
  if (Object.prototype.toString.call(value) !== "[object Object]")
    return false;
  const proto = Object.getPrototypeOf(value);
  if (proto === null)
    return true;
  const Ctor = Object.prototype.hasOwnProperty.call(proto, "constructor") && proto.constructor;
  return typeof Ctor === "function" && Ctor instanceof Ctor && Function.prototype.call(Ctor) === Function.prototype.call(value);
}

// pkg/dist-src/util/merge-deep.js
function mergeDeep(defaults, options) {
  const result = Object.assign({}, defaults);
  Object.keys(options).forEach((key) => {
    if (isPlainObject(options[key])) {
      if (!(key in defaults))
        Object.assign(result, { [key]: options[key] });
      else
        result[key] = mergeDeep(defaults[key], options[key]);
    } else {
      Object.assign(result, { [key]: options[key] });
    }
  });
  return result;
}

// pkg/dist-src/util/remove-undefined-properties.js
function removeUndefinedProperties(obj) {
  for (const key in obj) {
    if (obj[key] === void 0) {
      delete obj[key];
    }
  }
  return obj;
}

// pkg/dist-src/merge.js
function merge(defaults, route, options) {
  if (typeof route === "string") {
    let [method, url] = route.split(" ");
    options = Object.assign(url ? { method, url } : { url: method }, options);
  } else {
    options = Object.assign({}, route);
  }
  options.headers = lowercaseKeys(options.headers);
  removeUndefinedProperties(options);
  removeUndefinedProperties(options.headers);
  const mergedOptions = mergeDeep(defaults || {}, options);
  if (options.url === "/graphql") {
    if (defaults && defaults.mediaType.previews?.length) {
      mergedOptions.mediaType.previews = defaults.mediaType.previews.filter(
        (preview) => !mergedOptions.mediaType.previews.includes(preview)
      ).concat(mergedOptions.mediaType.previews);
    }
    mergedOptions.mediaType.previews = (mergedOptions.mediaType.previews || []).map((preview) => preview.replace(/-preview/, ""));
  }
  return mergedOptions;
}

// pkg/dist-src/util/add-query-parameters.js
function addQueryParameters(url, parameters) {
  const separator = /\?/.test(url) ? "&" : "?";
  const names = Object.keys(parameters);
  if (names.length === 0) {
    return url;
  }
  return url + separator + names.map((name) => {
    if (name === "q") {
      return "q=" + parameters.q.split("+").map(encodeURIComponent).join("+");
    }
    return `${name}=${encodeURIComponent(parameters[name])}`;
  }).join("&");
}

// pkg/dist-src/util/extract-url-variable-names.js
var urlVariableRegex = /\{[^{}}]+\}/g;
function removeNonChars(variableName) {
  return variableName.replace(/(?:^\W+)|(?:(?<!\W)\W+$)/g, "").split(/,/);
}
function extractUrlVariableNames(url) {
  const matches = url.match(urlVariableRegex);
  if (!matches) {
    return [];
  }
  return matches.map(removeNonChars).reduce((a, b) => a.concat(b), []);
}

// pkg/dist-src/util/omit.js
function omit(object, keysToOmit) {
  const result = { __proto__: null };
  for (const key of Object.keys(object)) {
    if (keysToOmit.indexOf(key) === -1) {
      result[key] = object[key];
    }
  }
  return result;
}

// pkg/dist-src/util/url-template.js
function encodeReserved(str) {
  return str.split(/(%[0-9A-Fa-f]{2})/g).map(function(part) {
    if (!/%[0-9A-Fa-f]/.test(part)) {
      part = encodeURI(part).replace(/%5B/g, "[").replace(/%5D/g, "]");
    }
    return part;
  }).join("");
}
function encodeUnreserved(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
    return "%" + c.charCodeAt(0).toString(16).toUpperCase();
  });
}
function encodeValue(operator, value, key) {
  value = operator === "+" || operator === "#" ? encodeReserved(value) : encodeUnreserved(value);
  if (key) {
    return encodeUnreserved(key) + "=" + value;
  } else {
    return value;
  }
}
function isDefined(value) {
  return value !== void 0 && value !== null;
}
function isKeyOperator(operator) {
  return operator === ";" || operator === "&" || operator === "?";
}
function getValues(context, operator, key, modifier) {
  var value = context[key], result = [];
  if (isDefined(value) && value !== "") {
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      value = value.toString();
      if (modifier && modifier !== "*") {
        value = value.substring(0, parseInt(modifier, 10));
      }
      result.push(
        encodeValue(operator, value, isKeyOperator(operator) ? key : "")
      );
    } else {
      if (modifier === "*") {
        if (Array.isArray(value)) {
          value.filter(isDefined).forEach(function(value2) {
            result.push(
              encodeValue(operator, value2, isKeyOperator(operator) ? key : "")
            );
          });
        } else {
          Object.keys(value).forEach(function(k) {
            if (isDefined(value[k])) {
              result.push(encodeValue(operator, value[k], k));
            }
          });
        }
      } else {
        const tmp = [];
        if (Array.isArray(value)) {
          value.filter(isDefined).forEach(function(value2) {
            tmp.push(encodeValue(operator, value2));
          });
        } else {
          Object.keys(value).forEach(function(k) {
            if (isDefined(value[k])) {
              tmp.push(encodeUnreserved(k));
              tmp.push(encodeValue(operator, value[k].toString()));
            }
          });
        }
        if (isKeyOperator(operator)) {
          result.push(encodeUnreserved(key) + "=" + tmp.join(","));
        } else if (tmp.length !== 0) {
          result.push(tmp.join(","));
        }
      }
    }
  } else {
    if (operator === ";") {
      if (isDefined(value)) {
        result.push(encodeUnreserved(key));
      }
    } else if (value === "" && (operator === "&" || operator === "?")) {
      result.push(encodeUnreserved(key) + "=");
    } else if (value === "") {
      result.push("");
    }
  }
  return result;
}
function parseUrl(template) {
  return {
    expand: expand.bind(null, template)
  };
}
function expand(template, context) {
  var operators = ["+", "#", ".", "/", ";", "?", "&"];
  template = template.replace(
    /\{([^\{\}]+)\}|([^\{\}]+)/g,
    function(_, expression, literal) {
      if (expression) {
        let operator = "";
        const values = [];
        if (operators.indexOf(expression.charAt(0)) !== -1) {
          operator = expression.charAt(0);
          expression = expression.substr(1);
        }
        expression.split(/,/g).forEach(function(variable) {
          var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
          values.push(getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
        });
        if (operator && operator !== "+") {
          var separator = ",";
          if (operator === "?") {
            separator = "&";
          } else if (operator !== "#") {
            separator = operator;
          }
          return (values.length !== 0 ? operator : "") + values.join(separator);
        } else {
          return values.join(",");
        }
      } else {
        return encodeReserved(literal);
      }
    }
  );
  if (template === "/") {
    return template;
  } else {
    return template.replace(/\/$/, "");
  }
}

// pkg/dist-src/parse.js
function parse(options) {
  let method = options.method.toUpperCase();
  let url = (options.url || "/").replace(/:([a-z]\w+)/g, "{$1}");
  let headers = Object.assign({}, options.headers);
  let body;
  let parameters = omit(options, [
    "method",
    "baseUrl",
    "url",
    "headers",
    "request",
    "mediaType"
  ]);
  const urlVariableNames = extractUrlVariableNames(url);
  url = parseUrl(url).expand(parameters);
  if (!/^http/.test(url)) {
    url = options.baseUrl + url;
  }
  const omittedParameters = Object.keys(options).filter((option) => urlVariableNames.includes(option)).concat("baseUrl");
  const remainingParameters = omit(parameters, omittedParameters);
  const isBinaryRequest = /application\/octet-stream/i.test(headers.accept);
  if (!isBinaryRequest) {
    if (options.mediaType.format) {
      headers.accept = headers.accept.split(/,/).map(
        (format) => format.replace(
          /application\/vnd(\.\w+)(\.v3)?(\.\w+)?(\+json)?$/,
          `application/vnd$1$2.${options.mediaType.format}`
        )
      ).join(",");
    }
    if (url.endsWith("/graphql")) {
      if (options.mediaType.previews?.length) {
        const previewsFromAcceptHeader = headers.accept.match(/(?<![\w-])[\w-]+(?=-preview)/g) || [];
        headers.accept = previewsFromAcceptHeader.concat(options.mediaType.previews).map((preview) => {
          const format = options.mediaType.format ? `.${options.mediaType.format}` : "+json";
          return `application/vnd.github.${preview}-preview${format}`;
        }).join(",");
      }
    }
  }
  if (["GET", "HEAD"].includes(method)) {
    url = addQueryParameters(url, remainingParameters);
  } else {
    if ("data" in remainingParameters) {
      body = remainingParameters.data;
    } else {
      if (Object.keys(remainingParameters).length) {
        body = remainingParameters;
      }
    }
  }
  if (!headers["content-type"] && typeof body !== "undefined") {
    headers["content-type"] = "application/json; charset=utf-8";
  }
  if (["PATCH", "PUT"].includes(method) && typeof body === "undefined") {
    body = "";
  }
  return Object.assign(
    { method, url, headers },
    typeof body !== "undefined" ? { body } : null,
    options.request ? { request: options.request } : null
  );
}

// pkg/dist-src/endpoint-with-defaults.js
function endpointWithDefaults(defaults, route, options) {
  return parse(merge(defaults, route, options));
}

// pkg/dist-src/with-defaults.js
function withDefaults(oldDefaults, newDefaults) {
  const DEFAULTS2 = merge(oldDefaults, newDefaults);
  const endpoint2 = endpointWithDefaults.bind(null, DEFAULTS2);
  return Object.assign(endpoint2, {
    DEFAULTS: DEFAULTS2,
    defaults: withDefaults.bind(null, DEFAULTS2),
    merge: merge.bind(null, DEFAULTS2),
    parse
  });
}

// pkg/dist-src/index.js
var endpoint = withDefaults(null, DEFAULTS);
// Annotate the CommonJS export names for ESM import in node:
0 && (0);


/***/ }),

/***/ 8467:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// pkg/dist-src/index.js
var index_exports = {};
__export(index_exports, {
  GraphqlResponseError: () => GraphqlResponseError,
  graphql: () => graphql2,
  withCustomRequest: () => withCustomRequest
});
module.exports = __toCommonJS(index_exports);
var import_request3 = __nccwpck_require__(6234);
var import_universal_user_agent = __nccwpck_require__(5030);

// pkg/dist-src/version.js
var VERSION = "7.1.1";

// pkg/dist-src/with-defaults.js
var import_request2 = __nccwpck_require__(6234);

// pkg/dist-src/graphql.js
var import_request = __nccwpck_require__(6234);

// pkg/dist-src/error.js
function _buildMessageForResponseErrors(data) {
  return `Request failed due to following response errors:
` + data.errors.map((e) => ` - ${e.message}`).join("\n");
}
var GraphqlResponseError = class extends Error {
  constructor(request2, headers, response) {
    super(_buildMessageForResponseErrors(response));
    this.request = request2;
    this.headers = headers;
    this.response = response;
    this.name = "GraphqlResponseError";
    this.errors = response.errors;
    this.data = response.data;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};

// pkg/dist-src/graphql.js
var NON_VARIABLE_OPTIONS = [
  "method",
  "baseUrl",
  "url",
  "headers",
  "request",
  "query",
  "mediaType"
];
var FORBIDDEN_VARIABLE_OPTIONS = ["query", "method", "url"];
var GHES_V3_SUFFIX_REGEX = /\/api\/v3\/?$/;
function graphql(request2, query, options) {
  if (options) {
    if (typeof query === "string" && "query" in options) {
      return Promise.reject(
        new Error(`[@octokit/graphql] "query" cannot be used as variable name`)
      );
    }
    for (const key in options) {
      if (!FORBIDDEN_VARIABLE_OPTIONS.includes(key)) continue;
      return Promise.reject(
        new Error(
          `[@octokit/graphql] "${key}" cannot be used as variable name`
        )
      );
    }
  }
  const parsedOptions = typeof query === "string" ? Object.assign({ query }, options) : query;
  const requestOptions = Object.keys(
    parsedOptions
  ).reduce((result, key) => {
    if (NON_VARIABLE_OPTIONS.includes(key)) {
      result[key] = parsedOptions[key];
      return result;
    }
    if (!result.variables) {
      result.variables = {};
    }
    result.variables[key] = parsedOptions[key];
    return result;
  }, {});
  const baseUrl = parsedOptions.baseUrl || request2.endpoint.DEFAULTS.baseUrl;
  if (GHES_V3_SUFFIX_REGEX.test(baseUrl)) {
    requestOptions.url = baseUrl.replace(GHES_V3_SUFFIX_REGEX, "/api/graphql");
  }
  return request2(requestOptions).then((response) => {
    if (response.data.errors) {
      const headers = {};
      for (const key of Object.keys(response.headers)) {
        headers[key] = response.headers[key];
      }
      throw new GraphqlResponseError(
        requestOptions,
        headers,
        response.data
      );
    }
    return response.data.data;
  });
}

// pkg/dist-src/with-defaults.js
function withDefaults(request2, newDefaults) {
  const newRequest = request2.defaults(newDefaults);
  const newApi = (query, options) => {
    return graphql(newRequest, query, options);
  };
  return Object.assign(newApi, {
    defaults: withDefaults.bind(null, newRequest),
    endpoint: newRequest.endpoint
  });
}

// pkg/dist-src/index.js
var graphql2 = withDefaults(import_request3.request, {
  headers: {
    "user-agent": `octokit-graphql.js/${VERSION} ${(0, import_universal_user_agent.getUserAgent)()}`
  },
  method: "POST",
  url: "/graphql"
});
function withCustomRequest(customRequest) {
  return withDefaults(customRequest, {
    method: "POST",
    url: "/graphql"
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (0);


/***/ }),

/***/ 4193:
/***/ ((module) => {

"use strict";

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// pkg/dist-src/index.js
var index_exports = {};
__export(index_exports, {
  composePaginateRest: () => composePaginateRest,
  isPaginatingEndpoint: () => isPaginatingEndpoint,
  paginateRest: () => paginateRest,
  paginatingEndpoints: () => paginatingEndpoints
});
module.exports = __toCommonJS(index_exports);

// pkg/dist-src/version.js
var VERSION = "11.4.4-cjs.2";

// pkg/dist-src/normalize-paginated-list-response.js
function normalizePaginatedListResponse(response) {
  if (!response.data) {
    return {
      ...response,
      data: []
    };
  }
  const responseNeedsNormalization = "total_count" in response.data && !("url" in response.data);
  if (!responseNeedsNormalization) return response;
  const incompleteResults = response.data.incomplete_results;
  const repositorySelection = response.data.repository_selection;
  const totalCount = response.data.total_count;
  delete response.data.incomplete_results;
  delete response.data.repository_selection;
  delete response.data.total_count;
  const namespaceKey = Object.keys(response.data)[0];
  const data = response.data[namespaceKey];
  response.data = data;
  if (typeof incompleteResults !== "undefined") {
    response.data.incomplete_results = incompleteResults;
  }
  if (typeof repositorySelection !== "undefined") {
    response.data.repository_selection = repositorySelection;
  }
  response.data.total_count = totalCount;
  return response;
}

// pkg/dist-src/iterator.js
function iterator(octokit, route, parameters) {
  const options = typeof route === "function" ? route.endpoint(parameters) : octokit.request.endpoint(route, parameters);
  const requestMethod = typeof route === "function" ? route : octokit.request;
  const method = options.method;
  const headers = options.headers;
  let url = options.url;
  return {
    [Symbol.asyncIterator]: () => ({
      async next() {
        if (!url) return { done: true };
        try {
          const response = await requestMethod({ method, url, headers });
          const normalizedResponse = normalizePaginatedListResponse(response);
          url = ((normalizedResponse.headers.link || "").match(
            /<([^<>]+)>;\s*rel="next"/
          ) || [])[1];
          return { value: normalizedResponse };
        } catch (error) {
          if (error.status !== 409) throw error;
          url = "";
          return {
            value: {
              status: 200,
              headers: {},
              data: []
            }
          };
        }
      }
    })
  };
}

// pkg/dist-src/paginate.js
function paginate(octokit, route, parameters, mapFn) {
  if (typeof parameters === "function") {
    mapFn = parameters;
    parameters = void 0;
  }
  return gather(
    octokit,
    [],
    iterator(octokit, route, parameters)[Symbol.asyncIterator](),
    mapFn
  );
}
function gather(octokit, results, iterator2, mapFn) {
  return iterator2.next().then((result) => {
    if (result.done) {
      return results;
    }
    let earlyExit = false;
    function done() {
      earlyExit = true;
    }
    results = results.concat(
      mapFn ? mapFn(result.value, done) : result.value.data
    );
    if (earlyExit) {
      return results;
    }
    return gather(octokit, results, iterator2, mapFn);
  });
}

// pkg/dist-src/compose-paginate.js
var composePaginateRest = Object.assign(paginate, {
  iterator
});

// pkg/dist-src/generated/paginating-endpoints.js
var paginatingEndpoints = [
  "GET /advisories",
  "GET /app/hook/deliveries",
  "GET /app/installation-requests",
  "GET /app/installations",
  "GET /assignments/{assignment_id}/accepted_assignments",
  "GET /classrooms",
  "GET /classrooms/{classroom_id}/assignments",
  "GET /enterprises/{enterprise}/code-security/configurations",
  "GET /enterprises/{enterprise}/code-security/configurations/{configuration_id}/repositories",
  "GET /enterprises/{enterprise}/dependabot/alerts",
  "GET /enterprises/{enterprise}/secret-scanning/alerts",
  "GET /events",
  "GET /gists",
  "GET /gists/public",
  "GET /gists/starred",
  "GET /gists/{gist_id}/comments",
  "GET /gists/{gist_id}/commits",
  "GET /gists/{gist_id}/forks",
  "GET /installation/repositories",
  "GET /issues",
  "GET /licenses",
  "GET /marketplace_listing/plans",
  "GET /marketplace_listing/plans/{plan_id}/accounts",
  "GET /marketplace_listing/stubbed/plans",
  "GET /marketplace_listing/stubbed/plans/{plan_id}/accounts",
  "GET /networks/{owner}/{repo}/events",
  "GET /notifications",
  "GET /organizations",
  "GET /orgs/{org}/actions/cache/usage-by-repository",
  "GET /orgs/{org}/actions/permissions/repositories",
  "GET /orgs/{org}/actions/runner-groups",
  "GET /orgs/{org}/actions/runner-groups/{runner_group_id}/repositories",
  "GET /orgs/{org}/actions/runner-groups/{runner_group_id}/runners",
  "GET /orgs/{org}/actions/runners",
  "GET /orgs/{org}/actions/secrets",
  "GET /orgs/{org}/actions/secrets/{secret_name}/repositories",
  "GET /orgs/{org}/actions/variables",
  "GET /orgs/{org}/actions/variables/{name}/repositories",
  "GET /orgs/{org}/attestations/{subject_digest}",
  "GET /orgs/{org}/blocks",
  "GET /orgs/{org}/code-scanning/alerts",
  "GET /orgs/{org}/code-security/configurations",
  "GET /orgs/{org}/code-security/configurations/{configuration_id}/repositories",
  "GET /orgs/{org}/codespaces",
  "GET /orgs/{org}/codespaces/secrets",
  "GET /orgs/{org}/codespaces/secrets/{secret_name}/repositories",
  "GET /orgs/{org}/copilot/billing/seats",
  "GET /orgs/{org}/copilot/metrics",
  "GET /orgs/{org}/copilot/usage",
  "GET /orgs/{org}/dependabot/alerts",
  "GET /orgs/{org}/dependabot/secrets",
  "GET /orgs/{org}/dependabot/secrets/{secret_name}/repositories",
  "GET /orgs/{org}/events",
  "GET /orgs/{org}/failed_invitations",
  "GET /orgs/{org}/hooks",
  "GET /orgs/{org}/hooks/{hook_id}/deliveries",
  "GET /orgs/{org}/insights/api/route-stats/{actor_type}/{actor_id}",
  "GET /orgs/{org}/insights/api/subject-stats",
  "GET /orgs/{org}/insights/api/user-stats/{user_id}",
  "GET /orgs/{org}/installations",
  "GET /orgs/{org}/invitations",
  "GET /orgs/{org}/invitations/{invitation_id}/teams",
  "GET /orgs/{org}/issues",
  "GET /orgs/{org}/members",
  "GET /orgs/{org}/members/{username}/codespaces",
  "GET /orgs/{org}/migrations",
  "GET /orgs/{org}/migrations/{migration_id}/repositories",
  "GET /orgs/{org}/organization-roles/{role_id}/teams",
  "GET /orgs/{org}/organization-roles/{role_id}/users",
  "GET /orgs/{org}/outside_collaborators",
  "GET /orgs/{org}/packages",
  "GET /orgs/{org}/packages/{package_type}/{package_name}/versions",
  "GET /orgs/{org}/personal-access-token-requests",
  "GET /orgs/{org}/personal-access-token-requests/{pat_request_id}/repositories",
  "GET /orgs/{org}/personal-access-tokens",
  "GET /orgs/{org}/personal-access-tokens/{pat_id}/repositories",
  "GET /orgs/{org}/private-registries",
  "GET /orgs/{org}/projects",
  "GET /orgs/{org}/properties/values",
  "GET /orgs/{org}/public_members",
  "GET /orgs/{org}/repos",
  "GET /orgs/{org}/rulesets",
  "GET /orgs/{org}/rulesets/rule-suites",
  "GET /orgs/{org}/secret-scanning/alerts",
  "GET /orgs/{org}/security-advisories",
  "GET /orgs/{org}/team/{team_slug}/copilot/metrics",
  "GET /orgs/{org}/team/{team_slug}/copilot/usage",
  "GET /orgs/{org}/teams",
  "GET /orgs/{org}/teams/{team_slug}/discussions",
  "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments",
  "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions",
  "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions",
  "GET /orgs/{org}/teams/{team_slug}/invitations",
  "GET /orgs/{org}/teams/{team_slug}/members",
  "GET /orgs/{org}/teams/{team_slug}/projects",
  "GET /orgs/{org}/teams/{team_slug}/repos",
  "GET /orgs/{org}/teams/{team_slug}/teams",
  "GET /projects/columns/{column_id}/cards",
  "GET /projects/{project_id}/collaborators",
  "GET /projects/{project_id}/columns",
  "GET /repos/{owner}/{repo}/actions/artifacts",
  "GET /repos/{owner}/{repo}/actions/caches",
  "GET /repos/{owner}/{repo}/actions/organization-secrets",
  "GET /repos/{owner}/{repo}/actions/organization-variables",
  "GET /repos/{owner}/{repo}/actions/runners",
  "GET /repos/{owner}/{repo}/actions/runs",
  "GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts",
  "GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}/jobs",
  "GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs",
  "GET /repos/{owner}/{repo}/actions/secrets",
  "GET /repos/{owner}/{repo}/actions/variables",
  "GET /repos/{owner}/{repo}/actions/workflows",
  "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs",
  "GET /repos/{owner}/{repo}/activity",
  "GET /repos/{owner}/{repo}/assignees",
  "GET /repos/{owner}/{repo}/attestations/{subject_digest}",
  "GET /repos/{owner}/{repo}/branches",
  "GET /repos/{owner}/{repo}/check-runs/{check_run_id}/annotations",
  "GET /repos/{owner}/{repo}/check-suites/{check_suite_id}/check-runs",
  "GET /repos/{owner}/{repo}/code-scanning/alerts",
  "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances",
  "GET /repos/{owner}/{repo}/code-scanning/analyses",
  "GET /repos/{owner}/{repo}/codespaces",
  "GET /repos/{owner}/{repo}/codespaces/devcontainers",
  "GET /repos/{owner}/{repo}/codespaces/secrets",
  "GET /repos/{owner}/{repo}/collaborators",
  "GET /repos/{owner}/{repo}/comments",
  "GET /repos/{owner}/{repo}/comments/{comment_id}/reactions",
  "GET /repos/{owner}/{repo}/commits",
  "GET /repos/{owner}/{repo}/commits/{commit_sha}/comments",
  "GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls",
  "GET /repos/{owner}/{repo}/commits/{ref}/check-runs",
  "GET /repos/{owner}/{repo}/commits/{ref}/check-suites",
  "GET /repos/{owner}/{repo}/commits/{ref}/status",
  "GET /repos/{owner}/{repo}/commits/{ref}/statuses",
  "GET /repos/{owner}/{repo}/contributors",
  "GET /repos/{owner}/{repo}/dependabot/alerts",
  "GET /repos/{owner}/{repo}/dependabot/secrets",
  "GET /repos/{owner}/{repo}/deployments",
  "GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses",
  "GET /repos/{owner}/{repo}/environments",
  "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies",
  "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/apps",
  "GET /repos/{owner}/{repo}/environments/{environment_name}/secrets",
  "GET /repos/{owner}/{repo}/environments/{environment_name}/variables",
  "GET /repos/{owner}/{repo}/events",
  "GET /repos/{owner}/{repo}/forks",
  "GET /repos/{owner}/{repo}/hooks",
  "GET /repos/{owner}/{repo}/hooks/{hook_id}/deliveries",
  "GET /repos/{owner}/{repo}/invitations",
  "GET /repos/{owner}/{repo}/issues",
  "GET /repos/{owner}/{repo}/issues/comments",
  "GET /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions",
  "GET /repos/{owner}/{repo}/issues/events",
  "GET /repos/{owner}/{repo}/issues/{issue_number}/comments",
  "GET /repos/{owner}/{repo}/issues/{issue_number}/events",
  "GET /repos/{owner}/{repo}/issues/{issue_number}/labels",
  "GET /repos/{owner}/{repo}/issues/{issue_number}/reactions",
  "GET /repos/{owner}/{repo}/issues/{issue_number}/sub_issues",
  "GET /repos/{owner}/{repo}/issues/{issue_number}/timeline",
  "GET /repos/{owner}/{repo}/keys",
  "GET /repos/{owner}/{repo}/labels",
  "GET /repos/{owner}/{repo}/milestones",
  "GET /repos/{owner}/{repo}/milestones/{milestone_number}/labels",
  "GET /repos/{owner}/{repo}/notifications",
  "GET /repos/{owner}/{repo}/pages/builds",
  "GET /repos/{owner}/{repo}/projects",
  "GET /repos/{owner}/{repo}/pulls",
  "GET /repos/{owner}/{repo}/pulls/comments",
  "GET /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions",
  "GET /repos/{owner}/{repo}/pulls/{pull_number}/comments",
  "GET /repos/{owner}/{repo}/pulls/{pull_number}/commits",
  "GET /repos/{owner}/{repo}/pulls/{pull_number}/files",
  "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews",
  "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments",
  "GET /repos/{owner}/{repo}/releases",
  "GET /repos/{owner}/{repo}/releases/{release_id}/assets",
  "GET /repos/{owner}/{repo}/releases/{release_id}/reactions",
  "GET /repos/{owner}/{repo}/rules/branches/{branch}",
  "GET /repos/{owner}/{repo}/rulesets",
  "GET /repos/{owner}/{repo}/rulesets/rule-suites",
  "GET /repos/{owner}/{repo}/secret-scanning/alerts",
  "GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}/locations",
  "GET /repos/{owner}/{repo}/security-advisories",
  "GET /repos/{owner}/{repo}/stargazers",
  "GET /repos/{owner}/{repo}/subscribers",
  "GET /repos/{owner}/{repo}/tags",
  "GET /repos/{owner}/{repo}/teams",
  "GET /repos/{owner}/{repo}/topics",
  "GET /repositories",
  "GET /search/code",
  "GET /search/commits",
  "GET /search/issues",
  "GET /search/labels",
  "GET /search/repositories",
  "GET /search/topics",
  "GET /search/users",
  "GET /teams/{team_id}/discussions",
  "GET /teams/{team_id}/discussions/{discussion_number}/comments",
  "GET /teams/{team_id}/discussions/{discussion_number}/comments/{comment_number}/reactions",
  "GET /teams/{team_id}/discussions/{discussion_number}/reactions",
  "GET /teams/{team_id}/invitations",
  "GET /teams/{team_id}/members",
  "GET /teams/{team_id}/projects",
  "GET /teams/{team_id}/repos",
  "GET /teams/{team_id}/teams",
  "GET /user/blocks",
  "GET /user/codespaces",
  "GET /user/codespaces/secrets",
  "GET /user/emails",
  "GET /user/followers",
  "GET /user/following",
  "GET /user/gpg_keys",
  "GET /user/installations",
  "GET /user/installations/{installation_id}/repositories",
  "GET /user/issues",
  "GET /user/keys",
  "GET /user/marketplace_purchases",
  "GET /user/marketplace_purchases/stubbed",
  "GET /user/memberships/orgs",
  "GET /user/migrations",
  "GET /user/migrations/{migration_id}/repositories",
  "GET /user/orgs",
  "GET /user/packages",
  "GET /user/packages/{package_type}/{package_name}/versions",
  "GET /user/public_emails",
  "GET /user/repos",
  "GET /user/repository_invitations",
  "GET /user/social_accounts",
  "GET /user/ssh_signing_keys",
  "GET /user/starred",
  "GET /user/subscriptions",
  "GET /user/teams",
  "GET /users",
  "GET /users/{username}/attestations/{subject_digest}",
  "GET /users/{username}/events",
  "GET /users/{username}/events/orgs/{org}",
  "GET /users/{username}/events/public",
  "GET /users/{username}/followers",
  "GET /users/{username}/following",
  "GET /users/{username}/gists",
  "GET /users/{username}/gpg_keys",
  "GET /users/{username}/keys",
  "GET /users/{username}/orgs",
  "GET /users/{username}/packages",
  "GET /users/{username}/projects",
  "GET /users/{username}/received_events",
  "GET /users/{username}/received_events/public",
  "GET /users/{username}/repos",
  "GET /users/{username}/social_accounts",
  "GET /users/{username}/ssh_signing_keys",
  "GET /users/{username}/starred",
  "GET /users/{username}/subscriptions"
];

// pkg/dist-src/paginating-endpoints.js
function isPaginatingEndpoint(arg) {
  if (typeof arg === "string") {
    return paginatingEndpoints.includes(arg);
  } else {
    return false;
  }
}

// pkg/dist-src/index.js
function paginateRest(octokit) {
  return {
    paginate: Object.assign(paginate.bind(null, octokit), {
      iterator: iterator.bind(null, octokit)
    })
  };
}
paginateRest.VERSION = VERSION;
// Annotate the CommonJS export names for ESM import in node:
0 && (0);


/***/ }),

/***/ 8883:
/***/ ((module) => {

"use strict";

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// pkg/dist-src/index.js
var dist_src_exports = {};
__export(dist_src_exports, {
  requestLog: () => requestLog
});
module.exports = __toCommonJS(dist_src_exports);

// pkg/dist-src/version.js
var VERSION = "4.0.1";

// pkg/dist-src/index.js
function requestLog(octokit) {
  octokit.hook.wrap("request", (request, options) => {
    octokit.log.debug("request", options);
    const start = Date.now();
    const requestOptions = octokit.request.endpoint.parse(options);
    const path = requestOptions.url.replace(options.baseUrl, "");
    return request(options).then((response) => {
      octokit.log.info(
        `${requestOptions.method} ${path} - ${response.status} in ${Date.now() - start}ms`
      );
      return response;
    }).catch((error) => {
      octokit.log.info(
        `${requestOptions.method} ${path} - ${error.status} in ${Date.now() - start}ms`
      );
      throw error;
    });
  });
}
requestLog.VERSION = VERSION;
// Annotate the CommonJS export names for ESM import in node:
0 && (0);


/***/ }),

/***/ 3044:
/***/ ((module) => {

"use strict";

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// pkg/dist-src/index.js
var index_exports = {};
__export(index_exports, {
  legacyRestEndpointMethods: () => legacyRestEndpointMethods,
  restEndpointMethods: () => restEndpointMethods
});
module.exports = __toCommonJS(index_exports);

// pkg/dist-src/version.js
var VERSION = "13.3.2-cjs.1";

// pkg/dist-src/generated/endpoints.js
var Endpoints = {
  actions: {
    addCustomLabelsToSelfHostedRunnerForOrg: [
      "POST /orgs/{org}/actions/runners/{runner_id}/labels"
    ],
    addCustomLabelsToSelfHostedRunnerForRepo: [
      "POST /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"
    ],
    addRepoAccessToSelfHostedRunnerGroupInOrg: [
      "PUT /orgs/{org}/actions/runner-groups/{runner_group_id}/repositories/{repository_id}"
    ],
    addSelectedRepoToOrgSecret: [
      "PUT /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}"
    ],
    addSelectedRepoToOrgVariable: [
      "PUT /orgs/{org}/actions/variables/{name}/repositories/{repository_id}"
    ],
    approveWorkflowRun: [
      "POST /repos/{owner}/{repo}/actions/runs/{run_id}/approve"
    ],
    cancelWorkflowRun: [
      "POST /repos/{owner}/{repo}/actions/runs/{run_id}/cancel"
    ],
    createEnvironmentVariable: [
      "POST /repos/{owner}/{repo}/environments/{environment_name}/variables"
    ],
    createOrUpdateEnvironmentSecret: [
      "PUT /repos/{owner}/{repo}/environments/{environment_name}/secrets/{secret_name}"
    ],
    createOrUpdateOrgSecret: ["PUT /orgs/{org}/actions/secrets/{secret_name}"],
    createOrUpdateRepoSecret: [
      "PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}"
    ],
    createOrgVariable: ["POST /orgs/{org}/actions/variables"],
    createRegistrationTokenForOrg: [
      "POST /orgs/{org}/actions/runners/registration-token"
    ],
    createRegistrationTokenForRepo: [
      "POST /repos/{owner}/{repo}/actions/runners/registration-token"
    ],
    createRemoveTokenForOrg: ["POST /orgs/{org}/actions/runners/remove-token"],
    createRemoveTokenForRepo: [
      "POST /repos/{owner}/{repo}/actions/runners/remove-token"
    ],
    createRepoVariable: ["POST /repos/{owner}/{repo}/actions/variables"],
    createWorkflowDispatch: [
      "POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches"
    ],
    deleteActionsCacheById: [
      "DELETE /repos/{owner}/{repo}/actions/caches/{cache_id}"
    ],
    deleteActionsCacheByKey: [
      "DELETE /repos/{owner}/{repo}/actions/caches{?key,ref}"
    ],
    deleteArtifact: [
      "DELETE /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"
    ],
    deleteEnvironmentSecret: [
      "DELETE /repos/{owner}/{repo}/environments/{environment_name}/secrets/{secret_name}"
    ],
    deleteEnvironmentVariable: [
      "DELETE /repos/{owner}/{repo}/environments/{environment_name}/variables/{name}"
    ],
    deleteOrgSecret: ["DELETE /orgs/{org}/actions/secrets/{secret_name}"],
    deleteOrgVariable: ["DELETE /orgs/{org}/actions/variables/{name}"],
    deleteRepoSecret: [
      "DELETE /repos/{owner}/{repo}/actions/secrets/{secret_name}"
    ],
    deleteRepoVariable: [
      "DELETE /repos/{owner}/{repo}/actions/variables/{name}"
    ],
    deleteSelfHostedRunnerFromOrg: [
      "DELETE /orgs/{org}/actions/runners/{runner_id}"
    ],
    deleteSelfHostedRunnerFromRepo: [
      "DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}"
    ],
    deleteWorkflowRun: ["DELETE /repos/{owner}/{repo}/actions/runs/{run_id}"],
    deleteWorkflowRunLogs: [
      "DELETE /repos/{owner}/{repo}/actions/runs/{run_id}/logs"
    ],
    disableSelectedRepositoryGithubActionsOrganization: [
      "DELETE /orgs/{org}/actions/permissions/repositories/{repository_id}"
    ],
    disableWorkflow: [
      "PUT /repos/{owner}/{repo}/actions/workflows/{workflow_id}/disable"
    ],
    downloadArtifact: [
      "GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}/{archive_format}"
    ],
    downloadJobLogsForWorkflowRun: [
      "GET /repos/{owner}/{repo}/actions/jobs/{job_id}/logs"
    ],
    downloadWorkflowRunAttemptLogs: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}/logs"
    ],
    downloadWorkflowRunLogs: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/logs"
    ],
    enableSelectedRepositoryGithubActionsOrganization: [
      "PUT /orgs/{org}/actions/permissions/repositories/{repository_id}"
    ],
    enableWorkflow: [
      "PUT /repos/{owner}/{repo}/actions/workflows/{workflow_id}/enable"
    ],
    forceCancelWorkflowRun: [
      "POST /repos/{owner}/{repo}/actions/runs/{run_id}/force-cancel"
    ],
    generateRunnerJitconfigForOrg: [
      "POST /orgs/{org}/actions/runners/generate-jitconfig"
    ],
    generateRunnerJitconfigForRepo: [
      "POST /repos/{owner}/{repo}/actions/runners/generate-jitconfig"
    ],
    getActionsCacheList: ["GET /repos/{owner}/{repo}/actions/caches"],
    getActionsCacheUsage: ["GET /repos/{owner}/{repo}/actions/cache/usage"],
    getActionsCacheUsageByRepoForOrg: [
      "GET /orgs/{org}/actions/cache/usage-by-repository"
    ],
    getActionsCacheUsageForOrg: ["GET /orgs/{org}/actions/cache/usage"],
    getAllowedActionsOrganization: [
      "GET /orgs/{org}/actions/permissions/selected-actions"
    ],
    getAllowedActionsRepository: [
      "GET /repos/{owner}/{repo}/actions/permissions/selected-actions"
    ],
    getArtifact: ["GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"],
    getCustomOidcSubClaimForRepo: [
      "GET /repos/{owner}/{repo}/actions/oidc/customization/sub"
    ],
    getEnvironmentPublicKey: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/secrets/public-key"
    ],
    getEnvironmentSecret: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/secrets/{secret_name}"
    ],
    getEnvironmentVariable: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/variables/{name}"
    ],
    getGithubActionsDefaultWorkflowPermissionsOrganization: [
      "GET /orgs/{org}/actions/permissions/workflow"
    ],
    getGithubActionsDefaultWorkflowPermissionsRepository: [
      "GET /repos/{owner}/{repo}/actions/permissions/workflow"
    ],
    getGithubActionsPermissionsOrganization: [
      "GET /orgs/{org}/actions/permissions"
    ],
    getGithubActionsPermissionsRepository: [
      "GET /repos/{owner}/{repo}/actions/permissions"
    ],
    getJobForWorkflowRun: ["GET /repos/{owner}/{repo}/actions/jobs/{job_id}"],
    getOrgPublicKey: ["GET /orgs/{org}/actions/secrets/public-key"],
    getOrgSecret: ["GET /orgs/{org}/actions/secrets/{secret_name}"],
    getOrgVariable: ["GET /orgs/{org}/actions/variables/{name}"],
    getPendingDeploymentsForRun: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/pending_deployments"
    ],
    getRepoPermissions: [
      "GET /repos/{owner}/{repo}/actions/permissions",
      {},
      { renamed: ["actions", "getGithubActionsPermissionsRepository"] }
    ],
    getRepoPublicKey: ["GET /repos/{owner}/{repo}/actions/secrets/public-key"],
    getRepoSecret: ["GET /repos/{owner}/{repo}/actions/secrets/{secret_name}"],
    getRepoVariable: ["GET /repos/{owner}/{repo}/actions/variables/{name}"],
    getReviewsForRun: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/approvals"
    ],
    getSelfHostedRunnerForOrg: ["GET /orgs/{org}/actions/runners/{runner_id}"],
    getSelfHostedRunnerForRepo: [
      "GET /repos/{owner}/{repo}/actions/runners/{runner_id}"
    ],
    getWorkflow: ["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}"],
    getWorkflowAccessToRepository: [
      "GET /repos/{owner}/{repo}/actions/permissions/access"
    ],
    getWorkflowRun: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}"],
    getWorkflowRunAttempt: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}"
    ],
    getWorkflowRunUsage: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/timing"
    ],
    getWorkflowUsage: [
      "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/timing"
    ],
    listArtifactsForRepo: ["GET /repos/{owner}/{repo}/actions/artifacts"],
    listEnvironmentSecrets: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/secrets"
    ],
    listEnvironmentVariables: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/variables"
    ],
    listJobsForWorkflowRun: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs"
    ],
    listJobsForWorkflowRunAttempt: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}/jobs"
    ],
    listLabelsForSelfHostedRunnerForOrg: [
      "GET /orgs/{org}/actions/runners/{runner_id}/labels"
    ],
    listLabelsForSelfHostedRunnerForRepo: [
      "GET /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"
    ],
    listOrgSecrets: ["GET /orgs/{org}/actions/secrets"],
    listOrgVariables: ["GET /orgs/{org}/actions/variables"],
    listRepoOrganizationSecrets: [
      "GET /repos/{owner}/{repo}/actions/organization-secrets"
    ],
    listRepoOrganizationVariables: [
      "GET /repos/{owner}/{repo}/actions/organization-variables"
    ],
    listRepoSecrets: ["GET /repos/{owner}/{repo}/actions/secrets"],
    listRepoVariables: ["GET /repos/{owner}/{repo}/actions/variables"],
    listRepoWorkflows: ["GET /repos/{owner}/{repo}/actions/workflows"],
    listRunnerApplicationsForOrg: ["GET /orgs/{org}/actions/runners/downloads"],
    listRunnerApplicationsForRepo: [
      "GET /repos/{owner}/{repo}/actions/runners/downloads"
    ],
    listSelectedReposForOrgSecret: [
      "GET /orgs/{org}/actions/secrets/{secret_name}/repositories"
    ],
    listSelectedReposForOrgVariable: [
      "GET /orgs/{org}/actions/variables/{name}/repositories"
    ],
    listSelectedRepositoriesEnabledGithubActionsOrganization: [
      "GET /orgs/{org}/actions/permissions/repositories"
    ],
    listSelfHostedRunnersForOrg: ["GET /orgs/{org}/actions/runners"],
    listSelfHostedRunnersForRepo: ["GET /repos/{owner}/{repo}/actions/runners"],
    listWorkflowRunArtifacts: [
      "GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts"
    ],
    listWorkflowRuns: [
      "GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs"
    ],
    listWorkflowRunsForRepo: ["GET /repos/{owner}/{repo}/actions/runs"],
    reRunJobForWorkflowRun: [
      "POST /repos/{owner}/{repo}/actions/jobs/{job_id}/rerun"
    ],
    reRunWorkflow: ["POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun"],
    reRunWorkflowFailedJobs: [
      "POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun-failed-jobs"
    ],
    removeAllCustomLabelsFromSelfHostedRunnerForOrg: [
      "DELETE /orgs/{org}/actions/runners/{runner_id}/labels"
    ],
    removeAllCustomLabelsFromSelfHostedRunnerForRepo: [
      "DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"
    ],
    removeCustomLabelFromSelfHostedRunnerForOrg: [
      "DELETE /orgs/{org}/actions/runners/{runner_id}/labels/{name}"
    ],
    removeCustomLabelFromSelfHostedRunnerForRepo: [
      "DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}/labels/{name}"
    ],
    removeSelectedRepoFromOrgSecret: [
      "DELETE /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}"
    ],
    removeSelectedRepoFromOrgVariable: [
      "DELETE /orgs/{org}/actions/variables/{name}/repositories/{repository_id}"
    ],
    reviewCustomGatesForRun: [
      "POST /repos/{owner}/{repo}/actions/runs/{run_id}/deployment_protection_rule"
    ],
    reviewPendingDeploymentsForRun: [
      "POST /repos/{owner}/{repo}/actions/runs/{run_id}/pending_deployments"
    ],
    setAllowedActionsOrganization: [
      "PUT /orgs/{org}/actions/permissions/selected-actions"
    ],
    setAllowedActionsRepository: [
      "PUT /repos/{owner}/{repo}/actions/permissions/selected-actions"
    ],
    setCustomLabelsForSelfHostedRunnerForOrg: [
      "PUT /orgs/{org}/actions/runners/{runner_id}/labels"
    ],
    setCustomLabelsForSelfHostedRunnerForRepo: [
      "PUT /repos/{owner}/{repo}/actions/runners/{runner_id}/labels"
    ],
    setCustomOidcSubClaimForRepo: [
      "PUT /repos/{owner}/{repo}/actions/oidc/customization/sub"
    ],
    setGithubActionsDefaultWorkflowPermissionsOrganization: [
      "PUT /orgs/{org}/actions/permissions/workflow"
    ],
    setGithubActionsDefaultWorkflowPermissionsRepository: [
      "PUT /repos/{owner}/{repo}/actions/permissions/workflow"
    ],
    setGithubActionsPermissionsOrganization: [
      "PUT /orgs/{org}/actions/permissions"
    ],
    setGithubActionsPermissionsRepository: [
      "PUT /repos/{owner}/{repo}/actions/permissions"
    ],
    setSelectedReposForOrgSecret: [
      "PUT /orgs/{org}/actions/secrets/{secret_name}/repositories"
    ],
    setSelectedReposForOrgVariable: [
      "PUT /orgs/{org}/actions/variables/{name}/repositories"
    ],
    setSelectedRepositoriesEnabledGithubActionsOrganization: [
      "PUT /orgs/{org}/actions/permissions/repositories"
    ],
    setWorkflowAccessToRepository: [
      "PUT /repos/{owner}/{repo}/actions/permissions/access"
    ],
    updateEnvironmentVariable: [
      "PATCH /repos/{owner}/{repo}/environments/{environment_name}/variables/{name}"
    ],
    updateOrgVariable: ["PATCH /orgs/{org}/actions/variables/{name}"],
    updateRepoVariable: [
      "PATCH /repos/{owner}/{repo}/actions/variables/{name}"
    ]
  },
  activity: {
    checkRepoIsStarredByAuthenticatedUser: ["GET /user/starred/{owner}/{repo}"],
    deleteRepoSubscription: ["DELETE /repos/{owner}/{repo}/subscription"],
    deleteThreadSubscription: [
      "DELETE /notifications/threads/{thread_id}/subscription"
    ],
    getFeeds: ["GET /feeds"],
    getRepoSubscription: ["GET /repos/{owner}/{repo}/subscription"],
    getThread: ["GET /notifications/threads/{thread_id}"],
    getThreadSubscriptionForAuthenticatedUser: [
      "GET /notifications/threads/{thread_id}/subscription"
    ],
    listEventsForAuthenticatedUser: ["GET /users/{username}/events"],
    listNotificationsForAuthenticatedUser: ["GET /notifications"],
    listOrgEventsForAuthenticatedUser: [
      "GET /users/{username}/events/orgs/{org}"
    ],
    listPublicEvents: ["GET /events"],
    listPublicEventsForRepoNetwork: ["GET /networks/{owner}/{repo}/events"],
    listPublicEventsForUser: ["GET /users/{username}/events/public"],
    listPublicOrgEvents: ["GET /orgs/{org}/events"],
    listReceivedEventsForUser: ["GET /users/{username}/received_events"],
    listReceivedPublicEventsForUser: [
      "GET /users/{username}/received_events/public"
    ],
    listRepoEvents: ["GET /repos/{owner}/{repo}/events"],
    listRepoNotificationsForAuthenticatedUser: [
      "GET /repos/{owner}/{repo}/notifications"
    ],
    listReposStarredByAuthenticatedUser: ["GET /user/starred"],
    listReposStarredByUser: ["GET /users/{username}/starred"],
    listReposWatchedByUser: ["GET /users/{username}/subscriptions"],
    listStargazersForRepo: ["GET /repos/{owner}/{repo}/stargazers"],
    listWatchedReposForAuthenticatedUser: ["GET /user/subscriptions"],
    listWatchersForRepo: ["GET /repos/{owner}/{repo}/subscribers"],
    markNotificationsAsRead: ["PUT /notifications"],
    markRepoNotificationsAsRead: ["PUT /repos/{owner}/{repo}/notifications"],
    markThreadAsDone: ["DELETE /notifications/threads/{thread_id}"],
    markThreadAsRead: ["PATCH /notifications/threads/{thread_id}"],
    setRepoSubscription: ["PUT /repos/{owner}/{repo}/subscription"],
    setThreadSubscription: [
      "PUT /notifications/threads/{thread_id}/subscription"
    ],
    starRepoForAuthenticatedUser: ["PUT /user/starred/{owner}/{repo}"],
    unstarRepoForAuthenticatedUser: ["DELETE /user/starred/{owner}/{repo}"]
  },
  apps: {
    addRepoToInstallation: [
      "PUT /user/installations/{installation_id}/repositories/{repository_id}",
      {},
      { renamed: ["apps", "addRepoToInstallationForAuthenticatedUser"] }
    ],
    addRepoToInstallationForAuthenticatedUser: [
      "PUT /user/installations/{installation_id}/repositories/{repository_id}"
    ],
    checkToken: ["POST /applications/{client_id}/token"],
    createFromManifest: ["POST /app-manifests/{code}/conversions"],
    createInstallationAccessToken: [
      "POST /app/installations/{installation_id}/access_tokens"
    ],
    deleteAuthorization: ["DELETE /applications/{client_id}/grant"],
    deleteInstallation: ["DELETE /app/installations/{installation_id}"],
    deleteToken: ["DELETE /applications/{client_id}/token"],
    getAuthenticated: ["GET /app"],
    getBySlug: ["GET /apps/{app_slug}"],
    getInstallation: ["GET /app/installations/{installation_id}"],
    getOrgInstallation: ["GET /orgs/{org}/installation"],
    getRepoInstallation: ["GET /repos/{owner}/{repo}/installation"],
    getSubscriptionPlanForAccount: [
      "GET /marketplace_listing/accounts/{account_id}"
    ],
    getSubscriptionPlanForAccountStubbed: [
      "GET /marketplace_listing/stubbed/accounts/{account_id}"
    ],
    getUserInstallation: ["GET /users/{username}/installation"],
    getWebhookConfigForApp: ["GET /app/hook/config"],
    getWebhookDelivery: ["GET /app/hook/deliveries/{delivery_id}"],
    listAccountsForPlan: ["GET /marketplace_listing/plans/{plan_id}/accounts"],
    listAccountsForPlanStubbed: [
      "GET /marketplace_listing/stubbed/plans/{plan_id}/accounts"
    ],
    listInstallationReposForAuthenticatedUser: [
      "GET /user/installations/{installation_id}/repositories"
    ],
    listInstallationRequestsForAuthenticatedApp: [
      "GET /app/installation-requests"
    ],
    listInstallations: ["GET /app/installations"],
    listInstallationsForAuthenticatedUser: ["GET /user/installations"],
    listPlans: ["GET /marketplace_listing/plans"],
    listPlansStubbed: ["GET /marketplace_listing/stubbed/plans"],
    listReposAccessibleToInstallation: ["GET /installation/repositories"],
    listSubscriptionsForAuthenticatedUser: ["GET /user/marketplace_purchases"],
    listSubscriptionsForAuthenticatedUserStubbed: [
      "GET /user/marketplace_purchases/stubbed"
    ],
    listWebhookDeliveries: ["GET /app/hook/deliveries"],
    redeliverWebhookDelivery: [
      "POST /app/hook/deliveries/{delivery_id}/attempts"
    ],
    removeRepoFromInstallation: [
      "DELETE /user/installations/{installation_id}/repositories/{repository_id}",
      {},
      { renamed: ["apps", "removeRepoFromInstallationForAuthenticatedUser"] }
    ],
    removeRepoFromInstallationForAuthenticatedUser: [
      "DELETE /user/installations/{installation_id}/repositories/{repository_id}"
    ],
    resetToken: ["PATCH /applications/{client_id}/token"],
    revokeInstallationAccessToken: ["DELETE /installation/token"],
    scopeToken: ["POST /applications/{client_id}/token/scoped"],
    suspendInstallation: ["PUT /app/installations/{installation_id}/suspended"],
    unsuspendInstallation: [
      "DELETE /app/installations/{installation_id}/suspended"
    ],
    updateWebhookConfigForApp: ["PATCH /app/hook/config"]
  },
  billing: {
    getGithubActionsBillingOrg: ["GET /orgs/{org}/settings/billing/actions"],
    getGithubActionsBillingUser: [
      "GET /users/{username}/settings/billing/actions"
    ],
    getGithubBillingUsageReportOrg: [
      "GET /organizations/{org}/settings/billing/usage"
    ],
    getGithubPackagesBillingOrg: ["GET /orgs/{org}/settings/billing/packages"],
    getGithubPackagesBillingUser: [
      "GET /users/{username}/settings/billing/packages"
    ],
    getSharedStorageBillingOrg: [
      "GET /orgs/{org}/settings/billing/shared-storage"
    ],
    getSharedStorageBillingUser: [
      "GET /users/{username}/settings/billing/shared-storage"
    ]
  },
  checks: {
    create: ["POST /repos/{owner}/{repo}/check-runs"],
    createSuite: ["POST /repos/{owner}/{repo}/check-suites"],
    get: ["GET /repos/{owner}/{repo}/check-runs/{check_run_id}"],
    getSuite: ["GET /repos/{owner}/{repo}/check-suites/{check_suite_id}"],
    listAnnotations: [
      "GET /repos/{owner}/{repo}/check-runs/{check_run_id}/annotations"
    ],
    listForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/check-runs"],
    listForSuite: [
      "GET /repos/{owner}/{repo}/check-suites/{check_suite_id}/check-runs"
    ],
    listSuitesForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/check-suites"],
    rerequestRun: [
      "POST /repos/{owner}/{repo}/check-runs/{check_run_id}/rerequest"
    ],
    rerequestSuite: [
      "POST /repos/{owner}/{repo}/check-suites/{check_suite_id}/rerequest"
    ],
    setSuitesPreferences: [
      "PATCH /repos/{owner}/{repo}/check-suites/preferences"
    ],
    update: ["PATCH /repos/{owner}/{repo}/check-runs/{check_run_id}"]
  },
  codeScanning: {
    commitAutofix: [
      "POST /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/autofix/commits"
    ],
    createAutofix: [
      "POST /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/autofix"
    ],
    createVariantAnalysis: [
      "POST /repos/{owner}/{repo}/code-scanning/codeql/variant-analyses"
    ],
    deleteAnalysis: [
      "DELETE /repos/{owner}/{repo}/code-scanning/analyses/{analysis_id}{?confirm_delete}"
    ],
    deleteCodeqlDatabase: [
      "DELETE /repos/{owner}/{repo}/code-scanning/codeql/databases/{language}"
    ],
    getAlert: [
      "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}",
      {},
      { renamedParameters: { alert_id: "alert_number" } }
    ],
    getAnalysis: [
      "GET /repos/{owner}/{repo}/code-scanning/analyses/{analysis_id}"
    ],
    getAutofix: [
      "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/autofix"
    ],
    getCodeqlDatabase: [
      "GET /repos/{owner}/{repo}/code-scanning/codeql/databases/{language}"
    ],
    getDefaultSetup: ["GET /repos/{owner}/{repo}/code-scanning/default-setup"],
    getSarif: ["GET /repos/{owner}/{repo}/code-scanning/sarifs/{sarif_id}"],
    getVariantAnalysis: [
      "GET /repos/{owner}/{repo}/code-scanning/codeql/variant-analyses/{codeql_variant_analysis_id}"
    ],
    getVariantAnalysisRepoTask: [
      "GET /repos/{owner}/{repo}/code-scanning/codeql/variant-analyses/{codeql_variant_analysis_id}/repos/{repo_owner}/{repo_name}"
    ],
    listAlertInstances: [
      "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances"
    ],
    listAlertsForOrg: ["GET /orgs/{org}/code-scanning/alerts"],
    listAlertsForRepo: ["GET /repos/{owner}/{repo}/code-scanning/alerts"],
    listAlertsInstances: [
      "GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/instances",
      {},
      { renamed: ["codeScanning", "listAlertInstances"] }
    ],
    listCodeqlDatabases: [
      "GET /repos/{owner}/{repo}/code-scanning/codeql/databases"
    ],
    listRecentAnalyses: ["GET /repos/{owner}/{repo}/code-scanning/analyses"],
    updateAlert: [
      "PATCH /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}"
    ],
    updateDefaultSetup: [
      "PATCH /repos/{owner}/{repo}/code-scanning/default-setup"
    ],
    uploadSarif: ["POST /repos/{owner}/{repo}/code-scanning/sarifs"]
  },
  codeSecurity: {
    attachConfiguration: [
      "POST /orgs/{org}/code-security/configurations/{configuration_id}/attach"
    ],
    attachEnterpriseConfiguration: [
      "POST /enterprises/{enterprise}/code-security/configurations/{configuration_id}/attach"
    ],
    createConfiguration: ["POST /orgs/{org}/code-security/configurations"],
    createConfigurationForEnterprise: [
      "POST /enterprises/{enterprise}/code-security/configurations"
    ],
    deleteConfiguration: [
      "DELETE /orgs/{org}/code-security/configurations/{configuration_id}"
    ],
    deleteConfigurationForEnterprise: [
      "DELETE /enterprises/{enterprise}/code-security/configurations/{configuration_id}"
    ],
    detachConfiguration: [
      "DELETE /orgs/{org}/code-security/configurations/detach"
    ],
    getConfiguration: [
      "GET /orgs/{org}/code-security/configurations/{configuration_id}"
    ],
    getConfigurationForRepository: [
      "GET /repos/{owner}/{repo}/code-security-configuration"
    ],
    getConfigurationsForEnterprise: [
      "GET /enterprises/{enterprise}/code-security/configurations"
    ],
    getConfigurationsForOrg: ["GET /orgs/{org}/code-security/configurations"],
    getDefaultConfigurations: [
      "GET /orgs/{org}/code-security/configurations/defaults"
    ],
    getDefaultConfigurationsForEnterprise: [
      "GET /enterprises/{enterprise}/code-security/configurations/defaults"
    ],
    getRepositoriesForConfiguration: [
      "GET /orgs/{org}/code-security/configurations/{configuration_id}/repositories"
    ],
    getRepositoriesForEnterpriseConfiguration: [
      "GET /enterprises/{enterprise}/code-security/configurations/{configuration_id}/repositories"
    ],
    getSingleConfigurationForEnterprise: [
      "GET /enterprises/{enterprise}/code-security/configurations/{configuration_id}"
    ],
    setConfigurationAsDefault: [
      "PUT /orgs/{org}/code-security/configurations/{configuration_id}/defaults"
    ],
    setConfigurationAsDefaultForEnterprise: [
      "PUT /enterprises/{enterprise}/code-security/configurations/{configuration_id}/defaults"
    ],
    updateConfiguration: [
      "PATCH /orgs/{org}/code-security/configurations/{configuration_id}"
    ],
    updateEnterpriseConfiguration: [
      "PATCH /enterprises/{enterprise}/code-security/configurations/{configuration_id}"
    ]
  },
  codesOfConduct: {
    getAllCodesOfConduct: ["GET /codes_of_conduct"],
    getConductCode: ["GET /codes_of_conduct/{key}"]
  },
  codespaces: {
    addRepositoryForSecretForAuthenticatedUser: [
      "PUT /user/codespaces/secrets/{secret_name}/repositories/{repository_id}"
    ],
    addSelectedRepoToOrgSecret: [
      "PUT /orgs/{org}/codespaces/secrets/{secret_name}/repositories/{repository_id}"
    ],
    checkPermissionsForDevcontainer: [
      "GET /repos/{owner}/{repo}/codespaces/permissions_check"
    ],
    codespaceMachinesForAuthenticatedUser: [
      "GET /user/codespaces/{codespace_name}/machines"
    ],
    createForAuthenticatedUser: ["POST /user/codespaces"],
    createOrUpdateOrgSecret: [
      "PUT /orgs/{org}/codespaces/secrets/{secret_name}"
    ],
    createOrUpdateRepoSecret: [
      "PUT /repos/{owner}/{repo}/codespaces/secrets/{secret_name}"
    ],
    createOrUpdateSecretForAuthenticatedUser: [
      "PUT /user/codespaces/secrets/{secret_name}"
    ],
    createWithPrForAuthenticatedUser: [
      "POST /repos/{owner}/{repo}/pulls/{pull_number}/codespaces"
    ],
    createWithRepoForAuthenticatedUser: [
      "POST /repos/{owner}/{repo}/codespaces"
    ],
    deleteForAuthenticatedUser: ["DELETE /user/codespaces/{codespace_name}"],
    deleteFromOrganization: [
      "DELETE /orgs/{org}/members/{username}/codespaces/{codespace_name}"
    ],
    deleteOrgSecret: ["DELETE /orgs/{org}/codespaces/secrets/{secret_name}"],
    deleteRepoSecret: [
      "DELETE /repos/{owner}/{repo}/codespaces/secrets/{secret_name}"
    ],
    deleteSecretForAuthenticatedUser: [
      "DELETE /user/codespaces/secrets/{secret_name}"
    ],
    exportForAuthenticatedUser: [
      "POST /user/codespaces/{codespace_name}/exports"
    ],
    getCodespacesForUserInOrg: [
      "GET /orgs/{org}/members/{username}/codespaces"
    ],
    getExportDetailsForAuthenticatedUser: [
      "GET /user/codespaces/{codespace_name}/exports/{export_id}"
    ],
    getForAuthenticatedUser: ["GET /user/codespaces/{codespace_name}"],
    getOrgPublicKey: ["GET /orgs/{org}/codespaces/secrets/public-key"],
    getOrgSecret: ["GET /orgs/{org}/codespaces/secrets/{secret_name}"],
    getPublicKeyForAuthenticatedUser: [
      "GET /user/codespaces/secrets/public-key"
    ],
    getRepoPublicKey: [
      "GET /repos/{owner}/{repo}/codespaces/secrets/public-key"
    ],
    getRepoSecret: [
      "GET /repos/{owner}/{repo}/codespaces/secrets/{secret_name}"
    ],
    getSecretForAuthenticatedUser: [
      "GET /user/codespaces/secrets/{secret_name}"
    ],
    listDevcontainersInRepositoryForAuthenticatedUser: [
      "GET /repos/{owner}/{repo}/codespaces/devcontainers"
    ],
    listForAuthenticatedUser: ["GET /user/codespaces"],
    listInOrganization: [
      "GET /orgs/{org}/codespaces",
      {},
      { renamedParameters: { org_id: "org" } }
    ],
    listInRepositoryForAuthenticatedUser: [
      "GET /repos/{owner}/{repo}/codespaces"
    ],
    listOrgSecrets: ["GET /orgs/{org}/codespaces/secrets"],
    listRepoSecrets: ["GET /repos/{owner}/{repo}/codespaces/secrets"],
    listRepositoriesForSecretForAuthenticatedUser: [
      "GET /user/codespaces/secrets/{secret_name}/repositories"
    ],
    listSecretsForAuthenticatedUser: ["GET /user/codespaces/secrets"],
    listSelectedReposForOrgSecret: [
      "GET /orgs/{org}/codespaces/secrets/{secret_name}/repositories"
    ],
    preFlightWithRepoForAuthenticatedUser: [
      "GET /repos/{owner}/{repo}/codespaces/new"
    ],
    publishForAuthenticatedUser: [
      "POST /user/codespaces/{codespace_name}/publish"
    ],
    removeRepositoryForSecretForAuthenticatedUser: [
      "DELETE /user/codespaces/secrets/{secret_name}/repositories/{repository_id}"
    ],
    removeSelectedRepoFromOrgSecret: [
      "DELETE /orgs/{org}/codespaces/secrets/{secret_name}/repositories/{repository_id}"
    ],
    repoMachinesForAuthenticatedUser: [
      "GET /repos/{owner}/{repo}/codespaces/machines"
    ],
    setRepositoriesForSecretForAuthenticatedUser: [
      "PUT /user/codespaces/secrets/{secret_name}/repositories"
    ],
    setSelectedReposForOrgSecret: [
      "PUT /orgs/{org}/codespaces/secrets/{secret_name}/repositories"
    ],
    startForAuthenticatedUser: ["POST /user/codespaces/{codespace_name}/start"],
    stopForAuthenticatedUser: ["POST /user/codespaces/{codespace_name}/stop"],
    stopInOrganization: [
      "POST /orgs/{org}/members/{username}/codespaces/{codespace_name}/stop"
    ],
    updateForAuthenticatedUser: ["PATCH /user/codespaces/{codespace_name}"]
  },
  copilot: {
    addCopilotSeatsForTeams: [
      "POST /orgs/{org}/copilot/billing/selected_teams"
    ],
    addCopilotSeatsForUsers: [
      "POST /orgs/{org}/copilot/billing/selected_users"
    ],
    cancelCopilotSeatAssignmentForTeams: [
      "DELETE /orgs/{org}/copilot/billing/selected_teams"
    ],
    cancelCopilotSeatAssignmentForUsers: [
      "DELETE /orgs/{org}/copilot/billing/selected_users"
    ],
    copilotMetricsForOrganization: ["GET /orgs/{org}/copilot/metrics"],
    copilotMetricsForTeam: ["GET /orgs/{org}/team/{team_slug}/copilot/metrics"],
    getCopilotOrganizationDetails: ["GET /orgs/{org}/copilot/billing"],
    getCopilotSeatDetailsForUser: [
      "GET /orgs/{org}/members/{username}/copilot"
    ],
    listCopilotSeats: ["GET /orgs/{org}/copilot/billing/seats"],
    usageMetricsForOrg: ["GET /orgs/{org}/copilot/usage"],
    usageMetricsForTeam: ["GET /orgs/{org}/team/{team_slug}/copilot/usage"]
  },
  dependabot: {
    addSelectedRepoToOrgSecret: [
      "PUT /orgs/{org}/dependabot/secrets/{secret_name}/repositories/{repository_id}"
    ],
    createOrUpdateOrgSecret: [
      "PUT /orgs/{org}/dependabot/secrets/{secret_name}"
    ],
    createOrUpdateRepoSecret: [
      "PUT /repos/{owner}/{repo}/dependabot/secrets/{secret_name}"
    ],
    deleteOrgSecret: ["DELETE /orgs/{org}/dependabot/secrets/{secret_name}"],
    deleteRepoSecret: [
      "DELETE /repos/{owner}/{repo}/dependabot/secrets/{secret_name}"
    ],
    getAlert: ["GET /repos/{owner}/{repo}/dependabot/alerts/{alert_number}"],
    getOrgPublicKey: ["GET /orgs/{org}/dependabot/secrets/public-key"],
    getOrgSecret: ["GET /orgs/{org}/dependabot/secrets/{secret_name}"],
    getRepoPublicKey: [
      "GET /repos/{owner}/{repo}/dependabot/secrets/public-key"
    ],
    getRepoSecret: [
      "GET /repos/{owner}/{repo}/dependabot/secrets/{secret_name}"
    ],
    listAlertsForEnterprise: [
      "GET /enterprises/{enterprise}/dependabot/alerts"
    ],
    listAlertsForOrg: ["GET /orgs/{org}/dependabot/alerts"],
    listAlertsForRepo: ["GET /repos/{owner}/{repo}/dependabot/alerts"],
    listOrgSecrets: ["GET /orgs/{org}/dependabot/secrets"],
    listRepoSecrets: ["GET /repos/{owner}/{repo}/dependabot/secrets"],
    listSelectedReposForOrgSecret: [
      "GET /orgs/{org}/dependabot/secrets/{secret_name}/repositories"
    ],
    removeSelectedRepoFromOrgSecret: [
      "DELETE /orgs/{org}/dependabot/secrets/{secret_name}/repositories/{repository_id}"
    ],
    setSelectedReposForOrgSecret: [
      "PUT /orgs/{org}/dependabot/secrets/{secret_name}/repositories"
    ],
    updateAlert: [
      "PATCH /repos/{owner}/{repo}/dependabot/alerts/{alert_number}"
    ]
  },
  dependencyGraph: {
    createRepositorySnapshot: [
      "POST /repos/{owner}/{repo}/dependency-graph/snapshots"
    ],
    diffRange: [
      "GET /repos/{owner}/{repo}/dependency-graph/compare/{basehead}"
    ],
    exportSbom: ["GET /repos/{owner}/{repo}/dependency-graph/sbom"]
  },
  emojis: { get: ["GET /emojis"] },
  gists: {
    checkIsStarred: ["GET /gists/{gist_id}/star"],
    create: ["POST /gists"],
    createComment: ["POST /gists/{gist_id}/comments"],
    delete: ["DELETE /gists/{gist_id}"],
    deleteComment: ["DELETE /gists/{gist_id}/comments/{comment_id}"],
    fork: ["POST /gists/{gist_id}/forks"],
    get: ["GET /gists/{gist_id}"],
    getComment: ["GET /gists/{gist_id}/comments/{comment_id}"],
    getRevision: ["GET /gists/{gist_id}/{sha}"],
    list: ["GET /gists"],
    listComments: ["GET /gists/{gist_id}/comments"],
    listCommits: ["GET /gists/{gist_id}/commits"],
    listForUser: ["GET /users/{username}/gists"],
    listForks: ["GET /gists/{gist_id}/forks"],
    listPublic: ["GET /gists/public"],
    listStarred: ["GET /gists/starred"],
    star: ["PUT /gists/{gist_id}/star"],
    unstar: ["DELETE /gists/{gist_id}/star"],
    update: ["PATCH /gists/{gist_id}"],
    updateComment: ["PATCH /gists/{gist_id}/comments/{comment_id}"]
  },
  git: {
    createBlob: ["POST /repos/{owner}/{repo}/git/blobs"],
    createCommit: ["POST /repos/{owner}/{repo}/git/commits"],
    createRef: ["POST /repos/{owner}/{repo}/git/refs"],
    createTag: ["POST /repos/{owner}/{repo}/git/tags"],
    createTree: ["POST /repos/{owner}/{repo}/git/trees"],
    deleteRef: ["DELETE /repos/{owner}/{repo}/git/refs/{ref}"],
    getBlob: ["GET /repos/{owner}/{repo}/git/blobs/{file_sha}"],
    getCommit: ["GET /repos/{owner}/{repo}/git/commits/{commit_sha}"],
    getRef: ["GET /repos/{owner}/{repo}/git/ref/{ref}"],
    getTag: ["GET /repos/{owner}/{repo}/git/tags/{tag_sha}"],
    getTree: ["GET /repos/{owner}/{repo}/git/trees/{tree_sha}"],
    listMatchingRefs: ["GET /repos/{owner}/{repo}/git/matching-refs/{ref}"],
    updateRef: ["PATCH /repos/{owner}/{repo}/git/refs/{ref}"]
  },
  gitignore: {
    getAllTemplates: ["GET /gitignore/templates"],
    getTemplate: ["GET /gitignore/templates/{name}"]
  },
  interactions: {
    getRestrictionsForAuthenticatedUser: ["GET /user/interaction-limits"],
    getRestrictionsForOrg: ["GET /orgs/{org}/interaction-limits"],
    getRestrictionsForRepo: ["GET /repos/{owner}/{repo}/interaction-limits"],
    getRestrictionsForYourPublicRepos: [
      "GET /user/interaction-limits",
      {},
      { renamed: ["interactions", "getRestrictionsForAuthenticatedUser"] }
    ],
    removeRestrictionsForAuthenticatedUser: ["DELETE /user/interaction-limits"],
    removeRestrictionsForOrg: ["DELETE /orgs/{org}/interaction-limits"],
    removeRestrictionsForRepo: [
      "DELETE /repos/{owner}/{repo}/interaction-limits"
    ],
    removeRestrictionsForYourPublicRepos: [
      "DELETE /user/interaction-limits",
      {},
      { renamed: ["interactions", "removeRestrictionsForAuthenticatedUser"] }
    ],
    setRestrictionsForAuthenticatedUser: ["PUT /user/interaction-limits"],
    setRestrictionsForOrg: ["PUT /orgs/{org}/interaction-limits"],
    setRestrictionsForRepo: ["PUT /repos/{owner}/{repo}/interaction-limits"],
    setRestrictionsForYourPublicRepos: [
      "PUT /user/interaction-limits",
      {},
      { renamed: ["interactions", "setRestrictionsForAuthenticatedUser"] }
    ]
  },
  issues: {
    addAssignees: [
      "POST /repos/{owner}/{repo}/issues/{issue_number}/assignees"
    ],
    addLabels: ["POST /repos/{owner}/{repo}/issues/{issue_number}/labels"],
    addSubIssue: [
      "POST /repos/{owner}/{repo}/issues/{issue_number}/sub_issues"
    ],
    checkUserCanBeAssigned: ["GET /repos/{owner}/{repo}/assignees/{assignee}"],
    checkUserCanBeAssignedToIssue: [
      "GET /repos/{owner}/{repo}/issues/{issue_number}/assignees/{assignee}"
    ],
    create: ["POST /repos/{owner}/{repo}/issues"],
    createComment: [
      "POST /repos/{owner}/{repo}/issues/{issue_number}/comments"
    ],
    createLabel: ["POST /repos/{owner}/{repo}/labels"],
    createMilestone: ["POST /repos/{owner}/{repo}/milestones"],
    deleteComment: [
      "DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}"
    ],
    deleteLabel: ["DELETE /repos/{owner}/{repo}/labels/{name}"],
    deleteMilestone: [
      "DELETE /repos/{owner}/{repo}/milestones/{milestone_number}"
    ],
    get: ["GET /repos/{owner}/{repo}/issues/{issue_number}"],
    getComment: ["GET /repos/{owner}/{repo}/issues/comments/{comment_id}"],
    getEvent: ["GET /repos/{owner}/{repo}/issues/events/{event_id}"],
    getLabel: ["GET /repos/{owner}/{repo}/labels/{name}"],
    getMilestone: ["GET /repos/{owner}/{repo}/milestones/{milestone_number}"],
    list: ["GET /issues"],
    listAssignees: ["GET /repos/{owner}/{repo}/assignees"],
    listComments: ["GET /repos/{owner}/{repo}/issues/{issue_number}/comments"],
    listCommentsForRepo: ["GET /repos/{owner}/{repo}/issues/comments"],
    listEvents: ["GET /repos/{owner}/{repo}/issues/{issue_number}/events"],
    listEventsForRepo: ["GET /repos/{owner}/{repo}/issues/events"],
    listEventsForTimeline: [
      "GET /repos/{owner}/{repo}/issues/{issue_number}/timeline"
    ],
    listForAuthenticatedUser: ["GET /user/issues"],
    listForOrg: ["GET /orgs/{org}/issues"],
    listForRepo: ["GET /repos/{owner}/{repo}/issues"],
    listLabelsForMilestone: [
      "GET /repos/{owner}/{repo}/milestones/{milestone_number}/labels"
    ],
    listLabelsForRepo: ["GET /repos/{owner}/{repo}/labels"],
    listLabelsOnIssue: [
      "GET /repos/{owner}/{repo}/issues/{issue_number}/labels"
    ],
    listMilestones: ["GET /repos/{owner}/{repo}/milestones"],
    listSubIssues: [
      "GET /repos/{owner}/{repo}/issues/{issue_number}/sub_issues"
    ],
    lock: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/lock"],
    removeAllLabels: [
      "DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels"
    ],
    removeAssignees: [
      "DELETE /repos/{owner}/{repo}/issues/{issue_number}/assignees"
    ],
    removeLabel: [
      "DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{name}"
    ],
    removeSubIssue: [
      "DELETE /repos/{owner}/{repo}/issues/{issue_number}/sub_issue"
    ],
    reprioritizeSubIssue: [
      "PATCH /repos/{owner}/{repo}/issues/{issue_number}/sub_issues/priority"
    ],
    setLabels: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/labels"],
    unlock: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/lock"],
    update: ["PATCH /repos/{owner}/{repo}/issues/{issue_number}"],
    updateComment: ["PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}"],
    updateLabel: ["PATCH /repos/{owner}/{repo}/labels/{name}"],
    updateMilestone: [
      "PATCH /repos/{owner}/{repo}/milestones/{milestone_number}"
    ]
  },
  licenses: {
    get: ["GET /licenses/{license}"],
    getAllCommonlyUsed: ["GET /licenses"],
    getForRepo: ["GET /repos/{owner}/{repo}/license"]
  },
  markdown: {
    render: ["POST /markdown"],
    renderRaw: [
      "POST /markdown/raw",
      { headers: { "content-type": "text/plain; charset=utf-8" } }
    ]
  },
  meta: {
    get: ["GET /meta"],
    getAllVersions: ["GET /versions"],
    getOctocat: ["GET /octocat"],
    getZen: ["GET /zen"],
    root: ["GET /"]
  },
  migrations: {
    deleteArchiveForAuthenticatedUser: [
      "DELETE /user/migrations/{migration_id}/archive"
    ],
    deleteArchiveForOrg: [
      "DELETE /orgs/{org}/migrations/{migration_id}/archive"
    ],
    downloadArchiveForOrg: [
      "GET /orgs/{org}/migrations/{migration_id}/archive"
    ],
    getArchiveForAuthenticatedUser: [
      "GET /user/migrations/{migration_id}/archive"
    ],
    getStatusForAuthenticatedUser: ["GET /user/migrations/{migration_id}"],
    getStatusForOrg: ["GET /orgs/{org}/migrations/{migration_id}"],
    listForAuthenticatedUser: ["GET /user/migrations"],
    listForOrg: ["GET /orgs/{org}/migrations"],
    listReposForAuthenticatedUser: [
      "GET /user/migrations/{migration_id}/repositories"
    ],
    listReposForOrg: ["GET /orgs/{org}/migrations/{migration_id}/repositories"],
    listReposForUser: [
      "GET /user/migrations/{migration_id}/repositories",
      {},
      { renamed: ["migrations", "listReposForAuthenticatedUser"] }
    ],
    startForAuthenticatedUser: ["POST /user/migrations"],
    startForOrg: ["POST /orgs/{org}/migrations"],
    unlockRepoForAuthenticatedUser: [
      "DELETE /user/migrations/{migration_id}/repos/{repo_name}/lock"
    ],
    unlockRepoForOrg: [
      "DELETE /orgs/{org}/migrations/{migration_id}/repos/{repo_name}/lock"
    ]
  },
  oidc: {
    getOidcCustomSubTemplateForOrg: [
      "GET /orgs/{org}/actions/oidc/customization/sub"
    ],
    updateOidcCustomSubTemplateForOrg: [
      "PUT /orgs/{org}/actions/oidc/customization/sub"
    ]
  },
  orgs: {
    addSecurityManagerTeam: [
      "PUT /orgs/{org}/security-managers/teams/{team_slug}",
      {},
      {
        deprecated: "octokit.rest.orgs.addSecurityManagerTeam() is deprecated, see https://docs.github.com/rest/orgs/security-managers#add-a-security-manager-team"
      }
    ],
    assignTeamToOrgRole: [
      "PUT /orgs/{org}/organization-roles/teams/{team_slug}/{role_id}"
    ],
    assignUserToOrgRole: [
      "PUT /orgs/{org}/organization-roles/users/{username}/{role_id}"
    ],
    blockUser: ["PUT /orgs/{org}/blocks/{username}"],
    cancelInvitation: ["DELETE /orgs/{org}/invitations/{invitation_id}"],
    checkBlockedUser: ["GET /orgs/{org}/blocks/{username}"],
    checkMembershipForUser: ["GET /orgs/{org}/members/{username}"],
    checkPublicMembershipForUser: ["GET /orgs/{org}/public_members/{username}"],
    convertMemberToOutsideCollaborator: [
      "PUT /orgs/{org}/outside_collaborators/{username}"
    ],
    createInvitation: ["POST /orgs/{org}/invitations"],
    createOrUpdateCustomProperties: ["PATCH /orgs/{org}/properties/schema"],
    createOrUpdateCustomPropertiesValuesForRepos: [
      "PATCH /orgs/{org}/properties/values"
    ],
    createOrUpdateCustomProperty: [
      "PUT /orgs/{org}/properties/schema/{custom_property_name}"
    ],
    createWebhook: ["POST /orgs/{org}/hooks"],
    delete: ["DELETE /orgs/{org}"],
    deleteWebhook: ["DELETE /orgs/{org}/hooks/{hook_id}"],
    enableOrDisableSecurityProductOnAllOrgRepos: [
      "POST /orgs/{org}/{security_product}/{enablement}",
      {},
      {
        deprecated: "octokit.rest.orgs.enableOrDisableSecurityProductOnAllOrgRepos() is deprecated, see https://docs.github.com/rest/orgs/orgs#enable-or-disable-a-security-feature-for-an-organization"
      }
    ],
    get: ["GET /orgs/{org}"],
    getAllCustomProperties: ["GET /orgs/{org}/properties/schema"],
    getCustomProperty: [
      "GET /orgs/{org}/properties/schema/{custom_property_name}"
    ],
    getMembershipForAuthenticatedUser: ["GET /user/memberships/orgs/{org}"],
    getMembershipForUser: ["GET /orgs/{org}/memberships/{username}"],
    getOrgRole: ["GET /orgs/{org}/organization-roles/{role_id}"],
    getWebhook: ["GET /orgs/{org}/hooks/{hook_id}"],
    getWebhookConfigForOrg: ["GET /orgs/{org}/hooks/{hook_id}/config"],
    getWebhookDelivery: [
      "GET /orgs/{org}/hooks/{hook_id}/deliveries/{delivery_id}"
    ],
    list: ["GET /organizations"],
    listAppInstallations: ["GET /orgs/{org}/installations"],
    listAttestations: ["GET /orgs/{org}/attestations/{subject_digest}"],
    listBlockedUsers: ["GET /orgs/{org}/blocks"],
    listCustomPropertiesValuesForRepos: ["GET /orgs/{org}/properties/values"],
    listFailedInvitations: ["GET /orgs/{org}/failed_invitations"],
    listForAuthenticatedUser: ["GET /user/orgs"],
    listForUser: ["GET /users/{username}/orgs"],
    listInvitationTeams: ["GET /orgs/{org}/invitations/{invitation_id}/teams"],
    listMembers: ["GET /orgs/{org}/members"],
    listMembershipsForAuthenticatedUser: ["GET /user/memberships/orgs"],
    listOrgRoleTeams: ["GET /orgs/{org}/organization-roles/{role_id}/teams"],
    listOrgRoleUsers: ["GET /orgs/{org}/organization-roles/{role_id}/users"],
    listOrgRoles: ["GET /orgs/{org}/organization-roles"],
    listOrganizationFineGrainedPermissions: [
      "GET /orgs/{org}/organization-fine-grained-permissions"
    ],
    listOutsideCollaborators: ["GET /orgs/{org}/outside_collaborators"],
    listPatGrantRepositories: [
      "GET /orgs/{org}/personal-access-tokens/{pat_id}/repositories"
    ],
    listPatGrantRequestRepositories: [
      "GET /orgs/{org}/personal-access-token-requests/{pat_request_id}/repositories"
    ],
    listPatGrantRequests: ["GET /orgs/{org}/personal-access-token-requests"],
    listPatGrants: ["GET /orgs/{org}/personal-access-tokens"],
    listPendingInvitations: ["GET /orgs/{org}/invitations"],
    listPublicMembers: ["GET /orgs/{org}/public_members"],
    listSecurityManagerTeams: [
      "GET /orgs/{org}/security-managers",
      {},
      {
        deprecated: "octokit.rest.orgs.listSecurityManagerTeams() is deprecated, see https://docs.github.com/rest/orgs/security-managers#list-security-manager-teams"
      }
    ],
    listWebhookDeliveries: ["GET /orgs/{org}/hooks/{hook_id}/deliveries"],
    listWebhooks: ["GET /orgs/{org}/hooks"],
    pingWebhook: ["POST /orgs/{org}/hooks/{hook_id}/pings"],
    redeliverWebhookDelivery: [
      "POST /orgs/{org}/hooks/{hook_id}/deliveries/{delivery_id}/attempts"
    ],
    removeCustomProperty: [
      "DELETE /orgs/{org}/properties/schema/{custom_property_name}"
    ],
    removeMember: ["DELETE /orgs/{org}/members/{username}"],
    removeMembershipForUser: ["DELETE /orgs/{org}/memberships/{username}"],
    removeOutsideCollaborator: [
      "DELETE /orgs/{org}/outside_collaborators/{username}"
    ],
    removePublicMembershipForAuthenticatedUser: [
      "DELETE /orgs/{org}/public_members/{username}"
    ],
    removeSecurityManagerTeam: [
      "DELETE /orgs/{org}/security-managers/teams/{team_slug}",
      {},
      {
        deprecated: "octokit.rest.orgs.removeSecurityManagerTeam() is deprecated, see https://docs.github.com/rest/orgs/security-managers#remove-a-security-manager-team"
      }
    ],
    reviewPatGrantRequest: [
      "POST /orgs/{org}/personal-access-token-requests/{pat_request_id}"
    ],
    reviewPatGrantRequestsInBulk: [
      "POST /orgs/{org}/personal-access-token-requests"
    ],
    revokeAllOrgRolesTeam: [
      "DELETE /orgs/{org}/organization-roles/teams/{team_slug}"
    ],
    revokeAllOrgRolesUser: [
      "DELETE /orgs/{org}/organization-roles/users/{username}"
    ],
    revokeOrgRoleTeam: [
      "DELETE /orgs/{org}/organization-roles/teams/{team_slug}/{role_id}"
    ],
    revokeOrgRoleUser: [
      "DELETE /orgs/{org}/organization-roles/users/{username}/{role_id}"
    ],
    setMembershipForUser: ["PUT /orgs/{org}/memberships/{username}"],
    setPublicMembershipForAuthenticatedUser: [
      "PUT /orgs/{org}/public_members/{username}"
    ],
    unblockUser: ["DELETE /orgs/{org}/blocks/{username}"],
    update: ["PATCH /orgs/{org}"],
    updateMembershipForAuthenticatedUser: [
      "PATCH /user/memberships/orgs/{org}"
    ],
    updatePatAccess: ["POST /orgs/{org}/personal-access-tokens/{pat_id}"],
    updatePatAccesses: ["POST /orgs/{org}/personal-access-tokens"],
    updateWebhook: ["PATCH /orgs/{org}/hooks/{hook_id}"],
    updateWebhookConfigForOrg: ["PATCH /orgs/{org}/hooks/{hook_id}/config"]
  },
  packages: {
    deletePackageForAuthenticatedUser: [
      "DELETE /user/packages/{package_type}/{package_name}"
    ],
    deletePackageForOrg: [
      "DELETE /orgs/{org}/packages/{package_type}/{package_name}"
    ],
    deletePackageForUser: [
      "DELETE /users/{username}/packages/{package_type}/{package_name}"
    ],
    deletePackageVersionForAuthenticatedUser: [
      "DELETE /user/packages/{package_type}/{package_name}/versions/{package_version_id}"
    ],
    deletePackageVersionForOrg: [
      "DELETE /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}"
    ],
    deletePackageVersionForUser: [
      "DELETE /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}"
    ],
    getAllPackageVersionsForAPackageOwnedByAnOrg: [
      "GET /orgs/{org}/packages/{package_type}/{package_name}/versions",
      {},
      { renamed: ["packages", "getAllPackageVersionsForPackageOwnedByOrg"] }
    ],
    getAllPackageVersionsForAPackageOwnedByTheAuthenticatedUser: [
      "GET /user/packages/{package_type}/{package_name}/versions",
      {},
      {
        renamed: [
          "packages",
          "getAllPackageVersionsForPackageOwnedByAuthenticatedUser"
        ]
      }
    ],
    getAllPackageVersionsForPackageOwnedByAuthenticatedUser: [
      "GET /user/packages/{package_type}/{package_name}/versions"
    ],
    getAllPackageVersionsForPackageOwnedByOrg: [
      "GET /orgs/{org}/packages/{package_type}/{package_name}/versions"
    ],
    getAllPackageVersionsForPackageOwnedByUser: [
      "GET /users/{username}/packages/{package_type}/{package_name}/versions"
    ],
    getPackageForAuthenticatedUser: [
      "GET /user/packages/{package_type}/{package_name}"
    ],
    getPackageForOrganization: [
      "GET /orgs/{org}/packages/{package_type}/{package_name}"
    ],
    getPackageForUser: [
      "GET /users/{username}/packages/{package_type}/{package_name}"
    ],
    getPackageVersionForAuthenticatedUser: [
      "GET /user/packages/{package_type}/{package_name}/versions/{package_version_id}"
    ],
    getPackageVersionForOrganization: [
      "GET /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}"
    ],
    getPackageVersionForUser: [
      "GET /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}"
    ],
    listDockerMigrationConflictingPackagesForAuthenticatedUser: [
      "GET /user/docker/conflicts"
    ],
    listDockerMigrationConflictingPackagesForOrganization: [
      "GET /orgs/{org}/docker/conflicts"
    ],
    listDockerMigrationConflictingPackagesForUser: [
      "GET /users/{username}/docker/conflicts"
    ],
    listPackagesForAuthenticatedUser: ["GET /user/packages"],
    listPackagesForOrganization: ["GET /orgs/{org}/packages"],
    listPackagesForUser: ["GET /users/{username}/packages"],
    restorePackageForAuthenticatedUser: [
      "POST /user/packages/{package_type}/{package_name}/restore{?token}"
    ],
    restorePackageForOrg: [
      "POST /orgs/{org}/packages/{package_type}/{package_name}/restore{?token}"
    ],
    restorePackageForUser: [
      "POST /users/{username}/packages/{package_type}/{package_name}/restore{?token}"
    ],
    restorePackageVersionForAuthenticatedUser: [
      "POST /user/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"
    ],
    restorePackageVersionForOrg: [
      "POST /orgs/{org}/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"
    ],
    restorePackageVersionForUser: [
      "POST /users/{username}/packages/{package_type}/{package_name}/versions/{package_version_id}/restore"
    ]
  },
  privateRegistries: {
    createOrgPrivateRegistry: ["POST /orgs/{org}/private-registries"],
    deleteOrgPrivateRegistry: [
      "DELETE /orgs/{org}/private-registries/{secret_name}"
    ],
    getOrgPrivateRegistry: ["GET /orgs/{org}/private-registries/{secret_name}"],
    getOrgPublicKey: ["GET /orgs/{org}/private-registries/public-key"],
    listOrgPrivateRegistries: ["GET /orgs/{org}/private-registries"],
    updateOrgPrivateRegistry: [
      "PATCH /orgs/{org}/private-registries/{secret_name}"
    ]
  },
  projects: {
    addCollaborator: ["PUT /projects/{project_id}/collaborators/{username}"],
    createCard: ["POST /projects/columns/{column_id}/cards"],
    createColumn: ["POST /projects/{project_id}/columns"],
    createForAuthenticatedUser: ["POST /user/projects"],
    createForOrg: ["POST /orgs/{org}/projects"],
    createForRepo: ["POST /repos/{owner}/{repo}/projects"],
    delete: ["DELETE /projects/{project_id}"],
    deleteCard: ["DELETE /projects/columns/cards/{card_id}"],
    deleteColumn: ["DELETE /projects/columns/{column_id}"],
    get: ["GET /projects/{project_id}"],
    getCard: ["GET /projects/columns/cards/{card_id}"],
    getColumn: ["GET /projects/columns/{column_id}"],
    getPermissionForUser: [
      "GET /projects/{project_id}/collaborators/{username}/permission"
    ],
    listCards: ["GET /projects/columns/{column_id}/cards"],
    listCollaborators: ["GET /projects/{project_id}/collaborators"],
    listColumns: ["GET /projects/{project_id}/columns"],
    listForOrg: ["GET /orgs/{org}/projects"],
    listForRepo: ["GET /repos/{owner}/{repo}/projects"],
    listForUser: ["GET /users/{username}/projects"],
    moveCard: ["POST /projects/columns/cards/{card_id}/moves"],
    moveColumn: ["POST /projects/columns/{column_id}/moves"],
    removeCollaborator: [
      "DELETE /projects/{project_id}/collaborators/{username}"
    ],
    update: ["PATCH /projects/{project_id}"],
    updateCard: ["PATCH /projects/columns/cards/{card_id}"],
    updateColumn: ["PATCH /projects/columns/{column_id}"]
  },
  pulls: {
    checkIfMerged: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
    create: ["POST /repos/{owner}/{repo}/pulls"],
    createReplyForReviewComment: [
      "POST /repos/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies"
    ],
    createReview: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
    createReviewComment: [
      "POST /repos/{owner}/{repo}/pulls/{pull_number}/comments"
    ],
    deletePendingReview: [
      "DELETE /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"
    ],
    deleteReviewComment: [
      "DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}"
    ],
    dismissReview: [
      "PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/dismissals"
    ],
    get: ["GET /repos/{owner}/{repo}/pulls/{pull_number}"],
    getReview: [
      "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"
    ],
    getReviewComment: ["GET /repos/{owner}/{repo}/pulls/comments/{comment_id}"],
    list: ["GET /repos/{owner}/{repo}/pulls"],
    listCommentsForReview: [
      "GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments"
    ],
    listCommits: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/commits"],
    listFiles: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/files"],
    listRequestedReviewers: [
      "GET /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"
    ],
    listReviewComments: [
      "GET /repos/{owner}/{repo}/pulls/{pull_number}/comments"
    ],
    listReviewCommentsForRepo: ["GET /repos/{owner}/{repo}/pulls/comments"],
    listReviews: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
    merge: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
    removeRequestedReviewers: [
      "DELETE /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"
    ],
    requestReviewers: [
      "POST /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"
    ],
    submitReview: [
      "POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/events"
    ],
    update: ["PATCH /repos/{owner}/{repo}/pulls/{pull_number}"],
    updateBranch: [
      "PUT /repos/{owner}/{repo}/pulls/{pull_number}/update-branch"
    ],
    updateReview: [
      "PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"
    ],
    updateReviewComment: [
      "PATCH /repos/{owner}/{repo}/pulls/comments/{comment_id}"
    ]
  },
  rateLimit: { get: ["GET /rate_limit"] },
  reactions: {
    createForCommitComment: [
      "POST /repos/{owner}/{repo}/comments/{comment_id}/reactions"
    ],
    createForIssue: [
      "POST /repos/{owner}/{repo}/issues/{issue_number}/reactions"
    ],
    createForIssueComment: [
      "POST /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions"
    ],
    createForPullRequestReviewComment: [
      "POST /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions"
    ],
    createForRelease: [
      "POST /repos/{owner}/{repo}/releases/{release_id}/reactions"
    ],
    createForTeamDiscussionCommentInOrg: [
      "POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions"
    ],
    createForTeamDiscussionInOrg: [
      "POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions"
    ],
    deleteForCommitComment: [
      "DELETE /repos/{owner}/{repo}/comments/{comment_id}/reactions/{reaction_id}"
    ],
    deleteForIssue: [
      "DELETE /repos/{owner}/{repo}/issues/{issue_number}/reactions/{reaction_id}"
    ],
    deleteForIssueComment: [
      "DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions/{reaction_id}"
    ],
    deleteForPullRequestComment: [
      "DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions/{reaction_id}"
    ],
    deleteForRelease: [
      "DELETE /repos/{owner}/{repo}/releases/{release_id}/reactions/{reaction_id}"
    ],
    deleteForTeamDiscussion: [
      "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions/{reaction_id}"
    ],
    deleteForTeamDiscussionComment: [
      "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions/{reaction_id}"
    ],
    listForCommitComment: [
      "GET /repos/{owner}/{repo}/comments/{comment_id}/reactions"
    ],
    listForIssue: ["GET /repos/{owner}/{repo}/issues/{issue_number}/reactions"],
    listForIssueComment: [
      "GET /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions"
    ],
    listForPullRequestReviewComment: [
      "GET /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions"
    ],
    listForRelease: [
      "GET /repos/{owner}/{repo}/releases/{release_id}/reactions"
    ],
    listForTeamDiscussionCommentInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions"
    ],
    listForTeamDiscussionInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions"
    ]
  },
  repos: {
    acceptInvitation: [
      "PATCH /user/repository_invitations/{invitation_id}",
      {},
      { renamed: ["repos", "acceptInvitationForAuthenticatedUser"] }
    ],
    acceptInvitationForAuthenticatedUser: [
      "PATCH /user/repository_invitations/{invitation_id}"
    ],
    addAppAccessRestrictions: [
      "POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
      {},
      { mapToData: "apps" }
    ],
    addCollaborator: ["PUT /repos/{owner}/{repo}/collaborators/{username}"],
    addStatusCheckContexts: [
      "POST /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
      {},
      { mapToData: "contexts" }
    ],
    addTeamAccessRestrictions: [
      "POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
      {},
      { mapToData: "teams" }
    ],
    addUserAccessRestrictions: [
      "POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
      {},
      { mapToData: "users" }
    ],
    cancelPagesDeployment: [
      "POST /repos/{owner}/{repo}/pages/deployments/{pages_deployment_id}/cancel"
    ],
    checkAutomatedSecurityFixes: [
      "GET /repos/{owner}/{repo}/automated-security-fixes"
    ],
    checkCollaborator: ["GET /repos/{owner}/{repo}/collaborators/{username}"],
    checkPrivateVulnerabilityReporting: [
      "GET /repos/{owner}/{repo}/private-vulnerability-reporting"
    ],
    checkVulnerabilityAlerts: [
      "GET /repos/{owner}/{repo}/vulnerability-alerts"
    ],
    codeownersErrors: ["GET /repos/{owner}/{repo}/codeowners/errors"],
    compareCommits: ["GET /repos/{owner}/{repo}/compare/{base}...{head}"],
    compareCommitsWithBasehead: [
      "GET /repos/{owner}/{repo}/compare/{basehead}"
    ],
    createAttestation: ["POST /repos/{owner}/{repo}/attestations"],
    createAutolink: ["POST /repos/{owner}/{repo}/autolinks"],
    createCommitComment: [
      "POST /repos/{owner}/{repo}/commits/{commit_sha}/comments"
    ],
    createCommitSignatureProtection: [
      "POST /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures"
    ],
    createCommitStatus: ["POST /repos/{owner}/{repo}/statuses/{sha}"],
    createDeployKey: ["POST /repos/{owner}/{repo}/keys"],
    createDeployment: ["POST /repos/{owner}/{repo}/deployments"],
    createDeploymentBranchPolicy: [
      "POST /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies"
    ],
    createDeploymentProtectionRule: [
      "POST /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules"
    ],
    createDeploymentStatus: [
      "POST /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"
    ],
    createDispatchEvent: ["POST /repos/{owner}/{repo}/dispatches"],
    createForAuthenticatedUser: ["POST /user/repos"],
    createFork: ["POST /repos/{owner}/{repo}/forks"],
    createInOrg: ["POST /orgs/{org}/repos"],
    createOrUpdateCustomPropertiesValues: [
      "PATCH /repos/{owner}/{repo}/properties/values"
    ],
    createOrUpdateEnvironment: [
      "PUT /repos/{owner}/{repo}/environments/{environment_name}"
    ],
    createOrUpdateFileContents: ["PUT /repos/{owner}/{repo}/contents/{path}"],
    createOrgRuleset: ["POST /orgs/{org}/rulesets"],
    createPagesDeployment: ["POST /repos/{owner}/{repo}/pages/deployments"],
    createPagesSite: ["POST /repos/{owner}/{repo}/pages"],
    createRelease: ["POST /repos/{owner}/{repo}/releases"],
    createRepoRuleset: ["POST /repos/{owner}/{repo}/rulesets"],
    createUsingTemplate: [
      "POST /repos/{template_owner}/{template_repo}/generate"
    ],
    createWebhook: ["POST /repos/{owner}/{repo}/hooks"],
    declineInvitation: [
      "DELETE /user/repository_invitations/{invitation_id}",
      {},
      { renamed: ["repos", "declineInvitationForAuthenticatedUser"] }
    ],
    declineInvitationForAuthenticatedUser: [
      "DELETE /user/repository_invitations/{invitation_id}"
    ],
    delete: ["DELETE /repos/{owner}/{repo}"],
    deleteAccessRestrictions: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"
    ],
    deleteAdminBranchProtection: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"
    ],
    deleteAnEnvironment: [
      "DELETE /repos/{owner}/{repo}/environments/{environment_name}"
    ],
    deleteAutolink: ["DELETE /repos/{owner}/{repo}/autolinks/{autolink_id}"],
    deleteBranchProtection: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection"
    ],
    deleteCommitComment: ["DELETE /repos/{owner}/{repo}/comments/{comment_id}"],
    deleteCommitSignatureProtection: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures"
    ],
    deleteDeployKey: ["DELETE /repos/{owner}/{repo}/keys/{key_id}"],
    deleteDeployment: [
      "DELETE /repos/{owner}/{repo}/deployments/{deployment_id}"
    ],
    deleteDeploymentBranchPolicy: [
      "DELETE /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}"
    ],
    deleteFile: ["DELETE /repos/{owner}/{repo}/contents/{path}"],
    deleteInvitation: [
      "DELETE /repos/{owner}/{repo}/invitations/{invitation_id}"
    ],
    deleteOrgRuleset: ["DELETE /orgs/{org}/rulesets/{ruleset_id}"],
    deletePagesSite: ["DELETE /repos/{owner}/{repo}/pages"],
    deletePullRequestReviewProtection: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"
    ],
    deleteRelease: ["DELETE /repos/{owner}/{repo}/releases/{release_id}"],
    deleteReleaseAsset: [
      "DELETE /repos/{owner}/{repo}/releases/assets/{asset_id}"
    ],
    deleteRepoRuleset: ["DELETE /repos/{owner}/{repo}/rulesets/{ruleset_id}"],
    deleteWebhook: ["DELETE /repos/{owner}/{repo}/hooks/{hook_id}"],
    disableAutomatedSecurityFixes: [
      "DELETE /repos/{owner}/{repo}/automated-security-fixes"
    ],
    disableDeploymentProtectionRule: [
      "DELETE /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/{protection_rule_id}"
    ],
    disablePrivateVulnerabilityReporting: [
      "DELETE /repos/{owner}/{repo}/private-vulnerability-reporting"
    ],
    disableVulnerabilityAlerts: [
      "DELETE /repos/{owner}/{repo}/vulnerability-alerts"
    ],
    downloadArchive: [
      "GET /repos/{owner}/{repo}/zipball/{ref}",
      {},
      { renamed: ["repos", "downloadZipballArchive"] }
    ],
    downloadTarballArchive: ["GET /repos/{owner}/{repo}/tarball/{ref}"],
    downloadZipballArchive: ["GET /repos/{owner}/{repo}/zipball/{ref}"],
    enableAutomatedSecurityFixes: [
      "PUT /repos/{owner}/{repo}/automated-security-fixes"
    ],
    enablePrivateVulnerabilityReporting: [
      "PUT /repos/{owner}/{repo}/private-vulnerability-reporting"
    ],
    enableVulnerabilityAlerts: [
      "PUT /repos/{owner}/{repo}/vulnerability-alerts"
    ],
    generateReleaseNotes: [
      "POST /repos/{owner}/{repo}/releases/generate-notes"
    ],
    get: ["GET /repos/{owner}/{repo}"],
    getAccessRestrictions: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"
    ],
    getAdminBranchProtection: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"
    ],
    getAllDeploymentProtectionRules: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules"
    ],
    getAllEnvironments: ["GET /repos/{owner}/{repo}/environments"],
    getAllStatusCheckContexts: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts"
    ],
    getAllTopics: ["GET /repos/{owner}/{repo}/topics"],
    getAppsWithAccessToProtectedBranch: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps"
    ],
    getAutolink: ["GET /repos/{owner}/{repo}/autolinks/{autolink_id}"],
    getBranch: ["GET /repos/{owner}/{repo}/branches/{branch}"],
    getBranchProtection: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection"
    ],
    getBranchRules: ["GET /repos/{owner}/{repo}/rules/branches/{branch}"],
    getClones: ["GET /repos/{owner}/{repo}/traffic/clones"],
    getCodeFrequencyStats: ["GET /repos/{owner}/{repo}/stats/code_frequency"],
    getCollaboratorPermissionLevel: [
      "GET /repos/{owner}/{repo}/collaborators/{username}/permission"
    ],
    getCombinedStatusForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/status"],
    getCommit: ["GET /repos/{owner}/{repo}/commits/{ref}"],
    getCommitActivityStats: ["GET /repos/{owner}/{repo}/stats/commit_activity"],
    getCommitComment: ["GET /repos/{owner}/{repo}/comments/{comment_id}"],
    getCommitSignatureProtection: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures"
    ],
    getCommunityProfileMetrics: ["GET /repos/{owner}/{repo}/community/profile"],
    getContent: ["GET /repos/{owner}/{repo}/contents/{path}"],
    getContributorsStats: ["GET /repos/{owner}/{repo}/stats/contributors"],
    getCustomDeploymentProtectionRule: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/{protection_rule_id}"
    ],
    getCustomPropertiesValues: ["GET /repos/{owner}/{repo}/properties/values"],
    getDeployKey: ["GET /repos/{owner}/{repo}/keys/{key_id}"],
    getDeployment: ["GET /repos/{owner}/{repo}/deployments/{deployment_id}"],
    getDeploymentBranchPolicy: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}"
    ],
    getDeploymentStatus: [
      "GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses/{status_id}"
    ],
    getEnvironment: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}"
    ],
    getLatestPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/latest"],
    getLatestRelease: ["GET /repos/{owner}/{repo}/releases/latest"],
    getOrgRuleSuite: ["GET /orgs/{org}/rulesets/rule-suites/{rule_suite_id}"],
    getOrgRuleSuites: ["GET /orgs/{org}/rulesets/rule-suites"],
    getOrgRuleset: ["GET /orgs/{org}/rulesets/{ruleset_id}"],
    getOrgRulesets: ["GET /orgs/{org}/rulesets"],
    getPages: ["GET /repos/{owner}/{repo}/pages"],
    getPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/{build_id}"],
    getPagesDeployment: [
      "GET /repos/{owner}/{repo}/pages/deployments/{pages_deployment_id}"
    ],
    getPagesHealthCheck: ["GET /repos/{owner}/{repo}/pages/health"],
    getParticipationStats: ["GET /repos/{owner}/{repo}/stats/participation"],
    getPullRequestReviewProtection: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"
    ],
    getPunchCardStats: ["GET /repos/{owner}/{repo}/stats/punch_card"],
    getReadme: ["GET /repos/{owner}/{repo}/readme"],
    getReadmeInDirectory: ["GET /repos/{owner}/{repo}/readme/{dir}"],
    getRelease: ["GET /repos/{owner}/{repo}/releases/{release_id}"],
    getReleaseAsset: ["GET /repos/{owner}/{repo}/releases/assets/{asset_id}"],
    getReleaseByTag: ["GET /repos/{owner}/{repo}/releases/tags/{tag}"],
    getRepoRuleSuite: [
      "GET /repos/{owner}/{repo}/rulesets/rule-suites/{rule_suite_id}"
    ],
    getRepoRuleSuites: ["GET /repos/{owner}/{repo}/rulesets/rule-suites"],
    getRepoRuleset: ["GET /repos/{owner}/{repo}/rulesets/{ruleset_id}"],
    getRepoRulesets: ["GET /repos/{owner}/{repo}/rulesets"],
    getStatusChecksProtection: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"
    ],
    getTeamsWithAccessToProtectedBranch: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams"
    ],
    getTopPaths: ["GET /repos/{owner}/{repo}/traffic/popular/paths"],
    getTopReferrers: ["GET /repos/{owner}/{repo}/traffic/popular/referrers"],
    getUsersWithAccessToProtectedBranch: [
      "GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users"
    ],
    getViews: ["GET /repos/{owner}/{repo}/traffic/views"],
    getWebhook: ["GET /repos/{owner}/{repo}/hooks/{hook_id}"],
    getWebhookConfigForRepo: [
      "GET /repos/{owner}/{repo}/hooks/{hook_id}/config"
    ],
    getWebhookDelivery: [
      "GET /repos/{owner}/{repo}/hooks/{hook_id}/deliveries/{delivery_id}"
    ],
    listActivities: ["GET /repos/{owner}/{repo}/activity"],
    listAttestations: [
      "GET /repos/{owner}/{repo}/attestations/{subject_digest}"
    ],
    listAutolinks: ["GET /repos/{owner}/{repo}/autolinks"],
    listBranches: ["GET /repos/{owner}/{repo}/branches"],
    listBranchesForHeadCommit: [
      "GET /repos/{owner}/{repo}/commits/{commit_sha}/branches-where-head"
    ],
    listCollaborators: ["GET /repos/{owner}/{repo}/collaborators"],
    listCommentsForCommit: [
      "GET /repos/{owner}/{repo}/commits/{commit_sha}/comments"
    ],
    listCommitCommentsForRepo: ["GET /repos/{owner}/{repo}/comments"],
    listCommitStatusesForRef: [
      "GET /repos/{owner}/{repo}/commits/{ref}/statuses"
    ],
    listCommits: ["GET /repos/{owner}/{repo}/commits"],
    listContributors: ["GET /repos/{owner}/{repo}/contributors"],
    listCustomDeploymentRuleIntegrations: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment_protection_rules/apps"
    ],
    listDeployKeys: ["GET /repos/{owner}/{repo}/keys"],
    listDeploymentBranchPolicies: [
      "GET /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies"
    ],
    listDeploymentStatuses: [
      "GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"
    ],
    listDeployments: ["GET /repos/{owner}/{repo}/deployments"],
    listForAuthenticatedUser: ["GET /user/repos"],
    listForOrg: ["GET /orgs/{org}/repos"],
    listForUser: ["GET /users/{username}/repos"],
    listForks: ["GET /repos/{owner}/{repo}/forks"],
    listInvitations: ["GET /repos/{owner}/{repo}/invitations"],
    listInvitationsForAuthenticatedUser: ["GET /user/repository_invitations"],
    listLanguages: ["GET /repos/{owner}/{repo}/languages"],
    listPagesBuilds: ["GET /repos/{owner}/{repo}/pages/builds"],
    listPublic: ["GET /repositories"],
    listPullRequestsAssociatedWithCommit: [
      "GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls"
    ],
    listReleaseAssets: [
      "GET /repos/{owner}/{repo}/releases/{release_id}/assets"
    ],
    listReleases: ["GET /repos/{owner}/{repo}/releases"],
    listTags: ["GET /repos/{owner}/{repo}/tags"],
    listTeams: ["GET /repos/{owner}/{repo}/teams"],
    listWebhookDeliveries: [
      "GET /repos/{owner}/{repo}/hooks/{hook_id}/deliveries"
    ],
    listWebhooks: ["GET /repos/{owner}/{repo}/hooks"],
    merge: ["POST /repos/{owner}/{repo}/merges"],
    mergeUpstream: ["POST /repos/{owner}/{repo}/merge-upstream"],
    pingWebhook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/pings"],
    redeliverWebhookDelivery: [
      "POST /repos/{owner}/{repo}/hooks/{hook_id}/deliveries/{delivery_id}/attempts"
    ],
    removeAppAccessRestrictions: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
      {},
      { mapToData: "apps" }
    ],
    removeCollaborator: [
      "DELETE /repos/{owner}/{repo}/collaborators/{username}"
    ],
    removeStatusCheckContexts: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
      {},
      { mapToData: "contexts" }
    ],
    removeStatusCheckProtection: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"
    ],
    removeTeamAccessRestrictions: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
      {},
      { mapToData: "teams" }
    ],
    removeUserAccessRestrictions: [
      "DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
      {},
      { mapToData: "users" }
    ],
    renameBranch: ["POST /repos/{owner}/{repo}/branches/{branch}/rename"],
    replaceAllTopics: ["PUT /repos/{owner}/{repo}/topics"],
    requestPagesBuild: ["POST /repos/{owner}/{repo}/pages/builds"],
    setAdminBranchProtection: [
      "POST /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"
    ],
    setAppAccessRestrictions: [
      "PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps",
      {},
      { mapToData: "apps" }
    ],
    setStatusCheckContexts: [
      "PUT /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts",
      {},
      { mapToData: "contexts" }
    ],
    setTeamAccessRestrictions: [
      "PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams",
      {},
      { mapToData: "teams" }
    ],
    setUserAccessRestrictions: [
      "PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users",
      {},
      { mapToData: "users" }
    ],
    testPushWebhook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/tests"],
    transfer: ["POST /repos/{owner}/{repo}/transfer"],
    update: ["PATCH /repos/{owner}/{repo}"],
    updateBranchProtection: [
      "PUT /repos/{owner}/{repo}/branches/{branch}/protection"
    ],
    updateCommitComment: ["PATCH /repos/{owner}/{repo}/comments/{comment_id}"],
    updateDeploymentBranchPolicy: [
      "PUT /repos/{owner}/{repo}/environments/{environment_name}/deployment-branch-policies/{branch_policy_id}"
    ],
    updateInformationAboutPagesSite: ["PUT /repos/{owner}/{repo}/pages"],
    updateInvitation: [
      "PATCH /repos/{owner}/{repo}/invitations/{invitation_id}"
    ],
    updateOrgRuleset: ["PUT /orgs/{org}/rulesets/{ruleset_id}"],
    updatePullRequestReviewProtection: [
      "PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"
    ],
    updateRelease: ["PATCH /repos/{owner}/{repo}/releases/{release_id}"],
    updateReleaseAsset: [
      "PATCH /repos/{owner}/{repo}/releases/assets/{asset_id}"
    ],
    updateRepoRuleset: ["PUT /repos/{owner}/{repo}/rulesets/{ruleset_id}"],
    updateStatusCheckPotection: [
      "PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks",
      {},
      { renamed: ["repos", "updateStatusCheckProtection"] }
    ],
    updateStatusCheckProtection: [
      "PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"
    ],
    updateWebhook: ["PATCH /repos/{owner}/{repo}/hooks/{hook_id}"],
    updateWebhookConfigForRepo: [
      "PATCH /repos/{owner}/{repo}/hooks/{hook_id}/config"
    ],
    uploadReleaseAsset: [
      "POST /repos/{owner}/{repo}/releases/{release_id}/assets{?name,label}",
      { baseUrl: "https://uploads.github.com" }
    ]
  },
  search: {
    code: ["GET /search/code"],
    commits: ["GET /search/commits"],
    issuesAndPullRequests: ["GET /search/issues"],
    labels: ["GET /search/labels"],
    repos: ["GET /search/repositories"],
    topics: ["GET /search/topics"],
    users: ["GET /search/users"]
  },
  secretScanning: {
    createPushProtectionBypass: [
      "POST /repos/{owner}/{repo}/secret-scanning/push-protection-bypasses"
    ],
    getAlert: [
      "GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}"
    ],
    getScanHistory: ["GET /repos/{owner}/{repo}/secret-scanning/scan-history"],
    listAlertsForEnterprise: [
      "GET /enterprises/{enterprise}/secret-scanning/alerts"
    ],
    listAlertsForOrg: ["GET /orgs/{org}/secret-scanning/alerts"],
    listAlertsForRepo: ["GET /repos/{owner}/{repo}/secret-scanning/alerts"],
    listLocationsForAlert: [
      "GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}/locations"
    ],
    updateAlert: [
      "PATCH /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}"
    ]
  },
  securityAdvisories: {
    createFork: [
      "POST /repos/{owner}/{repo}/security-advisories/{ghsa_id}/forks"
    ],
    createPrivateVulnerabilityReport: [
      "POST /repos/{owner}/{repo}/security-advisories/reports"
    ],
    createRepositoryAdvisory: [
      "POST /repos/{owner}/{repo}/security-advisories"
    ],
    createRepositoryAdvisoryCveRequest: [
      "POST /repos/{owner}/{repo}/security-advisories/{ghsa_id}/cve"
    ],
    getGlobalAdvisory: ["GET /advisories/{ghsa_id}"],
    getRepositoryAdvisory: [
      "GET /repos/{owner}/{repo}/security-advisories/{ghsa_id}"
    ],
    listGlobalAdvisories: ["GET /advisories"],
    listOrgRepositoryAdvisories: ["GET /orgs/{org}/security-advisories"],
    listRepositoryAdvisories: ["GET /repos/{owner}/{repo}/security-advisories"],
    updateRepositoryAdvisory: [
      "PATCH /repos/{owner}/{repo}/security-advisories/{ghsa_id}"
    ]
  },
  teams: {
    addOrUpdateMembershipForUserInOrg: [
      "PUT /orgs/{org}/teams/{team_slug}/memberships/{username}"
    ],
    addOrUpdateProjectPermissionsInOrg: [
      "PUT /orgs/{org}/teams/{team_slug}/projects/{project_id}"
    ],
    addOrUpdateRepoPermissionsInOrg: [
      "PUT /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"
    ],
    checkPermissionsForProjectInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/projects/{project_id}"
    ],
    checkPermissionsForRepoInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"
    ],
    create: ["POST /orgs/{org}/teams"],
    createDiscussionCommentInOrg: [
      "POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"
    ],
    createDiscussionInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions"],
    deleteDiscussionCommentInOrg: [
      "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"
    ],
    deleteDiscussionInOrg: [
      "DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"
    ],
    deleteInOrg: ["DELETE /orgs/{org}/teams/{team_slug}"],
    getByName: ["GET /orgs/{org}/teams/{team_slug}"],
    getDiscussionCommentInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"
    ],
    getDiscussionInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"
    ],
    getMembershipForUserInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/memberships/{username}"
    ],
    list: ["GET /orgs/{org}/teams"],
    listChildInOrg: ["GET /orgs/{org}/teams/{team_slug}/teams"],
    listDiscussionCommentsInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"
    ],
    listDiscussionsInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions"],
    listForAuthenticatedUser: ["GET /user/teams"],
    listMembersInOrg: ["GET /orgs/{org}/teams/{team_slug}/members"],
    listPendingInvitationsInOrg: [
      "GET /orgs/{org}/teams/{team_slug}/invitations"
    ],
    listProjectsInOrg: ["GET /orgs/{org}/teams/{team_slug}/projects"],
    listReposInOrg: ["GET /orgs/{org}/teams/{team_slug}/repos"],
    removeMembershipForUserInOrg: [
      "DELETE /orgs/{org}/teams/{team_slug}/memberships/{username}"
    ],
    removeProjectInOrg: [
      "DELETE /orgs/{org}/teams/{team_slug}/projects/{project_id}"
    ],
    removeRepoInOrg: [
      "DELETE /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"
    ],
    updateDiscussionCommentInOrg: [
      "PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"
    ],
    updateDiscussionInOrg: [
      "PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"
    ],
    updateInOrg: ["PATCH /orgs/{org}/teams/{team_slug}"]
  },
  users: {
    addEmailForAuthenticated: [
      "POST /user/emails",
      {},
      { renamed: ["users", "addEmailForAuthenticatedUser"] }
    ],
    addEmailForAuthenticatedUser: ["POST /user/emails"],
    addSocialAccountForAuthenticatedUser: ["POST /user/social_accounts"],
    block: ["PUT /user/blocks/{username}"],
    checkBlocked: ["GET /user/blocks/{username}"],
    checkFollowingForUser: ["GET /users/{username}/following/{target_user}"],
    checkPersonIsFollowedByAuthenticated: ["GET /user/following/{username}"],
    createGpgKeyForAuthenticated: [
      "POST /user/gpg_keys",
      {},
      { renamed: ["users", "createGpgKeyForAuthenticatedUser"] }
    ],
    createGpgKeyForAuthenticatedUser: ["POST /user/gpg_keys"],
    createPublicSshKeyForAuthenticated: [
      "POST /user/keys",
      {},
      { renamed: ["users", "createPublicSshKeyForAuthenticatedUser"] }
    ],
    createPublicSshKeyForAuthenticatedUser: ["POST /user/keys"],
    createSshSigningKeyForAuthenticatedUser: ["POST /user/ssh_signing_keys"],
    deleteEmailForAuthenticated: [
      "DELETE /user/emails",
      {},
      { renamed: ["users", "deleteEmailForAuthenticatedUser"] }
    ],
    deleteEmailForAuthenticatedUser: ["DELETE /user/emails"],
    deleteGpgKeyForAuthenticated: [
      "DELETE /user/gpg_keys/{gpg_key_id}",
      {},
      { renamed: ["users", "deleteGpgKeyForAuthenticatedUser"] }
    ],
    deleteGpgKeyForAuthenticatedUser: ["DELETE /user/gpg_keys/{gpg_key_id}"],
    deletePublicSshKeyForAuthenticated: [
      "DELETE /user/keys/{key_id}",
      {},
      { renamed: ["users", "deletePublicSshKeyForAuthenticatedUser"] }
    ],
    deletePublicSshKeyForAuthenticatedUser: ["DELETE /user/keys/{key_id}"],
    deleteSocialAccountForAuthenticatedUser: ["DELETE /user/social_accounts"],
    deleteSshSigningKeyForAuthenticatedUser: [
      "DELETE /user/ssh_signing_keys/{ssh_signing_key_id}"
    ],
    follow: ["PUT /user/following/{username}"],
    getAuthenticated: ["GET /user"],
    getById: ["GET /user/{account_id}"],
    getByUsername: ["GET /users/{username}"],
    getContextForUser: ["GET /users/{username}/hovercard"],
    getGpgKeyForAuthenticated: [
      "GET /user/gpg_keys/{gpg_key_id}",
      {},
      { renamed: ["users", "getGpgKeyForAuthenticatedUser"] }
    ],
    getGpgKeyForAuthenticatedUser: ["GET /user/gpg_keys/{gpg_key_id}"],
    getPublicSshKeyForAuthenticated: [
      "GET /user/keys/{key_id}",
      {},
      { renamed: ["users", "getPublicSshKeyForAuthenticatedUser"] }
    ],
    getPublicSshKeyForAuthenticatedUser: ["GET /user/keys/{key_id}"],
    getSshSigningKeyForAuthenticatedUser: [
      "GET /user/ssh_signing_keys/{ssh_signing_key_id}"
    ],
    list: ["GET /users"],
    listAttestations: ["GET /users/{username}/attestations/{subject_digest}"],
    listBlockedByAuthenticated: [
      "GET /user/blocks",
      {},
      { renamed: ["users", "listBlockedByAuthenticatedUser"] }
    ],
    listBlockedByAuthenticatedUser: ["GET /user/blocks"],
    listEmailsForAuthenticated: [
      "GET /user/emails",
      {},
      { renamed: ["users", "listEmailsForAuthenticatedUser"] }
    ],
    listEmailsForAuthenticatedUser: ["GET /user/emails"],
    listFollowedByAuthenticated: [
      "GET /user/following",
      {},
      { renamed: ["users", "listFollowedByAuthenticatedUser"] }
    ],
    listFollowedByAuthenticatedUser: ["GET /user/following"],
    listFollowersForAuthenticatedUser: ["GET /user/followers"],
    listFollowersForUser: ["GET /users/{username}/followers"],
    listFollowingForUser: ["GET /users/{username}/following"],
    listGpgKeysForAuthenticated: [
      "GET /user/gpg_keys",
      {},
      { renamed: ["users", "listGpgKeysForAuthenticatedUser"] }
    ],
    listGpgKeysForAuthenticatedUser: ["GET /user/gpg_keys"],
    listGpgKeysForUser: ["GET /users/{username}/gpg_keys"],
    listPublicEmailsForAuthenticated: [
      "GET /user/public_emails",
      {},
      { renamed: ["users", "listPublicEmailsForAuthenticatedUser"] }
    ],
    listPublicEmailsForAuthenticatedUser: ["GET /user/public_emails"],
    listPublicKeysForUser: ["GET /users/{username}/keys"],
    listPublicSshKeysForAuthenticated: [
      "GET /user/keys",
      {},
      { renamed: ["users", "listPublicSshKeysForAuthenticatedUser"] }
    ],
    listPublicSshKeysForAuthenticatedUser: ["GET /user/keys"],
    listSocialAccountsForAuthenticatedUser: ["GET /user/social_accounts"],
    listSocialAccountsForUser: ["GET /users/{username}/social_accounts"],
    listSshSigningKeysForAuthenticatedUser: ["GET /user/ssh_signing_keys"],
    listSshSigningKeysForUser: ["GET /users/{username}/ssh_signing_keys"],
    setPrimaryEmailVisibilityForAuthenticated: [
      "PATCH /user/email/visibility",
      {},
      { renamed: ["users", "setPrimaryEmailVisibilityForAuthenticatedUser"] }
    ],
    setPrimaryEmailVisibilityForAuthenticatedUser: [
      "PATCH /user/email/visibility"
    ],
    unblock: ["DELETE /user/blocks/{username}"],
    unfollow: ["DELETE /user/following/{username}"],
    updateAuthenticated: ["PATCH /user"]
  }
};
var endpoints_default = Endpoints;

// pkg/dist-src/endpoints-to-methods.js
var endpointMethodsMap = /* @__PURE__ */ new Map();
for (const [scope, endpoints] of Object.entries(endpoints_default)) {
  for (const [methodName, endpoint] of Object.entries(endpoints)) {
    const [route, defaults, decorations] = endpoint;
    const [method, url] = route.split(/ /);
    const endpointDefaults = Object.assign(
      {
        method,
        url
      },
      defaults
    );
    if (!endpointMethodsMap.has(scope)) {
      endpointMethodsMap.set(scope, /* @__PURE__ */ new Map());
    }
    endpointMethodsMap.get(scope).set(methodName, {
      scope,
      methodName,
      endpointDefaults,
      decorations
    });
  }
}
var handler = {
  has({ scope }, methodName) {
    return endpointMethodsMap.get(scope).has(methodName);
  },
  getOwnPropertyDescriptor(target, methodName) {
    return {
      value: this.get(target, methodName),
      // ensures method is in the cache
      configurable: true,
      writable: true,
      enumerable: true
    };
  },
  defineProperty(target, methodName, descriptor) {
    Object.defineProperty(target.cache, methodName, descriptor);
    return true;
  },
  deleteProperty(target, methodName) {
    delete target.cache[methodName];
    return true;
  },
  ownKeys({ scope }) {
    return [...endpointMethodsMap.get(scope).keys()];
  },
  set(target, methodName, value) {
    return target.cache[methodName] = value;
  },
  get({ octokit, scope, cache }, methodName) {
    if (cache[methodName]) {
      return cache[methodName];
    }
    const method = endpointMethodsMap.get(scope).get(methodName);
    if (!method) {
      return void 0;
    }
    const { endpointDefaults, decorations } = method;
    if (decorations) {
      cache[methodName] = decorate(
        octokit,
        scope,
        methodName,
        endpointDefaults,
        decorations
      );
    } else {
      cache[methodName] = octokit.request.defaults(endpointDefaults);
    }
    return cache[methodName];
  }
};
function endpointsToMethods(octokit) {
  const newMethods = {};
  for (const scope of endpointMethodsMap.keys()) {
    newMethods[scope] = new Proxy({ octokit, scope, cache: {} }, handler);
  }
  return newMethods;
}
function decorate(octokit, scope, methodName, defaults, decorations) {
  const requestWithDefaults = octokit.request.defaults(defaults);
  function withDecorations(...args) {
    let options = requestWithDefaults.endpoint.merge(...args);
    if (decorations.mapToData) {
      options = Object.assign({}, options, {
        data: options[decorations.mapToData],
        [decorations.mapToData]: void 0
      });
      return requestWithDefaults(options);
    }
    if (decorations.renamed) {
      const [newScope, newMethodName] = decorations.renamed;
      octokit.log.warn(
        `octokit.${scope}.${methodName}() has been renamed to octokit.${newScope}.${newMethodName}()`
      );
    }
    if (decorations.deprecated) {
      octokit.log.warn(decorations.deprecated);
    }
    if (decorations.renamedParameters) {
      const options2 = requestWithDefaults.endpoint.merge(...args);
      for (const [name, alias] of Object.entries(
        decorations.renamedParameters
      )) {
        if (name in options2) {
          octokit.log.warn(
            `"${name}" parameter is deprecated for "octokit.${scope}.${methodName}()". Use "${alias}" instead`
          );
          if (!(alias in options2)) {
            options2[alias] = options2[name];
          }
          delete options2[name];
        }
      }
      return requestWithDefaults(options2);
    }
    return requestWithDefaults(...args);
  }
  return Object.assign(withDecorations, requestWithDefaults);
}

// pkg/dist-src/index.js
function restEndpointMethods(octokit) {
  const api = endpointsToMethods(octokit);
  return {
    rest: api
  };
}
restEndpointMethods.VERSION = VERSION;
function legacyRestEndpointMethods(octokit) {
  const api = endpointsToMethods(octokit);
  return {
    ...api,
    rest: api
  };
}
legacyRestEndpointMethods.VERSION = VERSION;
// Annotate the CommonJS export names for ESM import in node:
0 && (0);


/***/ }),

/***/ 537:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// pkg/dist-src/index.js
var dist_src_exports = {};
__export(dist_src_exports, {
  RequestError: () => RequestError
});
module.exports = __toCommonJS(dist_src_exports);
var import_deprecation = __nccwpck_require__(8932);
var import_once = __toESM(__nccwpck_require__(1223));
var logOnceCode = (0, import_once.default)((deprecation) => console.warn(deprecation));
var logOnceHeaders = (0, import_once.default)((deprecation) => console.warn(deprecation));
var RequestError = class extends Error {
  constructor(message, statusCode, options) {
    super(message);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
    this.name = "HttpError";
    this.status = statusCode;
    let headers;
    if ("headers" in options && typeof options.headers !== "undefined") {
      headers = options.headers;
    }
    if ("response" in options) {
      this.response = options.response;
      headers = options.response.headers;
    }
    const requestCopy = Object.assign({}, options.request);
    if (options.request.headers.authorization) {
      requestCopy.headers = Object.assign({}, options.request.headers, {
        authorization: options.request.headers.authorization.replace(
          /(?<! ) .*$/,
          " [REDACTED]"
        )
      });
    }
    requestCopy.url = requestCopy.url.replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]").replace(/\baccess_token=\w+/g, "access_token=[REDACTED]");
    this.request = requestCopy;
    Object.defineProperty(this, "code", {
      get() {
        logOnceCode(
          new import_deprecation.Deprecation(
            "[@octokit/request-error] `error.code` is deprecated, use `error.status`."
          )
        );
        return statusCode;
      }
    });
    Object.defineProperty(this, "headers", {
      get() {
        logOnceHeaders(
          new import_deprecation.Deprecation(
            "[@octokit/request-error] `error.headers` is deprecated, use `error.response.headers`."
          )
        );
        return headers || {};
      }
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (0);


/***/ }),

/***/ 6234:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// pkg/dist-src/index.js
var dist_src_exports = {};
__export(dist_src_exports, {
  request: () => request
});
module.exports = __toCommonJS(dist_src_exports);
var import_endpoint = __nccwpck_require__(9440);
var import_universal_user_agent = __nccwpck_require__(5030);

// pkg/dist-src/version.js
var VERSION = "8.4.1";

// pkg/dist-src/is-plain-object.js
function isPlainObject(value) {
  if (typeof value !== "object" || value === null)
    return false;
  if (Object.prototype.toString.call(value) !== "[object Object]")
    return false;
  const proto = Object.getPrototypeOf(value);
  if (proto === null)
    return true;
  const Ctor = Object.prototype.hasOwnProperty.call(proto, "constructor") && proto.constructor;
  return typeof Ctor === "function" && Ctor instanceof Ctor && Function.prototype.call(Ctor) === Function.prototype.call(value);
}

// pkg/dist-src/fetch-wrapper.js
var import_request_error = __nccwpck_require__(537);

// pkg/dist-src/get-buffer-response.js
function getBufferResponse(response) {
  return response.arrayBuffer();
}

// pkg/dist-src/fetch-wrapper.js
function fetchWrapper(requestOptions) {
  var _a, _b, _c, _d;
  const log = requestOptions.request && requestOptions.request.log ? requestOptions.request.log : console;
  const parseSuccessResponseBody = ((_a = requestOptions.request) == null ? void 0 : _a.parseSuccessResponseBody) !== false;
  if (isPlainObject(requestOptions.body) || Array.isArray(requestOptions.body)) {
    requestOptions.body = JSON.stringify(requestOptions.body);
  }
  let headers = {};
  let status;
  let url;
  let { fetch } = globalThis;
  if ((_b = requestOptions.request) == null ? void 0 : _b.fetch) {
    fetch = requestOptions.request.fetch;
  }
  if (!fetch) {
    throw new Error(
      "fetch is not set. Please pass a fetch implementation as new Octokit({ request: { fetch }}). Learn more at https://github.com/octokit/octokit.js/#fetch-missing"
    );
  }
  return fetch(requestOptions.url, {
    method: requestOptions.method,
    body: requestOptions.body,
    redirect: (_c = requestOptions.request) == null ? void 0 : _c.redirect,
    headers: requestOptions.headers,
    signal: (_d = requestOptions.request) == null ? void 0 : _d.signal,
    // duplex must be set if request.body is ReadableStream or Async Iterables.
    // See https://fetch.spec.whatwg.org/#dom-requestinit-duplex.
    ...requestOptions.body && { duplex: "half" }
  }).then(async (response) => {
    url = response.url;
    status = response.status;
    for (const keyAndValue of response.headers) {
      headers[keyAndValue[0]] = keyAndValue[1];
    }
    if ("deprecation" in headers) {
      const matches = headers.link && headers.link.match(/<([^<>]+)>; rel="deprecation"/);
      const deprecationLink = matches && matches.pop();
      log.warn(
        `[@octokit/request] "${requestOptions.method} ${requestOptions.url}" is deprecated. It is scheduled to be removed on ${headers.sunset}${deprecationLink ? `. See ${deprecationLink}` : ""}`
      );
    }
    if (status === 204 || status === 205) {
      return;
    }
    if (requestOptions.method === "HEAD") {
      if (status < 400) {
        return;
      }
      throw new import_request_error.RequestError(response.statusText, status, {
        response: {
          url,
          status,
          headers,
          data: void 0
        },
        request: requestOptions
      });
    }
    if (status === 304) {
      throw new import_request_error.RequestError("Not modified", status, {
        response: {
          url,
          status,
          headers,
          data: await getResponseData(response)
        },
        request: requestOptions
      });
    }
    if (status >= 400) {
      const data = await getResponseData(response);
      const error = new import_request_error.RequestError(toErrorMessage(data), status, {
        response: {
          url,
          status,
          headers,
          data
        },
        request: requestOptions
      });
      throw error;
    }
    return parseSuccessResponseBody ? await getResponseData(response) : response.body;
  }).then((data) => {
    return {
      status,
      url,
      headers,
      data
    };
  }).catch((error) => {
    if (error instanceof import_request_error.RequestError)
      throw error;
    else if (error.name === "AbortError")
      throw error;
    let message = error.message;
    if (error.name === "TypeError" && "cause" in error) {
      if (error.cause instanceof Error) {
        message = error.cause.message;
      } else if (typeof error.cause === "string") {
        message = error.cause;
      }
    }
    throw new import_request_error.RequestError(message, 500, {
      request: requestOptions
    });
  });
}
async function getResponseData(response) {
  const contentType = response.headers.get("content-type");
  if (/application\/json/.test(contentType)) {
    return response.json().catch(() => response.text()).catch(() => "");
  }
  if (!contentType || /^text\/|charset=utf-8$/.test(contentType)) {
    return response.text();
  }
  return getBufferResponse(response);
}
function toErrorMessage(data) {
  if (typeof data === "string")
    return data;
  let suffix;
  if ("documentation_url" in data) {
    suffix = ` - ${data.documentation_url}`;
  } else {
    suffix = "";
  }
  if ("message" in data) {
    if (Array.isArray(data.errors)) {
      return `${data.message}: ${data.errors.map(JSON.stringify).join(", ")}${suffix}`;
    }
    return `${data.message}${suffix}`;
  }
  return `Unknown error: ${JSON.stringify(data)}`;
}

// pkg/dist-src/with-defaults.js
function withDefaults(oldEndpoint, newDefaults) {
  const endpoint2 = oldEndpoint.defaults(newDefaults);
  const newApi = function(route, parameters) {
    const endpointOptions = endpoint2.merge(route, parameters);
    if (!endpointOptions.request || !endpointOptions.request.hook) {
      return fetchWrapper(endpoint2.parse(endpointOptions));
    }
    const request2 = (route2, parameters2) => {
      return fetchWrapper(
        endpoint2.parse(endpoint2.merge(route2, parameters2))
      );
    };
    Object.assign(request2, {
      endpoint: endpoint2,
      defaults: withDefaults.bind(null, endpoint2)
    });
    return endpointOptions.request.hook(request2, endpointOptions);
  };
  return Object.assign(newApi, {
    endpoint: endpoint2,
    defaults: withDefaults.bind(null, endpoint2)
  });
}

// pkg/dist-src/index.js
var request = withDefaults(import_endpoint.endpoint, {
  headers: {
    "user-agent": `octokit-request.js/${VERSION} ${(0, import_universal_user_agent.getUserAgent)()}`
  }
});
// Annotate the CommonJS export names for ESM import in node:
0 && (0);


/***/ }),

/***/ 5375:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// pkg/dist-src/index.js
var index_exports = {};
__export(index_exports, {
  Octokit: () => Octokit
});
module.exports = __toCommonJS(index_exports);
var import_core = __nccwpck_require__(6762);
var import_plugin_request_log = __nccwpck_require__(8883);
var import_plugin_paginate_rest = __nccwpck_require__(4193);
var import_plugin_rest_endpoint_methods = __nccwpck_require__(3044);

// pkg/dist-src/version.js
var VERSION = "20.1.2";

// pkg/dist-src/index.js
var Octokit = import_core.Octokit.plugin(
  import_plugin_request_log.requestLog,
  import_plugin_rest_endpoint_methods.legacyRestEndpointMethods,
  import_plugin_paginate_rest.paginateRest
).defaults({
  userAgent: `octokit-rest.js/${VERSION}`
});
// Annotate the CommonJS export names for ESM import in node:
0 && (0);


/***/ }),

/***/ 9417:
/***/ ((module) => {

"use strict";

module.exports = balanced;
function balanced(a, b, str) {
  if (a instanceof RegExp) a = maybeMatch(a, str);
  if (b instanceof RegExp) b = maybeMatch(b, str);

  var r = range(a, b, str);

  return r && {
    start: r[0],
    end: r[1],
    pre: str.slice(0, r[0]),
    body: str.slice(r[0] + a.length, r[1]),
    post: str.slice(r[1] + b.length)
  };
}

function maybeMatch(reg, str) {
  var m = str.match(reg);
  return m ? m[0] : null;
}

balanced.range = range;
function range(a, b, str) {
  var begs, beg, left, right, result;
  var ai = str.indexOf(a);
  var bi = str.indexOf(b, ai + 1);
  var i = ai;

  if (ai >= 0 && bi > 0) {
    if(a===b) {
      return [ai, bi];
    }
    begs = [];
    left = str.length;

    while (i >= 0 && !result) {
      if (i == ai) {
        begs.push(i);
        ai = str.indexOf(a, i + 1);
      } else if (begs.length == 1) {
        result = [ begs.pop(), bi ];
      } else {
        beg = begs.pop();
        if (beg < left) {
          left = beg;
          right = bi;
        }

        bi = str.indexOf(b, i + 1);
      }

      i = ai < bi && ai >= 0 ? ai : bi;
    }

    if (begs.length) {
      result = [ left, right ];
    }
  }

  return result;
}


/***/ }),

/***/ 3682:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var register = __nccwpck_require__(4670);
var addHook = __nccwpck_require__(5549);
var removeHook = __nccwpck_require__(6819);

// bind with array of arguments: https://stackoverflow.com/a/21792913
var bind = Function.bind;
var bindable = bind.bind(bind);

function bindApi(hook, state, name) {
  var removeHookRef = bindable(removeHook, null).apply(
    null,
    name ? [state, name] : [state]
  );
  hook.api = { remove: removeHookRef };
  hook.remove = removeHookRef;
  ["before", "error", "after", "wrap"].forEach(function (kind) {
    var args = name ? [state, kind, name] : [state, kind];
    hook[kind] = hook.api[kind] = bindable(addHook, null).apply(null, args);
  });
}

function HookSingular() {
  var singularHookName = "h";
  var singularHookState = {
    registry: {},
  };
  var singularHook = register.bind(null, singularHookState, singularHookName);
  bindApi(singularHook, singularHookState, singularHookName);
  return singularHook;
}

function HookCollection() {
  var state = {
    registry: {},
  };

  var hook = register.bind(null, state);
  bindApi(hook, state);

  return hook;
}

var collectionHookDeprecationMessageDisplayed = false;
function Hook() {
  if (!collectionHookDeprecationMessageDisplayed) {
    console.warn(
      '[before-after-hook]: "Hook()" repurposing warning, use "Hook.Collection()". Read more: https://git.io/upgrade-before-after-hook-to-1.4'
    );
    collectionHookDeprecationMessageDisplayed = true;
  }
  return HookCollection();
}

Hook.Singular = HookSingular.bind();
Hook.Collection = HookCollection.bind();

module.exports = Hook;
// expose constructors as a named property for TypeScript
module.exports.Hook = Hook;
module.exports.Singular = Hook.Singular;
module.exports.Collection = Hook.Collection;


/***/ }),

/***/ 5549:
/***/ ((module) => {

module.exports = addHook;

function addHook(state, kind, name, hook) {
  var orig = hook;
  if (!state.registry[name]) {
    state.registry[name] = [];
  }

  if (kind === "before") {
    hook = function (method, options) {
      return Promise.resolve()
        .then(orig.bind(null, options))
        .then(method.bind(null, options));
    };
  }

  if (kind === "after") {
    hook = function (method, options) {
      var result;
      return Promise.resolve()
        .then(method.bind(null, options))
        .then(function (result_) {
          result = result_;
          return orig(result, options);
        })
        .then(function () {
          return result;
        });
    };
  }

  if (kind === "error") {
    hook = function (method, options) {
      return Promise.resolve()
        .then(method.bind(null, options))
        .catch(function (error) {
          return orig(error, options);
        });
    };
  }

  state.registry[name].push({
    hook: hook,
    orig: orig,
  });
}


/***/ }),

/***/ 4670:
/***/ ((module) => {

module.exports = register;

function register(state, name, method, options) {
  if (typeof method !== "function") {
    throw new Error("method for before hook must be a function");
  }

  if (!options) {
    options = {};
  }

  if (Array.isArray(name)) {
    return name.reverse().reduce(function (callback, name) {
      return register.bind(null, state, name, callback, options);
    }, method)();
  }

  return Promise.resolve().then(function () {
    if (!state.registry[name]) {
      return method(options);
    }

    return state.registry[name].reduce(function (method, registered) {
      return registered.hook.bind(null, method, options);
    }, method)();
  });
}


/***/ }),

/***/ 6819:
/***/ ((module) => {

module.exports = removeHook;

function removeHook(state, name, method) {
  if (!state.registry[name]) {
    return;
  }

  var index = state.registry[name]
    .map(function (registered) {
      return registered.orig;
    })
    .indexOf(method);

  if (index === -1) {
    return;
  }

  state.registry[name].splice(index, 1);
}


/***/ }),

/***/ 3717:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var concatMap = __nccwpck_require__(6891);
var balanced = __nccwpck_require__(9417);

module.exports = expandTop;

var escSlash = '\0SLASH'+Math.random()+'\0';
var escOpen = '\0OPEN'+Math.random()+'\0';
var escClose = '\0CLOSE'+Math.random()+'\0';
var escComma = '\0COMMA'+Math.random()+'\0';
var escPeriod = '\0PERIOD'+Math.random()+'\0';

function numeric(str) {
  return parseInt(str, 10) == str
    ? parseInt(str, 10)
    : str.charCodeAt(0);
}

function escapeBraces(str) {
  return str.split('\\\\').join(escSlash)
            .split('\\{').join(escOpen)
            .split('\\}').join(escClose)
            .split('\\,').join(escComma)
            .split('\\.').join(escPeriod);
}

function unescapeBraces(str) {
  return str.split(escSlash).join('\\')
            .split(escOpen).join('{')
            .split(escClose).join('}')
            .split(escComma).join(',')
            .split(escPeriod).join('.');
}


// Basically just str.split(","), but handling cases
// where we have nested braced sections, which should be
// treated as individual members, like {a,{b,c},d}
function parseCommaParts(str) {
  if (!str)
    return [''];

  var parts = [];
  var m = balanced('{', '}', str);

  if (!m)
    return str.split(',');

  var pre = m.pre;
  var body = m.body;
  var post = m.post;
  var p = pre.split(',');

  p[p.length-1] += '{' + body + '}';
  var postParts = parseCommaParts(post);
  if (post.length) {
    p[p.length-1] += postParts.shift();
    p.push.apply(p, postParts);
  }

  parts.push.apply(parts, p);

  return parts;
}

function expandTop(str) {
  if (!str)
    return [];

  // I don't know why Bash 4.3 does this, but it does.
  // Anything starting with {} will have the first two bytes preserved
  // but *only* at the top level, so {},a}b will not expand to anything,
  // but a{},b}c will be expanded to [a}c,abc].
  // One could argue that this is a bug in Bash, but since the goal of
  // this module is to match Bash's rules, we escape a leading {}
  if (str.substr(0, 2) === '{}') {
    str = '\\{\\}' + str.substr(2);
  }

  return expand(escapeBraces(str), true).map(unescapeBraces);
}

function identity(e) {
  return e;
}

function embrace(str) {
  return '{' + str + '}';
}
function isPadded(el) {
  return /^-?0\d/.test(el);
}

function lte(i, y) {
  return i <= y;
}
function gte(i, y) {
  return i >= y;
}

function expand(str, isTop) {
  var expansions = [];

  var m = balanced('{', '}', str);
  if (!m || /\$$/.test(m.pre)) return [str];

  var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
  var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
  var isSequence = isNumericSequence || isAlphaSequence;
  var isOptions = m.body.indexOf(',') >= 0;
  if (!isSequence && !isOptions) {
    // {a},b}
    if (m.post.match(/,.*\}/)) {
      str = m.pre + '{' + m.body + escClose + m.post;
      return expand(str);
    }
    return [str];
  }

  var n;
  if (isSequence) {
    n = m.body.split(/\.\./);
  } else {
    n = parseCommaParts(m.body);
    if (n.length === 1) {
      // x{{a,b}}y ==> x{a}y x{b}y
      n = expand(n[0], false).map(embrace);
      if (n.length === 1) {
        var post = m.post.length
          ? expand(m.post, false)
          : [''];
        return post.map(function(p) {
          return m.pre + n[0] + p;
        });
      }
    }
  }

  // at this point, n is the parts, and we know it's not a comma set
  // with a single entry.

  // no need to expand pre, since it is guaranteed to be free of brace-sets
  var pre = m.pre;
  var post = m.post.length
    ? expand(m.post, false)
    : [''];

  var N;

  if (isSequence) {
    var x = numeric(n[0]);
    var y = numeric(n[1]);
    var width = Math.max(n[0].length, n[1].length)
    var incr = n.length == 3
      ? Math.abs(numeric(n[2]))
      : 1;
    var test = lte;
    var reverse = y < x;
    if (reverse) {
      incr *= -1;
      test = gte;
    }
    var pad = n.some(isPadded);

    N = [];

    for (var i = x; test(i, y); i += incr) {
      var c;
      if (isAlphaSequence) {
        c = String.fromCharCode(i);
        if (c === '\\')
          c = '';
      } else {
        c = String(i);
        if (pad) {
          var need = width - c.length;
          if (need > 0) {
            var z = new Array(need + 1).join('0');
            if (i < 0)
              c = '-' + z + c.slice(1);
            else
              c = z + c;
          }
        }
      }
      N.push(c);
    }
  } else {
    N = concatMap(n, function(el) { return expand(el, false) });
  }

  for (var j = 0; j < N.length; j++) {
    for (var k = 0; k < post.length; k++) {
      var expansion = pre + N[j] + post[k];
      if (!isTop || isSequence || expansion)
        expansions.push(expansion);
    }
  }

  return expansions;
}



/***/ }),

/***/ 6891:
/***/ ((module) => {

module.exports = function (xs, fn) {
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        var x = fn(xs[i], i);
        if (isArray(x)) res.push.apply(res, x);
        else res.push(x);
    }
    return res;
};

var isArray = Array.isArray || function (xs) {
    return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),

/***/ 7881:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const cp = __nccwpck_require__(2081);
const parse = __nccwpck_require__(6855);
const enoent = __nccwpck_require__(4101);

function spawn(command, args, options) {
    // Parse the arguments
    const parsed = parse(command, args, options);

    // Spawn the child process
    const spawned = cp.spawn(parsed.command, parsed.args, parsed.options);

    // Hook into child process "exit" event to emit an error if the command
    // does not exists, see: https://github.com/IndigoUnited/node-cross-spawn/issues/16
    enoent.hookChildProcess(spawned, parsed);

    return spawned;
}

function spawnSync(command, args, options) {
    // Parse the arguments
    const parsed = parse(command, args, options);

    // Spawn the child process
    const result = cp.spawnSync(parsed.command, parsed.args, parsed.options);

    // Analyze if the command does not exist, see: https://github.com/IndigoUnited/node-cross-spawn/issues/16
    result.error = result.error || enoent.verifyENOENTSync(result.status, parsed);

    return result;
}

module.exports = spawn;
module.exports.spawn = spawn;
module.exports.sync = spawnSync;

module.exports._parse = parse;
module.exports._enoent = enoent;


/***/ }),

/***/ 4101:
/***/ ((module) => {

"use strict";


const isWin = process.platform === 'win32';

function notFoundError(original, syscall) {
    return Object.assign(new Error(`${syscall} ${original.command} ENOENT`), {
        code: 'ENOENT',
        errno: 'ENOENT',
        syscall: `${syscall} ${original.command}`,
        path: original.command,
        spawnargs: original.args,
    });
}

function hookChildProcess(cp, parsed) {
    if (!isWin) {
        return;
    }

    const originalEmit = cp.emit;

    cp.emit = function (name, arg1) {
        // If emitting "exit" event and exit code is 1, we need to check if
        // the command exists and emit an "error" instead
        // See https://github.com/IndigoUnited/node-cross-spawn/issues/16
        if (name === 'exit') {
            const err = verifyENOENT(arg1, parsed, 'spawn');

            if (err) {
                return originalEmit.call(cp, 'error', err);
            }
        }

        return originalEmit.apply(cp, arguments); // eslint-disable-line prefer-rest-params
    };
}

function verifyENOENT(status, parsed) {
    if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, 'spawn');
    }

    return null;
}

function verifyENOENTSync(status, parsed) {
    if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, 'spawnSync');
    }

    return null;
}

module.exports = {
    hookChildProcess,
    verifyENOENT,
    verifyENOENTSync,
    notFoundError,
};


/***/ }),

/***/ 6855:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const path = __nccwpck_require__(1017);
const resolveCommand = __nccwpck_require__(7274);
const escape = __nccwpck_require__(4274);
const readShebang = __nccwpck_require__(1252);

const isWin = process.platform === 'win32';
const isExecutableRegExp = /\.(?:com|exe)$/i;
const isCmdShimRegExp = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;

function detectShebang(parsed) {
    parsed.file = resolveCommand(parsed);

    const shebang = parsed.file && readShebang(parsed.file);

    if (shebang) {
        parsed.args.unshift(parsed.file);
        parsed.command = shebang;

        return resolveCommand(parsed);
    }

    return parsed.file;
}

function parseNonShell(parsed) {
    if (!isWin) {
        return parsed;
    }

    // Detect & add support for shebangs
    const commandFile = detectShebang(parsed);

    // We don't need a shell if the command filename is an executable
    const needsShell = !isExecutableRegExp.test(commandFile);

    // If a shell is required, use cmd.exe and take care of escaping everything correctly
    // Note that `forceShell` is an hidden option used only in tests
    if (parsed.options.forceShell || needsShell) {
        // Need to double escape meta chars if the command is a cmd-shim located in `node_modules/.bin/`
        // The cmd-shim simply calls execute the package bin file with NodeJS, proxying any argument
        // Because the escape of metachars with ^ gets interpreted when the cmd.exe is first called,
        // we need to double escape them
        const needsDoubleEscapeMetaChars = isCmdShimRegExp.test(commandFile);

        // Normalize posix paths into OS compatible paths (e.g.: foo/bar -> foo\bar)
        // This is necessary otherwise it will always fail with ENOENT in those cases
        parsed.command = path.normalize(parsed.command);

        // Escape command & arguments
        parsed.command = escape.command(parsed.command);
        parsed.args = parsed.args.map((arg) => escape.argument(arg, needsDoubleEscapeMetaChars));

        const shellCommand = [parsed.command].concat(parsed.args).join(' ');

        parsed.args = ['/d', '/s', '/c', `"${shellCommand}"`];
        parsed.command = process.env.comspec || 'cmd.exe';
        parsed.options.windowsVerbatimArguments = true; // Tell node's spawn that the arguments are already escaped
    }

    return parsed;
}

function parse(command, args, options) {
    // Normalize arguments, similar to nodejs
    if (args && !Array.isArray(args)) {
        options = args;
        args = null;
    }

    args = args ? args.slice(0) : []; // Clone array to avoid changing the original
    options = Object.assign({}, options); // Clone object to avoid changing the original

    // Build our parsed object
    const parsed = {
        command,
        args,
        options,
        file: undefined,
        original: {
            command,
            args,
        },
    };

    // Delegate further parsing to shell or non-shell
    return options.shell ? parsed : parseNonShell(parsed);
}

module.exports = parse;


/***/ }),

/***/ 4274:
/***/ ((module) => {

"use strict";


// See http://www.robvanderwoude.com/escapechars.php
const metaCharsRegExp = /([()\][%!^"`<>&|;, *?])/g;

function escapeCommand(arg) {
    // Escape meta chars
    arg = arg.replace(metaCharsRegExp, '^$1');

    return arg;
}

function escapeArgument(arg, doubleEscapeMetaChars) {
    // Convert to string
    arg = `${arg}`;

    // Algorithm below is based on https://qntm.org/cmd

    // Sequence of backslashes followed by a double quote:
    // double up all the backslashes and escape the double quote
    arg = arg.replace(/(\\*)"/g, '$1$1\\"');

    // Sequence of backslashes followed by the end of the string
    // (which will become a double quote later):
    // double up all the backslashes
    arg = arg.replace(/(\\*)$/, '$1$1');

    // All other backslashes occur literally

    // Quote the whole thing:
    arg = `"${arg}"`;

    // Escape meta chars
    arg = arg.replace(metaCharsRegExp, '^$1');

    // Double escape meta chars if necessary
    if (doubleEscapeMetaChars) {
        arg = arg.replace(metaCharsRegExp, '^$1');
    }

    return arg;
}

module.exports.command = escapeCommand;
module.exports.argument = escapeArgument;


/***/ }),

/***/ 1252:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const fs = __nccwpck_require__(7147);
const shebangCommand = __nccwpck_require__(7032);

function readShebang(command) {
    // Read the first 150 bytes from the file
    const size = 150;
    const buffer = Buffer.alloc(size);

    let fd;

    try {
        fd = fs.openSync(command, 'r');
        fs.readSync(fd, buffer, 0, size, 0);
        fs.closeSync(fd);
    } catch (e) { /* Empty */ }

    // Attempt to extract shebang (null is returned if not a shebang)
    return shebangCommand(buffer.toString());
}

module.exports = readShebang;


/***/ }),

/***/ 7274:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const path = __nccwpck_require__(1017);
const which = __nccwpck_require__(4207);
const getPathKey = __nccwpck_require__(539);

function resolveCommandAttempt(parsed, withoutPathExt) {
    const env = parsed.options.env || process.env;
    const cwd = process.cwd();
    const hasCustomCwd = parsed.options.cwd != null;
    // Worker threads do not have process.chdir()
    const shouldSwitchCwd = hasCustomCwd && process.chdir !== undefined && !process.chdir.disabled;

    // If a custom `cwd` was specified, we need to change the process cwd
    // because `which` will do stat calls but does not support a custom cwd
    if (shouldSwitchCwd) {
        try {
            process.chdir(parsed.options.cwd);
        } catch (err) {
            /* Empty */
        }
    }

    let resolved;

    try {
        resolved = which.sync(parsed.command, {
            path: env[getPathKey({ env })],
            pathExt: withoutPathExt ? path.delimiter : undefined,
        });
    } catch (e) {
        /* Empty */
    } finally {
        if (shouldSwitchCwd) {
            process.chdir(cwd);
        }
    }

    // If we successfully resolved, ensure that an absolute path is returned
    // Note that when a custom `cwd` was used, we need to resolve to an absolute path based on it
    if (resolved) {
        resolved = path.resolve(hasCustomCwd ? parsed.options.cwd : '', resolved);
    }

    return resolved;
}

function resolveCommand(parsed) {
    return resolveCommandAttempt(parsed) || resolveCommandAttempt(parsed, true);
}

module.exports = resolveCommand;


/***/ }),

/***/ 8932:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

class Deprecation extends Error {
  constructor(message) {
    super(message); // Maintains proper stack trace (only available on V8)

    /* istanbul ignore next */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = 'Deprecation';
  }

}

exports.Deprecation = Deprecation;


/***/ }),

/***/ 1205:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var once = __nccwpck_require__(1223);

var noop = function() {};

var isRequest = function(stream) {
	return stream.setHeader && typeof stream.abort === 'function';
};

var isChildProcess = function(stream) {
	return stream.stdio && Array.isArray(stream.stdio) && stream.stdio.length === 3
};

var eos = function(stream, opts, callback) {
	if (typeof opts === 'function') return eos(stream, null, opts);
	if (!opts) opts = {};

	callback = once(callback || noop);

	var ws = stream._writableState;
	var rs = stream._readableState;
	var readable = opts.readable || (opts.readable !== false && stream.readable);
	var writable = opts.writable || (opts.writable !== false && stream.writable);
	var cancelled = false;

	var onlegacyfinish = function() {
		if (!stream.writable) onfinish();
	};

	var onfinish = function() {
		writable = false;
		if (!readable) callback.call(stream);
	};

	var onend = function() {
		readable = false;
		if (!writable) callback.call(stream);
	};

	var onexit = function(exitCode) {
		callback.call(stream, exitCode ? new Error('exited with error code: ' + exitCode) : null);
	};

	var onerror = function(err) {
		callback.call(stream, err);
	};

	var onclose = function() {
		process.nextTick(onclosenexttick);
	};

	var onclosenexttick = function() {
		if (cancelled) return;
		if (readable && !(rs && (rs.ended && !rs.destroyed))) return callback.call(stream, new Error('premature close'));
		if (writable && !(ws && (ws.ended && !ws.destroyed))) return callback.call(stream, new Error('premature close'));
	};

	var onrequest = function() {
		stream.req.on('finish', onfinish);
	};

	if (isRequest(stream)) {
		stream.on('complete', onfinish);
		stream.on('abort', onclose);
		if (stream.req) onrequest();
		else stream.on('request', onrequest);
	} else if (writable && !ws) { // legacy streams
		stream.on('end', onlegacyfinish);
		stream.on('close', onlegacyfinish);
	}

	if (isChildProcess(stream)) stream.on('exit', onexit);

	stream.on('end', onend);
	stream.on('finish', onfinish);
	if (opts.error !== false) stream.on('error', onerror);
	stream.on('close', onclose);

	return function() {
		cancelled = true;
		stream.removeListener('complete', onfinish);
		stream.removeListener('abort', onclose);
		stream.removeListener('request', onrequest);
		if (stream.req) stream.req.removeListener('finish', onfinish);
		stream.removeListener('end', onlegacyfinish);
		stream.removeListener('close', onlegacyfinish);
		stream.removeListener('finish', onfinish);
		stream.removeListener('exit', onexit);
		stream.removeListener('end', onend);
		stream.removeListener('error', onerror);
		stream.removeListener('close', onclose);
	};
};

module.exports = eos;


/***/ }),

/***/ 5447:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const path = __nccwpck_require__(1017);
const childProcess = __nccwpck_require__(2081);
const crossSpawn = __nccwpck_require__(7881);
const stripFinalNewline = __nccwpck_require__(8174);
const npmRunPath = __nccwpck_require__(502);
const onetime = __nccwpck_require__(9082);
const makeError = __nccwpck_require__(2187);
const normalizeStdio = __nccwpck_require__(166);
const {spawnedKill, spawnedCancel, setupTimeout, setExitHandler} = __nccwpck_require__(9819);
const {handleInput, getSpawnedResult, makeAllStream, validateInputSync} = __nccwpck_require__(2592);
const {mergePromise, getSpawnedPromise} = __nccwpck_require__(7814);
const {joinCommand, parseCommand} = __nccwpck_require__(8286);

const DEFAULT_MAX_BUFFER = 1000 * 1000 * 100;

const getEnv = ({env: envOption, extendEnv, preferLocal, localDir, execPath}) => {
	const env = extendEnv ? {...process.env, ...envOption} : envOption;

	if (preferLocal) {
		return npmRunPath.env({env, cwd: localDir, execPath});
	}

	return env;
};

const handleArguments = (file, args, options = {}) => {
	const parsed = crossSpawn._parse(file, args, options);
	file = parsed.command;
	args = parsed.args;
	options = parsed.options;

	options = {
		maxBuffer: DEFAULT_MAX_BUFFER,
		buffer: true,
		stripFinalNewline: true,
		extendEnv: true,
		preferLocal: false,
		localDir: options.cwd || process.cwd(),
		execPath: process.execPath,
		encoding: 'utf8',
		reject: true,
		cleanup: true,
		all: false,
		windowsHide: true,
		...options
	};

	options.env = getEnv(options);

	options.stdio = normalizeStdio(options);

	if (process.platform === 'win32' && path.basename(file, '.exe') === 'cmd') {
		// #116
		args.unshift('/q');
	}

	return {file, args, options, parsed};
};

const handleOutput = (options, value, error) => {
	if (typeof value !== 'string' && !Buffer.isBuffer(value)) {
		// When `execa.sync()` errors, we normalize it to '' to mimic `execa()`
		return error === undefined ? undefined : '';
	}

	if (options.stripFinalNewline) {
		return stripFinalNewline(value);
	}

	return value;
};

const execa = (file, args, options) => {
	const parsed = handleArguments(file, args, options);
	const command = joinCommand(file, args);

	let spawned;
	try {
		spawned = childProcess.spawn(parsed.file, parsed.args, parsed.options);
	} catch (error) {
		// Ensure the returned error is always both a promise and a child process
		const dummySpawned = new childProcess.ChildProcess();
		const errorPromise = Promise.reject(makeError({
			error,
			stdout: '',
			stderr: '',
			all: '',
			command,
			parsed,
			timedOut: false,
			isCanceled: false,
			killed: false
		}));
		return mergePromise(dummySpawned, errorPromise);
	}

	const spawnedPromise = getSpawnedPromise(spawned);
	const timedPromise = setupTimeout(spawned, parsed.options, spawnedPromise);
	const processDone = setExitHandler(spawned, parsed.options, timedPromise);

	const context = {isCanceled: false};

	spawned.kill = spawnedKill.bind(null, spawned.kill.bind(spawned));
	spawned.cancel = spawnedCancel.bind(null, spawned, context);

	const handlePromise = async () => {
		const [{error, exitCode, signal, timedOut}, stdoutResult, stderrResult, allResult] = await getSpawnedResult(spawned, parsed.options, processDone);
		const stdout = handleOutput(parsed.options, stdoutResult);
		const stderr = handleOutput(parsed.options, stderrResult);
		const all = handleOutput(parsed.options, allResult);

		if (error || exitCode !== 0 || signal !== null) {
			const returnedError = makeError({
				error,
				exitCode,
				signal,
				stdout,
				stderr,
				all,
				command,
				parsed,
				timedOut,
				isCanceled: context.isCanceled,
				killed: spawned.killed
			});

			if (!parsed.options.reject) {
				return returnedError;
			}

			throw returnedError;
		}

		return {
			command,
			exitCode: 0,
			stdout,
			stderr,
			all,
			failed: false,
			timedOut: false,
			isCanceled: false,
			killed: false
		};
	};

	const handlePromiseOnce = onetime(handlePromise);

	crossSpawn._enoent.hookChildProcess(spawned, parsed.parsed);

	handleInput(spawned, parsed.options.input);

	spawned.all = makeAllStream(spawned, parsed.options);

	return mergePromise(spawned, handlePromiseOnce);
};

module.exports = execa;

module.exports.sync = (file, args, options) => {
	const parsed = handleArguments(file, args, options);
	const command = joinCommand(file, args);

	validateInputSync(parsed.options);

	let result;
	try {
		result = childProcess.spawnSync(parsed.file, parsed.args, parsed.options);
	} catch (error) {
		throw makeError({
			error,
			stdout: '',
			stderr: '',
			all: '',
			command,
			parsed,
			timedOut: false,
			isCanceled: false,
			killed: false
		});
	}

	const stdout = handleOutput(parsed.options, result.stdout, result.error);
	const stderr = handleOutput(parsed.options, result.stderr, result.error);

	if (result.error || result.status !== 0 || result.signal !== null) {
		const error = makeError({
			stdout,
			stderr,
			error: result.error,
			signal: result.signal,
			exitCode: result.status,
			command,
			parsed,
			timedOut: result.error && result.error.code === 'ETIMEDOUT',
			isCanceled: false,
			killed: result.signal !== null
		});

		if (!parsed.options.reject) {
			return error;
		}

		throw error;
	}

	return {
		command,
		exitCode: 0,
		stdout,
		stderr,
		failed: false,
		timedOut: false,
		isCanceled: false,
		killed: false
	};
};

module.exports.command = (command, options) => {
	const [file, ...args] = parseCommand(command);
	return execa(file, args, options);
};

module.exports.commandSync = (command, options) => {
	const [file, ...args] = parseCommand(command);
	return execa.sync(file, args, options);
};

module.exports.node = (scriptPath, args, options = {}) => {
	if (args && !Array.isArray(args) && typeof args === 'object') {
		options = args;
		args = [];
	}

	const stdio = normalizeStdio.node(options);
	const defaultExecArgv = process.execArgv.filter(arg => !arg.startsWith('--inspect'));

	const {
		nodePath = process.execPath,
		nodeOptions = defaultExecArgv
	} = options;

	return execa(
		nodePath,
		[
			...nodeOptions,
			scriptPath,
			...(Array.isArray(args) ? args : [])
		],
		{
			...options,
			stdin: undefined,
			stdout: undefined,
			stderr: undefined,
			stdio,
			shell: false
		}
	);
};


/***/ }),

/***/ 8286:
/***/ ((module) => {

"use strict";

const SPACES_REGEXP = / +/g;

const joinCommand = (file, args = []) => {
	if (!Array.isArray(args)) {
		return file;
	}

	return [file, ...args].join(' ');
};

// Handle `execa.command()`
const parseCommand = command => {
	const tokens = [];
	for (const token of command.trim().split(SPACES_REGEXP)) {
		// Allow spaces to be escaped by a backslash if not meant as a delimiter
		const previousToken = tokens[tokens.length - 1];
		if (previousToken && previousToken.endsWith('\\')) {
			// Merge previous token with current one
			tokens[tokens.length - 1] = `${previousToken.slice(0, -1)} ${token}`;
		} else {
			tokens.push(token);
		}
	}

	return tokens;
};

module.exports = {
	joinCommand,
	parseCommand
};


/***/ }),

/***/ 2187:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const {signalsByName} = __nccwpck_require__(2779);

const getErrorPrefix = ({timedOut, timeout, errorCode, signal, signalDescription, exitCode, isCanceled}) => {
	if (timedOut) {
		return `timed out after ${timeout} milliseconds`;
	}

	if (isCanceled) {
		return 'was canceled';
	}

	if (errorCode !== undefined) {
		return `failed with ${errorCode}`;
	}

	if (signal !== undefined) {
		return `was killed with ${signal} (${signalDescription})`;
	}

	if (exitCode !== undefined) {
		return `failed with exit code ${exitCode}`;
	}

	return 'failed';
};

const makeError = ({
	stdout,
	stderr,
	all,
	error,
	signal,
	exitCode,
	command,
	timedOut,
	isCanceled,
	killed,
	parsed: {options: {timeout}}
}) => {
	// `signal` and `exitCode` emitted on `spawned.on('exit')` event can be `null`.
	// We normalize them to `undefined`
	exitCode = exitCode === null ? undefined : exitCode;
	signal = signal === null ? undefined : signal;
	const signalDescription = signal === undefined ? undefined : signalsByName[signal].description;

	const errorCode = error && error.code;

	const prefix = getErrorPrefix({timedOut, timeout, errorCode, signal, signalDescription, exitCode, isCanceled});
	const execaMessage = `Command ${prefix}: ${command}`;
	const isError = Object.prototype.toString.call(error) === '[object Error]';
	const shortMessage = isError ? `${execaMessage}\n${error.message}` : execaMessage;
	const message = [shortMessage, stderr, stdout].filter(Boolean).join('\n');

	if (isError) {
		error.originalMessage = error.message;
		error.message = message;
	} else {
		error = new Error(message);
	}

	error.shortMessage = shortMessage;
	error.command = command;
	error.exitCode = exitCode;
	error.signal = signal;
	error.signalDescription = signalDescription;
	error.stdout = stdout;
	error.stderr = stderr;

	if (all !== undefined) {
		error.all = all;
	}

	if ('bufferedData' in error) {
		delete error.bufferedData;
	}

	error.failed = true;
	error.timedOut = Boolean(timedOut);
	error.isCanceled = isCanceled;
	error.killed = killed && !timedOut;

	return error;
};

module.exports = makeError;


/***/ }),

/***/ 9819:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const os = __nccwpck_require__(2037);
const onExit = __nccwpck_require__(4931);

const DEFAULT_FORCE_KILL_TIMEOUT = 1000 * 5;

// Monkey-patches `childProcess.kill()` to add `forceKillAfterTimeout` behavior
const spawnedKill = (kill, signal = 'SIGTERM', options = {}) => {
	const killResult = kill(signal);
	setKillTimeout(kill, signal, options, killResult);
	return killResult;
};

const setKillTimeout = (kill, signal, options, killResult) => {
	if (!shouldForceKill(signal, options, killResult)) {
		return;
	}

	const timeout = getForceKillAfterTimeout(options);
	const t = setTimeout(() => {
		kill('SIGKILL');
	}, timeout);

	// Guarded because there's no `.unref()` when `execa` is used in the renderer
	// process in Electron. This cannot be tested since we don't run tests in
	// Electron.
	// istanbul ignore else
	if (t.unref) {
		t.unref();
	}
};

const shouldForceKill = (signal, {forceKillAfterTimeout}, killResult) => {
	return isSigterm(signal) && forceKillAfterTimeout !== false && killResult;
};

const isSigterm = signal => {
	return signal === os.constants.signals.SIGTERM ||
		(typeof signal === 'string' && signal.toUpperCase() === 'SIGTERM');
};

const getForceKillAfterTimeout = ({forceKillAfterTimeout = true}) => {
	if (forceKillAfterTimeout === true) {
		return DEFAULT_FORCE_KILL_TIMEOUT;
	}

	if (!Number.isFinite(forceKillAfterTimeout) || forceKillAfterTimeout < 0) {
		throw new TypeError(`Expected the \`forceKillAfterTimeout\` option to be a non-negative integer, got \`${forceKillAfterTimeout}\` (${typeof forceKillAfterTimeout})`);
	}

	return forceKillAfterTimeout;
};

// `childProcess.cancel()`
const spawnedCancel = (spawned, context) => {
	const killResult = spawned.kill();

	if (killResult) {
		context.isCanceled = true;
	}
};

const timeoutKill = (spawned, signal, reject) => {
	spawned.kill(signal);
	reject(Object.assign(new Error('Timed out'), {timedOut: true, signal}));
};

// `timeout` option handling
const setupTimeout = (spawned, {timeout, killSignal = 'SIGTERM'}, spawnedPromise) => {
	if (timeout === 0 || timeout === undefined) {
		return spawnedPromise;
	}

	if (!Number.isFinite(timeout) || timeout < 0) {
		throw new TypeError(`Expected the \`timeout\` option to be a non-negative integer, got \`${timeout}\` (${typeof timeout})`);
	}

	let timeoutId;
	const timeoutPromise = new Promise((resolve, reject) => {
		timeoutId = setTimeout(() => {
			timeoutKill(spawned, killSignal, reject);
		}, timeout);
	});

	const safeSpawnedPromise = spawnedPromise.finally(() => {
		clearTimeout(timeoutId);
	});

	return Promise.race([timeoutPromise, safeSpawnedPromise]);
};

// `cleanup` option handling
const setExitHandler = async (spawned, {cleanup, detached}, timedPromise) => {
	if (!cleanup || detached) {
		return timedPromise;
	}

	const removeExitHandler = onExit(() => {
		spawned.kill();
	});

	return timedPromise.finally(() => {
		removeExitHandler();
	});
};

module.exports = {
	spawnedKill,
	spawnedCancel,
	setupTimeout,
	setExitHandler
};


/***/ }),

/***/ 7814:
/***/ ((module) => {

"use strict";


const nativePromisePrototype = (async () => {})().constructor.prototype;
const descriptors = ['then', 'catch', 'finally'].map(property => [
	property,
	Reflect.getOwnPropertyDescriptor(nativePromisePrototype, property)
]);

// The return value is a mixin of `childProcess` and `Promise`
const mergePromise = (spawned, promise) => {
	for (const [property, descriptor] of descriptors) {
		// Starting the main `promise` is deferred to avoid consuming streams
		const value = typeof promise === 'function' ?
			(...args) => Reflect.apply(descriptor.value, promise(), args) :
			descriptor.value.bind(promise);

		Reflect.defineProperty(spawned, property, {...descriptor, value});
	}

	return spawned;
};

// Use promises instead of `child_process` events
const getSpawnedPromise = spawned => {
	return new Promise((resolve, reject) => {
		spawned.on('exit', (exitCode, signal) => {
			resolve({exitCode, signal});
		});

		spawned.on('error', error => {
			reject(error);
		});

		if (spawned.stdin) {
			spawned.stdin.on('error', error => {
				reject(error);
			});
		}
	});
};

module.exports = {
	mergePromise,
	getSpawnedPromise
};



/***/ }),

/***/ 166:
/***/ ((module) => {

"use strict";

const aliases = ['stdin', 'stdout', 'stderr'];

const hasAlias = opts => aliases.some(alias => opts[alias] !== undefined);

const normalizeStdio = opts => {
	if (!opts) {
		return;
	}

	const {stdio} = opts;

	if (stdio === undefined) {
		return aliases.map(alias => opts[alias]);
	}

	if (hasAlias(opts)) {
		throw new Error(`It's not possible to provide \`stdio\` in combination with one of ${aliases.map(alias => `\`${alias}\``).join(', ')}`);
	}

	if (typeof stdio === 'string') {
		return stdio;
	}

	if (!Array.isArray(stdio)) {
		throw new TypeError(`Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof stdio}\``);
	}

	const length = Math.max(stdio.length, aliases.length);
	return Array.from({length}, (value, index) => stdio[index]);
};

module.exports = normalizeStdio;

// `ipc` is pushed unless it is already present
module.exports.node = opts => {
	const stdio = normalizeStdio(opts);

	if (stdio === 'ipc') {
		return 'ipc';
	}

	if (stdio === undefined || typeof stdio === 'string') {
		return [stdio, stdio, stdio, 'ipc'];
	}

	if (stdio.includes('ipc')) {
		return stdio;
	}

	return [...stdio, 'ipc'];
};


/***/ }),

/***/ 2592:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const isStream = __nccwpck_require__(1554);
const getStream = __nccwpck_require__(1766);
const mergeStream = __nccwpck_require__(2621);

// `input` option
const handleInput = (spawned, input) => {
	// Checking for stdin is workaround for https://github.com/nodejs/node/issues/26852
	// TODO: Remove `|| spawned.stdin === undefined` once we drop support for Node.js <=12.2.0
	if (input === undefined || spawned.stdin === undefined) {
		return;
	}

	if (isStream(input)) {
		input.pipe(spawned.stdin);
	} else {
		spawned.stdin.end(input);
	}
};

// `all` interleaves `stdout` and `stderr`
const makeAllStream = (spawned, {all}) => {
	if (!all || (!spawned.stdout && !spawned.stderr)) {
		return;
	}

	const mixed = mergeStream();

	if (spawned.stdout) {
		mixed.add(spawned.stdout);
	}

	if (spawned.stderr) {
		mixed.add(spawned.stderr);
	}

	return mixed;
};

// On failure, `result.stdout|stderr|all` should contain the currently buffered stream
const getBufferedData = async (stream, streamPromise) => {
	if (!stream) {
		return;
	}

	stream.destroy();

	try {
		return await streamPromise;
	} catch (error) {
		return error.bufferedData;
	}
};

const getStreamPromise = (stream, {encoding, buffer, maxBuffer}) => {
	if (!stream || !buffer) {
		return;
	}

	if (encoding) {
		return getStream(stream, {encoding, maxBuffer});
	}

	return getStream.buffer(stream, {maxBuffer});
};

// Retrieve result of child process: exit code, signal, error, streams (stdout/stderr/all)
const getSpawnedResult = async ({stdout, stderr, all}, {encoding, buffer, maxBuffer}, processDone) => {
	const stdoutPromise = getStreamPromise(stdout, {encoding, buffer, maxBuffer});
	const stderrPromise = getStreamPromise(stderr, {encoding, buffer, maxBuffer});
	const allPromise = getStreamPromise(all, {encoding, buffer, maxBuffer: maxBuffer * 2});

	try {
		return await Promise.all([processDone, stdoutPromise, stderrPromise, allPromise]);
	} catch (error) {
		return Promise.all([
			{error, signal: error.signal, timedOut: error.timedOut},
			getBufferedData(stdout, stdoutPromise),
			getBufferedData(stderr, stderrPromise),
			getBufferedData(all, allPromise)
		]);
	}
};

const validateInputSync = ({input}) => {
	if (isStream(input)) {
		throw new TypeError('The `input` option cannot be a stream in sync mode');
	}
};

module.exports = {
	handleInput,
	makeAllStream,
	getSpawnedResult,
	validateInputSync
};



/***/ }),

/***/ 6863:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = realpath
realpath.realpath = realpath
realpath.sync = realpathSync
realpath.realpathSync = realpathSync
realpath.monkeypatch = monkeypatch
realpath.unmonkeypatch = unmonkeypatch

var fs = __nccwpck_require__(7147)
var origRealpath = fs.realpath
var origRealpathSync = fs.realpathSync

var version = process.version
var ok = /^v[0-5]\./.test(version)
var old = __nccwpck_require__(1734)

function newError (er) {
  return er && er.syscall === 'realpath' && (
    er.code === 'ELOOP' ||
    er.code === 'ENOMEM' ||
    er.code === 'ENAMETOOLONG'
  )
}

function realpath (p, cache, cb) {
  if (ok) {
    return origRealpath(p, cache, cb)
  }

  if (typeof cache === 'function') {
    cb = cache
    cache = null
  }
  origRealpath(p, cache, function (er, result) {
    if (newError(er)) {
      old.realpath(p, cache, cb)
    } else {
      cb(er, result)
    }
  })
}

function realpathSync (p, cache) {
  if (ok) {
    return origRealpathSync(p, cache)
  }

  try {
    return origRealpathSync(p, cache)
  } catch (er) {
    if (newError(er)) {
      return old.realpathSync(p, cache)
    } else {
      throw er
    }
  }
}

function monkeypatch () {
  fs.realpath = realpath
  fs.realpathSync = realpathSync
}

function unmonkeypatch () {
  fs.realpath = origRealpath
  fs.realpathSync = origRealpathSync
}


/***/ }),

/***/ 1734:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var pathModule = __nccwpck_require__(1017);
var isWindows = process.platform === 'win32';
var fs = __nccwpck_require__(7147);

// JavaScript implementation of realpath, ported from node pre-v6

var DEBUG = process.env.NODE_DEBUG && /fs/.test(process.env.NODE_DEBUG);

function rethrow() {
  // Only enable in debug mode. A backtrace uses ~1000 bytes of heap space and
  // is fairly slow to generate.
  var callback;
  if (DEBUG) {
    var backtrace = new Error;
    callback = debugCallback;
  } else
    callback = missingCallback;

  return callback;

  function debugCallback(err) {
    if (err) {
      backtrace.message = err.message;
      err = backtrace;
      missingCallback(err);
    }
  }

  function missingCallback(err) {
    if (err) {
      if (process.throwDeprecation)
        throw err;  // Forgot a callback but don't know where? Use NODE_DEBUG=fs
      else if (!process.noDeprecation) {
        var msg = 'fs: missing callback ' + (err.stack || err.message);
        if (process.traceDeprecation)
          console.trace(msg);
        else
          console.error(msg);
      }
    }
  }
}

function maybeCallback(cb) {
  return typeof cb === 'function' ? cb : rethrow();
}

var normalize = pathModule.normalize;

// Regexp that finds the next partion of a (partial) path
// result is [base_with_slash, base], e.g. ['somedir/', 'somedir']
if (isWindows) {
  var nextPartRe = /(.*?)(?:[\/\\]+|$)/g;
} else {
  var nextPartRe = /(.*?)(?:[\/]+|$)/g;
}

// Regex to find the device root, including trailing slash. E.g. 'c:\\'.
if (isWindows) {
  var splitRootRe = /^(?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?[\\\/]*/;
} else {
  var splitRootRe = /^[\/]*/;
}

exports.realpathSync = function realpathSync(p, cache) {
  // make p is absolute
  p = pathModule.resolve(p);

  if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
    return cache[p];
  }

  var original = p,
      seenLinks = {},
      knownHard = {};

  // current character position in p
  var pos;
  // the partial path so far, including a trailing slash if any
  var current;
  // the partial path without a trailing slash (except when pointing at a root)
  var base;
  // the partial path scanned in the previous round, with slash
  var previous;

  start();

  function start() {
    // Skip over roots
    var m = splitRootRe.exec(p);
    pos = m[0].length;
    current = m[0];
    base = m[0];
    previous = '';

    // On windows, check that the root exists. On unix there is no need.
    if (isWindows && !knownHard[base]) {
      fs.lstatSync(base);
      knownHard[base] = true;
    }
  }

  // walk down the path, swapping out linked pathparts for their real
  // values
  // NB: p.length changes.
  while (pos < p.length) {
    // find the next part
    nextPartRe.lastIndex = pos;
    var result = nextPartRe.exec(p);
    previous = current;
    current += result[0];
    base = previous + result[1];
    pos = nextPartRe.lastIndex;

    // continue if not a symlink
    if (knownHard[base] || (cache && cache[base] === base)) {
      continue;
    }

    var resolvedLink;
    if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
      // some known symbolic link.  no need to stat again.
      resolvedLink = cache[base];
    } else {
      var stat = fs.lstatSync(base);
      if (!stat.isSymbolicLink()) {
        knownHard[base] = true;
        if (cache) cache[base] = base;
        continue;
      }

      // read the link if it wasn't read before
      // dev/ino always return 0 on windows, so skip the check.
      var linkTarget = null;
      if (!isWindows) {
        var id = stat.dev.toString(32) + ':' + stat.ino.toString(32);
        if (seenLinks.hasOwnProperty(id)) {
          linkTarget = seenLinks[id];
        }
      }
      if (linkTarget === null) {
        fs.statSync(base);
        linkTarget = fs.readlinkSync(base);
      }
      resolvedLink = pathModule.resolve(previous, linkTarget);
      // track this, if given a cache.
      if (cache) cache[base] = resolvedLink;
      if (!isWindows) seenLinks[id] = linkTarget;
    }

    // resolve the link, then start over
    p = pathModule.resolve(resolvedLink, p.slice(pos));
    start();
  }

  if (cache) cache[original] = p;

  return p;
};


exports.realpath = function realpath(p, cache, cb) {
  if (typeof cb !== 'function') {
    cb = maybeCallback(cache);
    cache = null;
  }

  // make p is absolute
  p = pathModule.resolve(p);

  if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
    return process.nextTick(cb.bind(null, null, cache[p]));
  }

  var original = p,
      seenLinks = {},
      knownHard = {};

  // current character position in p
  var pos;
  // the partial path so far, including a trailing slash if any
  var current;
  // the partial path without a trailing slash (except when pointing at a root)
  var base;
  // the partial path scanned in the previous round, with slash
  var previous;

  start();

  function start() {
    // Skip over roots
    var m = splitRootRe.exec(p);
    pos = m[0].length;
    current = m[0];
    base = m[0];
    previous = '';

    // On windows, check that the root exists. On unix there is no need.
    if (isWindows && !knownHard[base]) {
      fs.lstat(base, function(err) {
        if (err) return cb(err);
        knownHard[base] = true;
        LOOP();
      });
    } else {
      process.nextTick(LOOP);
    }
  }

  // walk down the path, swapping out linked pathparts for their real
  // values
  function LOOP() {
    // stop if scanned past end of path
    if (pos >= p.length) {
      if (cache) cache[original] = p;
      return cb(null, p);
    }

    // find the next part
    nextPartRe.lastIndex = pos;
    var result = nextPartRe.exec(p);
    previous = current;
    current += result[0];
    base = previous + result[1];
    pos = nextPartRe.lastIndex;

    // continue if not a symlink
    if (knownHard[base] || (cache && cache[base] === base)) {
      return process.nextTick(LOOP);
    }

    if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
      // known symbolic link.  no need to stat again.
      return gotResolvedLink(cache[base]);
    }

    return fs.lstat(base, gotStat);
  }

  function gotStat(err, stat) {
    if (err) return cb(err);

    // if not a symlink, skip to the next path part
    if (!stat.isSymbolicLink()) {
      knownHard[base] = true;
      if (cache) cache[base] = base;
      return process.nextTick(LOOP);
    }

    // stat & read the link if not read before
    // call gotTarget as soon as the link target is known
    // dev/ino always return 0 on windows, so skip the check.
    if (!isWindows) {
      var id = stat.dev.toString(32) + ':' + stat.ino.toString(32);
      if (seenLinks.hasOwnProperty(id)) {
        return gotTarget(null, seenLinks[id], base);
      }
    }
    fs.stat(base, function(err) {
      if (err) return cb(err);

      fs.readlink(base, function(err, target) {
        if (!isWindows) seenLinks[id] = target;
        gotTarget(err, target);
      });
    });
  }

  function gotTarget(err, target, base) {
    if (err) return cb(err);

    var resolvedLink = pathModule.resolve(previous, target);
    if (cache) cache[base] = resolvedLink;
    gotResolvedLink(resolvedLink);
  }

  function gotResolvedLink(resolvedLink) {
    // resolve the link, then start over
    p = pathModule.resolve(resolvedLink, p.slice(pos));
    start();
  }
};


/***/ }),

/***/ 1585:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const {PassThrough: PassThroughStream} = __nccwpck_require__(2781);

module.exports = options => {
	options = {...options};

	const {array} = options;
	let {encoding} = options;
	const isBuffer = encoding === 'buffer';
	let objectMode = false;

	if (array) {
		objectMode = !(encoding || isBuffer);
	} else {
		encoding = encoding || 'utf8';
	}

	if (isBuffer) {
		encoding = null;
	}

	const stream = new PassThroughStream({objectMode});

	if (encoding) {
		stream.setEncoding(encoding);
	}

	let length = 0;
	const chunks = [];

	stream.on('data', chunk => {
		chunks.push(chunk);

		if (objectMode) {
			length = chunks.length;
		} else {
			length += chunk.length;
		}
	});

	stream.getBufferedValue = () => {
		if (array) {
			return chunks;
		}

		return isBuffer ? Buffer.concat(chunks, length) : chunks.join('');
	};

	stream.getBufferedLength = () => length;

	return stream;
};


/***/ }),

/***/ 1766:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const {constants: BufferConstants} = __nccwpck_require__(4300);
const pump = __nccwpck_require__(8341);
const bufferStream = __nccwpck_require__(1585);

class MaxBufferError extends Error {
	constructor() {
		super('maxBuffer exceeded');
		this.name = 'MaxBufferError';
	}
}

async function getStream(inputStream, options) {
	if (!inputStream) {
		return Promise.reject(new Error('Expected a stream'));
	}

	options = {
		maxBuffer: Infinity,
		...options
	};

	const {maxBuffer} = options;

	let stream;
	await new Promise((resolve, reject) => {
		const rejectPromise = error => {
			// Don't retrieve an oversized buffer.
			if (error && stream.getBufferedLength() <= BufferConstants.MAX_LENGTH) {
				error.bufferedData = stream.getBufferedValue();
			}

			reject(error);
		};

		stream = pump(inputStream, bufferStream(options), error => {
			if (error) {
				rejectPromise(error);
				return;
			}

			resolve();
		});

		stream.on('data', () => {
			if (stream.getBufferedLength() > maxBuffer) {
				rejectPromise(new MaxBufferError());
			}
		});
	});

	return stream.getBufferedValue();
}

module.exports = getStream;
// TODO: Remove this for the next major release
module.exports["default"] = getStream;
module.exports.buffer = (stream, options) => getStream(stream, {...options, encoding: 'buffer'});
module.exports.array = (stream, options) => getStream(stream, {...options, array: true});
module.exports.MaxBufferError = MaxBufferError;


/***/ }),

/***/ 7625:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

exports.setopts = setopts
exports.ownProp = ownProp
exports.makeAbs = makeAbs
exports.finish = finish
exports.mark = mark
exports.isIgnored = isIgnored
exports.childrenIgnored = childrenIgnored

function ownProp (obj, field) {
  return Object.prototype.hasOwnProperty.call(obj, field)
}

var path = __nccwpck_require__(1017)
var minimatch = __nccwpck_require__(3973)
var isAbsolute = __nccwpck_require__(8714)
var Minimatch = minimatch.Minimatch

function alphasort (a, b) {
  return a.localeCompare(b, 'en')
}

function setupIgnores (self, options) {
  self.ignore = options.ignore || []

  if (!Array.isArray(self.ignore))
    self.ignore = [self.ignore]

  if (self.ignore.length) {
    self.ignore = self.ignore.map(ignoreMap)
  }
}

// ignore patterns are always in dot:true mode.
function ignoreMap (pattern) {
  var gmatcher = null
  if (pattern.slice(-3) === '/**') {
    var gpattern = pattern.replace(/(\/\*\*)+$/, '')
    gmatcher = new Minimatch(gpattern, { dot: true })
  }

  return {
    matcher: new Minimatch(pattern, { dot: true }),
    gmatcher: gmatcher
  }
}

function setopts (self, pattern, options) {
  if (!options)
    options = {}

  // base-matching: just use globstar for that.
  if (options.matchBase && -1 === pattern.indexOf("/")) {
    if (options.noglobstar) {
      throw new Error("base matching requires globstar")
    }
    pattern = "**/" + pattern
  }

  self.silent = !!options.silent
  self.pattern = pattern
  self.strict = options.strict !== false
  self.realpath = !!options.realpath
  self.realpathCache = options.realpathCache || Object.create(null)
  self.follow = !!options.follow
  self.dot = !!options.dot
  self.mark = !!options.mark
  self.nodir = !!options.nodir
  if (self.nodir)
    self.mark = true
  self.sync = !!options.sync
  self.nounique = !!options.nounique
  self.nonull = !!options.nonull
  self.nosort = !!options.nosort
  self.nocase = !!options.nocase
  self.stat = !!options.stat
  self.noprocess = !!options.noprocess
  self.absolute = !!options.absolute

  self.maxLength = options.maxLength || Infinity
  self.cache = options.cache || Object.create(null)
  self.statCache = options.statCache || Object.create(null)
  self.symlinks = options.symlinks || Object.create(null)

  setupIgnores(self, options)

  self.changedCwd = false
  var cwd = process.cwd()
  if (!ownProp(options, "cwd"))
    self.cwd = cwd
  else {
    self.cwd = path.resolve(options.cwd)
    self.changedCwd = self.cwd !== cwd
  }

  self.root = options.root || path.resolve(self.cwd, "/")
  self.root = path.resolve(self.root)
  if (process.platform === "win32")
    self.root = self.root.replace(/\\/g, "/")

  // TODO: is an absolute `cwd` supposed to be resolved against `root`?
  // e.g. { cwd: '/test', root: __dirname } === path.join(__dirname, '/test')
  self.cwdAbs = isAbsolute(self.cwd) ? self.cwd : makeAbs(self, self.cwd)
  if (process.platform === "win32")
    self.cwdAbs = self.cwdAbs.replace(/\\/g, "/")
  self.nomount = !!options.nomount

  // disable comments and negation in Minimatch.
  // Note that they are not supported in Glob itself anyway.
  options.nonegate = true
  options.nocomment = true

  self.minimatch = new Minimatch(pattern, options)
  self.options = self.minimatch.options
}

function finish (self) {
  var nou = self.nounique
  var all = nou ? [] : Object.create(null)

  for (var i = 0, l = self.matches.length; i < l; i ++) {
    var matches = self.matches[i]
    if (!matches || Object.keys(matches).length === 0) {
      if (self.nonull) {
        // do like the shell, and spit out the literal glob
        var literal = self.minimatch.globSet[i]
        if (nou)
          all.push(literal)
        else
          all[literal] = true
      }
    } else {
      // had matches
      var m = Object.keys(matches)
      if (nou)
        all.push.apply(all, m)
      else
        m.forEach(function (m) {
          all[m] = true
        })
    }
  }

  if (!nou)
    all = Object.keys(all)

  if (!self.nosort)
    all = all.sort(alphasort)

  // at *some* point we statted all of these
  if (self.mark) {
    for (var i = 0; i < all.length; i++) {
      all[i] = self._mark(all[i])
    }
    if (self.nodir) {
      all = all.filter(function (e) {
        var notDir = !(/\/$/.test(e))
        var c = self.cache[e] || self.cache[makeAbs(self, e)]
        if (notDir && c)
          notDir = c !== 'DIR' && !Array.isArray(c)
        return notDir
      })
    }
  }

  if (self.ignore.length)
    all = all.filter(function(m) {
      return !isIgnored(self, m)
    })

  self.found = all
}

function mark (self, p) {
  var abs = makeAbs(self, p)
  var c = self.cache[abs]
  var m = p
  if (c) {
    var isDir = c === 'DIR' || Array.isArray(c)
    var slash = p.slice(-1) === '/'

    if (isDir && !slash)
      m += '/'
    else if (!isDir && slash)
      m = m.slice(0, -1)

    if (m !== p) {
      var mabs = makeAbs(self, m)
      self.statCache[mabs] = self.statCache[abs]
      self.cache[mabs] = self.cache[abs]
    }
  }

  return m
}

// lotta situps...
function makeAbs (self, f) {
  var abs = f
  if (f.charAt(0) === '/') {
    abs = path.join(self.root, f)
  } else if (isAbsolute(f) || f === '') {
    abs = f
  } else if (self.changedCwd) {
    abs = path.resolve(self.cwd, f)
  } else {
    abs = path.resolve(f)
  }

  if (process.platform === 'win32')
    abs = abs.replace(/\\/g, '/')

  return abs
}


// Return true, if pattern ends with globstar '**', for the accompanying parent directory.
// Ex:- If node_modules/** is the pattern, add 'node_modules' to ignore list along with it's contents
function isIgnored (self, path) {
  if (!self.ignore.length)
    return false

  return self.ignore.some(function(item) {
    return item.matcher.match(path) || !!(item.gmatcher && item.gmatcher.match(path))
  })
}

function childrenIgnored (self, path) {
  if (!self.ignore.length)
    return false

  return self.ignore.some(function(item) {
    return !!(item.gmatcher && item.gmatcher.match(path))
  })
}


/***/ }),

/***/ 1957:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// Approach:
//
// 1. Get the minimatch set
// 2. For each pattern in the set, PROCESS(pattern, false)
// 3. Store matches per-set, then uniq them
//
// PROCESS(pattern, inGlobStar)
// Get the first [n] items from pattern that are all strings
// Join these together.  This is PREFIX.
//   If there is no more remaining, then stat(PREFIX) and
//   add to matches if it succeeds.  END.
//
// If inGlobStar and PREFIX is symlink and points to dir
//   set ENTRIES = []
// else readdir(PREFIX) as ENTRIES
//   If fail, END
//
// with ENTRIES
//   If pattern[n] is GLOBSTAR
//     // handle the case where the globstar match is empty
//     // by pruning it out, and testing the resulting pattern
//     PROCESS(pattern[0..n] + pattern[n+1 .. $], false)
//     // handle other cases.
//     for ENTRY in ENTRIES (not dotfiles)
//       // attach globstar + tail onto the entry
//       // Mark that this entry is a globstar match
//       PROCESS(pattern[0..n] + ENTRY + pattern[n .. $], true)
//
//   else // not globstar
//     for ENTRY in ENTRIES (not dotfiles, unless pattern[n] is dot)
//       Test ENTRY against pattern[n]
//       If fails, continue
//       If passes, PROCESS(pattern[0..n] + item + pattern[n+1 .. $])
//
// Caveat:
//   Cache all stats and readdirs results to minimize syscall.  Since all
//   we ever care about is existence and directory-ness, we can just keep
//   `true` for files, and [children,...] for directories, or `false` for
//   things that don't exist.

module.exports = glob

var fs = __nccwpck_require__(7147)
var rp = __nccwpck_require__(6863)
var minimatch = __nccwpck_require__(3973)
var Minimatch = minimatch.Minimatch
var inherits = __nccwpck_require__(4124)
var EE = (__nccwpck_require__(2361).EventEmitter)
var path = __nccwpck_require__(1017)
var assert = __nccwpck_require__(9491)
var isAbsolute = __nccwpck_require__(8714)
var globSync = __nccwpck_require__(9010)
var common = __nccwpck_require__(7625)
var setopts = common.setopts
var ownProp = common.ownProp
var inflight = __nccwpck_require__(2492)
var util = __nccwpck_require__(3837)
var childrenIgnored = common.childrenIgnored
var isIgnored = common.isIgnored

var once = __nccwpck_require__(1223)

function glob (pattern, options, cb) {
  if (typeof options === 'function') cb = options, options = {}
  if (!options) options = {}

  if (options.sync) {
    if (cb)
      throw new TypeError('callback provided to sync glob')
    return globSync(pattern, options)
  }

  return new Glob(pattern, options, cb)
}

glob.sync = globSync
var GlobSync = glob.GlobSync = globSync.GlobSync

// old api surface
glob.glob = glob

function extend (origin, add) {
  if (add === null || typeof add !== 'object') {
    return origin
  }

  var keys = Object.keys(add)
  var i = keys.length
  while (i--) {
    origin[keys[i]] = add[keys[i]]
  }
  return origin
}

glob.hasMagic = function (pattern, options_) {
  var options = extend({}, options_)
  options.noprocess = true

  var g = new Glob(pattern, options)
  var set = g.minimatch.set

  if (!pattern)
    return false

  if (set.length > 1)
    return true

  for (var j = 0; j < set[0].length; j++) {
    if (typeof set[0][j] !== 'string')
      return true
  }

  return false
}

glob.Glob = Glob
inherits(Glob, EE)
function Glob (pattern, options, cb) {
  if (typeof options === 'function') {
    cb = options
    options = null
  }

  if (options && options.sync) {
    if (cb)
      throw new TypeError('callback provided to sync glob')
    return new GlobSync(pattern, options)
  }

  if (!(this instanceof Glob))
    return new Glob(pattern, options, cb)

  setopts(this, pattern, options)
  this._didRealPath = false

  // process each pattern in the minimatch set
  var n = this.minimatch.set.length

  // The matches are stored as {<filename>: true,...} so that
  // duplicates are automagically pruned.
  // Later, we do an Object.keys() on these.
  // Keep them as a list so we can fill in when nonull is set.
  this.matches = new Array(n)

  if (typeof cb === 'function') {
    cb = once(cb)
    this.on('error', cb)
    this.on('end', function (matches) {
      cb(null, matches)
    })
  }

  var self = this
  this._processing = 0

  this._emitQueue = []
  this._processQueue = []
  this.paused = false

  if (this.noprocess)
    return this

  if (n === 0)
    return done()

  var sync = true
  for (var i = 0; i < n; i ++) {
    this._process(this.minimatch.set[i], i, false, done)
  }
  sync = false

  function done () {
    --self._processing
    if (self._processing <= 0) {
      if (sync) {
        process.nextTick(function () {
          self._finish()
        })
      } else {
        self._finish()
      }
    }
  }
}

Glob.prototype._finish = function () {
  assert(this instanceof Glob)
  if (this.aborted)
    return

  if (this.realpath && !this._didRealpath)
    return this._realpath()

  common.finish(this)
  this.emit('end', this.found)
}

Glob.prototype._realpath = function () {
  if (this._didRealpath)
    return

  this._didRealpath = true

  var n = this.matches.length
  if (n === 0)
    return this._finish()

  var self = this
  for (var i = 0; i < this.matches.length; i++)
    this._realpathSet(i, next)

  function next () {
    if (--n === 0)
      self._finish()
  }
}

Glob.prototype._realpathSet = function (index, cb) {
  var matchset = this.matches[index]
  if (!matchset)
    return cb()

  var found = Object.keys(matchset)
  var self = this
  var n = found.length

  if (n === 0)
    return cb()

  var set = this.matches[index] = Object.create(null)
  found.forEach(function (p, i) {
    // If there's a problem with the stat, then it means that
    // one or more of the links in the realpath couldn't be
    // resolved.  just return the abs value in that case.
    p = self._makeAbs(p)
    rp.realpath(p, self.realpathCache, function (er, real) {
      if (!er)
        set[real] = true
      else if (er.syscall === 'stat')
        set[p] = true
      else
        self.emit('error', er) // srsly wtf right here

      if (--n === 0) {
        self.matches[index] = set
        cb()
      }
    })
  })
}

Glob.prototype._mark = function (p) {
  return common.mark(this, p)
}

Glob.prototype._makeAbs = function (f) {
  return common.makeAbs(this, f)
}

Glob.prototype.abort = function () {
  this.aborted = true
  this.emit('abort')
}

Glob.prototype.pause = function () {
  if (!this.paused) {
    this.paused = true
    this.emit('pause')
  }
}

Glob.prototype.resume = function () {
  if (this.paused) {
    this.emit('resume')
    this.paused = false
    if (this._emitQueue.length) {
      var eq = this._emitQueue.slice(0)
      this._emitQueue.length = 0
      for (var i = 0; i < eq.length; i ++) {
        var e = eq[i]
        this._emitMatch(e[0], e[1])
      }
    }
    if (this._processQueue.length) {
      var pq = this._processQueue.slice(0)
      this._processQueue.length = 0
      for (var i = 0; i < pq.length; i ++) {
        var p = pq[i]
        this._processing--
        this._process(p[0], p[1], p[2], p[3])
      }
    }
  }
}

Glob.prototype._process = function (pattern, index, inGlobStar, cb) {
  assert(this instanceof Glob)
  assert(typeof cb === 'function')

  if (this.aborted)
    return

  this._processing++
  if (this.paused) {
    this._processQueue.push([pattern, index, inGlobStar, cb])
    return
  }

  //console.error('PROCESS %d', this._processing, pattern)

  // Get the first [n] parts of pattern that are all strings.
  var n = 0
  while (typeof pattern[n] === 'string') {
    n ++
  }
  // now n is the index of the first one that is *not* a string.

  // see if there's anything else
  var prefix
  switch (n) {
    // if not, then this is rather simple
    case pattern.length:
      this._processSimple(pattern.join('/'), index, cb)
      return

    case 0:
      // pattern *starts* with some non-trivial item.
      // going to readdir(cwd), but not include the prefix in matches.
      prefix = null
      break

    default:
      // pattern has some string bits in the front.
      // whatever it starts with, whether that's 'absolute' like /foo/bar,
      // or 'relative' like '../baz'
      prefix = pattern.slice(0, n).join('/')
      break
  }

  var remain = pattern.slice(n)

  // get the list of entries.
  var read
  if (prefix === null)
    read = '.'
  else if (isAbsolute(prefix) || isAbsolute(pattern.join('/'))) {
    if (!prefix || !isAbsolute(prefix))
      prefix = '/' + prefix
    read = prefix
  } else
    read = prefix

  var abs = this._makeAbs(read)

  //if ignored, skip _processing
  if (childrenIgnored(this, read))
    return cb()

  var isGlobStar = remain[0] === minimatch.GLOBSTAR
  if (isGlobStar)
    this._processGlobStar(prefix, read, abs, remain, index, inGlobStar, cb)
  else
    this._processReaddir(prefix, read, abs, remain, index, inGlobStar, cb)
}

Glob.prototype._processReaddir = function (prefix, read, abs, remain, index, inGlobStar, cb) {
  var self = this
  this._readdir(abs, inGlobStar, function (er, entries) {
    return self._processReaddir2(prefix, read, abs, remain, index, inGlobStar, entries, cb)
  })
}

Glob.prototype._processReaddir2 = function (prefix, read, abs, remain, index, inGlobStar, entries, cb) {

  // if the abs isn't a dir, then nothing can match!
  if (!entries)
    return cb()

  // It will only match dot entries if it starts with a dot, or if
  // dot is set.  Stuff like @(.foo|.bar) isn't allowed.
  var pn = remain[0]
  var negate = !!this.minimatch.negate
  var rawGlob = pn._glob
  var dotOk = this.dot || rawGlob.charAt(0) === '.'

  var matchedEntries = []
  for (var i = 0; i < entries.length; i++) {
    var e = entries[i]
    if (e.charAt(0) !== '.' || dotOk) {
      var m
      if (negate && !prefix) {
        m = !e.match(pn)
      } else {
        m = e.match(pn)
      }
      if (m)
        matchedEntries.push(e)
    }
  }

  //console.error('prd2', prefix, entries, remain[0]._glob, matchedEntries)

  var len = matchedEntries.length
  // If there are no matched entries, then nothing matches.
  if (len === 0)
    return cb()

  // if this is the last remaining pattern bit, then no need for
  // an additional stat *unless* the user has specified mark or
  // stat explicitly.  We know they exist, since readdir returned
  // them.

  if (remain.length === 1 && !this.mark && !this.stat) {
    if (!this.matches[index])
      this.matches[index] = Object.create(null)

    for (var i = 0; i < len; i ++) {
      var e = matchedEntries[i]
      if (prefix) {
        if (prefix !== '/')
          e = prefix + '/' + e
        else
          e = prefix + e
      }

      if (e.charAt(0) === '/' && !this.nomount) {
        e = path.join(this.root, e)
      }
      this._emitMatch(index, e)
    }
    // This was the last one, and no stats were needed
    return cb()
  }

  // now test all matched entries as stand-ins for that part
  // of the pattern.
  remain.shift()
  for (var i = 0; i < len; i ++) {
    var e = matchedEntries[i]
    var newPattern
    if (prefix) {
      if (prefix !== '/')
        e = prefix + '/' + e
      else
        e = prefix + e
    }
    this._process([e].concat(remain), index, inGlobStar, cb)
  }
  cb()
}

Glob.prototype._emitMatch = function (index, e) {
  if (this.aborted)
    return

  if (isIgnored(this, e))
    return

  if (this.paused) {
    this._emitQueue.push([index, e])
    return
  }

  var abs = isAbsolute(e) ? e : this._makeAbs(e)

  if (this.mark)
    e = this._mark(e)

  if (this.absolute)
    e = abs

  if (this.matches[index][e])
    return

  if (this.nodir) {
    var c = this.cache[abs]
    if (c === 'DIR' || Array.isArray(c))
      return
  }

  this.matches[index][e] = true

  var st = this.statCache[abs]
  if (st)
    this.emit('stat', e, st)

  this.emit('match', e)
}

Glob.prototype._readdirInGlobStar = function (abs, cb) {
  if (this.aborted)
    return

  // follow all symlinked directories forever
  // just proceed as if this is a non-globstar situation
  if (this.follow)
    return this._readdir(abs, false, cb)

  var lstatkey = 'lstat\0' + abs
  var self = this
  var lstatcb = inflight(lstatkey, lstatcb_)

  if (lstatcb)
    fs.lstat(abs, lstatcb)

  function lstatcb_ (er, lstat) {
    if (er && er.code === 'ENOENT')
      return cb()

    var isSym = lstat && lstat.isSymbolicLink()
    self.symlinks[abs] = isSym

    // If it's not a symlink or a dir, then it's definitely a regular file.
    // don't bother doing a readdir in that case.
    if (!isSym && lstat && !lstat.isDirectory()) {
      self.cache[abs] = 'FILE'
      cb()
    } else
      self._readdir(abs, false, cb)
  }
}

Glob.prototype._readdir = function (abs, inGlobStar, cb) {
  if (this.aborted)
    return

  cb = inflight('readdir\0'+abs+'\0'+inGlobStar, cb)
  if (!cb)
    return

  //console.error('RD %j %j', +inGlobStar, abs)
  if (inGlobStar && !ownProp(this.symlinks, abs))
    return this._readdirInGlobStar(abs, cb)

  if (ownProp(this.cache, abs)) {
    var c = this.cache[abs]
    if (!c || c === 'FILE')
      return cb()

    if (Array.isArray(c))
      return cb(null, c)
  }

  var self = this
  fs.readdir(abs, readdirCb(this, abs, cb))
}

function readdirCb (self, abs, cb) {
  return function (er, entries) {
    if (er)
      self._readdirError(abs, er, cb)
    else
      self._readdirEntries(abs, entries, cb)
  }
}

Glob.prototype._readdirEntries = function (abs, entries, cb) {
  if (this.aborted)
    return

  // if we haven't asked to stat everything, then just
  // assume that everything in there exists, so we can avoid
  // having to stat it a second time.
  if (!this.mark && !this.stat) {
    for (var i = 0; i < entries.length; i ++) {
      var e = entries[i]
      if (abs === '/')
        e = abs + e
      else
        e = abs + '/' + e
      this.cache[e] = true
    }
  }

  this.cache[abs] = entries
  return cb(null, entries)
}

Glob.prototype._readdirError = function (f, er, cb) {
  if (this.aborted)
    return

  // handle errors, and cache the information
  switch (er.code) {
    case 'ENOTSUP': // https://github.com/isaacs/node-glob/issues/205
    case 'ENOTDIR': // totally normal. means it *does* exist.
      var abs = this._makeAbs(f)
      this.cache[abs] = 'FILE'
      if (abs === this.cwdAbs) {
        var error = new Error(er.code + ' invalid cwd ' + this.cwd)
        error.path = this.cwd
        error.code = er.code
        this.emit('error', error)
        this.abort()
      }
      break

    case 'ENOENT': // not terribly unusual
    case 'ELOOP':
    case 'ENAMETOOLONG':
    case 'UNKNOWN':
      this.cache[this._makeAbs(f)] = false
      break

    default: // some unusual error.  Treat as failure.
      this.cache[this._makeAbs(f)] = false
      if (this.strict) {
        this.emit('error', er)
        // If the error is handled, then we abort
        // if not, we threw out of here
        this.abort()
      }
      if (!this.silent)
        console.error('glob error', er)
      break
  }

  return cb()
}

Glob.prototype._processGlobStar = function (prefix, read, abs, remain, index, inGlobStar, cb) {
  var self = this
  this._readdir(abs, inGlobStar, function (er, entries) {
    self._processGlobStar2(prefix, read, abs, remain, index, inGlobStar, entries, cb)
  })
}


Glob.prototype._processGlobStar2 = function (prefix, read, abs, remain, index, inGlobStar, entries, cb) {
  //console.error('pgs2', prefix, remain[0], entries)

  // no entries means not a dir, so it can never have matches
  // foo.txt/** doesn't match foo.txt
  if (!entries)
    return cb()

  // test without the globstar, and with every child both below
  // and replacing the globstar.
  var remainWithoutGlobStar = remain.slice(1)
  var gspref = prefix ? [ prefix ] : []
  var noGlobStar = gspref.concat(remainWithoutGlobStar)

  // the noGlobStar pattern exits the inGlobStar state
  this._process(noGlobStar, index, false, cb)

  var isSym = this.symlinks[abs]
  var len = entries.length

  // If it's a symlink, and we're in a globstar, then stop
  if (isSym && inGlobStar)
    return cb()

  for (var i = 0; i < len; i++) {
    var e = entries[i]
    if (e.charAt(0) === '.' && !this.dot)
      continue

    // these two cases enter the inGlobStar state
    var instead = gspref.concat(entries[i], remainWithoutGlobStar)
    this._process(instead, index, true, cb)

    var below = gspref.concat(entries[i], remain)
    this._process(below, index, true, cb)
  }

  cb()
}

Glob.prototype._processSimple = function (prefix, index, cb) {
  // XXX review this.  Shouldn't it be doing the mounting etc
  // before doing stat?  kinda weird?
  var self = this
  this._stat(prefix, function (er, exists) {
    self._processSimple2(prefix, index, er, exists, cb)
  })
}
Glob.prototype._processSimple2 = function (prefix, index, er, exists, cb) {

  //console.error('ps2', prefix, exists)

  if (!this.matches[index])
    this.matches[index] = Object.create(null)

  // If it doesn't exist, then just mark the lack of results
  if (!exists)
    return cb()

  if (prefix && isAbsolute(prefix) && !this.nomount) {
    var trail = /[\/\\]$/.test(prefix)
    if (prefix.charAt(0) === '/') {
      prefix = path.join(this.root, prefix)
    } else {
      prefix = path.resolve(this.root, prefix)
      if (trail)
        prefix += '/'
    }
  }

  if (process.platform === 'win32')
    prefix = prefix.replace(/\\/g, '/')

  // Mark this as a match
  this._emitMatch(index, prefix)
  cb()
}

// Returns either 'DIR', 'FILE', or false
Glob.prototype._stat = function (f, cb) {
  var abs = this._makeAbs(f)
  var needDir = f.slice(-1) === '/'

  if (f.length > this.maxLength)
    return cb()

  if (!this.stat && ownProp(this.cache, abs)) {
    var c = this.cache[abs]

    if (Array.isArray(c))
      c = 'DIR'

    // It exists, but maybe not how we need it
    if (!needDir || c === 'DIR')
      return cb(null, c)

    if (needDir && c === 'FILE')
      return cb()

    // otherwise we have to stat, because maybe c=true
    // if we know it exists, but not what it is.
  }

  var exists
  var stat = this.statCache[abs]
  if (stat !== undefined) {
    if (stat === false)
      return cb(null, stat)
    else {
      var type = stat.isDirectory() ? 'DIR' : 'FILE'
      if (needDir && type === 'FILE')
        return cb()
      else
        return cb(null, type, stat)
    }
  }

  var self = this
  var statcb = inflight('stat\0' + abs, lstatcb_)
  if (statcb)
    fs.lstat(abs, statcb)

  function lstatcb_ (er, lstat) {
    if (lstat && lstat.isSymbolicLink()) {
      // If it's a symlink, then treat it as the target, unless
      // the target does not exist, then treat it as a file.
      return fs.stat(abs, function (er, stat) {
        if (er)
          self._stat2(f, abs, null, lstat, cb)
        else
          self._stat2(f, abs, er, stat, cb)
      })
    } else {
      self._stat2(f, abs, er, lstat, cb)
    }
  }
}

Glob.prototype._stat2 = function (f, abs, er, stat, cb) {
  if (er && (er.code === 'ENOENT' || er.code === 'ENOTDIR')) {
    this.statCache[abs] = false
    return cb()
  }

  var needDir = f.slice(-1) === '/'
  this.statCache[abs] = stat

  if (abs.slice(-1) === '/' && stat && !stat.isDirectory())
    return cb(null, false, stat)

  var c = true
  if (stat)
    c = stat.isDirectory() ? 'DIR' : 'FILE'
  this.cache[abs] = this.cache[abs] || c

  if (needDir && c === 'FILE')
    return cb()

  return cb(null, c, stat)
}


/***/ }),

/***/ 9010:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = globSync
globSync.GlobSync = GlobSync

var fs = __nccwpck_require__(7147)
var rp = __nccwpck_require__(6863)
var minimatch = __nccwpck_require__(3973)
var Minimatch = minimatch.Minimatch
var Glob = (__nccwpck_require__(1957).Glob)
var util = __nccwpck_require__(3837)
var path = __nccwpck_require__(1017)
var assert = __nccwpck_require__(9491)
var isAbsolute = __nccwpck_require__(8714)
var common = __nccwpck_require__(7625)
var setopts = common.setopts
var ownProp = common.ownProp
var childrenIgnored = common.childrenIgnored
var isIgnored = common.isIgnored

function globSync (pattern, options) {
  if (typeof options === 'function' || arguments.length === 3)
    throw new TypeError('callback provided to sync glob\n'+
                        'See: https://github.com/isaacs/node-glob/issues/167')

  return new GlobSync(pattern, options).found
}

function GlobSync (pattern, options) {
  if (!pattern)
    throw new Error('must provide pattern')

  if (typeof options === 'function' || arguments.length === 3)
    throw new TypeError('callback provided to sync glob\n'+
                        'See: https://github.com/isaacs/node-glob/issues/167')

  if (!(this instanceof GlobSync))
    return new GlobSync(pattern, options)

  setopts(this, pattern, options)

  if (this.noprocess)
    return this

  var n = this.minimatch.set.length
  this.matches = new Array(n)
  for (var i = 0; i < n; i ++) {
    this._process(this.minimatch.set[i], i, false)
  }
  this._finish()
}

GlobSync.prototype._finish = function () {
  assert(this instanceof GlobSync)
  if (this.realpath) {
    var self = this
    this.matches.forEach(function (matchset, index) {
      var set = self.matches[index] = Object.create(null)
      for (var p in matchset) {
        try {
          p = self._makeAbs(p)
          var real = rp.realpathSync(p, self.realpathCache)
          set[real] = true
        } catch (er) {
          if (er.syscall === 'stat')
            set[self._makeAbs(p)] = true
          else
            throw er
        }
      }
    })
  }
  common.finish(this)
}


GlobSync.prototype._process = function (pattern, index, inGlobStar) {
  assert(this instanceof GlobSync)

  // Get the first [n] parts of pattern that are all strings.
  var n = 0
  while (typeof pattern[n] === 'string') {
    n ++
  }
  // now n is the index of the first one that is *not* a string.

  // See if there's anything else
  var prefix
  switch (n) {
    // if not, then this is rather simple
    case pattern.length:
      this._processSimple(pattern.join('/'), index)
      return

    case 0:
      // pattern *starts* with some non-trivial item.
      // going to readdir(cwd), but not include the prefix in matches.
      prefix = null
      break

    default:
      // pattern has some string bits in the front.
      // whatever it starts with, whether that's 'absolute' like /foo/bar,
      // or 'relative' like '../baz'
      prefix = pattern.slice(0, n).join('/')
      break
  }

  var remain = pattern.slice(n)

  // get the list of entries.
  var read
  if (prefix === null)
    read = '.'
  else if (isAbsolute(prefix) || isAbsolute(pattern.join('/'))) {
    if (!prefix || !isAbsolute(prefix))
      prefix = '/' + prefix
    read = prefix
  } else
    read = prefix

  var abs = this._makeAbs(read)

  //if ignored, skip processing
  if (childrenIgnored(this, read))
    return

  var isGlobStar = remain[0] === minimatch.GLOBSTAR
  if (isGlobStar)
    this._processGlobStar(prefix, read, abs, remain, index, inGlobStar)
  else
    this._processReaddir(prefix, read, abs, remain, index, inGlobStar)
}


GlobSync.prototype._processReaddir = function (prefix, read, abs, remain, index, inGlobStar) {
  var entries = this._readdir(abs, inGlobStar)

  // if the abs isn't a dir, then nothing can match!
  if (!entries)
    return

  // It will only match dot entries if it starts with a dot, or if
  // dot is set.  Stuff like @(.foo|.bar) isn't allowed.
  var pn = remain[0]
  var negate = !!this.minimatch.negate
  var rawGlob = pn._glob
  var dotOk = this.dot || rawGlob.charAt(0) === '.'

  var matchedEntries = []
  for (var i = 0; i < entries.length; i++) {
    var e = entries[i]
    if (e.charAt(0) !== '.' || dotOk) {
      var m
      if (negate && !prefix) {
        m = !e.match(pn)
      } else {
        m = e.match(pn)
      }
      if (m)
        matchedEntries.push(e)
    }
  }

  var len = matchedEntries.length
  // If there are no matched entries, then nothing matches.
  if (len === 0)
    return

  // if this is the last remaining pattern bit, then no need for
  // an additional stat *unless* the user has specified mark or
  // stat explicitly.  We know they exist, since readdir returned
  // them.

  if (remain.length === 1 && !this.mark && !this.stat) {
    if (!this.matches[index])
      this.matches[index] = Object.create(null)

    for (var i = 0; i < len; i ++) {
      var e = matchedEntries[i]
      if (prefix) {
        if (prefix.slice(-1) !== '/')
          e = prefix + '/' + e
        else
          e = prefix + e
      }

      if (e.charAt(0) === '/' && !this.nomount) {
        e = path.join(this.root, e)
      }
      this._emitMatch(index, e)
    }
    // This was the last one, and no stats were needed
    return
  }

  // now test all matched entries as stand-ins for that part
  // of the pattern.
  remain.shift()
  for (var i = 0; i < len; i ++) {
    var e = matchedEntries[i]
    var newPattern
    if (prefix)
      newPattern = [prefix, e]
    else
      newPattern = [e]
    this._process(newPattern.concat(remain), index, inGlobStar)
  }
}


GlobSync.prototype._emitMatch = function (index, e) {
  if (isIgnored(this, e))
    return

  var abs = this._makeAbs(e)

  if (this.mark)
    e = this._mark(e)

  if (this.absolute) {
    e = abs
  }

  if (this.matches[index][e])
    return

  if (this.nodir) {
    var c = this.cache[abs]
    if (c === 'DIR' || Array.isArray(c))
      return
  }

  this.matches[index][e] = true

  if (this.stat)
    this._stat(e)
}


GlobSync.prototype._readdirInGlobStar = function (abs) {
  // follow all symlinked directories forever
  // just proceed as if this is a non-globstar situation
  if (this.follow)
    return this._readdir(abs, false)

  var entries
  var lstat
  var stat
  try {
    lstat = fs.lstatSync(abs)
  } catch (er) {
    if (er.code === 'ENOENT') {
      // lstat failed, doesn't exist
      return null
    }
  }

  var isSym = lstat && lstat.isSymbolicLink()
  this.symlinks[abs] = isSym

  // If it's not a symlink or a dir, then it's definitely a regular file.
  // don't bother doing a readdir in that case.
  if (!isSym && lstat && !lstat.isDirectory())
    this.cache[abs] = 'FILE'
  else
    entries = this._readdir(abs, false)

  return entries
}

GlobSync.prototype._readdir = function (abs, inGlobStar) {
  var entries

  if (inGlobStar && !ownProp(this.symlinks, abs))
    return this._readdirInGlobStar(abs)

  if (ownProp(this.cache, abs)) {
    var c = this.cache[abs]
    if (!c || c === 'FILE')
      return null

    if (Array.isArray(c))
      return c
  }

  try {
    return this._readdirEntries(abs, fs.readdirSync(abs))
  } catch (er) {
    this._readdirError(abs, er)
    return null
  }
}

GlobSync.prototype._readdirEntries = function (abs, entries) {
  // if we haven't asked to stat everything, then just
  // assume that everything in there exists, so we can avoid
  // having to stat it a second time.
  if (!this.mark && !this.stat) {
    for (var i = 0; i < entries.length; i ++) {
      var e = entries[i]
      if (abs === '/')
        e = abs + e
      else
        e = abs + '/' + e
      this.cache[e] = true
    }
  }

  this.cache[abs] = entries

  // mark and cache dir-ness
  return entries
}

GlobSync.prototype._readdirError = function (f, er) {
  // handle errors, and cache the information
  switch (er.code) {
    case 'ENOTSUP': // https://github.com/isaacs/node-glob/issues/205
    case 'ENOTDIR': // totally normal. means it *does* exist.
      var abs = this._makeAbs(f)
      this.cache[abs] = 'FILE'
      if (abs === this.cwdAbs) {
        var error = new Error(er.code + ' invalid cwd ' + this.cwd)
        error.path = this.cwd
        error.code = er.code
        throw error
      }
      break

    case 'ENOENT': // not terribly unusual
    case 'ELOOP':
    case 'ENAMETOOLONG':
    case 'UNKNOWN':
      this.cache[this._makeAbs(f)] = false
      break

    default: // some unusual error.  Treat as failure.
      this.cache[this._makeAbs(f)] = false
      if (this.strict)
        throw er
      if (!this.silent)
        console.error('glob error', er)
      break
  }
}

GlobSync.prototype._processGlobStar = function (prefix, read, abs, remain, index, inGlobStar) {

  var entries = this._readdir(abs, inGlobStar)

  // no entries means not a dir, so it can never have matches
  // foo.txt/** doesn't match foo.txt
  if (!entries)
    return

  // test without the globstar, and with every child both below
  // and replacing the globstar.
  var remainWithoutGlobStar = remain.slice(1)
  var gspref = prefix ? [ prefix ] : []
  var noGlobStar = gspref.concat(remainWithoutGlobStar)

  // the noGlobStar pattern exits the inGlobStar state
  this._process(noGlobStar, index, false)

  var len = entries.length
  var isSym = this.symlinks[abs]

  // If it's a symlink, and we're in a globstar, then stop
  if (isSym && inGlobStar)
    return

  for (var i = 0; i < len; i++) {
    var e = entries[i]
    if (e.charAt(0) === '.' && !this.dot)
      continue

    // these two cases enter the inGlobStar state
    var instead = gspref.concat(entries[i], remainWithoutGlobStar)
    this._process(instead, index, true)

    var below = gspref.concat(entries[i], remain)
    this._process(below, index, true)
  }
}

GlobSync.prototype._processSimple = function (prefix, index) {
  // XXX review this.  Shouldn't it be doing the mounting etc
  // before doing stat?  kinda weird?
  var exists = this._stat(prefix)

  if (!this.matches[index])
    this.matches[index] = Object.create(null)

  // If it doesn't exist, then just mark the lack of results
  if (!exists)
    return

  if (prefix && isAbsolute(prefix) && !this.nomount) {
    var trail = /[\/\\]$/.test(prefix)
    if (prefix.charAt(0) === '/') {
      prefix = path.join(this.root, prefix)
    } else {
      prefix = path.resolve(this.root, prefix)
      if (trail)
        prefix += '/'
    }
  }

  if (process.platform === 'win32')
    prefix = prefix.replace(/\\/g, '/')

  // Mark this as a match
  this._emitMatch(index, prefix)
}

// Returns either 'DIR', 'FILE', or false
GlobSync.prototype._stat = function (f) {
  var abs = this._makeAbs(f)
  var needDir = f.slice(-1) === '/'

  if (f.length > this.maxLength)
    return false

  if (!this.stat && ownProp(this.cache, abs)) {
    var c = this.cache[abs]

    if (Array.isArray(c))
      c = 'DIR'

    // It exists, but maybe not how we need it
    if (!needDir || c === 'DIR')
      return c

    if (needDir && c === 'FILE')
      return false

    // otherwise we have to stat, because maybe c=true
    // if we know it exists, but not what it is.
  }

  var exists
  var stat = this.statCache[abs]
  if (!stat) {
    var lstat
    try {
      lstat = fs.lstatSync(abs)
    } catch (er) {
      if (er && (er.code === 'ENOENT' || er.code === 'ENOTDIR')) {
        this.statCache[abs] = false
        return false
      }
    }

    if (lstat && lstat.isSymbolicLink()) {
      try {
        stat = fs.statSync(abs)
      } catch (er) {
        stat = lstat
      }
    } else {
      stat = lstat
    }
  }

  this.statCache[abs] = stat

  var c = true
  if (stat)
    c = stat.isDirectory() ? 'DIR' : 'FILE'

  this.cache[abs] = this.cache[abs] || c

  if (needDir && c === 'FILE')
    return false

  return c
}

GlobSync.prototype._mark = function (p) {
  return common.mark(this, p)
}

GlobSync.prototype._makeAbs = function (f) {
  return common.makeAbs(this, f)
}


/***/ }),

/***/ 8213:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
Object.defineProperty(exports, "__esModule", ({value:true}));exports.SIGNALS=void 0;

const SIGNALS=[
{
name:"SIGHUP",
number:1,
action:"terminate",
description:"Terminal closed",
standard:"posix"},

{
name:"SIGINT",
number:2,
action:"terminate",
description:"User interruption with CTRL-C",
standard:"ansi"},

{
name:"SIGQUIT",
number:3,
action:"core",
description:"User interruption with CTRL-\\",
standard:"posix"},

{
name:"SIGILL",
number:4,
action:"core",
description:"Invalid machine instruction",
standard:"ansi"},

{
name:"SIGTRAP",
number:5,
action:"core",
description:"Debugger breakpoint",
standard:"posix"},

{
name:"SIGABRT",
number:6,
action:"core",
description:"Aborted",
standard:"ansi"},

{
name:"SIGIOT",
number:6,
action:"core",
description:"Aborted",
standard:"bsd"},

{
name:"SIGBUS",
number:7,
action:"core",
description:
"Bus error due to misaligned, non-existing address or paging error",
standard:"bsd"},

{
name:"SIGEMT",
number:7,
action:"terminate",
description:"Command should be emulated but is not implemented",
standard:"other"},

{
name:"SIGFPE",
number:8,
action:"core",
description:"Floating point arithmetic error",
standard:"ansi"},

{
name:"SIGKILL",
number:9,
action:"terminate",
description:"Forced termination",
standard:"posix",
forced:true},

{
name:"SIGUSR1",
number:10,
action:"terminate",
description:"Application-specific signal",
standard:"posix"},

{
name:"SIGSEGV",
number:11,
action:"core",
description:"Segmentation fault",
standard:"ansi"},

{
name:"SIGUSR2",
number:12,
action:"terminate",
description:"Application-specific signal",
standard:"posix"},

{
name:"SIGPIPE",
number:13,
action:"terminate",
description:"Broken pipe or socket",
standard:"posix"},

{
name:"SIGALRM",
number:14,
action:"terminate",
description:"Timeout or timer",
standard:"posix"},

{
name:"SIGTERM",
number:15,
action:"terminate",
description:"Termination",
standard:"ansi"},

{
name:"SIGSTKFLT",
number:16,
action:"terminate",
description:"Stack is empty or overflowed",
standard:"other"},

{
name:"SIGCHLD",
number:17,
action:"ignore",
description:"Child process terminated, paused or unpaused",
standard:"posix"},

{
name:"SIGCLD",
number:17,
action:"ignore",
description:"Child process terminated, paused or unpaused",
standard:"other"},

{
name:"SIGCONT",
number:18,
action:"unpause",
description:"Unpaused",
standard:"posix",
forced:true},

{
name:"SIGSTOP",
number:19,
action:"pause",
description:"Paused",
standard:"posix",
forced:true},

{
name:"SIGTSTP",
number:20,
action:"pause",
description:"Paused using CTRL-Z or \"suspend\"",
standard:"posix"},

{
name:"SIGTTIN",
number:21,
action:"pause",
description:"Background process cannot read terminal input",
standard:"posix"},

{
name:"SIGBREAK",
number:21,
action:"terminate",
description:"User interruption with CTRL-BREAK",
standard:"other"},

{
name:"SIGTTOU",
number:22,
action:"pause",
description:"Background process cannot write to terminal output",
standard:"posix"},

{
name:"SIGURG",
number:23,
action:"ignore",
description:"Socket received out-of-band data",
standard:"bsd"},

{
name:"SIGXCPU",
number:24,
action:"core",
description:"Process timed out",
standard:"bsd"},

{
name:"SIGXFSZ",
number:25,
action:"core",
description:"File too big",
standard:"bsd"},

{
name:"SIGVTALRM",
number:26,
action:"terminate",
description:"Timeout or timer",
standard:"bsd"},

{
name:"SIGPROF",
number:27,
action:"terminate",
description:"Timeout or timer",
standard:"bsd"},

{
name:"SIGWINCH",
number:28,
action:"ignore",
description:"Terminal window size changed",
standard:"bsd"},

{
name:"SIGIO",
number:29,
action:"terminate",
description:"I/O is available",
standard:"other"},

{
name:"SIGPOLL",
number:29,
action:"terminate",
description:"Watched event",
standard:"other"},

{
name:"SIGINFO",
number:29,
action:"ignore",
description:"Request for process information",
standard:"other"},

{
name:"SIGPWR",
number:30,
action:"terminate",
description:"Device running out of power",
standard:"systemv"},

{
name:"SIGSYS",
number:31,
action:"core",
description:"Invalid system call",
standard:"other"},

{
name:"SIGUNUSED",
number:31,
action:"terminate",
description:"Invalid system call",
standard:"other"}];exports.SIGNALS=SIGNALS;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 2779:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";
Object.defineProperty(exports, "__esModule", ({value:true}));exports.signalsByNumber=exports.signalsByName=void 0;var _os=__nccwpck_require__(2037);

var _signals=__nccwpck_require__(6435);
var _realtime=__nccwpck_require__(5295);



const getSignalsByName=function(){
const signals=(0,_signals.getSignals)();
return signals.reduce(getSignalByName,{});
};

const getSignalByName=function(
signalByNameMemo,
{name,number,description,supported,action,forced,standard})
{
return{
...signalByNameMemo,
[name]:{name,number,description,supported,action,forced,standard}};

};

const signalsByName=getSignalsByName();exports.signalsByName=signalsByName;




const getSignalsByNumber=function(){
const signals=(0,_signals.getSignals)();
const length=_realtime.SIGRTMAX+1;
const signalsA=Array.from({length},(value,number)=>
getSignalByNumber(number,signals));

return Object.assign({},...signalsA);
};

const getSignalByNumber=function(number,signals){
const signal=findSignalByNumber(number,signals);

if(signal===undefined){
return{};
}

const{name,description,supported,action,forced,standard}=signal;
return{
[number]:{
name,
number,
description,
supported,
action,
forced,
standard}};


};



const findSignalByNumber=function(number,signals){
const signal=signals.find(({name})=>_os.constants.signals[name]===number);

if(signal!==undefined){
return signal;
}

return signals.find(signalA=>signalA.number===number);
};

const signalsByNumber=getSignalsByNumber();exports.signalsByNumber=signalsByNumber;
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 5295:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
Object.defineProperty(exports, "__esModule", ({value:true}));exports.SIGRTMAX=exports.getRealtimeSignals=void 0;
const getRealtimeSignals=function(){
const length=SIGRTMAX-SIGRTMIN+1;
return Array.from({length},getRealtimeSignal);
};exports.getRealtimeSignals=getRealtimeSignals;

const getRealtimeSignal=function(value,index){
return{
name:`SIGRT${index+1}`,
number:SIGRTMIN+index,
action:"terminate",
description:"Application-specific signal (realtime)",
standard:"posix"};

};

const SIGRTMIN=34;
const SIGRTMAX=64;exports.SIGRTMAX=SIGRTMAX;
//# sourceMappingURL=realtime.js.map

/***/ }),

/***/ 6435:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";
Object.defineProperty(exports, "__esModule", ({value:true}));exports.getSignals=void 0;var _os=__nccwpck_require__(2037);

var _core=__nccwpck_require__(8213);
var _realtime=__nccwpck_require__(5295);



const getSignals=function(){
const realtimeSignals=(0,_realtime.getRealtimeSignals)();
const signals=[..._core.SIGNALS,...realtimeSignals].map(normalizeSignal);
return signals;
};exports.getSignals=getSignals;







const normalizeSignal=function({
name,
number:defaultNumber,
description,
action,
forced=false,
standard})
{
const{
signals:{[name]:constantSignal}}=
_os.constants;
const supported=constantSignal!==undefined;
const number=supported?constantSignal:defaultNumber;
return{name,number,description,supported,action,forced,standard};
};
//# sourceMappingURL=signals.js.map

/***/ }),

/***/ 2492:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var wrappy = __nccwpck_require__(2940)
var reqs = Object.create(null)
var once = __nccwpck_require__(1223)

module.exports = wrappy(inflight)

function inflight (key, cb) {
  if (reqs[key]) {
    reqs[key].push(cb)
    return null
  } else {
    reqs[key] = [cb]
    return makeres(key)
  }
}

function makeres (key) {
  return once(function RES () {
    var cbs = reqs[key]
    var len = cbs.length
    var args = slice(arguments)

    // XXX It's somewhat ambiguous whether a new callback added in this
    // pass should be queued for later execution if something in the
    // list of callbacks throws, or if it should just be discarded.
    // However, it's such an edge case that it hardly matters, and either
    // choice is likely as surprising as the other.
    // As it happens, we do go ahead and schedule it for later execution.
    try {
      for (var i = 0; i < len; i++) {
        cbs[i].apply(null, args)
      }
    } finally {
      if (cbs.length > len) {
        // added more in the interim.
        // de-zalgo, just in case, but don't call again.
        cbs.splice(0, len)
        process.nextTick(function () {
          RES.apply(null, args)
        })
      } else {
        delete reqs[key]
      }
    }
  })
}

function slice (args) {
  var length = args.length
  var array = []

  for (var i = 0; i < length; i++) array[i] = args[i]
  return array
}


/***/ }),

/***/ 4124:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

try {
  var util = __nccwpck_require__(3837);
  /* istanbul ignore next */
  if (typeof util.inherits !== 'function') throw '';
  module.exports = util.inherits;
} catch (e) {
  /* istanbul ignore next */
  module.exports = __nccwpck_require__(8544);
}


/***/ }),

/***/ 8544:
/***/ ((module) => {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
}


/***/ }),

/***/ 1554:
/***/ ((module) => {

"use strict";


const isStream = stream =>
	stream !== null &&
	typeof stream === 'object' &&
	typeof stream.pipe === 'function';

isStream.writable = stream =>
	isStream(stream) &&
	stream.writable !== false &&
	typeof stream._write === 'function' &&
	typeof stream._writableState === 'object';

isStream.readable = stream =>
	isStream(stream) &&
	stream.readable !== false &&
	typeof stream._read === 'function' &&
	typeof stream._readableState === 'object';

isStream.duplex = stream =>
	isStream.writable(stream) &&
	isStream.readable(stream);

isStream.transform = stream =>
	isStream.duplex(stream) &&
	typeof stream._transform === 'function' &&
	typeof stream._transformState === 'object';

module.exports = isStream;


/***/ }),

/***/ 7126:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var fs = __nccwpck_require__(7147)
var core
if (process.platform === 'win32' || global.TESTING_WINDOWS) {
  core = __nccwpck_require__(2001)
} else {
  core = __nccwpck_require__(9728)
}

module.exports = isexe
isexe.sync = sync

function isexe (path, options, cb) {
  if (typeof options === 'function') {
    cb = options
    options = {}
  }

  if (!cb) {
    if (typeof Promise !== 'function') {
      throw new TypeError('callback not provided')
    }

    return new Promise(function (resolve, reject) {
      isexe(path, options || {}, function (er, is) {
        if (er) {
          reject(er)
        } else {
          resolve(is)
        }
      })
    })
  }

  core(path, options || {}, function (er, is) {
    // ignore EACCES because that just means we aren't allowed to run it
    if (er) {
      if (er.code === 'EACCES' || options && options.ignoreErrors) {
        er = null
        is = false
      }
    }
    cb(er, is)
  })
}

function sync (path, options) {
  // my kingdom for a filtered catch
  try {
    return core.sync(path, options || {})
  } catch (er) {
    if (options && options.ignoreErrors || er.code === 'EACCES') {
      return false
    } else {
      throw er
    }
  }
}


/***/ }),

/***/ 9728:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = isexe
isexe.sync = sync

var fs = __nccwpck_require__(7147)

function isexe (path, options, cb) {
  fs.stat(path, function (er, stat) {
    cb(er, er ? false : checkStat(stat, options))
  })
}

function sync (path, options) {
  return checkStat(fs.statSync(path), options)
}

function checkStat (stat, options) {
  return stat.isFile() && checkMode(stat, options)
}

function checkMode (stat, options) {
  var mod = stat.mode
  var uid = stat.uid
  var gid = stat.gid

  var myUid = options.uid !== undefined ?
    options.uid : process.getuid && process.getuid()
  var myGid = options.gid !== undefined ?
    options.gid : process.getgid && process.getgid()

  var u = parseInt('100', 8)
  var g = parseInt('010', 8)
  var o = parseInt('001', 8)
  var ug = u | g

  var ret = (mod & o) ||
    (mod & g) && gid === myGid ||
    (mod & u) && uid === myUid ||
    (mod & ug) && myUid === 0

  return ret
}


/***/ }),

/***/ 2001:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = isexe
isexe.sync = sync

var fs = __nccwpck_require__(7147)

function checkPathExt (path, options) {
  var pathext = options.pathExt !== undefined ?
    options.pathExt : process.env.PATHEXT

  if (!pathext) {
    return true
  }

  pathext = pathext.split(';')
  if (pathext.indexOf('') !== -1) {
    return true
  }
  for (var i = 0; i < pathext.length; i++) {
    var p = pathext[i].toLowerCase()
    if (p && path.substr(-p.length).toLowerCase() === p) {
      return true
    }
  }
  return false
}

function checkStat (stat, path, options) {
  if (!stat.isSymbolicLink() && !stat.isFile()) {
    return false
  }
  return checkPathExt(path, options)
}

function isexe (path, options, cb) {
  fs.stat(path, function (er, stat) {
    cb(er, er ? false : checkStat(stat, path, options))
  })
}

function sync (path, options) {
  return checkStat(fs.statSync(path), path, options)
}


/***/ }),

/***/ 2621:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const { PassThrough } = __nccwpck_require__(2781);

module.exports = function (/*streams...*/) {
  var sources = []
  var output  = new PassThrough({objectMode: true})

  output.setMaxListeners(0)

  output.add = add
  output.isEmpty = isEmpty

  output.on('unpipe', remove)

  Array.prototype.slice.call(arguments).forEach(add)

  return output

  function add (source) {
    if (Array.isArray(source)) {
      source.forEach(add)
      return this
    }

    sources.push(source);
    source.once('end', remove.bind(null, source))
    source.once('error', output.emit.bind(output, 'error'))
    source.pipe(output, {end: false})
    return this
  }

  function isEmpty () {
    return sources.length == 0;
  }

  function remove (source) {
    sources = sources.filter(function (it) { return it !== source })
    if (!sources.length && output.readable) { output.end() }
  }
}


/***/ }),

/***/ 6047:
/***/ ((module) => {

"use strict";


const mimicFn = (to, from) => {
	for (const prop of Reflect.ownKeys(from)) {
		Object.defineProperty(to, prop, Object.getOwnPropertyDescriptor(from, prop));
	}

	return to;
};

module.exports = mimicFn;
// TODO: Remove this for the next major release
module.exports["default"] = mimicFn;


/***/ }),

/***/ 3973:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = minimatch
minimatch.Minimatch = Minimatch

var path = (function () { try { return __nccwpck_require__(1017) } catch (e) {}}()) || {
  sep: '/'
}
minimatch.sep = path.sep

var GLOBSTAR = minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {}
var expand = __nccwpck_require__(3717)

var plTypes = {
  '!': { open: '(?:(?!(?:', close: '))[^/]*?)'},
  '?': { open: '(?:', close: ')?' },
  '+': { open: '(?:', close: ')+' },
  '*': { open: '(?:', close: ')*' },
  '@': { open: '(?:', close: ')' }
}

// any single thing other than /
// don't need to escape / when using new RegExp()
var qmark = '[^/]'

// * => any number of characters
var star = qmark + '*?'

// ** when dots are allowed.  Anything goes, except .. and .
// not (^ or / followed by one or two dots followed by $ or /),
// followed by anything, any number of times.
var twoStarDot = '(?:(?!(?:\\\/|^)(?:\\.{1,2})($|\\\/)).)*?'

// not a ^ or / followed by a dot,
// followed by anything, any number of times.
var twoStarNoDot = '(?:(?!(?:\\\/|^)\\.).)*?'

// characters that need to be escaped in RegExp.
var reSpecials = charSet('().*{}+?[]^$\\!')

// "abc" -> { a:true, b:true, c:true }
function charSet (s) {
  return s.split('').reduce(function (set, c) {
    set[c] = true
    return set
  }, {})
}

// normalizes slashes.
var slashSplit = /\/+/

minimatch.filter = filter
function filter (pattern, options) {
  options = options || {}
  return function (p, i, list) {
    return minimatch(p, pattern, options)
  }
}

function ext (a, b) {
  b = b || {}
  var t = {}
  Object.keys(a).forEach(function (k) {
    t[k] = a[k]
  })
  Object.keys(b).forEach(function (k) {
    t[k] = b[k]
  })
  return t
}

minimatch.defaults = function (def) {
  if (!def || typeof def !== 'object' || !Object.keys(def).length) {
    return minimatch
  }

  var orig = minimatch

  var m = function minimatch (p, pattern, options) {
    return orig(p, pattern, ext(def, options))
  }

  m.Minimatch = function Minimatch (pattern, options) {
    return new orig.Minimatch(pattern, ext(def, options))
  }
  m.Minimatch.defaults = function defaults (options) {
    return orig.defaults(ext(def, options)).Minimatch
  }

  m.filter = function filter (pattern, options) {
    return orig.filter(pattern, ext(def, options))
  }

  m.defaults = function defaults (options) {
    return orig.defaults(ext(def, options))
  }

  m.makeRe = function makeRe (pattern, options) {
    return orig.makeRe(pattern, ext(def, options))
  }

  m.braceExpand = function braceExpand (pattern, options) {
    return orig.braceExpand(pattern, ext(def, options))
  }

  m.match = function (list, pattern, options) {
    return orig.match(list, pattern, ext(def, options))
  }

  return m
}

Minimatch.defaults = function (def) {
  return minimatch.defaults(def).Minimatch
}

function minimatch (p, pattern, options) {
  assertValidPattern(pattern)

  if (!options) options = {}

  // shortcut: comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === '#') {
    return false
  }

  return new Minimatch(pattern, options).match(p)
}

function Minimatch (pattern, options) {
  if (!(this instanceof Minimatch)) {
    return new Minimatch(pattern, options)
  }

  assertValidPattern(pattern)

  if (!options) options = {}

  pattern = pattern.trim()

  // windows support: need to use /, not \
  if (!options.allowWindowsEscape && path.sep !== '/') {
    pattern = pattern.split(path.sep).join('/')
  }

  this.options = options
  this.set = []
  this.pattern = pattern
  this.regexp = null
  this.negate = false
  this.comment = false
  this.empty = false
  this.partial = !!options.partial

  // make the set of regexps etc.
  this.make()
}

Minimatch.prototype.debug = function () {}

Minimatch.prototype.make = make
function make () {
  var pattern = this.pattern
  var options = this.options

  // empty patterns and comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === '#') {
    this.comment = true
    return
  }
  if (!pattern) {
    this.empty = true
    return
  }

  // step 1: figure out negation, etc.
  this.parseNegate()

  // step 2: expand braces
  var set = this.globSet = this.braceExpand()

  if (options.debug) this.debug = function debug() { console.error.apply(console, arguments) }

  this.debug(this.pattern, set)

  // step 3: now we have a set, so turn each one into a series of path-portion
  // matching patterns.
  // These will be regexps, except in the case of "**", which is
  // set to the GLOBSTAR object for globstar behavior,
  // and will not contain any / characters
  set = this.globParts = set.map(function (s) {
    return s.split(slashSplit)
  })

  this.debug(this.pattern, set)

  // glob --> regexps
  set = set.map(function (s, si, set) {
    return s.map(this.parse, this)
  }, this)

  this.debug(this.pattern, set)

  // filter out everything that didn't compile properly.
  set = set.filter(function (s) {
    return s.indexOf(false) === -1
  })

  this.debug(this.pattern, set)

  this.set = set
}

Minimatch.prototype.parseNegate = parseNegate
function parseNegate () {
  var pattern = this.pattern
  var negate = false
  var options = this.options
  var negateOffset = 0

  if (options.nonegate) return

  for (var i = 0, l = pattern.length
    ; i < l && pattern.charAt(i) === '!'
    ; i++) {
    negate = !negate
    negateOffset++
  }

  if (negateOffset) this.pattern = pattern.substr(negateOffset)
  this.negate = negate
}

// Brace expansion:
// a{b,c}d -> abd acd
// a{b,}c -> abc ac
// a{0..3}d -> a0d a1d a2d a3d
// a{b,c{d,e}f}g -> abg acdfg acefg
// a{b,c}d{e,f}g -> abdeg acdeg abdeg abdfg
//
// Invalid sets are not expanded.
// a{2..}b -> a{2..}b
// a{b}c -> a{b}c
minimatch.braceExpand = function (pattern, options) {
  return braceExpand(pattern, options)
}

Minimatch.prototype.braceExpand = braceExpand

function braceExpand (pattern, options) {
  if (!options) {
    if (this instanceof Minimatch) {
      options = this.options
    } else {
      options = {}
    }
  }

  pattern = typeof pattern === 'undefined'
    ? this.pattern : pattern

  assertValidPattern(pattern)

  // Thanks to Yeting Li <https://github.com/yetingli> for
  // improving this regexp to avoid a ReDOS vulnerability.
  if (options.nobrace || !/\{(?:(?!\{).)*\}/.test(pattern)) {
    // shortcut. no need to expand.
    return [pattern]
  }

  return expand(pattern)
}

var MAX_PATTERN_LENGTH = 1024 * 64
var assertValidPattern = function (pattern) {
  if (typeof pattern !== 'string') {
    throw new TypeError('invalid pattern')
  }

  if (pattern.length > MAX_PATTERN_LENGTH) {
    throw new TypeError('pattern is too long')
  }
}

// parse a component of the expanded set.
// At this point, no pattern may contain "/" in it
// so we're going to return a 2d array, where each entry is the full
// pattern, split on '/', and then turned into a regular expression.
// A regexp is made at the end which joins each array with an
// escaped /, and another full one which joins each regexp with |.
//
// Following the lead of Bash 4.1, note that "**" only has special meaning
// when it is the *only* thing in a path portion.  Otherwise, any series
// of * is equivalent to a single *.  Globstar behavior is enabled by
// default, and can be disabled by setting options.noglobstar.
Minimatch.prototype.parse = parse
var SUBPARSE = {}
function parse (pattern, isSub) {
  assertValidPattern(pattern)

  var options = this.options

  // shortcuts
  if (pattern === '**') {
    if (!options.noglobstar)
      return GLOBSTAR
    else
      pattern = '*'
  }
  if (pattern === '') return ''

  var re = ''
  var hasMagic = !!options.nocase
  var escaping = false
  // ? => one single character
  var patternListStack = []
  var negativeLists = []
  var stateChar
  var inClass = false
  var reClassStart = -1
  var classStart = -1
  // . and .. never match anything that doesn't start with .,
  // even when options.dot is set.
  var patternStart = pattern.charAt(0) === '.' ? '' // anything
  // not (start or / followed by . or .. followed by / or end)
  : options.dot ? '(?!(?:^|\\\/)\\.{1,2}(?:$|\\\/))'
  : '(?!\\.)'
  var self = this

  function clearStateChar () {
    if (stateChar) {
      // we had some state-tracking character
      // that wasn't consumed by this pass.
      switch (stateChar) {
        case '*':
          re += star
          hasMagic = true
        break
        case '?':
          re += qmark
          hasMagic = true
        break
        default:
          re += '\\' + stateChar
        break
      }
      self.debug('clearStateChar %j %j', stateChar, re)
      stateChar = false
    }
  }

  for (var i = 0, len = pattern.length, c
    ; (i < len) && (c = pattern.charAt(i))
    ; i++) {
    this.debug('%s\t%s %s %j', pattern, i, re, c)

    // skip over any that are escaped.
    if (escaping && reSpecials[c]) {
      re += '\\' + c
      escaping = false
      continue
    }

    switch (c) {
      /* istanbul ignore next */
      case '/': {
        // completely not allowed, even escaped.
        // Should already be path-split by now.
        return false
      }

      case '\\':
        clearStateChar()
        escaping = true
      continue

      // the various stateChar values
      // for the "extglob" stuff.
      case '?':
      case '*':
      case '+':
      case '@':
      case '!':
        this.debug('%s\t%s %s %j <-- stateChar', pattern, i, re, c)

        // all of those are literals inside a class, except that
        // the glob [!a] means [^a] in regexp
        if (inClass) {
          this.debug('  in class')
          if (c === '!' && i === classStart + 1) c = '^'
          re += c
          continue
        }

        // if we already have a stateChar, then it means
        // that there was something like ** or +? in there.
        // Handle the stateChar, then proceed with this one.
        self.debug('call clearStateChar %j', stateChar)
        clearStateChar()
        stateChar = c
        // if extglob is disabled, then +(asdf|foo) isn't a thing.
        // just clear the statechar *now*, rather than even diving into
        // the patternList stuff.
        if (options.noext) clearStateChar()
      continue

      case '(':
        if (inClass) {
          re += '('
          continue
        }

        if (!stateChar) {
          re += '\\('
          continue
        }

        patternListStack.push({
          type: stateChar,
          start: i - 1,
          reStart: re.length,
          open: plTypes[stateChar].open,
          close: plTypes[stateChar].close
        })
        // negation is (?:(?!js)[^/]*)
        re += stateChar === '!' ? '(?:(?!(?:' : '(?:'
        this.debug('plType %j %j', stateChar, re)
        stateChar = false
      continue

      case ')':
        if (inClass || !patternListStack.length) {
          re += '\\)'
          continue
        }

        clearStateChar()
        hasMagic = true
        var pl = patternListStack.pop()
        // negation is (?:(?!js)[^/]*)
        // The others are (?:<pattern>)<type>
        re += pl.close
        if (pl.type === '!') {
          negativeLists.push(pl)
        }
        pl.reEnd = re.length
      continue

      case '|':
        if (inClass || !patternListStack.length || escaping) {
          re += '\\|'
          escaping = false
          continue
        }

        clearStateChar()
        re += '|'
      continue

      // these are mostly the same in regexp and glob
      case '[':
        // swallow any state-tracking char before the [
        clearStateChar()

        if (inClass) {
          re += '\\' + c
          continue
        }

        inClass = true
        classStart = i
        reClassStart = re.length
        re += c
      continue

      case ']':
        //  a right bracket shall lose its special
        //  meaning and represent itself in
        //  a bracket expression if it occurs
        //  first in the list.  -- POSIX.2 2.8.3.2
        if (i === classStart + 1 || !inClass) {
          re += '\\' + c
          escaping = false
          continue
        }

        // handle the case where we left a class open.
        // "[z-a]" is valid, equivalent to "\[z-a\]"
        // split where the last [ was, make sure we don't have
        // an invalid re. if so, re-walk the contents of the
        // would-be class to re-translate any characters that
        // were passed through as-is
        // TODO: It would probably be faster to determine this
        // without a try/catch and a new RegExp, but it's tricky
        // to do safely.  For now, this is safe and works.
        var cs = pattern.substring(classStart + 1, i)
        try {
          RegExp('[' + cs + ']')
        } catch (er) {
          // not a valid class!
          var sp = this.parse(cs, SUBPARSE)
          re = re.substr(0, reClassStart) + '\\[' + sp[0] + '\\]'
          hasMagic = hasMagic || sp[1]
          inClass = false
          continue
        }

        // finish up the class.
        hasMagic = true
        inClass = false
        re += c
      continue

      default:
        // swallow any state char that wasn't consumed
        clearStateChar()

        if (escaping) {
          // no need
          escaping = false
        } else if (reSpecials[c]
          && !(c === '^' && inClass)) {
          re += '\\'
        }

        re += c

    } // switch
  } // for

  // handle the case where we left a class open.
  // "[abc" is valid, equivalent to "\[abc"
  if (inClass) {
    // split where the last [ was, and escape it
    // this is a huge pita.  We now have to re-walk
    // the contents of the would-be class to re-translate
    // any characters that were passed through as-is
    cs = pattern.substr(classStart + 1)
    sp = this.parse(cs, SUBPARSE)
    re = re.substr(0, reClassStart) + '\\[' + sp[0]
    hasMagic = hasMagic || sp[1]
  }

  // handle the case where we had a +( thing at the *end*
  // of the pattern.
  // each pattern list stack adds 3 chars, and we need to go through
  // and escape any | chars that were passed through as-is for the regexp.
  // Go through and escape them, taking care not to double-escape any
  // | chars that were already escaped.
  for (pl = patternListStack.pop(); pl; pl = patternListStack.pop()) {
    var tail = re.slice(pl.reStart + pl.open.length)
    this.debug('setting tail', re, pl)
    // maybe some even number of \, then maybe 1 \, followed by a |
    tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, function (_, $1, $2) {
      if (!$2) {
        // the | isn't already escaped, so escape it.
        $2 = '\\'
      }

      // need to escape all those slashes *again*, without escaping the
      // one that we need for escaping the | character.  As it works out,
      // escaping an even number of slashes can be done by simply repeating
      // it exactly after itself.  That's why this trick works.
      //
      // I am sorry that you have to see this.
      return $1 + $1 + $2 + '|'
    })

    this.debug('tail=%j\n   %s', tail, tail, pl, re)
    var t = pl.type === '*' ? star
      : pl.type === '?' ? qmark
      : '\\' + pl.type

    hasMagic = true
    re = re.slice(0, pl.reStart) + t + '\\(' + tail
  }

  // handle trailing things that only matter at the very end.
  clearStateChar()
  if (escaping) {
    // trailing \\
    re += '\\\\'
  }

  // only need to apply the nodot start if the re starts with
  // something that could conceivably capture a dot
  var addPatternStart = false
  switch (re.charAt(0)) {
    case '[': case '.': case '(': addPatternStart = true
  }

  // Hack to work around lack of negative lookbehind in JS
  // A pattern like: *.!(x).!(y|z) needs to ensure that a name
  // like 'a.xyz.yz' doesn't match.  So, the first negative
  // lookahead, has to look ALL the way ahead, to the end of
  // the pattern.
  for (var n = negativeLists.length - 1; n > -1; n--) {
    var nl = negativeLists[n]

    var nlBefore = re.slice(0, nl.reStart)
    var nlFirst = re.slice(nl.reStart, nl.reEnd - 8)
    var nlLast = re.slice(nl.reEnd - 8, nl.reEnd)
    var nlAfter = re.slice(nl.reEnd)

    nlLast += nlAfter

    // Handle nested stuff like *(*.js|!(*.json)), where open parens
    // mean that we should *not* include the ) in the bit that is considered
    // "after" the negated section.
    var openParensBefore = nlBefore.split('(').length - 1
    var cleanAfter = nlAfter
    for (i = 0; i < openParensBefore; i++) {
      cleanAfter = cleanAfter.replace(/\)[+*?]?/, '')
    }
    nlAfter = cleanAfter

    var dollar = ''
    if (nlAfter === '' && isSub !== SUBPARSE) {
      dollar = '$'
    }
    var newRe = nlBefore + nlFirst + nlAfter + dollar + nlLast
    re = newRe
  }

  // if the re is not "" at this point, then we need to make sure
  // it doesn't match against an empty path part.
  // Otherwise a/* will match a/, which it should not.
  if (re !== '' && hasMagic) {
    re = '(?=.)' + re
  }

  if (addPatternStart) {
    re = patternStart + re
  }

  // parsing just a piece of a larger pattern.
  if (isSub === SUBPARSE) {
    return [re, hasMagic]
  }

  // skip the regexp for non-magical patterns
  // unescape anything in it, though, so that it'll be
  // an exact match against a file etc.
  if (!hasMagic) {
    return globUnescape(pattern)
  }

  var flags = options.nocase ? 'i' : ''
  try {
    var regExp = new RegExp('^' + re + '$', flags)
  } catch (er) /* istanbul ignore next - should be impossible */ {
    // If it was an invalid regular expression, then it can't match
    // anything.  This trick looks for a character after the end of
    // the string, which is of course impossible, except in multi-line
    // mode, but it's not a /m regex.
    return new RegExp('$.')
  }

  regExp._glob = pattern
  regExp._src = re

  return regExp
}

minimatch.makeRe = function (pattern, options) {
  return new Minimatch(pattern, options || {}).makeRe()
}

Minimatch.prototype.makeRe = makeRe
function makeRe () {
  if (this.regexp || this.regexp === false) return this.regexp

  // at this point, this.set is a 2d array of partial
  // pattern strings, or "**".
  //
  // It's better to use .match().  This function shouldn't
  // be used, really, but it's pretty convenient sometimes,
  // when you just want to work with a regex.
  var set = this.set

  if (!set.length) {
    this.regexp = false
    return this.regexp
  }
  var options = this.options

  var twoStar = options.noglobstar ? star
    : options.dot ? twoStarDot
    : twoStarNoDot
  var flags = options.nocase ? 'i' : ''

  var re = set.map(function (pattern) {
    return pattern.map(function (p) {
      return (p === GLOBSTAR) ? twoStar
      : (typeof p === 'string') ? regExpEscape(p)
      : p._src
    }).join('\\\/')
  }).join('|')

  // must match entire pattern
  // ending in a * or ** will make it less strict.
  re = '^(?:' + re + ')$'

  // can match anything, as long as it's not this.
  if (this.negate) re = '^(?!' + re + ').*$'

  try {
    this.regexp = new RegExp(re, flags)
  } catch (ex) /* istanbul ignore next - should be impossible */ {
    this.regexp = false
  }
  return this.regexp
}

minimatch.match = function (list, pattern, options) {
  options = options || {}
  var mm = new Minimatch(pattern, options)
  list = list.filter(function (f) {
    return mm.match(f)
  })
  if (mm.options.nonull && !list.length) {
    list.push(pattern)
  }
  return list
}

Minimatch.prototype.match = function match (f, partial) {
  if (typeof partial === 'undefined') partial = this.partial
  this.debug('match', f, this.pattern)
  // short-circuit in the case of busted things.
  // comments, etc.
  if (this.comment) return false
  if (this.empty) return f === ''

  if (f === '/' && partial) return true

  var options = this.options

  // windows: need to use /, not \
  if (path.sep !== '/') {
    f = f.split(path.sep).join('/')
  }

  // treat the test path as a set of pathparts.
  f = f.split(slashSplit)
  this.debug(this.pattern, 'split', f)

  // just ONE of the pattern sets in this.set needs to match
  // in order for it to be valid.  If negating, then just one
  // match means that we have failed.
  // Either way, return on the first hit.

  var set = this.set
  this.debug(this.pattern, 'set', set)

  // Find the basename of the path by looking for the last non-empty segment
  var filename
  var i
  for (i = f.length - 1; i >= 0; i--) {
    filename = f[i]
    if (filename) break
  }

  for (i = 0; i < set.length; i++) {
    var pattern = set[i]
    var file = f
    if (options.matchBase && pattern.length === 1) {
      file = [filename]
    }
    var hit = this.matchOne(file, pattern, partial)
    if (hit) {
      if (options.flipNegate) return true
      return !this.negate
    }
  }

  // didn't get any hits.  this is success if it's a negative
  // pattern, failure otherwise.
  if (options.flipNegate) return false
  return this.negate
}

// set partial to true to test if, for example,
// "/a/b" matches the start of "/*/b/*/d"
// Partial means, if you run out of file before you run
// out of pattern, then that's fine, as long as all
// the parts match.
Minimatch.prototype.matchOne = function (file, pattern, partial) {
  var options = this.options

  this.debug('matchOne',
    { 'this': this, file: file, pattern: pattern })

  this.debug('matchOne', file.length, pattern.length)

  for (var fi = 0,
      pi = 0,
      fl = file.length,
      pl = pattern.length
      ; (fi < fl) && (pi < pl)
      ; fi++, pi++) {
    this.debug('matchOne loop')
    var p = pattern[pi]
    var f = file[fi]

    this.debug(pattern, p, f)

    // should be impossible.
    // some invalid regexp stuff in the set.
    /* istanbul ignore if */
    if (p === false) return false

    if (p === GLOBSTAR) {
      this.debug('GLOBSTAR', [pattern, p, f])

      // "**"
      // a/**/b/**/c would match the following:
      // a/b/x/y/z/c
      // a/x/y/z/b/c
      // a/b/x/b/x/c
      // a/b/c
      // To do this, take the rest of the pattern after
      // the **, and see if it would match the file remainder.
      // If so, return success.
      // If not, the ** "swallows" a segment, and try again.
      // This is recursively awful.
      //
      // a/**/b/**/c matching a/b/x/y/z/c
      // - a matches a
      // - doublestar
      //   - matchOne(b/x/y/z/c, b/**/c)
      //     - b matches b
      //     - doublestar
      //       - matchOne(x/y/z/c, c) -> no
      //       - matchOne(y/z/c, c) -> no
      //       - matchOne(z/c, c) -> no
      //       - matchOne(c, c) yes, hit
      var fr = fi
      var pr = pi + 1
      if (pr === pl) {
        this.debug('** at the end')
        // a ** at the end will just swallow the rest.
        // We have found a match.
        // however, it will not swallow /.x, unless
        // options.dot is set.
        // . and .. are *never* matched by **, for explosively
        // exponential reasons.
        for (; fi < fl; fi++) {
          if (file[fi] === '.' || file[fi] === '..' ||
            (!options.dot && file[fi].charAt(0) === '.')) return false
        }
        return true
      }

      // ok, let's see if we can swallow whatever we can.
      while (fr < fl) {
        var swallowee = file[fr]

        this.debug('\nglobstar while', file, fr, pattern, pr, swallowee)

        // XXX remove this slice.  Just pass the start index.
        if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
          this.debug('globstar found match!', fr, fl, swallowee)
          // found a match.
          return true
        } else {
          // can't swallow "." or ".." ever.
          // can only swallow ".foo" when explicitly asked.
          if (swallowee === '.' || swallowee === '..' ||
            (!options.dot && swallowee.charAt(0) === '.')) {
            this.debug('dot detected!', file, fr, pattern, pr)
            break
          }

          // ** swallows a segment, and continue.
          this.debug('globstar swallow a segment, and continue')
          fr++
        }
      }

      // no match was found.
      // However, in partial mode, we can't say this is necessarily over.
      // If there's more *pattern* left, then
      /* istanbul ignore if */
      if (partial) {
        // ran out of file
        this.debug('\n>>> no match, partial?', file, fr, pattern, pr)
        if (fr === fl) return true
      }
      return false
    }

    // something other than **
    // non-magic patterns just have to match exactly
    // patterns with magic have been turned into regexps.
    var hit
    if (typeof p === 'string') {
      hit = f === p
      this.debug('string match', p, f, hit)
    } else {
      hit = f.match(p)
      this.debug('pattern match', p, f, hit)
    }

    if (!hit) return false
  }

  // Note: ending in / means that we'll get a final ""
  // at the end of the pattern.  This can only match a
  // corresponding "" at the end of the file.
  // If the file ends in /, then it can only match a
  // a pattern that ends in /, unless the pattern just
  // doesn't have any more for it. But, a/b/ should *not*
  // match "a/b/*", even though "" matches against the
  // [^/]*? pattern, except in partial mode, where it might
  // simply not be reached yet.
  // However, a/b/ should still satisfy a/*

  // now either we fell off the end of the pattern, or we're done.
  if (fi === fl && pi === pl) {
    // ran out of pattern and filename at the same time.
    // an exact hit!
    return true
  } else if (fi === fl) {
    // ran out of file, but still had pattern left.
    // this is ok if we're doing the match as part of
    // a glob fs traversal.
    return partial
  } else /* istanbul ignore else */ if (pi === pl) {
    // ran out of pattern, still have file left.
    // this is only acceptable if we're on the very last
    // empty segment of a file with a trailing slash.
    // a/* should match a/b/
    return (fi === fl - 1) && (file[fi] === '')
  }

  // should be unreachable.
  /* istanbul ignore next */
  throw new Error('wtf?')
}

// replace stuff like \* with *
function globUnescape (s) {
  return s.replace(/\\(.)/g, '$1')
}

function regExpEscape (s) {
  return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}


/***/ }),

/***/ 502:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const path = __nccwpck_require__(1017);
const pathKey = __nccwpck_require__(539);

const npmRunPath = options => {
	options = {
		cwd: process.cwd(),
		path: process.env[pathKey()],
		execPath: process.execPath,
		...options
	};

	let previous;
	let cwdPath = path.resolve(options.cwd);
	const result = [];

	while (previous !== cwdPath) {
		result.push(path.join(cwdPath, 'node_modules/.bin'));
		previous = cwdPath;
		cwdPath = path.resolve(cwdPath, '..');
	}

	// Ensure the running `node` binary is used
	const execPathDir = path.resolve(options.cwd, options.execPath, '..');
	result.push(execPathDir);

	return result.concat(options.path).join(path.delimiter);
};

module.exports = npmRunPath;
// TODO: Remove this for the next major release
module.exports["default"] = npmRunPath;

module.exports.env = options => {
	options = {
		env: process.env,
		...options
	};

	const env = {...options.env};
	const path = pathKey({env});

	options.path = env[path];
	env[path] = module.exports(options);

	return env;
};


/***/ }),

/***/ 1223:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var wrappy = __nccwpck_require__(2940)
module.exports = wrappy(once)
module.exports.strict = wrappy(onceStrict)

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })

  Object.defineProperty(Function.prototype, 'onceStrict', {
    value: function () {
      return onceStrict(this)
    },
    configurable: true
  })
})

function once (fn) {
  var f = function () {
    if (f.called) return f.value
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  f.called = false
  return f
}

function onceStrict (fn) {
  var f = function () {
    if (f.called)
      throw new Error(f.onceError)
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  var name = fn.name || 'Function wrapped with `once`'
  f.onceError = name + " shouldn't be called more than once"
  f.called = false
  return f
}


/***/ }),

/***/ 9082:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const mimicFn = __nccwpck_require__(6047);

const calledFunctions = new WeakMap();

const onetime = (function_, options = {}) => {
	if (typeof function_ !== 'function') {
		throw new TypeError('Expected a function');
	}

	let returnValue;
	let callCount = 0;
	const functionName = function_.displayName || function_.name || '<anonymous>';

	const onetime = function (...arguments_) {
		calledFunctions.set(onetime, ++callCount);

		if (callCount === 1) {
			returnValue = function_.apply(this, arguments_);
			function_ = null;
		} else if (options.throw === true) {
			throw new Error(`Function \`${functionName}\` can only be called once`);
		}

		return returnValue;
	};

	mimicFn(onetime, function_);
	calledFunctions.set(onetime, callCount);

	return onetime;
};

module.exports = onetime;
// TODO: Remove this for the next major release
module.exports["default"] = onetime;

module.exports.callCount = function_ => {
	if (!calledFunctions.has(function_)) {
		throw new Error(`The given function \`${function_.name}\` is not wrapped by the \`onetime\` package`);
	}

	return calledFunctions.get(function_);
};


/***/ }),

/***/ 8714:
/***/ ((module) => {

"use strict";


function posix(path) {
	return path.charAt(0) === '/';
}

function win32(path) {
	// https://github.com/nodejs/node/blob/b3fcc245fb25539909ef1d5eaa01dbf92e168633/lib/path.js#L56
	var splitDeviceRe = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;
	var result = splitDeviceRe.exec(path);
	var device = result[1] || '';
	var isUnc = Boolean(device && device.charAt(1) !== ':');

	// UNC paths are always absolute
	return Boolean(result[2] || isUnc);
}

module.exports = process.platform === 'win32' ? win32 : posix;
module.exports.posix = posix;
module.exports.win32 = win32;


/***/ }),

/***/ 539:
/***/ ((module) => {

"use strict";


const pathKey = (options = {}) => {
	const environment = options.env || process.env;
	const platform = options.platform || process.platform;

	if (platform !== 'win32') {
		return 'PATH';
	}

	return Object.keys(environment).reverse().find(key => key.toUpperCase() === 'PATH') || 'Path';
};

module.exports = pathKey;
// TODO: Remove this for the next major release
module.exports["default"] = pathKey;


/***/ }),

/***/ 8341:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var once = __nccwpck_require__(1223)
var eos = __nccwpck_require__(1205)
var fs = __nccwpck_require__(7147) // we only need fs to get the ReadStream and WriteStream prototypes

var noop = function () {}
var ancient = /^v?\.0/.test(process.version)

var isFn = function (fn) {
  return typeof fn === 'function'
}

var isFS = function (stream) {
  if (!ancient) return false // newer node version do not need to care about fs is a special way
  if (!fs) return false // browser
  return (stream instanceof (fs.ReadStream || noop) || stream instanceof (fs.WriteStream || noop)) && isFn(stream.close)
}

var isRequest = function (stream) {
  return stream.setHeader && isFn(stream.abort)
}

var destroyer = function (stream, reading, writing, callback) {
  callback = once(callback)

  var closed = false
  stream.on('close', function () {
    closed = true
  })

  eos(stream, {readable: reading, writable: writing}, function (err) {
    if (err) return callback(err)
    closed = true
    callback()
  })

  var destroyed = false
  return function (err) {
    if (closed) return
    if (destroyed) return
    destroyed = true

    if (isFS(stream)) return stream.close(noop) // use close for fs streams to avoid fd leaks
    if (isRequest(stream)) return stream.abort() // request.destroy just do .end - .abort is what we want

    if (isFn(stream.destroy)) return stream.destroy()

    callback(err || new Error('stream was destroyed'))
  }
}

var call = function (fn) {
  fn()
}

var pipe = function (from, to) {
  return from.pipe(to)
}

var pump = function () {
  var streams = Array.prototype.slice.call(arguments)
  var callback = isFn(streams[streams.length - 1] || noop) && streams.pop() || noop

  if (Array.isArray(streams[0])) streams = streams[0]
  if (streams.length < 2) throw new Error('pump requires two streams per minimum')

  var error
  var destroys = streams.map(function (stream, i) {
    var reading = i < streams.length - 1
    var writing = i > 0
    return destroyer(stream, reading, writing, function (err) {
      if (!error) error = err
      if (err) destroys.forEach(call)
      if (reading) return
      destroys.forEach(call)
      callback(error)
    })
  })

  return streams.reduce(pipe)
}

module.exports = pump


/***/ }),

/***/ 1532:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const ANY = Symbol('SemVer ANY')
// hoisted class for cyclic dependency
class Comparator {
  static get ANY () {
    return ANY
  }

  constructor (comp, options) {
    options = parseOptions(options)

    if (comp instanceof Comparator) {
      if (comp.loose === !!options.loose) {
        return comp
      } else {
        comp = comp.value
      }
    }

    comp = comp.trim().split(/\s+/).join(' ')
    debug('comparator', comp, options)
    this.options = options
    this.loose = !!options.loose
    this.parse(comp)

    if (this.semver === ANY) {
      this.value = ''
    } else {
      this.value = this.operator + this.semver.version
    }

    debug('comp', this)
  }

  parse (comp) {
    const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR]
    const m = comp.match(r)

    if (!m) {
      throw new TypeError(`Invalid comparator: ${comp}`)
    }

    this.operator = m[1] !== undefined ? m[1] : ''
    if (this.operator === '=') {
      this.operator = ''
    }

    // if it literally is just '>' or '' then allow anything.
    if (!m[2]) {
      this.semver = ANY
    } else {
      this.semver = new SemVer(m[2], this.options.loose)
    }
  }

  toString () {
    return this.value
  }

  test (version) {
    debug('Comparator.test', version, this.options.loose)

    if (this.semver === ANY || version === ANY) {
      return true
    }

    if (typeof version === 'string') {
      try {
        version = new SemVer(version, this.options)
      } catch (er) {
        return false
      }
    }

    return cmp(version, this.operator, this.semver, this.options)
  }

  intersects (comp, options) {
    if (!(comp instanceof Comparator)) {
      throw new TypeError('a Comparator is required')
    }

    if (this.operator === '') {
      if (this.value === '') {
        return true
      }
      return new Range(comp.value, options).test(this.value)
    } else if (comp.operator === '') {
      if (comp.value === '') {
        return true
      }
      return new Range(this.value, options).test(comp.semver)
    }

    options = parseOptions(options)

    // Special cases where nothing can possibly be lower
    if (options.includePrerelease &&
      (this.value === '<0.0.0-0' || comp.value === '<0.0.0-0')) {
      return false
    }
    if (!options.includePrerelease &&
      (this.value.startsWith('<0.0.0') || comp.value.startsWith('<0.0.0'))) {
      return false
    }

    // Same direction increasing (> or >=)
    if (this.operator.startsWith('>') && comp.operator.startsWith('>')) {
      return true
    }
    // Same direction decreasing (< or <=)
    if (this.operator.startsWith('<') && comp.operator.startsWith('<')) {
      return true
    }
    // same SemVer and both sides are inclusive (<= or >=)
    if (
      (this.semver.version === comp.semver.version) &&
      this.operator.includes('=') && comp.operator.includes('=')) {
      return true
    }
    // opposite directions less than
    if (cmp(this.semver, '<', comp.semver, options) &&
      this.operator.startsWith('>') && comp.operator.startsWith('<')) {
      return true
    }
    // opposite directions greater than
    if (cmp(this.semver, '>', comp.semver, options) &&
      this.operator.startsWith('<') && comp.operator.startsWith('>')) {
      return true
    }
    return false
  }
}

module.exports = Comparator

const parseOptions = __nccwpck_require__(785)
const { safeRe: re, t } = __nccwpck_require__(9523)
const cmp = __nccwpck_require__(5098)
const debug = __nccwpck_require__(427)
const SemVer = __nccwpck_require__(8088)
const Range = __nccwpck_require__(9828)


/***/ }),

/***/ 9828:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// hoisted class for cyclic dependency
class Range {
  constructor (range, options) {
    options = parseOptions(options)

    if (range instanceof Range) {
      if (
        range.loose === !!options.loose &&
        range.includePrerelease === !!options.includePrerelease
      ) {
        return range
      } else {
        return new Range(range.raw, options)
      }
    }

    if (range instanceof Comparator) {
      // just put it in the set and return
      this.raw = range.value
      this.set = [[range]]
      this.format()
      return this
    }

    this.options = options
    this.loose = !!options.loose
    this.includePrerelease = !!options.includePrerelease

    // First reduce all whitespace as much as possible so we do not have to rely
    // on potentially slow regexes like \s*. This is then stored and used for
    // future error messages as well.
    this.raw = range
      .trim()
      .split(/\s+/)
      .join(' ')

    // First, split on ||
    this.set = this.raw
      .split('||')
      // map the range to a 2d array of comparators
      .map(r => this.parseRange(r.trim()))
      // throw out any comparator lists that are empty
      // this generally means that it was not a valid range, which is allowed
      // in loose mode, but will still throw if the WHOLE range is invalid.
      .filter(c => c.length)

    if (!this.set.length) {
      throw new TypeError(`Invalid SemVer Range: ${this.raw}`)
    }

    // if we have any that are not the null set, throw out null sets.
    if (this.set.length > 1) {
      // keep the first one, in case they're all null sets
      const first = this.set[0]
      this.set = this.set.filter(c => !isNullSet(c[0]))
      if (this.set.length === 0) {
        this.set = [first]
      } else if (this.set.length > 1) {
        // if we have any that are *, then the range is just *
        for (const c of this.set) {
          if (c.length === 1 && isAny(c[0])) {
            this.set = [c]
            break
          }
        }
      }
    }

    this.format()
  }

  format () {
    this.range = this.set
      .map((comps) => comps.join(' ').trim())
      .join('||')
      .trim()
    return this.range
  }

  toString () {
    return this.range
  }

  parseRange (range) {
    // memoize range parsing for performance.
    // this is a very hot path, and fully deterministic.
    const memoOpts =
      (this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) |
      (this.options.loose && FLAG_LOOSE)
    const memoKey = memoOpts + ':' + range
    const cached = cache.get(memoKey)
    if (cached) {
      return cached
    }

    const loose = this.options.loose
    // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
    const hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE]
    range = range.replace(hr, hyphenReplace(this.options.includePrerelease))
    debug('hyphen replace', range)

    // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
    range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace)
    debug('comparator trim', range)

    // `~ 1.2.3` => `~1.2.3`
    range = range.replace(re[t.TILDETRIM], tildeTrimReplace)
    debug('tilde trim', range)

    // `^ 1.2.3` => `^1.2.3`
    range = range.replace(re[t.CARETTRIM], caretTrimReplace)
    debug('caret trim', range)

    // At this point, the range is completely trimmed and
    // ready to be split into comparators.

    let rangeList = range
      .split(' ')
      .map(comp => parseComparator(comp, this.options))
      .join(' ')
      .split(/\s+/)
      // >=0.0.0 is equivalent to *
      .map(comp => replaceGTE0(comp, this.options))

    if (loose) {
      // in loose mode, throw out any that are not valid comparators
      rangeList = rangeList.filter(comp => {
        debug('loose invalid filter', comp, this.options)
        return !!comp.match(re[t.COMPARATORLOOSE])
      })
    }
    debug('range list', rangeList)

    // if any comparators are the null set, then replace with JUST null set
    // if more than one comparator, remove any * comparators
    // also, don't include the same comparator more than once
    const rangeMap = new Map()
    const comparators = rangeList.map(comp => new Comparator(comp, this.options))
    for (const comp of comparators) {
      if (isNullSet(comp)) {
        return [comp]
      }
      rangeMap.set(comp.value, comp)
    }
    if (rangeMap.size > 1 && rangeMap.has('')) {
      rangeMap.delete('')
    }

    const result = [...rangeMap.values()]
    cache.set(memoKey, result)
    return result
  }

  intersects (range, options) {
    if (!(range instanceof Range)) {
      throw new TypeError('a Range is required')
    }

    return this.set.some((thisComparators) => {
      return (
        isSatisfiable(thisComparators, options) &&
        range.set.some((rangeComparators) => {
          return (
            isSatisfiable(rangeComparators, options) &&
            thisComparators.every((thisComparator) => {
              return rangeComparators.every((rangeComparator) => {
                return thisComparator.intersects(rangeComparator, options)
              })
            })
          )
        })
      )
    })
  }

  // if ANY of the sets match ALL of its comparators, then pass
  test (version) {
    if (!version) {
      return false
    }

    if (typeof version === 'string') {
      try {
        version = new SemVer(version, this.options)
      } catch (er) {
        return false
      }
    }

    for (let i = 0; i < this.set.length; i++) {
      if (testSet(this.set[i], version, this.options)) {
        return true
      }
    }
    return false
  }
}

module.exports = Range

const LRU = __nccwpck_require__(1196)
const cache = new LRU({ max: 1000 })

const parseOptions = __nccwpck_require__(785)
const Comparator = __nccwpck_require__(1532)
const debug = __nccwpck_require__(427)
const SemVer = __nccwpck_require__(8088)
const {
  safeRe: re,
  t,
  comparatorTrimReplace,
  tildeTrimReplace,
  caretTrimReplace,
} = __nccwpck_require__(9523)
const { FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE } = __nccwpck_require__(2293)

const isNullSet = c => c.value === '<0.0.0-0'
const isAny = c => c.value === ''

// take a set of comparators and determine whether there
// exists a version which can satisfy it
const isSatisfiable = (comparators, options) => {
  let result = true
  const remainingComparators = comparators.slice()
  let testComparator = remainingComparators.pop()

  while (result && remainingComparators.length) {
    result = remainingComparators.every((otherComparator) => {
      return testComparator.intersects(otherComparator, options)
    })

    testComparator = remainingComparators.pop()
  }

  return result
}

// comprised of xranges, tildes, stars, and gtlt's at this point.
// already replaced the hyphen ranges
// turn into a set of JUST comparators.
const parseComparator = (comp, options) => {
  debug('comp', comp, options)
  comp = replaceCarets(comp, options)
  debug('caret', comp)
  comp = replaceTildes(comp, options)
  debug('tildes', comp)
  comp = replaceXRanges(comp, options)
  debug('xrange', comp)
  comp = replaceStars(comp, options)
  debug('stars', comp)
  return comp
}

const isX = id => !id || id.toLowerCase() === 'x' || id === '*'

// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0-0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0-0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0-0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0-0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0-0
// ~0.0.1 --> >=0.0.1 <0.1.0-0
const replaceTildes = (comp, options) => {
  return comp
    .trim()
    .split(/\s+/)
    .map((c) => replaceTilde(c, options))
    .join(' ')
}

const replaceTilde = (comp, options) => {
  const r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE]
  return comp.replace(r, (_, M, m, p, pr) => {
    debug('tilde', comp, _, M, m, p, pr)
    let ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = `>=${M}.0.0 <${+M + 1}.0.0-0`
    } else if (isX(p)) {
      // ~1.2 == >=1.2.0 <1.3.0-0
      ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`
    } else if (pr) {
      debug('replaceTilde pr', pr)
      ret = `>=${M}.${m}.${p}-${pr
      } <${M}.${+m + 1}.0-0`
    } else {
      // ~1.2.3 == >=1.2.3 <1.3.0-0
      ret = `>=${M}.${m}.${p
      } <${M}.${+m + 1}.0-0`
    }

    debug('tilde return', ret)
    return ret
  })
}

// ^ --> * (any, kinda silly)
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0-0
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0-0
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0-0
// ^1.2.3 --> >=1.2.3 <2.0.0-0
// ^1.2.0 --> >=1.2.0 <2.0.0-0
// ^0.0.1 --> >=0.0.1 <0.0.2-0
// ^0.1.0 --> >=0.1.0 <0.2.0-0
const replaceCarets = (comp, options) => {
  return comp
    .trim()
    .split(/\s+/)
    .map((c) => replaceCaret(c, options))
    .join(' ')
}

const replaceCaret = (comp, options) => {
  debug('caret', comp, options)
  const r = options.loose ? re[t.CARETLOOSE] : re[t.CARET]
  const z = options.includePrerelease ? '-0' : ''
  return comp.replace(r, (_, M, m, p, pr) => {
    debug('caret', comp, _, M, m, p, pr)
    let ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`
    } else if (isX(p)) {
      if (M === '0') {
        ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`
      } else {
        ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`
      }
    } else if (pr) {
      debug('replaceCaret pr', pr)
      if (M === '0') {
        if (m === '0') {
          ret = `>=${M}.${m}.${p}-${pr
          } <${M}.${m}.${+p + 1}-0`
        } else {
          ret = `>=${M}.${m}.${p}-${pr
          } <${M}.${+m + 1}.0-0`
        }
      } else {
        ret = `>=${M}.${m}.${p}-${pr
        } <${+M + 1}.0.0-0`
      }
    } else {
      debug('no pr')
      if (M === '0') {
        if (m === '0') {
          ret = `>=${M}.${m}.${p
          }${z} <${M}.${m}.${+p + 1}-0`
        } else {
          ret = `>=${M}.${m}.${p
          }${z} <${M}.${+m + 1}.0-0`
        }
      } else {
        ret = `>=${M}.${m}.${p
        } <${+M + 1}.0.0-0`
      }
    }

    debug('caret return', ret)
    return ret
  })
}

const replaceXRanges = (comp, options) => {
  debug('replaceXRanges', comp, options)
  return comp
    .split(/\s+/)
    .map((c) => replaceXRange(c, options))
    .join(' ')
}

const replaceXRange = (comp, options) => {
  comp = comp.trim()
  const r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE]
  return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
    debug('xRange', comp, ret, gtlt, M, m, p, pr)
    const xM = isX(M)
    const xm = xM || isX(m)
    const xp = xm || isX(p)
    const anyX = xp

    if (gtlt === '=' && anyX) {
      gtlt = ''
    }

    // if we're including prereleases in the match, then we need
    // to fix this to -0, the lowest possible prerelease value
    pr = options.includePrerelease ? '-0' : ''

    if (xM) {
      if (gtlt === '>' || gtlt === '<') {
        // nothing is allowed
        ret = '<0.0.0-0'
      } else {
        // nothing is forbidden
        ret = '*'
      }
    } else if (gtlt && anyX) {
      // we know patch is an x, because we have any x at all.
      // replace X with 0
      if (xm) {
        m = 0
      }
      p = 0

      if (gtlt === '>') {
        // >1 => >=2.0.0
        // >1.2 => >=1.3.0
        gtlt = '>='
        if (xm) {
          M = +M + 1
          m = 0
          p = 0
        } else {
          m = +m + 1
          p = 0
        }
      } else if (gtlt === '<=') {
        // <=0.7.x is actually <0.8.0, since any 0.7.x should
        // pass.  Similarly, <=7.x is actually <8.0.0, etc.
        gtlt = '<'
        if (xm) {
          M = +M + 1
        } else {
          m = +m + 1
        }
      }

      if (gtlt === '<') {
        pr = '-0'
      }

      ret = `${gtlt + M}.${m}.${p}${pr}`
    } else if (xm) {
      ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`
    } else if (xp) {
      ret = `>=${M}.${m}.0${pr
      } <${M}.${+m + 1}.0-0`
    }

    debug('xRange return', ret)

    return ret
  })
}

// Because * is AND-ed with everything else in the comparator,
// and '' means "any version", just remove the *s entirely.
const replaceStars = (comp, options) => {
  debug('replaceStars', comp, options)
  // Looseness is ignored here.  star is always as loose as it gets!
  return comp
    .trim()
    .replace(re[t.STAR], '')
}

const replaceGTE0 = (comp, options) => {
  debug('replaceGTE0', comp, options)
  return comp
    .trim()
    .replace(re[options.includePrerelease ? t.GTE0PRE : t.GTE0], '')
}

// This function is passed to string.replace(re[t.HYPHENRANGE])
// M, m, patch, prerelease, build
// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
// 1.2.3 - 3.4 => >=1.2.0 <3.5.0-0 Any 3.4.x will do
// 1.2 - 3.4 => >=1.2.0 <3.5.0-0
const hyphenReplace = incPr => ($0,
  from, fM, fm, fp, fpr, fb,
  to, tM, tm, tp, tpr, tb) => {
  if (isX(fM)) {
    from = ''
  } else if (isX(fm)) {
    from = `>=${fM}.0.0${incPr ? '-0' : ''}`
  } else if (isX(fp)) {
    from = `>=${fM}.${fm}.0${incPr ? '-0' : ''}`
  } else if (fpr) {
    from = `>=${from}`
  } else {
    from = `>=${from}${incPr ? '-0' : ''}`
  }

  if (isX(tM)) {
    to = ''
  } else if (isX(tm)) {
    to = `<${+tM + 1}.0.0-0`
  } else if (isX(tp)) {
    to = `<${tM}.${+tm + 1}.0-0`
  } else if (tpr) {
    to = `<=${tM}.${tm}.${tp}-${tpr}`
  } else if (incPr) {
    to = `<${tM}.${tm}.${+tp + 1}-0`
  } else {
    to = `<=${to}`
  }

  return `${from} ${to}`.trim()
}

const testSet = (set, version, options) => {
  for (let i = 0; i < set.length; i++) {
    if (!set[i].test(version)) {
      return false
    }
  }

  if (version.prerelease.length && !options.includePrerelease) {
    // Find the set of versions that are allowed to have prereleases
    // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
    // That should allow `1.2.3-pr.2` to pass.
    // However, `1.2.4-alpha.notready` should NOT be allowed,
    // even though it's within the range set by the comparators.
    for (let i = 0; i < set.length; i++) {
      debug(set[i].semver)
      if (set[i].semver === Comparator.ANY) {
        continue
      }

      if (set[i].semver.prerelease.length > 0) {
        const allowed = set[i].semver
        if (allowed.major === version.major &&
            allowed.minor === version.minor &&
            allowed.patch === version.patch) {
          return true
        }
      }
    }

    // Version has a -pre, but it's not one of the ones we like.
    return false
  }

  return true
}


/***/ }),

/***/ 8088:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const debug = __nccwpck_require__(427)
const { MAX_LENGTH, MAX_SAFE_INTEGER } = __nccwpck_require__(2293)
const { safeRe: re, t } = __nccwpck_require__(9523)

const parseOptions = __nccwpck_require__(785)
const { compareIdentifiers } = __nccwpck_require__(2463)
class SemVer {
  constructor (version, options) {
    options = parseOptions(options)

    if (version instanceof SemVer) {
      if (version.loose === !!options.loose &&
          version.includePrerelease === !!options.includePrerelease) {
        return version
      } else {
        version = version.version
      }
    } else if (typeof version !== 'string') {
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version}".`)
    }

    if (version.length > MAX_LENGTH) {
      throw new TypeError(
        `version is longer than ${MAX_LENGTH} characters`
      )
    }

    debug('SemVer', version, options)
    this.options = options
    this.loose = !!options.loose
    // this isn't actually relevant for versions, but keep it so that we
    // don't run into trouble passing this.options around.
    this.includePrerelease = !!options.includePrerelease

    const m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL])

    if (!m) {
      throw new TypeError(`Invalid Version: ${version}`)
    }

    this.raw = version

    // these are actually numbers
    this.major = +m[1]
    this.minor = +m[2]
    this.patch = +m[3]

    if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
      throw new TypeError('Invalid major version')
    }

    if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
      throw new TypeError('Invalid minor version')
    }

    if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
      throw new TypeError('Invalid patch version')
    }

    // numberify any prerelease numeric ids
    if (!m[4]) {
      this.prerelease = []
    } else {
      this.prerelease = m[4].split('.').map((id) => {
        if (/^[0-9]+$/.test(id)) {
          const num = +id
          if (num >= 0 && num < MAX_SAFE_INTEGER) {
            return num
          }
        }
        return id
      })
    }

    this.build = m[5] ? m[5].split('.') : []
    this.format()
  }

  format () {
    this.version = `${this.major}.${this.minor}.${this.patch}`
    if (this.prerelease.length) {
      this.version += `-${this.prerelease.join('.')}`
    }
    return this.version
  }

  toString () {
    return this.version
  }

  compare (other) {
    debug('SemVer.compare', this.version, this.options, other)
    if (!(other instanceof SemVer)) {
      if (typeof other === 'string' && other === this.version) {
        return 0
      }
      other = new SemVer(other, this.options)
    }

    if (other.version === this.version) {
      return 0
    }

    return this.compareMain(other) || this.comparePre(other)
  }

  compareMain (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options)
    }

    return (
      compareIdentifiers(this.major, other.major) ||
      compareIdentifiers(this.minor, other.minor) ||
      compareIdentifiers(this.patch, other.patch)
    )
  }

  comparePre (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options)
    }

    // NOT having a prerelease is > having one
    if (this.prerelease.length && !other.prerelease.length) {
      return -1
    } else if (!this.prerelease.length && other.prerelease.length) {
      return 1
    } else if (!this.prerelease.length && !other.prerelease.length) {
      return 0
    }

    let i = 0
    do {
      const a = this.prerelease[i]
      const b = other.prerelease[i]
      debug('prerelease compare', i, a, b)
      if (a === undefined && b === undefined) {
        return 0
      } else if (b === undefined) {
        return 1
      } else if (a === undefined) {
        return -1
      } else if (a === b) {
        continue
      } else {
        return compareIdentifiers(a, b)
      }
    } while (++i)
  }

  compareBuild (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options)
    }

    let i = 0
    do {
      const a = this.build[i]
      const b = other.build[i]
      debug('prerelease compare', i, a, b)
      if (a === undefined && b === undefined) {
        return 0
      } else if (b === undefined) {
        return 1
      } else if (a === undefined) {
        return -1
      } else if (a === b) {
        continue
      } else {
        return compareIdentifiers(a, b)
      }
    } while (++i)
  }

  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc (release, identifier, identifierBase) {
    switch (release) {
      case 'premajor':
        this.prerelease.length = 0
        this.patch = 0
        this.minor = 0
        this.major++
        this.inc('pre', identifier, identifierBase)
        break
      case 'preminor':
        this.prerelease.length = 0
        this.patch = 0
        this.minor++
        this.inc('pre', identifier, identifierBase)
        break
      case 'prepatch':
        // If this is already a prerelease, it will bump to the next version
        // drop any prereleases that might already exist, since they are not
        // relevant at this point.
        this.prerelease.length = 0
        this.inc('patch', identifier, identifierBase)
        this.inc('pre', identifier, identifierBase)
        break
      // If the input is a non-prerelease version, this acts the same as
      // prepatch.
      case 'prerelease':
        if (this.prerelease.length === 0) {
          this.inc('patch', identifier, identifierBase)
        }
        this.inc('pre', identifier, identifierBase)
        break

      case 'major':
        // If this is a pre-major version, bump up to the same major version.
        // Otherwise increment major.
        // 1.0.0-5 bumps to 1.0.0
        // 1.1.0 bumps to 2.0.0
        if (
          this.minor !== 0 ||
          this.patch !== 0 ||
          this.prerelease.length === 0
        ) {
          this.major++
        }
        this.minor = 0
        this.patch = 0
        this.prerelease = []
        break
      case 'minor':
        // If this is a pre-minor version, bump up to the same minor version.
        // Otherwise increment minor.
        // 1.2.0-5 bumps to 1.2.0
        // 1.2.1 bumps to 1.3.0
        if (this.patch !== 0 || this.prerelease.length === 0) {
          this.minor++
        }
        this.patch = 0
        this.prerelease = []
        break
      case 'patch':
        // If this is not a pre-release version, it will increment the patch.
        // If it is a pre-release it will bump up to the same patch version.
        // 1.2.0-5 patches to 1.2.0
        // 1.2.0 patches to 1.2.1
        if (this.prerelease.length === 0) {
          this.patch++
        }
        this.prerelease = []
        break
      // This probably shouldn't be used publicly.
      // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
      case 'pre': {
        const base = Number(identifierBase) ? 1 : 0

        if (!identifier && identifierBase === false) {
          throw new Error('invalid increment argument: identifier is empty')
        }

        if (this.prerelease.length === 0) {
          this.prerelease = [base]
        } else {
          let i = this.prerelease.length
          while (--i >= 0) {
            if (typeof this.prerelease[i] === 'number') {
              this.prerelease[i]++
              i = -2
            }
          }
          if (i === -1) {
            // didn't increment anything
            if (identifier === this.prerelease.join('.') && identifierBase === false) {
              throw new Error('invalid increment argument: identifier already exists')
            }
            this.prerelease.push(base)
          }
        }
        if (identifier) {
          // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
          // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
          let prerelease = [identifier, base]
          if (identifierBase === false) {
            prerelease = [identifier]
          }
          if (compareIdentifiers(this.prerelease[0], identifier) === 0) {
            if (isNaN(this.prerelease[1])) {
              this.prerelease = prerelease
            }
          } else {
            this.prerelease = prerelease
          }
        }
        break
      }
      default:
        throw new Error(`invalid increment argument: ${release}`)
    }
    this.raw = this.format()
    if (this.build.length) {
      this.raw += `+${this.build.join('.')}`
    }
    return this
  }
}

module.exports = SemVer


/***/ }),

/***/ 8848:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const parse = __nccwpck_require__(5925)
const clean = (version, options) => {
  const s = parse(version.trim().replace(/^[=v]+/, ''), options)
  return s ? s.version : null
}
module.exports = clean


/***/ }),

/***/ 5098:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const eq = __nccwpck_require__(1898)
const neq = __nccwpck_require__(6017)
const gt = __nccwpck_require__(4123)
const gte = __nccwpck_require__(5522)
const lt = __nccwpck_require__(194)
const lte = __nccwpck_require__(7520)

const cmp = (a, op, b, loose) => {
  switch (op) {
    case '===':
      if (typeof a === 'object') {
        a = a.version
      }
      if (typeof b === 'object') {
        b = b.version
      }
      return a === b

    case '!==':
      if (typeof a === 'object') {
        a = a.version
      }
      if (typeof b === 'object') {
        b = b.version
      }
      return a !== b

    case '':
    case '=':
    case '==':
      return eq(a, b, loose)

    case '!=':
      return neq(a, b, loose)

    case '>':
      return gt(a, b, loose)

    case '>=':
      return gte(a, b, loose)

    case '<':
      return lt(a, b, loose)

    case '<=':
      return lte(a, b, loose)

    default:
      throw new TypeError(`Invalid operator: ${op}`)
  }
}
module.exports = cmp


/***/ }),

/***/ 3466:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)
const parse = __nccwpck_require__(5925)
const { safeRe: re, t } = __nccwpck_require__(9523)

const coerce = (version, options) => {
  if (version instanceof SemVer) {
    return version
  }

  if (typeof version === 'number') {
    version = String(version)
  }

  if (typeof version !== 'string') {
    return null
  }

  options = options || {}

  let match = null
  if (!options.rtl) {
    match = version.match(re[t.COERCE])
  } else {
    // Find the right-most coercible string that does not share
    // a terminus with a more left-ward coercible string.
    // Eg, '1.2.3.4' wants to coerce '2.3.4', not '3.4' or '4'
    //
    // Walk through the string checking with a /g regexp
    // Manually set the index so as to pick up overlapping matches.
    // Stop when we get a match that ends at the string end, since no
    // coercible string can be more right-ward without the same terminus.
    let next
    while ((next = re[t.COERCERTL].exec(version)) &&
        (!match || match.index + match[0].length !== version.length)
    ) {
      if (!match ||
            next.index + next[0].length !== match.index + match[0].length) {
        match = next
      }
      re[t.COERCERTL].lastIndex = next.index + next[1].length + next[2].length
    }
    // leave it in a clean state
    re[t.COERCERTL].lastIndex = -1
  }

  if (match === null) {
    return null
  }

  return parse(`${match[2]}.${match[3] || '0'}.${match[4] || '0'}`, options)
}
module.exports = coerce


/***/ }),

/***/ 2156:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)
const compareBuild = (a, b, loose) => {
  const versionA = new SemVer(a, loose)
  const versionB = new SemVer(b, loose)
  return versionA.compare(versionB) || versionA.compareBuild(versionB)
}
module.exports = compareBuild


/***/ }),

/***/ 2804:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compare = __nccwpck_require__(4309)
const compareLoose = (a, b) => compare(a, b, true)
module.exports = compareLoose


/***/ }),

/***/ 4309:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)
const compare = (a, b, loose) =>
  new SemVer(a, loose).compare(new SemVer(b, loose))

module.exports = compare


/***/ }),

/***/ 4297:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const parse = __nccwpck_require__(5925)

const diff = (version1, version2) => {
  const v1 = parse(version1, null, true)
  const v2 = parse(version2, null, true)
  const comparison = v1.compare(v2)

  if (comparison === 0) {
    return null
  }

  const v1Higher = comparison > 0
  const highVersion = v1Higher ? v1 : v2
  const lowVersion = v1Higher ? v2 : v1
  const highHasPre = !!highVersion.prerelease.length
  const lowHasPre = !!lowVersion.prerelease.length

  if (lowHasPre && !highHasPre) {
    // Going from prerelease -> no prerelease requires some special casing

    // If the low version has only a major, then it will always be a major
    // Some examples:
    // 1.0.0-1 -> 1.0.0
    // 1.0.0-1 -> 1.1.1
    // 1.0.0-1 -> 2.0.0
    if (!lowVersion.patch && !lowVersion.minor) {
      return 'major'
    }

    // Otherwise it can be determined by checking the high version

    if (highVersion.patch) {
      // anything higher than a patch bump would result in the wrong version
      return 'patch'
    }

    if (highVersion.minor) {
      // anything higher than a minor bump would result in the wrong version
      return 'minor'
    }

    // bumping major/minor/patch all have same result
    return 'major'
  }

  // add the `pre` prefix if we are going to a prerelease version
  const prefix = highHasPre ? 'pre' : ''

  if (v1.major !== v2.major) {
    return prefix + 'major'
  }

  if (v1.minor !== v2.minor) {
    return prefix + 'minor'
  }

  if (v1.patch !== v2.patch) {
    return prefix + 'patch'
  }

  // high and low are preleases
  return 'prerelease'
}

module.exports = diff


/***/ }),

/***/ 1898:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compare = __nccwpck_require__(4309)
const eq = (a, b, loose) => compare(a, b, loose) === 0
module.exports = eq


/***/ }),

/***/ 4123:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compare = __nccwpck_require__(4309)
const gt = (a, b, loose) => compare(a, b, loose) > 0
module.exports = gt


/***/ }),

/***/ 5522:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compare = __nccwpck_require__(4309)
const gte = (a, b, loose) => compare(a, b, loose) >= 0
module.exports = gte


/***/ }),

/***/ 900:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)

const inc = (version, release, options, identifier, identifierBase) => {
  if (typeof (options) === 'string') {
    identifierBase = identifier
    identifier = options
    options = undefined
  }

  try {
    return new SemVer(
      version instanceof SemVer ? version.version : version,
      options
    ).inc(release, identifier, identifierBase).version
  } catch (er) {
    return null
  }
}
module.exports = inc


/***/ }),

/***/ 194:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compare = __nccwpck_require__(4309)
const lt = (a, b, loose) => compare(a, b, loose) < 0
module.exports = lt


/***/ }),

/***/ 7520:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compare = __nccwpck_require__(4309)
const lte = (a, b, loose) => compare(a, b, loose) <= 0
module.exports = lte


/***/ }),

/***/ 6688:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)
const major = (a, loose) => new SemVer(a, loose).major
module.exports = major


/***/ }),

/***/ 8447:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)
const minor = (a, loose) => new SemVer(a, loose).minor
module.exports = minor


/***/ }),

/***/ 6017:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compare = __nccwpck_require__(4309)
const neq = (a, b, loose) => compare(a, b, loose) !== 0
module.exports = neq


/***/ }),

/***/ 5925:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)
const parse = (version, options, throwErrors = false) => {
  if (version instanceof SemVer) {
    return version
  }
  try {
    return new SemVer(version, options)
  } catch (er) {
    if (!throwErrors) {
      return null
    }
    throw er
  }
}

module.exports = parse


/***/ }),

/***/ 2866:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)
const patch = (a, loose) => new SemVer(a, loose).patch
module.exports = patch


/***/ }),

/***/ 4016:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const parse = __nccwpck_require__(5925)
const prerelease = (version, options) => {
  const parsed = parse(version, options)
  return (parsed && parsed.prerelease.length) ? parsed.prerelease : null
}
module.exports = prerelease


/***/ }),

/***/ 6417:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compare = __nccwpck_require__(4309)
const rcompare = (a, b, loose) => compare(b, a, loose)
module.exports = rcompare


/***/ }),

/***/ 8701:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compareBuild = __nccwpck_require__(2156)
const rsort = (list, loose) => list.sort((a, b) => compareBuild(b, a, loose))
module.exports = rsort


/***/ }),

/***/ 6055:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const Range = __nccwpck_require__(9828)
const satisfies = (version, range, options) => {
  try {
    range = new Range(range, options)
  } catch (er) {
    return false
  }
  return range.test(version)
}
module.exports = satisfies


/***/ }),

/***/ 1426:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const compareBuild = __nccwpck_require__(2156)
const sort = (list, loose) => list.sort((a, b) => compareBuild(a, b, loose))
module.exports = sort


/***/ }),

/***/ 9601:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const parse = __nccwpck_require__(5925)
const valid = (version, options) => {
  const v = parse(version, options)
  return v ? v.version : null
}
module.exports = valid


/***/ }),

/***/ 1383:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// just pre-load all the stuff that index.js lazily exports
const internalRe = __nccwpck_require__(9523)
const constants = __nccwpck_require__(2293)
const SemVer = __nccwpck_require__(8088)
const identifiers = __nccwpck_require__(2463)
const parse = __nccwpck_require__(5925)
const valid = __nccwpck_require__(9601)
const clean = __nccwpck_require__(8848)
const inc = __nccwpck_require__(900)
const diff = __nccwpck_require__(4297)
const major = __nccwpck_require__(6688)
const minor = __nccwpck_require__(8447)
const patch = __nccwpck_require__(2866)
const prerelease = __nccwpck_require__(4016)
const compare = __nccwpck_require__(4309)
const rcompare = __nccwpck_require__(6417)
const compareLoose = __nccwpck_require__(2804)
const compareBuild = __nccwpck_require__(2156)
const sort = __nccwpck_require__(1426)
const rsort = __nccwpck_require__(8701)
const gt = __nccwpck_require__(4123)
const lt = __nccwpck_require__(194)
const eq = __nccwpck_require__(1898)
const neq = __nccwpck_require__(6017)
const gte = __nccwpck_require__(5522)
const lte = __nccwpck_require__(7520)
const cmp = __nccwpck_require__(5098)
const coerce = __nccwpck_require__(3466)
const Comparator = __nccwpck_require__(1532)
const Range = __nccwpck_require__(9828)
const satisfies = __nccwpck_require__(6055)
const toComparators = __nccwpck_require__(2706)
const maxSatisfying = __nccwpck_require__(579)
const minSatisfying = __nccwpck_require__(832)
const minVersion = __nccwpck_require__(4179)
const validRange = __nccwpck_require__(2098)
const outside = __nccwpck_require__(420)
const gtr = __nccwpck_require__(9380)
const ltr = __nccwpck_require__(3323)
const intersects = __nccwpck_require__(7008)
const simplifyRange = __nccwpck_require__(5297)
const subset = __nccwpck_require__(7863)
module.exports = {
  parse,
  valid,
  clean,
  inc,
  diff,
  major,
  minor,
  patch,
  prerelease,
  compare,
  rcompare,
  compareLoose,
  compareBuild,
  sort,
  rsort,
  gt,
  lt,
  eq,
  neq,
  gte,
  lte,
  cmp,
  coerce,
  Comparator,
  Range,
  satisfies,
  toComparators,
  maxSatisfying,
  minSatisfying,
  minVersion,
  validRange,
  outside,
  gtr,
  ltr,
  intersects,
  simplifyRange,
  subset,
  SemVer,
  re: internalRe.re,
  src: internalRe.src,
  tokens: internalRe.t,
  SEMVER_SPEC_VERSION: constants.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: constants.RELEASE_TYPES,
  compareIdentifiers: identifiers.compareIdentifiers,
  rcompareIdentifiers: identifiers.rcompareIdentifiers,
}


/***/ }),

/***/ 2293:
/***/ ((module) => {

// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.
const SEMVER_SPEC_VERSION = '2.0.0'

const MAX_LENGTH = 256
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER ||
/* istanbul ignore next */ 9007199254740991

// Max safe segment length for coercion.
const MAX_SAFE_COMPONENT_LENGTH = 16

// Max safe length for a build identifier. The max length minus 6 characters for
// the shortest version with a build 0.0.0+BUILD.
const MAX_SAFE_BUILD_LENGTH = MAX_LENGTH - 6

const RELEASE_TYPES = [
  'major',
  'premajor',
  'minor',
  'preminor',
  'patch',
  'prepatch',
  'prerelease',
]

module.exports = {
  MAX_LENGTH,
  MAX_SAFE_COMPONENT_LENGTH,
  MAX_SAFE_BUILD_LENGTH,
  MAX_SAFE_INTEGER,
  RELEASE_TYPES,
  SEMVER_SPEC_VERSION,
  FLAG_INCLUDE_PRERELEASE: 0b001,
  FLAG_LOOSE: 0b010,
}


/***/ }),

/***/ 427:
/***/ ((module) => {

const debug = (
  typeof process === 'object' &&
  process.env &&
  process.env.NODE_DEBUG &&
  /\bsemver\b/i.test(process.env.NODE_DEBUG)
) ? (...args) => console.error('SEMVER', ...args)
  : () => {}

module.exports = debug


/***/ }),

/***/ 2463:
/***/ ((module) => {

const numeric = /^[0-9]+$/
const compareIdentifiers = (a, b) => {
  const anum = numeric.test(a)
  const bnum = numeric.test(b)

  if (anum && bnum) {
    a = +a
    b = +b
  }

  return a === b ? 0
    : (anum && !bnum) ? -1
    : (bnum && !anum) ? 1
    : a < b ? -1
    : 1
}

const rcompareIdentifiers = (a, b) => compareIdentifiers(b, a)

module.exports = {
  compareIdentifiers,
  rcompareIdentifiers,
}


/***/ }),

/***/ 785:
/***/ ((module) => {

// parse out just the options we care about
const looseOption = Object.freeze({ loose: true })
const emptyOpts = Object.freeze({ })
const parseOptions = options => {
  if (!options) {
    return emptyOpts
  }

  if (typeof options !== 'object') {
    return looseOption
  }

  return options
}
module.exports = parseOptions


/***/ }),

/***/ 9523:
/***/ ((module, exports, __nccwpck_require__) => {

const {
  MAX_SAFE_COMPONENT_LENGTH,
  MAX_SAFE_BUILD_LENGTH,
  MAX_LENGTH,
} = __nccwpck_require__(2293)
const debug = __nccwpck_require__(427)
exports = module.exports = {}

// The actual regexps go on exports.re
const re = exports.re = []
const safeRe = exports.safeRe = []
const src = exports.src = []
const t = exports.t = {}
let R = 0

const LETTERDASHNUMBER = '[a-zA-Z0-9-]'

// Replace some greedy regex tokens to prevent regex dos issues. These regex are
// used internally via the safeRe object since all inputs in this library get
// normalized first to trim and collapse all extra whitespace. The original
// regexes are exported for userland consumption and lower level usage. A
// future breaking change could export the safer regex only with a note that
// all input should have extra whitespace removed.
const safeRegexReplacements = [
  ['\\s', 1],
  ['\\d', MAX_LENGTH],
  [LETTERDASHNUMBER, MAX_SAFE_BUILD_LENGTH],
]

const makeSafeRegex = (value) => {
  for (const [token, max] of safeRegexReplacements) {
    value = value
      .split(`${token}*`).join(`${token}{0,${max}}`)
      .split(`${token}+`).join(`${token}{1,${max}}`)
  }
  return value
}

const createToken = (name, value, isGlobal) => {
  const safe = makeSafeRegex(value)
  const index = R++
  debug(name, index, value)
  t[name] = index
  src[index] = value
  re[index] = new RegExp(value, isGlobal ? 'g' : undefined)
  safeRe[index] = new RegExp(safe, isGlobal ? 'g' : undefined)
}

// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.

// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.

createToken('NUMERICIDENTIFIER', '0|[1-9]\\d*')
createToken('NUMERICIDENTIFIERLOOSE', '\\d+')

// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.

createToken('NONNUMERICIDENTIFIER', `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`)

// ## Main Version
// Three dot-separated numeric identifiers.

createToken('MAINVERSION', `(${src[t.NUMERICIDENTIFIER]})\\.` +
                   `(${src[t.NUMERICIDENTIFIER]})\\.` +
                   `(${src[t.NUMERICIDENTIFIER]})`)

createToken('MAINVERSIONLOOSE', `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` +
                        `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` +
                        `(${src[t.NUMERICIDENTIFIERLOOSE]})`)

// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.

createToken('PRERELEASEIDENTIFIER', `(?:${src[t.NUMERICIDENTIFIER]
}|${src[t.NONNUMERICIDENTIFIER]})`)

createToken('PRERELEASEIDENTIFIERLOOSE', `(?:${src[t.NUMERICIDENTIFIERLOOSE]
}|${src[t.NONNUMERICIDENTIFIER]})`)

// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.

createToken('PRERELEASE', `(?:-(${src[t.PRERELEASEIDENTIFIER]
}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`)

createToken('PRERELEASELOOSE', `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]
}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`)

// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.

createToken('BUILDIDENTIFIER', `${LETTERDASHNUMBER}+`)

// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.

createToken('BUILD', `(?:\\+(${src[t.BUILDIDENTIFIER]
}(?:\\.${src[t.BUILDIDENTIFIER]})*))`)

// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.

// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.

createToken('FULLPLAIN', `v?${src[t.MAINVERSION]
}${src[t.PRERELEASE]}?${
  src[t.BUILD]}?`)

createToken('FULL', `^${src[t.FULLPLAIN]}$`)

// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
createToken('LOOSEPLAIN', `[v=\\s]*${src[t.MAINVERSIONLOOSE]
}${src[t.PRERELEASELOOSE]}?${
  src[t.BUILD]}?`)

createToken('LOOSE', `^${src[t.LOOSEPLAIN]}$`)

createToken('GTLT', '((?:<|>)?=?)')

// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifer, meaning "any version"
// Only the first item is strictly required.
createToken('XRANGEIDENTIFIERLOOSE', `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`)
createToken('XRANGEIDENTIFIER', `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`)

createToken('XRANGEPLAIN', `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})` +
                   `(?:\\.(${src[t.XRANGEIDENTIFIER]})` +
                   `(?:\\.(${src[t.XRANGEIDENTIFIER]})` +
                   `(?:${src[t.PRERELEASE]})?${
                     src[t.BUILD]}?` +
                   `)?)?`)

createToken('XRANGEPLAINLOOSE', `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                        `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                        `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` +
                        `(?:${src[t.PRERELEASELOOSE]})?${
                          src[t.BUILD]}?` +
                        `)?)?`)

createToken('XRANGE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`)
createToken('XRANGELOOSE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`)

// Coercion.
// Extract anything that could conceivably be a part of a valid semver
createToken('COERCE', `${'(^|[^\\d])' +
              '(\\d{1,'}${MAX_SAFE_COMPONENT_LENGTH}})` +
              `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` +
              `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` +
              `(?:$|[^\\d])`)
createToken('COERCERTL', src[t.COERCE], true)

// Tilde ranges.
// Meaning is "reasonably at or greater than"
createToken('LONETILDE', '(?:~>?)')

createToken('TILDETRIM', `(\\s*)${src[t.LONETILDE]}\\s+`, true)
exports.tildeTrimReplace = '$1~'

createToken('TILDE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`)
createToken('TILDELOOSE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`)

// Caret ranges.
// Meaning is "at least and backwards compatible with"
createToken('LONECARET', '(?:\\^)')

createToken('CARETTRIM', `(\\s*)${src[t.LONECARET]}\\s+`, true)
exports.caretTrimReplace = '$1^'

createToken('CARET', `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`)
createToken('CARETLOOSE', `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`)

// A simple gt/lt/eq thing, or just "" to indicate "any version"
createToken('COMPARATORLOOSE', `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`)
createToken('COMPARATOR', `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`)

// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
createToken('COMPARATORTRIM', `(\\s*)${src[t.GTLT]
}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true)
exports.comparatorTrimReplace = '$1$2$3'

// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.
createToken('HYPHENRANGE', `^\\s*(${src[t.XRANGEPLAIN]})` +
                   `\\s+-\\s+` +
                   `(${src[t.XRANGEPLAIN]})` +
                   `\\s*$`)

createToken('HYPHENRANGELOOSE', `^\\s*(${src[t.XRANGEPLAINLOOSE]})` +
                        `\\s+-\\s+` +
                        `(${src[t.XRANGEPLAINLOOSE]})` +
                        `\\s*$`)

// Star ranges basically just allow anything at all.
createToken('STAR', '(<|>)?=?\\s*\\*')
// >=0.0.0 is like a star
createToken('GTE0', '^\\s*>=\\s*0\\.0\\.0\\s*$')
createToken('GTE0PRE', '^\\s*>=\\s*0\\.0\\.0-0\\s*$')


/***/ }),

/***/ 1196:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


// A linked list to keep track of recently-used-ness
const Yallist = __nccwpck_require__(665)

const MAX = Symbol('max')
const LENGTH = Symbol('length')
const LENGTH_CALCULATOR = Symbol('lengthCalculator')
const ALLOW_STALE = Symbol('allowStale')
const MAX_AGE = Symbol('maxAge')
const DISPOSE = Symbol('dispose')
const NO_DISPOSE_ON_SET = Symbol('noDisposeOnSet')
const LRU_LIST = Symbol('lruList')
const CACHE = Symbol('cache')
const UPDATE_AGE_ON_GET = Symbol('updateAgeOnGet')

const naiveLength = () => 1

// lruList is a yallist where the head is the youngest
// item, and the tail is the oldest.  the list contains the Hit
// objects as the entries.
// Each Hit object has a reference to its Yallist.Node.  This
// never changes.
//
// cache is a Map (or PseudoMap) that matches the keys to
// the Yallist.Node object.
class LRUCache {
  constructor (options) {
    if (typeof options === 'number')
      options = { max: options }

    if (!options)
      options = {}

    if (options.max && (typeof options.max !== 'number' || options.max < 0))
      throw new TypeError('max must be a non-negative number')
    // Kind of weird to have a default max of Infinity, but oh well.
    const max = this[MAX] = options.max || Infinity

    const lc = options.length || naiveLength
    this[LENGTH_CALCULATOR] = (typeof lc !== 'function') ? naiveLength : lc
    this[ALLOW_STALE] = options.stale || false
    if (options.maxAge && typeof options.maxAge !== 'number')
      throw new TypeError('maxAge must be a number')
    this[MAX_AGE] = options.maxAge || 0
    this[DISPOSE] = options.dispose
    this[NO_DISPOSE_ON_SET] = options.noDisposeOnSet || false
    this[UPDATE_AGE_ON_GET] = options.updateAgeOnGet || false
    this.reset()
  }

  // resize the cache when the max changes.
  set max (mL) {
    if (typeof mL !== 'number' || mL < 0)
      throw new TypeError('max must be a non-negative number')

    this[MAX] = mL || Infinity
    trim(this)
  }
  get max () {
    return this[MAX]
  }

  set allowStale (allowStale) {
    this[ALLOW_STALE] = !!allowStale
  }
  get allowStale () {
    return this[ALLOW_STALE]
  }

  set maxAge (mA) {
    if (typeof mA !== 'number')
      throw new TypeError('maxAge must be a non-negative number')

    this[MAX_AGE] = mA
    trim(this)
  }
  get maxAge () {
    return this[MAX_AGE]
  }

  // resize the cache when the lengthCalculator changes.
  set lengthCalculator (lC) {
    if (typeof lC !== 'function')
      lC = naiveLength

    if (lC !== this[LENGTH_CALCULATOR]) {
      this[LENGTH_CALCULATOR] = lC
      this[LENGTH] = 0
      this[LRU_LIST].forEach(hit => {
        hit.length = this[LENGTH_CALCULATOR](hit.value, hit.key)
        this[LENGTH] += hit.length
      })
    }
    trim(this)
  }
  get lengthCalculator () { return this[LENGTH_CALCULATOR] }

  get length () { return this[LENGTH] }
  get itemCount () { return this[LRU_LIST].length }

  rforEach (fn, thisp) {
    thisp = thisp || this
    for (let walker = this[LRU_LIST].tail; walker !== null;) {
      const prev = walker.prev
      forEachStep(this, fn, walker, thisp)
      walker = prev
    }
  }

  forEach (fn, thisp) {
    thisp = thisp || this
    for (let walker = this[LRU_LIST].head; walker !== null;) {
      const next = walker.next
      forEachStep(this, fn, walker, thisp)
      walker = next
    }
  }

  keys () {
    return this[LRU_LIST].toArray().map(k => k.key)
  }

  values () {
    return this[LRU_LIST].toArray().map(k => k.value)
  }

  reset () {
    if (this[DISPOSE] &&
        this[LRU_LIST] &&
        this[LRU_LIST].length) {
      this[LRU_LIST].forEach(hit => this[DISPOSE](hit.key, hit.value))
    }

    this[CACHE] = new Map() // hash of items by key
    this[LRU_LIST] = new Yallist() // list of items in order of use recency
    this[LENGTH] = 0 // length of items in the list
  }

  dump () {
    return this[LRU_LIST].map(hit =>
      isStale(this, hit) ? false : {
        k: hit.key,
        v: hit.value,
        e: hit.now + (hit.maxAge || 0)
      }).toArray().filter(h => h)
  }

  dumpLru () {
    return this[LRU_LIST]
  }

  set (key, value, maxAge) {
    maxAge = maxAge || this[MAX_AGE]

    if (maxAge && typeof maxAge !== 'number')
      throw new TypeError('maxAge must be a number')

    const now = maxAge ? Date.now() : 0
    const len = this[LENGTH_CALCULATOR](value, key)

    if (this[CACHE].has(key)) {
      if (len > this[MAX]) {
        del(this, this[CACHE].get(key))
        return false
      }

      const node = this[CACHE].get(key)
      const item = node.value

      // dispose of the old one before overwriting
      // split out into 2 ifs for better coverage tracking
      if (this[DISPOSE]) {
        if (!this[NO_DISPOSE_ON_SET])
          this[DISPOSE](key, item.value)
      }

      item.now = now
      item.maxAge = maxAge
      item.value = value
      this[LENGTH] += len - item.length
      item.length = len
      this.get(key)
      trim(this)
      return true
    }

    const hit = new Entry(key, value, len, now, maxAge)

    // oversized objects fall out of cache automatically.
    if (hit.length > this[MAX]) {
      if (this[DISPOSE])
        this[DISPOSE](key, value)

      return false
    }

    this[LENGTH] += hit.length
    this[LRU_LIST].unshift(hit)
    this[CACHE].set(key, this[LRU_LIST].head)
    trim(this)
    return true
  }

  has (key) {
    if (!this[CACHE].has(key)) return false
    const hit = this[CACHE].get(key).value
    return !isStale(this, hit)
  }

  get (key) {
    return get(this, key, true)
  }

  peek (key) {
    return get(this, key, false)
  }

  pop () {
    const node = this[LRU_LIST].tail
    if (!node)
      return null

    del(this, node)
    return node.value
  }

  del (key) {
    del(this, this[CACHE].get(key))
  }

  load (arr) {
    // reset the cache
    this.reset()

    const now = Date.now()
    // A previous serialized cache has the most recent items first
    for (let l = arr.length - 1; l >= 0; l--) {
      const hit = arr[l]
      const expiresAt = hit.e || 0
      if (expiresAt === 0)
        // the item was created without expiration in a non aged cache
        this.set(hit.k, hit.v)
      else {
        const maxAge = expiresAt - now
        // dont add already expired items
        if (maxAge > 0) {
          this.set(hit.k, hit.v, maxAge)
        }
      }
    }
  }

  prune () {
    this[CACHE].forEach((value, key) => get(this, key, false))
  }
}

const get = (self, key, doUse) => {
  const node = self[CACHE].get(key)
  if (node) {
    const hit = node.value
    if (isStale(self, hit)) {
      del(self, node)
      if (!self[ALLOW_STALE])
        return undefined
    } else {
      if (doUse) {
        if (self[UPDATE_AGE_ON_GET])
          node.value.now = Date.now()
        self[LRU_LIST].unshiftNode(node)
      }
    }
    return hit.value
  }
}

const isStale = (self, hit) => {
  if (!hit || (!hit.maxAge && !self[MAX_AGE]))
    return false

  const diff = Date.now() - hit.now
  return hit.maxAge ? diff > hit.maxAge
    : self[MAX_AGE] && (diff > self[MAX_AGE])
}

const trim = self => {
  if (self[LENGTH] > self[MAX]) {
    for (let walker = self[LRU_LIST].tail;
      self[LENGTH] > self[MAX] && walker !== null;) {
      // We know that we're about to delete this one, and also
      // what the next least recently used key will be, so just
      // go ahead and set it now.
      const prev = walker.prev
      del(self, walker)
      walker = prev
    }
  }
}

const del = (self, node) => {
  if (node) {
    const hit = node.value
    if (self[DISPOSE])
      self[DISPOSE](hit.key, hit.value)

    self[LENGTH] -= hit.length
    self[CACHE].delete(hit.key)
    self[LRU_LIST].removeNode(node)
  }
}

class Entry {
  constructor (key, value, length, now, maxAge) {
    this.key = key
    this.value = value
    this.length = length
    this.now = now
    this.maxAge = maxAge || 0
  }
}

const forEachStep = (self, fn, node, thisp) => {
  let hit = node.value
  if (isStale(self, hit)) {
    del(self, node)
    if (!self[ALLOW_STALE])
      hit = undefined
  }
  if (hit)
    fn.call(thisp, hit.value, hit.key, self)
}

module.exports = LRUCache


/***/ }),

/***/ 9380:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// Determine if version is greater than all the versions possible in the range.
const outside = __nccwpck_require__(420)
const gtr = (version, range, options) => outside(version, range, '>', options)
module.exports = gtr


/***/ }),

/***/ 7008:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const Range = __nccwpck_require__(9828)
const intersects = (r1, r2, options) => {
  r1 = new Range(r1, options)
  r2 = new Range(r2, options)
  return r1.intersects(r2, options)
}
module.exports = intersects


/***/ }),

/***/ 3323:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const outside = __nccwpck_require__(420)
// Determine if version is less than all the versions possible in the range
const ltr = (version, range, options) => outside(version, range, '<', options)
module.exports = ltr


/***/ }),

/***/ 579:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)
const Range = __nccwpck_require__(9828)

const maxSatisfying = (versions, range, options) => {
  let max = null
  let maxSV = null
  let rangeObj = null
  try {
    rangeObj = new Range(range, options)
  } catch (er) {
    return null
  }
  versions.forEach((v) => {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!max || maxSV.compare(v) === -1) {
        // compare(max, v, true)
        max = v
        maxSV = new SemVer(max, options)
      }
    }
  })
  return max
}
module.exports = maxSatisfying


/***/ }),

/***/ 832:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)
const Range = __nccwpck_require__(9828)
const minSatisfying = (versions, range, options) => {
  let min = null
  let minSV = null
  let rangeObj = null
  try {
    rangeObj = new Range(range, options)
  } catch (er) {
    return null
  }
  versions.forEach((v) => {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!min || minSV.compare(v) === 1) {
        // compare(min, v, true)
        min = v
        minSV = new SemVer(min, options)
      }
    }
  })
  return min
}
module.exports = minSatisfying


/***/ }),

/***/ 4179:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)
const Range = __nccwpck_require__(9828)
const gt = __nccwpck_require__(4123)

const minVersion = (range, loose) => {
  range = new Range(range, loose)

  let minver = new SemVer('0.0.0')
  if (range.test(minver)) {
    return minver
  }

  minver = new SemVer('0.0.0-0')
  if (range.test(minver)) {
    return minver
  }

  minver = null
  for (let i = 0; i < range.set.length; ++i) {
    const comparators = range.set[i]

    let setMin = null
    comparators.forEach((comparator) => {
      // Clone to avoid manipulating the comparator's semver object.
      const compver = new SemVer(comparator.semver.version)
      switch (comparator.operator) {
        case '>':
          if (compver.prerelease.length === 0) {
            compver.patch++
          } else {
            compver.prerelease.push(0)
          }
          compver.raw = compver.format()
          /* fallthrough */
        case '':
        case '>=':
          if (!setMin || gt(compver, setMin)) {
            setMin = compver
          }
          break
        case '<':
        case '<=':
          /* Ignore maximum versions */
          break
        /* istanbul ignore next */
        default:
          throw new Error(`Unexpected operation: ${comparator.operator}`)
      }
    })
    if (setMin && (!minver || gt(minver, setMin))) {
      minver = setMin
    }
  }

  if (minver && range.test(minver)) {
    return minver
  }

  return null
}
module.exports = minVersion


/***/ }),

/***/ 420:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SemVer = __nccwpck_require__(8088)
const Comparator = __nccwpck_require__(1532)
const { ANY } = Comparator
const Range = __nccwpck_require__(9828)
const satisfies = __nccwpck_require__(6055)
const gt = __nccwpck_require__(4123)
const lt = __nccwpck_require__(194)
const lte = __nccwpck_require__(7520)
const gte = __nccwpck_require__(5522)

const outside = (version, range, hilo, options) => {
  version = new SemVer(version, options)
  range = new Range(range, options)

  let gtfn, ltefn, ltfn, comp, ecomp
  switch (hilo) {
    case '>':
      gtfn = gt
      ltefn = lte
      ltfn = lt
      comp = '>'
      ecomp = '>='
      break
    case '<':
      gtfn = lt
      ltefn = gte
      ltfn = gt
      comp = '<'
      ecomp = '<='
      break
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"')
  }

  // If it satisfies the range it is not outside
  if (satisfies(version, range, options)) {
    return false
  }

  // From now on, variable terms are as if we're in "gtr" mode.
  // but note that everything is flipped for the "ltr" function.

  for (let i = 0; i < range.set.length; ++i) {
    const comparators = range.set[i]

    let high = null
    let low = null

    comparators.forEach((comparator) => {
      if (comparator.semver === ANY) {
        comparator = new Comparator('>=0.0.0')
      }
      high = high || comparator
      low = low || comparator
      if (gtfn(comparator.semver, high.semver, options)) {
        high = comparator
      } else if (ltfn(comparator.semver, low.semver, options)) {
        low = comparator
      }
    })

    // If the edge version comparator has a operator then our version
    // isn't outside it
    if (high.operator === comp || high.operator === ecomp) {
      return false
    }

    // If the lowest version comparator has an operator and our version
    // is less than it then it isn't higher than the range
    if ((!low.operator || low.operator === comp) &&
        ltefn(version, low.semver)) {
      return false
    } else if (low.operator === ecomp && ltfn(version, low.semver)) {
      return false
    }
  }
  return true
}

module.exports = outside


/***/ }),

/***/ 5297:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// given a set of versions and a range, create a "simplified" range
// that includes the same versions that the original range does
// If the original range is shorter than the simplified one, return that.
const satisfies = __nccwpck_require__(6055)
const compare = __nccwpck_require__(4309)
module.exports = (versions, range, options) => {
  const set = []
  let first = null
  let prev = null
  const v = versions.sort((a, b) => compare(a, b, options))
  for (const version of v) {
    const included = satisfies(version, range, options)
    if (included) {
      prev = version
      if (!first) {
        first = version
      }
    } else {
      if (prev) {
        set.push([first, prev])
      }
      prev = null
      first = null
    }
  }
  if (first) {
    set.push([first, null])
  }

  const ranges = []
  for (const [min, max] of set) {
    if (min === max) {
      ranges.push(min)
    } else if (!max && min === v[0]) {
      ranges.push('*')
    } else if (!max) {
      ranges.push(`>=${min}`)
    } else if (min === v[0]) {
      ranges.push(`<=${max}`)
    } else {
      ranges.push(`${min} - ${max}`)
    }
  }
  const simplified = ranges.join(' || ')
  const original = typeof range.raw === 'string' ? range.raw : String(range)
  return simplified.length < original.length ? simplified : range
}


/***/ }),

/***/ 7863:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const Range = __nccwpck_require__(9828)
const Comparator = __nccwpck_require__(1532)
const { ANY } = Comparator
const satisfies = __nccwpck_require__(6055)
const compare = __nccwpck_require__(4309)

// Complex range `r1 || r2 || ...` is a subset of `R1 || R2 || ...` iff:
// - Every simple range `r1, r2, ...` is a null set, OR
// - Every simple range `r1, r2, ...` which is not a null set is a subset of
//   some `R1, R2, ...`
//
// Simple range `c1 c2 ...` is a subset of simple range `C1 C2 ...` iff:
// - If c is only the ANY comparator
//   - If C is only the ANY comparator, return true
//   - Else if in prerelease mode, return false
//   - else replace c with `[>=0.0.0]`
// - If C is only the ANY comparator
//   - if in prerelease mode, return true
//   - else replace C with `[>=0.0.0]`
// - Let EQ be the set of = comparators in c
// - If EQ is more than one, return true (null set)
// - Let GT be the highest > or >= comparator in c
// - Let LT be the lowest < or <= comparator in c
// - If GT and LT, and GT.semver > LT.semver, return true (null set)
// - If any C is a = range, and GT or LT are set, return false
// - If EQ
//   - If GT, and EQ does not satisfy GT, return true (null set)
//   - If LT, and EQ does not satisfy LT, return true (null set)
//   - If EQ satisfies every C, return true
//   - Else return false
// - If GT
//   - If GT.semver is lower than any > or >= comp in C, return false
//   - If GT is >=, and GT.semver does not satisfy every C, return false
//   - If GT.semver has a prerelease, and not in prerelease mode
//     - If no C has a prerelease and the GT.semver tuple, return false
// - If LT
//   - If LT.semver is greater than any < or <= comp in C, return false
//   - If LT is <=, and LT.semver does not satisfy every C, return false
//   - If GT.semver has a prerelease, and not in prerelease mode
//     - If no C has a prerelease and the LT.semver tuple, return false
// - Else return true

const subset = (sub, dom, options = {}) => {
  if (sub === dom) {
    return true
  }

  sub = new Range(sub, options)
  dom = new Range(dom, options)
  let sawNonNull = false

  OUTER: for (const simpleSub of sub.set) {
    for (const simpleDom of dom.set) {
      const isSub = simpleSubset(simpleSub, simpleDom, options)
      sawNonNull = sawNonNull || isSub !== null
      if (isSub) {
        continue OUTER
      }
    }
    // the null set is a subset of everything, but null simple ranges in
    // a complex range should be ignored.  so if we saw a non-null range,
    // then we know this isn't a subset, but if EVERY simple range was null,
    // then it is a subset.
    if (sawNonNull) {
      return false
    }
  }
  return true
}

const minimumVersionWithPreRelease = [new Comparator('>=0.0.0-0')]
const minimumVersion = [new Comparator('>=0.0.0')]

const simpleSubset = (sub, dom, options) => {
  if (sub === dom) {
    return true
  }

  if (sub.length === 1 && sub[0].semver === ANY) {
    if (dom.length === 1 && dom[0].semver === ANY) {
      return true
    } else if (options.includePrerelease) {
      sub = minimumVersionWithPreRelease
    } else {
      sub = minimumVersion
    }
  }

  if (dom.length === 1 && dom[0].semver === ANY) {
    if (options.includePrerelease) {
      return true
    } else {
      dom = minimumVersion
    }
  }

  const eqSet = new Set()
  let gt, lt
  for (const c of sub) {
    if (c.operator === '>' || c.operator === '>=') {
      gt = higherGT(gt, c, options)
    } else if (c.operator === '<' || c.operator === '<=') {
      lt = lowerLT(lt, c, options)
    } else {
      eqSet.add(c.semver)
    }
  }

  if (eqSet.size > 1) {
    return null
  }

  let gtltComp
  if (gt && lt) {
    gtltComp = compare(gt.semver, lt.semver, options)
    if (gtltComp > 0) {
      return null
    } else if (gtltComp === 0 && (gt.operator !== '>=' || lt.operator !== '<=')) {
      return null
    }
  }

  // will iterate one or zero times
  for (const eq of eqSet) {
    if (gt && !satisfies(eq, String(gt), options)) {
      return null
    }

    if (lt && !satisfies(eq, String(lt), options)) {
      return null
    }

    for (const c of dom) {
      if (!satisfies(eq, String(c), options)) {
        return false
      }
    }

    return true
  }

  let higher, lower
  let hasDomLT, hasDomGT
  // if the subset has a prerelease, we need a comparator in the superset
  // with the same tuple and a prerelease, or it's not a subset
  let needDomLTPre = lt &&
    !options.includePrerelease &&
    lt.semver.prerelease.length ? lt.semver : false
  let needDomGTPre = gt &&
    !options.includePrerelease &&
    gt.semver.prerelease.length ? gt.semver : false
  // exception: <1.2.3-0 is the same as <1.2.3
  if (needDomLTPre && needDomLTPre.prerelease.length === 1 &&
      lt.operator === '<' && needDomLTPre.prerelease[0] === 0) {
    needDomLTPre = false
  }

  for (const c of dom) {
    hasDomGT = hasDomGT || c.operator === '>' || c.operator === '>='
    hasDomLT = hasDomLT || c.operator === '<' || c.operator === '<='
    if (gt) {
      if (needDomGTPre) {
        if (c.semver.prerelease && c.semver.prerelease.length &&
            c.semver.major === needDomGTPre.major &&
            c.semver.minor === needDomGTPre.minor &&
            c.semver.patch === needDomGTPre.patch) {
          needDomGTPre = false
        }
      }
      if (c.operator === '>' || c.operator === '>=') {
        higher = higherGT(gt, c, options)
        if (higher === c && higher !== gt) {
          return false
        }
      } else if (gt.operator === '>=' && !satisfies(gt.semver, String(c), options)) {
        return false
      }
    }
    if (lt) {
      if (needDomLTPre) {
        if (c.semver.prerelease && c.semver.prerelease.length &&
            c.semver.major === needDomLTPre.major &&
            c.semver.minor === needDomLTPre.minor &&
            c.semver.patch === needDomLTPre.patch) {
          needDomLTPre = false
        }
      }
      if (c.operator === '<' || c.operator === '<=') {
        lower = lowerLT(lt, c, options)
        if (lower === c && lower !== lt) {
          return false
        }
      } else if (lt.operator === '<=' && !satisfies(lt.semver, String(c), options)) {
        return false
      }
    }
    if (!c.operator && (lt || gt) && gtltComp !== 0) {
      return false
    }
  }

  // if there was a < or >, and nothing in the dom, then must be false
  // UNLESS it was limited by another range in the other direction.
  // Eg, >1.0.0 <1.0.1 is still a subset of <2.0.0
  if (gt && hasDomLT && !lt && gtltComp !== 0) {
    return false
  }

  if (lt && hasDomGT && !gt && gtltComp !== 0) {
    return false
  }

  // we needed a prerelease range in a specific tuple, but didn't get one
  // then this isn't a subset.  eg >=1.2.3-pre is not a subset of >=1.0.0,
  // because it includes prereleases in the 1.2.3 tuple
  if (needDomGTPre || needDomLTPre) {
    return false
  }

  return true
}

// >=1.2.3 is lower than >1.2.3
const higherGT = (a, b, options) => {
  if (!a) {
    return b
  }
  const comp = compare(a.semver, b.semver, options)
  return comp > 0 ? a
    : comp < 0 ? b
    : b.operator === '>' && a.operator === '>=' ? b
    : a
}

// <=1.2.3 is higher than <1.2.3
const lowerLT = (a, b, options) => {
  if (!a) {
    return b
  }
  const comp = compare(a.semver, b.semver, options)
  return comp < 0 ? a
    : comp > 0 ? b
    : b.operator === '<' && a.operator === '<=' ? b
    : a
}

module.exports = subset


/***/ }),

/***/ 2706:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const Range = __nccwpck_require__(9828)

// Mostly just for testing and legacy API reasons
const toComparators = (range, options) =>
  new Range(range, options).set
    .map(comp => comp.map(c => c.value).join(' ').trim().split(' '))

module.exports = toComparators


/***/ }),

/***/ 2098:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const Range = __nccwpck_require__(9828)
const validRange = (range, options) => {
  try {
    // Return '*' instead of '' so that truthiness works.
    // This will throw if it's invalid anyway
    return new Range(range, options).range || '*'
  } catch (er) {
    return null
  }
}
module.exports = validRange


/***/ }),

/***/ 7032:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const shebangRegex = __nccwpck_require__(2638);

module.exports = (string = '') => {
	const match = string.match(shebangRegex);

	if (!match) {
		return null;
	}

	const [path, argument] = match[0].replace(/#! ?/, '').split(' ');
	const binary = path.split('/').pop();

	if (binary === 'env') {
		return argument;
	}

	return argument ? `${binary} ${argument}` : binary;
};


/***/ }),

/***/ 2638:
/***/ ((module) => {

"use strict";

module.exports = /^#!(.*)/;


/***/ }),

/***/ 4931:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// Note: since nyc uses this module to output coverage, any lines
// that are in the direct sync flow of nyc's outputCoverage are
// ignored, since we can never get coverage for them.
// grab a reference to node's real process object right away
var process = global.process

const processOk = function (process) {
  return process &&
    typeof process === 'object' &&
    typeof process.removeListener === 'function' &&
    typeof process.emit === 'function' &&
    typeof process.reallyExit === 'function' &&
    typeof process.listeners === 'function' &&
    typeof process.kill === 'function' &&
    typeof process.pid === 'number' &&
    typeof process.on === 'function'
}

// some kind of non-node environment, just no-op
/* istanbul ignore if */
if (!processOk(process)) {
  module.exports = function () {
    return function () {}
  }
} else {
  var assert = __nccwpck_require__(9491)
  var signals = __nccwpck_require__(3710)
  var isWin = /^win/i.test(process.platform)

  var EE = __nccwpck_require__(2361)
  /* istanbul ignore if */
  if (typeof EE !== 'function') {
    EE = EE.EventEmitter
  }

  var emitter
  if (process.__signal_exit_emitter__) {
    emitter = process.__signal_exit_emitter__
  } else {
    emitter = process.__signal_exit_emitter__ = new EE()
    emitter.count = 0
    emitter.emitted = {}
  }

  // Because this emitter is a global, we have to check to see if a
  // previous version of this library failed to enable infinite listeners.
  // I know what you're about to say.  But literally everything about
  // signal-exit is a compromise with evil.  Get used to it.
  if (!emitter.infinite) {
    emitter.setMaxListeners(Infinity)
    emitter.infinite = true
  }

  module.exports = function (cb, opts) {
    /* istanbul ignore if */
    if (!processOk(global.process)) {
      return function () {}
    }
    assert.equal(typeof cb, 'function', 'a callback must be provided for exit handler')

    if (loaded === false) {
      load()
    }

    var ev = 'exit'
    if (opts && opts.alwaysLast) {
      ev = 'afterexit'
    }

    var remove = function () {
      emitter.removeListener(ev, cb)
      if (emitter.listeners('exit').length === 0 &&
          emitter.listeners('afterexit').length === 0) {
        unload()
      }
    }
    emitter.on(ev, cb)

    return remove
  }

  var unload = function unload () {
    if (!loaded || !processOk(global.process)) {
      return
    }
    loaded = false

    signals.forEach(function (sig) {
      try {
        process.removeListener(sig, sigListeners[sig])
      } catch (er) {}
    })
    process.emit = originalProcessEmit
    process.reallyExit = originalProcessReallyExit
    emitter.count -= 1
  }
  module.exports.unload = unload

  var emit = function emit (event, code, signal) {
    /* istanbul ignore if */
    if (emitter.emitted[event]) {
      return
    }
    emitter.emitted[event] = true
    emitter.emit(event, code, signal)
  }

  // { <signal>: <listener fn>, ... }
  var sigListeners = {}
  signals.forEach(function (sig) {
    sigListeners[sig] = function listener () {
      /* istanbul ignore if */
      if (!processOk(global.process)) {
        return
      }
      // If there are no other listeners, an exit is coming!
      // Simplest way: remove us and then re-send the signal.
      // We know that this will kill the process, so we can
      // safely emit now.
      var listeners = process.listeners(sig)
      if (listeners.length === emitter.count) {
        unload()
        emit('exit', null, sig)
        /* istanbul ignore next */
        emit('afterexit', null, sig)
        /* istanbul ignore next */
        if (isWin && sig === 'SIGHUP') {
          // "SIGHUP" throws an `ENOSYS` error on Windows,
          // so use a supported signal instead
          sig = 'SIGINT'
        }
        /* istanbul ignore next */
        process.kill(process.pid, sig)
      }
    }
  })

  module.exports.signals = function () {
    return signals
  }

  var loaded = false

  var load = function load () {
    if (loaded || !processOk(global.process)) {
      return
    }
    loaded = true

    // This is the number of onSignalExit's that are in play.
    // It's important so that we can count the correct number of
    // listeners on signals, and don't wait for the other one to
    // handle it instead of us.
    emitter.count += 1

    signals = signals.filter(function (sig) {
      try {
        process.on(sig, sigListeners[sig])
        return true
      } catch (er) {
        return false
      }
    })

    process.emit = processEmit
    process.reallyExit = processReallyExit
  }
  module.exports.load = load

  var originalProcessReallyExit = process.reallyExit
  var processReallyExit = function processReallyExit (code) {
    /* istanbul ignore if */
    if (!processOk(global.process)) {
      return
    }
    process.exitCode = code || /* istanbul ignore next */ 0
    emit('exit', process.exitCode, null)
    /* istanbul ignore next */
    emit('afterexit', process.exitCode, null)
    /* istanbul ignore next */
    originalProcessReallyExit.call(process, process.exitCode)
  }

  var originalProcessEmit = process.emit
  var processEmit = function processEmit (ev, arg) {
    if (ev === 'exit' && processOk(global.process)) {
      /* istanbul ignore else */
      if (arg !== undefined) {
        process.exitCode = arg
      }
      var ret = originalProcessEmit.apply(this, arguments)
      /* istanbul ignore next */
      emit('exit', process.exitCode, null)
      /* istanbul ignore next */
      emit('afterexit', process.exitCode, null)
      /* istanbul ignore next */
      return ret
    } else {
      return originalProcessEmit.apply(this, arguments)
    }
  }
}


/***/ }),

/***/ 3710:
/***/ ((module) => {

// This is not the set of all possible signals.
//
// It IS, however, the set of all signals that trigger
// an exit on either Linux or BSD systems.  Linux is a
// superset of the signal names supported on BSD, and
// the unknown signals just fail to register, so we can
// catch that easily enough.
//
// Don't bother with SIGKILL.  It's uncatchable, which
// means that we can't fire any callbacks anyway.
//
// If a user does happen to register a handler on a non-
// fatal signal like SIGWINCH or something, and then
// exit, it'll end up firing `process.emit('exit')`, so
// the handler will be fired anyway.
//
// SIGBUS, SIGFPE, SIGSEGV and SIGILL, when not raised
// artificially, inherently leave the process in a
// state from which it is not safe to try and enter JS
// listeners.
module.exports = [
  'SIGABRT',
  'SIGALRM',
  'SIGHUP',
  'SIGINT',
  'SIGTERM'
]

if (process.platform !== 'win32') {
  module.exports.push(
    'SIGVTALRM',
    'SIGXCPU',
    'SIGXFSZ',
    'SIGUSR2',
    'SIGTRAP',
    'SIGSYS',
    'SIGQUIT',
    'SIGIOT'
    // should detect profiler and enable/disable accordingly.
    // see #21
    // 'SIGPROF'
  )
}

if (process.platform === 'linux') {
  module.exports.push(
    'SIGIO',
    'SIGPOLL',
    'SIGPWR',
    'SIGSTKFLT',
    'SIGUNUSED'
  )
}


/***/ }),

/***/ 8174:
/***/ ((module) => {

"use strict";


module.exports = input => {
	const LF = typeof input === 'string' ? '\n' : '\n'.charCodeAt();
	const CR = typeof input === 'string' ? '\r' : '\r'.charCodeAt();

	if (input[input.length - 1] === LF) {
		input = input.slice(0, input.length - 1);
	}

	if (input[input.length - 1] === CR) {
		input = input.slice(0, input.length - 1);
	}

	return input;
};


/***/ }),

/***/ 4294:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(4219);


/***/ }),

/***/ 4219:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var net = __nccwpck_require__(1808);
var tls = __nccwpck_require__(4404);
var http = __nccwpck_require__(3685);
var https = __nccwpck_require__(5687);
var events = __nccwpck_require__(2361);
var assert = __nccwpck_require__(9491);
var util = __nccwpck_require__(3837);


exports.httpOverHttp = httpOverHttp;
exports.httpsOverHttp = httpsOverHttp;
exports.httpOverHttps = httpOverHttps;
exports.httpsOverHttps = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  }
} else {
  debug = function() {};
}
exports.debug = debug; // for test


/***/ }),

/***/ 5030:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

function getUserAgent() {
  if (typeof navigator === "object" && "userAgent" in navigator) {
    return navigator.userAgent;
  }

  if (typeof process === "object" && process.version !== undefined) {
    return `Node.js/${process.version.substr(1)} (${process.platform}; ${process.arch})`;
  }

  return "<environment undetectable>";
}

exports.getUserAgent = getUserAgent;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 5840:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "v1", ({
  enumerable: true,
  get: function () {
    return _v.default;
  }
}));
Object.defineProperty(exports, "v3", ({
  enumerable: true,
  get: function () {
    return _v2.default;
  }
}));
Object.defineProperty(exports, "v4", ({
  enumerable: true,
  get: function () {
    return _v3.default;
  }
}));
Object.defineProperty(exports, "v5", ({
  enumerable: true,
  get: function () {
    return _v4.default;
  }
}));
Object.defineProperty(exports, "NIL", ({
  enumerable: true,
  get: function () {
    return _nil.default;
  }
}));
Object.defineProperty(exports, "version", ({
  enumerable: true,
  get: function () {
    return _version.default;
  }
}));
Object.defineProperty(exports, "validate", ({
  enumerable: true,
  get: function () {
    return _validate.default;
  }
}));
Object.defineProperty(exports, "stringify", ({
  enumerable: true,
  get: function () {
    return _stringify.default;
  }
}));
Object.defineProperty(exports, "parse", ({
  enumerable: true,
  get: function () {
    return _parse.default;
  }
}));

var _v = _interopRequireDefault(__nccwpck_require__(8628));

var _v2 = _interopRequireDefault(__nccwpck_require__(6409));

var _v3 = _interopRequireDefault(__nccwpck_require__(5122));

var _v4 = _interopRequireDefault(__nccwpck_require__(9120));

var _nil = _interopRequireDefault(__nccwpck_require__(5332));

var _version = _interopRequireDefault(__nccwpck_require__(1595));

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

var _parse = _interopRequireDefault(__nccwpck_require__(2746));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),

/***/ 4569:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function md5(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('md5').update(bytes).digest();
}

var _default = md5;
exports["default"] = _default;

/***/ }),

/***/ 5332:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = '00000000-0000-0000-0000-000000000000';
exports["default"] = _default;

/***/ }),

/***/ 2746:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parse(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  let v;
  const arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

var _default = parse;
exports["default"] = _default;

/***/ }),

/***/ 814:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
exports["default"] = _default;

/***/ }),

/***/ 807:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = rng;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate

let poolPtr = rnds8Pool.length;

function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    _crypto.default.randomFillSync(rnds8Pool);

    poolPtr = 0;
  }

  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

/***/ }),

/***/ 5274:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sha1(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('sha1').update(bytes).digest();
}

var _default = sha1;
exports["default"] = _default;

/***/ }),

/***/ 8950:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

var _default = stringify;
exports["default"] = _default;

/***/ }),

/***/ 8628:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(807));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html
let _nodeId;

let _clockseq; // Previous uuid creation time


let _lastMSecs = 0;
let _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  let i = buf && offset || 0;
  const b = buf || new Array(16);
  options = options || {};
  let node = options.node || _nodeId;
  let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    const seedBytes = options.random || (options.rng || _rng.default)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (let n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || (0, _stringify.default)(b);
}

var _default = v1;
exports["default"] = _default;

/***/ }),

/***/ 6409:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(5998));

var _md = _interopRequireDefault(__nccwpck_require__(4569));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v3 = (0, _v.default)('v3', 0x30, _md.default);
var _default = v3;
exports["default"] = _default;

/***/ }),

/***/ 5998:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = _default;
exports.URL = exports.DNS = void 0;

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

var _parse = _interopRequireDefault(__nccwpck_require__(2746));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  const bytes = [];

  for (let i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
exports.DNS = DNS;
const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
exports.URL = URL;

function _default(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = (0, _parse.default)(namespace);
    }

    if (namespace.length !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    let bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return (0, _stringify.default)(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}

/***/ }),

/***/ 5122:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(807));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function v4(options, buf, offset) {
  options = options || {};

  const rnds = options.random || (options.rng || _rng.default)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`


  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0, _stringify.default)(rnds);
}

var _default = v4;
exports["default"] = _default;

/***/ }),

/***/ 9120:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(5998));

var _sha = _interopRequireDefault(__nccwpck_require__(5274));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v5 = (0, _v.default)('v5', 0x50, _sha.default);
var _default = v5;
exports["default"] = _default;

/***/ }),

/***/ 6900:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _regex = _interopRequireDefault(__nccwpck_require__(814));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validate(uuid) {
  return typeof uuid === 'string' && _regex.default.test(uuid);
}

var _default = validate;
exports["default"] = _default;

/***/ }),

/***/ 1595:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function version(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.substr(14, 1), 16);
}

var _default = version;
exports["default"] = _default;

/***/ }),

/***/ 4207:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const isWindows = process.platform === 'win32' ||
    process.env.OSTYPE === 'cygwin' ||
    process.env.OSTYPE === 'msys'

const path = __nccwpck_require__(1017)
const COLON = isWindows ? ';' : ':'
const isexe = __nccwpck_require__(7126)

const getNotFoundError = (cmd) =>
  Object.assign(new Error(`not found: ${cmd}`), { code: 'ENOENT' })

const getPathInfo = (cmd, opt) => {
  const colon = opt.colon || COLON

  // If it has a slash, then we don't bother searching the pathenv.
  // just check the file itself, and that's it.
  const pathEnv = cmd.match(/\//) || isWindows && cmd.match(/\\/) ? ['']
    : (
      [
        // windows always checks the cwd first
        ...(isWindows ? [process.cwd()] : []),
        ...(opt.path || process.env.PATH ||
          /* istanbul ignore next: very unusual */ '').split(colon),
      ]
    )
  const pathExtExe = isWindows
    ? opt.pathExt || process.env.PATHEXT || '.EXE;.CMD;.BAT;.COM'
    : ''
  const pathExt = isWindows ? pathExtExe.split(colon) : ['']

  if (isWindows) {
    if (cmd.indexOf('.') !== -1 && pathExt[0] !== '')
      pathExt.unshift('')
  }

  return {
    pathEnv,
    pathExt,
    pathExtExe,
  }
}

const which = (cmd, opt, cb) => {
  if (typeof opt === 'function') {
    cb = opt
    opt = {}
  }
  if (!opt)
    opt = {}

  const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt)
  const found = []

  const step = i => new Promise((resolve, reject) => {
    if (i === pathEnv.length)
      return opt.all && found.length ? resolve(found)
        : reject(getNotFoundError(cmd))

    const ppRaw = pathEnv[i]
    const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw

    const pCmd = path.join(pathPart, cmd)
    const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd
      : pCmd

    resolve(subStep(p, i, 0))
  })

  const subStep = (p, i, ii) => new Promise((resolve, reject) => {
    if (ii === pathExt.length)
      return resolve(step(i + 1))
    const ext = pathExt[ii]
    isexe(p + ext, { pathExt: pathExtExe }, (er, is) => {
      if (!er && is) {
        if (opt.all)
          found.push(p + ext)
        else
          return resolve(p + ext)
      }
      return resolve(subStep(p, i, ii + 1))
    })
  })

  return cb ? step(0).then(res => cb(null, res), cb) : step(0)
}

const whichSync = (cmd, opt) => {
  opt = opt || {}

  const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt)
  const found = []

  for (let i = 0; i < pathEnv.length; i ++) {
    const ppRaw = pathEnv[i]
    const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw

    const pCmd = path.join(pathPart, cmd)
    const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd
      : pCmd

    for (let j = 0; j < pathExt.length; j ++) {
      const cur = p + pathExt[j]
      try {
        const is = isexe.sync(cur, { pathExt: pathExtExe })
        if (is) {
          if (opt.all)
            found.push(cur)
          else
            return cur
        }
      } catch (ex) {}
    }
  }

  if (opt.all && found.length)
    return found

  if (opt.nothrow)
    return null

  throw getNotFoundError(cmd)
}

module.exports = which
which.sync = whichSync


/***/ }),

/***/ 2940:
/***/ ((module) => {

// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
module.exports = wrappy
function wrappy (fn, cb) {
  if (fn && cb) return wrappy(fn)(cb)

  if (typeof fn !== 'function')
    throw new TypeError('need wrapper function')

  Object.keys(fn).forEach(function (k) {
    wrapper[k] = fn[k]
  })

  return wrapper

  function wrapper() {
    var args = new Array(arguments.length)
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i]
    }
    var ret = fn.apply(this, args)
    var cb = args[args.length-1]
    if (typeof ret === 'function' && ret !== cb) {
      Object.keys(cb).forEach(function (k) {
        ret[k] = cb[k]
      })
    }
    return ret
  }
}


/***/ }),

/***/ 4091:
/***/ ((module) => {

"use strict";

module.exports = function (Yallist) {
  Yallist.prototype[Symbol.iterator] = function* () {
    for (let walker = this.head; walker; walker = walker.next) {
      yield walker.value
    }
  }
}


/***/ }),

/***/ 665:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

module.exports = Yallist

Yallist.Node = Node
Yallist.create = Yallist

function Yallist (list) {
  var self = this
  if (!(self instanceof Yallist)) {
    self = new Yallist()
  }

  self.tail = null
  self.head = null
  self.length = 0

  if (list && typeof list.forEach === 'function') {
    list.forEach(function (item) {
      self.push(item)
    })
  } else if (arguments.length > 0) {
    for (var i = 0, l = arguments.length; i < l; i++) {
      self.push(arguments[i])
    }
  }

  return self
}

Yallist.prototype.removeNode = function (node) {
  if (node.list !== this) {
    throw new Error('removing node which does not belong to this list')
  }

  var next = node.next
  var prev = node.prev

  if (next) {
    next.prev = prev
  }

  if (prev) {
    prev.next = next
  }

  if (node === this.head) {
    this.head = next
  }
  if (node === this.tail) {
    this.tail = prev
  }

  node.list.length--
  node.next = null
  node.prev = null
  node.list = null

  return next
}

Yallist.prototype.unshiftNode = function (node) {
  if (node === this.head) {
    return
  }

  if (node.list) {
    node.list.removeNode(node)
  }

  var head = this.head
  node.list = this
  node.next = head
  if (head) {
    head.prev = node
  }

  this.head = node
  if (!this.tail) {
    this.tail = node
  }
  this.length++
}

Yallist.prototype.pushNode = function (node) {
  if (node === this.tail) {
    return
  }

  if (node.list) {
    node.list.removeNode(node)
  }

  var tail = this.tail
  node.list = this
  node.prev = tail
  if (tail) {
    tail.next = node
  }

  this.tail = node
  if (!this.head) {
    this.head = node
  }
  this.length++
}

Yallist.prototype.push = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    push(this, arguments[i])
  }
  return this.length
}

Yallist.prototype.unshift = function () {
  for (var i = 0, l = arguments.length; i < l; i++) {
    unshift(this, arguments[i])
  }
  return this.length
}

Yallist.prototype.pop = function () {
  if (!this.tail) {
    return undefined
  }

  var res = this.tail.value
  this.tail = this.tail.prev
  if (this.tail) {
    this.tail.next = null
  } else {
    this.head = null
  }
  this.length--
  return res
}

Yallist.prototype.shift = function () {
  if (!this.head) {
    return undefined
  }

  var res = this.head.value
  this.head = this.head.next
  if (this.head) {
    this.head.prev = null
  } else {
    this.tail = null
  }
  this.length--
  return res
}

Yallist.prototype.forEach = function (fn, thisp) {
  thisp = thisp || this
  for (var walker = this.head, i = 0; walker !== null; i++) {
    fn.call(thisp, walker.value, i, this)
    walker = walker.next
  }
}

Yallist.prototype.forEachReverse = function (fn, thisp) {
  thisp = thisp || this
  for (var walker = this.tail, i = this.length - 1; walker !== null; i--) {
    fn.call(thisp, walker.value, i, this)
    walker = walker.prev
  }
}

Yallist.prototype.get = function (n) {
  for (var i = 0, walker = this.head; walker !== null && i < n; i++) {
    // abort out of the list early if we hit a cycle
    walker = walker.next
  }
  if (i === n && walker !== null) {
    return walker.value
  }
}

Yallist.prototype.getReverse = function (n) {
  for (var i = 0, walker = this.tail; walker !== null && i < n; i++) {
    // abort out of the list early if we hit a cycle
    walker = walker.prev
  }
  if (i === n && walker !== null) {
    return walker.value
  }
}

Yallist.prototype.map = function (fn, thisp) {
  thisp = thisp || this
  var res = new Yallist()
  for (var walker = this.head; walker !== null;) {
    res.push(fn.call(thisp, walker.value, this))
    walker = walker.next
  }
  return res
}

Yallist.prototype.mapReverse = function (fn, thisp) {
  thisp = thisp || this
  var res = new Yallist()
  for (var walker = this.tail; walker !== null;) {
    res.push(fn.call(thisp, walker.value, this))
    walker = walker.prev
  }
  return res
}

Yallist.prototype.reduce = function (fn, initial) {
  var acc
  var walker = this.head
  if (arguments.length > 1) {
    acc = initial
  } else if (this.head) {
    walker = this.head.next
    acc = this.head.value
  } else {
    throw new TypeError('Reduce of empty list with no initial value')
  }

  for (var i = 0; walker !== null; i++) {
    acc = fn(acc, walker.value, i)
    walker = walker.next
  }

  return acc
}

Yallist.prototype.reduceReverse = function (fn, initial) {
  var acc
  var walker = this.tail
  if (arguments.length > 1) {
    acc = initial
  } else if (this.tail) {
    walker = this.tail.prev
    acc = this.tail.value
  } else {
    throw new TypeError('Reduce of empty list with no initial value')
  }

  for (var i = this.length - 1; walker !== null; i--) {
    acc = fn(acc, walker.value, i)
    walker = walker.prev
  }

  return acc
}

Yallist.prototype.toArray = function () {
  var arr = new Array(this.length)
  for (var i = 0, walker = this.head; walker !== null; i++) {
    arr[i] = walker.value
    walker = walker.next
  }
  return arr
}

Yallist.prototype.toArrayReverse = function () {
  var arr = new Array(this.length)
  for (var i = 0, walker = this.tail; walker !== null; i++) {
    arr[i] = walker.value
    walker = walker.prev
  }
  return arr
}

Yallist.prototype.slice = function (from, to) {
  to = to || this.length
  if (to < 0) {
    to += this.length
  }
  from = from || 0
  if (from < 0) {
    from += this.length
  }
  var ret = new Yallist()
  if (to < from || to < 0) {
    return ret
  }
  if (from < 0) {
    from = 0
  }
  if (to > this.length) {
    to = this.length
  }
  for (var i = 0, walker = this.head; walker !== null && i < from; i++) {
    walker = walker.next
  }
  for (; walker !== null && i < to; i++, walker = walker.next) {
    ret.push(walker.value)
  }
  return ret
}

Yallist.prototype.sliceReverse = function (from, to) {
  to = to || this.length
  if (to < 0) {
    to += this.length
  }
  from = from || 0
  if (from < 0) {
    from += this.length
  }
  var ret = new Yallist()
  if (to < from || to < 0) {
    return ret
  }
  if (from < 0) {
    from = 0
  }
  if (to > this.length) {
    to = this.length
  }
  for (var i = this.length, walker = this.tail; walker !== null && i > to; i--) {
    walker = walker.prev
  }
  for (; walker !== null && i > from; i--, walker = walker.prev) {
    ret.push(walker.value)
  }
  return ret
}

Yallist.prototype.splice = function (start, deleteCount, ...nodes) {
  if (start > this.length) {
    start = this.length - 1
  }
  if (start < 0) {
    start = this.length + start;
  }

  for (var i = 0, walker = this.head; walker !== null && i < start; i++) {
    walker = walker.next
  }

  var ret = []
  for (var i = 0; walker && i < deleteCount; i++) {
    ret.push(walker.value)
    walker = this.removeNode(walker)
  }
  if (walker === null) {
    walker = this.tail
  }

  if (walker !== this.head && walker !== this.tail) {
    walker = walker.prev
  }

  for (var i = 0; i < nodes.length; i++) {
    walker = insert(this, walker, nodes[i])
  }
  return ret;
}

Yallist.prototype.reverse = function () {
  var head = this.head
  var tail = this.tail
  for (var walker = head; walker !== null; walker = walker.prev) {
    var p = walker.prev
    walker.prev = walker.next
    walker.next = p
  }
  this.head = tail
  this.tail = head
  return this
}

function insert (self, node, value) {
  var inserted = node === self.head ?
    new Node(value, null, node, self) :
    new Node(value, node, node.next, self)

  if (inserted.next === null) {
    self.tail = inserted
  }
  if (inserted.prev === null) {
    self.head = inserted
  }

  self.length++

  return inserted
}

function push (self, item) {
  self.tail = new Node(item, self.tail, null, self)
  if (!self.head) {
    self.head = self.tail
  }
  self.length++
}

function unshift (self, item) {
  self.head = new Node(item, null, self.head, self)
  if (!self.tail) {
    self.tail = self.head
  }
  self.length++
}

function Node (value, prev, next, list) {
  if (!(this instanceof Node)) {
    return new Node(value, prev, next, list)
  }

  this.list = list
  this.value = value

  if (prev) {
    prev.next = this
    this.prev = prev
  } else {
    this.prev = null
  }

  if (next) {
    next.prev = this
    this.next = next
  } else {
    this.next = null
  }
}

try {
  // add if support for Symbol.iterator is present
  __nccwpck_require__(4091)(Yallist)
} catch (er) {}


/***/ }),

/***/ 9491:
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ 4300:
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),

/***/ 2081:
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ 6113:
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ 2361:
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ 7147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 3685:
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ 5687:
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ 1808:
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ 2037:
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ 1017:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 2781:
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ 4404:
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ 3837:
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__nccwpck_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__nccwpck_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__nccwpck_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__nccwpck_require__.o(definition, key) && !__nccwpck_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__nccwpck_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__nccwpck_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
// ESM COMPAT FLAG
__nccwpck_require__.r(__webpack_exports__);

// NAMESPACE OBJECT: ./node_modules/prettier/plugins/markdown.mjs
var markdown_namespaceObject = {};
__nccwpck_require__.r(markdown_namespaceObject);
__nccwpck_require__.d(markdown_namespaceObject, {
  "default": () => (gl),
  "languages": () => (Ki),
  "options": () => (Xi),
  "parsers": () => (Wn),
  "printers": () => (fF)
});

// EXTERNAL MODULE: ./node_modules/@actions/core/lib/core.js
var core = __nccwpck_require__(2186);
// EXTERNAL MODULE: ./node_modules/@metamask/action-utils/dist/index.js
var dist = __nccwpck_require__(1281);
// EXTERNAL MODULE: ./node_modules/semver/functions/diff.js
var diff = __nccwpck_require__(4297);
var diff_default = /*#__PURE__*/__nccwpck_require__.n(diff);
// EXTERNAL MODULE: ./node_modules/semver/functions/gt.js
var gt = __nccwpck_require__(4123);
var gt_default = /*#__PURE__*/__nccwpck_require__.n(gt);
// EXTERNAL MODULE: ./node_modules/semver/functions/inc.js
var inc = __nccwpck_require__(900);
var inc_default = /*#__PURE__*/__nccwpck_require__.n(inc);
// EXTERNAL MODULE: ./node_modules/semver/functions/major.js
var major = __nccwpck_require__(6688);
var major_default = /*#__PURE__*/__nccwpck_require__.n(major);
// EXTERNAL MODULE: ./node_modules/execa/index.js
var execa = __nccwpck_require__(5447);
var execa_default = /*#__PURE__*/__nccwpck_require__.n(execa);
// EXTERNAL MODULE: ./node_modules/semver/functions/clean.js
var clean = __nccwpck_require__(8848);
var clean_default = /*#__PURE__*/__nccwpck_require__.n(clean);
;// CONCATENATED MODULE: ./lib/utils.js

// Our custom input env keys
var InputKeys;
(function (InputKeys) {
    InputKeys["ReleaseType"] = "RELEASE_TYPE";
    InputKeys["ReleaseVersion"] = "RELEASE_VERSION";
})(InputKeys || (InputKeys = {}));
/**
 * SemVer release types that are accepted by this Action.
 */
var AcceptedSemverReleaseTypes;
(function (AcceptedSemverReleaseTypes) {
    AcceptedSemverReleaseTypes["Major"] = "major";
    AcceptedSemverReleaseTypes["Minor"] = "minor";
    AcceptedSemverReleaseTypes["Patch"] = "patch";
})(AcceptedSemverReleaseTypes || (AcceptedSemverReleaseTypes = {}));
/**
 * The names of the inputs to the Action, per action.yml.
 */
var InputNames;
(function (InputNames) {
    InputNames["ReleaseType"] = "release-type";
    InputNames["ReleaseVersion"] = "release-version";
})(InputNames || (InputNames = {}));
const WORKSPACE_ROOT = process.env.GITHUB_WORKSPACE;
/**
 * Validates and returns the inputs to the Action.
 * We perform additional validation because the GitHub Actions configuration
 * syntax is insufficient to express the requirements we have of our inputs.
 *
 * @returns The parsed and validated inputs to the Action.
 */
function getActionInputs() {
    const inputs = {
        ReleaseType: getProcessEnvValue(InputKeys.ReleaseType) || null,
        ReleaseVersion: getProcessEnvValue(InputKeys.ReleaseVersion) || null,
    };
    validateActionInputs(inputs);
    return inputs;
}
/**
 * Utility function to get the trimmed value of a particular key of process.env.
 *
 * @param key - The key of process.env to access.
 * @returns The trimmed string value of the process.env key. Returns an empty
 * string if the key is not set.
 */
function getProcessEnvValue(key) {
    var _a, _b;
    return (_b = (_a = process.env[key]) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : '';
}
/**
 * Validates the inputs to the Action, defined earlier in this file.
 * Throws an error if validation fails.
 *
 * @param inputs - The inputs to this action.
 */
function validateActionInputs(inputs) {
    if (!inputs.ReleaseType && !inputs.ReleaseVersion) {
        throw new Error(`Must specify either "${InputNames.ReleaseType}" or "${InputNames.ReleaseVersion}".`);
    }
    if (inputs.ReleaseType && inputs.ReleaseVersion) {
        throw new Error(`Must specify either "${InputNames.ReleaseType}" or "${InputNames.ReleaseVersion}", not both.`);
    }
    if (inputs.ReleaseType &&
        !Object.values(AcceptedSemverReleaseTypes).includes(inputs.ReleaseType)) {
        const tab = (0,dist.tabs)(1, '\n');
        throw new Error(`Unrecognized "${InputNames.ReleaseType}". Must be one of:${tab}${Object.keys(AcceptedSemverReleaseTypes).join(tab)}`);
    }
    if (inputs.ReleaseVersion) {
        if (!(0,dist.isValidSemver)(inputs.ReleaseVersion)) {
            throw new Error(`"${InputNames.ReleaseVersion}" must be a plain SemVer version string. Received: ${inputs.ReleaseVersion}`);
        }
    }
}
/**
 * Type guard for determining whether the given value is an error object with a
 * `code` property, such as the kind of error that Node throws for filesystem
 * operations.
 *
 * @param error - The object to check.
 * @returns True or false, depending on the result.
 */
function isErrorWithCode(error) {
    return typeof error === 'object' && error !== null && 'code' in error;
}
//# sourceMappingURL=utils.js.map
;// CONCATENATED MODULE: ./lib/git-operations.js




const HEAD = 'HEAD';
const DIFFS = new Map();
/**
 * Gets the HTTPS URL of the current GitHub remote repository. Assumes that
 * the git config remote.origin.url string matches one of:
 *
 * - https://github.com/OrganizationName/RepositoryName
 * - git@github.com:OrganizationName/RepositoryName.git
 *
 * If the URL of the "origin" remote matches neither pattern, an error is
 * thrown.
 *
 * @returns The HTTPS URL of the repository, e.g.
 * `https://github.com/OrganizationName/RepositoryName`.
 */
async function getRepositoryHttpsUrl() {
    const httpsPrefix = 'https://github.com';
    const sshPrefixRegex = /^git@github\.com:/u;
    const sshPostfixRegex = /\.git$/u;
    const gitConfigUrl = await performGitOperation('config', '--get', 'remote.origin.url');
    if (gitConfigUrl.startsWith(httpsPrefix)) {
        return gitConfigUrl;
    }
    // Extracts "OrganizationName/RepositoryName" from
    // "git@github.com:OrganizationName/RepositoryName.git" and returns the
    // corresponding HTTPS URL.
    if (gitConfigUrl.match(sshPrefixRegex) &&
        gitConfigUrl.match(sshPostfixRegex)) {
        return `${httpsPrefix}/${gitConfigUrl
            .replace(sshPrefixRegex, '')
            .replace(sshPostfixRegex, '')}`;
    }
    throw new Error(`Unrecognized URL for git remote "origin": ${gitConfigUrl}`);
}
/**
 * Utility function for executing "git tag" and parsing the result.
 * An error is thrown if no tags are found and the local git history is
 * incomplete.
 *
 * @returns A tuple of all tags as a string array and the latest tag.
 * The tuple is populated by an empty array and null if there are no tags.
 */
async function getTags() {
    // The --merged flag ensures that we only get tags that are parents of or
    // equal to the current HEAD.
    const rawTags = await performGitOperation('tag', '--merged');
    const allTags = rawTags.split('\n').filter((value) => value !== '');
    if (allTags.length === 0) {
        if (await hasCompleteGitHistory()) {
            return [new Set(), null];
        }
        throw new Error(`"git tag" returned no tags. Increase your git fetch depth.`);
    }
    const latestTag = allTags[allTags.length - 1];
    if (!latestTag || !(0,dist.isValidSemver)(clean_default()(latestTag))) {
        throw new Error(`Invalid latest tag. Expected a valid SemVer version. Received: ${latestTag}`);
    }
    return [new Set(allTags), latestTag];
}
/**
 * Check whether the local repository has a complete git history.
 * Implemented using "git rev-parse --is-shallow-repository".
 *
 * @returns Whether the local repository has a complete, as opposed to shallow,
 * git history.
 */
async function hasCompleteGitHistory() {
    const isShallow = await performGitOperation('rev-parse', '--is-shallow-repository');
    // We invert the meaning of these strings because we want to know if the
    // repository is NOT shallow.
    if (isShallow === 'true') {
        return false;
    }
    else if (isShallow === 'false') {
        return true;
    }
    throw new Error(`"git rev-parse --is-shallow-repository" returned unrecognized value: ${isShallow}`);
}
/**
 * ATTN: Only execute serially. Not safely parallelizable.
 *
 * Using git, checks whether the package changed since it was last released.
 *
 * Unless it's the first release of the package, assumes that:
 *
 * - The "version" field of the package's manifest corresponds to its latest
 * released version.
 * - The release commit of the package's most recent version is tagged with
 * "v<VERSION>", where <VERSION> is equal to the manifest's "version" field.
 *
 * @param tags - All tags for the release's base git branch.
 * @param packageData - The metadata of the package to diff.
 * @returns Whether the package changed since its last release. `true` is
 * returned if there are no releases in the repository's history.
 */
async function didPackageChange(tags, packageData) {
    // In this case, we assume that it's the first release, and every package
    // is implicitly considered to have "changed".
    if (tags.size === 0) {
        return true;
    }
    const { manifest: { name: packageName, version: currentVersion }, } = packageData;
    const tagOfCurrentVersion = versionToTag(currentVersion);
    if (!tags.has(tagOfCurrentVersion)) {
        throw new Error(`Package "${packageName !== null && packageName !== void 0 ? packageName : 'undefined'}" has version "${currentVersion}" in its manifest, but no corresponding tag "${tagOfCurrentVersion}" exists.`);
    }
    return hasDiff(packageData, tagOfCurrentVersion);
}
/**
 * Retrieves the diff for the given tag from the cache or performs the git diff
 * operation, caching the result and returning it.
 *
 * @param packageData - The metadata of the package to diff.
 * @param tag - The tag corresponding to the package's latest release.
 * @returns Whether the package changed since its last release.
 */
async function hasDiff(packageData, tag) {
    const { dirPath: packagePath } = packageData;
    let diff;
    if (DIFFS.has(tag)) {
        diff = DIFFS.get(tag);
    }
    else {
        diff = await getDiff(tag);
        DIFFS.set(tag, diff);
    }
    return diff.some((diffPath) => diffPath.startsWith(packagePath));
}
/**
 * Wrapper function for diffing the repository between a particular tag and the
 * current HEAD.
 *
 * @param tag - The tag to compare against HEAD.
 * @returns An array of paths to files that were between the given tag and the
 * current HEAD.
 */
async function getDiff(tag) {
    return (await performGitOperation('diff', tag, HEAD, '--name-only')).split('\n');
}
/**
 * Utility function for performing git operations via execa.
 *
 * @param command - The git command to execute.
 * @param args - The positional arguments to the git command.
 * @returns The result of the git command.
 */
async function performGitOperation(command, ...args) {
    return (await execa_default()('git', [command, ...args], { cwd: WORKSPACE_ROOT })).stdout.trim();
}
/**
 * Takes a SemVer version string and prefixes it with "v".
 *
 * @param version - The SemVer version string to prefix.
 * @returns The "v"-prefixed SemVer version string.
 */
function versionToTag(version) {
    return `v${version}`;
}
//# sourceMappingURL=git-operations.js.map
// EXTERNAL MODULE: ./node_modules/semver/index.js
var semver = __nccwpck_require__(1383);
;// CONCATENATED MODULE: ./node_modules/@metamask/auto-changelog/dist/constants.mjs
/**
 * A [Conventional Commit](https://www.conventionalcommits.org/en/v1.0.0/) type.
 */
var ConventionalCommitType;
(function (ConventionalCommitType) {
    ConventionalCommitType["FEAT"] = "feat";
    ConventionalCommitType["FIX"] = "fix";
    ConventionalCommitType["DOCS"] = "docs";
    ConventionalCommitType["STYLE"] = "style";
    ConventionalCommitType["REFACTOR"] = "refactor";
    ConventionalCommitType["PERF"] = "perf";
    ConventionalCommitType["TEST"] = "test";
    ConventionalCommitType["BUILD"] = "build";
    ConventionalCommitType["CI"] = "ci";
    ConventionalCommitType["CHORE"] = "chore";
    ConventionalCommitType["REVERT"] = "revert";
    // Custom types for MetaMask
    ConventionalCommitType["BUMP"] = "bump";
    ConventionalCommitType["RELEASE"] = "release";
})(ConventionalCommitType || (ConventionalCommitType = {}));
/**
 * Change categories.
 *
 * Most of these categories are from [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
 * The "Uncategorized" category was added because we have many changes from
 * older releases that would be difficult to categorize.
 */
var ChangeCategory;
(function (ChangeCategory) {
    /**
     * For new features.
     */
    ChangeCategory["Added"] = "Added";
    /**
     * For changes in existing functionality.
     */
    ChangeCategory["Changed"] = "Changed";
    /**
     * For soon-to-be-removed features.
     */
    ChangeCategory["Deprecated"] = "Deprecated";
    /**
     * For bug fixes.
     */
    ChangeCategory["Fixed"] = "Fixed";
    /**
     * For now removed features.
     */
    ChangeCategory["Removed"] = "Removed";
    /**
     * In case of vulnerabilities.
     */
    ChangeCategory["Security"] = "Security";
    /**
     * For any changes that have yet to be categorized.
     */
    ChangeCategory["Uncategorized"] = "Uncategorized";
    /**
     * For changes that should be excluded from the changelog.
     */
    ChangeCategory["Excluded"] = "Excluded";
})(ChangeCategory || (ChangeCategory = {}));
/**
 * Change categories in the order in which they should be listed in the
 * changelog.
 */
const orderedChangeCategories = [
    ChangeCategory.Uncategorized,
    ChangeCategory.Added,
    ChangeCategory.Changed,
    ChangeCategory.Deprecated,
    ChangeCategory.Removed,
    ChangeCategory.Fixed,
    ChangeCategory.Security,
];
/**
 * The header for the section of the changelog listing unreleased changes.
 */
const unreleased = 'Unreleased';
/**
 * Lowercase keywords that indicate a commit should be excluded from the changelog.
 */
const keywordsToIndicateExcluded = [
    'Bump main version to',
    'changelog',
    'cherry-pick',
    'cp-',
    'e2e',
    'flaky test',
    'INFRA-',
    'Merge pull request',
    'New Crowdin translations',
].map((word) => word.toLowerCase());
//# sourceMappingURL=constants.mjs.map
;// CONCATENATED MODULE: ./node_modules/@metamask/auto-changelog/dist/changelog.mjs
var __classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Changelog_releases, _Changelog_changes, _Changelog_repoUrl, _Changelog_tagPrefix, _Changelog_formatter, _Changelog_packageRename;
function $importDefault(module) {
    if (module === null || module === void 0 ? void 0 : module.__esModule) {
        return module.default;
    }
    return module;
}

const changelog_semver = $importDefault(semver);


/**
 * Format a Markdown changelog string.
 *
 * @param changelog - The changelog string to format.
 * @param formatter - The name of the formatter to use.
 * @returns The formatted changelog string.
 */
async function format(changelog, formatter) {
    // eslint-disable-next-line import/namespace
    return await formatters[formatter](changelog);
}
/**
 * `Object.getOwnPropertyNames()` is intentionally generic: it returns the
 * immediate property names of an object, but it cannot make guarantees about
 * the contents of that object, so the type of the property names is merely
 * `string[]`. While this is technically accurate, it is also unnecessary if we
 * have an object with a type that we own (such as an enum).
 *
 * IMPORTANT: This is copied from `@metamask/utils` in order to avoid a circular
 * dependency between this package and `@metamask/utils`.
 *
 * @param object - The plain object.
 * @returns The own property names of the object which are assigned a type
 * derived from the object itself.
 */
function getKnownPropertyNames(object) {
    return Object.getOwnPropertyNames(object);
}
const changelogTitle = '# Changelog';
const changelogDescription = `All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).`;
// Stringification helpers
/**
 * Stringify a changelog category section.
 *
 * @param category - The title of the changelog category.
 * @param changes - The changes included in this category.
 * @param repoUrl - The URL of the repository.
 * @param useShortPrLink - Whether to use short PR links in the changelog entries.
 * @returns The stringified category section.
 */
function stringifyCategory(category, changes, repoUrl, useShortPrLink = false) {
    const categoryHeader = `### ${category}`;
    if (changes.length === 0) {
        return categoryHeader;
    }
    const changeDescriptions = changes
        .map(({ description, prNumbers }) => {
        const [firstLine, ...otherLines] = description.split('\n');
        const stringifiedPrLinks = prNumbers
            .map((prNumber) => useShortPrLink
            ? `#${prNumber}`
            : `[#${prNumber}](${repoUrl}/pull/${prNumber})`)
            .join(', ');
        const parenthesizedPrLinks = stringifiedPrLinks.length > 0 ? ` (${stringifiedPrLinks})` : '';
        return [`- ${firstLine}${parenthesizedPrLinks}`, ...otherLines].join('\n');
    })
        .join('\n');
    return `${categoryHeader}\n${changeDescriptions}`;
}
/**
 * Stringify a changelog release section.
 *
 * @param version - The release version.
 * @param categories - The categories of changes included in this release.
 * @param repoUrl - The URL of the repository.
 * @param useShortPrLink - Whether to use short PR links in the changelog entries.
 * @param options - Additional release options.
 * @param options.date - The date of the release.
 * @param options.status - The status of the release (e.g., "DEPRECATED").
 * @returns The stringified release section.
 */
function stringifyRelease(version, categories, repoUrl, useShortPrLink = false, { date, status } = {}) {
    const releaseHeader = `## [${version}]${date ? ` - ${date}` : ''}${status ? ` [${status}]` : ''}`;
    const categorizedChanges = orderedChangeCategories.filter((category) => categories[category])
        .map((category) => {
        var _a;
        const changes = (_a = categories[category]) !== null && _a !== void 0 ? _a : [];
        return stringifyCategory(category, changes, repoUrl, useShortPrLink);
    })
        .join('\n\n');
    if (categorizedChanges === '') {
        return releaseHeader;
    }
    return `${releaseHeader}\n${categorizedChanges}`;
}
/**
 * Stringify a set of changelog release sections.
 *
 * @param releases - The releases to stringify.
 * @param changes - The set of changes to include, organized by release.
 * @param repoUrl - The URL of the repository.
 * @param useShortPrLink - Whether to use short PR links in the changelog entries.
 * @returns The stringified set of release sections.
 */
function stringifyReleases(releases, changes, repoUrl, useShortPrLink = false) {
    const stringifiedUnreleased = stringifyRelease(unreleased, changes[unreleased], repoUrl, useShortPrLink);
    const stringifiedReleases = releases.map(({ version, date, status }) => {
        const categories = changes[version];
        return stringifyRelease(version, categories, repoUrl, useShortPrLink, {
            date,
            status,
        });
    });
    return [stringifiedUnreleased, ...stringifiedReleases].join('\n\n');
}
/**
 * Return the given URL with a trailing slash. It is returned unaltered if it
 * already has a trailing slash.
 *
 * @param url - The URL string.
 * @returns The URL string with a trailing slash.
 */
function withTrailingSlash(url) {
    return url.endsWith('/') ? url : `${url}/`;
}
/**
 * Get the GitHub URL for comparing two git commits.
 *
 * @param repoUrl - The URL for the GitHub repository.
 * @param firstRef - A reference (e.g., commit hash, tag, etc.) to the first commit to compare.
 * @param secondRef - A reference (e.g., commit hash, tag, etc.) to the second commit to compare.
 * @returns The comparison URL for the two given commits.
 */
function getCompareUrl(repoUrl, firstRef, secondRef) {
    return `${withTrailingSlash(repoUrl)}compare/${firstRef}...${secondRef}`;
}
/**
 * Get a GitHub tag URL.
 *
 * @param repoUrl - The URL for the GitHub repository.
 * @param tag - The tag name.
 * @returns The URL for the given tag.
 */
function getTagUrl(repoUrl, tag) {
    return `${withTrailingSlash(repoUrl)}releases/tag/${tag}`;
}
/**
 * Get a stringified list of link definitions for the given set of releases. The first release is
 * linked to the corresponding tag, and each subsequent release is linked to a comparison with the
 * previous release.
 *
 * @param repoUrl - The URL for the GitHub repository.
 * @param tagPrefix - The prefix used in tags before the version number.
 * @param releases - The releases to generate link definitions for.
 * @param packageRename - The package rename properties
 * An optional, which is required only in case of package renamed.
 * @returns The stringified release link definitions.
 */
function stringifyLinkReferenceDefinitions(repoUrl, tagPrefix, releases, packageRename) {
    const unreleasedLinkReferenceDefinition = getUnreleasedLinkReferenceDefinition(repoUrl, tagPrefix, releases, packageRename);
    const releaseLinkReferenceDefinitions = getReleaseLinkReferenceDefinitions(repoUrl, tagPrefix, releases, packageRename).join('\n');
    return `${unreleasedLinkReferenceDefinition}\n${releaseLinkReferenceDefinitions}${releases.length > 0 ? '\n' : ''}`;
}
/**
 * Get a string of unreleased link reference definition.
 *
 * @param repoUrl - The URL for the GitHub repository.
 * @param tagPrefix - The prefix used in tags before the version number.
 * @param releases - The releases to generate link definitions for.
 * @param packageRename - The package rename properties.
 * @returns A unreleased link reference definition string.
 */
function getUnreleasedLinkReferenceDefinition(repoUrl, tagPrefix, releases, packageRename) {
    // The "Unreleased" section represents all changes made since the *highest*
    // release, not the most recent release. This is to accomodate patch releases
    // of older versions that don't represent the latest set of changes.
    //
    // For example, if a library has a v2.0.0 but the v1.0.0 release needed a
    // security update, the v1.0.1 release would then be the most recent, but the
    // range of unreleased changes would remain `v2.0.0...HEAD`.
    //
    // If there have not been any releases yet, the repo URL is used directly as
    // the link definition.
    // A list of release versions in descending SemVer order
    const descendingSemverVersions = releases
        .map(({ version }) => version)
        .sort((a, b) => {
        return changelog_semver.gt(a, b) ? -1 : 1;
    });
    const latestSemverVersion = descendingSemverVersions[0];
    const hasReleases = descendingSemverVersions.length > 0;
    // if there is a package renamed, the tag prefix before the rename will be considered for compare
    // [Unreleased]: https://github.com/ExampleUsernameOrOrganization/ExampleRepository/compare/test@0.0.2...HEAD
    const tagPrefixToCompare = packageRename && packageRename.versionBeforeRename === latestSemverVersion
        ? packageRename.tagPrefixBeforeRename
        : tagPrefix;
    return `[${unreleased}]: ${hasReleases
        ? getCompareUrl(repoUrl, `${tagPrefixToCompare}${latestSemverVersion}`, 'HEAD')
        : withTrailingSlash(repoUrl)}`;
}
/**
 * Get a list of release link reference definitions.
 *
 * @param repoUrl - The URL for the GitHub repository.
 * @param tagPrefix - The prefix used in tags before the version number.
 * @param releases - The releases to generate link definitions for.
 * @param packageRename - The package rename properties.
 * @returns A list of release link reference definitions.
 */
function getReleaseLinkReferenceDefinitions(repoUrl, tagPrefix, releases, packageRename) {
    // The "previous" release that should be used for comparison is not always
    // the most recent release chronologically. The _highest_ version that is
    // lower than the current release is used as the previous release, so that
    // patch releases on older releases can be accomodated.
    const chronologicalVersions = releases.map(({ version }) => version);
    let tagPrefixToCompare = tagPrefix;
    const releaseLinkReferenceDefinitions = releases.map(({ version }) => {
        let diffUrl;
        // once the version matches with versionBeforeRename, rest of the lines in changelog will be assumed as migrated tags
        if (packageRename && packageRename.versionBeforeRename === version) {
            tagPrefixToCompare = packageRename.tagPrefixBeforeRename;
        }
        if (version === chronologicalVersions[chronologicalVersions.length - 1]) {
            diffUrl = getTagUrl(repoUrl, `${tagPrefixToCompare}${version}`);
        }
        else {
            const versionIndex = chronologicalVersions.indexOf(version);
            const previousVersion = chronologicalVersions
                .slice(versionIndex)
                .find((releaseVersion) => {
                return changelog_semver.gt(version, releaseVersion);
            });
            if (previousVersion) {
                if (packageRename &&
                    packageRename.versionBeforeRename === previousVersion) {
                    // The package was renamed at this version
                    // (the tag prefix holds the new name).
                    diffUrl = getCompareUrl(repoUrl, `${packageRename.tagPrefixBeforeRename}${previousVersion}`, `${tagPrefix}${version}`);
                }
                else {
                    // If the package was ever renamed, it was not renamed at this version,
                    // so use either the old tag prefix or the new tag prefix.
                    // If the package was never renamed, use the tag prefix as it is.
                    diffUrl = getCompareUrl(repoUrl, `${tagPrefixToCompare}${previousVersion}`, `${tagPrefixToCompare}${version}`);
                }
            }
            else {
                // This is the smallest release.
                diffUrl = getTagUrl(repoUrl, `${tagPrefixToCompare}${version}`);
            }
        }
        return `[${version}]: ${diffUrl}`;
    });
    return releaseLinkReferenceDefinitions;
}
/**
 * Generate a changelog description from a DependencyBump.
 *
 * @param bump - The dependency bump data.
 * @returns The formatted description string.
 */
function formatDependencyBumpDescription(bump) {
    const prefix = bump.isBreaking ? '**BREAKING:** ' : '';
    return `${prefix}Bump \`${bump.dependency}\` from \`${bump.oldVersion}\` to \`${bump.newVersion}\``;
}
/**
 * A changelog that complies with the
 * ["Keep a Changelog" v1.1.0 guidelines](https://keepachangelog.com/en/1.0.0/).
 *
 * This changelog starts out completely empty, and allows new releases and
 * changes to be added such that the changelog remains compliant at all times.
 * This can be used to help validate the contents of a changelog, normalize
 * formatting, update a changelog, or build one from scratch.
 */
class Changelog {
    /**
     * Construct an empty changelog.
     *
     * @param options - Changelog options.
     * @param options.repoUrl - The GitHub repository URL for the current project.
     * @param options.tagPrefix - The prefix used in tags before the version number.
     * @param options.formatter - A function that formats the changelog string.
     * @param options.packageRename - The package rename properties.
     * An optional, which is required only in case of package renamed.
     */
    constructor({ repoUrl, tagPrefix = 'v', formatter = (changelog) => changelog, packageRename, }) {
        _Changelog_releases.set(this, void 0);
        _Changelog_changes.set(this, void 0);
        _Changelog_repoUrl.set(this, void 0);
        _Changelog_tagPrefix.set(this, void 0);
        _Changelog_formatter.set(this, void 0);
        _Changelog_packageRename.set(this, void 0);
        __classPrivateFieldSet(this, _Changelog_releases, [], "f");
        __classPrivateFieldSet(this, _Changelog_changes, { [unreleased]: {} }, "f");
        __classPrivateFieldSet(this, _Changelog_repoUrl, repoUrl, "f");
        __classPrivateFieldSet(this, _Changelog_tagPrefix, tagPrefix, "f");
        __classPrivateFieldSet(this, _Changelog_formatter, formatter, "f");
        __classPrivateFieldSet(this, _Changelog_packageRename, packageRename, "f");
    }
    /**
     * Add a release to the changelog.
     *
     * @param options - Release options.
     * @param options.addToStart - Determines whether the change is added to the
     * top or bottom of the list of changes in this category. This defaults to
     * `true` because changes should be in reverse-chronological order. This
     * should be set to `false` when parsing a changelog top-to-bottom.
     * @param options.date - An ISO-8601 formatted date, representing the release
     * date.
     * @param options.status - The status of the release (e.g., 'WITHDRAWN',
     * 'DEPRECATED').
     * @param options.version - The version of the current release, which should
     * be a [SemVer](https://semver.org/spec/v2.0.0.html)-compatible version.
     */
    addRelease({ addToStart = true, date, status, version }) {
        if (!version) {
            throw new Error('Version required');
        }
        else if (changelog_semver.valid(version) === null) {
            throw new Error(`Not a valid semver version: '${version}'`);
        }
        else if (__classPrivateFieldGet(this, _Changelog_changes, "f")[version]) {
            throw new Error(`Release already exists: '${version}'`);
        }
        __classPrivateFieldGet(this, _Changelog_changes, "f")[version] = {};
        const newRelease = { version, date, status };
        if (addToStart) {
            __classPrivateFieldGet(this, _Changelog_releases, "f").unshift(newRelease);
        }
        else {
            __classPrivateFieldGet(this, _Changelog_releases, "f").push(newRelease);
        }
    }
    /**
     * Add a change to the changelog.
     *
     * @param options - Change options.
     * @param options.addToStart - Determines whether the change is added to the
     * top or bottom of the list of changes in this category. This defaults to
     * `true` because changes should be in reverse-chronological order. This
     * should be set to `false` when parsing a changelog top-to-bottom.
     * @param options.category - The category of the change.
     * @param options.description - The description of the change. Optional if
     * `dependencyBump` is provided, in which case the description is
     * auto-generated.
     * @param options.version - The version this change was released in. If this
     * is not given, the change is assumed to be unreleased.
     * @param options.prNumbers - The pull request numbers associated with the
     * change.
     * @param options.dependencyBump - Structured dependency bump data. When
     * provided and no description is given, the description is auto-generated
     * from the bump data.
     */
    addChange(options) {
        var _a;
        const { addToStart = true, category, description, version, prNumbers = [], } = options;
        if (!category) {
            throw new Error('Category required');
        }
        else if (!orderedChangeCategories.includes(category)) {
            throw new Error(`Unrecognized category: '${category}'`);
        }
        else if (version !== undefined && !__classPrivateFieldGet(this, _Changelog_changes, "f")[version]) {
            throw new Error(`Specified release version does not exist: '${version}'`);
        }
        const dependencyBump = 'dependencyBump' in options ? options.dependencyBump : undefined;
        let effectiveDescription;
        if (dependencyBump !== undefined) {
            effectiveDescription =
                description !== null && description !== void 0 ? description : formatDependencyBumpDescription(dependencyBump);
        }
        else if (description) {
            effectiveDescription = description;
        }
        else {
            throw new Error('Description required');
        }
        const release = version
            ? __classPrivateFieldGet(this, _Changelog_changes, "f")[version]
            : __classPrivateFieldGet(this, _Changelog_changes, "f")[unreleased];
        const releaseCategory = (_a = release[category]) !== null && _a !== void 0 ? _a : [];
        const change = {
            description: effectiveDescription,
            prNumbers,
        };
        if (dependencyBump !== undefined) {
            change.dependencyBump = dependencyBump;
        }
        releaseCategory[addToStart ? 'unshift' : 'push'](change);
        release[category] = releaseCategory;
    }
    /**
     * Update an existing change entry in the changelog.
     *
     * @param options - Update options.
     * @param options.version - The version of the release containing the change.
     * If not given, the unreleased section is used.
     * @param options.category - The category of the change.
     * @param options.entryIndex - The index of the change within the category.
     * @param options.description - New description (optional).
     * @param options.prNumbers - New PR numbers (optional).
     * @param options.dependencyBump - New dependency bump data (optional).
     */
    updateChange(options) {
        const { version, category, entryIndex, prNumbers } = options;
        const release = version
            ? __classPrivateFieldGet(this, _Changelog_changes, "f")[version]
            : __classPrivateFieldGet(this, _Changelog_changes, "f")[unreleased];
        if (!release) {
            throw new Error(version
                ? `Could not find release: '${version}'`
                : `Could not find '${unreleased}' section`);
        }
        const releaseCategory = release[category];
        if (!releaseCategory) {
            throw new Error(`Could not find category '${category}' in release section '${version !== null && version !== void 0 ? version : unreleased}'`);
        }
        if (entryIndex < 0 || entryIndex >= releaseCategory.length) {
            throw new Error(`No change at index ${entryIndex} in category '${category}'`);
        }
        const change = releaseCategory[entryIndex];
        const description = 'description' in options ? options.description : undefined;
        const dependencyBump = 'dependencyBump' in options ? options.dependencyBump : undefined;
        if (description !== undefined) {
            change.description = description;
            if (dependencyBump !== undefined) {
                change.dependencyBump = dependencyBump;
            }
        }
        else if (dependencyBump !== undefined) {
            change.description = formatDependencyBumpDescription(dependencyBump);
            change.dependencyBump = dependencyBump;
        }
        if (prNumbers !== undefined) {
            change.prNumbers = prNumbers;
        }
    }
    /**
     * Migrate all unreleased changes to a release section.
     *
     * Changes are migrated in their existing categories, and placed above any
     * pre-existing changes in that category.
     *
     * @param version - The release version to migrate unreleased changes to.
     */
    migrateUnreleasedChangesToRelease(version) {
        var _a, _b;
        const releaseChanges = __classPrivateFieldGet(this, _Changelog_changes, "f")[version];
        if (!releaseChanges) {
            throw new Error(`Specified release version does not exist: '${version}'`);
        }
        const unreleasedChanges = __classPrivateFieldGet(this, _Changelog_changes, "f")[unreleased];
        for (const category of getKnownPropertyNames(unreleasedChanges)) {
            if (releaseChanges[category]) {
                releaseChanges[category] = [
                    ...((_a = unreleasedChanges[category]) !== null && _a !== void 0 ? _a : []),
                    ...((_b = releaseChanges[category]) !== null && _b !== void 0 ? _b : []),
                ];
            }
            else {
                releaseChanges[category] = unreleasedChanges[category];
            }
        }
        __classPrivateFieldGet(this, _Changelog_changes, "f")[unreleased] = {};
    }
    /**
     * Gets the metadata for all releases.
     *
     * @returns The metadata for each release.
     */
    getReleases() {
        return __classPrivateFieldGet(this, _Changelog_releases, "f");
    }
    /**
     * Gets the release of the given version.
     *
     * @param version - The version of the release to retrieve.
     * @returns The specified release, or undefined if no such release exists.
     */
    getRelease(version) {
        return this.getReleases().find(({ version: _version }) => _version === version);
    }
    /**
     * Gets the stringified release of the given version.
     * Throws an error if no such release exists.
     *
     * @param version - The version of the release to stringify.
     * @param useShortPrLink - Whether to use short PR links in the changelog entries.
     * @returns The stringified release, as it appears in the changelog.
     */
    getStringifiedRelease(version, useShortPrLink = false) {
        const release = this.getRelease(version);
        if (!release) {
            throw new Error(`Specified release version does not exist: '${version}'`);
        }
        const releaseChanges = this.getReleaseChanges(version);
        return stringifyRelease(version, releaseChanges, __classPrivateFieldGet(this, _Changelog_repoUrl, "f"), useShortPrLink, release);
    }
    /**
     * Gets the changes in the given release, organized by category.
     *
     * @param version - The version of the release being retrieved.
     * @returns The changes included in the given released.
     */
    getReleaseChanges(version) {
        return __classPrivateFieldGet(this, _Changelog_changes, "f")[version];
    }
    /**
     * Gets all changes that have not yet been released.
     *
     * @returns The changes that have not yet been released.
     */
    getUnreleasedChanges() {
        return __classPrivateFieldGet(this, _Changelog_changes, "f")[unreleased];
    }
    /**
     * The stringified changelog, formatted according to [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
     *
     * @param useShortPrLink - Whether to use short PR links in the changelog entries.
     * @returns The stringified changelog.
     */
    async toString(useShortPrLink = false) {
        const changelog = `${changelogTitle}
${changelogDescription}

${stringifyReleases(__classPrivateFieldGet(this, _Changelog_releases, "f"), __classPrivateFieldGet(this, _Changelog_changes, "f"), __classPrivateFieldGet(this, _Changelog_repoUrl, "f"), useShortPrLink)}

${stringifyLinkReferenceDefinitions(__classPrivateFieldGet(this, _Changelog_repoUrl, "f"), __classPrivateFieldGet(this, _Changelog_tagPrefix, "f"), __classPrivateFieldGet(this, _Changelog_releases, "f"), __classPrivateFieldGet(this, _Changelog_packageRename, "f"))}`;
        return await __classPrivateFieldGet(this, _Changelog_formatter, "f").call(this, changelog);
    }
}
_Changelog_releases = new WeakMap(), _Changelog_changes = new WeakMap(), _Changelog_repoUrl = new WeakMap(), _Changelog_tagPrefix = new WeakMap(), _Changelog_formatter = new WeakMap(), _Changelog_packageRename = new WeakMap();
//# sourceMappingURL=changelog.mjs.map
// EXTERNAL MODULE: ./node_modules/@octokit/rest/dist-node/index.js
var dist_node = __nccwpck_require__(5375);
// EXTERNAL MODULE: external "fs"
var external_fs_ = __nccwpck_require__(7147);
// EXTERNAL MODULE: external "path"
var external_path_ = __nccwpck_require__(1017);
var external_path_default = /*#__PURE__*/__nccwpck_require__.n(external_path_);
;// CONCATENATED MODULE: ./node_modules/@metamask/auto-changelog/dist/repo.mjs
/* eslint-disable node/no-process-env, node/no-sync */


/**
 * Return the current project repository URL.
 *
 * @returns The repository URL.
 */
function getRepositoryUrl() {
    var _a;
    // Set automatically by NPM or Yarn 1.x
    const npmPackageRepositoryUrl = process.env.npm_package_repository_url;
    if (npmPackageRepositoryUrl) {
        return npmPackageRepositoryUrl.replace(/\.git$/u, '');
    }
    // Set automatically by Yarn 3.x
    const projectCwd = process.env.PROJECT_CWD;
    if (projectCwd) {
        const packageJson = path.resolve(projectCwd, 'package.json');
        const packageJsonContent = JSON.parse(fs.readFileSync(packageJson, 'utf8'));
        if (typeof packageJsonContent.repository === 'string') {
            return packageJsonContent.repository.replace(/\.git$/u, '');
        }
        if (typeof ((_a = packageJsonContent.repository) === null || _a === void 0 ? void 0 : _a.url) === 'string') {
            return packageJsonContent.repository.url.replace(/\.git$/u, '');
        }
    }
    return null;
}
/**
 * Extract the owner and repository name from a GitHub repository URL.
 *
 * Supports HTTPS and SSH GitHub URLs and removes any trailing .git; throws if parsing fails.
 *
 * @param repoUrl - The full GitHub repository URL (e.g., https://github.com/owner/repo or git@github.com:owner/repo).
 * @returns An object containing the owner and repo name.
 * @throws If the URL cannot be parsed.
 */
function getOwnerAndRepoFromUrl(repoUrl) {
    const match = repoUrl.match(/github\.com[:/](?<owner>[^/]+)\/(?<repo>[^/]+)$/iu);
    if (!(match === null || match === void 0 ? void 0 : match.groups)) {
        throw new Error(`Cannot parse owner/repo from repoUrl: ${repoUrl}`);
    }
    return { owner: match.groups.owner, repo: match.groups.repo };
}
//# sourceMappingURL=repo.mjs.map
// EXTERNAL MODULE: ./node_modules/@metamask/auto-changelog/node_modules/execa/index.js
var node_modules_execa = __nccwpck_require__(6747);
;// CONCATENATED MODULE: ./node_modules/@metamask/auto-changelog/dist/run-command.mjs
function run_command_$importDefault(module) {
    if (module === null || module === void 0 ? void 0 : module.__esModule) {
        return module.default;
    }
    return module;
}

const run_command_execa = run_command_$importDefault(node_modules_execa);
/**
 * Executes a shell command in a child process and returns what it wrote to
 * stdout, or rejects if the process exited with an error.
 *
 * @param command - The command to run, e.g. "git".
 * @param args - The arguments to the command.
 * @param options - Options passed directly to execa.
 * @returns The stdout output as a string.
 */
async function runCommand(command, args, options) {
    return (await run_command_execa(command, [...args], options)).stdout;
}
/**
 * Executes a shell command in a child process and returns what it wrote to
 * stdout, or rejects if the process exited with an error.
 * Trims, splits the output by newlines, and filters out empty lines.
 *
 * @param command - The command to run, e.g. "git".
 * @param args - The arguments to the command.
 * @param options - Options passed directly to execa.
 * @returns An array of the non-empty lines returned by the command.
 */
async function runCommandAndSplit(command, args, options) {
    return (await run_command_execa(command, [...args], options)).stdout
        .trim()
        .split('\n')
        .filter((line) => line !== '');
}
//# sourceMappingURL=run-command.mjs.map
;// CONCATENATED MODULE: ./node_modules/@metamask/auto-changelog/dist/get-new-changes.mjs




let github;
// Get array of all ConventionalCommitType values
const conventionalCommitTypes = Object.values(ConventionalCommitType);
// Create a regex pattern that matches any of the ConventionalCommitTypes
const typesWithPipe = conventionalCommitTypes.join('|');
/**
 * Get all commit hashes included in the given commit range.
 *
 * @param commitRange - The commit range.
 * @param rootDirectory - The project root directory.
 * @returns A list of commit hashes for the given range.
 */
async function getCommitHashesInRange(commitRange, rootDirectory) {
    const revListArgs = ['rev-list', commitRange];
    if (rootDirectory) {
        revListArgs.push(rootDirectory);
    }
    return await runCommandAndSplit('git', revListArgs);
}
/**
 * Remove outer backticks if present in the given message.
 *
 * @param message - The changelog entry message.
 * @returns The message without outer backticks.
 */
function removeOuterBackticksIfPresent(message) {
    return message.replace(/^`(.*)`$/u, '$1');
}
/**
 * Remove Conventional Commit prefix if it exists in the given message.
 *
 * @param message - The changelog entry message.
 * @returns The message without Conventional Commit prefix.
 */
function removeConventionalCommitPrefixIfPresent(message) {
    const regex = new RegExp(`^(${typesWithPipe})(\\([^)]*\\))?:\\s*`, 'iu');
    return message.replace(regex, '');
}
/**
 * Remove HTML comments from the given message.
 * Handles both complete comments (<!-- ... -->) and unclosed comments (<!-- ...).
 * This prevents PR template content from breaking the changelog markdown.
 *
 * @param message - The changelog entry message.
 * @returns The message without HTML comments.
 */
function stripHtmlComments(message) {
    // Remove complete HTML comments (<!-- ... -->)
    let result = message.replace(/<!--[\s\S]*?-->/gu, '');
    // Remove unclosed HTML comments (<!-- without closing -->)
    result = result.replace(/<!--[\s\S]*$/gu, '');
    return result.trim();
}
/**
 * Get commit details for each given commit hash.
 *
 * @param commitHashes - The list of commit hashes.
 * @param repoUrl - The repository URL.
 * @param useChangelogEntry - Whether to use `CHANGELOG entry:` from the commit body and the no-changelog label.
 * @returns Commit details for each commit, including description, PR number (if present), and merge commit indicator.
 */
async function getCommits(commitHashes, repoUrl, useChangelogEntry) {
    var _a, _b, _c, _d;
    // Only initialize Octokit if we need to fetch PR labels
    if (useChangelogEntry) {
        initOctoKit();
    }
    const commits = [];
    for (const commitHash of commitHashes) {
        const subject = await runCommand('git', [
            'show',
            '-s',
            '--format=%s',
            commitHash,
        ]);
        if (!subject) {
            throw new Error(`"git show" returned empty subject for commit "${commitHash}".`);
        }
        const subjectMatch = subject.match(/\(#(\d+)\)/u);
        let prNumber;
        let description = subject;
        let isMergeCommit = false;
        if (subjectMatch) {
            // Squash & Merge: the commit subject is parsed as `<description> (#<PR ID>)`
            prNumber = subjectMatch[1];
            if (useChangelogEntry) {
                const body = await runCommand('git', [
                    'show',
                    '-s',
                    '--format=%b',
                    commitHash,
                ]);
                const changelogMatch = body.match(/\nCHANGELOG entry:\s(\S.+?)\n\n/su);
                if (changelogMatch) {
                    const changelogEntry = changelogMatch[1].replace('\n', ' ').trim();
                    description = changelogEntry; // This may be string 'null' to indicate no description
                    // Check for 'null' (case-insensitive) to exclude entries marked as no-changelog
                    if (description.toLowerCase() !== 'null') {
                        // Remove outer backticks if present. Example: `feat: new feature description` -> feat: new feature description
                        description = removeOuterBackticksIfPresent(description);
                        // Remove Conventional Commit prefix if present. Example: feat: new feature description -> new feature description
                        description = removeConventionalCommitPrefixIfPresent(description);
                        // Make description coming from `CHANGELOG entry:` start with an uppercase letter
                        description =
                            description.charAt(0).toUpperCase() + description.slice(1);
                    }
                }
                else {
                    description = (_b = (_a = subject.match(/^(.+)\s\(#\d+\)/u)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : '';
                }
                // Filter out entries marked as no-changelog (case-insensitive null check)
                if (description.toLowerCase() !== 'null') {
                    const prLabels = await getPrLabels(repoUrl, prNumber);
                    if (prLabels.includes('no-changelog')) {
                        description = 'null'; // Has the no-changelog label, use string 'null' to indicate no description
                    }
                }
            }
            else {
                description = (_d = (_c = subject.match(/^(.+)\s\(#\d+\)/u)) === null || _c === void 0 ? void 0 : _c[1]) !== null && _d !== void 0 ? _d : '';
            }
        }
        else {
            // Merge commit: the PR ID is parsed from the git subject (which is of the form `Merge pull request
            // #<PR ID> from <branch>`, and the description is assumed to be the first line of the body.
            const mergeMatch = subject.match(/#(\d+)\sfrom/u);
            if (mergeMatch) {
                prNumber = mergeMatch[1];
                isMergeCommit = true;
                const [firstLineOfBody] = await runCommandAndSplit('git', [
                    'show',
                    '-s',
                    '--format=%b',
                    commitHash,
                ]);
                description = firstLineOfBody || subject;
            }
        }
        // String 'null' is used to indicate no description
        if (description !== 'null') {
            commits.push({
                prNumber,
                subject,
                description: description.trim(),
                isMergeCommit,
            });
        }
    }
    return commits;
}
/**
 * Filter out duplicate commits based on PR numbers and descriptions.
 *
 * For PR-tagged commits: excludes if PR number already exists in changelog.
 * For direct commits: excludes if a PR-tagged commit with the same description exists
 * in the current batch (handles squash merges), or if already logged in changelog.
 *
 * @param commits - The list of commits to deduplicate.
 * @param loggedPrNumbers - PR numbers already in the changelog.
 * @param loggedDescriptions - Descriptions already in the changelog.
 * @returns Filtered list of commits without duplicates.
 */
function deduplicateCommits(commits, loggedPrNumbers, loggedDescriptions) {
    const prTaggedCommitDescriptions = new Set(commits
        .filter((commit) => commit.prNumber !== undefined)
        .map((commit) => commit.description));
    return commits.filter(({ prNumber, description }) => {
        if (prNumber !== undefined) {
            return !loggedPrNumbers.includes(prNumber);
        }
        // Direct commit: skip if a PR-tagged commit with same description exists in this batch
        if (prTaggedCommitDescriptions.has(description)) {
            return false;
        }
        return !loggedDescriptions.includes(description);
    });
}
/**
 * Get the list of new change entries to add to a changelog.
 *
 * @param options - Options.
 * @param options.mostRecentTag - The most recent tag.
 * @param options.repoUrl - The GitHub repository URL for the current project.
 * @param options.loggedPrNumbers - A list of all pull request numbers included in the relevant parsed changelog.
 * @param options.loggedDescriptions - A list of all change descriptions included in the relevant parsed changelog.
 * @param options.projectRootDirectory - The root project directory, used to
 * filter results from various git commands. This path is assumed to be either
 * absolute, or relative to the current directory. Defaults to the root of the
 * current git repository.
 * @param options.useChangelogEntry - Whether to use `CHANGELOG entry:` from the commit body and the no-changelog label.
 * @param options.useShortPrLink - Whether to use short PR links in the changelog entries.
 * @param options.requirePrNumbers - Whether to require PR numbers for all commits. If true, commits without PR numbers are filtered out.
 * @returns A list of new change entries to add to the changelog, based on commits made since the last release.
 */
async function getNewChangeEntries({ mostRecentTag, repoUrl, loggedPrNumbers, loggedDescriptions, projectRootDirectory, useChangelogEntry, useShortPrLink, requirePrNumbers = false, }) {
    const commitRange = mostRecentTag === null ? 'HEAD' : `${mostRecentTag}..HEAD`;
    const commitsHashesSinceLastRelease = await getCommitHashesInRange(commitRange, projectRootDirectory);
    const commits = await getCommits(commitsHashesSinceLastRelease, repoUrl, useChangelogEntry);
    const filteredPrCommits = requirePrNumbers
        ? commits.filter((commit) => commit.prNumber !== undefined)
        : commits;
    const newCommits = deduplicateCommits(filteredPrCommits, loggedPrNumbers, loggedDescriptions);
    return newCommits.map(({ prNumber, subject, isMergeCommit, description }) => {
        // Handle edge case where PR description includes multiple CHANGELOG entries
        let newDescription = description === null || description === void 0 ? void 0 : description.replace(/CHANGELOG entry: /gu, '');
        // Strip HTML comments that may come from PR templates to prevent broken markdown
        if (newDescription) {
            newDescription = stripHtmlComments(newDescription);
        }
        // For merge commits, use the description for categorization because the subject
        // is "Merge pull request #123..." which would be incorrectly excluded
        const subjectForCategorization = isMergeCommit ? description : subject;
        if (prNumber) {
            const suffix = useShortPrLink
                ? `(#${prNumber})`
                : `([#${prNumber}](${repoUrl}/pull/${prNumber}))`;
            if (newDescription) {
                const lines = newDescription.split('\n');
                lines[0] = `${lines[0]} ${suffix}`; // Append suffix to the first line (next lines are considered part of the description and ignored by the parsing logic)
                newDescription = lines.join('\n');
            }
            else {
                newDescription = suffix;
            }
        }
        return { description: newDescription, subject: subjectForCategorization };
    });
}
/**
 * Initialize the Octokit GitHub client with authentication token.
 */
function initOctoKit() {
    // eslint-disable-next-line node/no-process-env
    const githubToken = process.env.GITHUB_TOKEN;
    if (!githubToken) {
        throw new Error('GITHUB_TOKEN environment variable is not set');
    }
    github = new dist_node.Octokit({ auth: githubToken });
}
/**
 * Fetch labels for a pull request.
 *
 * @param repoUrl - The repository URL.
 * @param prNumber - The pull request number.
 * @returns A list of label names for the PR (empty array if not found or invalid).
 */
async function getPrLabels(repoUrl, prNumber) {
    if (!prNumber) {
        return [];
    }
    if (!github) {
        initOctoKit();
    }
    const { owner, repo } = getOwnerAndRepoFromUrl(repoUrl);
    try {
        const { data: pullRequest } = await github.rest.pulls.get({
            owner,
            repo,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            pull_number: Number(prNumber),
        });
        if (pullRequest) {
            const labels = pullRequest.labels.map((label) => label.name);
            return labels;
        }
    }
    catch (error) {
        // If PR doesn't exist (404), return empty labels instead of throwing
        if (error instanceof Error &&
            'status' in error &&
            error.status === 404) {
            console.warn(`PR #${prNumber} not found in ${owner}/${repo}, skipping label check`);
            return [];
        }
        throw error;
    }
    return [];
}
//# sourceMappingURL=get-new-changes.mjs.map
;// CONCATENATED MODULE: ./node_modules/@metamask/auto-changelog/dist/parse-changelog.mjs
function parse_changelog_$importDefault(module) {
    if (module === null || module === void 0 ? void 0 : module.__esModule) {
        return module.default;
    }
    return module;
}

const parse_changelog_semver = parse_changelog_$importDefault(semver);


/**
 * Parse a dependency bump description into structured data.
 *
 * Detects the following patterns (case-insensitive verb):
 * - `[**BREAKING:** ]Bump \`dep\` from \`old\` to \`new\``
 * - `[**BREAKING:** ]Update \`dep\` from \`old\` to \`new\``
 * - `[**BREAKING:** ]Upgrade \`dep\` from \`old\` to \`new\``
 * - `[**BREAKING:** ]Update \`dep\` to \`new\`` (oldVersion omitted)
 * - `[**BREAKING:** ]Upgrade \`dep\` to \`new\`` (oldVersion omitted)
 *
 * Note: The dependency type is inferred heuristically from the description:
 * entries with `**BREAKING:**` prefix are classified as `peerDependencies`,
 * all others as `dependencies`. This can be incorrect if a peerDependency
 * bump was manually written without the prefix, or a regular dependency
 * bump was manually given the prefix. This is an inherent limitation of
 * round-tripping structured data through free-text descriptions.
 *
 * @param description - The change description to parse.
 * @returns A DependencyBump if the description matches, undefined otherwise.
 */
function parsePossibleDependencyBumpDescription(description) {
    // Full form: Bump/Update/Upgrade `dep` from `old` to `new`
    const fullMatch = description.match(/^(\*\*BREAKING:\*\*\s+)?(?:Bump|Update|Upgrade) `([^`]+)` from `([^`]+)` to `([^`]+)`/u);
    if (fullMatch) {
        return {
            dependency: fullMatch[2],
            isBreaking: Boolean(fullMatch[1]),
            oldVersion: fullMatch[3],
            newVersion: fullMatch[4],
        };
    }
    // Short form: Update/Upgrade `dep` to `new` (no "from")
    const shortMatch = description.match(/^(\*\*BREAKING:\*\*\s+)?(?:Bump|Update|Upgrade) `([^`]+)` to `([^`]+)`/u);
    if (shortMatch) {
        return {
            dependency: shortMatch[2],
            isBreaking: Boolean(shortMatch[1]),
            oldVersion: '',
            newVersion: shortMatch[3],
        };
    }
    return undefined;
}
/**
 * Truncate the given string at 80 characters.
 *
 * @param line - The string to truncate.
 * @returns The truncated string.
 */
function truncated(line) {
    return line.length > 80 ? `${line.slice(0, 80)}...` : line;
}
/**
 * Returns whether the given string is recognized as a valid change category.
 *
 * @param category - The string to validate.
 * @returns Whether the given string is a valid change category.
 */
function isValidChangeCategory(category) {
    return ChangeCategory[category] !== undefined;
}
/**
 * Returns the repository name from a GitHub repository URL.
 *
 * @param repoUrl - The URL for the GitHub repository.
 * @returns The repository name, or null if it could not be determined.
 */
function extractRepoName(repoUrl) {
    const match = repoUrl === null || repoUrl === void 0 ? void 0 : repoUrl.match(/github\.com\/[^/]+\/([^/]+)/u); // Match and capture the repo name
    return match ? match[1] : '';
}
/**
 * Constructs a Changelog instance that represents the given changelog, which
 * is parsed for release and change information.
 *
 * @param options - Options.
 * @param options.changelogContent - The changelog to parse.
 * @param options.repoUrl - The GitHub repository URL for the current project.
 * @param options.tagPrefix - The prefix used in tags before the version number.
 * @param options.formatter - A custom Markdown formatter to use.
 * @param options.packageRename - The package rename properties
 * An optional, which is required only in case of package renamed.
 * @param options.shouldExtractPrLinks - When true, look for and parse pull
 * request links at the end of change entries.
 * @returns A changelog instance that reflects the changelog text provided.
 */
function parseChangelog({ changelogContent, repoUrl, tagPrefix = 'v', formatter = undefined, packageRename, shouldExtractPrLinks = false, }) {
    const changelogLines = changelogContent.split(/(?:\r)?\n/u); // Split on either Windows or Unix line endings
    const changelog = new Changelog({
        repoUrl,
        tagPrefix,
        formatter,
        packageRename,
    });
    const repoName = extractRepoName(repoUrl);
    const unreleasedHeaderIndex = changelogLines.indexOf(`## [${unreleased}]`);
    if (unreleasedHeaderIndex === -1) {
        throw new Error(`Failed to find ${unreleased} header`);
    }
    const unreleasedLinkReferenceDefinition = changelogLines.findIndex((line) => {
        return line.startsWith(`[${unreleased}]:`);
    });
    if (unreleasedLinkReferenceDefinition === -1) {
        throw new Error(`Failed to find ${unreleased} link reference definition`);
    }
    const contentfulChangelogLines = changelogLines.slice(unreleasedHeaderIndex + 1, unreleasedLinkReferenceDefinition);
    let mostRecentRelease;
    let mostRecentCategory;
    let currentChangeEntry;
    /**
     * Finalize a change entry, adding it to the changelog.
     *
     * This is required because change entries can span multiple lines.
     *
     * @param options - Options.
     * @param options.removeTrailingNewline - Indicates that the trailing newline
     * is not a part of the change description, and should therefore be removed.
     */
    function finalizePreviousChange({ removeTrailingNewline = false, } = {}) {
        if (!currentChangeEntry) {
            return;
        }
        // This should never happen in practice, because `mostRecentCategory` is
        // guaranteed to be set if `currentChangeEntry` is set.
        /* istanbul ignore next */
        if (!mostRecentCategory) {
            throw new Error('Cannot finalize change without most recent category.');
        }
        if (removeTrailingNewline && currentChangeEntry.endsWith('\n')) {
            currentChangeEntry = currentChangeEntry.slice(0, currentChangeEntry.length - 1);
        }
        const { description, prNumbers } = shouldExtractPrLinks
            ? extractPrLinks(currentChangeEntry, repoName)
            : {
                description: currentChangeEntry,
                prNumbers: [],
            };
        const dependencyBump = parsePossibleDependencyBumpDescription(description);
        changelog.addChange({
            addToStart: false,
            category: mostRecentCategory,
            description,
            version: mostRecentRelease,
            prNumbers,
            ...(dependencyBump !== undefined && { dependencyBump }),
        });
        currentChangeEntry = undefined;
    }
    for (const line of contentfulChangelogLines) {
        if (line.startsWith('## [')) {
            const results = line.match(/^## \[([^[\]]+)\](?: - (\d\d\d\d-\d\d-\d\d))?(?: \[(\w+)\])?/u);
            if (results === null) {
                throw new Error(`Malformed release header: '${truncated(line)}'`);
            }
            if (parse_changelog_semver.valid(results[1]) === null) {
                throw new Error(`Invalid SemVer version in release header: '${truncated(line)}'`);
            }
            // Trailing newline removed because the release section is expected to
            // be prefixed by a newline.
            finalizePreviousChange({
                removeTrailingNewline: true,
            });
            mostRecentRelease = results[1];
            mostRecentCategory = undefined;
            const date = results[2];
            const status = results[3];
            changelog.addRelease({
                addToStart: false,
                date,
                status,
                version: mostRecentRelease,
            });
        }
        else if (line.startsWith('### ')) {
            const results = line.match(/^### (\w+)$\b/u);
            if (results === null) {
                throw new Error(`Malformed category header: '${truncated(line)}'`);
            }
            const isFirstCategory = mostRecentCategory === null;
            finalizePreviousChange({
                removeTrailingNewline: !isFirstCategory,
            });
            if (!isValidChangeCategory(results[1])) {
                throw new Error(`Invalid change category: '${results[1]}'`);
            }
            mostRecentCategory = results[1];
        }
        else if (line.startsWith('- ')) {
            if (!mostRecentCategory) {
                throw new Error(`Category missing for change: '${truncated(line)}'`);
            }
            const description = line.slice(2);
            finalizePreviousChange();
            currentChangeEntry = description;
        }
        else if (currentChangeEntry) {
            currentChangeEntry += `\n${line}`;
        }
        else if (line === '') {
            continue;
        }
        else {
            throw new Error(`Unrecognized line: '${truncated(line)}'`);
        }
    }
    // Trailing newline removed because the reference link definition section is
    // expected to be separated by a newline.
    finalizePreviousChange({ removeTrailingNewline: true });
    return changelog;
}
/**
 * Looks for potential links to pull requests from the end of the first line of
 * a change entry and pulls them off.
 *
 * Note that the pattern to look for potential links is intentionally naive,
 * so that we can offer better error messaging in case URLs do not match the
 * repo URL (such an error would appear when attempting to stringify the
 * changelog).
 *
 * @param changeEntry - The text of the change entry.
 * @param repoName - The name of the GitHub repository.
 * @returns The list of pull request numbers referenced by the change entry, and
 * the change entry without the links to those pull requests.
 */
function extractPrLinks(changeEntry, repoName) {
    const lines = changeEntry.split('\n');
    const prNumbers = [];
    // Only process the first line for PR link extraction
    let firstLine = lines[0];
    // We only extract PR links from the right repo, because it happens that some
    // changelog entries include links to PRs from other repos like packages that were bumped.
    // We don't want to accidentally extract those.
    // eslint-disable-next-line prefer-regex-literals
    const longGroupMatchPattern = new RegExp(
    // Example of long match group: " ([#123](...), [#456](...))"
    `\\s+\\(\\s*(\\[#\\d+\\]\\([^)]*${repoName}[^)]*\\)\\s*,?\\s*)+\\)`, 'gu');
    // eslint-disable-next-line prefer-regex-literals
    const longMatchPattern = new RegExp(
    // Example of long match: "[#123](...)"
    `\\[#(\\d+)\\]\\([^)]*${repoName}[^)]*\\)`, 'gu');
    // Match and extract all long PR links like ([#123](...)) separated by commas
    const longGroupMatches = [...firstLine.matchAll(longGroupMatchPattern)];
    for (const longGroupMatch of longGroupMatches) {
        const group = longGroupMatch[0];
        const longMatches = [...group.matchAll(longMatchPattern)];
        for (const match of longMatches) {
            prNumbers.push(match[1]);
        }
    }
    // Remove valid long PR links (grouped in parentheses, possibly comma-separated)
    firstLine = firstLine.replace(longGroupMatchPattern, '');
    // Example of short match group: " (#123), (#123)"
    const shortGroupMatchPattern = /\s+(\(#\d+\)\s*,?\s*)+/gu;
    // Example of short match: "(#123)"
    const shortMatchPattern = /\(#(\d+)\)/gu;
    // Match and extract all short PR links like (#123)
    const shortGroupMatches = [...firstLine.matchAll(shortGroupMatchPattern)];
    for (const shortGroupMatch of shortGroupMatches) {
        const group = shortGroupMatch[0];
        const shortMatches = [...group.matchAll(shortMatchPattern)];
        for (const match of shortMatches) {
            prNumbers.push(match[1]);
        }
    }
    // Remove valid short PR links
    firstLine = firstLine.replace(shortGroupMatchPattern, '');
    // Prepare the cleaned description
    const cleanedLines = [firstLine.trim(), ...lines.slice(1)];
    const cleanedDescription = cleanedLines.join('\n');
    // Return unique PR numbers and the cleaned description
    return {
        description: cleanedDescription.trim(),
        prNumbers: [...new Set(prNumbers)],
    };
}
//# sourceMappingURL=parse-changelog.mjs.map
;// CONCATENATED MODULE: ./node_modules/@metamask/auto-changelog/dist/update-changelog.mjs





/**
 * Get the most recent tag for a project.
 *
 * @param options - Options.
 * @param options.tagPrefixes - A list of tag prefixes to look for, where the first is the intended
 * prefix and each subsequent prefix is a fallback in case the previous tag prefixes are not found.
 * @returns The most recent tag.
 */
async function getMostRecentTag({ tagPrefixes, }) {
    // Ensure we have all tags on remote (overwrite if necessary)
    await runCommandAndSplit('git', ['fetch', '--tags', '--force']);
    let mostRecentTagCommitHash = null;
    for (const tagPrefix of tagPrefixes) {
        const revListArgs = [
            'rev-list',
            `--tags=${tagPrefix}*`,
            '--max-count=1',
            '--date-order',
        ];
        const results = await runCommandAndSplit('git', revListArgs);
        if (results.length) {
            mostRecentTagCommitHash = results[0];
            break;
        }
    }
    if (mostRecentTagCommitHash === null) {
        return null;
    }
    const [mostRecentTag] = await runCommandAndSplit('git', [
        'describe',
        '--tags',
        mostRecentTagCommitHash,
    ]);
    return mostRecentTag;
}
/**
 * Get all changes from a changelog.
 *
 * @param changelog - The changelog.
 * @returns All commit descriptions included in the given changelog.
 */
function getAllChanges(changelog) {
    const releases = changelog.getReleases();
    const changes = Object.values(changelog.getUnreleasedChanges()).flat();
    for (const release of releases) {
        changes.push(...Object.values(changelog.getReleaseChanges(release.version)).flat());
    }
    return changes;
}
/**
 * Get all pull request numbers included in the given changelog.
 *
 * @param changelog - The changelog.
 * @returns All pull request numbers included in the given changelog.
 */
function getAllLoggedPrNumbers(changelog) {
    return getAllChanges(changelog).flatMap((change) => change.prNumbers);
}
/**
 * Get all change descriptions included in the given changelog.
 * Descriptions are trimmed to match the normalization applied during comparison.
 *
 * @param changelog - The changelog.
 * @returns All change descriptions included in the given changelog, trimmed.
 */
function getAllLoggedDescriptions(changelog) {
    return getAllChanges(changelog).map((change) => change.description.trim());
}
/**
 * Update a changelog with any commits made since the last release. Commits for
 * PRs that are already included in the changelog are omitted.
 *
 * @param options - Update options.
 * @param options.changelogContent - The current changelog.
 * @param options.currentVersion - The current version. Required if
 * `isReleaseCandidate` is set, but optional otherwise.
 * @param options.repoUrl - The GitHub repository URL for the current project.
 * @param options.isReleaseCandidate - Denotes whether the current project.
 * is in the midst of release preparation or not. If this is set, any new
 * changes are listed under the current release header. Otherwise, they are
 * listed under the 'Unreleased' section.
 * @param options.projectRootDirectory - The root project directory, used to
 * filter results from various git commands. This path is assumed to be either
 * absolute, or relative to the current directory. Defaults to the root of the
 * current git repository.
 * @param options.tagPrefixes - A list of tag prefixes to look for, where the first is the intended
 * prefix and each subsequent prefix is a fallback in case the previous tag prefixes are not found.
 * @param options.formatter - A custom Markdown formatter to use.
 * @param options.packageRename - The package rename properties.
 * An optional, which is required only in case of package renamed.
 * @param options.autoCategorize - A flag indicating whether changes should be auto-categorized
 * based on commit message prefixes.
 * @param options.useChangelogEntry - Whether to use `CHANGELOG entry:` from the commit body and the no-changelog label.
 * @param options.useShortPrLink - Whether to use short PR links in the changelog.
 * @param options.requirePrNumbers - Whether to require PR numbers for all commits. If true, commits without PR numbers are filtered out.
 * @returns The updated changelog text.
 */
async function updateChangelog({ changelogContent, currentVersion, repoUrl, isReleaseCandidate, projectRootDirectory, tagPrefixes = ['v'], formatter = undefined, packageRename, autoCategorize, useChangelogEntry = false, useShortPrLink = false, requirePrNumbers = false, }) {
    const changelog = parseChangelog({
        changelogContent,
        repoUrl,
        tagPrefix: tagPrefixes[0],
        formatter,
        packageRename,
        shouldExtractPrLinks: true, // By setting this to true, we ensure we don't re-add a PR to the changelog if it was already added in previous releases
    });
    const mostRecentTag = await getMostRecentTag({
        tagPrefixes,
    });
    if (isReleaseCandidate) {
        if (!currentVersion) {
            throw new Error(`A version must be specified if 'isReleaseCandidate' is set.`);
        }
        if (mostRecentTag === `${tagPrefixes[0]}${currentVersion}`) {
            throw new Error(`Current version already has a tag ('${mostRecentTag}'), which is unexpected for a release candidate.`);
        }
        // Ensure release header exists, if necessary
        if (!changelog
            .getReleases()
            .find((release) => release.version === currentVersion)) {
            changelog.addRelease({ version: currentVersion });
        }
        const hasUnreleasedChangesToRelease = getKnownPropertyNames(changelog.getUnreleasedChanges()).length > 0;
        if (hasUnreleasedChangesToRelease) {
            changelog.migrateUnreleasedChangesToRelease(currentVersion);
        }
    }
    const newChangeEntries = await getNewChangeEntries({
        mostRecentTag,
        repoUrl,
        loggedPrNumbers: getAllLoggedPrNumbers(changelog),
        loggedDescriptions: getAllLoggedDescriptions(changelog),
        projectRootDirectory,
        useChangelogEntry,
        useShortPrLink,
        requirePrNumbers,
    });
    for (const entry of newChangeEntries.reverse()) {
        const category = autoCategorize
            ? getCategory(entry.subject)
            : ChangeCategory.Uncategorized;
        if (category !== ChangeCategory.Excluded) {
            changelog.addChange({
                version: isReleaseCandidate ? currentVersion : undefined,
                category,
                description: entry.description,
            });
        }
    }
    const newChangelogContent = await changelog.toString(useShortPrLink);
    const isChangelogUpdated = changelogContent !== newChangelogContent;
    return isChangelogUpdated ? newChangelogContent : undefined;
}
/**
 * Determine the category of a change based on the commit message prefix.
 *
 * @param description - The commit message description.
 * @returns The category of the change.
 */
function getCategory(description) {
    var _a;
    // Check whether the commit description includes exclusion keywords
    if (checkIfDescriptionIndicatesExcluded(description)) {
        return ChangeCategory.Excluded;
    }
    // Get array of all ConventionalCommitType values
    const conventionalCommitTypes = Object.values(ConventionalCommitType);
    // Create a regex pattern that matches any of the ConventionalCommitTypes
    const typesWithPipe = conventionalCommitTypes.join('|');
    const conventionalCommitPattern = new RegExp(`^(${typesWithPipe})\\s*(\\([^)]*\\))?:.*$`, 'ui');
    const match = description.match(conventionalCommitPattern);
    if (match) {
        const prefix = (_a = match[1]) === null || _a === void 0 ? void 0 : _a.toLowerCase(); // Always use lowercase for consistency
        switch (prefix) {
            case ConventionalCommitType.FEAT:
                return ChangeCategory.Added;
            case ConventionalCommitType.FIX:
                return ChangeCategory.Fixed;
            // Begin categories that should be excluded from the changelog
            case ConventionalCommitType.STYLE:
            case ConventionalCommitType.REFACTOR:
            case ConventionalCommitType.TEST:
            case ConventionalCommitType.BUILD:
            case ConventionalCommitType.CI:
            case ConventionalCommitType.RELEASE:
                return ChangeCategory.Excluded;
            // End categories that should be excluded from the changelog
            default:
                return ChangeCategory.Uncategorized;
        }
    }
    // Return 'Uncategorized' if no colon is found or prefix doesn't match
    return ChangeCategory.Uncategorized;
}
/**
 * Check whether the commit description includes exclusion keywords.
 *
 * @param description - The raw or processed commit description.
 * @returns True if the description contains any exclusion keywords; otherwise false.
 */
function checkIfDescriptionIndicatesExcluded(description) {
    const _description = description.toLowerCase();
    return keywordsToIndicateExcluded.some((word) => _description.includes(word));
}
//# sourceMappingURL=update-changelog.mjs.map
;// CONCATENATED MODULE: ./node_modules/prettier/plugins/markdown.mjs
var El=Object.create;var Ft=Object.defineProperty;var Cl=Object.getOwnPropertyDescriptor;var vl=Object.getOwnPropertyNames;var Al=Object.getPrototypeOf,bl=Object.prototype.hasOwnProperty;var x=(e,r)=>()=>(r||e((r={exports:{}}).exports,r),r.exports),Vn=(e,r)=>{for(var t in r)Ft(e,t,{get:r[t],enumerable:!0})},xl=(e,r,t,n)=>{if(r&&typeof r=="object"||typeof r=="function")for(let i of vl(r))!bl.call(e,i)&&i!==t&&Ft(e,i,{get:()=>r[i],enumerable:!(n=Cl(r,i))||n.enumerable});return e};var Re=(e,r,t)=>(t=e!=null?El(Al(e)):{},xl(r||!e||!e.__esModule?Ft(t,"default",{value:e,enumerable:!0}):t,e));var Tr=x((gF,jn)=>{"use strict";jn.exports=Bl;function Bl(e){return String(e).replace(/\s+/g," ")}});var Qi=x((KC,Ji)=>{"use strict";Ji.exports=Qf;var pr=9,Wr=10,Ve=32,Hf=33,Kf=58,je=91,Xf=92,St=93,hr=94,Vr=96,jr=4,Jf=1024;function Qf(e){var r=this.Parser,t=this.Compiler;Zf(r)&&rD(r,e),eD(t)&&tD(t)}function Zf(e){return!!(e&&e.prototype&&e.prototype.blockTokenizers)}function eD(e){return!!(e&&e.prototype&&e.prototype.visitors)}function rD(e,r){for(var t=r||{},n=e.prototype,i=n.blockTokenizers,u=n.inlineTokenizers,a=n.blockMethods,o=n.inlineMethods,s=i.definition,l=u.reference,c=[],f=-1,D=a.length,m;++f<D;)m=a[f],!(m==="newline"||m==="indentedCode"||m==="paragraph"||m==="footnoteDefinition")&&c.push([m]);c.push(["footnoteDefinition"]),t.inlineNotes&&(Lt(o,"reference","inlineNote"),u.inlineNote=F),Lt(a,"definition","footnoteDefinition"),Lt(o,"reference","footnoteCall"),i.definition=E,i.footnoteDefinition=p,u.footnoteCall=h,u.reference=g,n.interruptFootnoteDefinition=c,g.locator=l.locator,h.locator=v,F.locator=A;function p(b,d,y){for(var w=this,C=w.interruptFootnoteDefinition,k=w.offset,T=d.length+1,B=0,_=[],S,P,N,O,I,le,K,L,ie,Z,ve,Ae,G;B<T&&(O=d.charCodeAt(B),!(O!==pr&&O!==Ve));)B++;if(d.charCodeAt(B++)===je&&d.charCodeAt(B++)===hr){for(P=B;B<T;){if(O=d.charCodeAt(B),O!==O||O===Wr||O===pr||O===Ve)return;if(O===St){N=B,B++;break}B++}if(!(N===void 0||P===N||d.charCodeAt(B++)!==Kf)){if(y)return!0;for(S=d.slice(P,N),I=b.now(),ie=0,Z=0,ve=B,Ae=[];B<T;){if(O=d.charCodeAt(B),O!==O||O===Wr)G={start:ie,contentStart:ve||B,contentEnd:B,end:B},Ae.push(G),O===Wr&&(ie=B+1,Z=0,ve=void 0,G.end=ie);else if(Z!==void 0)if(O===Ve||O===pr)Z+=O===Ve?1:jr-Z%jr,Z>jr&&(Z=void 0,ve=B);else{if(Z<jr&&G&&(G.contentStart===G.contentEnd||nD(C,i,w,[b,d.slice(B,Jf),!0])))break;Z=void 0,ve=B}B++}for(B=-1,T=Ae.length;T>0&&(G=Ae[T-1],G.contentStart===G.contentEnd);)T--;for(le=b(d.slice(0,G.contentEnd));++B<T;)G=Ae[B],k[I.line+B]=(k[I.line+B]||0)+(G.contentStart-G.start),_.push(d.slice(G.contentStart,G.end));return K=w.enterBlock(),L=w.tokenizeBlock(_.join(""),I),K(),le({type:"footnoteDefinition",identifier:S.toLowerCase(),label:S,children:L})}}}function h(b,d,y){var w=d.length+1,C=0,k,T,B,_;if(d.charCodeAt(C++)===je&&d.charCodeAt(C++)===hr){for(T=C;C<w;){if(_=d.charCodeAt(C),_!==_||_===Wr||_===pr||_===Ve)return;if(_===St){B=C,C++;break}C++}if(!(B===void 0||T===B))return y?!0:(k=d.slice(T,B),b(d.slice(0,C))({type:"footnoteReference",identifier:k.toLowerCase(),label:k}))}}function F(b,d,y){var w=this,C=d.length+1,k=0,T=0,B,_,S,P,N,O,I;if(d.charCodeAt(k++)===hr&&d.charCodeAt(k++)===je){for(S=k;k<C;){if(_=d.charCodeAt(k),_!==_)return;if(O===void 0)if(_===Xf)k+=2;else if(_===je)T++,k++;else if(_===St)if(T===0){P=k,k++;break}else T--,k++;else if(_===Vr){for(N=k,O=1;d.charCodeAt(N+O)===Vr;)O++;k+=O}else k++;else if(_===Vr){for(N=k,I=1;d.charCodeAt(N+I)===Vr;)I++;k+=I,O===I&&(O=void 0),I=void 0}else k++}if(P!==void 0)return y?!0:(B=b.now(),B.column+=2,B.offset+=2,b(d.slice(0,k))({type:"footnote",children:w.tokenizeInline(d.slice(S,P),B)}))}}function g(b,d,y){var w=0;if(d.charCodeAt(w)===Hf&&w++,d.charCodeAt(w)===je&&d.charCodeAt(w+1)!==hr)return l.call(this,b,d,y)}function E(b,d,y){for(var w=0,C=d.charCodeAt(w);C===Ve||C===pr;)C=d.charCodeAt(++w);if(C===je&&d.charCodeAt(w+1)!==hr)return s.call(this,b,d,y)}function v(b,d){return b.indexOf("[",d)}function A(b,d){return b.indexOf("^[",d)}}function tD(e){var r=e.prototype.visitors,t="    ";r.footnote=n,r.footnoteReference=i,r.footnoteDefinition=u;function n(a){return"^["+this.all(a).join("")+"]"}function i(a){return"[^"+(a.label||a.identifier)+"]"}function u(a){for(var o=this.all(a).join(`

`).split(`
`),s=0,l=o.length,c;++s<l;)c=o[s],c!==""&&(o[s]=t+c);return"[^"+(a.label||a.identifier)+"]: "+o.join(`
`)}}function Lt(e,r,t){e.splice(e.indexOf(r),0,t)}function nD(e,r,t,n){for(var i=e.length,u=-1;++u<i;)if(r[e[u][0]].apply(t,n))return!0;return!1}});var Mt=x(Rt=>{Rt.isRemarkParser=iD;Rt.isRemarkCompiler=uD;function iD(e){return!!(e&&e.prototype&&e.prototype.blockTokenizers)}function uD(e){return!!(e&&e.prototype&&e.prototype.visitors)}});var uu=x((JC,iu)=>{var Zi=Mt();iu.exports=cD;var eu=9,ru=32,$r=36,aD=48,oD=57,tu=92,sD=["math","math-inline"],nu="math-display";function cD(e){let r=this.Parser,t=this.Compiler;Zi.isRemarkParser(r)&&lD(r,e),Zi.isRemarkCompiler(t)&&fD(t,e)}function lD(e,r){let t=e.prototype,n=t.inlineMethods;u.locator=i,t.inlineTokenizers.math=u,n.splice(n.indexOf("text"),0,"math");function i(a,o){return a.indexOf("$",o)}function u(a,o,s){let l=o.length,c=!1,f=!1,D=0,m,p,h,F,g,E,v;if(o.charCodeAt(D)===tu&&(f=!0,D++),o.charCodeAt(D)===$r){if(D++,f)return s?!0:a(o.slice(0,D))({type:"text",value:"$"});if(o.charCodeAt(D)===$r&&(c=!0,D++),h=o.charCodeAt(D),!(h===ru||h===eu)){for(F=D;D<l;){if(p=h,h=o.charCodeAt(D+1),p===$r){if(m=o.charCodeAt(D-1),m!==ru&&m!==eu&&(h!==h||h<aD||h>oD)&&(!c||h===$r)){g=D-1,D++,c&&D++,E=D;break}}else p===tu&&(D++,h=o.charCodeAt(D+1));D++}if(E!==void 0)return s?!0:(v=o.slice(F,g+1),a(o.slice(0,E))({type:"inlineMath",value:v,data:{hName:"span",hProperties:{className:sD.concat(c&&r.inlineMathDouble?[nu]:[])},hChildren:[{type:"text",value:v}]}}))}}}}function fD(e){let r=e.prototype;r.visitors.inlineMath=t;function t(n){let i="$";return(n.data&&n.data.hProperties&&n.data.hProperties.className||[]).includes(nu)&&(i="$$"),i+n.value+i}}});var lu=x((QC,cu)=>{var au=Mt();cu.exports=dD;var ou=10,dr=32,Ut=36,su=`
`,DD="$",pD=2,hD=["math","math-display"];function dD(){let e=this.Parser,r=this.Compiler;au.isRemarkParser(e)&&mD(e),au.isRemarkCompiler(r)&&FD(r)}function mD(e){let r=e.prototype,t=r.blockMethods,n=r.interruptParagraph,i=r.interruptList,u=r.interruptBlockquote;r.blockTokenizers.math=a,t.splice(t.indexOf("fencedCode")+1,0,"math"),n.splice(n.indexOf("fencedCode")+1,0,["math"]),i.splice(i.indexOf("fencedCode")+1,0,["math"]),u.splice(u.indexOf("fencedCode")+1,0,["math"]);function a(o,s,l){var c=s.length,f=0;let D,m,p,h,F,g,E,v,A,b,d;for(;f<c&&s.charCodeAt(f)===dr;)f++;for(F=f;f<c&&s.charCodeAt(f)===Ut;)f++;if(g=f-F,!(g<pD)){for(;f<c&&s.charCodeAt(f)===dr;)f++;for(E=f;f<c;){if(D=s.charCodeAt(f),D===Ut)return;if(D===ou)break;f++}if(s.charCodeAt(f)===ou){if(l)return!0;for(m=[],E!==f&&m.push(s.slice(E,f)),f++,p=s.indexOf(su,f+1),p=p===-1?c:p;f<c;){for(v=!1,b=f,d=p,h=p,A=0;h>b&&s.charCodeAt(h-1)===dr;)h--;for(;h>b&&s.charCodeAt(h-1)===Ut;)A++,h--;for(g<=A&&s.indexOf(DD,b)===h&&(v=!0,d=h);b<=d&&b-f<F&&s.charCodeAt(b)===dr;)b++;if(v)for(;d>b&&s.charCodeAt(d-1)===dr;)d--;if((!v||b!==d)&&m.push(s.slice(b,d)),v)break;f=p+1,p=s.indexOf(su,f+1),p=p===-1?c:p}return m=m.join(`
`),o(s.slice(0,p))({type:"math",value:m,data:{hName:"div",hProperties:{className:hD.concat()},hChildren:[{type:"text",value:m}]}})}}}}function FD(e){let r=e.prototype;r.visitors.math=t;function t(n){return`$$
`+n.value+`
$$`}}});var Du=x((ZC,fu)=>{var gD=uu(),ED=lu();fu.exports=CD;function CD(e){var r=e||{};ED.call(this,r),gD.call(this,r)}});var Ie=x((ev,pu)=>{pu.exports=AD;var vD=Object.prototype.hasOwnProperty;function AD(){for(var e={},r=0;r<arguments.length;r++){var t=arguments[r];for(var n in t)vD.call(t,n)&&(e[n]=t[n])}return e}});var hu=x((rv,Yt)=>{typeof Object.create=="function"?Yt.exports=function(r,t){t&&(r.super_=t,r.prototype=Object.create(t.prototype,{constructor:{value:r,enumerable:!1,writable:!0,configurable:!0}}))}:Yt.exports=function(r,t){if(t){r.super_=t;var n=function(){};n.prototype=t.prototype,r.prototype=new n,r.prototype.constructor=r}}});var Fu=x((tv,mu)=>{"use strict";var bD=Ie(),du=hu();mu.exports=xD;function xD(e){var r,t,n;du(u,e),du(i,u),r=u.prototype;for(t in r)n=r[t],n&&typeof n=="object"&&(r[t]="concat"in n?n.concat():bD(n));return u;function i(a){return e.apply(this,a)}function u(){return this instanceof u?e.apply(this,arguments):new i(arguments)}}});var Eu=x((nv,gu)=>{"use strict";gu.exports=yD;function yD(e,r,t){return n;function n(){var i=t||this,u=i[e];return i[e]=!r,a;function a(){i[e]=u}}}});var vu=x((iv,Cu)=>{"use strict";Cu.exports=wD;function wD(e){for(var r=String(e),t=[],n=/\r?\n|\r/g;n.exec(r);)t.push(n.lastIndex);return t.push(r.length+1),{toPoint:i,toPosition:i,toOffset:u};function i(a){var o=-1;if(a>-1&&a<t[t.length-1]){for(;++o<t.length;)if(t[o]>a)return{line:o+1,column:a-(t[o-1]||0)+1,offset:a}}return{}}function u(a){var o=a&&a.line,s=a&&a.column,l;return!isNaN(o)&&!isNaN(s)&&o-1 in t&&(l=(t[o-2]||0)+s-1||0),l>-1&&l<t[t.length-1]?l:-1}}});var bu=x((uv,Au)=>{"use strict";Au.exports=kD;var Gt="\\";function kD(e,r){return t;function t(n){for(var i=0,u=n.indexOf(Gt),a=e[r],o=[],s;u!==-1;)o.push(n.slice(i,u)),i=u+1,s=n.charAt(i),(!s||a.indexOf(s)===-1)&&o.push(Gt),u=n.indexOf(Gt,i+1);return o.push(n.slice(i)),o.join("")}}});var xu=x((av,TD)=>{TD.exports={AElig:"\xC6",AMP:"&",Aacute:"\xC1",Acirc:"\xC2",Agrave:"\xC0",Aring:"\xC5",Atilde:"\xC3",Auml:"\xC4",COPY:"\xA9",Ccedil:"\xC7",ETH:"\xD0",Eacute:"\xC9",Ecirc:"\xCA",Egrave:"\xC8",Euml:"\xCB",GT:">",Iacute:"\xCD",Icirc:"\xCE",Igrave:"\xCC",Iuml:"\xCF",LT:"<",Ntilde:"\xD1",Oacute:"\xD3",Ocirc:"\xD4",Ograve:"\xD2",Oslash:"\xD8",Otilde:"\xD5",Ouml:"\xD6",QUOT:'"',REG:"\xAE",THORN:"\xDE",Uacute:"\xDA",Ucirc:"\xDB",Ugrave:"\xD9",Uuml:"\xDC",Yacute:"\xDD",aacute:"\xE1",acirc:"\xE2",acute:"\xB4",aelig:"\xE6",agrave:"\xE0",amp:"&",aring:"\xE5",atilde:"\xE3",auml:"\xE4",brvbar:"\xA6",ccedil:"\xE7",cedil:"\xB8",cent:"\xA2",copy:"\xA9",curren:"\xA4",deg:"\xB0",divide:"\xF7",eacute:"\xE9",ecirc:"\xEA",egrave:"\xE8",eth:"\xF0",euml:"\xEB",frac12:"\xBD",frac14:"\xBC",frac34:"\xBE",gt:">",iacute:"\xED",icirc:"\xEE",iexcl:"\xA1",igrave:"\xEC",iquest:"\xBF",iuml:"\xEF",laquo:"\xAB",lt:"<",macr:"\xAF",micro:"\xB5",middot:"\xB7",nbsp:"\xA0",not:"\xAC",ntilde:"\xF1",oacute:"\xF3",ocirc:"\xF4",ograve:"\xF2",ordf:"\xAA",ordm:"\xBA",oslash:"\xF8",otilde:"\xF5",ouml:"\xF6",para:"\xB6",plusmn:"\xB1",pound:"\xA3",quot:'"',raquo:"\xBB",reg:"\xAE",sect:"\xA7",shy:"\xAD",sup1:"\xB9",sup2:"\xB2",sup3:"\xB3",szlig:"\xDF",thorn:"\xFE",times:"\xD7",uacute:"\xFA",ucirc:"\xFB",ugrave:"\xF9",uml:"\xA8",uuml:"\xFC",yacute:"\xFD",yen:"\xA5",yuml:"\xFF"}});var yu=x((ov,BD)=>{BD.exports={"0":"\uFFFD","128":"\u20AC","130":"\u201A","131":"\u0192","132":"\u201E","133":"\u2026","134":"\u2020","135":"\u2021","136":"\u02C6","137":"\u2030","138":"\u0160","139":"\u2039","140":"\u0152","142":"\u017D","145":"\u2018","146":"\u2019","147":"\u201C","148":"\u201D","149":"\u2022","150":"\u2013","151":"\u2014","152":"\u02DC","153":"\u2122","154":"\u0161","155":"\u203A","156":"\u0153","158":"\u017E","159":"\u0178"}});var Se=x((sv,wu)=>{"use strict";wu.exports=_D;function _D(e){var r=typeof e=="string"?e.charCodeAt(0):e;return r>=48&&r<=57}});var Tu=x((cv,ku)=>{"use strict";ku.exports=OD;function OD(e){var r=typeof e=="string"?e.charCodeAt(0):e;return r>=97&&r<=102||r>=65&&r<=70||r>=48&&r<=57}});var $e=x((lv,Bu)=>{"use strict";Bu.exports=qD;function qD(e){var r=typeof e=="string"?e.charCodeAt(0):e;return r>=97&&r<=122||r>=65&&r<=90}});var Ou=x((fv,_u)=>{"use strict";var ND=$e(),PD=Se();_u.exports=ID;function ID(e){return ND(e)||PD(e)}});var qu=x((Dv,SD)=>{SD.exports={AEli:"\xC6",AElig:"\xC6",AM:"&",AMP:"&",Aacut:"\xC1",Aacute:"\xC1",Abreve:"\u0102",Acir:"\xC2",Acirc:"\xC2",Acy:"\u0410",Afr:"\u{1D504}",Agrav:"\xC0",Agrave:"\xC0",Alpha:"\u0391",Amacr:"\u0100",And:"\u2A53",Aogon:"\u0104",Aopf:"\u{1D538}",ApplyFunction:"\u2061",Arin:"\xC5",Aring:"\xC5",Ascr:"\u{1D49C}",Assign:"\u2254",Atild:"\xC3",Atilde:"\xC3",Aum:"\xC4",Auml:"\xC4",Backslash:"\u2216",Barv:"\u2AE7",Barwed:"\u2306",Bcy:"\u0411",Because:"\u2235",Bernoullis:"\u212C",Beta:"\u0392",Bfr:"\u{1D505}",Bopf:"\u{1D539}",Breve:"\u02D8",Bscr:"\u212C",Bumpeq:"\u224E",CHcy:"\u0427",COP:"\xA9",COPY:"\xA9",Cacute:"\u0106",Cap:"\u22D2",CapitalDifferentialD:"\u2145",Cayleys:"\u212D",Ccaron:"\u010C",Ccedi:"\xC7",Ccedil:"\xC7",Ccirc:"\u0108",Cconint:"\u2230",Cdot:"\u010A",Cedilla:"\xB8",CenterDot:"\xB7",Cfr:"\u212D",Chi:"\u03A7",CircleDot:"\u2299",CircleMinus:"\u2296",CirclePlus:"\u2295",CircleTimes:"\u2297",ClockwiseContourIntegral:"\u2232",CloseCurlyDoubleQuote:"\u201D",CloseCurlyQuote:"\u2019",Colon:"\u2237",Colone:"\u2A74",Congruent:"\u2261",Conint:"\u222F",ContourIntegral:"\u222E",Copf:"\u2102",Coproduct:"\u2210",CounterClockwiseContourIntegral:"\u2233",Cross:"\u2A2F",Cscr:"\u{1D49E}",Cup:"\u22D3",CupCap:"\u224D",DD:"\u2145",DDotrahd:"\u2911",DJcy:"\u0402",DScy:"\u0405",DZcy:"\u040F",Dagger:"\u2021",Darr:"\u21A1",Dashv:"\u2AE4",Dcaron:"\u010E",Dcy:"\u0414",Del:"\u2207",Delta:"\u0394",Dfr:"\u{1D507}",DiacriticalAcute:"\xB4",DiacriticalDot:"\u02D9",DiacriticalDoubleAcute:"\u02DD",DiacriticalGrave:"`",DiacriticalTilde:"\u02DC",Diamond:"\u22C4",DifferentialD:"\u2146",Dopf:"\u{1D53B}",Dot:"\xA8",DotDot:"\u20DC",DotEqual:"\u2250",DoubleContourIntegral:"\u222F",DoubleDot:"\xA8",DoubleDownArrow:"\u21D3",DoubleLeftArrow:"\u21D0",DoubleLeftRightArrow:"\u21D4",DoubleLeftTee:"\u2AE4",DoubleLongLeftArrow:"\u27F8",DoubleLongLeftRightArrow:"\u27FA",DoubleLongRightArrow:"\u27F9",DoubleRightArrow:"\u21D2",DoubleRightTee:"\u22A8",DoubleUpArrow:"\u21D1",DoubleUpDownArrow:"\u21D5",DoubleVerticalBar:"\u2225",DownArrow:"\u2193",DownArrowBar:"\u2913",DownArrowUpArrow:"\u21F5",DownBreve:"\u0311",DownLeftRightVector:"\u2950",DownLeftTeeVector:"\u295E",DownLeftVector:"\u21BD",DownLeftVectorBar:"\u2956",DownRightTeeVector:"\u295F",DownRightVector:"\u21C1",DownRightVectorBar:"\u2957",DownTee:"\u22A4",DownTeeArrow:"\u21A7",Downarrow:"\u21D3",Dscr:"\u{1D49F}",Dstrok:"\u0110",ENG:"\u014A",ET:"\xD0",ETH:"\xD0",Eacut:"\xC9",Eacute:"\xC9",Ecaron:"\u011A",Ecir:"\xCA",Ecirc:"\xCA",Ecy:"\u042D",Edot:"\u0116",Efr:"\u{1D508}",Egrav:"\xC8",Egrave:"\xC8",Element:"\u2208",Emacr:"\u0112",EmptySmallSquare:"\u25FB",EmptyVerySmallSquare:"\u25AB",Eogon:"\u0118",Eopf:"\u{1D53C}",Epsilon:"\u0395",Equal:"\u2A75",EqualTilde:"\u2242",Equilibrium:"\u21CC",Escr:"\u2130",Esim:"\u2A73",Eta:"\u0397",Eum:"\xCB",Euml:"\xCB",Exists:"\u2203",ExponentialE:"\u2147",Fcy:"\u0424",Ffr:"\u{1D509}",FilledSmallSquare:"\u25FC",FilledVerySmallSquare:"\u25AA",Fopf:"\u{1D53D}",ForAll:"\u2200",Fouriertrf:"\u2131",Fscr:"\u2131",GJcy:"\u0403",G:">",GT:">",Gamma:"\u0393",Gammad:"\u03DC",Gbreve:"\u011E",Gcedil:"\u0122",Gcirc:"\u011C",Gcy:"\u0413",Gdot:"\u0120",Gfr:"\u{1D50A}",Gg:"\u22D9",Gopf:"\u{1D53E}",GreaterEqual:"\u2265",GreaterEqualLess:"\u22DB",GreaterFullEqual:"\u2267",GreaterGreater:"\u2AA2",GreaterLess:"\u2277",GreaterSlantEqual:"\u2A7E",GreaterTilde:"\u2273",Gscr:"\u{1D4A2}",Gt:"\u226B",HARDcy:"\u042A",Hacek:"\u02C7",Hat:"^",Hcirc:"\u0124",Hfr:"\u210C",HilbertSpace:"\u210B",Hopf:"\u210D",HorizontalLine:"\u2500",Hscr:"\u210B",Hstrok:"\u0126",HumpDownHump:"\u224E",HumpEqual:"\u224F",IEcy:"\u0415",IJlig:"\u0132",IOcy:"\u0401",Iacut:"\xCD",Iacute:"\xCD",Icir:"\xCE",Icirc:"\xCE",Icy:"\u0418",Idot:"\u0130",Ifr:"\u2111",Igrav:"\xCC",Igrave:"\xCC",Im:"\u2111",Imacr:"\u012A",ImaginaryI:"\u2148",Implies:"\u21D2",Int:"\u222C",Integral:"\u222B",Intersection:"\u22C2",InvisibleComma:"\u2063",InvisibleTimes:"\u2062",Iogon:"\u012E",Iopf:"\u{1D540}",Iota:"\u0399",Iscr:"\u2110",Itilde:"\u0128",Iukcy:"\u0406",Ium:"\xCF",Iuml:"\xCF",Jcirc:"\u0134",Jcy:"\u0419",Jfr:"\u{1D50D}",Jopf:"\u{1D541}",Jscr:"\u{1D4A5}",Jsercy:"\u0408",Jukcy:"\u0404",KHcy:"\u0425",KJcy:"\u040C",Kappa:"\u039A",Kcedil:"\u0136",Kcy:"\u041A",Kfr:"\u{1D50E}",Kopf:"\u{1D542}",Kscr:"\u{1D4A6}",LJcy:"\u0409",L:"<",LT:"<",Lacute:"\u0139",Lambda:"\u039B",Lang:"\u27EA",Laplacetrf:"\u2112",Larr:"\u219E",Lcaron:"\u013D",Lcedil:"\u013B",Lcy:"\u041B",LeftAngleBracket:"\u27E8",LeftArrow:"\u2190",LeftArrowBar:"\u21E4",LeftArrowRightArrow:"\u21C6",LeftCeiling:"\u2308",LeftDoubleBracket:"\u27E6",LeftDownTeeVector:"\u2961",LeftDownVector:"\u21C3",LeftDownVectorBar:"\u2959",LeftFloor:"\u230A",LeftRightArrow:"\u2194",LeftRightVector:"\u294E",LeftTee:"\u22A3",LeftTeeArrow:"\u21A4",LeftTeeVector:"\u295A",LeftTriangle:"\u22B2",LeftTriangleBar:"\u29CF",LeftTriangleEqual:"\u22B4",LeftUpDownVector:"\u2951",LeftUpTeeVector:"\u2960",LeftUpVector:"\u21BF",LeftUpVectorBar:"\u2958",LeftVector:"\u21BC",LeftVectorBar:"\u2952",Leftarrow:"\u21D0",Leftrightarrow:"\u21D4",LessEqualGreater:"\u22DA",LessFullEqual:"\u2266",LessGreater:"\u2276",LessLess:"\u2AA1",LessSlantEqual:"\u2A7D",LessTilde:"\u2272",Lfr:"\u{1D50F}",Ll:"\u22D8",Lleftarrow:"\u21DA",Lmidot:"\u013F",LongLeftArrow:"\u27F5",LongLeftRightArrow:"\u27F7",LongRightArrow:"\u27F6",Longleftarrow:"\u27F8",Longleftrightarrow:"\u27FA",Longrightarrow:"\u27F9",Lopf:"\u{1D543}",LowerLeftArrow:"\u2199",LowerRightArrow:"\u2198",Lscr:"\u2112",Lsh:"\u21B0",Lstrok:"\u0141",Lt:"\u226A",Map:"\u2905",Mcy:"\u041C",MediumSpace:"\u205F",Mellintrf:"\u2133",Mfr:"\u{1D510}",MinusPlus:"\u2213",Mopf:"\u{1D544}",Mscr:"\u2133",Mu:"\u039C",NJcy:"\u040A",Nacute:"\u0143",Ncaron:"\u0147",Ncedil:"\u0145",Ncy:"\u041D",NegativeMediumSpace:"\u200B",NegativeThickSpace:"\u200B",NegativeThinSpace:"\u200B",NegativeVeryThinSpace:"\u200B",NestedGreaterGreater:"\u226B",NestedLessLess:"\u226A",NewLine:`
`,Nfr:"\u{1D511}",NoBreak:"\u2060",NonBreakingSpace:"\xA0",Nopf:"\u2115",Not:"\u2AEC",NotCongruent:"\u2262",NotCupCap:"\u226D",NotDoubleVerticalBar:"\u2226",NotElement:"\u2209",NotEqual:"\u2260",NotEqualTilde:"\u2242\u0338",NotExists:"\u2204",NotGreater:"\u226F",NotGreaterEqual:"\u2271",NotGreaterFullEqual:"\u2267\u0338",NotGreaterGreater:"\u226B\u0338",NotGreaterLess:"\u2279",NotGreaterSlantEqual:"\u2A7E\u0338",NotGreaterTilde:"\u2275",NotHumpDownHump:"\u224E\u0338",NotHumpEqual:"\u224F\u0338",NotLeftTriangle:"\u22EA",NotLeftTriangleBar:"\u29CF\u0338",NotLeftTriangleEqual:"\u22EC",NotLess:"\u226E",NotLessEqual:"\u2270",NotLessGreater:"\u2278",NotLessLess:"\u226A\u0338",NotLessSlantEqual:"\u2A7D\u0338",NotLessTilde:"\u2274",NotNestedGreaterGreater:"\u2AA2\u0338",NotNestedLessLess:"\u2AA1\u0338",NotPrecedes:"\u2280",NotPrecedesEqual:"\u2AAF\u0338",NotPrecedesSlantEqual:"\u22E0",NotReverseElement:"\u220C",NotRightTriangle:"\u22EB",NotRightTriangleBar:"\u29D0\u0338",NotRightTriangleEqual:"\u22ED",NotSquareSubset:"\u228F\u0338",NotSquareSubsetEqual:"\u22E2",NotSquareSuperset:"\u2290\u0338",NotSquareSupersetEqual:"\u22E3",NotSubset:"\u2282\u20D2",NotSubsetEqual:"\u2288",NotSucceeds:"\u2281",NotSucceedsEqual:"\u2AB0\u0338",NotSucceedsSlantEqual:"\u22E1",NotSucceedsTilde:"\u227F\u0338",NotSuperset:"\u2283\u20D2",NotSupersetEqual:"\u2289",NotTilde:"\u2241",NotTildeEqual:"\u2244",NotTildeFullEqual:"\u2247",NotTildeTilde:"\u2249",NotVerticalBar:"\u2224",Nscr:"\u{1D4A9}",Ntild:"\xD1",Ntilde:"\xD1",Nu:"\u039D",OElig:"\u0152",Oacut:"\xD3",Oacute:"\xD3",Ocir:"\xD4",Ocirc:"\xD4",Ocy:"\u041E",Odblac:"\u0150",Ofr:"\u{1D512}",Ograv:"\xD2",Ograve:"\xD2",Omacr:"\u014C",Omega:"\u03A9",Omicron:"\u039F",Oopf:"\u{1D546}",OpenCurlyDoubleQuote:"\u201C",OpenCurlyQuote:"\u2018",Or:"\u2A54",Oscr:"\u{1D4AA}",Oslas:"\xD8",Oslash:"\xD8",Otild:"\xD5",Otilde:"\xD5",Otimes:"\u2A37",Oum:"\xD6",Ouml:"\xD6",OverBar:"\u203E",OverBrace:"\u23DE",OverBracket:"\u23B4",OverParenthesis:"\u23DC",PartialD:"\u2202",Pcy:"\u041F",Pfr:"\u{1D513}",Phi:"\u03A6",Pi:"\u03A0",PlusMinus:"\xB1",Poincareplane:"\u210C",Popf:"\u2119",Pr:"\u2ABB",Precedes:"\u227A",PrecedesEqual:"\u2AAF",PrecedesSlantEqual:"\u227C",PrecedesTilde:"\u227E",Prime:"\u2033",Product:"\u220F",Proportion:"\u2237",Proportional:"\u221D",Pscr:"\u{1D4AB}",Psi:"\u03A8",QUO:'"',QUOT:'"',Qfr:"\u{1D514}",Qopf:"\u211A",Qscr:"\u{1D4AC}",RBarr:"\u2910",RE:"\xAE",REG:"\xAE",Racute:"\u0154",Rang:"\u27EB",Rarr:"\u21A0",Rarrtl:"\u2916",Rcaron:"\u0158",Rcedil:"\u0156",Rcy:"\u0420",Re:"\u211C",ReverseElement:"\u220B",ReverseEquilibrium:"\u21CB",ReverseUpEquilibrium:"\u296F",Rfr:"\u211C",Rho:"\u03A1",RightAngleBracket:"\u27E9",RightArrow:"\u2192",RightArrowBar:"\u21E5",RightArrowLeftArrow:"\u21C4",RightCeiling:"\u2309",RightDoubleBracket:"\u27E7",RightDownTeeVector:"\u295D",RightDownVector:"\u21C2",RightDownVectorBar:"\u2955",RightFloor:"\u230B",RightTee:"\u22A2",RightTeeArrow:"\u21A6",RightTeeVector:"\u295B",RightTriangle:"\u22B3",RightTriangleBar:"\u29D0",RightTriangleEqual:"\u22B5",RightUpDownVector:"\u294F",RightUpTeeVector:"\u295C",RightUpVector:"\u21BE",RightUpVectorBar:"\u2954",RightVector:"\u21C0",RightVectorBar:"\u2953",Rightarrow:"\u21D2",Ropf:"\u211D",RoundImplies:"\u2970",Rrightarrow:"\u21DB",Rscr:"\u211B",Rsh:"\u21B1",RuleDelayed:"\u29F4",SHCHcy:"\u0429",SHcy:"\u0428",SOFTcy:"\u042C",Sacute:"\u015A",Sc:"\u2ABC",Scaron:"\u0160",Scedil:"\u015E",Scirc:"\u015C",Scy:"\u0421",Sfr:"\u{1D516}",ShortDownArrow:"\u2193",ShortLeftArrow:"\u2190",ShortRightArrow:"\u2192",ShortUpArrow:"\u2191",Sigma:"\u03A3",SmallCircle:"\u2218",Sopf:"\u{1D54A}",Sqrt:"\u221A",Square:"\u25A1",SquareIntersection:"\u2293",SquareSubset:"\u228F",SquareSubsetEqual:"\u2291",SquareSuperset:"\u2290",SquareSupersetEqual:"\u2292",SquareUnion:"\u2294",Sscr:"\u{1D4AE}",Star:"\u22C6",Sub:"\u22D0",Subset:"\u22D0",SubsetEqual:"\u2286",Succeeds:"\u227B",SucceedsEqual:"\u2AB0",SucceedsSlantEqual:"\u227D",SucceedsTilde:"\u227F",SuchThat:"\u220B",Sum:"\u2211",Sup:"\u22D1",Superset:"\u2283",SupersetEqual:"\u2287",Supset:"\u22D1",THOR:"\xDE",THORN:"\xDE",TRADE:"\u2122",TSHcy:"\u040B",TScy:"\u0426",Tab:"	",Tau:"\u03A4",Tcaron:"\u0164",Tcedil:"\u0162",Tcy:"\u0422",Tfr:"\u{1D517}",Therefore:"\u2234",Theta:"\u0398",ThickSpace:"\u205F\u200A",ThinSpace:"\u2009",Tilde:"\u223C",TildeEqual:"\u2243",TildeFullEqual:"\u2245",TildeTilde:"\u2248",Topf:"\u{1D54B}",TripleDot:"\u20DB",Tscr:"\u{1D4AF}",Tstrok:"\u0166",Uacut:"\xDA",Uacute:"\xDA",Uarr:"\u219F",Uarrocir:"\u2949",Ubrcy:"\u040E",Ubreve:"\u016C",Ucir:"\xDB",Ucirc:"\xDB",Ucy:"\u0423",Udblac:"\u0170",Ufr:"\u{1D518}",Ugrav:"\xD9",Ugrave:"\xD9",Umacr:"\u016A",UnderBar:"_",UnderBrace:"\u23DF",UnderBracket:"\u23B5",UnderParenthesis:"\u23DD",Union:"\u22C3",UnionPlus:"\u228E",Uogon:"\u0172",Uopf:"\u{1D54C}",UpArrow:"\u2191",UpArrowBar:"\u2912",UpArrowDownArrow:"\u21C5",UpDownArrow:"\u2195",UpEquilibrium:"\u296E",UpTee:"\u22A5",UpTeeArrow:"\u21A5",Uparrow:"\u21D1",Updownarrow:"\u21D5",UpperLeftArrow:"\u2196",UpperRightArrow:"\u2197",Upsi:"\u03D2",Upsilon:"\u03A5",Uring:"\u016E",Uscr:"\u{1D4B0}",Utilde:"\u0168",Uum:"\xDC",Uuml:"\xDC",VDash:"\u22AB",Vbar:"\u2AEB",Vcy:"\u0412",Vdash:"\u22A9",Vdashl:"\u2AE6",Vee:"\u22C1",Verbar:"\u2016",Vert:"\u2016",VerticalBar:"\u2223",VerticalLine:"|",VerticalSeparator:"\u2758",VerticalTilde:"\u2240",VeryThinSpace:"\u200A",Vfr:"\u{1D519}",Vopf:"\u{1D54D}",Vscr:"\u{1D4B1}",Vvdash:"\u22AA",Wcirc:"\u0174",Wedge:"\u22C0",Wfr:"\u{1D51A}",Wopf:"\u{1D54E}",Wscr:"\u{1D4B2}",Xfr:"\u{1D51B}",Xi:"\u039E",Xopf:"\u{1D54F}",Xscr:"\u{1D4B3}",YAcy:"\u042F",YIcy:"\u0407",YUcy:"\u042E",Yacut:"\xDD",Yacute:"\xDD",Ycirc:"\u0176",Ycy:"\u042B",Yfr:"\u{1D51C}",Yopf:"\u{1D550}",Yscr:"\u{1D4B4}",Yuml:"\u0178",ZHcy:"\u0416",Zacute:"\u0179",Zcaron:"\u017D",Zcy:"\u0417",Zdot:"\u017B",ZeroWidthSpace:"\u200B",Zeta:"\u0396",Zfr:"\u2128",Zopf:"\u2124",Zscr:"\u{1D4B5}",aacut:"\xE1",aacute:"\xE1",abreve:"\u0103",ac:"\u223E",acE:"\u223E\u0333",acd:"\u223F",acir:"\xE2",acirc:"\xE2",acut:"\xB4",acute:"\xB4",acy:"\u0430",aeli:"\xE6",aelig:"\xE6",af:"\u2061",afr:"\u{1D51E}",agrav:"\xE0",agrave:"\xE0",alefsym:"\u2135",aleph:"\u2135",alpha:"\u03B1",amacr:"\u0101",amalg:"\u2A3F",am:"&",amp:"&",and:"\u2227",andand:"\u2A55",andd:"\u2A5C",andslope:"\u2A58",andv:"\u2A5A",ang:"\u2220",ange:"\u29A4",angle:"\u2220",angmsd:"\u2221",angmsdaa:"\u29A8",angmsdab:"\u29A9",angmsdac:"\u29AA",angmsdad:"\u29AB",angmsdae:"\u29AC",angmsdaf:"\u29AD",angmsdag:"\u29AE",angmsdah:"\u29AF",angrt:"\u221F",angrtvb:"\u22BE",angrtvbd:"\u299D",angsph:"\u2222",angst:"\xC5",angzarr:"\u237C",aogon:"\u0105",aopf:"\u{1D552}",ap:"\u2248",apE:"\u2A70",apacir:"\u2A6F",ape:"\u224A",apid:"\u224B",apos:"'",approx:"\u2248",approxeq:"\u224A",arin:"\xE5",aring:"\xE5",ascr:"\u{1D4B6}",ast:"*",asymp:"\u2248",asympeq:"\u224D",atild:"\xE3",atilde:"\xE3",aum:"\xE4",auml:"\xE4",awconint:"\u2233",awint:"\u2A11",bNot:"\u2AED",backcong:"\u224C",backepsilon:"\u03F6",backprime:"\u2035",backsim:"\u223D",backsimeq:"\u22CD",barvee:"\u22BD",barwed:"\u2305",barwedge:"\u2305",bbrk:"\u23B5",bbrktbrk:"\u23B6",bcong:"\u224C",bcy:"\u0431",bdquo:"\u201E",becaus:"\u2235",because:"\u2235",bemptyv:"\u29B0",bepsi:"\u03F6",bernou:"\u212C",beta:"\u03B2",beth:"\u2136",between:"\u226C",bfr:"\u{1D51F}",bigcap:"\u22C2",bigcirc:"\u25EF",bigcup:"\u22C3",bigodot:"\u2A00",bigoplus:"\u2A01",bigotimes:"\u2A02",bigsqcup:"\u2A06",bigstar:"\u2605",bigtriangledown:"\u25BD",bigtriangleup:"\u25B3",biguplus:"\u2A04",bigvee:"\u22C1",bigwedge:"\u22C0",bkarow:"\u290D",blacklozenge:"\u29EB",blacksquare:"\u25AA",blacktriangle:"\u25B4",blacktriangledown:"\u25BE",blacktriangleleft:"\u25C2",blacktriangleright:"\u25B8",blank:"\u2423",blk12:"\u2592",blk14:"\u2591",blk34:"\u2593",block:"\u2588",bne:"=\u20E5",bnequiv:"\u2261\u20E5",bnot:"\u2310",bopf:"\u{1D553}",bot:"\u22A5",bottom:"\u22A5",bowtie:"\u22C8",boxDL:"\u2557",boxDR:"\u2554",boxDl:"\u2556",boxDr:"\u2553",boxH:"\u2550",boxHD:"\u2566",boxHU:"\u2569",boxHd:"\u2564",boxHu:"\u2567",boxUL:"\u255D",boxUR:"\u255A",boxUl:"\u255C",boxUr:"\u2559",boxV:"\u2551",boxVH:"\u256C",boxVL:"\u2563",boxVR:"\u2560",boxVh:"\u256B",boxVl:"\u2562",boxVr:"\u255F",boxbox:"\u29C9",boxdL:"\u2555",boxdR:"\u2552",boxdl:"\u2510",boxdr:"\u250C",boxh:"\u2500",boxhD:"\u2565",boxhU:"\u2568",boxhd:"\u252C",boxhu:"\u2534",boxminus:"\u229F",boxplus:"\u229E",boxtimes:"\u22A0",boxuL:"\u255B",boxuR:"\u2558",boxul:"\u2518",boxur:"\u2514",boxv:"\u2502",boxvH:"\u256A",boxvL:"\u2561",boxvR:"\u255E",boxvh:"\u253C",boxvl:"\u2524",boxvr:"\u251C",bprime:"\u2035",breve:"\u02D8",brvba:"\xA6",brvbar:"\xA6",bscr:"\u{1D4B7}",bsemi:"\u204F",bsim:"\u223D",bsime:"\u22CD",bsol:"\\",bsolb:"\u29C5",bsolhsub:"\u27C8",bull:"\u2022",bullet:"\u2022",bump:"\u224E",bumpE:"\u2AAE",bumpe:"\u224F",bumpeq:"\u224F",cacute:"\u0107",cap:"\u2229",capand:"\u2A44",capbrcup:"\u2A49",capcap:"\u2A4B",capcup:"\u2A47",capdot:"\u2A40",caps:"\u2229\uFE00",caret:"\u2041",caron:"\u02C7",ccaps:"\u2A4D",ccaron:"\u010D",ccedi:"\xE7",ccedil:"\xE7",ccirc:"\u0109",ccups:"\u2A4C",ccupssm:"\u2A50",cdot:"\u010B",cedi:"\xB8",cedil:"\xB8",cemptyv:"\u29B2",cen:"\xA2",cent:"\xA2",centerdot:"\xB7",cfr:"\u{1D520}",chcy:"\u0447",check:"\u2713",checkmark:"\u2713",chi:"\u03C7",cir:"\u25CB",cirE:"\u29C3",circ:"\u02C6",circeq:"\u2257",circlearrowleft:"\u21BA",circlearrowright:"\u21BB",circledR:"\xAE",circledS:"\u24C8",circledast:"\u229B",circledcirc:"\u229A",circleddash:"\u229D",cire:"\u2257",cirfnint:"\u2A10",cirmid:"\u2AEF",cirscir:"\u29C2",clubs:"\u2663",clubsuit:"\u2663",colon:":",colone:"\u2254",coloneq:"\u2254",comma:",",commat:"@",comp:"\u2201",compfn:"\u2218",complement:"\u2201",complexes:"\u2102",cong:"\u2245",congdot:"\u2A6D",conint:"\u222E",copf:"\u{1D554}",coprod:"\u2210",cop:"\xA9",copy:"\xA9",copysr:"\u2117",crarr:"\u21B5",cross:"\u2717",cscr:"\u{1D4B8}",csub:"\u2ACF",csube:"\u2AD1",csup:"\u2AD0",csupe:"\u2AD2",ctdot:"\u22EF",cudarrl:"\u2938",cudarrr:"\u2935",cuepr:"\u22DE",cuesc:"\u22DF",cularr:"\u21B6",cularrp:"\u293D",cup:"\u222A",cupbrcap:"\u2A48",cupcap:"\u2A46",cupcup:"\u2A4A",cupdot:"\u228D",cupor:"\u2A45",cups:"\u222A\uFE00",curarr:"\u21B7",curarrm:"\u293C",curlyeqprec:"\u22DE",curlyeqsucc:"\u22DF",curlyvee:"\u22CE",curlywedge:"\u22CF",curre:"\xA4",curren:"\xA4",curvearrowleft:"\u21B6",curvearrowright:"\u21B7",cuvee:"\u22CE",cuwed:"\u22CF",cwconint:"\u2232",cwint:"\u2231",cylcty:"\u232D",dArr:"\u21D3",dHar:"\u2965",dagger:"\u2020",daleth:"\u2138",darr:"\u2193",dash:"\u2010",dashv:"\u22A3",dbkarow:"\u290F",dblac:"\u02DD",dcaron:"\u010F",dcy:"\u0434",dd:"\u2146",ddagger:"\u2021",ddarr:"\u21CA",ddotseq:"\u2A77",de:"\xB0",deg:"\xB0",delta:"\u03B4",demptyv:"\u29B1",dfisht:"\u297F",dfr:"\u{1D521}",dharl:"\u21C3",dharr:"\u21C2",diam:"\u22C4",diamond:"\u22C4",diamondsuit:"\u2666",diams:"\u2666",die:"\xA8",digamma:"\u03DD",disin:"\u22F2",div:"\xF7",divid:"\xF7",divide:"\xF7",divideontimes:"\u22C7",divonx:"\u22C7",djcy:"\u0452",dlcorn:"\u231E",dlcrop:"\u230D",dollar:"$",dopf:"\u{1D555}",dot:"\u02D9",doteq:"\u2250",doteqdot:"\u2251",dotminus:"\u2238",dotplus:"\u2214",dotsquare:"\u22A1",doublebarwedge:"\u2306",downarrow:"\u2193",downdownarrows:"\u21CA",downharpoonleft:"\u21C3",downharpoonright:"\u21C2",drbkarow:"\u2910",drcorn:"\u231F",drcrop:"\u230C",dscr:"\u{1D4B9}",dscy:"\u0455",dsol:"\u29F6",dstrok:"\u0111",dtdot:"\u22F1",dtri:"\u25BF",dtrif:"\u25BE",duarr:"\u21F5",duhar:"\u296F",dwangle:"\u29A6",dzcy:"\u045F",dzigrarr:"\u27FF",eDDot:"\u2A77",eDot:"\u2251",eacut:"\xE9",eacute:"\xE9",easter:"\u2A6E",ecaron:"\u011B",ecir:"\xEA",ecirc:"\xEA",ecolon:"\u2255",ecy:"\u044D",edot:"\u0117",ee:"\u2147",efDot:"\u2252",efr:"\u{1D522}",eg:"\u2A9A",egrav:"\xE8",egrave:"\xE8",egs:"\u2A96",egsdot:"\u2A98",el:"\u2A99",elinters:"\u23E7",ell:"\u2113",els:"\u2A95",elsdot:"\u2A97",emacr:"\u0113",empty:"\u2205",emptyset:"\u2205",emptyv:"\u2205",emsp13:"\u2004",emsp14:"\u2005",emsp:"\u2003",eng:"\u014B",ensp:"\u2002",eogon:"\u0119",eopf:"\u{1D556}",epar:"\u22D5",eparsl:"\u29E3",eplus:"\u2A71",epsi:"\u03B5",epsilon:"\u03B5",epsiv:"\u03F5",eqcirc:"\u2256",eqcolon:"\u2255",eqsim:"\u2242",eqslantgtr:"\u2A96",eqslantless:"\u2A95",equals:"=",equest:"\u225F",equiv:"\u2261",equivDD:"\u2A78",eqvparsl:"\u29E5",erDot:"\u2253",erarr:"\u2971",escr:"\u212F",esdot:"\u2250",esim:"\u2242",eta:"\u03B7",et:"\xF0",eth:"\xF0",eum:"\xEB",euml:"\xEB",euro:"\u20AC",excl:"!",exist:"\u2203",expectation:"\u2130",exponentiale:"\u2147",fallingdotseq:"\u2252",fcy:"\u0444",female:"\u2640",ffilig:"\uFB03",fflig:"\uFB00",ffllig:"\uFB04",ffr:"\u{1D523}",filig:"\uFB01",fjlig:"fj",flat:"\u266D",fllig:"\uFB02",fltns:"\u25B1",fnof:"\u0192",fopf:"\u{1D557}",forall:"\u2200",fork:"\u22D4",forkv:"\u2AD9",fpartint:"\u2A0D",frac1:"\xBC",frac12:"\xBD",frac13:"\u2153",frac14:"\xBC",frac15:"\u2155",frac16:"\u2159",frac18:"\u215B",frac23:"\u2154",frac25:"\u2156",frac3:"\xBE",frac34:"\xBE",frac35:"\u2157",frac38:"\u215C",frac45:"\u2158",frac56:"\u215A",frac58:"\u215D",frac78:"\u215E",frasl:"\u2044",frown:"\u2322",fscr:"\u{1D4BB}",gE:"\u2267",gEl:"\u2A8C",gacute:"\u01F5",gamma:"\u03B3",gammad:"\u03DD",gap:"\u2A86",gbreve:"\u011F",gcirc:"\u011D",gcy:"\u0433",gdot:"\u0121",ge:"\u2265",gel:"\u22DB",geq:"\u2265",geqq:"\u2267",geqslant:"\u2A7E",ges:"\u2A7E",gescc:"\u2AA9",gesdot:"\u2A80",gesdoto:"\u2A82",gesdotol:"\u2A84",gesl:"\u22DB\uFE00",gesles:"\u2A94",gfr:"\u{1D524}",gg:"\u226B",ggg:"\u22D9",gimel:"\u2137",gjcy:"\u0453",gl:"\u2277",glE:"\u2A92",gla:"\u2AA5",glj:"\u2AA4",gnE:"\u2269",gnap:"\u2A8A",gnapprox:"\u2A8A",gne:"\u2A88",gneq:"\u2A88",gneqq:"\u2269",gnsim:"\u22E7",gopf:"\u{1D558}",grave:"`",gscr:"\u210A",gsim:"\u2273",gsime:"\u2A8E",gsiml:"\u2A90",g:">",gt:">",gtcc:"\u2AA7",gtcir:"\u2A7A",gtdot:"\u22D7",gtlPar:"\u2995",gtquest:"\u2A7C",gtrapprox:"\u2A86",gtrarr:"\u2978",gtrdot:"\u22D7",gtreqless:"\u22DB",gtreqqless:"\u2A8C",gtrless:"\u2277",gtrsim:"\u2273",gvertneqq:"\u2269\uFE00",gvnE:"\u2269\uFE00",hArr:"\u21D4",hairsp:"\u200A",half:"\xBD",hamilt:"\u210B",hardcy:"\u044A",harr:"\u2194",harrcir:"\u2948",harrw:"\u21AD",hbar:"\u210F",hcirc:"\u0125",hearts:"\u2665",heartsuit:"\u2665",hellip:"\u2026",hercon:"\u22B9",hfr:"\u{1D525}",hksearow:"\u2925",hkswarow:"\u2926",hoarr:"\u21FF",homtht:"\u223B",hookleftarrow:"\u21A9",hookrightarrow:"\u21AA",hopf:"\u{1D559}",horbar:"\u2015",hscr:"\u{1D4BD}",hslash:"\u210F",hstrok:"\u0127",hybull:"\u2043",hyphen:"\u2010",iacut:"\xED",iacute:"\xED",ic:"\u2063",icir:"\xEE",icirc:"\xEE",icy:"\u0438",iecy:"\u0435",iexc:"\xA1",iexcl:"\xA1",iff:"\u21D4",ifr:"\u{1D526}",igrav:"\xEC",igrave:"\xEC",ii:"\u2148",iiiint:"\u2A0C",iiint:"\u222D",iinfin:"\u29DC",iiota:"\u2129",ijlig:"\u0133",imacr:"\u012B",image:"\u2111",imagline:"\u2110",imagpart:"\u2111",imath:"\u0131",imof:"\u22B7",imped:"\u01B5",in:"\u2208",incare:"\u2105",infin:"\u221E",infintie:"\u29DD",inodot:"\u0131",int:"\u222B",intcal:"\u22BA",integers:"\u2124",intercal:"\u22BA",intlarhk:"\u2A17",intprod:"\u2A3C",iocy:"\u0451",iogon:"\u012F",iopf:"\u{1D55A}",iota:"\u03B9",iprod:"\u2A3C",iques:"\xBF",iquest:"\xBF",iscr:"\u{1D4BE}",isin:"\u2208",isinE:"\u22F9",isindot:"\u22F5",isins:"\u22F4",isinsv:"\u22F3",isinv:"\u2208",it:"\u2062",itilde:"\u0129",iukcy:"\u0456",ium:"\xEF",iuml:"\xEF",jcirc:"\u0135",jcy:"\u0439",jfr:"\u{1D527}",jmath:"\u0237",jopf:"\u{1D55B}",jscr:"\u{1D4BF}",jsercy:"\u0458",jukcy:"\u0454",kappa:"\u03BA",kappav:"\u03F0",kcedil:"\u0137",kcy:"\u043A",kfr:"\u{1D528}",kgreen:"\u0138",khcy:"\u0445",kjcy:"\u045C",kopf:"\u{1D55C}",kscr:"\u{1D4C0}",lAarr:"\u21DA",lArr:"\u21D0",lAtail:"\u291B",lBarr:"\u290E",lE:"\u2266",lEg:"\u2A8B",lHar:"\u2962",lacute:"\u013A",laemptyv:"\u29B4",lagran:"\u2112",lambda:"\u03BB",lang:"\u27E8",langd:"\u2991",langle:"\u27E8",lap:"\u2A85",laqu:"\xAB",laquo:"\xAB",larr:"\u2190",larrb:"\u21E4",larrbfs:"\u291F",larrfs:"\u291D",larrhk:"\u21A9",larrlp:"\u21AB",larrpl:"\u2939",larrsim:"\u2973",larrtl:"\u21A2",lat:"\u2AAB",latail:"\u2919",late:"\u2AAD",lates:"\u2AAD\uFE00",lbarr:"\u290C",lbbrk:"\u2772",lbrace:"{",lbrack:"[",lbrke:"\u298B",lbrksld:"\u298F",lbrkslu:"\u298D",lcaron:"\u013E",lcedil:"\u013C",lceil:"\u2308",lcub:"{",lcy:"\u043B",ldca:"\u2936",ldquo:"\u201C",ldquor:"\u201E",ldrdhar:"\u2967",ldrushar:"\u294B",ldsh:"\u21B2",le:"\u2264",leftarrow:"\u2190",leftarrowtail:"\u21A2",leftharpoondown:"\u21BD",leftharpoonup:"\u21BC",leftleftarrows:"\u21C7",leftrightarrow:"\u2194",leftrightarrows:"\u21C6",leftrightharpoons:"\u21CB",leftrightsquigarrow:"\u21AD",leftthreetimes:"\u22CB",leg:"\u22DA",leq:"\u2264",leqq:"\u2266",leqslant:"\u2A7D",les:"\u2A7D",lescc:"\u2AA8",lesdot:"\u2A7F",lesdoto:"\u2A81",lesdotor:"\u2A83",lesg:"\u22DA\uFE00",lesges:"\u2A93",lessapprox:"\u2A85",lessdot:"\u22D6",lesseqgtr:"\u22DA",lesseqqgtr:"\u2A8B",lessgtr:"\u2276",lesssim:"\u2272",lfisht:"\u297C",lfloor:"\u230A",lfr:"\u{1D529}",lg:"\u2276",lgE:"\u2A91",lhard:"\u21BD",lharu:"\u21BC",lharul:"\u296A",lhblk:"\u2584",ljcy:"\u0459",ll:"\u226A",llarr:"\u21C7",llcorner:"\u231E",llhard:"\u296B",lltri:"\u25FA",lmidot:"\u0140",lmoust:"\u23B0",lmoustache:"\u23B0",lnE:"\u2268",lnap:"\u2A89",lnapprox:"\u2A89",lne:"\u2A87",lneq:"\u2A87",lneqq:"\u2268",lnsim:"\u22E6",loang:"\u27EC",loarr:"\u21FD",lobrk:"\u27E6",longleftarrow:"\u27F5",longleftrightarrow:"\u27F7",longmapsto:"\u27FC",longrightarrow:"\u27F6",looparrowleft:"\u21AB",looparrowright:"\u21AC",lopar:"\u2985",lopf:"\u{1D55D}",loplus:"\u2A2D",lotimes:"\u2A34",lowast:"\u2217",lowbar:"_",loz:"\u25CA",lozenge:"\u25CA",lozf:"\u29EB",lpar:"(",lparlt:"\u2993",lrarr:"\u21C6",lrcorner:"\u231F",lrhar:"\u21CB",lrhard:"\u296D",lrm:"\u200E",lrtri:"\u22BF",lsaquo:"\u2039",lscr:"\u{1D4C1}",lsh:"\u21B0",lsim:"\u2272",lsime:"\u2A8D",lsimg:"\u2A8F",lsqb:"[",lsquo:"\u2018",lsquor:"\u201A",lstrok:"\u0142",l:"<",lt:"<",ltcc:"\u2AA6",ltcir:"\u2A79",ltdot:"\u22D6",lthree:"\u22CB",ltimes:"\u22C9",ltlarr:"\u2976",ltquest:"\u2A7B",ltrPar:"\u2996",ltri:"\u25C3",ltrie:"\u22B4",ltrif:"\u25C2",lurdshar:"\u294A",luruhar:"\u2966",lvertneqq:"\u2268\uFE00",lvnE:"\u2268\uFE00",mDDot:"\u223A",mac:"\xAF",macr:"\xAF",male:"\u2642",malt:"\u2720",maltese:"\u2720",map:"\u21A6",mapsto:"\u21A6",mapstodown:"\u21A7",mapstoleft:"\u21A4",mapstoup:"\u21A5",marker:"\u25AE",mcomma:"\u2A29",mcy:"\u043C",mdash:"\u2014",measuredangle:"\u2221",mfr:"\u{1D52A}",mho:"\u2127",micr:"\xB5",micro:"\xB5",mid:"\u2223",midast:"*",midcir:"\u2AF0",middo:"\xB7",middot:"\xB7",minus:"\u2212",minusb:"\u229F",minusd:"\u2238",minusdu:"\u2A2A",mlcp:"\u2ADB",mldr:"\u2026",mnplus:"\u2213",models:"\u22A7",mopf:"\u{1D55E}",mp:"\u2213",mscr:"\u{1D4C2}",mstpos:"\u223E",mu:"\u03BC",multimap:"\u22B8",mumap:"\u22B8",nGg:"\u22D9\u0338",nGt:"\u226B\u20D2",nGtv:"\u226B\u0338",nLeftarrow:"\u21CD",nLeftrightarrow:"\u21CE",nLl:"\u22D8\u0338",nLt:"\u226A\u20D2",nLtv:"\u226A\u0338",nRightarrow:"\u21CF",nVDash:"\u22AF",nVdash:"\u22AE",nabla:"\u2207",nacute:"\u0144",nang:"\u2220\u20D2",nap:"\u2249",napE:"\u2A70\u0338",napid:"\u224B\u0338",napos:"\u0149",napprox:"\u2249",natur:"\u266E",natural:"\u266E",naturals:"\u2115",nbs:"\xA0",nbsp:"\xA0",nbump:"\u224E\u0338",nbumpe:"\u224F\u0338",ncap:"\u2A43",ncaron:"\u0148",ncedil:"\u0146",ncong:"\u2247",ncongdot:"\u2A6D\u0338",ncup:"\u2A42",ncy:"\u043D",ndash:"\u2013",ne:"\u2260",neArr:"\u21D7",nearhk:"\u2924",nearr:"\u2197",nearrow:"\u2197",nedot:"\u2250\u0338",nequiv:"\u2262",nesear:"\u2928",nesim:"\u2242\u0338",nexist:"\u2204",nexists:"\u2204",nfr:"\u{1D52B}",ngE:"\u2267\u0338",nge:"\u2271",ngeq:"\u2271",ngeqq:"\u2267\u0338",ngeqslant:"\u2A7E\u0338",nges:"\u2A7E\u0338",ngsim:"\u2275",ngt:"\u226F",ngtr:"\u226F",nhArr:"\u21CE",nharr:"\u21AE",nhpar:"\u2AF2",ni:"\u220B",nis:"\u22FC",nisd:"\u22FA",niv:"\u220B",njcy:"\u045A",nlArr:"\u21CD",nlE:"\u2266\u0338",nlarr:"\u219A",nldr:"\u2025",nle:"\u2270",nleftarrow:"\u219A",nleftrightarrow:"\u21AE",nleq:"\u2270",nleqq:"\u2266\u0338",nleqslant:"\u2A7D\u0338",nles:"\u2A7D\u0338",nless:"\u226E",nlsim:"\u2274",nlt:"\u226E",nltri:"\u22EA",nltrie:"\u22EC",nmid:"\u2224",nopf:"\u{1D55F}",no:"\xAC",not:"\xAC",notin:"\u2209",notinE:"\u22F9\u0338",notindot:"\u22F5\u0338",notinva:"\u2209",notinvb:"\u22F7",notinvc:"\u22F6",notni:"\u220C",notniva:"\u220C",notnivb:"\u22FE",notnivc:"\u22FD",npar:"\u2226",nparallel:"\u2226",nparsl:"\u2AFD\u20E5",npart:"\u2202\u0338",npolint:"\u2A14",npr:"\u2280",nprcue:"\u22E0",npre:"\u2AAF\u0338",nprec:"\u2280",npreceq:"\u2AAF\u0338",nrArr:"\u21CF",nrarr:"\u219B",nrarrc:"\u2933\u0338",nrarrw:"\u219D\u0338",nrightarrow:"\u219B",nrtri:"\u22EB",nrtrie:"\u22ED",nsc:"\u2281",nsccue:"\u22E1",nsce:"\u2AB0\u0338",nscr:"\u{1D4C3}",nshortmid:"\u2224",nshortparallel:"\u2226",nsim:"\u2241",nsime:"\u2244",nsimeq:"\u2244",nsmid:"\u2224",nspar:"\u2226",nsqsube:"\u22E2",nsqsupe:"\u22E3",nsub:"\u2284",nsubE:"\u2AC5\u0338",nsube:"\u2288",nsubset:"\u2282\u20D2",nsubseteq:"\u2288",nsubseteqq:"\u2AC5\u0338",nsucc:"\u2281",nsucceq:"\u2AB0\u0338",nsup:"\u2285",nsupE:"\u2AC6\u0338",nsupe:"\u2289",nsupset:"\u2283\u20D2",nsupseteq:"\u2289",nsupseteqq:"\u2AC6\u0338",ntgl:"\u2279",ntild:"\xF1",ntilde:"\xF1",ntlg:"\u2278",ntriangleleft:"\u22EA",ntrianglelefteq:"\u22EC",ntriangleright:"\u22EB",ntrianglerighteq:"\u22ED",nu:"\u03BD",num:"#",numero:"\u2116",numsp:"\u2007",nvDash:"\u22AD",nvHarr:"\u2904",nvap:"\u224D\u20D2",nvdash:"\u22AC",nvge:"\u2265\u20D2",nvgt:">\u20D2",nvinfin:"\u29DE",nvlArr:"\u2902",nvle:"\u2264\u20D2",nvlt:"<\u20D2",nvltrie:"\u22B4\u20D2",nvrArr:"\u2903",nvrtrie:"\u22B5\u20D2",nvsim:"\u223C\u20D2",nwArr:"\u21D6",nwarhk:"\u2923",nwarr:"\u2196",nwarrow:"\u2196",nwnear:"\u2927",oS:"\u24C8",oacut:"\xF3",oacute:"\xF3",oast:"\u229B",ocir:"\xF4",ocirc:"\xF4",ocy:"\u043E",odash:"\u229D",odblac:"\u0151",odiv:"\u2A38",odot:"\u2299",odsold:"\u29BC",oelig:"\u0153",ofcir:"\u29BF",ofr:"\u{1D52C}",ogon:"\u02DB",ograv:"\xF2",ograve:"\xF2",ogt:"\u29C1",ohbar:"\u29B5",ohm:"\u03A9",oint:"\u222E",olarr:"\u21BA",olcir:"\u29BE",olcross:"\u29BB",oline:"\u203E",olt:"\u29C0",omacr:"\u014D",omega:"\u03C9",omicron:"\u03BF",omid:"\u29B6",ominus:"\u2296",oopf:"\u{1D560}",opar:"\u29B7",operp:"\u29B9",oplus:"\u2295",or:"\u2228",orarr:"\u21BB",ord:"\xBA",order:"\u2134",orderof:"\u2134",ordf:"\xAA",ordm:"\xBA",origof:"\u22B6",oror:"\u2A56",orslope:"\u2A57",orv:"\u2A5B",oscr:"\u2134",oslas:"\xF8",oslash:"\xF8",osol:"\u2298",otild:"\xF5",otilde:"\xF5",otimes:"\u2297",otimesas:"\u2A36",oum:"\xF6",ouml:"\xF6",ovbar:"\u233D",par:"\xB6",para:"\xB6",parallel:"\u2225",parsim:"\u2AF3",parsl:"\u2AFD",part:"\u2202",pcy:"\u043F",percnt:"%",period:".",permil:"\u2030",perp:"\u22A5",pertenk:"\u2031",pfr:"\u{1D52D}",phi:"\u03C6",phiv:"\u03D5",phmmat:"\u2133",phone:"\u260E",pi:"\u03C0",pitchfork:"\u22D4",piv:"\u03D6",planck:"\u210F",planckh:"\u210E",plankv:"\u210F",plus:"+",plusacir:"\u2A23",plusb:"\u229E",pluscir:"\u2A22",plusdo:"\u2214",plusdu:"\u2A25",pluse:"\u2A72",plusm:"\xB1",plusmn:"\xB1",plussim:"\u2A26",plustwo:"\u2A27",pm:"\xB1",pointint:"\u2A15",popf:"\u{1D561}",poun:"\xA3",pound:"\xA3",pr:"\u227A",prE:"\u2AB3",prap:"\u2AB7",prcue:"\u227C",pre:"\u2AAF",prec:"\u227A",precapprox:"\u2AB7",preccurlyeq:"\u227C",preceq:"\u2AAF",precnapprox:"\u2AB9",precneqq:"\u2AB5",precnsim:"\u22E8",precsim:"\u227E",prime:"\u2032",primes:"\u2119",prnE:"\u2AB5",prnap:"\u2AB9",prnsim:"\u22E8",prod:"\u220F",profalar:"\u232E",profline:"\u2312",profsurf:"\u2313",prop:"\u221D",propto:"\u221D",prsim:"\u227E",prurel:"\u22B0",pscr:"\u{1D4C5}",psi:"\u03C8",puncsp:"\u2008",qfr:"\u{1D52E}",qint:"\u2A0C",qopf:"\u{1D562}",qprime:"\u2057",qscr:"\u{1D4C6}",quaternions:"\u210D",quatint:"\u2A16",quest:"?",questeq:"\u225F",quo:'"',quot:'"',rAarr:"\u21DB",rArr:"\u21D2",rAtail:"\u291C",rBarr:"\u290F",rHar:"\u2964",race:"\u223D\u0331",racute:"\u0155",radic:"\u221A",raemptyv:"\u29B3",rang:"\u27E9",rangd:"\u2992",range:"\u29A5",rangle:"\u27E9",raqu:"\xBB",raquo:"\xBB",rarr:"\u2192",rarrap:"\u2975",rarrb:"\u21E5",rarrbfs:"\u2920",rarrc:"\u2933",rarrfs:"\u291E",rarrhk:"\u21AA",rarrlp:"\u21AC",rarrpl:"\u2945",rarrsim:"\u2974",rarrtl:"\u21A3",rarrw:"\u219D",ratail:"\u291A",ratio:"\u2236",rationals:"\u211A",rbarr:"\u290D",rbbrk:"\u2773",rbrace:"}",rbrack:"]",rbrke:"\u298C",rbrksld:"\u298E",rbrkslu:"\u2990",rcaron:"\u0159",rcedil:"\u0157",rceil:"\u2309",rcub:"}",rcy:"\u0440",rdca:"\u2937",rdldhar:"\u2969",rdquo:"\u201D",rdquor:"\u201D",rdsh:"\u21B3",real:"\u211C",realine:"\u211B",realpart:"\u211C",reals:"\u211D",rect:"\u25AD",re:"\xAE",reg:"\xAE",rfisht:"\u297D",rfloor:"\u230B",rfr:"\u{1D52F}",rhard:"\u21C1",rharu:"\u21C0",rharul:"\u296C",rho:"\u03C1",rhov:"\u03F1",rightarrow:"\u2192",rightarrowtail:"\u21A3",rightharpoondown:"\u21C1",rightharpoonup:"\u21C0",rightleftarrows:"\u21C4",rightleftharpoons:"\u21CC",rightrightarrows:"\u21C9",rightsquigarrow:"\u219D",rightthreetimes:"\u22CC",ring:"\u02DA",risingdotseq:"\u2253",rlarr:"\u21C4",rlhar:"\u21CC",rlm:"\u200F",rmoust:"\u23B1",rmoustache:"\u23B1",rnmid:"\u2AEE",roang:"\u27ED",roarr:"\u21FE",robrk:"\u27E7",ropar:"\u2986",ropf:"\u{1D563}",roplus:"\u2A2E",rotimes:"\u2A35",rpar:")",rpargt:"\u2994",rppolint:"\u2A12",rrarr:"\u21C9",rsaquo:"\u203A",rscr:"\u{1D4C7}",rsh:"\u21B1",rsqb:"]",rsquo:"\u2019",rsquor:"\u2019",rthree:"\u22CC",rtimes:"\u22CA",rtri:"\u25B9",rtrie:"\u22B5",rtrif:"\u25B8",rtriltri:"\u29CE",ruluhar:"\u2968",rx:"\u211E",sacute:"\u015B",sbquo:"\u201A",sc:"\u227B",scE:"\u2AB4",scap:"\u2AB8",scaron:"\u0161",sccue:"\u227D",sce:"\u2AB0",scedil:"\u015F",scirc:"\u015D",scnE:"\u2AB6",scnap:"\u2ABA",scnsim:"\u22E9",scpolint:"\u2A13",scsim:"\u227F",scy:"\u0441",sdot:"\u22C5",sdotb:"\u22A1",sdote:"\u2A66",seArr:"\u21D8",searhk:"\u2925",searr:"\u2198",searrow:"\u2198",sec:"\xA7",sect:"\xA7",semi:";",seswar:"\u2929",setminus:"\u2216",setmn:"\u2216",sext:"\u2736",sfr:"\u{1D530}",sfrown:"\u2322",sharp:"\u266F",shchcy:"\u0449",shcy:"\u0448",shortmid:"\u2223",shortparallel:"\u2225",sh:"\xAD",shy:"\xAD",sigma:"\u03C3",sigmaf:"\u03C2",sigmav:"\u03C2",sim:"\u223C",simdot:"\u2A6A",sime:"\u2243",simeq:"\u2243",simg:"\u2A9E",simgE:"\u2AA0",siml:"\u2A9D",simlE:"\u2A9F",simne:"\u2246",simplus:"\u2A24",simrarr:"\u2972",slarr:"\u2190",smallsetminus:"\u2216",smashp:"\u2A33",smeparsl:"\u29E4",smid:"\u2223",smile:"\u2323",smt:"\u2AAA",smte:"\u2AAC",smtes:"\u2AAC\uFE00",softcy:"\u044C",sol:"/",solb:"\u29C4",solbar:"\u233F",sopf:"\u{1D564}",spades:"\u2660",spadesuit:"\u2660",spar:"\u2225",sqcap:"\u2293",sqcaps:"\u2293\uFE00",sqcup:"\u2294",sqcups:"\u2294\uFE00",sqsub:"\u228F",sqsube:"\u2291",sqsubset:"\u228F",sqsubseteq:"\u2291",sqsup:"\u2290",sqsupe:"\u2292",sqsupset:"\u2290",sqsupseteq:"\u2292",squ:"\u25A1",square:"\u25A1",squarf:"\u25AA",squf:"\u25AA",srarr:"\u2192",sscr:"\u{1D4C8}",ssetmn:"\u2216",ssmile:"\u2323",sstarf:"\u22C6",star:"\u2606",starf:"\u2605",straightepsilon:"\u03F5",straightphi:"\u03D5",strns:"\xAF",sub:"\u2282",subE:"\u2AC5",subdot:"\u2ABD",sube:"\u2286",subedot:"\u2AC3",submult:"\u2AC1",subnE:"\u2ACB",subne:"\u228A",subplus:"\u2ABF",subrarr:"\u2979",subset:"\u2282",subseteq:"\u2286",subseteqq:"\u2AC5",subsetneq:"\u228A",subsetneqq:"\u2ACB",subsim:"\u2AC7",subsub:"\u2AD5",subsup:"\u2AD3",succ:"\u227B",succapprox:"\u2AB8",succcurlyeq:"\u227D",succeq:"\u2AB0",succnapprox:"\u2ABA",succneqq:"\u2AB6",succnsim:"\u22E9",succsim:"\u227F",sum:"\u2211",sung:"\u266A",sup:"\u2283",sup1:"\xB9",sup2:"\xB2",sup3:"\xB3",supE:"\u2AC6",supdot:"\u2ABE",supdsub:"\u2AD8",supe:"\u2287",supedot:"\u2AC4",suphsol:"\u27C9",suphsub:"\u2AD7",suplarr:"\u297B",supmult:"\u2AC2",supnE:"\u2ACC",supne:"\u228B",supplus:"\u2AC0",supset:"\u2283",supseteq:"\u2287",supseteqq:"\u2AC6",supsetneq:"\u228B",supsetneqq:"\u2ACC",supsim:"\u2AC8",supsub:"\u2AD4",supsup:"\u2AD6",swArr:"\u21D9",swarhk:"\u2926",swarr:"\u2199",swarrow:"\u2199",swnwar:"\u292A",szli:"\xDF",szlig:"\xDF",target:"\u2316",tau:"\u03C4",tbrk:"\u23B4",tcaron:"\u0165",tcedil:"\u0163",tcy:"\u0442",tdot:"\u20DB",telrec:"\u2315",tfr:"\u{1D531}",there4:"\u2234",therefore:"\u2234",theta:"\u03B8",thetasym:"\u03D1",thetav:"\u03D1",thickapprox:"\u2248",thicksim:"\u223C",thinsp:"\u2009",thkap:"\u2248",thksim:"\u223C",thor:"\xFE",thorn:"\xFE",tilde:"\u02DC",time:"\xD7",times:"\xD7",timesb:"\u22A0",timesbar:"\u2A31",timesd:"\u2A30",tint:"\u222D",toea:"\u2928",top:"\u22A4",topbot:"\u2336",topcir:"\u2AF1",topf:"\u{1D565}",topfork:"\u2ADA",tosa:"\u2929",tprime:"\u2034",trade:"\u2122",triangle:"\u25B5",triangledown:"\u25BF",triangleleft:"\u25C3",trianglelefteq:"\u22B4",triangleq:"\u225C",triangleright:"\u25B9",trianglerighteq:"\u22B5",tridot:"\u25EC",trie:"\u225C",triminus:"\u2A3A",triplus:"\u2A39",trisb:"\u29CD",tritime:"\u2A3B",trpezium:"\u23E2",tscr:"\u{1D4C9}",tscy:"\u0446",tshcy:"\u045B",tstrok:"\u0167",twixt:"\u226C",twoheadleftarrow:"\u219E",twoheadrightarrow:"\u21A0",uArr:"\u21D1",uHar:"\u2963",uacut:"\xFA",uacute:"\xFA",uarr:"\u2191",ubrcy:"\u045E",ubreve:"\u016D",ucir:"\xFB",ucirc:"\xFB",ucy:"\u0443",udarr:"\u21C5",udblac:"\u0171",udhar:"\u296E",ufisht:"\u297E",ufr:"\u{1D532}",ugrav:"\xF9",ugrave:"\xF9",uharl:"\u21BF",uharr:"\u21BE",uhblk:"\u2580",ulcorn:"\u231C",ulcorner:"\u231C",ulcrop:"\u230F",ultri:"\u25F8",umacr:"\u016B",um:"\xA8",uml:"\xA8",uogon:"\u0173",uopf:"\u{1D566}",uparrow:"\u2191",updownarrow:"\u2195",upharpoonleft:"\u21BF",upharpoonright:"\u21BE",uplus:"\u228E",upsi:"\u03C5",upsih:"\u03D2",upsilon:"\u03C5",upuparrows:"\u21C8",urcorn:"\u231D",urcorner:"\u231D",urcrop:"\u230E",uring:"\u016F",urtri:"\u25F9",uscr:"\u{1D4CA}",utdot:"\u22F0",utilde:"\u0169",utri:"\u25B5",utrif:"\u25B4",uuarr:"\u21C8",uum:"\xFC",uuml:"\xFC",uwangle:"\u29A7",vArr:"\u21D5",vBar:"\u2AE8",vBarv:"\u2AE9",vDash:"\u22A8",vangrt:"\u299C",varepsilon:"\u03F5",varkappa:"\u03F0",varnothing:"\u2205",varphi:"\u03D5",varpi:"\u03D6",varpropto:"\u221D",varr:"\u2195",varrho:"\u03F1",varsigma:"\u03C2",varsubsetneq:"\u228A\uFE00",varsubsetneqq:"\u2ACB\uFE00",varsupsetneq:"\u228B\uFE00",varsupsetneqq:"\u2ACC\uFE00",vartheta:"\u03D1",vartriangleleft:"\u22B2",vartriangleright:"\u22B3",vcy:"\u0432",vdash:"\u22A2",vee:"\u2228",veebar:"\u22BB",veeeq:"\u225A",vellip:"\u22EE",verbar:"|",vert:"|",vfr:"\u{1D533}",vltri:"\u22B2",vnsub:"\u2282\u20D2",vnsup:"\u2283\u20D2",vopf:"\u{1D567}",vprop:"\u221D",vrtri:"\u22B3",vscr:"\u{1D4CB}",vsubnE:"\u2ACB\uFE00",vsubne:"\u228A\uFE00",vsupnE:"\u2ACC\uFE00",vsupne:"\u228B\uFE00",vzigzag:"\u299A",wcirc:"\u0175",wedbar:"\u2A5F",wedge:"\u2227",wedgeq:"\u2259",weierp:"\u2118",wfr:"\u{1D534}",wopf:"\u{1D568}",wp:"\u2118",wr:"\u2240",wreath:"\u2240",wscr:"\u{1D4CC}",xcap:"\u22C2",xcirc:"\u25EF",xcup:"\u22C3",xdtri:"\u25BD",xfr:"\u{1D535}",xhArr:"\u27FA",xharr:"\u27F7",xi:"\u03BE",xlArr:"\u27F8",xlarr:"\u27F5",xmap:"\u27FC",xnis:"\u22FB",xodot:"\u2A00",xopf:"\u{1D569}",xoplus:"\u2A01",xotime:"\u2A02",xrArr:"\u27F9",xrarr:"\u27F6",xscr:"\u{1D4CD}",xsqcup:"\u2A06",xuplus:"\u2A04",xutri:"\u25B3",xvee:"\u22C1",xwedge:"\u22C0",yacut:"\xFD",yacute:"\xFD",yacy:"\u044F",ycirc:"\u0177",ycy:"\u044B",ye:"\xA5",yen:"\xA5",yfr:"\u{1D536}",yicy:"\u0457",yopf:"\u{1D56A}",yscr:"\u{1D4CE}",yucy:"\u044E",yum:"\xFF",yuml:"\xFF",zacute:"\u017A",zcaron:"\u017E",zcy:"\u0437",zdot:"\u017C",zeetrf:"\u2128",zeta:"\u03B6",zfr:"\u{1D537}",zhcy:"\u0436",zigrarr:"\u21DD",zopf:"\u{1D56B}",zscr:"\u{1D4CF}",zwj:"\u200D",zwnj:"\u200C"}});var Iu=x((pv,Pu)=>{"use strict";var Nu=qu();Pu.exports=RD;var LD={}.hasOwnProperty;function RD(e){return LD.call(Nu,e)?Nu[e]:!1}});var mr=x((hv,Hu)=>{"use strict";var Su=xu(),Lu=yu(),MD=Se(),UD=Tu(),Yu=Ou(),YD=Iu();Hu.exports=ep;var GD={}.hasOwnProperty,He=String.fromCharCode,zD=Function.prototype,Ru={warning:null,reference:null,text:null,warningContext:null,referenceContext:null,textContext:null,position:{},additional:null,attribute:!1,nonTerminated:!0},WD=9,Mu=10,VD=12,jD=32,Uu=38,$D=59,HD=60,KD=61,XD=35,JD=88,QD=120,ZD=65533,Ke="named",Wt="hexadecimal",Vt="decimal",jt={};jt[Wt]=16;jt[Vt]=10;var Hr={};Hr[Ke]=Yu;Hr[Vt]=MD;Hr[Wt]=UD;var Gu=1,zu=2,Wu=3,Vu=4,ju=5,zt=6,$u=7,we={};we[Gu]="Named character references must be terminated by a semicolon";we[zu]="Numeric character references must be terminated by a semicolon";we[Wu]="Named character references cannot be empty";we[Vu]="Numeric character references cannot be empty";we[ju]="Named character references must be known";we[zt]="Numeric character references cannot be disallowed";we[$u]="Numeric character references cannot be outside the permissible Unicode range";function ep(e,r){var t={},n,i;r||(r={});for(i in Ru)n=r[i],t[i]=n??Ru[i];return(t.position.indent||t.position.start)&&(t.indent=t.position.indent||[],t.position=t.position.start),rp(e,t)}function rp(e,r){var t=r.additional,n=r.nonTerminated,i=r.text,u=r.reference,a=r.warning,o=r.textContext,s=r.referenceContext,l=r.warningContext,c=r.position,f=r.indent||[],D=e.length,m=0,p=-1,h=c.column||1,F=c.line||1,g="",E=[],v,A,b,d,y,w,C,k,T,B,_,S,P,N,O,I,le,K,L;for(typeof t=="string"&&(t=t.charCodeAt(0)),I=ie(),k=a?Z:zD,m--,D++;++m<D;)if(y===Mu&&(h=f[p]||1),y=e.charCodeAt(m),y===Uu){if(C=e.charCodeAt(m+1),C===WD||C===Mu||C===VD||C===jD||C===Uu||C===HD||C!==C||t&&C===t){g+=He(y),h++;continue}for(P=m+1,S=P,L=P,C===XD?(L=++S,C=e.charCodeAt(L),C===JD||C===QD?(N=Wt,L=++S):N=Vt):N=Ke,v="",_="",d="",O=Hr[N],L--;++L<D&&(C=e.charCodeAt(L),!!O(C));)d+=He(C),N===Ke&&GD.call(Su,d)&&(v=d,_=Su[d]);b=e.charCodeAt(L)===$D,b&&(L++,A=N===Ke?YD(d):!1,A&&(v=d,_=A)),K=1+L-P,!b&&!n||(d?N===Ke?(b&&!_?k(ju,1):(v!==d&&(L=S+v.length,K=1+L-S,b=!1),b||(T=v?Gu:Wu,r.attribute?(C=e.charCodeAt(L),C===KD?(k(T,K),_=null):Yu(C)?_=null:k(T,K)):k(T,K))),w=_):(b||k(zu,K),w=parseInt(d,jt[N]),tp(w)?(k($u,K),w=He(ZD)):w in Lu?(k(zt,K),w=Lu[w]):(B="",np(w)&&k(zt,K),w>65535&&(w-=65536,B+=He(w>>>10|55296),w=56320|w&1023),w=B+He(w))):N!==Ke&&k(Vu,K)),w?(ve(),I=ie(),m=L-1,h+=L-P+1,E.push(w),le=ie(),le.offset++,u&&u.call(s,w,{start:I,end:le},e.slice(P-1,L)),I=le):(d=e.slice(P-1,L),g+=d,h+=d.length,m=L-1)}else y===10&&(F++,p++,h=0),y===y?(g+=He(y),h++):ve();return E.join("");function ie(){return{line:F,column:h,offset:m+(c.offset||0)}}function Z(Ae,G){var mt=ie();mt.column+=G,mt.offset+=G,a.call(l,we[Ae],mt,Ae)}function ve(){g&&(E.push(g),i&&i.call(o,g,{start:I,end:ie()}),g="")}}function tp(e){return e>=55296&&e<=57343||e>1114111}function np(e){return e>=1&&e<=8||e===11||e>=13&&e<=31||e>=127&&e<=159||e>=64976&&e<=65007||(e&65535)===65535||(e&65535)===65534}});var Ju=x((dv,Xu)=>{"use strict";var ip=Ie(),Ku=mr();Xu.exports=up;function up(e){return t.raw=n,t;function r(u){for(var a=e.offset,o=u.line,s=[];++o&&o in a;)s.push((a[o]||0)+1);return{start:u,indent:s}}function t(u,a,o){Ku(u,{position:r(a),warning:i,text:o,reference:o,textContext:e,referenceContext:e})}function n(u,a,o){return Ku(u,ip(o,{position:r(a),warning:i}))}function i(u,a,o){o!==3&&e.file.message(u,a)}}});var ea=x((mv,Zu)=>{"use strict";Zu.exports=ap;function ap(e){return r;function r(t,n){var i=this,u=i.offset,a=[],o=i[e+"Methods"],s=i[e+"Tokenizers"],l=n.line,c=n.column,f,D,m,p,h,F;if(!t)return a;for(w.now=v,w.file=i.file,g("");t;){for(f=-1,D=o.length,h=!1;++f<D&&(p=o[f],m=s[p],!(m&&(!m.onlyAtStart||i.atStart)&&(!m.notInList||!i.inList)&&(!m.notInBlock||!i.inBlock)&&(!m.notInLink||!i.inLink)&&(F=t.length,m.apply(i,[w,t]),h=F!==t.length,h))););h||i.file.fail(new Error("Infinite loop"),w.now())}return i.eof=v(),a;function g(C){for(var k=-1,T=C.indexOf(`
`);T!==-1;)l++,k=T,T=C.indexOf(`
`,T+1);k===-1?c+=C.length:c=C.length-k,l in u&&(k!==-1?c+=u[l]:c<=u[l]&&(c=u[l]+1))}function E(){var C=[],k=l+1;return function(){for(var T=l+1;k<T;)C.push((u[k]||0)+1),k++;return C}}function v(){var C={line:l,column:c};return C.offset=i.toOffset(C),C}function A(C){this.start=C,this.end=v()}function b(C){t.slice(0,C.length)!==C&&i.file.fail(new Error("Incorrectly eaten value: please report this warning on https://git.io/vg5Ft"),v())}function d(){var C=v();return k;function k(T,B){var _=T.position,S=_?_.start:C,P=[],N=_&&_.end.line,O=C.line;if(T.position=new A(S),_&&B&&_.indent){if(P=_.indent,N<O){for(;++N<O;)P.push((u[N]||0)+1);P.push(C.column)}B=P.concat(B)}return T.position.indent=B||[],T}}function y(C,k){var T=k?k.children:a,B=T[T.length-1],_;return B&&C.type===B.type&&(C.type==="text"||C.type==="blockquote")&&Qu(B)&&Qu(C)&&(_=C.type==="text"?op:sp,C=_.call(i,B,C)),C!==B&&T.push(C),i.atStart&&a.length!==0&&i.exitStart(),C}function w(C){var k=E(),T=d(),B=v();return b(C),_.reset=S,S.test=P,_.test=P,t=t.slice(C.length),g(C),k=k(),_;function _(N,O){return T(y(T(N),O),k)}function S(){var N=_.apply(null,arguments);return l=B.line,c=B.column,t=C+t,N}function P(){var N=T({});return l=B.line,c=B.column,t=C+t,N.position}}}}function Qu(e){var r,t;return e.type!=="text"||!e.position?!0:(r=e.position.start,t=e.position.end,r.line!==t.line||t.column-r.column===e.value.length)}function op(e,r){return e.value+=r.value,e}function sp(e,r){return this.options.commonmark||this.options.gfm?r:(e.children=e.children.concat(r.children),e)}});var na=x((Fv,ta)=>{"use strict";ta.exports=Kr;var $t=["\\","`","*","{","}","[","]","(",")","#","+","-",".","!","_",">"],Ht=$t.concat(["~","|"]),ra=Ht.concat([`
`,'"',"$","%","&","'",",","/",":",";","<","=","?","@","^"]);Kr.default=$t;Kr.gfm=Ht;Kr.commonmark=ra;function Kr(e){var r=e||{};return r.commonmark?ra:r.gfm?Ht:$t}});var ua=x((gv,ia)=>{"use strict";ia.exports=["address","article","aside","base","basefont","blockquote","body","caption","center","col","colgroup","dd","details","dialog","dir","div","dl","dt","fieldset","figcaption","figure","footer","form","frame","frameset","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","iframe","legend","li","link","main","menu","menuitem","meta","nav","noframes","ol","optgroup","option","p","param","pre","section","source","title","summary","table","tbody","td","tfoot","th","thead","title","tr","track","ul"]});var Kt=x((Ev,aa)=>{"use strict";aa.exports={position:!0,gfm:!0,commonmark:!1,pedantic:!1,blocks:ua()}});var sa=x((Cv,oa)=>{"use strict";var cp=Ie(),lp=na(),fp=Kt();oa.exports=Dp;function Dp(e){var r=this,t=r.options,n,i;if(e==null)e={};else if(typeof e=="object")e=cp(e);else throw new Error("Invalid value `"+e+"` for setting `options`");for(n in fp){if(i=e[n],i==null&&(i=t[n]),n!=="blocks"&&typeof i!="boolean"||n==="blocks"&&typeof i!="object")throw new Error("Invalid value `"+i+"` for setting `options."+n+"`");e[n]=i}return r.options=e,r.escape=lp(e),r}});var fa=x((vv,la)=>{"use strict";la.exports=ca;function ca(e){if(e==null)return mp;if(typeof e=="string")return dp(e);if(typeof e=="object")return"length"in e?hp(e):pp(e);if(typeof e=="function")return e;throw new Error("Expected function, string, or object as test")}function pp(e){return r;function r(t){var n;for(n in e)if(t[n]!==e[n])return!1;return!0}}function hp(e){for(var r=[],t=-1;++t<e.length;)r[t]=ca(e[t]);return n;function n(){for(var i=-1;++i<r.length;)if(r[i].apply(this,arguments))return!0;return!1}}function dp(e){return r;function r(t){return!!(t&&t.type===e)}}function mp(){return!0}});var pa=x((Av,Da)=>{Da.exports=Fp;function Fp(e){return e}});var Fa=x((bv,ma)=>{"use strict";ma.exports=Xr;var gp=fa(),Ep=pa(),ha=!0,da="skip",Xt=!1;Xr.CONTINUE=ha;Xr.SKIP=da;Xr.EXIT=Xt;function Xr(e,r,t,n){var i,u;typeof r=="function"&&typeof t!="function"&&(n=t,t=r,r=null),u=gp(r),i=n?-1:1,a(e,null,[])();function a(o,s,l){var c=typeof o=="object"&&o!==null?o:{},f;return typeof c.type=="string"&&(f=typeof c.tagName=="string"?c.tagName:typeof c.name=="string"?c.name:void 0,D.displayName="node ("+Ep(c.type+(f?"<"+f+">":""))+")"),D;function D(){var m=l.concat(o),p=[],h,F;if((!r||u(o,s,l[l.length-1]||null))&&(p=Cp(t(o,l)),p[0]===Xt))return p;if(o.children&&p[0]!==da)for(F=(n?o.children.length:-1)+i;F>-1&&F<o.children.length;){if(h=a(o.children[F],F,m)(),h[0]===Xt)return h;F=typeof h[1]=="number"?h[1]:F+i}return p}}}function Cp(e){return e!==null&&typeof e=="object"&&"length"in e?e:typeof e=="number"?[ha,e]:[e]}});var Ea=x((xv,ga)=>{"use strict";ga.exports=Qr;var Jr=Fa(),vp=Jr.CONTINUE,Ap=Jr.SKIP,bp=Jr.EXIT;Qr.CONTINUE=vp;Qr.SKIP=Ap;Qr.EXIT=bp;function Qr(e,r,t,n){typeof r=="function"&&typeof t!="function"&&(n=t,t=r,r=null),Jr(e,r,i,n);function i(u,a){var o=a[a.length-1],s=o?o.children.indexOf(u):null;return t(u,s,o)}}});var va=x((yv,Ca)=>{"use strict";var xp=Ea();Ca.exports=yp;function yp(e,r){return xp(e,r?wp:kp),e}function wp(e){delete e.position}function kp(e){e.position=void 0}});var xa=x((wv,ba)=>{"use strict";var Aa=Ie(),Tp=va();ba.exports=Op;var Bp=`
`,_p=/\r\n|\r/g;function Op(){var e=this,r=String(e.file),t={line:1,column:1,offset:0},n=Aa(t),i;return r=r.replace(_p,Bp),r.charCodeAt(0)===65279&&(r=r.slice(1),n.column++,n.offset++),i={type:"root",children:e.tokenizeBlock(r,n),position:{start:t,end:e.eof||Aa(t)}},e.options.position||Tp(i,!0),i}});var wa=x((kv,ya)=>{"use strict";var qp=/^[ \t]*(\n|$)/;ya.exports=Np;function Np(e,r,t){for(var n,i="",u=0,a=r.length;u<a&&(n=qp.exec(r.slice(u)),n!=null);)u+=n[0].length,i+=n[0];if(i!==""){if(t)return!0;e(i)}}});var Zr=x((Tv,ka)=>{"use strict";var ge="",Jt;ka.exports=Pp;function Pp(e,r){if(typeof e!="string")throw new TypeError("expected a string");if(r===1)return e;if(r===2)return e+e;var t=e.length*r;if(Jt!==e||typeof Jt>"u")Jt=e,ge="";else if(ge.length>=t)return ge.substr(0,t);for(;t>ge.length&&r>1;)r&1&&(ge+=e),r>>=1,e+=e;return ge+=e,ge=ge.substr(0,t),ge}});var Qt=x((Bv,Ta)=>{"use strict";Ta.exports=Ip;function Ip(e){return String(e).replace(/\n+$/,"")}});var Oa=x((_v,_a)=>{"use strict";var Sp=Zr(),Lp=Qt();_a.exports=Up;var Zt=`
`,Ba="	",en=" ",Rp=4,Mp=Sp(en,Rp);function Up(e,r,t){for(var n=-1,i=r.length,u="",a="",o="",s="",l,c,f;++n<i;)if(l=r.charAt(n),f)if(f=!1,u+=o,a+=s,o="",s="",l===Zt)o=l,s=l;else for(u+=l,a+=l;++n<i;){if(l=r.charAt(n),!l||l===Zt){s=l,o=l;break}u+=l,a+=l}else if(l===en&&r.charAt(n+1)===l&&r.charAt(n+2)===l&&r.charAt(n+3)===l)o+=Mp,n+=3,f=!0;else if(l===Ba)o+=l,f=!0;else{for(c="";l===Ba||l===en;)c+=l,l=r.charAt(++n);if(l!==Zt)break;o+=c+l,s+=l}if(a)return t?!0:e(u)({type:"code",lang:null,meta:null,value:Lp(a)})}});var Pa=x((Ov,Na)=>{"use strict";Na.exports=Wp;var et=`
`,Fr="	",Xe=" ",Yp="~",qa="`",Gp=3,zp=4;function Wp(e,r,t){var n=this,i=n.options.gfm,u=r.length+1,a=0,o="",s,l,c,f,D,m,p,h,F,g,E,v,A;if(i){for(;a<u&&(c=r.charAt(a),!(c!==Xe&&c!==Fr));)o+=c,a++;if(v=a,c=r.charAt(a),!(c!==Yp&&c!==qa)){for(a++,l=c,s=1,o+=c;a<u&&(c=r.charAt(a),c===l);)o+=c,s++,a++;if(!(s<Gp)){for(;a<u&&(c=r.charAt(a),!(c!==Xe&&c!==Fr));)o+=c,a++;for(f="",p="";a<u&&(c=r.charAt(a),!(c===et||l===qa&&c===l));)c===Xe||c===Fr?p+=c:(f+=p+c,p=""),a++;if(c=r.charAt(a),!(c&&c!==et)){if(t)return!0;A=e.now(),A.column+=o.length,A.offset+=o.length,o+=f,f=n.decode.raw(n.unescape(f),A),p&&(o+=p),p="",g="",E="",h="",F="";for(var b=!0;a<u;){if(c=r.charAt(a),h+=g,F+=E,g="",E="",c!==et){h+=c,E+=c,a++;continue}for(b?(o+=c,b=!1):(g+=c,E+=c),p="",a++;a<u&&(c=r.charAt(a),c===Xe);)p+=c,a++;if(g+=p,E+=p.slice(v),!(p.length>=zp)){for(p="";a<u&&(c=r.charAt(a),c===l);)p+=c,a++;if(g+=p,E+=p,!(p.length<s)){for(p="";a<u&&(c=r.charAt(a),!(c!==Xe&&c!==Fr));)g+=c,E+=c,a++;if(!c||c===et)break}}}for(o+=h+g,a=-1,u=f.length;++a<u;)if(c=f.charAt(a),c===Xe||c===Fr)D||(D=f.slice(0,a));else if(D){m=f.slice(a);break}return e(o)({type:"code",lang:D||f||null,meta:m||null,value:F})}}}}}});var Le=x((Je,Ia)=>{Je=Ia.exports=Vp;function Vp(e){return e.trim?e.trim():Je.right(Je.left(e))}Je.left=function(e){return e.trimLeft?e.trimLeft():e.replace(/^\s\s*/,"")};Je.right=function(e){if(e.trimRight)return e.trimRight();for(var r=/\s/,t=e.length;r.test(e.charAt(--t)););return e.slice(0,t+1)}});var rt=x((qv,Sa)=>{"use strict";Sa.exports=jp;function jp(e,r,t,n){for(var i=e.length,u=-1,a,o;++u<i;)if(a=e[u],o=a[1]||{},!(o.pedantic!==void 0&&o.pedantic!==t.options.pedantic)&&!(o.commonmark!==void 0&&o.commonmark!==t.options.commonmark)&&r[a[0]].apply(t,n))return!0;return!1}});var Ua=x((Nv,Ma)=>{"use strict";var $p=Le(),Hp=rt();Ma.exports=Kp;var rn=`
`,La="	",tn=" ",Ra=">";function Kp(e,r,t){for(var n=this,i=n.offset,u=n.blockTokenizers,a=n.interruptBlockquote,o=e.now(),s=o.line,l=r.length,c=[],f=[],D=[],m,p=0,h,F,g,E,v,A,b,d;p<l&&(h=r.charAt(p),!(h!==tn&&h!==La));)p++;if(r.charAt(p)===Ra){if(t)return!0;for(p=0;p<l;){for(g=r.indexOf(rn,p),A=p,b=!1,g===-1&&(g=l);p<l&&(h=r.charAt(p),!(h!==tn&&h!==La));)p++;if(r.charAt(p)===Ra?(p++,b=!0,r.charAt(p)===tn&&p++):p=A,E=r.slice(p,g),!b&&!$p(E)){p=A;break}if(!b&&(F=r.slice(p),Hp(a,u,n,[e,F,!0])))break;v=A===p?E:r.slice(A,g),D.push(p-A),c.push(v),f.push(E),p=g+1}for(p=-1,l=D.length,m=e(c.join(rn));++p<l;)i[s]=(i[s]||0)+D[p],s++;return d=n.enterBlock(),f=n.tokenizeBlock(f.join(rn),o),d(),m({type:"blockquote",children:f})}}});var za=x((Pv,Ga)=>{"use strict";Ga.exports=Jp;var Ya=`
`,gr="	",Er=" ",Cr="#",Xp=6;function Jp(e,r,t){for(var n=this,i=n.options.pedantic,u=r.length+1,a=-1,o=e.now(),s="",l="",c,f,D;++a<u;){if(c=r.charAt(a),c!==Er&&c!==gr){a--;break}s+=c}for(D=0;++a<=u;){if(c=r.charAt(a),c!==Cr){a--;break}s+=c,D++}if(!(D>Xp)&&!(!D||!i&&r.charAt(a+1)===Cr)){for(u=r.length+1,f="";++a<u;){if(c=r.charAt(a),c!==Er&&c!==gr){a--;break}f+=c}if(!(!i&&f.length===0&&c&&c!==Ya)){if(t)return!0;for(s+=f,f="",l="";++a<u&&(c=r.charAt(a),!(!c||c===Ya));){if(c!==Er&&c!==gr&&c!==Cr){l+=f+c,f="";continue}for(;c===Er||c===gr;)f+=c,c=r.charAt(++a);if(!i&&l&&!f&&c===Cr){l+=c;continue}for(;c===Cr;)f+=c,c=r.charAt(++a);for(;c===Er||c===gr;)f+=c,c=r.charAt(++a);a--}return o.column+=s.length,o.offset+=s.length,s+=l+f,e(s)({type:"heading",depth:D,children:n.tokenizeInline(l,o)})}}}});var ja=x((Iv,Va)=>{"use strict";Va.exports=ih;var Qp="	",Zp=`
`,Wa=" ",eh="*",rh="-",th="_",nh=3;function ih(e,r,t){for(var n=-1,i=r.length+1,u="",a,o,s,l;++n<i&&(a=r.charAt(n),!(a!==Qp&&a!==Wa));)u+=a;if(!(a!==eh&&a!==rh&&a!==th))for(o=a,u+=a,s=1,l="";++n<i;)if(a=r.charAt(n),a===o)s++,u+=l+o,l="";else if(a===Wa)l+=a;else return s>=nh&&(!a||a===Zp)?(u+=l,t?!0:e(u)({type:"thematicBreak"})):void 0}});var nn=x((Sv,Ha)=>{"use strict";Ha.exports=sh;var $a="	",uh=" ",ah=1,oh=4;function sh(e){for(var r=0,t=0,n=e.charAt(r),i={},u,a=0;n===$a||n===uh;){for(u=n===$a?oh:ah,t+=u,u>1&&(t=Math.floor(t/u)*u);a<t;)i[++a]=r;n=e.charAt(++r)}return{indent:t,stops:i}}});var Ja=x((Lv,Xa)=>{"use strict";var ch=Le(),lh=Zr(),fh=nn();Xa.exports=hh;var Ka=`
`,Dh=" ",ph="!";function hh(e,r){var t=e.split(Ka),n=t.length+1,i=1/0,u=[],a,o,s;for(t.unshift(lh(Dh,r)+ph);n--;)if(o=fh(t[n]),u[n]=o.stops,ch(t[n]).length!==0)if(o.indent)o.indent>0&&o.indent<i&&(i=o.indent);else{i=1/0;break}if(i!==1/0)for(n=t.length;n--;){for(s=u[n],a=i;a&&!(a in s);)a--;t[n]=t[n].slice(s[a]+1)}return t.shift(),t.join(Ka)}});var no=x((Rv,to)=>{"use strict";var dh=Le(),mh=Zr(),Qa=Se(),Fh=nn(),gh=Ja(),Eh=rt();to.exports=kh;var un="*",Ch="_",Za="+",an="-",eo=".",Ee=" ",oe=`
`,tt="	",ro=")",vh="x",ke=4,Ah=/\n\n(?!\s*$)/,bh=/^\[([ X\tx])][ \t]/,xh=/^([ \t]*)([*+-]|\d+[.)])( {1,4}(?! )| |\t|$|(?=\n))([^\n]*)/,yh=/^([ \t]*)([*+-]|\d+[.)])([ \t]+)/,wh=/^( {1,4}|\t)?/gm;function kh(e,r,t){for(var n=this,i=n.options.commonmark,u=n.options.pedantic,a=n.blockTokenizers,o=n.interruptList,s=0,l=r.length,c=null,f,D,m,p,h,F,g,E,v,A,b,d,y,w,C,k,T,B,_,S=!1,P,N,O,I;s<l&&(p=r.charAt(s),!(p!==tt&&p!==Ee));)s++;if(p=r.charAt(s),p===un||p===Za||p===an)h=p,m=!1;else{for(m=!0,D="";s<l&&(p=r.charAt(s),!!Qa(p));)D+=p,s++;if(p=r.charAt(s),!D||!(p===eo||i&&p===ro)||t&&D!=="1")return;c=parseInt(D,10),h=p}if(p=r.charAt(++s),!(p!==Ee&&p!==tt&&(u||p!==oe&&p!==""))){if(t)return!0;for(s=0,w=[],C=[],k=[];s<l;){for(F=r.indexOf(oe,s),g=s,E=!1,I=!1,F===-1&&(F=l),f=0;s<l;){if(p=r.charAt(s),p===tt)f+=ke-f%ke;else if(p===Ee)f++;else break;s++}if(T&&f>=T.indent&&(I=!0),p=r.charAt(s),v=null,!I){if(p===un||p===Za||p===an)v=p,s++,f++;else{for(D="";s<l&&(p=r.charAt(s),!!Qa(p));)D+=p,s++;p=r.charAt(s),s++,D&&(p===eo||i&&p===ro)&&(v=p,f+=D.length+1)}if(v)if(p=r.charAt(s),p===tt)f+=ke-f%ke,s++;else if(p===Ee){for(O=s+ke;s<O&&r.charAt(s)===Ee;)s++,f++;s===O&&r.charAt(s)===Ee&&(s-=ke-1,f-=ke-1)}else p!==oe&&p!==""&&(v=null)}if(v){if(!u&&h!==v)break;E=!0}else!i&&!I&&r.charAt(g)===Ee?I=!0:i&&T&&(I=f>=T.indent||f>ke),E=!1,s=g;if(b=r.slice(g,F),A=g===s?b:r.slice(s,F),(v===un||v===Ch||v===an)&&a.thematicBreak.call(n,e,b,!0))break;if(d=y,y=!E&&!dh(A).length,I&&T)T.value=T.value.concat(k,b),C=C.concat(k,b),k=[];else if(E)k.length!==0&&(S=!0,T.value.push(""),T.trail=k.concat()),T={value:[b],indent:f,trail:[]},w.push(T),C=C.concat(k,b),k=[];else if(y){if(d&&!i)break;k.push(b)}else{if(d||Eh(o,a,n,[e,b,!0]))break;T.value=T.value.concat(k,b),C=C.concat(k,b),k=[]}s=F+1}for(P=e(C.join(oe)).reset({type:"list",ordered:m,start:c,spread:S,children:[]}),B=n.enterList(),_=n.enterBlock(),s=-1,l=w.length;++s<l;)T=w[s].value.join(oe),N=e.now(),e(T)(Th(n,T,N),P),T=w[s].trail.join(oe),s!==l-1&&(T+=oe),e(T);return B(),_(),P}}function Th(e,r,t){var n=e.offset,i=e.options.pedantic?Bh:_h,u=null,a,o;return r=i.apply(null,arguments),e.options.gfm&&(a=r.match(bh),a&&(o=a[0].length,u=a[1].toLowerCase()===vh,n[t.line]+=o,r=r.slice(o))),{type:"listItem",spread:Ah.test(r),checked:u,children:e.tokenizeBlock(r,t)}}function Bh(e,r,t){var n=e.offset,i=t.line;return r=r.replace(yh,u),i=t.line,r.replace(wh,u);function u(a){return n[i]=(n[i]||0)+a.length,i++,""}}function _h(e,r,t){var n=e.offset,i=t.line,u,a,o,s,l,c,f;for(r=r.replace(xh,D),s=r.split(oe),l=gh(r,Fh(u).indent).split(oe),l[0]=o,n[i]=(n[i]||0)+a.length,i++,c=0,f=s.length;++c<f;)n[i]=(n[i]||0)+s[c].length-l[c].length,i++;return l.join(oe);function D(m,p,h,F,g){return a=p+h+F,o=g,Number(h)<10&&a.length%2===1&&(h=Ee+h),u=p+mh(Ee,h.length)+F,u+o}}});var oo=x((Mv,ao)=>{"use strict";ao.exports=Sh;var on=`
`,Oh="	",io=" ",uo="=",qh="-",Nh=3,Ph=1,Ih=2;function Sh(e,r,t){for(var n=this,i=e.now(),u=r.length,a=-1,o="",s,l,c,f,D;++a<u;){if(c=r.charAt(a),c!==io||a>=Nh){a--;break}o+=c}for(s="",l="";++a<u;){if(c=r.charAt(a),c===on){a--;break}c===io||c===Oh?l+=c:(s+=l+c,l="")}if(i.column+=o.length,i.offset+=o.length,o+=s+l,c=r.charAt(++a),f=r.charAt(++a),!(c!==on||f!==uo&&f!==qh)){for(o+=c,l=f,D=f===uo?Ph:Ih;++a<u;){if(c=r.charAt(a),c!==f){if(c!==on)return;a--;break}l+=c}return t?!0:e(o+l)({type:"heading",depth:D,children:n.tokenizeInline(s,i)})}}});var cn=x(sn=>{"use strict";var Lh="[a-zA-Z_:][a-zA-Z0-9:._-]*",Rh="[^\"'=<>`\\u0000-\\u0020]+",Mh="'[^']*'",Uh='"[^"]*"',Yh="(?:"+Rh+"|"+Mh+"|"+Uh+")",Gh="(?:\\s+"+Lh+"(?:\\s*=\\s*"+Yh+")?)",so="<[A-Za-z][A-Za-z0-9\\-]*"+Gh+"*\\s*\\/?>",co="<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>",zh="<!---->|<!--(?:-?[^>-])(?:-?[^-])*-->",Wh="<[?].*?[?]>",Vh="<![A-Za-z]+\\s+[^>]*>",jh="<!\\[CDATA\\[[\\s\\S]*?\\]\\]>";sn.openCloseTag=new RegExp("^(?:"+so+"|"+co+")");sn.tag=new RegExp("^(?:"+so+"|"+co+"|"+zh+"|"+Wh+"|"+Vh+"|"+jh+")")});var po=x((Yv,Do)=>{"use strict";var $h=cn().openCloseTag;Do.exports=sd;var Hh="	",Kh=" ",lo=`
`,Xh="<",Jh=/^<(script|pre|style)(?=(\s|>|$))/i,Qh=/<\/(script|pre|style)>/i,Zh=/^<!--/,ed=/-->/,rd=/^<\?/,td=/\?>/,nd=/^<![A-Za-z]/,id=/>/,ud=/^<!\[CDATA\[/,ad=/]]>/,fo=/^$/,od=new RegExp($h.source+"\\s*$");function sd(e,r,t){for(var n=this,i=n.options.blocks.join("|"),u=new RegExp("^</?("+i+")(?=(\\s|/?>|$))","i"),a=r.length,o=0,s,l,c,f,D,m,p,h=[[Jh,Qh,!0],[Zh,ed,!0],[rd,td,!0],[nd,id,!0],[ud,ad,!0],[u,fo,!0],[od,fo,!1]];o<a&&(f=r.charAt(o),!(f!==Hh&&f!==Kh));)o++;if(r.charAt(o)===Xh){for(s=r.indexOf(lo,o+1),s=s===-1?a:s,l=r.slice(o,s),c=-1,D=h.length;++c<D;)if(h[c][0].test(l)){m=h[c];break}if(m){if(t)return m[2];if(o=s,!m[1].test(l))for(;o<a;){if(s=r.indexOf(lo,o+1),s=s===-1?a:s,l=r.slice(o+1,s),m[1].test(l)){l&&(o=s);break}o=s}return p=r.slice(0,o),e(p)({type:"html",value:p})}}}});var se=x((Gv,ho)=>{"use strict";ho.exports=fd;var cd=String.fromCharCode,ld=/\s/;function fd(e){return ld.test(typeof e=="number"?cd(e):e.charAt(0))}});var ln=x((zv,mo)=>{"use strict";var Dd=Tr();mo.exports=pd;function pd(e){return Dd(e).toLowerCase()}});var bo=x((Wv,Ao)=>{"use strict";var hd=se(),dd=ln();Ao.exports=Ed;var Fo='"',go="'",md="\\",Qe=`
`,nt="	",it=" ",Dn="[",vr="]",Fd="(",gd=")",Eo=":",Co="<",vo=">";function Ed(e,r,t){for(var n=this,i=n.options.commonmark,u=0,a=r.length,o="",s,l,c,f,D,m,p,h;u<a&&(f=r.charAt(u),!(f!==it&&f!==nt));)o+=f,u++;if(f=r.charAt(u),f===Dn){for(u++,o+=f,c="";u<a&&(f=r.charAt(u),f!==vr);)f===md&&(c+=f,u++,f=r.charAt(u)),c+=f,u++;if(!(!c||r.charAt(u)!==vr||r.charAt(u+1)!==Eo)){for(m=c,o+=c+vr+Eo,u=o.length,c="";u<a&&(f=r.charAt(u),!(f!==nt&&f!==it&&f!==Qe));)o+=f,u++;if(f=r.charAt(u),c="",s=o,f===Co){for(u++;u<a&&(f=r.charAt(u),!!fn(f));)c+=f,u++;if(f=r.charAt(u),f===fn.delimiter)o+=Co+c+f,u++;else{if(i)return;u-=c.length+1,c=""}}if(!c){for(;u<a&&(f=r.charAt(u),!!Cd(f));)c+=f,u++;o+=c}if(c){for(p=c,c="";u<a&&(f=r.charAt(u),!(f!==nt&&f!==it&&f!==Qe));)c+=f,u++;if(f=r.charAt(u),D=null,f===Fo?D=Fo:f===go?D=go:f===Fd&&(D=gd),!D)c="",u=o.length;else if(c){for(o+=c+f,u=o.length,c="";u<a&&(f=r.charAt(u),f!==D);){if(f===Qe){if(u++,f=r.charAt(u),f===Qe||f===D)return;c+=Qe}c+=f,u++}if(f=r.charAt(u),f!==D)return;l=o,o+=c+f,u++,h=c,c=""}else return;for(;u<a&&(f=r.charAt(u),!(f!==nt&&f!==it));)o+=f,u++;if(f=r.charAt(u),!f||f===Qe)return t?!0:(s=e(s).test().end,p=n.decode.raw(n.unescape(p),s,{nonTerminated:!1}),h&&(l=e(l).test().end,h=n.decode.raw(n.unescape(h),l)),e(o)({type:"definition",identifier:dd(m),label:m,title:h||null,url:p}))}}}}function fn(e){return e!==vo&&e!==Dn&&e!==vr}fn.delimiter=vo;function Cd(e){return e!==Dn&&e!==vr&&!hd(e)}});var wo=x((Vv,yo)=>{"use strict";var vd=se();yo.exports=Od;var Ad="	",ut=`
`,bd=" ",xd="-",yd=":",wd="\\",pn="|",kd=1,Td=2,xo="left",Bd="center",_d="right";function Od(e,r,t){var n=this,i,u,a,o,s,l,c,f,D,m,p,h,F,g,E,v,A,b,d,y,w,C;if(n.options.gfm){for(i=0,v=0,l=r.length+1,c=[];i<l;){if(y=r.indexOf(ut,i),w=r.indexOf(pn,i+1),y===-1&&(y=r.length),w===-1||w>y){if(v<Td)return;break}c.push(r.slice(i,y)),v++,i=y+1}for(o=c.join(ut),u=c.splice(1,1)[0]||[],i=0,l=u.length,v--,a=!1,p=[];i<l;){if(D=u.charAt(i),D===pn){if(m=null,a===!1){if(C===!1)return}else p.push(a),a=!1;C=!1}else if(D===xd)m=!0,a=a||null;else if(D===yd)a===xo?a=Bd:m&&a===null?a=_d:a=xo;else if(!vd(D))return;i++}if(a!==!1&&p.push(a),!(p.length<kd)){if(t)return!0;for(E=-1,b=[],d=e(o).reset({type:"table",align:p,children:b});++E<v;){for(A=c[E],s={type:"tableRow",children:[]},E&&e(ut),e(A).reset(s,d),l=A.length+1,i=0,f="",h="",F=!0;i<l;){if(D=A.charAt(i),D===Ad||D===bd){h?f+=D:e(D),i++;continue}D===""||D===pn?F?e(D):((h||D)&&!F&&(o=h,f.length>1&&(D?(o+=f.slice(0,-1),f=f.charAt(f.length-1)):(o+=f,f="")),g=e.now(),e(o)({type:"tableCell",children:n.tokenizeInline(h,g)},s)),e(f+D),f="",h=""):(f&&(h+=f,f=""),h+=D,D===wd&&i!==l-2&&(h+=A.charAt(i+1),i++)),F=!1,i++}E||e(ut+u)}return d}}}});var Bo=x((jv,To)=>{"use strict";var qd=Le(),Nd=Qt(),Pd=rt();To.exports=Ld;var Id="	",Ar=`
`,Sd=" ",ko=4;function Ld(e,r,t){for(var n=this,i=n.options,u=i.commonmark,a=n.blockTokenizers,o=n.interruptParagraph,s=r.indexOf(Ar),l=r.length,c,f,D,m,p;s<l;){if(s===-1){s=l;break}if(r.charAt(s+1)===Ar)break;if(u){for(m=0,c=s+1;c<l;){if(D=r.charAt(c),D===Id){m=ko;break}else if(D===Sd)m++;else break;c++}if(m>=ko&&D!==Ar){s=r.indexOf(Ar,s+1);continue}}if(f=r.slice(s+1),Pd(o,a,n,[e,f,!0]))break;if(c=s,s=r.indexOf(Ar,s+1),s!==-1&&qd(r.slice(c,s))===""){s=c;break}}return f=r.slice(0,s),t?!0:(p=e.now(),f=Nd(f),e(f)({type:"paragraph",children:n.tokenizeInline(f,p)}))}});var Oo=x(($v,_o)=>{"use strict";_o.exports=Rd;function Rd(e,r){return e.indexOf("\\",r)}});var Io=x((Hv,Po)=>{"use strict";var Md=Oo();Po.exports=No;No.locator=Md;var Ud=`
`,qo="\\";function No(e,r,t){var n=this,i,u;if(r.charAt(0)===qo&&(i=r.charAt(1),n.escape.indexOf(i)!==-1))return t?!0:(i===Ud?u={type:"break"}:u={type:"text",value:i},e(qo+i)(u))}});var hn=x((Kv,So)=>{"use strict";So.exports=Yd;function Yd(e,r){return e.indexOf("<",r)}});var Yo=x((Xv,Uo)=>{"use strict";var Lo=se(),Gd=mr(),zd=hn();Uo.exports=gn;gn.locator=zd;gn.notInLink=!0;var Ro="<",dn=">",Mo="@",mn="/",Fn="mailto:",at=Fn.length;function gn(e,r,t){var n=this,i="",u=r.length,a=0,o="",s=!1,l="",c,f,D,m,p;if(r.charAt(0)===Ro){for(a++,i=Ro;a<u&&(c=r.charAt(a),!(Lo(c)||c===dn||c===Mo||c===":"&&r.charAt(a+1)===mn));)o+=c,a++;if(o){if(l+=o,o="",c=r.charAt(a),l+=c,a++,c===Mo)s=!0;else{if(c!==":"||r.charAt(a+1)!==mn)return;l+=mn,a++}for(;a<u&&(c=r.charAt(a),!(Lo(c)||c===dn));)o+=c,a++;if(c=r.charAt(a),!(!o||c!==dn))return t?!0:(l+=o,D=l,i+=l+c,f=e.now(),f.column++,f.offset++,s&&(l.slice(0,at).toLowerCase()===Fn?(D=D.slice(at),f.column+=at,f.offset+=at):l=Fn+l),m=n.inlineTokenizers,n.inlineTokenizers={text:m.text},p=n.enterLink(),D=n.tokenizeInline(D,f),n.inlineTokenizers=m,p(),e(i)({type:"link",title:null,url:Gd(l,{nonTerminated:!1}),children:D}))}}}});var zo=x((Jv,Go)=>{"use strict";Go.exports=Wd;function Wd(e,r){var t=String(e),n=0,i;if(typeof r!="string")throw new Error("Expected character");for(i=t.indexOf(r);i!==-1;)n++,i=t.indexOf(r,i+r.length);return n}});var jo=x((Qv,Vo)=>{"use strict";Vo.exports=Vd;var Wo=["www.","http://","https://"];function Vd(e,r){var t=-1,n,i,u;if(!this.options.gfm)return t;for(i=Wo.length,n=-1;++n<i;)u=e.indexOf(Wo[n],r),u!==-1&&(t===-1||u<t)&&(t=u);return t}});var Jo=x((Zv,Xo)=>{"use strict";var $o=zo(),jd=mr(),$d=Se(),En=$e(),Hd=se(),Kd=jo();Xo.exports=vn;vn.locator=Kd;vn.notInLink=!0;var Xd=33,Jd=38,Qd=41,Zd=42,e0=44,r0=45,Cn=46,t0=58,n0=59,i0=63,u0=60,Ho=95,a0=126,o0="(",Ko=")";function vn(e,r,t){var n=this,i=n.options.gfm,u=n.inlineTokenizers,a=r.length,o=-1,s=!1,l,c,f,D,m,p,h,F,g,E,v,A,b,d;if(i){if(r.slice(0,4)==="www.")s=!0,D=4;else if(r.slice(0,7).toLowerCase()==="http://")D=7;else if(r.slice(0,8).toLowerCase()==="https://")D=8;else return;for(o=D-1,f=D,l=[];D<a;){if(h=r.charCodeAt(D),h===Cn){if(o===D-1)break;l.push(D),o=D,D++;continue}if($d(h)||En(h)||h===r0||h===Ho){D++;continue}break}if(h===Cn&&(l.pop(),D--),l[0]!==void 0&&(c=l.length<2?f:l[l.length-2]+1,r.slice(c,D).indexOf("_")===-1)){if(t)return!0;for(F=D,m=D;D<a&&(h=r.charCodeAt(D),!(Hd(h)||h===u0));)D++,h===Xd||h===Zd||h===e0||h===Cn||h===t0||h===i0||h===Ho||h===a0||(F=D);if(D=F,r.charCodeAt(D-1)===Qd)for(p=r.slice(m,D),g=$o(p,o0),E=$o(p,Ko);E>g;)D=m+p.lastIndexOf(Ko),p=r.slice(m,D),E--;if(r.charCodeAt(D-1)===n0&&(D--,En(r.charCodeAt(D-1)))){for(F=D-2;En(r.charCodeAt(F));)F--;r.charCodeAt(F)===Jd&&(D=F)}return v=r.slice(0,D),b=jd(v,{nonTerminated:!1}),s&&(b="http://"+b),d=n.enterLink(),n.inlineTokenizers={text:u.text},A=n.tokenizeInline(v,e.now()),n.inlineTokenizers=u,d(),e(v)({type:"link",title:null,url:b,children:A})}}}});var rs=x((e2,es)=>{"use strict";var s0=Se(),c0=$e(),l0=43,f0=45,D0=46,p0=95;es.exports=Zo;function Zo(e,r){var t=this,n,i;if(!this.options.gfm||(n=e.indexOf("@",r),n===-1))return-1;if(i=n,i===r||!Qo(e.charCodeAt(i-1)))return Zo.call(t,e,n+1);for(;i>r&&Qo(e.charCodeAt(i-1));)i--;return i}function Qo(e){return s0(e)||c0(e)||e===l0||e===f0||e===D0||e===p0}});var us=x((r2,is)=>{"use strict";var h0=mr(),ts=Se(),ns=$e(),d0=rs();is.exports=xn;xn.locator=d0;xn.notInLink=!0;var m0=43,An=45,ot=46,F0=64,bn=95;function xn(e,r,t){var n=this,i=n.options.gfm,u=n.inlineTokenizers,a=0,o=r.length,s=-1,l,c,f,D;if(i){for(l=r.charCodeAt(a);ts(l)||ns(l)||l===m0||l===An||l===ot||l===bn;)l=r.charCodeAt(++a);if(a!==0&&l===F0){for(a++;a<o;){if(l=r.charCodeAt(a),ts(l)||ns(l)||l===An||l===ot||l===bn){a++,s===-1&&l===ot&&(s=a);continue}break}if(!(s===-1||s===a||l===An||l===bn))return l===ot&&a--,c=r.slice(0,a),t?!0:(D=n.enterLink(),n.inlineTokenizers={text:u.text},f=n.tokenizeInline(c,e.now()),n.inlineTokenizers=u,D(),e(c)({type:"link",title:null,url:"mailto:"+h0(c,{nonTerminated:!1}),children:f}))}}}});var ss=x((t2,os)=>{"use strict";var g0=$e(),E0=hn(),C0=cn().tag;os.exports=as;as.locator=E0;var v0="<",A0="?",b0="!",x0="/",y0=/^<a /i,w0=/^<\/a>/i;function as(e,r,t){var n=this,i=r.length,u,a;if(!(r.charAt(0)!==v0||i<3)&&(u=r.charAt(1),!(!g0(u)&&u!==A0&&u!==b0&&u!==x0)&&(a=r.match(C0),!!a)))return t?!0:(a=a[0],!n.inLink&&y0.test(a)?n.inLink=!0:n.inLink&&w0.test(a)&&(n.inLink=!1),e(a)({type:"html",value:a}))}});var yn=x((n2,cs)=>{"use strict";cs.exports=k0;function k0(e,r){var t=e.indexOf("[",r),n=e.indexOf("![",r);return n===-1||t<n?t:n}});var ms=x((i2,ds)=>{"use strict";var br=se(),T0=yn();ds.exports=hs;hs.locator=T0;var B0=`
`,_0="!",ls='"',fs="'",Ze="(",xr=")",wn="<",kn=">",Ds="[",yr="\\",O0="]",ps="`";function hs(e,r,t){var n=this,i="",u=0,a=r.charAt(0),o=n.options.pedantic,s=n.options.commonmark,l=n.options.gfm,c,f,D,m,p,h,F,g,E,v,A,b,d,y,w,C,k,T;if(a===_0&&(g=!0,i=a,a=r.charAt(++u)),a===Ds&&!(!g&&n.inLink)){for(i+=a,y="",u++,A=r.length,C=e.now(),d=0,C.column+=u,C.offset+=u;u<A;){if(a=r.charAt(u),h=a,a===ps){for(f=1;r.charAt(u+1)===ps;)h+=a,u++,f++;D?f>=D&&(D=0):D=f}else if(a===yr)u++,h+=r.charAt(u);else if((!D||l)&&a===Ds)d++;else if((!D||l)&&a===O0)if(d)d--;else{if(r.charAt(u+1)!==Ze)return;h+=Ze,c=!0,u++;break}y+=h,h="",u++}if(c){for(E=y,i+=y+h,u++;u<A&&(a=r.charAt(u),!!br(a));)i+=a,u++;if(a=r.charAt(u),y="",m=i,a===wn){for(u++,m+=wn;u<A&&(a=r.charAt(u),a!==kn);){if(s&&a===B0)return;y+=a,u++}if(r.charAt(u)!==kn)return;i+=wn+y+kn,w=y,u++}else{for(a=null,h="";u<A&&(a=r.charAt(u),!(h&&(a===ls||a===fs||s&&a===Ze)));){if(br(a)){if(!o)break;h+=a}else{if(a===Ze)d++;else if(a===xr){if(d===0)break;d--}y+=h,h="",a===yr&&(y+=yr,a=r.charAt(++u)),y+=a}u++}i+=y,w=y,u=i.length}for(y="";u<A&&(a=r.charAt(u),!!br(a));)y+=a,u++;if(a=r.charAt(u),i+=y,y&&(a===ls||a===fs||s&&a===Ze))if(u++,i+=a,y="",v=a===Ze?xr:a,p=i,s){for(;u<A&&(a=r.charAt(u),a!==v);)a===yr&&(y+=yr,a=r.charAt(++u)),u++,y+=a;if(a=r.charAt(u),a!==v)return;for(b=y,i+=y+a,u++;u<A&&(a=r.charAt(u),!!br(a));)i+=a,u++}else for(h="";u<A;){if(a=r.charAt(u),a===v)F&&(y+=v+h,h=""),F=!0;else if(!F)y+=a;else if(a===xr){i+=y+v+h,b=y;break}else br(a)?h+=a:(y+=v+h+a,h="",F=!1);u++}if(r.charAt(u)===xr)return t?!0:(i+=xr,w=n.decode.raw(n.unescape(w),e(m).test().end,{nonTerminated:!1}),b&&(p=e(p).test().end,b=n.decode.raw(n.unescape(b),p)),T={type:g?"image":"link",title:b||null,url:w},g?T.alt=n.decode.raw(n.unescape(E),C)||null:(k=n.enterLink(),T.children=n.tokenizeInline(E,C),k()),e(i)(T))}}}});var Es=x((u2,gs)=>{"use strict";var q0=se(),N0=yn(),P0=ln();gs.exports=Fs;Fs.locator=N0;var Tn="link",I0="image",S0="shortcut",L0="collapsed",Bn="full",R0="!",st="[",ct="\\",lt="]";function Fs(e,r,t){var n=this,i=n.options.commonmark,u=r.charAt(0),a=0,o=r.length,s="",l="",c=Tn,f=S0,D,m,p,h,F,g,E,v;if(u===R0&&(c=I0,l=u,u=r.charAt(++a)),u===st){for(a++,l+=u,g="",v=0;a<o;){if(u=r.charAt(a),u===st)E=!0,v++;else if(u===lt){if(!v)break;v--}u===ct&&(g+=ct,u=r.charAt(++a)),g+=u,a++}if(s=g,D=g,u=r.charAt(a),u===lt){if(a++,s+=u,g="",!i)for(;a<o&&(u=r.charAt(a),!!q0(u));)g+=u,a++;if(u=r.charAt(a),u===st){for(m="",g+=u,a++;a<o&&(u=r.charAt(a),!(u===st||u===lt));)u===ct&&(m+=ct,u=r.charAt(++a)),m+=u,a++;u=r.charAt(a),u===lt?(f=m?Bn:L0,g+=m+u,a++):m="",s+=g,g=""}else{if(!D)return;m=D}if(!(f!==Bn&&E))return s=l+s,c===Tn&&n.inLink?null:t?!0:(p=e.now(),p.column+=l.length,p.offset+=l.length,m=f===Bn?m:D,h={type:c+"Reference",identifier:P0(m),label:m,referenceType:f},c===Tn?(F=n.enterLink(),h.children=n.tokenizeInline(D,p),F()):h.alt=n.decode.raw(n.unescape(D),p)||null,e(s)(h))}}}});var vs=x((a2,Cs)=>{"use strict";Cs.exports=M0;function M0(e,r){var t=e.indexOf("**",r),n=e.indexOf("__",r);return n===-1?t:t===-1||n<t?n:t}});var ys=x((o2,xs)=>{"use strict";var U0=Le(),As=se(),Y0=vs();xs.exports=bs;bs.locator=Y0;var G0="\\",z0="*",W0="_";function bs(e,r,t){var n=this,i=0,u=r.charAt(i),a,o,s,l,c,f,D;if(!(u!==z0&&u!==W0||r.charAt(++i)!==u)&&(o=n.options.pedantic,s=u,c=s+s,f=r.length,i++,l="",u="",!(o&&As(r.charAt(i)))))for(;i<f;){if(D=u,u=r.charAt(i),u===s&&r.charAt(i+1)===s&&(!o||!As(D))&&(u=r.charAt(i+2),u!==s))return U0(l)?t?!0:(a=e.now(),a.column+=2,a.offset+=2,e(c+l+c)({type:"strong",children:n.tokenizeInline(l,a)})):void 0;!o&&u===G0&&(l+=u,u=r.charAt(++i)),l+=u,i++}}});var ks=x((s2,ws)=>{"use strict";ws.exports=$0;var V0=String.fromCharCode,j0=/\w/;function $0(e){return j0.test(typeof e=="number"?V0(e):e.charAt(0))}});var Bs=x((c2,Ts)=>{"use strict";Ts.exports=H0;function H0(e,r){var t=e.indexOf("*",r),n=e.indexOf("_",r);return n===-1?t:t===-1||n<t?n:t}});var Ps=x((l2,Ns)=>{"use strict";var K0=Le(),X0=ks(),_s=se(),J0=Bs();Ns.exports=qs;qs.locator=J0;var Q0="*",Os="_",Z0="\\";function qs(e,r,t){var n=this,i=0,u=r.charAt(i),a,o,s,l,c,f,D;if(!(u!==Q0&&u!==Os)&&(o=n.options.pedantic,c=u,s=u,f=r.length,i++,l="",u="",!(o&&_s(r.charAt(i)))))for(;i<f;){if(D=u,u=r.charAt(i),u===s&&(!o||!_s(D))){if(u=r.charAt(++i),u!==s){if(!K0(l)||D===s)return;if(!o&&s===Os&&X0(u)){l+=s;continue}return t?!0:(a=e.now(),a.column++,a.offset++,e(c+l+s)({type:"emphasis",children:n.tokenizeInline(l,a)}))}l+=s}!o&&u===Z0&&(l+=u,u=r.charAt(++i)),l+=u,i++}}});var Ss=x((f2,Is)=>{"use strict";Is.exports=em;function em(e,r){return e.indexOf("~~",r)}});var Ys=x((D2,Us)=>{"use strict";var Ls=se(),rm=Ss();Us.exports=Ms;Ms.locator=rm;var ft="~",Rs="~~";function Ms(e,r,t){var n=this,i="",u="",a="",o="",s,l,c;if(!(!n.options.gfm||r.charAt(0)!==ft||r.charAt(1)!==ft||Ls(r.charAt(2))))for(s=1,l=r.length,c=e.now(),c.column+=2,c.offset+=2;++s<l;){if(i=r.charAt(s),i===ft&&u===ft&&(!a||!Ls(a)))return t?!0:e(Rs+o+Rs)({type:"delete",children:n.tokenizeInline(o,c)});o+=u,a=u,u=i}}});var zs=x((p2,Gs)=>{"use strict";Gs.exports=tm;function tm(e,r){return e.indexOf("`",r)}});var js=x((h2,Vs)=>{"use strict";var nm=zs();Vs.exports=Ws;Ws.locator=nm;var _n=10,On=32,qn=96;function Ws(e,r,t){for(var n=r.length,i=0,u,a,o,s,l,c;i<n&&r.charCodeAt(i)===qn;)i++;if(!(i===0||i===n)){for(u=i,l=r.charCodeAt(i);i<n;){if(s=l,l=r.charCodeAt(i+1),s===qn){if(a===void 0&&(a=i),o=i+1,l!==qn&&o-a===u){c=!0;break}}else a!==void 0&&(a=void 0,o=void 0);i++}if(c){if(t)return!0;if(i=u,n=a,s=r.charCodeAt(i),l=r.charCodeAt(n-1),c=!1,n-i>2&&(s===On||s===_n)&&(l===On||l===_n)){for(i++,n--;i<n;){if(s=r.charCodeAt(i),s!==On&&s!==_n){c=!0;break}i++}c===!0&&(u++,a--)}return e(r.slice(0,o))({type:"inlineCode",value:r.slice(u,a)})}}}});var Hs=x((d2,$s)=>{"use strict";$s.exports=im;function im(e,r){for(var t=e.indexOf(`
`,r);t>r&&e.charAt(t-1)===" ";)t--;return t}});var Js=x((m2,Xs)=>{"use strict";var um=Hs();Xs.exports=Ks;Ks.locator=um;var am=" ",om=`
`,sm=2;function Ks(e,r,t){for(var n=r.length,i=-1,u="",a;++i<n;){if(a=r.charAt(i),a===om)return i<sm?void 0:t?!0:(u+=a,e(u)({type:"break"}));if(a!==am)return;u+=a}}});var Zs=x((F2,Qs)=>{"use strict";Qs.exports=cm;function cm(e,r,t){var n=this,i,u,a,o,s,l,c,f,D,m;if(t)return!0;for(i=n.inlineMethods,o=i.length,u=n.inlineTokenizers,a=-1,D=r.length;++a<o;)f=i[a],!(f==="text"||!u[f])&&(c=u[f].locator,c||e.file.fail("Missing locator: `"+f+"`"),l=c.call(n,r,1),l!==-1&&l<D&&(D=l));s=r.slice(0,D),m=e.now(),n.decode(s,m,p);function p(h,F,g){e(g||h)({type:"text",value:h})}}});var nc=x((g2,tc)=>{"use strict";var lm=Ie(),Dt=Eu(),fm=vu(),Dm=bu(),pm=Ju(),Nn=ea();tc.exports=ec;function ec(e,r){this.file=r,this.offset={},this.options=lm(this.options),this.setOptions({}),this.inList=!1,this.inBlock=!1,this.inLink=!1,this.atStart=!0,this.toOffset=fm(r).toOffset,this.unescape=Dm(this,"escape"),this.decode=pm(this)}var Y=ec.prototype;Y.setOptions=sa();Y.parse=xa();Y.options=Kt();Y.exitStart=Dt("atStart",!0);Y.enterList=Dt("inList",!1);Y.enterLink=Dt("inLink",!1);Y.enterBlock=Dt("inBlock",!1);Y.interruptParagraph=[["thematicBreak"],["list"],["atxHeading"],["fencedCode"],["blockquote"],["html"],["setextHeading",{commonmark:!1}],["definition",{commonmark:!1}]];Y.interruptList=[["atxHeading",{pedantic:!1}],["fencedCode",{pedantic:!1}],["thematicBreak",{pedantic:!1}],["definition",{commonmark:!1}]];Y.interruptBlockquote=[["indentedCode",{commonmark:!0}],["fencedCode",{commonmark:!0}],["atxHeading",{commonmark:!0}],["setextHeading",{commonmark:!0}],["thematicBreak",{commonmark:!0}],["html",{commonmark:!0}],["list",{commonmark:!0}],["definition",{commonmark:!1}]];Y.blockTokenizers={blankLine:wa(),indentedCode:Oa(),fencedCode:Pa(),blockquote:Ua(),atxHeading:za(),thematicBreak:ja(),list:no(),setextHeading:oo(),html:po(),definition:bo(),table:wo(),paragraph:Bo()};Y.inlineTokenizers={escape:Io(),autoLink:Yo(),url:Jo(),email:us(),html:ss(),link:ms(),reference:Es(),strong:ys(),emphasis:Ps(),deletion:Ys(),code:js(),break:Js(),text:Zs()};Y.blockMethods=rc(Y.blockTokenizers);Y.inlineMethods=rc(Y.inlineTokenizers);Y.tokenizeBlock=Nn("block");Y.tokenizeInline=Nn("inline");Y.tokenizeFactory=Nn;function rc(e){var r=[],t;for(t in e)r.push(t);return r}});var oc=x((E2,ac)=>{"use strict";var hm=Fu(),dm=Ie(),ic=nc();ac.exports=uc;uc.Parser=ic;function uc(e){var r=this.data("settings"),t=hm(ic);t.prototype.options=dm(t.prototype.options,r,e),this.Parser=t}});var cc=x((C2,sc)=>{"use strict";sc.exports=mm;function mm(e){if(e)throw e}});var Pn=x((v2,lc)=>{lc.exports=function(r){return r!=null&&r.constructor!=null&&typeof r.constructor.isBuffer=="function"&&r.constructor.isBuffer(r)}});var Ec=x((A2,gc)=>{"use strict";var pt=Object.prototype.hasOwnProperty,Fc=Object.prototype.toString,fc=Object.defineProperty,Dc=Object.getOwnPropertyDescriptor,pc=function(r){return typeof Array.isArray=="function"?Array.isArray(r):Fc.call(r)==="[object Array]"},hc=function(r){if(!r||Fc.call(r)!=="[object Object]")return!1;var t=pt.call(r,"constructor"),n=r.constructor&&r.constructor.prototype&&pt.call(r.constructor.prototype,"isPrototypeOf");if(r.constructor&&!t&&!n)return!1;var i;for(i in r);return typeof i>"u"||pt.call(r,i)},dc=function(r,t){fc&&t.name==="__proto__"?fc(r,t.name,{enumerable:!0,configurable:!0,value:t.newValue,writable:!0}):r[t.name]=t.newValue},mc=function(r,t){if(t==="__proto__")if(pt.call(r,t)){if(Dc)return Dc(r,t).value}else return;return r[t]};gc.exports=function e(){var r,t,n,i,u,a,o=arguments[0],s=1,l=arguments.length,c=!1;for(typeof o=="boolean"&&(c=o,o=arguments[1]||{},s=2),(o==null||typeof o!="object"&&typeof o!="function")&&(o={});s<l;++s)if(r=arguments[s],r!=null)for(t in r)n=mc(o,t),i=mc(r,t),o!==i&&(c&&i&&(hc(i)||(u=pc(i)))?(u?(u=!1,a=n&&pc(n)?n:[]):a=n&&hc(n)?n:{},dc(o,{name:t,newValue:e(c,a,i)})):typeof i<"u"&&dc(o,{name:t,newValue:i}));return o}});var vc=x((b2,Cc)=>{"use strict";Cc.exports=e=>{if(Object.prototype.toString.call(e)!=="[object Object]")return!1;let r=Object.getPrototypeOf(e);return r===null||r===Object.prototype}});var bc=x((x2,Ac)=>{"use strict";var Fm=[].slice;Ac.exports=gm;function gm(e,r){var t;return n;function n(){var a=Fm.call(arguments,0),o=e.length>a.length,s;o&&a.push(i);try{s=e.apply(null,a)}catch(l){if(o&&t)throw l;return i(l)}o||(s&&typeof s.then=="function"?s.then(u,i):s instanceof Error?i(s):u(s))}function i(){t||(t=!0,r.apply(null,arguments))}function u(a){i(null,a)}}});var Tc=x((y2,kc)=>{"use strict";var yc=bc();kc.exports=wc;wc.wrap=yc;var xc=[].slice;function wc(){var e=[],r={};return r.run=t,r.use=n,r;function t(){var i=-1,u=xc.call(arguments,0,-1),a=arguments[arguments.length-1];if(typeof a!="function")throw new Error("Expected function as last argument, not "+a);o.apply(null,[null].concat(u));function o(s){var l=e[++i],c=xc.call(arguments,0),f=c.slice(1),D=u.length,m=-1;if(s){a(s);return}for(;++m<D;)(f[m]===null||f[m]===void 0)&&(f[m]=u[m]);u=f,l?yc(l,o).apply(null,u):a.apply(null,[null].concat(u))}}function n(i){if(typeof i!="function")throw new Error("Expected `fn` to be a function, not "+i);return e.push(i),r}}});var qc=x((w2,Oc)=>{"use strict";var er={}.hasOwnProperty;Oc.exports=Em;function Em(e){return!e||typeof e!="object"?"":er.call(e,"position")||er.call(e,"type")?Bc(e.position):er.call(e,"start")||er.call(e,"end")?Bc(e):er.call(e,"line")||er.call(e,"column")?In(e):""}function In(e){return(!e||typeof e!="object")&&(e={}),_c(e.line)+":"+_c(e.column)}function Bc(e){return(!e||typeof e!="object")&&(e={}),In(e.start)+"-"+In(e.end)}function _c(e){return e&&typeof e=="number"?e:1}});var Ic=x((k2,Pc)=>{"use strict";var Cm=qc();Pc.exports=Sn;function Nc(){}Nc.prototype=Error.prototype;Sn.prototype=new Nc;var Te=Sn.prototype;Te.file="";Te.name="";Te.reason="";Te.message="";Te.stack="";Te.fatal=null;Te.column=null;Te.line=null;function Sn(e,r,t){var n,i,u;typeof r=="string"&&(t=r,r=null),n=vm(t),i=Cm(r)||"1:1",u={start:{line:null,column:null},end:{line:null,column:null}},r&&r.position&&(r=r.position),r&&(r.start?(u=r,r=r.start):u.start=r),e.stack&&(this.stack=e.stack,e=e.message),this.message=e,this.name=i,this.reason=e,this.line=r?r.line:null,this.column=r?r.column:null,this.location=u,this.source=n[0],this.ruleId=n[1]}function vm(e){var r=[null,null],t;return typeof e=="string"&&(t=e.indexOf(":"),t===-1?r[1]=e:(r[0]=e.slice(0,t),r[1]=e.slice(t+1))),r}});var Sc=x(rr=>{"use strict";rr.basename=Am;rr.dirname=bm;rr.extname=xm;rr.join=ym;rr.sep="/";function Am(e,r){var t=0,n=-1,i,u,a,o;if(r!==void 0&&typeof r!="string")throw new TypeError('"ext" argument must be a string');if(wr(e),i=e.length,r===void 0||!r.length||r.length>e.length){for(;i--;)if(e.charCodeAt(i)===47){if(a){t=i+1;break}}else n<0&&(a=!0,n=i+1);return n<0?"":e.slice(t,n)}if(r===e)return"";for(u=-1,o=r.length-1;i--;)if(e.charCodeAt(i)===47){if(a){t=i+1;break}}else u<0&&(a=!0,u=i+1),o>-1&&(e.charCodeAt(i)===r.charCodeAt(o--)?o<0&&(n=i):(o=-1,n=u));return t===n?n=u:n<0&&(n=e.length),e.slice(t,n)}function bm(e){var r,t,n;if(wr(e),!e.length)return".";for(r=-1,n=e.length;--n;)if(e.charCodeAt(n)===47){if(t){r=n;break}}else t||(t=!0);return r<0?e.charCodeAt(0)===47?"/":".":r===1&&e.charCodeAt(0)===47?"//":e.slice(0,r)}function xm(e){var r=-1,t=0,n=-1,i=0,u,a,o;for(wr(e),o=e.length;o--;){if(a=e.charCodeAt(o),a===47){if(u){t=o+1;break}continue}n<0&&(u=!0,n=o+1),a===46?r<0?r=o:i!==1&&(i=1):r>-1&&(i=-1)}return r<0||n<0||i===0||i===1&&r===n-1&&r===t+1?"":e.slice(r,n)}function ym(){for(var e=-1,r;++e<arguments.length;)wr(arguments[e]),arguments[e]&&(r=r===void 0?arguments[e]:r+"/"+arguments[e]);return r===void 0?".":wm(r)}function wm(e){var r,t;return wr(e),r=e.charCodeAt(0)===47,t=km(e,!r),!t.length&&!r&&(t="."),t.length&&e.charCodeAt(e.length-1)===47&&(t+="/"),r?"/"+t:t}function km(e,r){for(var t="",n=0,i=-1,u=0,a=-1,o,s;++a<=e.length;){if(a<e.length)o=e.charCodeAt(a);else{if(o===47)break;o=47}if(o===47){if(!(i===a-1||u===1))if(i!==a-1&&u===2){if(t.length<2||n!==2||t.charCodeAt(t.length-1)!==46||t.charCodeAt(t.length-2)!==46){if(t.length>2){if(s=t.lastIndexOf("/"),s!==t.length-1){s<0?(t="",n=0):(t=t.slice(0,s),n=t.length-1-t.lastIndexOf("/")),i=a,u=0;continue}}else if(t.length){t="",n=0,i=a,u=0;continue}}r&&(t=t.length?t+"/..":"..",n=2)}else t.length?t+="/"+e.slice(i+1,a):t=e.slice(i+1,a),n=a-i-1;i=a,u=0}else o===46&&u>-1?u++:u=-1}return t}function wr(e){if(typeof e!="string")throw new TypeError("Path must be a string. Received "+JSON.stringify(e))}});var Rc=x(Lc=>{"use strict";Lc.cwd=Tm;function Tm(){return"/"}});var Yc=x((_2,Uc)=>{"use strict";var ce=Sc(),Bm=Rc(),_m=Pn();Uc.exports=Ce;var Om={}.hasOwnProperty,Ln=["history","path","basename","stem","extname","dirname"];Ce.prototype.toString=Gm;Object.defineProperty(Ce.prototype,"path",{get:qm,set:Nm});Object.defineProperty(Ce.prototype,"dirname",{get:Pm,set:Im});Object.defineProperty(Ce.prototype,"basename",{get:Sm,set:Lm});Object.defineProperty(Ce.prototype,"extname",{get:Rm,set:Mm});Object.defineProperty(Ce.prototype,"stem",{get:Um,set:Ym});function Ce(e){var r,t;if(!e)e={};else if(typeof e=="string"||_m(e))e={contents:e};else if("message"in e&&"messages"in e)return e;if(!(this instanceof Ce))return new Ce(e);for(this.data={},this.messages=[],this.history=[],this.cwd=Bm.cwd(),t=-1;++t<Ln.length;)r=Ln[t],Om.call(e,r)&&(this[r]=e[r]);for(r in e)Ln.indexOf(r)<0&&(this[r]=e[r])}function qm(){return this.history[this.history.length-1]}function Nm(e){Mn(e,"path"),this.path!==e&&this.history.push(e)}function Pm(){return typeof this.path=="string"?ce.dirname(this.path):void 0}function Im(e){Mc(this.path,"dirname"),this.path=ce.join(e||"",this.basename)}function Sm(){return typeof this.path=="string"?ce.basename(this.path):void 0}function Lm(e){Mn(e,"basename"),Rn(e,"basename"),this.path=ce.join(this.dirname||"",e)}function Rm(){return typeof this.path=="string"?ce.extname(this.path):void 0}function Mm(e){if(Rn(e,"extname"),Mc(this.path,"extname"),e){if(e.charCodeAt(0)!==46)throw new Error("`extname` must start with `.`");if(e.indexOf(".",1)>-1)throw new Error("`extname` cannot contain multiple dots")}this.path=ce.join(this.dirname,this.stem+(e||""))}function Um(){return typeof this.path=="string"?ce.basename(this.path,this.extname):void 0}function Ym(e){Mn(e,"stem"),Rn(e,"stem"),this.path=ce.join(this.dirname||"",e+(this.extname||""))}function Gm(e){return(this.contents||"").toString(e)}function Rn(e,r){if(e&&e.indexOf(ce.sep)>-1)throw new Error("`"+r+"` cannot be a path: did not expect `"+ce.sep+"`")}function Mn(e,r){if(!e)throw new Error("`"+r+"` cannot be empty")}function Mc(e,r){if(!e)throw new Error("Setting `"+r+"` requires `path` to be set too")}});var zc=x((O2,Gc)=>{"use strict";var zm=Ic(),ht=Yc();Gc.exports=ht;ht.prototype.message=Wm;ht.prototype.info=jm;ht.prototype.fail=Vm;function Wm(e,r,t){var n=new zm(e,r,t);return this.path&&(n.name=this.path+":"+n.name,n.file=this.path),n.fatal=!1,this.messages.push(n),n}function Vm(){var e=this.message.apply(this,arguments);throw e.fatal=!0,e}function jm(){var e=this.message.apply(this,arguments);return e.fatal=null,e}});var Vc=x((q2,Wc)=>{"use strict";Wc.exports=zc()});var el=x((N2,Zc)=>{"use strict";var jc=cc(),$m=Pn(),dt=Ec(),$c=vc(),Jc=Tc(),kr=Vc();Zc.exports=Qc().freeze();var Hm=[].slice,Km={}.hasOwnProperty,Xm=Jc().use(Jm).use(Qm).use(Zm);function Jm(e,r){r.tree=e.parse(r.file)}function Qm(e,r,t){e.run(r.tree,r.file,n);function n(i,u,a){i?t(i):(r.tree=u,r.file=a,t())}}function Zm(e,r){var t=e.stringify(r.tree,r.file);t==null||(typeof t=="string"||$m(t)?("value"in r.file&&(r.file.value=t),r.file.contents=t):r.file.result=t)}function Qc(){var e=[],r=Jc(),t={},n=-1,i;return u.data=o,u.freeze=a,u.attachers=e,u.use=s,u.parse=c,u.stringify=m,u.run=f,u.runSync=D,u.process=p,u.processSync=h,u;function u(){for(var F=Qc(),g=-1;++g<e.length;)F.use.apply(null,e[g]);return F.data(dt(!0,{},t)),F}function a(){var F,g;if(i)return u;for(;++n<e.length;)F=e[n],F[1]!==!1&&(F[1]===!0&&(F[1]=void 0),g=F[0].apply(u,F.slice(1)),typeof g=="function"&&r.use(g));return i=!0,n=1/0,u}function o(F,g){return typeof F=="string"?arguments.length===2?(Gn("data",i),t[F]=g,u):Km.call(t,F)&&t[F]||null:F?(Gn("data",i),t=F,u):t}function s(F){var g;if(Gn("use",i),F!=null)if(typeof F=="function")b.apply(null,arguments);else if(typeof F=="object")"length"in F?A(F):E(F);else throw new Error("Expected usable value, not `"+F+"`");return g&&(t.settings=dt(t.settings||{},g)),u;function E(d){A(d.plugins),d.settings&&(g=dt(g||{},d.settings))}function v(d){if(typeof d=="function")b(d);else if(typeof d=="object")"length"in d?b.apply(null,d):E(d);else throw new Error("Expected usable value, not `"+d+"`")}function A(d){var y=-1;if(d!=null)if(typeof d=="object"&&"length"in d)for(;++y<d.length;)v(d[y]);else throw new Error("Expected a list of plugins, not `"+d+"`")}function b(d,y){var w=l(d);w?($c(w[1])&&$c(y)&&(y=dt(!0,w[1],y)),w[1]=y):e.push(Hm.call(arguments))}}function l(F){for(var g=-1;++g<e.length;)if(e[g][0]===F)return e[g]}function c(F){var g=kr(F),E;return a(),E=u.Parser,Un("parse",E),Hc(E,"parse")?new E(String(g),g).parse():E(String(g),g)}function f(F,g,E){if(Kc(F),a(),!E&&typeof g=="function"&&(E=g,g=null),!E)return new Promise(v);v(null,E);function v(A,b){r.run(F,kr(g),d);function d(y,w,C){w=w||F,y?b(y):A?A(w):E(null,w,C)}}}function D(F,g){var E,v;return f(F,g,A),Xc("runSync","run",v),E;function A(b,d){v=!0,E=d,jc(b)}}function m(F,g){var E=kr(g),v;return a(),v=u.Compiler,Yn("stringify",v),Kc(F),Hc(v,"compile")?new v(F,E).compile():v(F,E)}function p(F,g){if(a(),Un("process",u.Parser),Yn("process",u.Compiler),!g)return new Promise(E);E(null,g);function E(v,A){var b=kr(F);Xm.run(u,{file:b},d);function d(y){y?A(y):v?v(b):g(null,b)}}}function h(F){var g,E;return a(),Un("processSync",u.Parser),Yn("processSync",u.Compiler),g=kr(F),p(g,v),Xc("processSync","process",E),g;function v(A){E=!0,jc(A)}}}function Hc(e,r){return typeof e=="function"&&e.prototype&&(eF(e.prototype)||r in e.prototype)}function eF(e){var r;for(r in e)return!0;return!1}function Un(e,r){if(typeof r!="function")throw new Error("Cannot `"+e+"` without `Parser`")}function Yn(e,r){if(typeof r!="function")throw new Error("Cannot `"+e+"` without `Compiler`")}function Gn(e,r){if(r)throw new Error("Cannot invoke `"+e+"` on a frozen processor.\nCreate a new processor first, by invoking it: use `processor()` instead of `processor`.")}function Kc(e){if(!e||typeof e.type!="string")throw new Error("Expected node, got `"+e+"`")}function Xc(e,r,t){if(!t)throw new Error("`"+e+"` finished async. Use `"+r+"` instead")}});var gl={};Vn(gl,{languages:()=>Ki,options:()=>Xi,parsers:()=>Wn,printers:()=>fF});var Me=(e,r)=>(t,n,...i)=>t|1&&n==null?void 0:(r.call(n)??n[e]).apply(n,i);function yl(e){return this[e<0?this.length+e:e]}var wl=Me("at",function(){if(Array.isArray(this)||typeof this=="string")return yl}),U=wl;var kl=String.prototype.replaceAll??function(e,r){return e.global?this.replace(e,r):this.split(e).join(r)},Tl=Me("replaceAll",function(){if(typeof this=="string")return kl}),R=Tl;var $i=Re(Tr(),1);function fe(e){if(typeof e!="string")throw new TypeError("Expected a string");return e.replace(/[|\\{}()[\]^$+*?.]/g,"\\$&").replace(/-/g,"\\x2d")}var _l=()=>{},tr=_l;var V="string",j="array",be="cursor",ee="indent",re="align",De="trim",X="group",J="fill",Q="if-break",pe="indent-if-break",he="line-suffix",de="line-suffix-boundary",$="line",me="label",te="break-parent",Br=new Set([be,ee,re,De,X,J,Q,pe,he,de,$,me,te]);function Ol(e){if(typeof e=="string")return V;if(Array.isArray(e))return j;if(!e)return;let{type:r}=e;if(Br.has(r))return r}var W=Ol;var ql=e=>new Intl.ListFormat("en-US",{type:"disjunction"}).format(e);function Nl(e){let r=e===null?"null":typeof e;if(r!=="string"&&r!=="object")return`Unexpected doc '${r}', 
Expected it to be 'string' or 'object'.`;if(W(e))throw new Error("doc is valid.");let t=Object.prototype.toString.call(e);if(t!=="[object Object]")return`Unexpected doc '${t}'.`;let n=ql([...Br].map(i=>`'${i}'`));return`Unexpected doc.type '${e.type}'.
Expected it to be ${n}.`}var markdown_gt=class extends Error{name="InvalidDocError";constructor(r){super(Nl(r)),this.doc=r}},Be=markdown_gt;var $n={};function Pl(e,r,t,n){let i=[e];for(;i.length>0;){let u=i.pop();if(u===$n){t(i.pop());continue}t&&i.push(u,$n);let a=W(u);if(!a)throw new Be(u);if(r?.(u)!==!1)switch(a){case j:case J:{let o=a===j?u:u.parts;for(let s=o.length,l=s-1;l>=0;--l)i.push(o[l]);break}case Q:i.push(u.flatContents,u.breakContents);break;case X:if(n&&u.expandedStates)for(let o=u.expandedStates.length,s=o-1;s>=0;--s)i.push(u.expandedStates[s]);else i.push(u.contents);break;case re:case ee:case pe:case me:case he:i.push(u.contents);break;case V:case be:case De:case de:case $:case te:break;default:throw new Be(u)}}}var Hn=Pl;function Il(e,r){if(typeof e=="string")return r(e);let t=new Map;return n(e);function n(u){if(t.has(u))return t.get(u);let a=i(u);return t.set(u,a),a}function i(u){switch(W(u)){case j:return r(u.map(n));case J:return r({...u,parts:u.parts.map(n)});case Q:return r({...u,breakContents:n(u.breakContents),flatContents:n(u.flatContents)});case X:{let{expandedStates:a,contents:o}=u;return a?(a=a.map(n),o=a[0]):o=n(o),r({...u,contents:o,expandedStates:a})}case re:case ee:case pe:case me:case he:return r({...u,contents:n(u.contents)});case V:case be:case De:case de:case $:case te:return r(u);default:throw new Be(u)}}}function Kn(e){if(e.length>0){let r=U(0,e,-1);!r.expandedStates&&!r.break&&(r.break="propagated")}return null}function Xn(e){let r=new Set,t=[];function n(u){if(u.type===te&&Kn(t),u.type===X){if(t.push(u),r.has(u))return!1;r.add(u)}}function i(u){u.type===X&&t.pop().break&&Kn(t)}Hn(e,n,i,!0)}function xe(e,r=nr){return Il(e,t=>typeof t=="string"?_r(r,t.split(`
`)):t)}var ne=tr,Or=tr,Jn=tr,Qn=tr;function ir(e){return ne(e),{type:ee,contents:e}}function Fe(e,r){return Qn(e),ne(r),{type:re,contents:r,n:e}}function ur(e){return Fe({type:"root"},e)}var Ue={type:te};function Ye(e){return Jn(e),{type:J,parts:e}}function Ge(e,r={}){return ne(e),Or(r.expandedStates,!0),{type:X,id:r.id,contents:e,break:!!r.shouldBreak,expandedStates:r.expandedStates}}function Zn(e,r="",t={}){return ne(e),r!==""&&ne(r),{type:Q,breakContents:e,flatContents:r,groupId:t.groupId}}function _r(e,r){ne(e),Or(r);let t=[];for(let n=0;n<r.length;n++)n!==0&&t.push(e),t.push(r[n]);return t}var qr={type:$},Nr={type:$,soft:!0},ar={type:$,hard:!0},M=[ar,Ue],Sl={type:$,hard:!0,literal:!0},nr=[Sl,Ue];var Ll="cr",Rl="crlf";var Ml="\r",Ul=`\r
`,Yl=`
`,Gl=Yl;function ei(e){return e===Ll?Ml:e===Rl?Ul:Gl}var ri=()=>/[#*0-9]\uFE0F?\u20E3|[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23ED-\u23EF\u23F1\u23F2\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB\u25FC\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692\u2694-\u2697\u2699\u269B\u269C\u26A0\u26A7\u26AA\u26B0\u26B1\u26BD\u26BE\u26C4\u26C8\u26CF\u26D1\u26E9\u26F0-\u26F5\u26F7\u26F8\u26FA\u2702\u2708\u2709\u270F\u2712\u2714\u2716\u271D\u2721\u2733\u2734\u2744\u2747\u2757\u2763\u27A1\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B55\u3030\u303D\u3297\u3299]\uFE0F?|[\u261D\u270C\u270D](?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?|[\u270A\u270B](?:\uD83C[\uDFFB-\uDFFF])?|[\u23E9-\u23EC\u23F0\u23F3\u25FD\u2693\u26A1\u26AB\u26C5\u26CE\u26D4\u26EA\u26FD\u2705\u2728\u274C\u274E\u2753-\u2755\u2795-\u2797\u27B0\u27BF\u2B50]|\u26D3\uFE0F?(?:\u200D\uD83D\uDCA5)?|\u26F9(?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?(?:\u200D[\u2640\u2642]\uFE0F?)?|\u2764\uFE0F?(?:\u200D(?:\uD83D\uDD25|\uD83E\uDE79))?|\uD83C(?:[\uDC04\uDD70\uDD71\uDD7E\uDD7F\uDE02\uDE37\uDF21\uDF24-\uDF2C\uDF36\uDF7D\uDF96\uDF97\uDF99-\uDF9B\uDF9E\uDF9F\uDFCD\uDFCE\uDFD4-\uDFDF\uDFF5\uDFF7]\uFE0F?|[\uDF85\uDFC2\uDFC7](?:\uD83C[\uDFFB-\uDFFF])?|[\uDFC4\uDFCA](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDFCB\uDFCC](?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDCCF\uDD8E\uDD91-\uDD9A\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF43\uDF45-\uDF4A\uDF4C-\uDF7C\uDF7E-\uDF84\uDF86-\uDF93\uDFA0-\uDFC1\uDFC5\uDFC6\uDFC8\uDFC9\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF8-\uDFFF]|\uDDE6\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF]|\uDDE7\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF]|\uDDE8\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF7\uDDFA-\uDDFF]|\uDDE9\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF]|\uDDEA\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA]|\uDDEB\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7]|\uDDEC\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE]|\uDDED\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA]|\uDDEE\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9]|\uDDEF\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5]|\uDDF0\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF]|\uDDF1\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE]|\uDDF2\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF]|\uDDF3\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF]|\uDDF4\uD83C\uDDF2|\uDDF5\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE]|\uDDF6\uD83C\uDDE6|\uDDF7\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC]|\uDDF8\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF]|\uDDF9\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF]|\uDDFA\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF]|\uDDFB\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA]|\uDDFC\uD83C[\uDDEB\uDDF8]|\uDDFD\uD83C\uDDF0|\uDDFE\uD83C[\uDDEA\uDDF9]|\uDDFF\uD83C[\uDDE6\uDDF2\uDDFC]|\uDF44(?:\u200D\uD83D\uDFEB)?|\uDF4B(?:\u200D\uD83D\uDFE9)?|\uDFC3(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?|\uDFF3\uFE0F?(?:\u200D(?:\u26A7\uFE0F?|\uD83C\uDF08))?|\uDFF4(?:\u200D\u2620\uFE0F?|\uDB40\uDC67\uDB40\uDC62\uDB40(?:\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDC73\uDB40\uDC63\uDB40\uDC74|\uDC77\uDB40\uDC6C\uDB40\uDC73)\uDB40\uDC7F)?)|\uD83D(?:[\uDC3F\uDCFD\uDD49\uDD4A\uDD6F\uDD70\uDD73\uDD76-\uDD79\uDD87\uDD8A-\uDD8D\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA\uDECB\uDECD-\uDECF\uDEE0-\uDEE5\uDEE9\uDEF0\uDEF3]\uFE0F?|[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDC8F\uDC91\uDCAA\uDD7A\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC](?:\uD83C[\uDFFB-\uDFFF])?|[\uDC6E-\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4\uDEB5](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDD74\uDD90](?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?|[\uDC00-\uDC07\uDC09-\uDC14\uDC16-\uDC25\uDC27-\uDC3A\uDC3C-\uDC3E\uDC40\uDC44\uDC45\uDC51-\uDC65\uDC6A\uDC79-\uDC7B\uDC7D-\uDC80\uDC84\uDC88-\uDC8E\uDC90\uDC92-\uDCA9\uDCAB-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDDA4\uDDFB-\uDE2D\uDE2F-\uDE34\uDE37-\uDE41\uDE43\uDE44\uDE48-\uDE4A\uDE80-\uDEA2\uDEA4-\uDEB3\uDEB7-\uDEBF\uDEC1-\uDEC5\uDED0-\uDED2\uDED5-\uDED8\uDEDC-\uDEDF\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB\uDFF0]|\uDC08(?:\u200D\u2B1B)?|\uDC15(?:\u200D\uD83E\uDDBA)?|\uDC26(?:\u200D(?:\u2B1B|\uD83D\uDD25))?|\uDC3B(?:\u200D\u2744\uFE0F?)?|\uDC41\uFE0F?(?:\u200D\uD83D\uDDE8\uFE0F?)?|\uDC68(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDC68\uDC69]\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC68\uD83C[\uDFFC-\uDFFF])|\uD83E(?:[\uDD1D\uDEEF]\u200D\uD83D\uDC68\uD83C[\uDFFC-\uDFFF]|[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83E(?:[\uDD1D\uDEEF]\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFD-\uDFFF]|[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83E(?:[\uDD1D\uDEEF]\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF]|[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83E(?:[\uDD1D\uDEEF]\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFD\uDFFF]|[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFE])|\uD83E(?:[\uDD1D\uDEEF]\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFE]|[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3])))?))?|\uDC69(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?[\uDC68\uDC69]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?|\uDC69\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?))|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC69\uD83C[\uDFFC-\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFC-\uDFFF]|\uDEEF\u200D\uD83D\uDC69\uD83C[\uDFFC-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC69\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB\uDFFD-\uDFFF]|\uDEEF\u200D\uD83D\uDC69\uD83C[\uDFFB\uDFFD-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC69\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF]|\uDEEF\u200D\uD83D\uDC69\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC69\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB-\uDFFD\uDFFF]|\uDEEF\u200D\uD83D\uDC69\uD83C[\uDFFB-\uDFFD\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC69\uD83C[\uDFFB-\uDFFE])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB-\uDFFE]|\uDEEF\u200D\uD83D\uDC69\uD83C[\uDFFB-\uDFFE])))?))?|\uDD75(?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?(?:\u200D[\u2640\u2642]\uFE0F?)?|\uDE2E(?:\u200D\uD83D\uDCA8)?|\uDE35(?:\u200D\uD83D\uDCAB)?|\uDE36(?:\u200D\uD83C\uDF2B\uFE0F?)?|\uDE42(?:\u200D[\u2194\u2195]\uFE0F?)?|\uDEB6(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?)|\uD83E(?:[\uDD0C\uDD0F\uDD18-\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2\uDDD3\uDDD5\uDEC3-\uDEC5\uDEF0\uDEF2-\uDEF8](?:\uD83C[\uDFFB-\uDFFF])?|[\uDD26\uDD35\uDD37-\uDD39\uDD3C-\uDD3E\uDDB8\uDDB9\uDDCD\uDDCF\uDDD4\uDDD6-\uDDDD](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDDDE\uDDDF](?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDD0D\uDD0E\uDD10-\uDD17\uDD20-\uDD25\uDD27-\uDD2F\uDD3A\uDD3F-\uDD45\uDD47-\uDD76\uDD78-\uDDB4\uDDB7\uDDBA\uDDBC-\uDDCC\uDDD0\uDDE0-\uDDFF\uDE70-\uDE7C\uDE80-\uDE8A\uDE8E-\uDEC2\uDEC6\uDEC8\uDECD-\uDEDC\uDEDF-\uDEEA\uDEEF]|\uDDCE(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?|\uDDD1(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3\uDE70]|\uDD1D\u200D\uD83E\uDDD1|\uDDD1\u200D\uD83E\uDDD2(?:\u200D\uD83E\uDDD2)?|\uDDD2(?:\u200D\uD83E\uDDD2)?))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFC-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83E\uDDD1\uD83C[\uDFFC-\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3\uDE70]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF]|\uDEEF\u200D\uD83E\uDDD1\uD83C[\uDFFC-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB\uDFFD-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83E\uDDD1\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3\uDE70]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF]|\uDEEF\u200D\uD83E\uDDD1\uD83C[\uDFFB\uDFFD-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83E\uDDD1\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3\uDE70]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF]|\uDEEF\u200D\uD83E\uDDD1\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB-\uDFFD\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3\uDE70]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF]|\uDEEF\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFD\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB-\uDFFE]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFE])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3\uDE70]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF]|\uDEEF\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFE])))?))?|\uDEF1(?:\uD83C(?:\uDFFB(?:\u200D\uD83E\uDEF2\uD83C[\uDFFC-\uDFFF])?|\uDFFC(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB\uDFFD-\uDFFF])?|\uDFFD(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])?|\uDFFE(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB-\uDFFD\uDFFF])?|\uDFFF(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB-\uDFFE])?))?)/g;function Et(e){return e===12288||e>=65281&&e<=65376||e>=65504&&e<=65510}function Ct(e){return e>=4352&&e<=4447||e===8986||e===8987||e===9001||e===9002||e>=9193&&e<=9196||e===9200||e===9203||e===9725||e===9726||e===9748||e===9749||e>=9776&&e<=9783||e>=9800&&e<=9811||e===9855||e>=9866&&e<=9871||e===9875||e===9889||e===9898||e===9899||e===9917||e===9918||e===9924||e===9925||e===9934||e===9940||e===9962||e===9970||e===9971||e===9973||e===9978||e===9981||e===9989||e===9994||e===9995||e===10024||e===10060||e===10062||e>=10067&&e<=10069||e===10071||e>=10133&&e<=10135||e===10160||e===10175||e===11035||e===11036||e===11088||e===11093||e>=11904&&e<=11929||e>=11931&&e<=12019||e>=12032&&e<=12245||e>=12272&&e<=12287||e>=12289&&e<=12350||e>=12353&&e<=12438||e>=12441&&e<=12543||e>=12549&&e<=12591||e>=12593&&e<=12686||e>=12688&&e<=12773||e>=12783&&e<=12830||e>=12832&&e<=12871||e>=12880&&e<=42124||e>=42128&&e<=42182||e>=43360&&e<=43388||e>=44032&&e<=55203||e>=63744&&e<=64255||e>=65040&&e<=65049||e>=65072&&e<=65106||e>=65108&&e<=65126||e>=65128&&e<=65131||e>=94176&&e<=94180||e>=94192&&e<=94198||e>=94208&&e<=101589||e>=101631&&e<=101662||e>=101760&&e<=101874||e>=110576&&e<=110579||e>=110581&&e<=110587||e===110589||e===110590||e>=110592&&e<=110882||e===110898||e>=110928&&e<=110930||e===110933||e>=110948&&e<=110951||e>=110960&&e<=111355||e>=119552&&e<=119638||e>=119648&&e<=119670||e===126980||e===127183||e===127374||e>=127377&&e<=127386||e>=127488&&e<=127490||e>=127504&&e<=127547||e>=127552&&e<=127560||e===127568||e===127569||e>=127584&&e<=127589||e>=127744&&e<=127776||e>=127789&&e<=127797||e>=127799&&e<=127868||e>=127870&&e<=127891||e>=127904&&e<=127946||e>=127951&&e<=127955||e>=127968&&e<=127984||e===127988||e>=127992&&e<=128062||e===128064||e>=128066&&e<=128252||e>=128255&&e<=128317||e>=128331&&e<=128334||e>=128336&&e<=128359||e===128378||e===128405||e===128406||e===128420||e>=128507&&e<=128591||e>=128640&&e<=128709||e===128716||e>=128720&&e<=128722||e>=128725&&e<=128728||e>=128732&&e<=128735||e===128747||e===128748||e>=128756&&e<=128764||e>=128992&&e<=129003||e===129008||e>=129292&&e<=129338||e>=129340&&e<=129349||e>=129351&&e<=129535||e>=129648&&e<=129660||e>=129664&&e<=129674||e>=129678&&e<=129734||e===129736||e>=129741&&e<=129756||e>=129759&&e<=129770||e>=129775&&e<=129784||e>=131072&&e<=196605||e>=196608&&e<=262141}var ti="\xA9\xAE\u203C\u2049\u2122\u2139\u2194\u2195\u2196\u2197\u2198\u2199\u21A9\u21AA\u2328\u23CF\u23F1\u23F2\u23F8\u23F9\u23FA\u25AA\u25AB\u25B6\u25C0\u25FB\u25FC\u2600\u2601\u2602\u2603\u2604\u260E\u2611\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638\u2639\u263A\u2640\u2642\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u2692\u2694\u2695\u2696\u2697\u2699\u269B\u269C\u26A0\u26A7\u26B0\u26B1\u26C8\u26CF\u26D1\u26D3\u26E9\u26F1\u26F7\u26F8\u26F9\u2702\u2708\u2709\u270C\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2733\u2734\u2744\u2747\u2763\u2764\u27A1\u2934\u2935\u2B05\u2B06\u2B07";var zl=/[^\x20-\x7F]/u,Wl=new Set(ti);function Vl(e){if(!e)return 0;if(!zl.test(e))return e.length;e=e.replace(ri(),t=>Wl.has(t)?" ":"  ");let r=0;for(let t of e){let n=t.codePointAt(0);n<=31||n>=127&&n<=159||n>=768&&n<=879||n>=65024&&n<=65039||(r+=Et(n)||Ct(n)?2:1)}return r}var or=Vl;var jl={type:0},$l={type:1},vt={value:"",length:0,queue:[],get root(){return vt}};function ni(e,r,t){let n=r.type===1?e.queue.slice(0,-1):[...e.queue,r],i="",u=0,a=0,o=0;for(let p of n)switch(p.type){case 0:c(),t.useTabs?s(1):l(t.tabWidth);break;case 3:{let{string:h}=p;c(),i+=h,u+=h.length;break}case 2:{let{width:h}=p;a+=1,o+=h;break}default:throw new Error(`Unexpected indent comment '${p.type}'.`)}return D(),{...e,value:i,length:u,queue:n};function s(p){i+="	".repeat(p),u+=t.tabWidth*p}function l(p){i+=" ".repeat(p),u+=p}function c(){t.useTabs?f():D()}function f(){a>0&&s(a),m()}function D(){o>0&&l(o),m()}function m(){a=0,o=0}}function ii(e,r,t){if(!r)return e;if(r.type==="root")return{...e,root:e};if(r===Number.NEGATIVE_INFINITY)return e.root;let n;return typeof r=="number"?r<0?n=$l:n={type:2,width:r}:n={type:3,string:r},ni(e,n,t)}function ui(e,r){return ni(e,jl,r)}function Hl(e){let r=0;for(let t=e.length-1;t>=0;t--){let n=e[t];if(n===" "||n==="	")r++;else break}return r}function At(e){let r=Hl(e);return{text:r===0?e:e.slice(0,e.length-r),count:r}}var H=Symbol("MODE_BREAK"),ue=Symbol("MODE_FLAT"),bt=Symbol("DOC_FILL_PRINTED_LENGTH");function Pr(e,r,t,n,i,u){if(t===Number.POSITIVE_INFINITY)return!0;let a=r.length,o=!1,s=[e],l="";for(;t>=0;){if(s.length===0){if(a===0)return!0;s.push(r[--a]);continue}let{mode:c,doc:f}=s.pop(),D=W(f);switch(D){case V:f&&(o&&(l+=" ",t-=1,o=!1),l+=f,t-=or(f));break;case j:case J:{let m=D===j?f:f.parts,p=f[bt]??0;for(let h=m.length-1;h>=p;h--)s.push({mode:c,doc:m[h]});break}case ee:case re:case pe:case me:s.push({mode:c,doc:f.contents});break;case De:{let{text:m,count:p}=At(l);l=m,t+=p;break}case X:{if(u&&f.break)return!1;let m=f.break?H:c,p=f.expandedStates&&m===H?U(0,f.expandedStates,-1):f.contents;s.push({mode:m,doc:p});break}case Q:{let p=(f.groupId?i[f.groupId]||ue:c)===H?f.breakContents:f.flatContents;p&&s.push({mode:c,doc:p});break}case $:if(c===H||f.hard)return!0;f.soft||(o=!0);break;case he:n=!0;break;case de:if(n)return!1;break}}return!1}function ai(e,r){let t=Object.create(null),n=r.printWidth,i=ei(r.endOfLine),u=0,a=[{indent:vt,mode:H,doc:e}],o="",s=!1,l=[],c=[],f=[],D=[],m=0;for(Xn(e);a.length>0;){let{indent:E,mode:v,doc:A}=a.pop();switch(W(A)){case V:{let b=i!==`
`?R(0,A,`
`,i):A;b&&(o+=b,a.length>0&&(u+=or(b)));break}case j:for(let b=A.length-1;b>=0;b--)a.push({indent:E,mode:v,doc:A[b]});break;case be:if(c.length>=2)throw new Error("There are too many 'cursor' in doc.");c.push(m+o.length);break;case ee:a.push({indent:ui(E,r),mode:v,doc:A.contents});break;case re:a.push({indent:ii(E,A.n,r),mode:v,doc:A.contents});break;case De:g();break;case X:switch(v){case ue:if(!s){a.push({indent:E,mode:A.break?H:ue,doc:A.contents});break}case H:{s=!1;let b={indent:E,mode:ue,doc:A.contents},d=n-u,y=l.length>0;if(!A.break&&Pr(b,a,d,y,t))a.push(b);else if(A.expandedStates){let w=U(0,A.expandedStates,-1);if(A.break){a.push({indent:E,mode:H,doc:w});break}else for(let C=1;C<A.expandedStates.length+1;C++)if(C>=A.expandedStates.length){a.push({indent:E,mode:H,doc:w});break}else{let k=A.expandedStates[C],T={indent:E,mode:ue,doc:k};if(Pr(T,a,d,y,t)){a.push(T);break}}}else a.push({indent:E,mode:H,doc:A.contents});break}}A.id&&(t[A.id]=U(0,a,-1).mode);break;case J:{let b=n-u,d=A[bt]??0,{parts:y}=A,w=y.length-d;if(w===0)break;let C=y[d+0],k=y[d+1],T={indent:E,mode:ue,doc:C},B={indent:E,mode:H,doc:C},_=Pr(T,[],b,l.length>0,t,!0);if(w===1){_?a.push(T):a.push(B);break}let S={indent:E,mode:ue,doc:k},P={indent:E,mode:H,doc:k};if(w===2){_?a.push(S,T):a.push(P,B);break}let N=y[d+2],O={indent:E,mode:v,doc:{...A,[bt]:d+2}},le=Pr({indent:E,mode:ue,doc:[C,k,N]},[],b,l.length>0,t,!0);a.push(O),le?a.push(S,T):_?a.push(P,T):a.push(P,B);break}case Q:case pe:{let b=A.groupId?t[A.groupId]:v;if(b===H){let d=A.type===Q?A.breakContents:A.negate?A.contents:ir(A.contents);d&&a.push({indent:E,mode:v,doc:d})}if(b===ue){let d=A.type===Q?A.flatContents:A.negate?ir(A.contents):A.contents;d&&a.push({indent:E,mode:v,doc:d})}break}case he:l.push({indent:E,mode:v,doc:A.contents});break;case de:l.length>0&&a.push({indent:E,mode:v,doc:ar});break;case $:switch(v){case ue:if(A.hard)s=!0;else{A.soft||(o+=" ",u+=1);break}case H:if(l.length>0){a.push({indent:E,mode:v,doc:A},...l.reverse()),l.length=0;break}A.literal?(o+=i,u=0,E.root&&(E.root.value&&(o+=E.root.value),u=E.root.length)):(g(),o+=i+E.value,u=E.length);break}break;case me:a.push({indent:E,mode:v,doc:A.contents});break;case te:break;default:throw new Be(A)}a.length===0&&l.length>0&&(a.push(...l.reverse()),l.length=0)}let p=f.join("")+o,h=[...D,...c];if(h.length!==2)return{formatted:p};let F=h[0];return{formatted:p,cursorNodeStart:F,cursorNodeText:p.slice(F,U(0,h,-1))};function g(){let{text:E,count:v}=At(o);E&&(f.push(E),m+=E.length),o="",u-=v,c.length>0&&(D.push(...c.map(A=>Math.min(A,m))),c.length=0)}}function Kl(e,r){let t=e.matchAll(new RegExp(`(?:${fe(r)})+`,"gu"));return t.reduce||(t=[...t]),t.reduce((n,[i])=>Math.max(n,i.length),0)/r.length}var Ir=Kl;function Xl(e,r){let t=e.match(new RegExp(`(${fe(r)})+`,"gu"));if(t===null)return 1;let n=new Map,i=0;for(let u of t){let a=u.length/r.length;n.set(a,!0),a>i&&(i=a)}for(let u=1;u<i;u++)if(!n.get(u))return u;return i+1}var oi=Xl;var si=Object.freeze({character:"'",codePoint:39}),ci=Object.freeze({character:'"',codePoint:34}),Jl=Object.freeze({preferred:si,alternate:ci}),Ql=Object.freeze({preferred:ci,alternate:si});function Zl(e,r){let{preferred:t,alternate:n}=r===!0||r==="'"?Jl:Ql,{length:i}=e,u=0,a=0;for(let o=0;o<i;o++){let s=e.charCodeAt(o);s===t.codePoint?u++:s===n.codePoint&&a++}return(u>a?n:t).character}var li=Zl;var xt=class extends Error{name="UnexpectedNodeError";constructor(r,t,n="type"){super(`Unexpected ${t} node ${n}: ${JSON.stringify(r[n])}.`),this.node=r}},fi=xt;var bi=Re(Tr(),1);var ef=Array.prototype.toReversed??function(){return[...this].reverse()},rf=Me("toReversed",function(){if(Array.isArray(this))return ef}),Di=rf;function tf(){let e=globalThis,r=e.Deno?.build?.os;return typeof r=="string"?r==="windows":e.navigator?.platform?.startsWith("Win")??e.process?.platform?.startsWith("win")??!1}var nf=tf();function pi(e){if(e=e instanceof URL?e:new URL(e),e.protocol!=="file:")throw new TypeError(`URL must be a file URL: received "${e.protocol}"`);return e}function uf(e){return e=pi(e),decodeURIComponent(e.pathname.replace(/%(?![0-9A-Fa-f]{2})/g,"%25"))}function af(e){e=pi(e);let r=decodeURIComponent(e.pathname.replace(/\//g,"\\").replace(/%(?![0-9A-Fa-f]{2})/g,"%25")).replace(/^\\*([A-Za-z]:)(\\|$)/,"$1\\");return e.hostname!==""&&(r=`\\\\${e.hostname}${r}`),r}function yt(e){return nf?af(e):uf(e)}var hi=e=>String(e).split(/[/\\]/u).pop(),di=e=>String(e).startsWith("file:");function mi(e,r){if(!r)return;let t=hi(r).toLowerCase();return e.find(({filenames:n})=>n?.some(i=>i.toLowerCase()===t))??e.find(({extensions:n})=>n?.some(i=>t.endsWith(i)))}function of(e,r){if(r)return e.find(({name:t})=>t.toLowerCase()===r)??e.find(({aliases:t})=>t?.includes(r))??e.find(({extensions:t})=>t?.includes(`.${r}`))}var sf=void 0;function Fi(e,r){if(r){if(di(r))try{r=yt(r)}catch{return}if(typeof r=="string")return e.find(({isSupported:t})=>t?.({filepath:r}))}}function cf(e,r){let t=Di(0,e.plugins).flatMap(i=>i.languages??[]);return(of(t,r.language)??mi(t,r.physicalFile)??mi(t,r.file)??Fi(t,r.physicalFile)??Fi(t,r.file)??sf?.(t,r.physicalFile))?.parsers[0]}var wt=cf;var Sr=Symbol.for("PRETTIER_IS_FRONT_MATTER");function lf(e){return!!e?.[Sr]}var kt=lf;var sr=3;function ff(e){let r=e.slice(0,sr);if(r!=="---"&&r!=="+++")return;let t=e.indexOf(`
`,sr);if(t===-1)return;let n=e.slice(sr,t).trim(),i=e.indexOf(`
${r}`,t),u=n;if(u||(u=r==="+++"?"toml":"yaml"),i===-1&&r==="---"&&u==="yaml"&&(i=e.indexOf(`
...`,t)),i===-1)return;let a=i+1+sr,o=e.charAt(a+1);if(!/\s?/u.test(o))return;let s=e.slice(0,a),l;return{language:u,explicitLanguage:n||null,value:e.slice(t+1,i),startDelimiter:r,endDelimiter:s.slice(-sr),raw:s,start:{line:1,column:0,index:0},end:{index:s.length,get line(){return l??(l=s.split(`
`)),l.length},get column(){return l??(l=s.split(`
`)),U(0,l,-1).length}},[Sr]:!0}}function Df(e){let r=ff(e);return r?{frontMatter:r,get content(){let{raw:t}=r;return R(0,t,/[^\n]/gu," ")+e.slice(t.length)}}:{content:e}}var _e=Df;var gi="format";var Ei=/<!--\s*@(?:noformat|noprettier)\s*-->|\{\s*\/\*\s*@(?:noformat|noprettier)\s*\*\/\s*\}|<!--.*\r?\n[\s\S]*(^|\n)[^\S\n]*@(?:noformat|noprettier)[^\S\n]*($|\n)[\s\S]*\n.*-->/mu,Ci=/<!--\s*@(?:format|prettier)\s*-->|\{\s*\/\*\s*@(?:format|prettier)\s*\*\/\s*\}|<!--.*\r?\n[\s\S]*(^|\n)[^\S\n]*@(?:format|prettier)[^\S\n]*($|\n)[\s\S]*\n.*-->/mu;var Lr=e=>_e(e).content.trimStart().match(Ci)?.index===0,vi=e=>_e(e).content.trimStart().match(Ei)?.index===0,Ai=e=>{let{frontMatter:r}=_e(e),t=`<!-- @${gi} -->`;return r?`${r.raw}

${t}

${e.slice(r.end.index)}`:`${t}

${e}`};var pf=new Set(["position","raw"]);function xi(e,r,t){if((e.type==="code"||e.type==="yaml"||e.type==="import"||e.type==="export"||e.type==="jsx")&&delete r.value,e.type==="list"&&delete r.isAligned,(e.type==="list"||e.type==="listItem")&&delete r.spread,e.type==="text")return null;if(e.type==="inlineCode"&&(r.value=R(0,e.value,`
`," ")),e.type==="wikiLink"&&(r.value=R(0,e.value.trim(),/[\t\n]+/gu," ")),(e.type==="definition"||e.type==="linkReference"||e.type==="imageReference")&&(r.label=(0,bi.default)(e.label)),(e.type==="link"||e.type==="image")&&e.url&&e.url.includes("("))for(let n of"<>")r.url=R(0,e.url,n,encodeURIComponent(n));if((e.type==="definition"||e.type==="link"||e.type==="image")&&e.title&&(r.title=R(0,e.title,/\\(?=["')])/gu,"")),t?.type==="root"&&t.children.length>0&&(t.children[0]===e||kt(t.children[0])&&t.children[1]===e)&&e.type==="html"&&Lr(e.value))return null}xi.ignoredProperties=pf;var yi=xi;var wi=/(?:[\u{2c7}\u{2c9}-\u{2cb}\u{2d9}\u{2ea}-\u{2eb}\u{305}\u{323}\u{1100}-\u{11ff}\u{2e80}-\u{2e99}\u{2e9b}-\u{2ef3}\u{2f00}-\u{2fd5}\u{2ff0}-\u{303f}\u{3041}-\u{3096}\u{3099}-\u{30ff}\u{3105}-\u{312f}\u{3131}-\u{318e}\u{3190}-\u{4dbf}\u{4e00}-\u{9fff}\u{a700}-\u{a707}\u{a960}-\u{a97c}\u{ac00}-\u{d7a3}\u{d7b0}-\u{d7c6}\u{d7cb}-\u{d7fb}\u{f900}-\u{fa6d}\u{fa70}-\u{fad9}\u{fe10}-\u{fe1f}\u{fe30}-\u{fe6f}\u{ff00}-\u{ffef}\u{16fe3}\u{16ff2}-\u{16ff6}\u{1aff0}-\u{1aff3}\u{1aff5}-\u{1affb}\u{1affd}-\u{1affe}\u{1b000}-\u{1b122}\u{1b132}\u{1b150}-\u{1b152}\u{1b155}\u{1b164}-\u{1b167}\u{1f200}\u{1f250}-\u{1f251}\u{20000}-\u{2a6df}\u{2a700}-\u{2b81d}\u{2b820}-\u{2cead}\u{2ceb0}-\u{2ebe0}\u{2ebf0}-\u{2ee5d}\u{2f800}-\u{2fa1d}\u{30000}-\u{3134a}\u{31350}-\u{33479}])(?:[\u{fe00}-\u{fe0f}\u{e0100}-\u{e01ef}])?/u,Oe=/(?:[\u{21}-\u{2f}\u{3a}-\u{40}\u{5b}-\u{60}\u{7b}-\u{7e}]|\p{General_Category=Connector_Punctuation}|\p{General_Category=Dash_Punctuation}|\p{General_Category=Close_Punctuation}|\p{General_Category=Final_Punctuation}|\p{General_Category=Initial_Punctuation}|\p{General_Category=Other_Punctuation}|\p{General_Category=Open_Punctuation})/u;var qe=e=>e.position.start.offset,Ne=e=>e.position.end.offset;var Tt=new Set(["liquidNode","inlineCode","emphasis","esComment","strong","delete","wikiLink","link","linkReference","image","imageReference","footnote","footnoteReference","sentence","whitespace","word","break","inlineMath"]),Rr=new Set([...Tt,"tableCell","paragraph","heading"]),We="non-cjk",ae="cj-letter",Pe="k-letter",cr="cjk-punctuation",hf=/\p{Script_Extensions=Hangul}/u;function Mr(e){let r=[],t=e.split(/([\t\n ]+)/u);for(let[i,u]of t.entries()){if(i%2===1){r.push({type:"whitespace",value:/\n/u.test(u)?`
`:" "});continue}if((i===0||i===t.length-1)&&u==="")continue;let a=u.split(new RegExp(`(${wi.source})`,"u"));for(let[o,s]of a.entries())if(!((o===0||o===a.length-1)&&s==="")){if(o%2===0){s!==""&&n({type:"word",value:s,kind:We,isCJ:!1,hasLeadingPunctuation:Oe.test(s[0]),hasTrailingPunctuation:Oe.test(U(0,s,-1))});continue}if(Oe.test(s)){n({type:"word",value:s,kind:cr,isCJ:!0,hasLeadingPunctuation:!0,hasTrailingPunctuation:!0});continue}if(hf.test(s)){n({type:"word",value:s,kind:Pe,isCJ:!1,hasLeadingPunctuation:!1,hasTrailingPunctuation:!1});continue}n({type:"word",value:s,kind:ae,isCJ:!0,hasLeadingPunctuation:!1,hasTrailingPunctuation:!1})}}return r;function n(i){let u=U(0,r,-1);u?.type==="word"&&!a(We,cr)&&![u.value,i.value].some(o=>/\u3000/u.test(o))&&r.push({type:"whitespace",value:""}),r.push(i);function a(o,s){return u.kind===o&&i.kind===s||u.kind===s&&i.kind===o}}}function ze(e,r){let t=r.originalText.slice(e.position.start.offset,e.position.end.offset),{numberText:n,leadingSpaces:i}=t.match(/^\s*(?<numberText>\d+)(\.|\))(?<leadingSpaces>\s*)/u).groups;return{number:Number(n),leadingSpaces:i}}function ki(e,r){return!e.ordered||e.children.length<2||ze(e.children[1],r).number!==1?!1:ze(e.children[0],r).number!==0?!0:e.children.length>2&&ze(e.children[2],r).number===1}function Ur(e,r){let{value:t}=e;return e.position.end.offset===r.length&&t.endsWith(`
`)&&r.endsWith(`
`)?t.slice(0,-1):t}function ye(e,r){return(function t(n,i,u){let a={...r(n,i,u)};return a.children&&(a.children=a.children.map((o,s)=>t(o,s,[a,...u]))),a})(e,null,[])}function Yr(e){if(e?.type!=="link"||e.children.length!==1)return!1;let[r]=e.children;return qe(e)===qe(r)&&Ne(e)===Ne(r)}function lr(e){let r;if(e.type==="html")r=e.value.match(/^<!--\s*prettier-ignore(?:-(start|end))?\s*-->$/u);else{let t;e.type==="esComment"?t=e:e.type==="paragraph"&&e.children.length===1&&e.children[0].type==="esComment"&&(t=e.children[0]),t&&(r=t.value.match(/^prettier-ignore(?:-(start|end))?$/u))}return r?r[1]||"next":!1}function Gr(e,r){return t(e,r,n=>n.ordered===e.ordered);function t(n,i,u){let a=-1;for(let o of i.children)if(o.type===n.type&&u(o)?a++:a=-1,o===n)return a}}function df(e,r){let{node:t}=e;switch(t.type){case"code":{let{lang:n}=t;if(!n)return;let i;return n==="angular-ts"?i=wt(r,{language:"typescript"}):n==="angular-html"?i="angular":i=wt(r,{language:n}),i?async u=>{let a={parser:i};n==="ts"||n==="typescript"?a.filepath="dummy.ts":n==="tsx"&&(a.filepath="dummy.tsx");let o=await u(Ur(t,r.originalText),a),s=r.__inJsTemplate?"~":"`",l=s.repeat(Math.max(3,Ir(t.value,s)+1));return ur([l,t.lang,t.meta?" "+t.meta:"",M,xe(o),M,l])}:void 0}case"import":case"export":return n=>n(t.value,{__onHtmlBindingRoot:i=>mf(i,t.type),parser:"babel"});case"jsx":return n=>n(`<$>${t.value}</$>`,{parser:"__js_expression",rootMarker:"mdx"})}return null}function mf(e,r){let{program:{body:t}}=e;if(!t.every(n=>n.type==="ImportDeclaration"||n.type==="ExportDefaultDeclaration"||n.type==="ExportNamedDeclaration"))throw new Error(`Unexpected '${r}' in MDX.`)}var Ti=df;var fr=null;function Dr(e){if(fr!==null&&typeof fr.property){let r=fr;return fr=Dr.prototype=null,r}return fr=Dr.prototype=e??Object.create(null),new Dr}var Ff=10;for(let e=0;e<=Ff;e++)Dr();function Bt(e){return Dr(e)}function gf(e,r="type"){Bt(e);function t(n){let i=n[r],u=e[i];if(!Array.isArray(u))throw Object.assign(new Error(`Missing visitor keys for '${i}'.`),{node:n});return u}return t}var Bi=gf;var q=[["children"],[]],_i={root:q[0],paragraph:q[0],sentence:q[0],word:q[1],whitespace:q[1],emphasis:q[0],strong:q[0],delete:q[0],inlineCode:q[1],wikiLink:q[1],link:q[0],image:q[1],blockquote:q[0],heading:q[0],code:q[1],html:q[1],list:q[0],thematicBreak:q[1],linkReference:q[0],imageReference:q[1],definition:q[1],footnote:q[0],footnoteReference:q[1],footnoteDefinition:q[0],table:q[0],tableCell:q[0],break:q[1],liquidNode:q[1],import:q[1],export:q[1],esComment:q[1],jsx:q[1],math:q[1],inlineMath:q[1],tableRow:q[0],listItem:q[0],text:q[1]};var Ef=Bi(_i),Oi=Ef;function z(e,r,t,n={}){let{processor:i=t}=n,u=[];return e.each(()=>{let a=i(e);a!==!1&&(u.length>0&&Cf(e)&&(u.push(M),(Af(e,r)||qi(e))&&u.push(M),qi(e)&&u.push(M)),u.push(a))},"children"),u}function Cf({node:e,parent:r}){let t=Tt.has(e.type),n=e.type==="html"&&Rr.has(r.type);return!t&&!n}var vf=new Set(["listItem","definition"]);function Af({node:e,previous:r,parent:t},n){if(Ni(r,n)||e.type==="list"&&t.type==="listItem"&&r.type==="code")return!0;let u=r.type===e.type&&vf.has(e.type),a=t.type==="listItem"&&(e.type==="list"||!Ni(t,n)),o=lr(r)==="next",s=e.type==="html"&&r.type==="html"&&r.position.end.line+1===e.position.start.line,l=e.type==="html"&&t.type==="listItem"&&r.type==="paragraph"&&r.position.end.line+1===e.position.start.line;return!(u||a||o||s||l)}function qi({node:e,previous:r}){let t=r.type==="list",n=e.type==="code"&&e.isIndented;return t&&n}function Ni(e,r){return e.type==="listItem"&&(e.spread||r.originalText.charAt(e.position.end.offset-1)===`
`)}function Ii(e,r,t){let{node:n}=e,i=Gr(n,e.parent),u=ki(n,r);return z(e,r,t,{processor(){let a=s(),{node:o}=e;if(o.children.length===2&&o.children[1].type==="html"&&o.children[0].position.start.column!==o.children[1].position.start.column)return[a,Pi(e,r,t,a)];return[a,Fe(" ".repeat(a.length),Pi(e,r,t,a))];function s(){let l=n.ordered?(e.isFirst?n.start:u?1:n.start+e.index)+(i%2===0?". ":") "):i%2===0?"- ":"* ";return(n.isAligned||n.hasIndentedCodeblock)&&n.ordered?bf(l,r):l}}})}function Pi(e,r,t,n){let{node:i}=e,u=i.checked===null?"":i.checked?"[x] ":"[ ] ";return[u,z(e,r,t,{processor({node:a,isFirst:o}){if(o&&a.type!=="list")return Fe(" ".repeat(u.length),t());let s=" ".repeat(xf(r.tabWidth-n.length,0,3));return[s,Fe(s,t())]}})]}function bf(e,r){let t=n();return e+" ".repeat(t>=4?0:t);function n(){let i=e.length%r.tabWidth;return i===0?0:r.tabWidth-i}}function xf(e,r,t){return Math.max(r,Math.min(e,t))}function Si(e,r,t){let{node:n}=e,i=[],u=e.map(()=>e.map(({index:f})=>{let D=ai(t(),r).formatted,m=or(D);return i[f]=Math.max(i[f]??3,m),{text:D,width:m}},"children"),"children"),a=s(!1);if(r.proseWrap!=="never")return[Ue,a];let o=s(!0);return[Ue,Ge(Zn(o,a))];function s(f){return _r(ar,[c(u[0],f),l(f),...u.slice(1).map(D=>c(D,f))].map(D=>`| ${D.join(" | ")} |`))}function l(f){return i.map((D,m)=>{let p=n.align[m],h=p==="center"||p==="left"?":":"-",F=p==="center"||p==="right"?":":"-",g=f?"-":"-".repeat(D-2);return`${h}${g}${F}`})}function c(f,D){return f.map(({text:m,width:p},h)=>{if(D)return m;let F=i[h]-p,g=n.align[h],E=0;g==="right"?E=F:g==="center"&&(E=Math.floor(F/2));let v=F-E;return`${" ".repeat(E)}${m}${" ".repeat(v)}`})}}function Li(e){let{node:r}=e,t=R(0,R(0,r.value,"*","\\*"),new RegExp([`(^|${Oe.source})(_+)`,`(_+)(${Oe.source}|$)`].join("|"),"gu"),(u,a,o,s,l)=>R(0,o?`${a}${o}`:`${s}${l}`,"_","\\_")),n=(u,a,o)=>u.type==="sentence"&&o===0,i=(u,a,o)=>Yr(u.children[o-1]);return t!==r.value&&(e.match(void 0,n,i)||e.match(void 0,n,(u,a,o)=>u.type==="emphasis"&&o===0,i))&&(t=t.replace(/^(\\?[*_])+/u,u=>R(0,u,"\\",""))),t}function Ri(e,r,t){let n=e.map(t,"children");return yf(n)}function yf(e){let r=[""];return(function t(n){for(let i of n){let u=W(i);if(u===j){t(i);continue}let a=i,o=[];u===J&&([a,...o]=i.parts),r.push([r.pop(),a],...o)}})(e),Ye(r)}var _t=class{#e;constructor(r){this.#e=new Set(r)}getLeadingWhitespaceCount(r){let t=this.#e,n=0;for(let i=0;i<r.length&&t.has(r.charAt(i));i++)n++;return n}getTrailingWhitespaceCount(r){let t=this.#e,n=0;for(let i=r.length-1;i>=0&&t.has(r.charAt(i));i--)n++;return n}getLeadingWhitespace(r){let t=this.getLeadingWhitespaceCount(r);return r.slice(0,t)}getTrailingWhitespace(r){let t=this.getTrailingWhitespaceCount(r);return r.slice(r.length-t)}hasLeadingWhitespace(r){return this.#e.has(r.charAt(0))}hasTrailingWhitespace(r){return this.#e.has(U(0,r,-1))}trimStart(r){let t=this.getLeadingWhitespaceCount(r);return r.slice(t)}trimEnd(r){let t=this.getTrailingWhitespaceCount(r);return r.slice(0,r.length-t)}trim(r){return this.trimEnd(this.trimStart(r))}split(r,t=!1){let n=`[${fe([...this.#e].join(""))}]+`,i=new RegExp(t?`(${n})`:n,"u");return r.split(i)}hasWhitespaceCharacter(r){let t=this.#e;return Array.prototype.some.call(r,n=>t.has(n))}hasNonWhitespaceCharacter(r){let t=this.#e;return Array.prototype.some.call(r,n=>!t.has(n))}isWhitespaceOnly(r){let t=this.#e;return Array.prototype.every.call(r,n=>t.has(n))}#r(r){let t=Number.POSITIVE_INFINITY;for(let n of r.split(`
`)){if(n.length===0)continue;let i=this.getLeadingWhitespaceCount(n);if(i===0)return 0;n.length!==i&&i<t&&(t=i)}return t===Number.POSITIVE_INFINITY?0:t}dedentString(r){let t=this.#r(r);return t===0?r:r.split(`
`).map(n=>n.slice(t)).join(`
`)}},Mi=_t;var wf=["	",`
`,"\f","\r"," "],kf=new Mi(wf),Ot=kf;var Tf=/^\\?.$/su,Bf=/^\n *>[ >]*$/u;function _f(e,r){return e=Of(e,r),e=Nf(e),e=If(e,r),e=Sf(e,r),e=Pf(e),e}function Of(e,r){return ye(e,t=>{if(t.type!=="text")return t;let{value:n}=t;if(n==="*"||n==="_"||!Tf.test(n)||t.position.end.offset-t.position.start.offset===n.length)return t;let i=r.originalText.slice(t.position.start.offset,t.position.end.offset);return Bf.test(i)?t:{...t,value:i}})}function qf(e,r,t){return ye(e,n=>{if(!n.children)return n;let i=[],u,a;for(let o of n.children)u&&r(u,o)?(o=t(u,o),i.splice(-1,1,o),a||(a=!0)):i.push(o),u=o;return a?{...n,children:i}:n})}function Nf(e){return qf(e,(r,t)=>r.type==="text"&&t.type==="text",(r,t)=>({type:"text",value:r.value+t.value,position:{start:r.position.start,end:t.position.end}}))}function Pf(e){return ye(e,(r,t,[n])=>{if(r.type!=="text")return r;let{value:i}=r;return n.type==="paragraph"&&(t===0&&(i=Ot.trimStart(i)),t===n.children.length-1&&(i=Ot.trimEnd(i))),{type:"sentence",position:r.position,children:Mr(i)}})}function If(e,r){return ye(e,(t,n,i)=>{if(t.type==="code"){let u=/^\n?(?: {4,}|\t)/u.test(r.originalText.slice(t.position.start.offset,t.position.end.offset));if(t.isIndented=u,u)for(let a=0;a<i.length;a++){let o=i[a];if(o.hasIndentedCodeblock)break;o.type==="list"&&(o.hasIndentedCodeblock=!0)}}return t})}function Sf(e,r){return ye(e,(i,u,a)=>{if(i.type==="list"&&i.children.length>0){for(let o=0;o<a.length;o++){let s=a[o];if(s.type==="list"&&!s.isAligned)return i.isAligned=!1,i}i.isAligned=n(i)}return i});function t(i){return i.children.length===0?-1:i.children[0].position.start.column-1}function n(i){if(!i.ordered)return!0;let[u,a]=i.children;if(ze(u,r).leadingSpaces.length>1)return!0;let s=t(u);if(s===-1)return!1;if(i.children.length===1)return s%r.tabWidth===0;let l=t(a);return s!==l?!1:s%r.tabWidth===0?!0:ze(a,r).leadingSpaces.length>1}}var Ui=_f;function Yi(e,r){let t=[""];return e.each(()=>{let{node:n}=e,i=r();switch(n.type){case"whitespace":if(W(i)!==V){t.push(i,"");break}default:t.push([t.pop(),i])}},"children"),Ye(t)}var Lf=new Set(["heading","tableCell","link","wikiLink"]),Gi=new Set("!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~");function Rf({parent:e}){if(e.usesCJSpaces===void 0){let r={" ":0,"":0},{children:t}=e;for(let n=1;n<t.length-1;++n){let i=t[n];if(i.type==="whitespace"&&(i.value===" "||i.value==="")){let u=t[n-1].kind,a=t[n+1].kind;(u===ae&&a===We||u===We&&a===ae)&&++r[i.value]}}e.usesCJSpaces=r[" "]>r[""]}return e.usesCJSpaces}function Mf(e,r){if(r)return!0;let{previous:t,next:n}=e;if(!t||!n)return!0;let i=t.kind,u=n.kind;return zi(i)&&zi(u)||i===Pe&&u===ae||u===Pe&&i===ae?!0:i===cr||u===cr||i===ae&&u===ae?!1:Gi.has(n.value[0])||Gi.has(U(0,t.value,-1))?!0:t.hasTrailingPunctuation||n.hasLeadingPunctuation?!1:Rf(e)}function zi(e){return e===We||e===Pe}function Uf(e,r,t,n){if(t!=="always"||e.hasAncestor(a=>Lf.has(a.type)))return!1;if(n)return r!=="";let{previous:i,next:u}=e;return!i||!u?!0:r===""?!1:i.kind===Pe&&u.kind===ae||u.kind===Pe&&i.kind===ae?!0:!(i.isCJ||u.isCJ)}function qt(e,r,t,n){if(t==="preserve"&&r===`
`)return M;let i=r===" "||r===`
`&&Mf(e,n);return Uf(e,r,t,n)?i?qr:Nr:i?" ":""}function Wi(e){let{previous:r,next:t}=e;return r?.type==="sentence"&&U(0,r.children,-1)?.type==="word"&&!U(0,r.children,-1).hasTrailingPunctuation||t?.type==="sentence"&&t.children[0]?.type==="word"&&!t.children[0].hasLeadingPunctuation}function Yf(e,r,t){let{node:n}=e;if(zf(e)){let i=[""],u=Mr(r.originalText.slice(n.position.start.offset,n.position.end.offset));for(let a of u){if(a.type==="word"){i.push([i.pop(),a.value]);continue}let o=qt(e,a.value,r.proseWrap,!0);if(W(o)===V){i.push([i.pop(),o]);continue}i.push(o,"")}return Ye(i)}switch(n.type){case"root":return n.children.length===0?"":[Gf(e,r,t),M];case"paragraph":return Ri(e,r,t);case"sentence":return Yi(e,t);case"word":return Li(e);case"whitespace":{let{next:i}=e,u=i&&/^>|^(?:[*+-]|#{1,6}|\d+[).])$/u.test(i.value)?"never":r.proseWrap;return qt(e,n.value,u)}case"emphasis":{let i;if(Yr(n.children[0]))i=r.originalText[n.position.start.offset];else{let u=Wi(e),a=e.callParent(({node:o})=>o.type==="strong"&&Wi(e));i=u||a||e.hasAncestor(o=>o.type==="emphasis")?"*":"_"}return[i,z(e,r,t),i]}case"strong":return["**",z(e,r,t),"**"];case"delete":return["~~",z(e,r,t),"~~"];case"inlineCode":{let i=r.proseWrap==="preserve"?n.value:R(0,n.value,`
`," "),u=oi(i,"`"),a="`".repeat(u),o=i.startsWith("`")||i.endsWith("`")||/^[\n ]/u.test(i)&&/[\n ]$/u.test(i)&&/[^\n ]/u.test(i)?" ":"";return[a,o,i,o,a]}case"wikiLink":{let i="";return r.proseWrap==="preserve"?i=n.value:i=R(0,n.value,/[\t\n]+/gu," "),["[[",i,"]]"]}case"link":switch(r.originalText[n.position.start.offset]){case"<":{let i="mailto:";return["<",n.url.startsWith(i)&&r.originalText.slice(n.position.start.offset+1,n.position.start.offset+1+i.length)!==i?n.url.slice(i.length):n.url,">"]}case"[":return["[",z(e,r,t),"](",Nt(n.url,")"),zr(n.title,r),")"];default:return r.originalText.slice(n.position.start.offset,n.position.end.offset)}case"image":return["![",n.alt||"","](",Nt(n.url,")"),zr(n.title,r),")"];case"blockquote":return["> ",Fe("> ",z(e,r,t))];case"heading":return["#".repeat(n.depth)+" ",z(e,r,t)];case"code":{if(n.isIndented){let a=" ".repeat(4);return Fe(a,[a,xe(n.value,M)])}let i=r.__inJsTemplate?"~":"`",u=i.repeat(Math.max(3,Ir(n.value,i)+1));return[u,n.lang||"",n.meta?" "+n.meta:"",M,xe(Ur(n,r.originalText),M),M,u]}case"html":{let{parent:i,isLast:u}=e,a=i.type==="root"&&u?n.value.trimEnd():n.value,o=/^<!--.*-->$/su.test(a);return xe(a,o?M:ur(nr))}case"list":return Ii(e,r,t);case"thematicBreak":{let{ancestors:i}=e,u=i.findIndex(o=>o.type==="list");return u===-1?"---":Gr(i[u],i[u+1])%2===0?"***":"---"}case"linkReference":return["[",z(e,r,t),"]",n.referenceType==="full"?Pt(n):n.referenceType==="collapsed"?"[]":""];case"imageReference":switch(n.referenceType){case"full":return["![",n.alt||"","]",Pt(n)];default:return["![",n.alt,"]",n.referenceType==="collapsed"?"[]":""]}case"definition":{let i=r.proseWrap==="always"?qr:" ";return Ge([Pt(n),":",ir([i,Nt(n.url),n.title===null?"":[i,zr(n.title,r,!1)]])])}case"footnote":return["[^",z(e,r,t),"]"];case"footnoteReference":return ji(n);case"footnoteDefinition":{let i=n.children.length===1&&n.children[0].type==="paragraph"&&(r.proseWrap==="never"||r.proseWrap==="preserve"&&n.children[0].position.start.line===n.children[0].position.end.line);return[ji(n),": ",i?z(e,r,t):Ge([Fe(" ".repeat(4),z(e,r,t,{processor:({isFirst:u})=>u?Ge([Nr,t()]):t()}))])]}case"table":return Si(e,r,t);case"tableCell":return z(e,r,t);case"break":return/\s/u.test(r.originalText[n.position.start.offset])?["  ",ur(nr)]:["\\",M];case"liquidNode":return xe(n.value,M);case"import":case"export":case"jsx":return n.value.trimEnd();case"esComment":return["{/* ",n.value," */}"];case"math":return["$$",M,n.value?[xe(n.value,M),M]:"","$$"];case"inlineMath":return r.originalText.slice(qe(n),Ne(n));case"frontMatter":case"tableRow":case"listItem":case"text":default:throw new fi(n,"Markdown")}}function Gf(e,r,t){let n=[],i=null,{children:u}=e.node;for(let[a,o]of u.entries())switch(lr(o)){case"start":i===null&&(i={index:a,offset:o.position.end.offset});break;case"end":i!==null&&(n.push({start:i,end:{index:a,offset:o.position.start.offset}}),i=null);break;default:break}return z(e,r,t,{processor({index:a}){if(n.length>0){let o=n[0];if(a===o.start.index)return[Vi(u[o.start.index]),r.originalText.slice(o.start.offset,o.end.offset),Vi(u[o.end.index])];if(o.start.index<a&&a<o.end.index)return!1;if(a===o.end.index)return n.shift(),!1}return t()}})}function Vi(e){if(e.type==="html")return e.value;if(e.type==="paragraph"&&Array.isArray(e.children)&&e.children.length===1&&e.children[0].type==="esComment")return["{/* ",e.children[0].value," */}"]}function zf(e){let r=e.findAncestor(t=>t.type==="linkReference"||t.type==="imageReference");return r&&(r.type!=="linkReference"||r.referenceType!=="full")}var Wf=(e,r)=>{for(let t of r)e=R(0,e,t,encodeURIComponent(t));return e};function Nt(e,r=[]){let t=[" ",...Array.isArray(r)?r:[r]];return new RegExp(t.map(n=>fe(n)).join("|"),"u").test(e)?`<${Wf(e,"<>")}>`:e}function zr(e,r,t=!0){if(!e)return"";if(t)return" "+zr(e,r,!1);if(e=R(0,e,/\\(?=["')])/gu,""),e.includes('"')&&e.includes("'")&&!e.includes(")"))return`(${e})`;let n=li(e,r.singleQuote);return e=R(0,e,"\\","\\\\"),e=R(0,e,n,`\\${n}`),`${n}${e}${n}`}function Vf(e){return e.index>0&&lr(e.previous)==="next"}function Pt(e){return`[${(0,$i.default)(e.label)}]`}function ji(e){return`[^${e.label}]`}var jf={features:{experimental_frontMatterSupport:{massageAstNode:!0,embed:!0,print:!0}},preprocess:Ui,print:Yf,embed:Ti,massageAstNode:yi,hasPrettierIgnore:Vf,insertPragma:Ai,getVisitorKeys:Oi},Hi=jf;var Ki=[{name:"Markdown",type:"prose",aceMode:"markdown",extensions:[".md",".livemd",".markdown",".mdown",".mdwn",".mkd",".mkdn",".mkdown",".ronn",".scd",".workbook"],filenames:["contents.lr","README"],tmScope:"text.md",aliases:["md","pandoc"],codemirrorMode:"gfm",codemirrorMimeType:"text/x-gfm",wrap:!0,parsers:["markdown"],vscodeLanguageIds:["markdown"],linguistLanguageId:222},{name:"MDX",type:"prose",aceMode:"markdown",extensions:[".mdx"],filenames:[],tmScope:"text.md",aliases:["md","pandoc"],codemirrorMode:"gfm",codemirrorMimeType:"text/x-gfm",wrap:!0,parsers:["mdx"],vscodeLanguageIds:["mdx"],linguistLanguageId:222}];var It={bracketSpacing:{category:"Common",type:"boolean",default:!0,description:"Print spaces between brackets.",oppositeDescription:"Do not print spaces between brackets."},objectWrap:{category:"Common",type:"choice",default:"preserve",description:"How to wrap object literals.",choices:[{value:"preserve",description:"Keep as multi-line, if there is a newline between the opening brace and first property."},{value:"collapse",description:"Fit to a single line when possible."}]},singleQuote:{category:"Common",type:"boolean",default:!1,description:"Use single quotes instead of double quotes."},proseWrap:{category:"Common",type:"choice",default:"preserve",description:"How to wrap prose.",choices:[{value:"always",description:"Wrap prose if it exceeds the print width."},{value:"never",description:"Do not wrap prose."},{value:"preserve",description:"Wrap prose as-is."}]},bracketSameLine:{category:"Common",type:"boolean",default:!1,description:"Put > of opening tags on the last line instead of on a new line."},singleAttributePerLine:{category:"Common",type:"boolean",default:!1,description:"Enforce single attribute per line in HTML, Vue and JSX."}};var $f={proseWrap:It.proseWrap,singleQuote:It.singleQuote},Xi=$f;var Wn={};Vn(Wn,{markdown:()=>cF,mdx:()=>lF,remark:()=>cF});var Dl=Re(Qi(),1),pl=Re(Du(),1),hl=Re(oc(),1),dl=Re(el(),1);var rF=/^import\s/u,tF=/^export\s/u,rl="[a-z][a-z0-9]*(\\.[a-z][a-z0-9]*)*|",tl=/<!---->|<!---?[^>-](?:-?[^-])*-->/u,nF=/^\{\s*\/\*(.*)\*\/\s*\}/u;var iF=e=>rF.test(e),nl=e=>tF.test(e),il=e=>iF(e)||nl(e),zn=(e,r)=>{let t=r.indexOf(`

`),n=t===-1?r:r.slice(0,t);if(il(n))return e(n)({type:nl(n)?"export":"import",value:n})};zn.notInBlock=!0;zn.locator=e=>il(e)?-1:1;var ul=(e,r)=>{let t=nF.exec(r);if(t)return e(t[0])({type:"esComment",value:t[1].trim()})};ul.locator=(e,r)=>e.indexOf("{",r);var al=function(){let{Parser:e}=this,{blockTokenizers:r,blockMethods:t,inlineTokenizers:n,inlineMethods:i}=e.prototype;r.esSyntax=zn,n.esComment=ul,t.splice(t.indexOf("paragraph"),0,"esSyntax"),i.splice(i.indexOf("text"),0,"esComment")};var uF=function(){let e=this.Parser.prototype;e.blockMethods=["frontMatter",...e.blockMethods],e.blockTokenizers.frontMatter=r;function r(t,n){let{frontMatter:i}=_e(n);if(i)return t(i.raw)({...i,type:"frontMatter"})}r.onlyAtStart=!0},ol=uF;function aF(){return e=>ye(e,(r,t,[n])=>r.type!=="html"||tl.test(r.value)||Rr.has(n.type)?r:{...r,type:"jsx"})}var sl=aF;var oF=function(){let e=this.Parser.prototype,r=e.inlineMethods;r.splice(r.indexOf("text"),0,"liquid"),e.inlineTokenizers.liquid=t;function t(n,i){let u=i.match(/^(\{%.*?%\}|\{\{.*?\}\})/su);if(u)return n(u[0])({type:"liquidNode",value:u[0]})}t.locator=function(n,i){return n.indexOf("{",i)}},cl=oF;var sF=function(){let e="wikiLink",r=/^\[\[(?<linkContents>.+?)\]\]/su,t=this.Parser.prototype,n=t.inlineMethods;n.splice(n.indexOf("link"),0,e),t.inlineTokenizers.wikiLink=i;function i(u,a){let o=r.exec(a);if(o){let s=o.groups.linkContents.trim();return u(o[0])({type:e,value:s})}}i.locator=function(u,a){return u.indexOf("[",a)}},ll=sF;function ml({isMDX:e}){return r=>{let t=(0,dl.default)().use(hl.default,{commonmark:!0,...e&&{blocks:[rl]}}).use(Dl.default).use(ol).use(pl.default).use(e?al:fl).use(cl).use(e?sl:fl).use(ll);return t.run(t.parse(r))}}function fl(){}var Fl={astFormat:"mdast",hasPragma:Lr,hasIgnorePragma:vi,locStart:qe,locEnd:Ne},cF={...Fl,parse:ml({isMDX:!1})},lF={...Fl,parse:ml({isMDX:!0})};var fF={mdast:Hi};

;// CONCATENATED MODULE: ./node_modules/prettier/standalone.mjs
var standalone_Zn=Object.create;var standalone_Mt=Object.defineProperty;var eo=Object.getOwnPropertyDescriptor;var to=Object.getOwnPropertyNames;var uo=Object.getPrototypeOf,ro=Object.prototype.hasOwnProperty;var standalone_no=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),Yt=(e,t)=>{for(var u in t)standalone_Mt(e,u,{get:t[u],enumerable:!0})},standalone_oo=(e,t,u,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of to(t))!ro.call(e,o)&&o!==u&&standalone_Mt(e,o,{get:()=>t[o],enumerable:!(r=eo(t,o))||r.enumerable});return e};var ao=(e,t,u)=>(u=e!=null?standalone_Zn(uo(e)):{},standalone_oo(t||!e||!e.__esModule?standalone_Mt(u,"default",{value:e,enumerable:!0}):u,e));var dn=standalone_no((of,ln)=>{var yt,bt,At,_t,xt,$e,bu,Ke,Bt,cn,Tt,Ve,Nt,St,wt,pe,fn,Ot,Pt,Aa;Nt=/\/(?![*\/])(?:\[(?:[^\]\\\n\r\u2028\u2029]+|\\.)*\]|[^\/\\\n\r\u2028\u2029]+|\\.)*(\/[$_\u200C\u200D\p{ID_Continue}]*|\\)?/yu;Ve=/--|\+\+|=>|\.{3}|\??\.(?!\d)|(?:&&|\|\||\?\?|[+\-%&|^]|\*{1,2}|<{1,2}|>{1,3}|!=?|={1,2}|\/(?![\/*]))=?|[?~,:;[\](){}]/y;yt=/(\x23?)(?=[$_\p{ID_Start}\\])(?:[$_\u200C\u200D\p{ID_Continue}]+|\\u[\da-fA-F]{4}|\\u\{[\da-fA-F]+\})+/yu;wt=/(['"])(?:[^'"\\\n\r]+|(?!\1)['"]|\\(?:\r\n|[^]))*(\1)?/y;Tt=/(?:0[xX][\da-fA-F](?:_?[\da-fA-F])*|0[oO][0-7](?:_?[0-7])*|0[bB][01](?:_?[01])*)n?|0n|[1-9](?:_?\d)*n|(?:(?:0(?!\d)|0\d*[89]\d*|[1-9](?:_?\d)*)(?:\.(?:\d(?:_?\d)*)?)?|\.\d(?:_?\d)*)(?:[eE][+-]?\d(?:_?\d)*)?|0[0-7]+/y;pe=/[`}](?:[^`\\$]+|\\[^]|\$(?!\{))*(`|\$\{)?/y;Pt=/[\t\v\f\ufeff\p{Zs}]+/yu;Ke=/\r?\n|[\r\u2028\u2029]/y;Bt=/\/\*(?:[^*]+|\*(?!\/))*(\*\/)?/y;St=/\/\/.*/y;At=/[<>.:={}]|\/(?![\/*])/y;bt=/[$_\p{ID_Start}][$_\u200C\u200D\p{ID_Continue}-]*/yu;_t=/(['"])(?:[^'"]+|(?!\1)['"])*(\1)?/y;xt=/[^<>{}]+/y;Ot=/^(?:[\/+-]|\.{3}|\?(?:InterpolationIn(?:JSX|Template)|NoLineTerminatorHere|NonExpressionParenEnd|UnaryIncDec))?$|[{}([,;<>=*%&|^!~?:]$/;fn=/^(?:=>|[;\]){}]|else|\?(?:NoLineTerminatorHere|NonExpressionParenEnd))?$/;$e=/^(?:await|case|default|delete|do|else|instanceof|new|return|throw|typeof|void|yield)$/;bu=/^(?:return|throw|yield)$/;cn=RegExp(Ke.source);ln.exports=Aa=function*(e,{jsx:t=!1}={}){var u,r,o,n,a,s,i,D,f,l,d,c,p,F;for({length:s}=e,n=0,a="",F=[{tag:"JS"}],u=[],d=0,c=!1;n<s;){switch(D=F[F.length-1],D.tag){case"JS":case"JSNonExpressionParen":case"InterpolationInTemplate":case"InterpolationInJSX":if(e[n]==="/"&&(Ot.test(a)||$e.test(a))&&(Nt.lastIndex=n,i=Nt.exec(e))){n=Nt.lastIndex,a=i[0],c=!0,yield{type:"RegularExpressionLiteral",value:i[0],closed:i[1]!==void 0&&i[1]!=="\\"};continue}if(Ve.lastIndex=n,i=Ve.exec(e)){switch(p=i[0],f=Ve.lastIndex,l=p,p){case"(":a==="?NonExpressionParenKeyword"&&F.push({tag:"JSNonExpressionParen",nesting:d}),d++,c=!1;break;case")":d--,c=!0,D.tag==="JSNonExpressionParen"&&d===D.nesting&&(F.pop(),l="?NonExpressionParenEnd",c=!1);break;case"{":Ve.lastIndex=0,o=!fn.test(a)&&(Ot.test(a)||$e.test(a)),u.push(o),c=!1;break;case"}":switch(D.tag){case"InterpolationInTemplate":if(u.length===D.nesting){pe.lastIndex=n,i=pe.exec(e),n=pe.lastIndex,a=i[0],i[1]==="${"?(a="?InterpolationInTemplate",c=!1,yield{type:"TemplateMiddle",value:i[0]}):(F.pop(),c=!0,yield{type:"TemplateTail",value:i[0],closed:i[1]==="`"});continue}break;case"InterpolationInJSX":if(u.length===D.nesting){F.pop(),n+=1,a="}",yield{type:"JSXPunctuator",value:"}"};continue}}c=u.pop(),l=c?"?ExpressionBraceEnd":"}";break;case"]":c=!0;break;case"++":case"--":l=c?"?PostfixIncDec":"?UnaryIncDec";break;case"<":if(t&&(Ot.test(a)||$e.test(a))){F.push({tag:"JSXTag"}),n+=1,a="<",yield{type:"JSXPunctuator",value:p};continue}c=!1;break;default:c=!1}n=f,a=l,yield{type:"Punctuator",value:p};continue}if(yt.lastIndex=n,i=yt.exec(e)){switch(n=yt.lastIndex,l=i[0],i[0]){case"for":case"if":case"while":case"with":a!=="."&&a!=="?."&&(l="?NonExpressionParenKeyword")}a=l,c=!$e.test(i[0]),yield{type:i[1]==="#"?"PrivateIdentifier":"IdentifierName",value:i[0]};continue}if(wt.lastIndex=n,i=wt.exec(e)){n=wt.lastIndex,a=i[0],c=!0,yield{type:"StringLiteral",value:i[0],closed:i[2]!==void 0};continue}if(Tt.lastIndex=n,i=Tt.exec(e)){n=Tt.lastIndex,a=i[0],c=!0,yield{type:"NumericLiteral",value:i[0]};continue}if(pe.lastIndex=n,i=pe.exec(e)){n=pe.lastIndex,a=i[0],i[1]==="${"?(a="?InterpolationInTemplate",F.push({tag:"InterpolationInTemplate",nesting:u.length}),c=!1,yield{type:"TemplateHead",value:i[0]}):(c=!0,yield{type:"NoSubstitutionTemplate",value:i[0],closed:i[1]==="`"});continue}break;case"JSXTag":case"JSXTagEnd":if(At.lastIndex=n,i=At.exec(e)){switch(n=At.lastIndex,l=i[0],i[0]){case"<":F.push({tag:"JSXTag"});break;case">":F.pop(),a==="/"||D.tag==="JSXTagEnd"?(l="?JSX",c=!0):F.push({tag:"JSXChildren"});break;case"{":F.push({tag:"InterpolationInJSX",nesting:u.length}),l="?InterpolationInJSX",c=!1;break;case"/":a==="<"&&(F.pop(),F[F.length-1].tag==="JSXChildren"&&F.pop(),F.push({tag:"JSXTagEnd"}))}a=l,yield{type:"JSXPunctuator",value:i[0]};continue}if(bt.lastIndex=n,i=bt.exec(e)){n=bt.lastIndex,a=i[0],yield{type:"JSXIdentifier",value:i[0]};continue}if(_t.lastIndex=n,i=_t.exec(e)){n=_t.lastIndex,a=i[0],yield{type:"JSXString",value:i[0],closed:i[2]!==void 0};continue}break;case"JSXChildren":if(xt.lastIndex=n,i=xt.exec(e)){n=xt.lastIndex,a=i[0],yield{type:"JSXText",value:i[0]};continue}switch(e[n]){case"<":F.push({tag:"JSXTag"}),n++,a="<",yield{type:"JSXPunctuator",value:"<"};continue;case"{":F.push({tag:"InterpolationInJSX",nesting:u.length}),n++,a="?InterpolationInJSX",c=!1,yield{type:"JSXPunctuator",value:"{"};continue}}if(Pt.lastIndex=n,i=Pt.exec(e)){n=Pt.lastIndex,yield{type:"WhiteSpace",value:i[0]};continue}if(Ke.lastIndex=n,i=Ke.exec(e)){n=Ke.lastIndex,c=!1,bu.test(a)&&(a="?NoLineTerminatorHere"),yield{type:"LineTerminatorSequence",value:i[0]};continue}if(Bt.lastIndex=n,i=Bt.exec(e)){n=Bt.lastIndex,cn.test(i[0])&&(c=!1,bu.test(a)&&(a="?NoLineTerminatorHere")),yield{type:"MultiLineComment",value:i[0],closed:i[1]!==void 0};continue}if(St.lastIndex=n,i=St.exec(e)){n=St.lastIndex,c=!1,yield{type:"SingleLineComment",value:i[0]};continue}r=String.fromCodePoint(e.codePointAt(n)),n+=r.length,a=r,c=!1,yield{type:D.tag.startsWith("JSX")?"JSXInvalid":"Invalid",value:r}}}});var standalone_Hn={};Yt(standalone_Hn,{__debug:()=>standalone_li,check:()=>standalone_ci,doc:()=>wu,format:()=>standalone_Jn,formatWithCursor:()=>standalone_zn,getSupportInfo:()=>standalone_fi,util:()=>Pu,version:()=>Mn});var standalone_X=(e,t)=>(u,r,...o)=>u|1&&r==null?void 0:(t.call(r)??r[e]).apply(r,o);var io=String.prototype.replaceAll??function(e,t){return e.global?this.replace(e,t):this.split(e).join(t)},so=standalone_X("replaceAll",function(){if(typeof this=="string")return io}),oe=so;var standalone_Ne=class{diff(t,u,r={}){let o;typeof r=="function"?(o=r,r={}):"callback"in r&&(o=r.callback);let n=this.castInput(t,r),a=this.castInput(u,r),s=this.removeEmpty(this.tokenize(n,r)),i=this.removeEmpty(this.tokenize(a,r));return this.diffWithOptionsObj(s,i,r,o)}diffWithOptionsObj(t,u,r,o){var n;let a=m=>{if(m=this.postProcess(m,r),o){setTimeout(function(){o(m)},0);return}else return m},s=u.length,i=t.length,D=1,f=s+i;r.maxEditLength!=null&&(f=Math.min(f,r.maxEditLength));let l=(n=r.timeout)!==null&&n!==void 0?n:1/0,d=Date.now()+l,c=[{oldPos:-1,lastComponent:void 0}],p=this.extractCommon(c[0],u,t,0,r);if(c[0].oldPos+1>=i&&p+1>=s)return a(this.buildValues(c[0].lastComponent,u,t));let F=-1/0,C=1/0,y=()=>{for(let m=Math.max(F,-D);m<=Math.min(C,D);m+=2){let h,E=c[m-1],g=c[m+1];E&&(c[m-1]=void 0);let A=!1;if(g){let Q=g.oldPos-m;A=g&&0<=Q&&Q<s}let J=E&&E.oldPos+1<i;if(!A&&!J){c[m]=void 0;continue}if(!J||A&&E.oldPos<g.oldPos?h=this.addToPath(g,!0,!1,0,r):h=this.addToPath(E,!1,!0,1,r),p=this.extractCommon(h,u,t,m,r),h.oldPos+1>=i&&p+1>=s)return a(this.buildValues(h.lastComponent,u,t))||!0;c[m]=h,h.oldPos+1>=i&&(C=Math.min(C,m-1)),p+1>=s&&(F=Math.max(F,m+1))}D++};if(o)(function m(){setTimeout(function(){if(D>f||Date.now()>d)return o(void 0);y()||m()},0)})();else for(;D<=f&&Date.now()<=d;){let m=y();if(m)return m}}addToPath(t,u,r,o,n){let a=t.lastComponent;return a&&!n.oneChangePerToken&&a.added===u&&a.removed===r?{oldPos:t.oldPos+o,lastComponent:{count:a.count+1,added:u,removed:r,previousComponent:a.previousComponent}}:{oldPos:t.oldPos+o,lastComponent:{count:1,added:u,removed:r,previousComponent:a}}}extractCommon(t,u,r,o,n){let a=u.length,s=r.length,i=t.oldPos,D=i-o,f=0;for(;D+1<a&&i+1<s&&this.equals(r[i+1],u[D+1],n);)D++,i++,f++,n.oneChangePerToken&&(t.lastComponent={count:1,previousComponent:t.lastComponent,added:!1,removed:!1});return f&&!n.oneChangePerToken&&(t.lastComponent={count:f,previousComponent:t.lastComponent,added:!1,removed:!1}),t.oldPos=i,D}equals(t,u,r){return r.comparator?r.comparator(t,u):t===u||!!r.ignoreCase&&t.toLowerCase()===u.toLowerCase()}removeEmpty(t){let u=[];for(let r=0;r<t.length;r++)t[r]&&u.push(t[r]);return u}castInput(t,u){return t}tokenize(t,u){return Array.from(t)}join(t){return t.join("")}postProcess(t,u){return t}get useLongestToken(){return!1}buildValues(t,u,r){let o=[],n;for(;t;)o.push(t),n=t.previousComponent,delete t.previousComponent,t=n;o.reverse();let a=o.length,s=0,i=0,D=0;for(;s<a;s++){let f=o[s];if(f.removed)f.value=this.join(r.slice(D,D+f.count)),D+=f.count;else{if(!f.added&&this.useLongestToken){let l=u.slice(i,i+f.count);l=l.map(function(d,c){let p=r[D+c];return p.length>d.length?p:d}),f.value=this.join(l)}else f.value=this.join(u.slice(i,i+f.count));i+=f.count,f.added||(D+=f.count)}}return o}};var jt=class extends (/* unused pure expression or super */ null && (standalone_Ne)){tokenize(t){return t.slice()}join(t){return t}removeEmpty(t){return t}},ku=new jt;function Ut(e,t,u){return ku.diff(e,t,u)}var Do=()=>{},P=Do;var Ru="cr",Lu="crlf",co="lf",fo=co,Wt="\r",Mu=`\r
`,Je=`
`,lo=Je;function Yu(e){let t=e.indexOf(Wt);return t!==-1?e.charAt(t+1)===Je?Lu:Ru:fo}function standalone_Se(e){return e===Ru?Wt:e===Lu?Mu:lo}var standalone_po=new Map([[Je,/\n/gu],[Wt,/\r/gu],[Mu,/\r\n/gu]]);function $t(e,t){let u=standalone_po.get(t);return e.match(u)?.length??0}var Fo=/\r\n?/gu;function ju(e){return oe(0,e,Fo,Je)}function mo(e){return this[e<0?this.length+e:e]}var Eo=standalone_X("at",function(){if(Array.isArray(this)||typeof this=="string")return mo}),b=Eo;var G="string",standalone_j="array",standalone_U="cursor",I="indent",k="align",v="trim",standalone_x="group",w="fill",B="if-break",standalone_R="indent-if-break",L="line-suffix",standalone_M="line-suffix-boundary",_="line",O="label",T="break-parent",He=new Set([standalone_U,I,k,v,standalone_x,w,B,standalone_R,L,standalone_M,_,O,T]);function Uu(e){let t=e.length;for(;t>0&&(e[t-1]==="\r"||e[t-1]===`
`);)t--;return t<e.length?e.slice(0,t):e}function Co(e){if(typeof e=="string")return G;if(Array.isArray(e))return standalone_j;if(!e)return;let{type:t}=e;if(He.has(t))return t}var standalone_H=Co;var ho=e=>new Intl.ListFormat("en-US",{type:"disjunction"}).format(e);function go(e){let t=e===null?"null":typeof e;if(t!=="string"&&t!=="object")return`Unexpected doc '${t}', 
Expected it to be 'string' or 'object'.`;if(standalone_H(e))throw new Error("doc is valid.");let u=Object.prototype.toString.call(e);if(u!=="[object Object]")return`Unexpected doc '${u}'.`;let r=ho([...He].map(o=>`'${o}'`));return`Unexpected doc.type '${e.type}'.
Expected it to be ${r}.`}var Vt=class extends Error{name="InvalidDocError";constructor(t){super(go(t)),this.doc=t}},Z=Vt;var Wu={};function yo(e,t,u,r){let o=[e];for(;o.length>0;){let n=o.pop();if(n===Wu){u(o.pop());continue}u&&o.push(n,Wu);let a=standalone_H(n);if(!a)throw new Z(n);if(t?.(n)!==!1)switch(a){case standalone_j:case w:{let s=a===standalone_j?n:n.parts;for(let i=s.length,D=i-1;D>=0;--D)o.push(s[D]);break}case B:o.push(n.flatContents,n.breakContents);break;case standalone_x:if(r&&n.expandedStates)for(let s=n.expandedStates.length,i=s-1;i>=0;--i)o.push(n.expandedStates[i]);else o.push(n.contents);break;case k:case I:case standalone_R:case O:case L:o.push(n.contents);break;case G:case standalone_U:case v:case standalone_M:case _:case T:break;default:throw new Z(n)}}}var we=yo;function standalone_Pe(e,t){if(typeof e=="string")return t(e);let u=new Map;return r(e);function r(n){if(u.has(n))return u.get(n);let a=o(n);return u.set(n,a),a}function o(n){switch(standalone_H(n)){case standalone_j:return t(n.map(r));case w:return t({...n,parts:n.parts.map(r)});case B:return t({...n,breakContents:r(n.breakContents),flatContents:r(n.flatContents)});case standalone_x:{let{expandedStates:a,contents:s}=n;return a?(a=a.map(r),s=a[0]):s=r(s),t({...n,contents:s,expandedStates:a})}case k:case I:case standalone_R:case O:case L:return t({...n,contents:r(n.contents)});case G:case standalone_U:case v:case standalone_M:case _:case T:return t(n);default:throw new Z(n)}}}function Xe(e,t,u){let r=u,o=!1;function n(a){if(o)return!1;let s=t(a);s!==void 0&&(o=!0,r=s)}return we(e,n),r}function standalone_bo(e){if(e.type===standalone_x&&e.break||e.type===_&&e.hard||e.type===T)return!0}function Ku(e){return Xe(e,standalone_bo,!1)}function $u(e){if(e.length>0){let t=b(0,e,-1);!t.expandedStates&&!t.break&&(t.break="propagated")}return null}function Gu(e){let t=new Set,u=[];function r(n){if(n.type===T&&$u(u),n.type===standalone_x){if(u.push(n),t.has(n))return!1;t.add(n)}}function o(n){n.type===standalone_x&&u.pop().break&&$u(u)}we(e,r,o,!0)}function Ao(e){return e.type===_&&!e.hard?e.soft?"":" ":e.type===B?e.flatContents:e}function zu(e){return standalone_Pe(e,Ao)}function Vu(e){for(e=[...e];e.length>=2&&b(0,e,-2).type===_&&b(0,e,-1).type===T;)e.length-=2;if(e.length>0){let t=standalone_Oe(b(0,e,-1));e[e.length-1]=t}return e}function standalone_Oe(e){switch(standalone_H(e)){case I:case standalone_R:case standalone_x:case L:case O:{let t=standalone_Oe(e.contents);return{...e,contents:t}}case B:return{...e,breakContents:standalone_Oe(e.breakContents),flatContents:standalone_Oe(e.flatContents)};case w:return{...e,parts:Vu(e.parts)};case standalone_j:return Vu(e);case G:return Uu(e);case k:case standalone_U:case v:case standalone_M:case _:case T:break;default:throw new Z(e)}return e}function standalone_qe(e){return standalone_Oe(xo(e))}function _o(e){switch(standalone_H(e)){case w:if(e.parts.every(t=>t===""))return"";break;case standalone_x:if(!e.contents&&!e.id&&!e.break&&!e.expandedStates)return"";if(e.contents.type===standalone_x&&e.contents.id===e.id&&e.contents.break===e.break&&e.contents.expandedStates===e.expandedStates)return e.contents;break;case k:case I:case standalone_R:case L:if(!e.contents)return"";break;case B:if(!e.flatContents&&!e.breakContents)return"";break;case standalone_j:{let t=[];for(let u of e){if(!u)continue;let[r,...o]=Array.isArray(u)?u:[u];typeof r=="string"&&typeof b(0,t,-1)=="string"?t[t.length-1]+=r:t.push(r),t.push(...o)}return t.length===0?"":t.length===1?t[0]:t}case G:case standalone_U:case v:case standalone_M:case _:case O:case T:break;default:throw new Z(e)}return e}function xo(e){return standalone_Pe(e,t=>_o(t))}function standalone_Ju(e,t=Qe){return standalone_Pe(e,u=>typeof u=="string"?standalone_Ie(t,u.split(`
`)):u)}function standalone_Bo(e){if(e.type===_)return!0}function Hu(e){return Xe(e,standalone_Bo,!1)}function Ee(e,t){return e.type===O?{...e,contents:t(e.contents)}:t(e)}var N=P,Ze=P,Xu=P,standalone_qu=P;function standalone_ae(e){return N(e),{type:I,contents:e}}function standalone_De(e,t){return standalone_qu(e),N(t),{type:k,contents:t,n:e}}function Qu(e){return standalone_De(Number.NEGATIVE_INFINITY,e)}function et(e){return standalone_De({type:"root"},e)}function Zu(e){return standalone_De(-1,e)}function tt(e,t,u){N(e);let r=e;if(t>0){for(let o=0;o<Math.floor(t/u);++o)r=standalone_ae(r);r=standalone_De(t%u,r),r=standalone_De(Number.NEGATIVE_INFINITY,r)}return r}var ce={type:T};var standalone_ee={type:standalone_U};function er(e){return Xu(e),{type:w,parts:e}}function standalone_Kt(e,t={}){return N(e),Ze(t.expandedStates,!0),{type:standalone_x,id:t.id,contents:e,break:!!t.shouldBreak,expandedStates:t.expandedStates}}function standalone_tr(e,t){return standalone_Kt(e[0],{...t,expandedStates:e})}function standalone_ur(e,t="",u={}){return N(e),t!==""&&N(t),{type:B,breakContents:e,flatContents:t,groupId:u.groupId}}function rr(e,t){return N(e),{type:standalone_R,contents:e,groupId:t.groupId,negate:t.negate}}function standalone_Ie(e,t){N(e),Ze(t);let u=[];for(let r=0;r<t.length;r++)r!==0&&u.push(e),u.push(t[r]);return u}function standalone_nr(e,t){return N(t),e?{type:O,label:e,contents:t}:t}var ut={type:_},standalone_or={type:_,soft:!0},ke={type:_,hard:!0},standalone_V=[ke,ce],Gt={type:_,hard:!0,literal:!0},Qe=[Gt,ce];function ve(e){return N(e),{type:L,contents:e}}var standalone_ar={type:standalone_M};var standalone_ir={type:v};function standalone_te(e){if(!e)return"";if(Array.isArray(e)){let t=[];for(let u of e)if(Array.isArray(u))t.push(...standalone_te(u));else{let r=standalone_te(u);r!==""&&t.push(r)}return t}return e.type===B?{...e,breakContents:standalone_te(e.breakContents),flatContents:standalone_te(e.flatContents)}:e.type===standalone_x?{...e,contents:standalone_te(e.contents),expandedStates:e.expandedStates?.map(standalone_te)}:e.type===w?{type:"fill",parts:e.parts.map(standalone_te)}:e.contents?{...e,contents:standalone_te(e.contents)}:e}function standalone_sr(e){let t=Object.create(null),u=new Set;return r(standalone_te(e));function r(n,a,s){if(typeof n=="string")return JSON.stringify(n);if(Array.isArray(n)){let i=n.map(r).filter(Boolean);return i.length===1?i[0]:`[${i.join(", ")}]`}if(n.type===_){let i=s?.[a+1]?.type===T;return n.literal?i?"literalline":"literallineWithoutBreakParent":n.hard?i?"hardline":"hardlineWithoutBreakParent":n.soft?"softline":"line"}if(n.type===T)return s?.[a-1]?.type===_&&s[a-1].hard?void 0:"breakParent";if(n.type===v)return"trim";if(n.type===I)return"indent("+r(n.contents)+")";if(n.type===k)return n.n===Number.NEGATIVE_INFINITY?"dedentToRoot("+r(n.contents)+")":n.n<0?"dedent("+r(n.contents)+")":n.n.type==="root"?"markAsRoot("+r(n.contents)+")":"align("+JSON.stringify(n.n)+", "+r(n.contents)+")";if(n.type===B)return"ifBreak("+r(n.breakContents)+(n.flatContents?", "+r(n.flatContents):"")+(n.groupId?(n.flatContents?"":', ""')+`, { groupId: ${o(n.groupId)} }`:"")+")";if(n.type===standalone_R){let i=[];n.negate&&i.push("negate: true"),n.groupId&&i.push(`groupId: ${o(n.groupId)}`);let D=i.length>0?`, { ${i.join(", ")} }`:"";return`indentIfBreak(${r(n.contents)}${D})`}if(n.type===standalone_x){let i=[];n.break&&n.break!=="propagated"&&i.push("shouldBreak: true"),n.id&&i.push(`id: ${o(n.id)}`);let D=i.length>0?`, { ${i.join(", ")} }`:"";return n.expandedStates?`conditionalGroup([${n.expandedStates.map(f=>r(f)).join(",")}]${D})`:`group(${r(n.contents)}${D})`}if(n.type===w)return`fill([${n.parts.map(i=>r(i)).join(", ")}])`;if(n.type===L)return"lineSuffix("+r(n.contents)+")";if(n.type===standalone_M)return"lineSuffixBoundary";if(n.type===O)return`label(${JSON.stringify(n.label)}, ${r(n.contents)})`;if(n.type===standalone_U)return"cursor";throw new Error("Unknown doc type "+n.type)}function o(n){if(typeof n!="symbol")return JSON.stringify(String(n));if(n in t)return t[n];let a=n.description||"symbol";for(let s=0;;s++){let i=a+(s>0?` #${s}`:"");if(!u.has(i))return u.add(i),t[n]=`Symbol.for(${JSON.stringify(i)})`}}}var standalone_Dr=()=>/[#*0-9]\uFE0F?\u20E3|[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23ED-\u23EF\u23F1\u23F2\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB\u25FC\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692\u2694-\u2697\u2699\u269B\u269C\u26A0\u26A7\u26AA\u26B0\u26B1\u26BD\u26BE\u26C4\u26C8\u26CF\u26D1\u26E9\u26F0-\u26F5\u26F7\u26F8\u26FA\u2702\u2708\u2709\u270F\u2712\u2714\u2716\u271D\u2721\u2733\u2734\u2744\u2747\u2757\u2763\u27A1\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B55\u3030\u303D\u3297\u3299]\uFE0F?|[\u261D\u270C\u270D](?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?|[\u270A\u270B](?:\uD83C[\uDFFB-\uDFFF])?|[\u23E9-\u23EC\u23F0\u23F3\u25FD\u2693\u26A1\u26AB\u26C5\u26CE\u26D4\u26EA\u26FD\u2705\u2728\u274C\u274E\u2753-\u2755\u2795-\u2797\u27B0\u27BF\u2B50]|\u26D3\uFE0F?(?:\u200D\uD83D\uDCA5)?|\u26F9(?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?(?:\u200D[\u2640\u2642]\uFE0F?)?|\u2764\uFE0F?(?:\u200D(?:\uD83D\uDD25|\uD83E\uDE79))?|\uD83C(?:[\uDC04\uDD70\uDD71\uDD7E\uDD7F\uDE02\uDE37\uDF21\uDF24-\uDF2C\uDF36\uDF7D\uDF96\uDF97\uDF99-\uDF9B\uDF9E\uDF9F\uDFCD\uDFCE\uDFD4-\uDFDF\uDFF5\uDFF7]\uFE0F?|[\uDF85\uDFC2\uDFC7](?:\uD83C[\uDFFB-\uDFFF])?|[\uDFC4\uDFCA](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDFCB\uDFCC](?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDCCF\uDD8E\uDD91-\uDD9A\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF43\uDF45-\uDF4A\uDF4C-\uDF7C\uDF7E-\uDF84\uDF86-\uDF93\uDFA0-\uDFC1\uDFC5\uDFC6\uDFC8\uDFC9\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF8-\uDFFF]|\uDDE6\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF]|\uDDE7\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF]|\uDDE8\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF7\uDDFA-\uDDFF]|\uDDE9\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF]|\uDDEA\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA]|\uDDEB\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7]|\uDDEC\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE]|\uDDED\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA]|\uDDEE\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9]|\uDDEF\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5]|\uDDF0\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF]|\uDDF1\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE]|\uDDF2\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF]|\uDDF3\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF]|\uDDF4\uD83C\uDDF2|\uDDF5\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE]|\uDDF6\uD83C\uDDE6|\uDDF7\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC]|\uDDF8\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF]|\uDDF9\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF]|\uDDFA\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF]|\uDDFB\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA]|\uDDFC\uD83C[\uDDEB\uDDF8]|\uDDFD\uD83C\uDDF0|\uDDFE\uD83C[\uDDEA\uDDF9]|\uDDFF\uD83C[\uDDE6\uDDF2\uDDFC]|\uDF44(?:\u200D\uD83D\uDFEB)?|\uDF4B(?:\u200D\uD83D\uDFE9)?|\uDFC3(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?|\uDFF3\uFE0F?(?:\u200D(?:\u26A7\uFE0F?|\uD83C\uDF08))?|\uDFF4(?:\u200D\u2620\uFE0F?|\uDB40\uDC67\uDB40\uDC62\uDB40(?:\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDC73\uDB40\uDC63\uDB40\uDC74|\uDC77\uDB40\uDC6C\uDB40\uDC73)\uDB40\uDC7F)?)|\uD83D(?:[\uDC3F\uDCFD\uDD49\uDD4A\uDD6F\uDD70\uDD73\uDD76-\uDD79\uDD87\uDD8A-\uDD8D\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA\uDECB\uDECD-\uDECF\uDEE0-\uDEE5\uDEE9\uDEF0\uDEF3]\uFE0F?|[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDC8F\uDC91\uDCAA\uDD7A\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC](?:\uD83C[\uDFFB-\uDFFF])?|[\uDC6E-\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4\uDEB5](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDD74\uDD90](?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?|[\uDC00-\uDC07\uDC09-\uDC14\uDC16-\uDC25\uDC27-\uDC3A\uDC3C-\uDC3E\uDC40\uDC44\uDC45\uDC51-\uDC65\uDC6A\uDC79-\uDC7B\uDC7D-\uDC80\uDC84\uDC88-\uDC8E\uDC90\uDC92-\uDCA9\uDCAB-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDDA4\uDDFB-\uDE2D\uDE2F-\uDE34\uDE37-\uDE41\uDE43\uDE44\uDE48-\uDE4A\uDE80-\uDEA2\uDEA4-\uDEB3\uDEB7-\uDEBF\uDEC1-\uDEC5\uDED0-\uDED2\uDED5-\uDED8\uDEDC-\uDEDF\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB\uDFF0]|\uDC08(?:\u200D\u2B1B)?|\uDC15(?:\u200D\uD83E\uDDBA)?|\uDC26(?:\u200D(?:\u2B1B|\uD83D\uDD25))?|\uDC3B(?:\u200D\u2744\uFE0F?)?|\uDC41\uFE0F?(?:\u200D\uD83D\uDDE8\uFE0F?)?|\uDC68(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDC68\uDC69]\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC68\uD83C[\uDFFC-\uDFFF])|\uD83E(?:[\uDD1D\uDEEF]\u200D\uD83D\uDC68\uD83C[\uDFFC-\uDFFF]|[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83E(?:[\uDD1D\uDEEF]\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFD-\uDFFF]|[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83E(?:[\uDD1D\uDEEF]\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF]|[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83E(?:[\uDD1D\uDEEF]\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFD\uDFFF]|[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFE])|\uD83E(?:[\uDD1D\uDEEF]\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFE]|[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3])))?))?|\uDC69(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?[\uDC68\uDC69]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?|\uDC69\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?))|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC69\uD83C[\uDFFC-\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFC-\uDFFF]|\uDEEF\u200D\uD83D\uDC69\uD83C[\uDFFC-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC69\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB\uDFFD-\uDFFF]|\uDEEF\u200D\uD83D\uDC69\uD83C[\uDFFB\uDFFD-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC69\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF]|\uDEEF\u200D\uD83D\uDC69\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC69\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB-\uDFFD\uDFFF]|\uDEEF\u200D\uD83D\uDC69\uD83C[\uDFFB-\uDFFD\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC69\uD83C[\uDFFB-\uDFFE])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB-\uDFFE]|\uDEEF\u200D\uD83D\uDC69\uD83C[\uDFFB-\uDFFE])))?))?|\uDD75(?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?(?:\u200D[\u2640\u2642]\uFE0F?)?|\uDE2E(?:\u200D\uD83D\uDCA8)?|\uDE35(?:\u200D\uD83D\uDCAB)?|\uDE36(?:\u200D\uD83C\uDF2B\uFE0F?)?|\uDE42(?:\u200D[\u2194\u2195]\uFE0F?)?|\uDEB6(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?)|\uD83E(?:[\uDD0C\uDD0F\uDD18-\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2\uDDD3\uDDD5\uDEC3-\uDEC5\uDEF0\uDEF2-\uDEF8](?:\uD83C[\uDFFB-\uDFFF])?|[\uDD26\uDD35\uDD37-\uDD39\uDD3C-\uDD3E\uDDB8\uDDB9\uDDCD\uDDCF\uDDD4\uDDD6-\uDDDD](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDDDE\uDDDF](?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDD0D\uDD0E\uDD10-\uDD17\uDD20-\uDD25\uDD27-\uDD2F\uDD3A\uDD3F-\uDD45\uDD47-\uDD76\uDD78-\uDDB4\uDDB7\uDDBA\uDDBC-\uDDCC\uDDD0\uDDE0-\uDDFF\uDE70-\uDE7C\uDE80-\uDE8A\uDE8E-\uDEC2\uDEC6\uDEC8\uDECD-\uDEDC\uDEDF-\uDEEA\uDEEF]|\uDDCE(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?|\uDDD1(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3\uDE70]|\uDD1D\u200D\uD83E\uDDD1|\uDDD1\u200D\uD83E\uDDD2(?:\u200D\uD83E\uDDD2)?|\uDDD2(?:\u200D\uD83E\uDDD2)?))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFC-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83E\uDDD1\uD83C[\uDFFC-\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3\uDE70]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF]|\uDEEF\u200D\uD83E\uDDD1\uD83C[\uDFFC-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB\uDFFD-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83E\uDDD1\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3\uDE70]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF]|\uDEEF\u200D\uD83E\uDDD1\uD83C[\uDFFB\uDFFD-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83E\uDDD1\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3\uDE70]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF]|\uDEEF\u200D\uD83E\uDDD1\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB-\uDFFD\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3\uDE70]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF]|\uDEEF\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFD\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB-\uDFFE]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFE])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3\uDE70]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF]|\uDEEF\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFE])))?))?|\uDEF1(?:\uD83C(?:\uDFFB(?:\u200D\uD83E\uDEF2\uD83C[\uDFFC-\uDFFF])?|\uDFFC(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB\uDFFD-\uDFFF])?|\uDFFD(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])?|\uDFFE(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB-\uDFFD\uDFFF])?|\uDFFF(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB-\uDFFE])?))?)/g;function zt(e){return e===12288||e>=65281&&e<=65376||e>=65504&&e<=65510}function Jt(e){return e>=4352&&e<=4447||e===8986||e===8987||e===9001||e===9002||e>=9193&&e<=9196||e===9200||e===9203||e===9725||e===9726||e===9748||e===9749||e>=9776&&e<=9783||e>=9800&&e<=9811||e===9855||e>=9866&&e<=9871||e===9875||e===9889||e===9898||e===9899||e===9917||e===9918||e===9924||e===9925||e===9934||e===9940||e===9962||e===9970||e===9971||e===9973||e===9978||e===9981||e===9989||e===9994||e===9995||e===10024||e===10060||e===10062||e>=10067&&e<=10069||e===10071||e>=10133&&e<=10135||e===10160||e===10175||e===11035||e===11036||e===11088||e===11093||e>=11904&&e<=11929||e>=11931&&e<=12019||e>=12032&&e<=12245||e>=12272&&e<=12287||e>=12289&&e<=12350||e>=12353&&e<=12438||e>=12441&&e<=12543||e>=12549&&e<=12591||e>=12593&&e<=12686||e>=12688&&e<=12773||e>=12783&&e<=12830||e>=12832&&e<=12871||e>=12880&&e<=42124||e>=42128&&e<=42182||e>=43360&&e<=43388||e>=44032&&e<=55203||e>=63744&&e<=64255||e>=65040&&e<=65049||e>=65072&&e<=65106||e>=65108&&e<=65126||e>=65128&&e<=65131||e>=94176&&e<=94180||e>=94192&&e<=94198||e>=94208&&e<=101589||e>=101631&&e<=101662||e>=101760&&e<=101874||e>=110576&&e<=110579||e>=110581&&e<=110587||e===110589||e===110590||e>=110592&&e<=110882||e===110898||e>=110928&&e<=110930||e===110933||e>=110948&&e<=110951||e>=110960&&e<=111355||e>=119552&&e<=119638||e>=119648&&e<=119670||e===126980||e===127183||e===127374||e>=127377&&e<=127386||e>=127488&&e<=127490||e>=127504&&e<=127547||e>=127552&&e<=127560||e===127568||e===127569||e>=127584&&e<=127589||e>=127744&&e<=127776||e>=127789&&e<=127797||e>=127799&&e<=127868||e>=127870&&e<=127891||e>=127904&&e<=127946||e>=127951&&e<=127955||e>=127968&&e<=127984||e===127988||e>=127992&&e<=128062||e===128064||e>=128066&&e<=128252||e>=128255&&e<=128317||e>=128331&&e<=128334||e>=128336&&e<=128359||e===128378||e===128405||e===128406||e===128420||e>=128507&&e<=128591||e>=128640&&e<=128709||e===128716||e>=128720&&e<=128722||e>=128725&&e<=128728||e>=128732&&e<=128735||e===128747||e===128748||e>=128756&&e<=128764||e>=128992&&e<=129003||e===129008||e>=129292&&e<=129338||e>=129340&&e<=129349||e>=129351&&e<=129535||e>=129648&&e<=129660||e>=129664&&e<=129674||e>=129678&&e<=129734||e===129736||e>=129741&&e<=129756||e>=129759&&e<=129770||e>=129775&&e<=129784||e>=131072&&e<=196605||e>=196608&&e<=262141}var standalone_cr="\xA9\xAE\u203C\u2049\u2122\u2139\u2194\u2195\u2196\u2197\u2198\u2199\u21A9\u21AA\u2328\u23CF\u23F1\u23F2\u23F8\u23F9\u23FA\u25AA\u25AB\u25B6\u25C0\u25FB\u25FC\u2600\u2601\u2602\u2603\u2604\u260E\u2611\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638\u2639\u263A\u2640\u2642\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u2692\u2694\u2695\u2696\u2697\u2699\u269B\u269C\u26A0\u26A7\u26B0\u26B1\u26C8\u26CF\u26D1\u26D3\u26E9\u26F1\u26F7\u26F8\u26F9\u2702\u2708\u2709\u270C\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2733\u2734\u2744\u2747\u2763\u2764\u27A1\u2934\u2935\u2B05\u2B06\u2B07";var To=/[^\x20-\x7F]/u,No=new Set(standalone_cr);function So(e){if(!e)return 0;if(!To.test(e))return e.length;e=e.replace(standalone_Dr(),u=>No.has(u)?" ":"  ");let t=0;for(let u of e){let r=u.codePointAt(0);r<=31||r>=127&&r<=159||r>=768&&r<=879||r>=65024&&r<=65039||(t+=zt(r)||Jt(r)?2:1)}return t}var standalone_Re=So;var standalone_wo={type:0},standalone_Oo={type:1},Ht={value:"",length:0,queue:[],get root(){return Ht}};function standalone_fr(e,t,u){let r=t.type===1?e.queue.slice(0,-1):[...e.queue,t],o="",n=0,a=0,s=0;for(let p of r)switch(p.type){case 0:f(),u.useTabs?i(1):D(u.tabWidth);break;case 3:{let{string:F}=p;f(),o+=F,n+=F.length;break}case 2:{let{width:F}=p;a+=1,s+=F;break}default:throw new Error(`Unexpected indent comment '${p.type}'.`)}return d(),{...e,value:o,length:n,queue:r};function i(p){o+="	".repeat(p),n+=u.tabWidth*p}function D(p){o+=" ".repeat(p),n+=p}function f(){u.useTabs?l():d()}function l(){a>0&&i(a),c()}function d(){s>0&&D(s),c()}function c(){a=0,s=0}}function standalone_lr(e,t,u){if(!t)return e;if(t.type==="root")return{...e,root:e};if(t===Number.NEGATIVE_INFINITY)return e.root;let r;return typeof t=="number"?t<0?r=standalone_Oo:r={type:2,width:t}:r={type:3,string:t},standalone_fr(e,r,u)}function dr(e,t){return standalone_fr(e,standalone_wo,t)}function Po(e){let t=0;for(let u=e.length-1;u>=0;u--){let r=e[u];if(r===" "||r==="	")t++;else break}return t}function Xt(e){let t=Po(e);return{text:t===0?e:e.slice(0,e.length-t),count:t}}var standalone_W=Symbol("MODE_BREAK"),standalone_q=Symbol("MODE_FLAT"),standalone_qt=Symbol("DOC_FILL_PRINTED_LENGTH");function standalone_rt(e,t,u,r,o,n){if(u===Number.POSITIVE_INFINITY)return!0;let a=t.length,s=!1,i=[e],D="";for(;u>=0;){if(i.length===0){if(a===0)return!0;i.push(t[--a]);continue}let{mode:f,doc:l}=i.pop(),d=standalone_H(l);switch(d){case G:l&&(s&&(D+=" ",u-=1,s=!1),D+=l,u-=standalone_Re(l));break;case standalone_j:case w:{let c=d===standalone_j?l:l.parts,p=l[standalone_qt]??0;for(let F=c.length-1;F>=p;F--)i.push({mode:f,doc:c[F]});break}case I:case k:case standalone_R:case O:i.push({mode:f,doc:l.contents});break;case v:{let{text:c,count:p}=Xt(D);D=c,u+=p;break}case standalone_x:{if(n&&l.break)return!1;let c=l.break?standalone_W:f,p=l.expandedStates&&c===standalone_W?b(0,l.expandedStates,-1):l.contents;i.push({mode:c,doc:p});break}case B:{let p=(l.groupId?o[l.groupId]||standalone_q:f)===standalone_W?l.breakContents:l.flatContents;p&&i.push({mode:f,doc:p});break}case _:if(f===standalone_W||l.hard)return!0;l.soft||(s=!0);break;case L:r=!0;break;case standalone_M:if(r)return!1;break}}return!1}function Ce(e,t){let u=Object.create(null),r=t.printWidth,o=standalone_Se(t.endOfLine),n=0,a=[{indent:Ht,mode:standalone_W,doc:e}],s="",i=!1,D=[],f=[],l=[],d=[],c=0;for(Gu(e);a.length>0;){let{indent:m,mode:h,doc:E}=a.pop();switch(standalone_H(E)){case G:{let g=o!==`
`?oe(0,E,`
`,o):E;g&&(s+=g,a.length>0&&(n+=standalone_Re(g)));break}case standalone_j:for(let g=E.length-1;g>=0;g--)a.push({indent:m,mode:h,doc:E[g]});break;case standalone_U:if(f.length>=2)throw new Error("There are too many 'cursor' in doc.");f.push(c+s.length);break;case I:a.push({indent:dr(m,t),mode:h,doc:E.contents});break;case k:a.push({indent:standalone_lr(m,E.n,t),mode:h,doc:E.contents});break;case v:y();break;case standalone_x:switch(h){case standalone_q:if(!i){a.push({indent:m,mode:E.break?standalone_W:standalone_q,doc:E.contents});break}case standalone_W:{i=!1;let g={indent:m,mode:standalone_q,doc:E.contents},A=r-n,J=D.length>0;if(!E.break&&standalone_rt(g,a,A,J,u))a.push(g);else if(E.expandedStates){let Q=b(0,E.expandedStates,-1);if(E.break){a.push({indent:m,mode:standalone_W,doc:Q});break}else for(let re=1;re<E.expandedStates.length+1;re++)if(re>=E.expandedStates.length){a.push({indent:m,mode:standalone_W,doc:Q});break}else{let Te=E.expandedStates[re],ne={indent:m,mode:standalone_q,doc:Te};if(standalone_rt(ne,a,A,J,u)){a.push(ne);break}}}else a.push({indent:m,mode:standalone_W,doc:E.contents});break}}E.id&&(u[E.id]=b(0,a,-1).mode);break;case w:{let g=r-n,A=E[standalone_qt]??0,{parts:J}=E,Q=J.length-A;if(Q===0)break;let re=J[A+0],Te=J[A+1],ne={indent:m,mode:standalone_q,doc:re},vt={indent:m,mode:standalone_W,doc:re},Rt=standalone_rt(ne,[],g,D.length>0,u,!0);if(Q===1){Rt?a.push(ne):a.push(vt);break}let Iu={indent:m,mode:standalone_q,doc:Te},Lt={indent:m,mode:standalone_W,doc:Te};if(Q===2){Rt?a.push(Iu,ne):a.push(Lt,vt);break}let Xn=J[A+2],qn={indent:m,mode:h,doc:{...E,[standalone_qt]:A+2}},Qn=standalone_rt({indent:m,mode:standalone_q,doc:[re,Te,Xn]},[],g,D.length>0,u,!0);a.push(qn),Qn?a.push(Iu,ne):Rt?a.push(Lt,ne):a.push(Lt,vt);break}case B:case standalone_R:{let g=E.groupId?u[E.groupId]:h;if(g===standalone_W){let A=E.type===B?E.breakContents:E.negate?E.contents:standalone_ae(E.contents);A&&a.push({indent:m,mode:h,doc:A})}if(g===standalone_q){let A=E.type===B?E.flatContents:E.negate?standalone_ae(E.contents):E.contents;A&&a.push({indent:m,mode:h,doc:A})}break}case L:D.push({indent:m,mode:h,doc:E.contents});break;case standalone_M:D.length>0&&a.push({indent:m,mode:h,doc:ke});break;case _:switch(h){case standalone_q:if(E.hard)i=!0;else{E.soft||(s+=" ",n+=1);break}case standalone_W:if(D.length>0){a.push({indent:m,mode:h,doc:E},...D.reverse()),D.length=0;break}E.literal?(s+=o,n=0,m.root&&(m.root.value&&(s+=m.root.value),n=m.root.length)):(y(),s+=o+m.value,n=m.length);break}break;case O:a.push({indent:m,mode:h,doc:E.contents});break;case T:break;default:throw new Z(E)}a.length===0&&D.length>0&&(a.push(...D.reverse()),D.length=0)}let p=l.join("")+s,F=[...d,...f];if(F.length!==2)return{formatted:p};let C=F[0];return{formatted:p,cursorNodeStart:C,cursorNodeText:p.slice(C,b(0,F,-1))};function y(){let{text:m,count:h}=Xt(s);m&&(l.push(m),c+=m.length),s="",n-=h,f.length>0&&(d.push(...f.map(E=>Math.min(E,c))),f.length=0)}}function standalone_Io(e,t,u=0){let r=0;for(let o=u;o<e.length;++o)e[o]==="	"?r=r+t-r%t:r++;return r}var standalone_he=standalone_Io;var standalone_Qt=class{constructor(t){this.stack=[t]}get key(){let{stack:t,siblings:u}=this;return b(0,t,u===null?-2:-4)??null}get index(){return this.siblings===null?null:b(0,this.stack,-2)}get node(){return b(0,this.stack,-1)}get parent(){return this.getNode(1)}get grandparent(){return this.getNode(2)}get isInArray(){return this.siblings!==null}get siblings(){let{stack:t}=this,u=b(0,t,-3);return Array.isArray(u)?u:null}get next(){let{siblings:t}=this;return t===null?null:t[this.index+1]}get previous(){let{siblings:t}=this;return t===null?null:t[this.index-1]}get isFirst(){return this.index===0}get isLast(){let{siblings:t,index:u}=this;return t!==null&&u===t.length-1}get isRoot(){return this.stack.length===1}get root(){return this.stack[0]}get ancestors(){return[...this.#e()]}getName(){let{stack:t}=this,{length:u}=t;return u>1?b(0,t,-2):null}getValue(){return b(0,this.stack,-1)}getNode(t=0){let u=this.#t(t);return u===-1?null:this.stack[u]}getParentNode(t=0){return this.getNode(t+1)}#t(t){let{stack:u}=this;for(let r=u.length-1;r>=0;r-=2)if(!Array.isArray(u[r])&&--t<0)return r;return-1}call(t,...u){let{stack:r}=this,{length:o}=r,n=b(0,r,-1);for(let a of u)n=n?.[a],r.push(a,n);try{return t(this)}finally{r.length=o}}callParent(t,u=0){let r=this.#t(u+1),o=this.stack.splice(r+1);try{return t(this)}finally{this.stack.push(...o)}}each(t,...u){let{stack:r}=this,{length:o}=r,n=b(0,r,-1);for(let a of u)n=n[a],r.push(a,n);try{for(let a=0;a<n.length;++a)r.push(a,n[a]),t(this,a,n),r.length-=2}finally{r.length=o}}map(t,...u){let r=[];return this.each((o,n,a)=>{r[n]=t(o,n,a)},...u),r}match(...t){let u=this.stack.length-1,r=null,o=this.stack[u--];for(let n of t){if(o===void 0)return!1;let a=null;if(typeof r=="number"&&(a=r,r=this.stack[u--],o=this.stack[u--]),n&&!n(o,r,a))return!1;r=this.stack[u--],o=this.stack[u--]}return!0}findAncestor(t){for(let u of this.#e())if(t(u))return u}hasAncestor(t){for(let u of this.#e())if(t(u))return!0;return!1}*#e(){let{stack:t}=this;for(let u=t.length-3;u>=0;u-=2){let r=t[u];Array.isArray(r)||(yield r)}}},pr=standalone_Qt;function ko(e){return e!==null&&typeof e=="object"}var ge=ko;function standalone_ye(e){return(t,u,r)=>{let o=!!r?.backwards;if(u===!1)return!1;let{length:n}=t,a=u;for(;a>=0&&a<n;){let s=t.charAt(a);if(e instanceof RegExp){if(!e.test(s))return a}else if(!e.includes(s))return a;o?a--:a++}return a===-1||a===n?a:!1}}var Fr=standalone_ye(/\s/u),Y=standalone_ye(" 	"),nt=standalone_ye(",; 	"),ot=standalone_ye(/[^\n\r]/u);var standalone_mr=e=>e===`
`||e==="\r"||e==="\u2028"||e==="\u2029";function vo(e,t,u){let r=!!u?.backwards;if(t===!1)return!1;let o=e.charAt(t);if(r){if(e.charAt(t-1)==="\r"&&o===`
`)return t-2;if(standalone_mr(o))return t-1}else{if(o==="\r"&&e.charAt(t+1)===`
`)return t+2;if(standalone_mr(o))return t+1}return t}var K=vo;function Ro(e,t,u={}){let r=Y(e,u.backwards?t-1:t,u),o=K(e,r,u);return r!==o}var standalone_z=Ro;function Lo(e){return Array.isArray(e)&&e.length>0}var Er=Lo;function*standalone_be(e,t){let{getVisitorKeys:u,filter:r=()=>!0}=t,o=n=>ge(n)&&r(n);for(let n of u(e)){let a=e[n];if(Array.isArray(a))for(let s of a)o(s)&&(yield s);else o(a)&&(yield a)}}function*Cr(e,t){let u=[e];for(let r=0;r<u.length;r++){let o=u[r];for(let n of standalone_be(o,t))yield n,u.push(n)}}function hr(e,t){return standalone_be(e,t).next().done}function gr(e,t,u){let{cache:r}=u;if(r.has(e))return r.get(e);let{filter:o}=u;if(!o)return[];let n,a=(u.getChildren?.(e,u)??[...standalone_be(e,{getVisitorKeys:u.getVisitorKeys})]).flatMap(D=>(n??(n=[e,...t]),o(D,n)?[D]:gr(D,n,u))),{locStart:s,locEnd:i}=u;return a.sort((D,f)=>s(D)-s(f)||i(D)-i(f)),r.set(e,a),a}var at=gr;function Mo(e){let t=e.type||e.kind||"(unknown type)",u=String(e.name||e.id&&(typeof e.id=="object"?e.id.name:e.id)||e.key&&(typeof e.key=="object"?e.key.name:e.key)||e.value&&(typeof e.value=="object"?"":String(e.value))||e.operator||"");return u.length>20&&(u=u.slice(0,19)+"\u2026"),t+(u?" "+u:"")}function Zt(e,t){(e.comments??(e.comments=[])).push(t),t.printed=!1,t.nodeDescription=Mo(e)}function standalone_fe(e,t){t.leading=!0,t.trailing=!1,Zt(e,t)}function standalone_ue(e,t,u){t.leading=!1,t.trailing=!1,u&&(t.marker=u),Zt(e,t)}function le(e,t){t.leading=!1,t.trailing=!0,Zt(e,t)}var standalone_uu=new WeakMap;function br(e,t,u,r,o=[]){let{locStart:n,locEnd:a}=u,s=n(t),i=a(t),D=at(e,o,{cache:standalone_uu,locStart:n,locEnd:a,getVisitorKeys:u.getVisitorKeys,filter:u.printer.canAttachComment,getChildren:u.printer.getCommentChildNodes}),f,l,d=0,c=D.length;for(;d<c;){let p=d+c>>1,F=D[p],C=n(F),y=a(F);if(C<=s&&i<=y)return br(F,t,u,F,[F,...o]);if(y<=s){f=F,d=p+1;continue}if(i<=C){l=F,c=p;continue}throw new Error("Comment location overlaps with node location")}if(r?.type==="TemplateLiteral"){let{quasis:p}=r,F=tu(p,t,u);f&&tu(p,f,u)!==F&&(f=null),l&&tu(p,l,u)!==F&&(l=null)}return{enclosingNode:r,precedingNode:f,followingNode:l}}var eu=()=>!1;function Ar(e,t){let{comments:u}=e;if(delete e.comments,!Er(u)||!t.printer.canAttachComment)return;let r=[],{printer:{features:{experimental_avoidAstMutation:o},handleComments:n={}},originalText:a}=t,{ownLine:s=eu,endOfLine:i=eu,remaining:D=eu}=n,f=u.map((l,d)=>({...br(e,l,t),comment:l,text:a,options:t,ast:e,isLastComment:u.length-1===d}));for(let[l,d]of f.entries()){let{comment:c,precedingNode:p,enclosingNode:F,followingNode:C,text:y,options:m,ast:h,isLastComment:E}=d,g;if(o?g=[d]:(c.enclosingNode=F,c.precedingNode=p,c.followingNode=C,g=[c,y,m,h,E]),standalone_Yo(y,m,f,l))c.placement="ownLine",s(...g)||(C?standalone_fe(C,c):p?le(p,c):F?standalone_ue(F,c):standalone_ue(h,c));else if(standalone_jo(y,m,f,l))c.placement="endOfLine",i(...g)||(p?le(p,c):C?standalone_fe(C,c):F?standalone_ue(F,c):standalone_ue(h,c));else if(c.placement="remaining",!D(...g))if(p&&C){let A=r.length;A>0&&r[A-1].followingNode!==C&&yr(r,m),r.push(d)}else p?le(p,c):C?standalone_fe(C,c):F?standalone_ue(F,c):standalone_ue(h,c)}if(yr(r,t),!o)for(let l of u)delete l.precedingNode,delete l.enclosingNode,delete l.followingNode}var standalone_r=e=>!/[\S\n\u2028\u2029]/u.test(e);function standalone_Yo(e,t,u,r){let{comment:o,precedingNode:n}=u[r],{locStart:a,locEnd:s}=t,i=a(o);if(n)for(let D=r-1;D>=0;D--){let{comment:f,precedingNode:l}=u[D];if(l!==n||!standalone_r(e.slice(s(f),i)))break;i=a(f)}return standalone_z(e,i,{backwards:!0})}function standalone_jo(e,t,u,r){let{comment:o,followingNode:n}=u[r],{locStart:a,locEnd:s}=t,i=s(o);if(n)for(let D=r+1;D<u.length;D++){let{comment:f,followingNode:l}=u[D];if(l!==n||!standalone_r(e.slice(i,a(f))))break;i=s(f)}return standalone_z(e,i)}function yr(e,t){let u=e.length;if(u===0)return;let{precedingNode:r,followingNode:o}=e[0],n=t.locStart(o),a;for(a=u;a>0;--a){let{comment:s,precedingNode:i,followingNode:D}=e[a-1];P(i,r),P(D,o);let f=t.originalText.slice(t.locEnd(s),n);if(t.printer.isGap?.(f,t)??/^[\s(]*$/u.test(f))n=t.locStart(s);else break}for(let[s,{comment:i}]of e.entries())s<a?le(r,i):standalone_fe(o,i);for(let s of[r,o])s.comments&&s.comments.length>1&&s.comments.sort((i,D)=>t.locStart(i)-t.locStart(D));e.length=0}function tu(e,t,u){let r=u.locStart(t)-1;for(let o=1;o<e.length;++o)if(r<u.locStart(e[o]))return o-1;return 0}function Uo(e,t){let u=t-1;u=Y(e,u,{backwards:!0}),u=K(e,u,{backwards:!0}),u=Y(e,u,{backwards:!0});let r=K(e,u,{backwards:!0});return u!==r}var standalone_Le=Uo;function xr(e,t){let u=e.node;return u.printed=!0,t.printer.printComment(e,t)}function Wo(e,t){let u=e.node,r=[xr(e,t)],{printer:o,originalText:n,locStart:a,locEnd:s}=t;if(o.isBlockComment?.(u)){let f=standalone_z(n,s(u))?standalone_z(n,a(u),{backwards:!0})?standalone_V:ut:" ";r.push(f)}else r.push(standalone_V);let D=K(n,Y(n,s(u)));return D!==!1&&standalone_z(n,D)&&r.push(standalone_V),r}function $o(e,t,u){let r=e.node,o=xr(e,t),{printer:n,originalText:a,locStart:s}=t,i=n.isBlockComment?.(r);if(u?.hasLineSuffix&&!u?.isBlock||standalone_z(a,s(r),{backwards:!0})){let D=standalone_Le(a,s(r));return{doc:ve([standalone_V,D?standalone_V:"",o]),isBlock:i,hasLineSuffix:!0}}return!i||u?.hasLineSuffix?{doc:[ve([" ",o]),ce],isBlock:i,hasLineSuffix:!0}:{doc:[" ",o],isBlock:i,hasLineSuffix:!1}}function Vo(e,t){let u=e.node;if(!u)return{};let r=t[Symbol.for("printedComments")];if((u.comments||[]).filter(i=>!r.has(i)).length===0)return{leading:"",trailing:""};let n=[],a=[],s;return e.each(()=>{let i=e.node;if(r?.has(i))return;let{leading:D,trailing:f}=i;D?n.push(Wo(e,t)):f&&(s=$o(e,t,s),a.push(s.doc))},"comments"),{leading:n,trailing:a}}function standalone_Br(e,t,u){let{leading:r,trailing:o}=Vo(e,u);return!r&&!o?t:Ee(t,n=>[r,n,o])}function standalone_Tr(e){let{[Symbol.for("comments")]:t,[Symbol.for("printedComments")]:u}=e;for(let r of t){if(!r.printed&&!u.has(r))throw new Error('Comment "'+r.value.trim()+'" was not printed. Please report this error!');delete r.printed}}var standalone_Nr=()=>P;var standalone_Me=class extends Error{name="ConfigError"},standalone_Ye=class extends Error{name="UndefinedParserError"};var standalone_Sr={checkIgnorePragma:{category:"Special",type:"boolean",default:!1,description:"Check whether the file's first docblock comment contains '@noprettier' or '@noformat' to determine if it should be formatted.",cliCategory:"Other"},cursorOffset:{category:"Special",type:"int",default:-1,range:{start:-1,end:1/0,step:1},description:"Print (to stderr) where a cursor at the given position would move to after formatting.",cliCategory:"Editor"},endOfLine:{category:"Global",type:"choice",default:"lf",description:"Which end of line characters to apply.",choices:[{value:"lf",description:"Line Feed only (\\n), common on Linux and macOS as well as inside git repos"},{value:"crlf",description:"Carriage Return + Line Feed characters (\\r\\n), common on Windows"},{value:"cr",description:"Carriage Return character only (\\r), used very rarely"},{value:"auto",description:`Maintain existing
(mixed values within one file are normalised by looking at what's used after the first line)`}]},filepath:{category:"Special",type:"path",description:"Specify the input filepath. This will be used to do parser inference.",cliName:"stdin-filepath",cliCategory:"Other",cliDescription:"Path to the file to pretend that stdin comes from."},insertPragma:{category:"Special",type:"boolean",default:!1,description:"Insert @format pragma into file's first docblock comment.",cliCategory:"Other"},parser:{category:"Global",type:"choice",default:void 0,description:"Which parser to use.",exception:e=>typeof e=="string"||typeof e=="function",choices:[{value:"flow",description:"Flow"},{value:"babel",description:"JavaScript"},{value:"babel-flow",description:"Flow"},{value:"babel-ts",description:"TypeScript"},{value:"typescript",description:"TypeScript"},{value:"acorn",description:"JavaScript"},{value:"espree",description:"JavaScript"},{value:"meriyah",description:"JavaScript"},{value:"css",description:"CSS"},{value:"less",description:"Less"},{value:"scss",description:"SCSS"},{value:"json",description:"JSON"},{value:"json5",description:"JSON5"},{value:"jsonc",description:"JSON with Comments"},{value:"json-stringify",description:"JSON.stringify"},{value:"graphql",description:"GraphQL"},{value:"markdown",description:"Markdown"},{value:"mdx",description:"MDX"},{value:"vue",description:"Vue"},{value:"yaml",description:"YAML"},{value:"glimmer",description:"Ember / Handlebars"},{value:"html",description:"HTML"},{value:"angular",description:"Angular"},{value:"lwc",description:"Lightning Web Components"},{value:"mjml",description:"MJML"}]},plugins:{type:"path",array:!0,default:[{value:[]}],category:"Global",description:"Add a plugin. Multiple plugins can be passed as separate `--plugin`s.",exception:e=>typeof e=="string"||typeof e=="object",cliName:"plugin",cliCategory:"Config"},printWidth:{category:"Global",type:"int",default:80,description:"The line length where Prettier will try wrap.",range:{start:0,end:1/0,step:1}},rangeEnd:{category:"Special",type:"int",default:1/0,range:{start:0,end:1/0,step:1},description:`Format code ending at a given character offset (exclusive).
The range will extend forwards to the end of the selected statement.`,cliCategory:"Editor"},rangeStart:{category:"Special",type:"int",default:0,range:{start:0,end:1/0,step:1},description:`Format code starting at a given character offset.
The range will extend backwards to the start of the first line containing the selected statement.`,cliCategory:"Editor"},requirePragma:{category:"Special",type:"boolean",default:!1,description:"Require either '@prettier' or '@format' to be present in the file's first docblock comment in order for it to be formatted.",cliCategory:"Other"},tabWidth:{type:"int",category:"Global",default:2,description:"Number of spaces per indentation level.",range:{start:0,end:1/0,step:1}},useTabs:{category:"Global",type:"boolean",default:!1,description:"Indent with tabs instead of spaces."},embeddedLanguageFormatting:{category:"Global",type:"choice",default:"auto",description:"Control how Prettier formats quoted code embedded in the file.",choices:[{value:"auto",description:"Format embedded code if Prettier can automatically identify it."},{value:"off",description:"Never automatically format embedded code."}]}};function it({plugins:e=[],showDeprecated:t=!1}={}){let u=e.flatMap(o=>o.languages??[]),r=[];for(let o of Go(Object.assign({},...e.map(({options:n})=>n),standalone_Sr)))!t&&o.deprecated||(Array.isArray(o.choices)&&(t||(o.choices=o.choices.filter(n=>!n.deprecated)),o.name==="parser"&&(o.choices=[...o.choices,...Ko(o.choices,u,e)])),o.pluginDefaults=Object.fromEntries(e.filter(n=>n.defaultOptions?.[o.name]!==void 0).map(n=>[n.name,n.defaultOptions[o.name]])),r.push(o));return{languages:u,options:r}}function*Ko(e,t,u){let r=new Set(e.map(o=>o.value));for(let o of t)if(o.parsers){for(let n of o.parsers)if(!r.has(n)){r.add(n);let a=u.find(i=>i.parsers&&Object.prototype.hasOwnProperty.call(i.parsers,n)),s=o.name;a?.name&&(s+=` (plugin: ${a.name})`),yield{value:n,description:s}}}}function Go(e){let t=[];for(let[u,r]of Object.entries(e)){let o={name:u,...r};Array.isArray(o.default)&&(o.default=b(0,o.default,-1).value),t.push(o)}return t}var standalone_zo=Array.prototype.toReversed??function(){return[...this].reverse()},standalone_Jo=standalone_X("toReversed",function(){if(Array.isArray(this))return standalone_zo}),wr=standalone_Jo;function Ho(){let e=globalThis,t=e.Deno?.build?.os;return typeof t=="string"?t==="windows":e.navigator?.platform?.startsWith("Win")??e.process?.platform?.startsWith("win")??!1}var Xo=Ho();function standalone_Or(e){if(e=e instanceof URL?e:new URL(e),e.protocol!=="file:")throw new TypeError(`URL must be a file URL: received "${e.protocol}"`);return e}function qo(e){return e=standalone_Or(e),decodeURIComponent(e.pathname.replace(/%(?![0-9A-Fa-f]{2})/g,"%25"))}function Qo(e){e=standalone_Or(e);let t=decodeURIComponent(e.pathname.replace(/\//g,"\\").replace(/%(?![0-9A-Fa-f]{2})/g,"%25")).replace(/^\\*([A-Za-z]:)(\\|$)/,"$1\\");return e.hostname!==""&&(t=`\\\\${e.hostname}${t}`),t}function ru(e){return Xo?Qo(e):qo(e)}var standalone_Pr=e=>String(e).split(/[/\\]/u).pop(),standalone_Ir=e=>String(e).startsWith("file:");function kr(e,t){if(!t)return;let u=standalone_Pr(t).toLowerCase();return e.find(({filenames:r})=>r?.some(o=>o.toLowerCase()===u))??e.find(({extensions:r})=>r?.some(o=>u.endsWith(o)))}function Zo(e,t){if(t)return e.find(({name:u})=>u.toLowerCase()===t)??e.find(({aliases:u})=>u?.includes(t))??e.find(({extensions:u})=>u?.includes(`.${t}`))}var standalone_ea=void 0;function vr(e,t){if(t){if(standalone_Ir(t))try{t=ru(t)}catch{return}if(typeof t=="string")return e.find(({isSupported:u})=>u?.({filepath:t}))}}function ta(e,t){let u=wr(0,e.plugins).flatMap(o=>o.languages??[]);return(Zo(u,t.language)??kr(u,t.physicalFile)??kr(u,t.file)??vr(u,t.physicalFile)??vr(u,t.file)??standalone_ea?.(u,t.physicalFile))?.parsers[0]}var st=ta;var ie={key:e=>/^[$_a-zA-Z][$_a-zA-Z0-9]*$/.test(e)?e:JSON.stringify(e),value(e){if(e===null||typeof e!="object")return JSON.stringify(e);if(Array.isArray(e))return`[${e.map(u=>ie.value(u)).join(", ")}]`;let t=Object.keys(e);return t.length===0?"{}":`{ ${t.map(u=>`${ie.key(u)}: ${ie.value(e[u])}`).join(", ")} }`},pair:({key:e,value:t})=>ie.value({[e]:t})};var nu=new Proxy(String,{get:()=>nu}),standalone_$=nu,ou=()=>nu;var standalone_Rr=(e,t,{descriptor:u})=>{let r=[`${standalone_$.yellow(typeof e=="string"?u.key(e):u.pair(e))} is deprecated`];return t&&r.push(`we now treat it as ${standalone_$.blue(typeof t=="string"?u.key(t):u.pair(t))}`),r.join("; ")+"."};var Dt=Symbol.for("vnopts.VALUE_NOT_EXIST"),Ae=Symbol.for("vnopts.VALUE_UNCHANGED");var standalone_Lr=" ".repeat(2),standalone_Yr=(e,t,u)=>{let{text:r,list:o}=u.normalizeExpectedResult(u.schemas[e].expected(u)),n=[];return r&&n.push(standalone_Mr(e,t,r,u.descriptor)),o&&n.push([standalone_Mr(e,t,o.title,u.descriptor)].concat(o.values.map(a=>jr(a,u.loggerPrintWidth))).join(`
`)),standalone_Ur(n,u.loggerPrintWidth)};function standalone_Mr(e,t,u,r){return[`Invalid ${standalone_$.red(r.key(e))} value.`,`Expected ${standalone_$.blue(u)},`,`but received ${t===Dt?standalone_$.gray("nothing"):standalone_$.red(r.value(t))}.`].join(" ")}function jr({text:e,list:t},u){let r=[];return e&&r.push(`- ${standalone_$.blue(e)}`),t&&r.push([`- ${standalone_$.blue(t.title)}:`].concat(t.values.map(o=>jr(o,u-standalone_Lr.length).replace(/^|\n/g,`$&${standalone_Lr}`))).join(`
`)),standalone_Ur(r,u)}function standalone_Ur(e,t){if(e.length===1)return e[0];let[u,r]=e,[o,n]=e.map(a=>a.split(`
`,1)[0].length);return o>t&&o>n?r:u}var standalone_e=[],au=[];function ct(e,t,u){if(e===t)return 0;let r=u?.maxDistance,o=e;e.length>t.length&&(e=t,t=o);let n=e.length,a=t.length;for(;n>0&&e.charCodeAt(~-n)===t.charCodeAt(~-a);)n--,a--;let s=0;for(;s<n&&e.charCodeAt(s)===t.charCodeAt(s);)s++;if(n-=s,a-=s,r!==void 0&&a-n>r)return r;if(n===0)return r!==void 0&&a>r?r:a;let i,D,f,l,d=0,c=0;for(;d<n;)au[d]=e.charCodeAt(s+d),standalone_e[d]=++d;for(;c<a;){for(i=t.charCodeAt(s+c),f=c++,D=c,d=0;d<n;d++)l=i===au[d]?f:f+1,f=standalone_e[d],D=standalone_e[d]=f>D?l>D?D+1:l:l>f?f+1:l;if(r!==void 0){let p=D;for(d=0;d<n;d++)standalone_e[d]<p&&(p=standalone_e[d]);if(p>r)return r}}return standalone_e.length=n,au.length=n,r!==void 0&&D>r?r:D}function Wr(e,t,u){if(!Array.isArray(t)||t.length===0)return;let r=u?.maxDistance,o=e.length;for(let i of t)if(i===e)return i;if(r===0)return;let n,a=Number.POSITIVE_INFINITY,s=new Set;for(let i of t){if(s.has(i))continue;s.add(i);let D=Math.abs(i.length-o);if(D>=a||r!==void 0&&D>r)continue;let f=Number.isFinite(a)?r===void 0?a:Math.min(a,r):r,l=f===void 0?ct(e,i):ct(e,i,{maxDistance:f});if(r!==void 0&&l>r)continue;let d=l;if(f!==void 0&&l===f&&f===r&&(d=ct(e,i)),d<a&&(a=d,n=i,a===0))break}if(!(r!==void 0&&a>r))return n}var ft=(e,t,{descriptor:u,logger:r,schemas:o})=>{let n=[`Ignored unknown option ${standalone_$.yellow(u.pair({key:e,value:t}))}.`],a=Wr(e,Object.keys(o),{maxDistance:3});a&&n.push(`Did you mean ${standalone_$.blue(u.key(a))}?`),r.warn(n.join(" "))};var standalone_ua=["default","expected","validate","deprecated","forward","redirect","overlap","preprocess","postprocess"];function ra(e,t){let u=new e(t),r=Object.create(u);for(let o of standalone_ua)o in t&&(r[o]=standalone_na(t[o],u,S.prototype[o].length));return r}var S=class{static create(t){return ra(this,t)}constructor(t){this.name=t.name}default(t){}expected(t){return"nothing"}validate(t,u){return!1}deprecated(t,u){return!1}forward(t,u){}redirect(t,u){}overlap(t,u,r){return t}preprocess(t,u){return t}postprocess(t,u){return Ae}};function standalone_na(e,t,u){return typeof e=="function"?(...r)=>e(...r.slice(0,u-1),t,...r.slice(u-1)):()=>e}var lt=class extends S{constructor(t){super(t),this._sourceName=t.sourceName}expected(t){return t.schemas[this._sourceName].expected(t)}validate(t,u){return u.schemas[this._sourceName].validate(t,u)}redirect(t,u){return this._sourceName}};var dt=class extends S{expected(){return"anything"}validate(){return!0}};var pt=class extends S{constructor({valueSchema:t,name:u=t.name,...r}){super({...r,name:u}),this._valueSchema=t}expected(t){let{text:u,list:r}=t.normalizeExpectedResult(this._valueSchema.expected(t));return{text:u&&`an array of ${u}`,list:r&&{title:"an array of the following values",values:[{list:r}]}}}validate(t,u){if(!Array.isArray(t))return!1;let r=[];for(let o of t){let n=u.normalizeValidateResult(this._valueSchema.validate(o,u),o);n!==!0&&r.push(n.value)}return r.length===0?!0:{value:r}}deprecated(t,u){let r=[];for(let o of t){let n=u.normalizeDeprecatedResult(this._valueSchema.deprecated(o,u),o);n!==!1&&r.push(...n.map(({value:a})=>({value:[a]})))}return r}forward(t,u){let r=[];for(let o of t){let n=u.normalizeForwardResult(this._valueSchema.forward(o,u),o);r.push(...n.map($r))}return r}redirect(t,u){let r=[],o=[];for(let n of t){let a=u.normalizeRedirectResult(this._valueSchema.redirect(n,u),n);"remain"in a&&r.push(a.remain),o.push(...a.redirect.map($r))}return r.length===0?{redirect:o}:{redirect:o,remain:r}}overlap(t,u){return t.concat(u)}};function $r({from:e,to:t}){return{from:[e],to:t}}var standalone_Ft=class extends S{expected(){return"true or false"}validate(t){return typeof t=="boolean"}};function Kr(e,t){let u=Object.create(null);for(let r of e){let o=r[t];if(u[o])throw new Error(`Duplicate ${t} ${JSON.stringify(o)}`);u[o]=r}return u}function standalone_Gr(e,t){let u=new Map;for(let r of e){let o=r[t];if(u.has(o))throw new Error(`Duplicate ${t} ${JSON.stringify(o)}`);u.set(o,r)}return u}function standalone_zr(){let e=Object.create(null);return t=>{let u=JSON.stringify(t);return e[u]?!0:(e[u]=!0,!1)}}function Jr(e,t){let u=[],r=[];for(let o of e)t(o)?u.push(o):r.push(o);return[u,r]}function Hr(e){return e===Math.floor(e)}function Xr(e,t){if(e===t)return 0;let u=typeof e,r=typeof t,o=["undefined","object","boolean","number","string"];return u!==r?o.indexOf(u)-o.indexOf(r):u!=="string"?Number(e)-Number(t):e.localeCompare(t)}function standalone_qr(e){return(...t)=>{let u=e(...t);return typeof u=="string"?new Error(u):u}}function iu(e){return e===void 0?{}:e}function su(e){if(typeof e=="string")return{text:e};let{text:t,list:u}=e;return oa((t||u)!==void 0,"Unexpected `expected` result, there should be at least one field."),u?{text:t,list:{title:u.title,values:u.values.map(su)}}:{text:t}}function standalone_Du(e,t){return e===!0?!0:e===!1?{value:t}:e}function cu(e,t,u=!1){return e===!1?!1:e===!0?u?!0:[{value:t}]:"value"in e?[e]:e.length===0?!1:e}function Vr(e,t){return typeof e=="string"||"key"in e?{from:t,to:e}:"from"in e?{from:e.from,to:e.to}:{from:t,to:e.to}}function mt(e,t){return e===void 0?[]:Array.isArray(e)?e.map(u=>Vr(u,t)):[Vr(e,t)]}function fu(e,t){let u=mt(typeof e=="object"&&"redirect"in e?e.redirect:e,t);return u.length===0?{remain:t,redirect:u}:typeof e=="object"&&"remain"in e?{remain:e.remain,redirect:u}:{redirect:u}}function oa(e,t){if(!e)throw new Error(t)}var standalone_Et=class extends S{constructor(t){super(t),this._choices=standalone_Gr(t.choices.map(u=>u&&typeof u=="object"?u:{value:u}),"value")}expected({descriptor:t}){let u=Array.from(this._choices.keys()).map(a=>this._choices.get(a)).filter(({hidden:a})=>!a).map(a=>a.value).sort(Xr).map(t.value),r=u.slice(0,-2),o=u.slice(-2);return{text:r.concat(o.join(" or ")).join(", "),list:{title:"one of the following values",values:u}}}validate(t){return this._choices.has(t)}deprecated(t){let u=this._choices.get(t);return u&&u.deprecated?{value:t}:!1}forward(t){let u=this._choices.get(t);return u?u.forward:void 0}redirect(t){let u=this._choices.get(t);return u?u.redirect:void 0}};var standalone_Ct=class extends S{expected(){return"a number"}validate(t,u){return typeof t=="number"}};var ht=class extends standalone_Ct{expected(){return"an integer"}validate(t,u){return u.normalizeValidateResult(super.validate(t,u),t)===!0&&Hr(t)}};var je=class extends S{expected(){return"a string"}validate(t){return typeof t=="string"}};var Qr=ie,standalone_Zr=ft,en=standalone_Yr,tn=standalone_Rr;var standalone_gt=class{constructor(t,u){let{logger:r=console,loggerPrintWidth:o=80,descriptor:n=Qr,unknown:a=standalone_Zr,invalid:s=en,deprecated:i=tn,missing:D=()=>!1,required:f=()=>!1,preprocess:l=c=>c,postprocess:d=()=>Ae}=u||{};this._utils={descriptor:n,logger:r||{warn:()=>{}},loggerPrintWidth:o,schemas:Kr(t,"name"),normalizeDefaultResult:iu,normalizeExpectedResult:su,normalizeDeprecatedResult:cu,normalizeForwardResult:mt,normalizeRedirectResult:fu,normalizeValidateResult:standalone_Du},this._unknownHandler=a,this._invalidHandler=standalone_qr(s),this._deprecatedHandler=i,this._identifyMissing=(c,p)=>!(c in p)||D(c,p),this._identifyRequired=f,this._preprocess=l,this._postprocess=d,this.cleanHistory()}cleanHistory(){this._hasDeprecationWarned=standalone_zr()}normalize(t){let u={},o=[this._preprocess(t,this._utils)],n=()=>{for(;o.length!==0;){let a=o.shift(),s=this._applyNormalization(a,u);o.push(...s)}};n();for(let a of Object.keys(this._utils.schemas)){let s=this._utils.schemas[a];if(!(a in u)){let i=iu(s.default(this._utils));"value"in i&&o.push({[a]:i.value})}}n();for(let a of Object.keys(this._utils.schemas)){if(!(a in u))continue;let s=this._utils.schemas[a],i=u[a],D=s.postprocess(i,this._utils);D!==Ae&&(this._applyValidation(D,a,s),u[a]=D)}return this._applyPostprocess(u),this._applyRequiredCheck(u),u}_applyNormalization(t,u){let r=[],{knownKeys:o,unknownKeys:n}=this._partitionOptionKeys(t);for(let a of o){let s=this._utils.schemas[a],i=s.preprocess(t[a],this._utils);this._applyValidation(i,a,s);let D=({from:c,to:p})=>{r.push(typeof p=="string"?{[p]:c}:{[p.key]:p.value})},f=({value:c,redirectTo:p})=>{let F=cu(s.deprecated(c,this._utils),i,!0);if(F!==!1)if(F===!0)this._hasDeprecationWarned(a)||this._utils.logger.warn(this._deprecatedHandler(a,p,this._utils));else for(let{value:C}of F){let y={key:a,value:C};if(!this._hasDeprecationWarned(y)){let m=typeof p=="string"?{key:p,value:C}:p;this._utils.logger.warn(this._deprecatedHandler(y,m,this._utils))}}};mt(s.forward(i,this._utils),i).forEach(D);let d=fu(s.redirect(i,this._utils),i);if(d.redirect.forEach(D),"remain"in d){let c=d.remain;u[a]=a in u?s.overlap(u[a],c,this._utils):c,f({value:c})}for(let{from:c,to:p}of d.redirect)f({value:c,redirectTo:p})}for(let a of n){let s=t[a];this._applyUnknownHandler(a,s,u,(i,D)=>{r.push({[i]:D})})}return r}_applyRequiredCheck(t){for(let u of Object.keys(this._utils.schemas))if(this._identifyMissing(u,t)&&this._identifyRequired(u))throw this._invalidHandler(u,Dt,this._utils)}_partitionOptionKeys(t){let[u,r]=Jr(Object.keys(t).filter(o=>!this._identifyMissing(o,t)),o=>o in this._utils.schemas);return{knownKeys:u,unknownKeys:r}}_applyValidation(t,u,r){let o=standalone_Du(r.validate(t,this._utils),t);if(o!==!0)throw this._invalidHandler(u,o.value,this._utils)}_applyUnknownHandler(t,u,r,o){let n=this._unknownHandler(t,u,this._utils);if(n)for(let a of Object.keys(n)){if(this._identifyMissing(a,n))continue;let s=n[a];a in this._utils.schemas?o(a,s):r[a]=s}}_applyPostprocess(t){let u=this._postprocess(t,this._utils);if(u!==Ae){if(u.delete)for(let r of u.delete)delete t[r];if(u.override){let{knownKeys:r,unknownKeys:o}=this._partitionOptionKeys(u.override);for(let n of r){let a=u.override[n];this._applyValidation(a,n,this._utils.schemas[n]),t[n]=a}for(let n of o){let a=u.override[n];this._applyUnknownHandler(n,a,t,(s,i)=>{let D=this._utils.schemas[s];this._applyValidation(i,s,D),t[s]=i})}}}}};var standalone_lu;function ia(e,t,{logger:u=!1,isCLI:r=!1,passThrough:o=!1,FlagSchema:n,descriptor:a}={}){if(r){if(!n)throw new Error("'FlagSchema' option is required.");if(!a)throw new Error("'descriptor' option is required.")}else a=ie;let s=o?Array.isArray(o)?(d,c)=>o.includes(d)?{[d]:c}:void 0:(d,c)=>({[d]:c}):(d,c,p)=>{let{_:F,...C}=p.schemas;return ft(d,c,{...p,schemas:C})},i=standalone_sa(t,{isCLI:r,FlagSchema:n}),D=new standalone_gt(i,{logger:u,unknown:s,descriptor:a}),f=u!==!1;f&&standalone_lu&&(D._hasDeprecationWarned=standalone_lu);let l=D.normalize(e);return f&&(standalone_lu=D._hasDeprecationWarned),l}function standalone_sa(e,{isCLI:t,FlagSchema:u}){let r=[];t&&r.push(dt.create({name:"_"}));for(let o of e)r.push(Da(o,{isCLI:t,optionInfos:e,FlagSchema:u})),o.alias&&t&&r.push(lt.create({name:o.alias,sourceName:o.name}));return r}function Da(e,{isCLI:t,optionInfos:u,FlagSchema:r}){let{name:o}=e,n={name:o},a,s={};switch(e.type){case"int":a=ht,t&&(n.preprocess=Number);break;case"string":a=je;break;case"choice":a=standalone_Et,n.choices=e.choices.map(i=>i?.redirect?{...i,redirect:{to:{key:e.name,value:i.redirect}}}:i);break;case"boolean":a=standalone_Ft;break;case"flag":a=r,n.flags=u.flatMap(i=>[i.alias,i.description&&i.name,i.oppositeDescription&&`no-${i.name}`].filter(Boolean));break;case"path":a=je;break;default:throw new Error(`Unexpected type ${e.type}`)}if(e.exception?n.validate=(i,D,f)=>e.exception(i)||D.validate(i,f):n.validate=(i,D,f)=>i===void 0||D.validate(i,f),e.redirect&&(s.redirect=i=>i?{to:typeof e.redirect=="string"?e.redirect:{key:e.redirect.option,value:e.redirect.value}}:void 0),e.deprecated&&(s.deprecated=!0),t&&!e.array){let i=n.preprocess||(D=>D);n.preprocess=(D,f,l)=>f.preprocess(i(Array.isArray(D)?b(0,D,-1):D),l)}return e.array?pt.create({...t?{preprocess:i=>Array.isArray(i)?i:[i]}:{},...s,valueSchema:a.create(n)}):a.create({...n,...s})}var un=ia;var ca=Array.prototype.findLast??function(e){for(let t=this.length-1;t>=0;t--){let u=this[t];if(e(u,t,this))return u}},standalone_fa=standalone_X("findLast",function(){if(Array.isArray(this))return ca}),du=standalone_fa;var rn=Symbol.for("PRETTIER_IS_FRONT_MATTER"),pu=[];function la(e){return!!e?.[rn]}var standalone_de=la;var standalone_nn=new Set(["yaml","toml"]),standalone_Ue=({node:e})=>standalone_de(e)&&standalone_nn.has(e.language);async function standalone_Fu(e,t,u,r){let{node:o}=u,{language:n}=o;if(!standalone_nn.has(n))return;let a=o.value.trim(),s;if(a){let i=n==="yaml"?n:st(r,{language:n});if(!i)return;s=a?await e(a,{parser:i}):""}else s=a;return et([o.startDelimiter,o.explicitLanguage??"",standalone_V,s,s?standalone_V:"",o.endDelimiter])}function da(e,t){return standalone_Ue({node:e})&&(delete t.end,delete t.raw,delete t.value),t}var mu=da;function standalone_pa({node:e}){return e.raw}var standalone_Eu=standalone_pa;var on=new Set(["tokens","comments","parent","enclosingNode","precedingNode","followingNode"]),standalone_Fa=e=>Object.keys(e).filter(t=>!on.has(t));function ma(e,t){let u=e?r=>e(r,on):standalone_Fa;return t?new Proxy(u,{apply:(r,o,n)=>standalone_de(n[0])?pu:Reflect.apply(r,o,n)}):u}var Cu=ma;function gu(e,t){if(!t)throw new Error("parserName is required.");let u=du(0,e,o=>o.parsers&&Object.prototype.hasOwnProperty.call(o.parsers,t));if(u)return u;let r=`Couldn't resolve parser "${t}".`;throw r+=" Plugins must be explicitly added to the standalone bundle.",new standalone_Me(r)}function an(e,t){if(!t)throw new Error("astFormat is required.");let u=du(0,e,o=>o.printers&&Object.prototype.hasOwnProperty.call(o.printers,t));if(u)return u;let r=`Couldn't find plugin for AST format "${t}".`;throw r+=" Plugins must be explicitly added to the standalone bundle.",new standalone_Me(r)}function standalone_We({plugins:e,parser:t}){let u=gu(e,t);return standalone_yu(u,t)}function standalone_yu(e,t){let u=e.parsers[t];return typeof u=="function"?u():u}async function sn(e,t){let u=e.printers[t],r=typeof u=="function"?await u():u;return standalone_Ea(r)}var standalone_hu=new WeakMap,q0=Symbol("PRINTER_NORMALIZED_MARK");function standalone_Ea(e){if(standalone_hu.has(e))return standalone_hu.get(e);let{features:t,getVisitorKeys:u,embed:r,massageAstNode:o,print:n,...a}=e;t=ya(t);let s=t.experimental_frontMatterSupport;u=Cu(u,s.massageAstNode||s.embed||s.print);let i=o;o&&s.massageAstNode&&(i=new Proxy(o,{apply(d,c,p){return mu(...p),Reflect.apply(d,c,p)}}));let D=r;if(r){let d;D=new Proxy(r,{get(c,p,F){return p==="getVisitorKeys"?(d??(d=r.getVisitorKeys?Cu(r.getVisitorKeys,s.massageAstNode||s.embed):u),d):Reflect.get(c,p,F)},apply:(c,p,F)=>s.embed&&standalone_Ue(...F)?standalone_Fu:Reflect.apply(c,p,F)})}let f=n;s.print&&(f=new Proxy(n,{apply(d,c,p){let[F]=p;return standalone_de(F.node)?standalone_Eu(F):Reflect.apply(d,c,p)}}));let l={features:t,getVisitorKeys:u,embed:D,massageAstNode:i,print:f,...a};return standalone_hu.set(e,l),l}var Ca=["clean","embed","print"],ha=Object.fromEntries(Ca.map(e=>[e,!1]));function ga(e){return{...ha,...e}}function ya(e){return{experimental_avoidAstMutation:!1,...e,experimental_frontMatterSupport:ga(e?.experimental_frontMatterSupport)}}var Dn={astFormat:"estree",printer:{},originalText:void 0,locStart:null,locEnd:null,getVisitorKeys:null};async function ba(e,t={}){let u={...e};if(!u.parser)if(u.filepath){if(u.parser=st(u,{physicalFile:u.filepath}),!u.parser)throw new standalone_Ye(`No parser could be inferred for file "${u.filepath}".`)}else throw new standalone_Ye("No parser and no file path given, couldn't infer a parser.");let r=it({plugins:e.plugins,showDeprecated:!0}).options,o={...Dn,...Object.fromEntries(r.filter(l=>l.default!==void 0).map(l=>[l.name,l.default]))},n=gu(u.plugins,u.parser),a=await standalone_yu(n,u.parser);u.astFormat=a.astFormat,u.locEnd=a.locEnd,u.locStart=a.locStart;let s=n.printers?.[a.astFormat]?n:an(u.plugins,a.astFormat),i=await sn(s,a.astFormat);u.printer=i,u.getVisitorKeys=i.getVisitorKeys;let D=s.defaultOptions?Object.fromEntries(Object.entries(s.defaultOptions).filter(([,l])=>l!==void 0)):{},f={...o,...D};for(let[l,d]of Object.entries(f))(u[l]===null||u[l]===void 0)&&(u[l]=d);return u.parser==="json"&&(u.trailingComma="none"),un(u,r,{passThrough:Object.keys(Dn),...t})}var standalone_se=ba;var standalone_pf=ao(dn(),1);var Au="\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u0870-\u0887\u0889-\u088F\u08A0-\u08C9\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C5C\u0C5D\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDC-\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u1711\u171F-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1878\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4C\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C8A\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7DC\uA7F1-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC",pn="\xB7\u0300-\u036F\u0387\u0483-\u0487\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u0669\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u06F0-\u06F9\u0711\u0730-\u074A\u07A6-\u07B0\u07C0-\u07C9\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u0897-\u089F\u08CA-\u08E1\u08E3-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0966-\u096F\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u09E6-\u09EF\u09FE\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A66-\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0AE6-\u0AEF\u0AFA-\u0AFF\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B55-\u0B57\u0B62\u0B63\u0B66-\u0B6F\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0BE6-\u0BEF\u0C00-\u0C04\u0C3C\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0CE6-\u0CEF\u0CF3\u0D00-\u0D03\u0D3B\u0D3C\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D66-\u0D6F\u0D81-\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0E50-\u0E59\u0EB1\u0EB4-\u0EBC\u0EC8-\u0ECE\u0ED0-\u0ED9\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1040-\u1049\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F-\u109D\u135D-\u135F\u1369-\u1371\u1712-\u1715\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u17E0-\u17E9\u180B-\u180D\u180F-\u1819\u18A9\u1920-\u192B\u1930-\u193B\u1946-\u194F\u19D0-\u19DA\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AB0-\u1ABD\u1ABF-\u1ADD\u1AE0-\u1AEB\u1B00-\u1B04\u1B34-\u1B44\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BB0-\u1BB9\u1BE6-\u1BF3\u1C24-\u1C37\u1C40-\u1C49\u1C50-\u1C59\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF4\u1CF7-\u1CF9\u1DC0-\u1DFF\u200C\u200D\u203F\u2040\u2054\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\u30FB\uA620-\uA629\uA66F\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA82C\uA880\uA881\uA8B4-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F1\uA8FF-\uA909\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9D0-\uA9D9\uA9E5\uA9F0-\uA9F9\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA50-\uAA59\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uABF0-\uABF9\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFF10-\uFF19\uFF3F\uFF65",standalone_af=new RegExp("["+Au+"]"),standalone_sf=new RegExp("["+Au+pn+"]");Au=pn=null;var _u={keyword:["break","case","catch","continue","debugger","default","do","else","finally","for","function","if","return","switch","throw","try","var","const","while","with","new","this","super","class","extends","export","import","null","true","false","in","instanceof","typeof","void","delete"],strict:["implements","interface","let","package","private","protected","public","static","yield"],strictBind:["eval","arguments"]},standalone_Df=new Set(_u.keyword),standalone_cf=new Set(_u.strict),standalone_ff=new Set(_u.strictBind);var standalone_It=(e,t)=>u=>e(t(u));function mn(e){return{keyword:e.cyan,capitalized:e.yellow,jsxIdentifier:e.yellow,punctuator:e.yellow,number:e.magenta,string:e.green,regex:e.magenta,comment:e.gray,invalid:standalone_It(standalone_It(e.white,e.bgRed),e.bold),gutter:e.gray,marker:standalone_It(e.red,e.bold),message:standalone_It(e.red,e.bold),reset:e.reset}}var standalone_hf=mn(ou(!0)),standalone_gf=mn(ou(!1));function _a(){return new Proxy({},{get:()=>e=>e})}var Fn=/\r\n|[\n\r\u2028\u2029]/;function standalone_xa(e,t,u){let r=Object.assign({column:0,line:-1},e.start),o=Object.assign({},r,e.end),{linesAbove:n=2,linesBelow:a=3}=u||{},s=r.line,i=r.column,D=o.line,f=o.column,l=Math.max(s-(n+1),0),d=Math.min(t.length,D+a);s===-1&&(l=0),D===-1&&(d=t.length);let c=D-s,p={};if(c)for(let F=0;F<=c;F++){let C=F+s;if(!i)p[C]=!0;else if(F===0){let y=t[C-1].length;p[C]=[i,y-i+1]}else if(F===c)p[C]=[0,f];else{let y=t[C-F].length;p[C]=[0,y]}}else i===f?i?p[s]=[i,0]:p[s]=!0:p[s]=[i,f-i];return{start:l,end:d,markerLines:p}}function En(e,t,u={}){let o=_a(!1),n=e.split(Fn),{start:a,end:s,markerLines:i}=standalone_xa(t,n,u),D=t.start&&typeof t.start.column=="number",f=String(s).length,d=e.split(Fn,s).slice(a,s).map((c,p)=>{let F=a+1+p,y=` ${` ${F}`.slice(-f)} |`,m=i[F],h=!i[F+1];if(m){let E="";if(Array.isArray(m)){let g=c.slice(0,Math.max(m[0]-1,0)).replace(/[^\t]/g," "),A=m[1]||1;E=[`
 `,o.gutter(y.replace(/\d/g," "))," ",g,o.marker("^").repeat(A)].join(""),h&&u.message&&(E+=" "+o.message(u.message))}return[o.marker(">"),o.gutter(y),c.length>0?` ${c}`:"",E].join("")}else return` ${o.gutter(y)}${c.length>0?` ${c}`:""}`}).join(`
`);return u.message&&!D&&(d=`${" ".repeat(f+1)}${u.message}
${d}`),d}async function Ba(e,t){let u=await standalone_We(t),r=u.preprocess?await u.preprocess(e,t):e;t.originalText=r;let o;try{o=await u.parse(r,t,t)}catch(n){Ta(n,e)}return{text:r,ast:o}}function Ta(e,t){let{loc:u}=e;if(u){let r=En(t,u,{highlightCode:!0});throw e.message+=`
`+r,e.codeFrame=r,e}throw e}var standalone_Fe=Ba;async function Cn(e,t,u,r,o){if(u.embeddedLanguageFormatting!=="auto")return;let{printer:n}=u,{embed:a}=n;if(!a)return;if(a.length>2)throw new Error("printer.embed has too many parameters. The API changed in Prettier v3. Please update your plugin. See https://prettier.io/docs/plugins#optional-embed");let{hasPrettierIgnore:s}=n,{getVisitorKeys:i}=a,D=[];d();let f=e.stack;for(let{print:c,node:p,pathStack:F}of D)try{e.stack=F;let C=await c(l,t,e,u);C&&o.set(p,C)}catch(C){if(globalThis.PRETTIER_DEBUG)throw C}e.stack=f;function l(c,p){return Na(c,p,u,r)}function d(){let{node:c}=e;if(c===null||typeof c!="object"||s?.(e))return;for(let F of i(c))Array.isArray(c[F])?e.each(d,F):e.call(d,F);let p=a(e,u);if(p){if(typeof p=="function"){D.push({print:p,node:c,pathStack:[...e.stack]});return}o.set(c,p)}}}async function Na(e,t,u,r){let o=await standalone_se({...u,...t,parentParser:u.parser,originalText:e,cursorOffset:void 0,rangeStart:void 0,rangeEnd:void 0},{passThrough:!0}),{ast:n}=await standalone_Fe(e,o),a=await r(n,o);return standalone_qe(a)}function Sa(e,t,u,r){let{originalText:o,[Symbol.for("comments")]:n,locStart:a,locEnd:s,[Symbol.for("printedComments")]:i}=t,{node:D}=e,f=a(D),l=s(D);for(let c of n)a(c)>=f&&s(c)<=l&&i.add(c);let{printPrettierIgnored:d}=t.printer;return d?d(e,t,u,r):o.slice(f,l)}var standalone_hn=Sa;async function standalone_Ge(e,t){({ast:e}=await standalone_xu(e,t));let u=new Map,r=new pr(e),o=standalone_Nr(t),n=new Map;await Cn(r,s,t,standalone_Ge,n);let a=await gn(r,t,s,void 0,n);if(standalone_Tr(t),t.cursorOffset>=0){if(t.nodeAfterCursor&&!t.nodeBeforeCursor)return[standalone_ee,a];if(t.nodeBeforeCursor&&!t.nodeAfterCursor)return[a,standalone_ee]}return a;function s(D,f){return D===void 0||D===r?i(f):Array.isArray(D)?r.call(()=>i(f),...D):r.call(()=>i(f),D)}function i(D){o(r);let f=r.node;if(f==null)return"";let l=ge(f)&&D===void 0;if(l&&u.has(f))return u.get(f);let d=gn(r,t,s,D,n);return l&&u.set(f,d),d}}function gn(e,t,u,r,o){let{node:n}=e,{printer:a}=t,s;switch(a.hasPrettierIgnore?.(e)?s=standalone_hn(e,t,u,r):o.has(n)?s=o.get(n):s=a.print(e,t,u,r),n){case t.cursorNode:s=Ee(s,i=>[standalone_ee,i,standalone_ee]);break;case t.nodeBeforeCursor:s=Ee(s,i=>[i,standalone_ee]);break;case t.nodeAfterCursor:s=Ee(s,i=>[standalone_ee,i]);break}return a.printComment&&!a.willPrintOwnComments?.(e,t)&&(s=standalone_Br(e,s,t)),s}async function standalone_xu(e,t){let u=e.comments??[];t[Symbol.for("comments")]=u,t[Symbol.for("printedComments")]=new Set,Ar(e,t);let{printer:{preprocess:r}}=t;return e=r?await r(e,t):e,{ast:e,comments:u}}function standalone_wa(e,t){let{cursorOffset:u,locStart:r,locEnd:o,getVisitorKeys:n}=t,a=c=>r(c)<=u&&o(c)>=u,s=e,i=[e];for(let c of Cr(e,{getVisitorKeys:n,filter:a}))i.push(c),s=c;if(hr(s,{getVisitorKeys:n}))return{cursorNode:s};let D,f,l=-1,d=Number.POSITIVE_INFINITY;for(;i.length>0&&(D===void 0||f===void 0);){s=i.pop();let c=D!==void 0,p=f!==void 0;for(let F of standalone_be(s,{getVisitorKeys:n})){if(!c){let C=o(F);C<=u&&C>l&&(D=F,l=C)}if(!p){let C=r(F);C>=u&&C<d&&(f=F,d=C)}}}return{nodeBeforeCursor:D,nodeAfterCursor:f}}var Bu=standalone_wa;function standalone_Oa(e,t){let{printer:u}=t,r=u.massageAstNode;if(!r)return e;let{getVisitorKeys:o}=u,{ignoredProperties:n}=r;return a(e);function a(s,i){if(!ge(s))return s;if(Array.isArray(s))return s.map(d=>a(d,i)).filter(Boolean);let D={},f=new Set(o(s));for(let d in s)!Object.prototype.hasOwnProperty.call(s,d)||n?.has(d)||(f.has(d)?D[d]=a(s[d],s):D[d]=s[d]);let l=r(s,D,i);if(l!==null)return l??D}}var standalone_yn=standalone_Oa;var standalone_Pa=Array.prototype.findLastIndex??function(e){for(let t=this.length-1;t>=0;t--){let u=this[t];if(e(u,t,this))return t}return-1},Ia=standalone_X("findLastIndex",function(){if(Array.isArray(this))return standalone_Pa}),bn=Ia;var ka=({parser:e})=>e==="json"||e==="json5"||e==="jsonc"||e==="json-stringify";function standalone_va(e,t){return t=new Set(t),e.find(u=>xn.has(u.type)&&t.has(u))}function An(e){let t=bn(0,e,u=>u.type!=="Program"&&u.type!=="File");return t===-1?e:e.slice(0,t+1)}function Ra(e,t,{locStart:u,locEnd:r}){let[o,...n]=e,[a,...s]=t;if(o===a)return[o,a];let i=u(o);for(let f of An(s))if(u(f)>=i)a=f;else break;let D=r(a);for(let f of An(n)){if(r(f)<=D)o=f;else break;if(o===a)break}return[o,a]}function standalone_Tu(e,t,u,r,o=[],n){let{locStart:a,locEnd:s}=u,i=a(e),D=s(e);if(t>D||t<i||n==="rangeEnd"&&t===i||n==="rangeStart"&&t===D)return;let f=[e,...o],l=at(e,f,{cache:standalone_uu,locStart:a,locEnd:s,getVisitorKeys:u.getVisitorKeys,filter:u.printer.canAttachComment,getChildren:u.printer.getCommentChildNodes});for(let d of l){let c=standalone_Tu(d,t,u,r,f,n);if(c)return c}if(r(e,o[0]))return f}function La(e,t){return t!=="DeclareExportDeclaration"&&e!=="TypeParameterDeclaration"&&(e==="Directive"||e==="TypeAlias"||e==="TSExportAssignment"||e.startsWith("Declare")||e.startsWith("TSDeclare")||e.endsWith("Statement")||e.endsWith("Declaration"))}var xn=new Set(["JsonRoot","ObjectExpression","ArrayExpression","StringLiteral","NumericLiteral","BooleanLiteral","NullLiteral","UnaryExpression","TemplateLiteral"]),Ma=new Set(["OperationDefinition","FragmentDefinition","VariableDefinition","TypeExtensionDefinition","ObjectTypeDefinition","FieldDefinition","DirectiveDefinition","EnumTypeDefinition","EnumValueDefinition","InputValueDefinition","InputObjectTypeDefinition","SchemaDefinition","OperationTypeDefinition","InterfaceTypeDefinition","UnionTypeDefinition","ScalarTypeDefinition"]);function _n(e,t,u){if(!t)return!1;switch(e.parser){case"flow":case"hermes":case"babel":case"babel-flow":case"babel-ts":case"typescript":case"acorn":case"espree":case"meriyah":case"oxc":case"oxc-ts":case"__babel_estree":return La(t.type,u?.type);case"json":case"json5":case"jsonc":case"json-stringify":return xn.has(t.type);case"graphql":return Ma.has(t.kind);case"vue":return t.tag!=="root"}return!1}function Bn(e,t,u){let{rangeStart:r,rangeEnd:o,locStart:n,locEnd:a}=t;P(o>r);let s=e.slice(r,o).search(/\S/u),i=s===-1;if(!i)for(r+=s;o>r&&!/\S/u.test(e[o-1]);--o);let D=standalone_Tu(u,r,t,(c,p)=>_n(t,c,p),[],"rangeStart");if(!D)return;let f=i?D:standalone_Tu(u,o,t,c=>_n(t,c),[],"rangeEnd");if(!f)return;let l,d;if(ka(t)){let c=standalone_va(D,f);l=c,d=c}else[l,d]=Ra(D,f,t);return[Math.min(n(l),n(d)),Math.max(a(l),a(d))]}var wn="\uFEFF",Tn=Symbol("cursor");async function On(e,t,u=0){if(!e||e.trim().length===0)return{formatted:"",cursorOffset:-1,comments:[]};let{ast:r,text:o}=await standalone_Fe(e,t);t.cursorOffset>=0&&(t={...t,...Bu(r,t)});let n=await standalone_Ge(r,t,u);u>0&&(n=tt([standalone_V,n],u,t.tabWidth));let a=Ce(n,t);if(u>0){let i=a.formatted.trim();a.cursorNodeStart!==void 0&&(a.cursorNodeStart-=a.formatted.indexOf(i),a.cursorNodeStart<0&&(a.cursorNodeStart=0,a.cursorNodeText=a.cursorNodeText.trimStart()),a.cursorNodeStart+a.cursorNodeText.length>i.length&&(a.cursorNodeText=a.cursorNodeText.trimEnd())),a.formatted=i+standalone_Se(t.endOfLine)}let s=t[Symbol.for("comments")];if(t.cursorOffset>=0){let i,D,f,l;if((t.cursorNode||t.nodeBeforeCursor||t.nodeAfterCursor)&&a.cursorNodeText)if(f=a.cursorNodeStart,l=a.cursorNodeText,t.cursorNode)i=t.locStart(t.cursorNode),D=o.slice(i,t.locEnd(t.cursorNode));else{if(!t.nodeBeforeCursor&&!t.nodeAfterCursor)throw new Error("Cursor location must contain at least one of cursorNode, nodeBeforeCursor, nodeAfterCursor");i=t.nodeBeforeCursor?t.locEnd(t.nodeBeforeCursor):0;let y=t.nodeAfterCursor?t.locStart(t.nodeAfterCursor):o.length;D=o.slice(i,y)}else i=0,D=o,f=0,l=a.formatted;let d=t.cursorOffset-i;if(D===l)return{formatted:a.formatted,cursorOffset:f+d,comments:s};let c=D.split("");c.splice(d,0,Tn);let p=l.split(""),F=Ut(c,p),C=f;for(let y of F)if(y.removed){if(y.value.includes(Tn))break}else C+=y.count;return{formatted:a.formatted,cursorOffset:C,comments:s}}return{formatted:a.formatted,cursorOffset:-1,comments:s}}async function Ya(e,t){let{ast:u,text:r}=await standalone_Fe(e,t),[o,n]=Bn(r,t,u)??[0,0],a=r.slice(o,n),s=Math.min(o,r.lastIndexOf(`
`,o)+1),i=r.slice(s,o).match(/^\s*/u)[0],D=standalone_he(i,t.tabWidth),f=await On(a,{...t,rangeStart:0,rangeEnd:Number.POSITIVE_INFINITY,cursorOffset:t.cursorOffset>o&&t.cursorOffset<=n?t.cursorOffset-o:-1,endOfLine:"lf"},D),l=f.formatted.trimEnd(),{cursorOffset:d}=t;d>n?d+=l.length-a.length:f.cursorOffset>=0&&(d=f.cursorOffset+o);let c=r.slice(0,o)+l+r.slice(n);if(t.endOfLine!=="lf"){let p=standalone_Se(t.endOfLine);d>=0&&p===`\r
`&&(d+=$t(c.slice(0,d),`
`)),c=oe(0,c,`
`,p)}return{formatted:c,cursorOffset:d,comments:f.comments}}function Nu(e,t,u){return typeof t!="number"||Number.isNaN(t)||t<0||t>e.length?u:t}function Nn(e,t){let{cursorOffset:u,rangeStart:r,rangeEnd:o}=t;return u=Nu(e,u,-1),r=Nu(e,r,0),o=Nu(e,o,e.length),{...t,cursorOffset:u,rangeStart:r,rangeEnd:o}}function standalone_Pn(e,t){let{cursorOffset:u,rangeStart:r,rangeEnd:o,endOfLine:n}=Nn(e,t),a=e.charAt(0)===wn;if(a&&(e=e.slice(1),u--,r--,o--),n==="auto"&&(n=Yu(e)),e.includes("\r")){let s=i=>$t(e.slice(0,Math.max(i,0)),`\r
`);u-=s(u),r-=s(r),o-=s(o),e=ju(e)}return{hasBOM:a,text:e,options:Nn(e,{...t,cursorOffset:u,rangeStart:r,rangeEnd:o,endOfLine:n})}}async function Sn(e,t){let u=await standalone_We(t);return!u.hasPragma||u.hasPragma(e)}async function standalone_ja(e,t){return(await standalone_We(t)).hasIgnorePragma?.(e)}async function Su(e,t){let{hasBOM:u,text:r,options:o}=standalone_Pn(e,await standalone_se(t));if(o.rangeStart>=o.rangeEnd&&r!==""||o.requirePragma&&!await Sn(r,o)||o.checkIgnorePragma&&await standalone_ja(r,o))return{formatted:e,cursorOffset:t.cursorOffset,comments:[]};let n;return o.rangeStart>0||o.rangeEnd<r.length?n=await Ya(r,o):(!o.requirePragma&&o.insertPragma&&o.printer.insertPragma&&!await Sn(r,o)&&(r=o.printer.insertPragma(r)),n=await On(r,o)),u&&(n.formatted=wn+n.formatted,n.cursorOffset>=0&&n.cursorOffset++),n}async function In(e,t,u){let{text:r,options:o}=standalone_Pn(e,await standalone_se(t)),n=await standalone_Fe(r,o);return u&&(u.preprocessForPrint&&(n.ast=await standalone_xu(n.ast,o)),u.massage&&(n.ast=standalone_yn(n.ast,o))),n}async function kn(e,t){t=await standalone_se(t);let u=await standalone_Ge(e,t);return Ce(u,t)}async function vn(e,t){let u=standalone_sr(e),{formatted:r}=await Su(u,{...t,parser:"__js_expression"});return r}async function Rn(e,t){t=await standalone_se(t);let{ast:u}=await standalone_Fe(e,t);return t.cursorOffset>=0&&(t={...t,...Bu(u,t)}),standalone_Ge(u,t)}async function Ln(e,t){return Ce(e,await standalone_se(t))}var wu={};Yt(wu,{builders:()=>Wa,printer:()=>$a,utils:()=>Va});var Wa={join:standalone_Ie,line:ut,softline:standalone_or,hardline:standalone_V,literalline:Qe,group:standalone_Kt,conditionalGroup:standalone_tr,fill:er,lineSuffix:ve,lineSuffixBoundary:standalone_ar,cursor:standalone_ee,breakParent:ce,ifBreak:standalone_ur,trim:standalone_ir,indent:standalone_ae,indentIfBreak:rr,align:standalone_De,addAlignmentToDoc:tt,markAsRoot:et,dedentToRoot:Qu,dedent:Zu,hardlineWithoutBreakParent:ke,literallineWithoutBreakParent:Gt,label:standalone_nr,concat:e=>e},$a={printDocToString:Ce},Va={willBreak:Ku,traverseDoc:we,findInDoc:Xe,mapDoc:standalone_Pe,removeLines:zu,stripTrailingHardline:standalone_qe,replaceEndOfLine:standalone_Ju,canBreak:Hu};var Mn="3.8.2";var Pu={};Yt(Pu,{addDanglingComment:()=>standalone_ue,addLeadingComment:()=>standalone_fe,addTrailingComment:()=>le,getAlignmentSize:()=>standalone_he,getIndentSize:()=>Yn,getMaxContinuousCount:()=>jn,getNextNonSpaceNonCommentCharacter:()=>Un,getNextNonSpaceNonCommentCharacterIndex:()=>standalone_ni,getPreferredQuote:()=>standalone_Vn,getStringWidth:()=>standalone_Re,hasNewline:()=>standalone_z,hasNewlineInRange:()=>standalone_Kn,hasSpaces:()=>Gn,isNextLineEmpty:()=>standalone_Di,isNextLineEmptyAfterIndex:()=>standalone_kt,isPreviousLineEmpty:()=>standalone_ai,makeString:()=>standalone_si,skip:()=>standalone_ye,skipEverythingButNewLine:()=>ot,skipInlineComment:()=>standalone_xe,skipNewline:()=>K,skipSpaces:()=>Y,skipToLineEnd:()=>nt,skipTrailingComment:()=>standalone_Be,skipWhitespace:()=>Fr});function Ka(e,t){if(t===!1)return!1;if(e.charAt(t)==="/"&&e.charAt(t+1)==="*"){for(let u=t+2;u<e.length;++u)if(e.charAt(u)==="*"&&e.charAt(u+1)==="/")return u+2}return t}var standalone_xe=Ka;function Ga(e,t){return t===!1?!1:e.charAt(t)==="/"&&e.charAt(t+1)==="/"?ot(e,t):t}var standalone_Be=Ga;function standalone_za(e,t){let u=null,r=t;for(;r!==u;)u=r,r=Y(e,r),r=standalone_xe(e,r),r=standalone_Be(e,r),r=K(e,r);return r}var standalone_ze=standalone_za;function standalone_Ja(e,t){let u=null,r=t;for(;r!==u;)u=r,r=nt(e,r),r=standalone_xe(e,r),r=Y(e,r);return r=standalone_Be(e,r),r=K(e,r),r!==!1&&standalone_z(e,r)}var standalone_kt=standalone_Ja;function Ha(e,t){let u=e.lastIndexOf(`
`);return u===-1?0:standalone_he(e.slice(u+1).match(/^[\t ]*/u)[0],t)}var Yn=Ha;function standalone_Ou(e){if(typeof e!="string")throw new TypeError("Expected a string");return e.replace(/[|\\{}()[\]^$+*?.]/g,"\\$&").replace(/-/g,"\\x2d")}function Xa(e,t){let u=e.matchAll(new RegExp(`(?:${standalone_Ou(t)})+`,"gu"));return u.reduce||(u=[...u]),u.reduce((r,[o])=>Math.max(r,o.length),0)/t.length}var jn=Xa;function qa(e,t){let u=standalone_ze(e,t);return u===!1?"":e.charAt(u)}var Un=qa;var standalone_Wn=Object.freeze({character:"'",codePoint:39}),standalone_$n=Object.freeze({character:'"',codePoint:34}),Qa=Object.freeze({preferred:standalone_Wn,alternate:standalone_$n}),Za=Object.freeze({preferred:standalone_$n,alternate:standalone_Wn});function standalone_ei(e,t){let{preferred:u,alternate:r}=t===!0||t==="'"?Qa:Za,{length:o}=e,n=0,a=0;for(let s=0;s<o;s++){let i=e.charCodeAt(s);i===u.codePoint?n++:i===r.codePoint&&a++}return(n>a?r:u).character}var standalone_Vn=standalone_ei;function standalone_ti(e,t,u){for(let r=t;r<u;++r)if(e.charAt(r)===`
`)return!0;return!1}var standalone_Kn=standalone_ti;function standalone_ui(e,t,u={}){return Y(e,u.backwards?t-1:t,u)!==t}var Gn=standalone_ui;function standalone_ri(e,t,u){return standalone_ze(e,u(t))}function standalone_ni(e,t){return arguments.length===2||typeof t=="number"?standalone_ze(e,t):standalone_ri(...arguments)}function standalone_oi(e,t,u){return standalone_Le(e,u(t))}function standalone_ai(e,t){return arguments.length===2||typeof t=="number"?standalone_Le(e,t):standalone_oi(...arguments)}function standalone_ii(e,t,u){return standalone_kt(e,u(t))}function standalone_si(e,t,u){let r=t==='"'?"'":'"',n=oe(0,e,/\\(.)|(["'])/gsu,(a,s,i)=>s===r?s:i===t?"\\"+i:i||(u&&/^[^\n\r"'0-7\\bfnrt-vx\u2028\u2029]$/u.test(s)?s:"\\"+s));return t+n+t}function standalone_Di(e,t){return arguments.length===2||typeof t=="number"?standalone_kt(e,t):standalone_ii(...arguments)}function standalone_me(e,t=1){return async(...u)=>{let r=u[t]??{},o=r.plugins??[];return u[t]={...r,plugins:Array.isArray(o)?o:Object.values(o)},e(...u)}}var standalone_zn=standalone_me(Su);async function standalone_Jn(e,t){let{formatted:u}=await standalone_zn(e,{...t,cursorOffset:-1});return u}async function standalone_ci(e,t){return await standalone_Jn(e,t)===e}var standalone_fi=standalone_me(it,0),standalone_li={parse:standalone_me(In),formatAST:standalone_me(kn),formatDoc:standalone_me(vn),printToDoc:standalone_me(Rn),printDocToString:standalone_me(Ln)};

;// CONCATENATED MODULE: ./lib/package-operations.js








const MANIFEST_FILE_NAME = 'package.json';
const CHANGELOG_FILE_NAME = 'CHANGELOG.md';
/**
 * Recursively finds the package manifest for each workspace, and collects
 * metadata for each package.
 *
 * @param workspaces - The list of workspace patterns given in the root manifest.
 * @param rootDir - The monorepo root directory.
 * @param parentDir - The parent directory of the current package.
 * @returns The metadata for all packages in the monorepo.
 */
async function getMetadataForAllPackages(workspaces, rootDir = WORKSPACE_ROOT, parentDir = '') {
    const workspaceLocations = await (0,dist.getWorkspaceLocations)(workspaces, rootDir);
    return workspaceLocations.reduce(async (promise, workspaceDirectory) => {
        const result = await promise;
        const fullWorkspacePath = external_path_default().join(rootDir, workspaceDirectory);
        if ((await external_fs_.promises.lstat(fullWorkspacePath)).isDirectory()) {
            const rawManifest = await (0,dist.getPackageManifest)(fullWorkspacePath);
            // If the package is a sub-workspace, resolve all packages in the sub-workspace and add them
            // to the result.
            if (dist.ManifestFieldNames.Workspaces in rawManifest) {
                const rootManifest = (0,dist.validatePackageManifestVersion)(rawManifest, workspaceDirectory);
                const manifest = (0,dist.validateMonorepoPackageManifest)(rootManifest, workspaceDirectory);
                const name = manifest[dist.ManifestFieldNames.Name];
                if (!name) {
                    throw new Error(`Expected sub-workspace in "${workspaceDirectory}" to have a name.`);
                }
                return {
                    ...result,
                    ...(await getMetadataForAllPackages(manifest.workspaces, workspaceDirectory, workspaceDirectory)),
                    [name]: {
                        dirName: external_path_default().basename(workspaceDirectory),
                        manifest,
                        name,
                        dirPath: external_path_default().join(parentDir, workspaceDirectory),
                    },
                };
            }
            const manifest = (0,dist.validatePolyrepoPackageManifest)(rawManifest, workspaceDirectory);
            return {
                ...result,
                [manifest.name]: {
                    dirName: external_path_default().basename(workspaceDirectory),
                    manifest,
                    name: manifest.name,
                    dirPath: external_path_default().join(parentDir, workspaceDirectory),
                },
            };
        }
        return result;
    }, Promise.resolve({}));
}
/**
 * Determines the set of packages whose versions should be bumped and whose
 * changelogs should be updated.
 *
 * @param allPackages - The metadata of all packages in the monorepo.
 * @param synchronizeVersions - Whether to synchronize the versions of all
 * packages.
 * @param tags - All tags for the release's base git branch.
 * @returns The names of the packages to update.
 */
async function getPackagesToUpdate(allPackages, synchronizeVersions, tags) {
    // In order to synchronize versions, we must update every package.
    if (synchronizeVersions) {
        return new Set(Object.keys(allPackages));
    }
    // If we're not synchronizing versions, we only update changed packages.
    const shouldBeUpdated = new Set();
    // We use a for-loop here instead of Promise.all because didPackageChange
    // must be called serially.
    for (const packageName of Object.keys(allPackages)) {
        if (await didPackageChange(tags, allPackages[packageName])) {
            shouldBeUpdated.add(packageName);
        }
    }
    if (shouldBeUpdated.size === 0) {
        throw new Error(`There are no packages to update.`);
    }
    return shouldBeUpdated;
}
/**
 * Updates the manifests and changelogs of all packages in the monorepo per the
 * update specification. Writes the new manifests to disk. The following changes
 * are made to the new manifests:
 *
 * - The "version" field is replaced with the new version.
 * - If package versions are being synchronized, updates their version ranges
 * wherever they appear as dependencies.
 *
 * @param allPackages - The metadata of all monorepo packages.
 * @param updateSpecification - The update specification.
 */
async function updatePackages(allPackages, updateSpecification) {
    const { packagesToUpdate } = updateSpecification;
    await Promise.all(Array.from(packagesToUpdate.keys()).map(async (packageName) => updatePackage(allPackages[packageName], updateSpecification)));
}
/**
 * Updates the manifest and changelog of the given package per the update
 * specification and writes the changes to disk. The following changes are made
 * to the manifest:
 *
 * - The "version" field is replaced with the new version.
 * - If package versions are being synchronized, updates their version ranges
 * wherever they appear as dependencies.
 *
 * @param packageMetadata - The metadata of the package to update.
 * @param packageMetadata.dirPath - The full path to the directory that holds
 * the package.
 * @param packageMetadata.manifest - The information within the `package.json`
 * file for the package.
 * @param updateSpecification - The update specification, which determines how
 * the update is performed.
 * @param rootDir - The full path to the project.
 */
async function updatePackage(packageMetadata, updateSpecification, rootDir = WORKSPACE_ROOT) {
    await Promise.all([
        (0,dist.writeJsonFile)(external_path_default().join(rootDir, packageMetadata.dirPath, MANIFEST_FILE_NAME), getUpdatedManifest(packageMetadata.manifest, updateSpecification)),
        updateSpecification.shouldUpdateChangelog
            ? updatePackageChangelog(packageMetadata, updateSpecification)
            : Promise.resolve(),
    ]);
}
/**
 * Format the given changelog using Prettier. This is extracted into a separate
 * function for coverage purposes.
 *
 * @param changelog - The changelog to format.
 * @returns The formatted changelog.
 */
async function formatChangelog(changelog) {
    return await standalone_Jn(changelog, {
        parser: 'markdown',
        plugins: [markdown_namespaceObject],
    });
}
/**
 * Updates the changelog file of the given package, using
 * `@metamask/auto-changelog`. Assumes that the changelog file is located at the
 * package root directory and named "CHANGELOG.md".
 *
 * @param packageMetadata - The metadata of the package to update.
 * @param packageMetadata.dirPath - The full path to the directory that holds
 * the package.
 * @param packageMetadata.manifest - The information within the `package.json`
 * file for the package.
 * @param updateSpecification - The update specification, which determines how
 * the update is performed.
 * @param rootDir - The full path to the project.
 * @returns The result of writing to the changelog.
 */
async function updatePackageChangelog(packageMetadata, updateSpecification, rootDir = WORKSPACE_ROOT) {
    const { dirPath: projectRootDirectory } = packageMetadata;
    const { newVersion, repositoryUrl } = updateSpecification;
    let changelogContent;
    const packagePath = external_path_default().join(rootDir, projectRootDirectory);
    const changelogPath = external_path_default().join(packagePath, CHANGELOG_FILE_NAME);
    try {
        changelogContent = await external_fs_.promises.readFile(changelogPath, 'utf-8');
    }
    catch (error) {
        // If the error is not a file not found error, throw it
        if (!isErrorWithCode(error) || error.code !== 'ENOENT') {
            console.error(`Failed to read changelog in "${projectRootDirectory}".`);
            throw error;
        }
        console.warn(`Failed to read changelog in "${projectRootDirectory}".`);
        return undefined;
    }
    const newChangelogContent = await updateChangelog({
        changelogContent,
        currentVersion: newVersion,
        isReleaseCandidate: true,
        projectRootDirectory,
        repoUrl: repositoryUrl,
        formatter: formatChangelog,
    });
    if (newChangelogContent) {
        return await external_fs_.promises.writeFile(changelogPath, newChangelogContent);
    }
    const hasUnReleased = hasUnreleasedChanges(changelogContent, repositoryUrl);
    if (!hasUnReleased) {
        const packageName = packageMetadata.manifest.name;
        throw new Error(`"updateChangelog" returned an empty value for package ${packageName ? `"${packageName}"` : `at "${packagePath}"`}.`);
    }
    return undefined;
}
/**
 * Checks if there are unreleased changes in the changelog.
 *
 * @param changelogContent - The string formatted changelog.
 * @param repositoryUrl - The repository url.
 * @returns The boolean true if there are unreleased changes, otherwise false.
 */
function hasUnreleasedChanges(changelogContent, repositoryUrl) {
    const changelog = parseChangelog({
        changelogContent,
        repoUrl: repositoryUrl,
        formatter: formatChangelog,
    });
    return Object.keys(changelog.getUnreleasedChanges()).length !== 0;
}
/**
 * Updates the given manifest per the update specification as follows:
 *
 * - Updates the manifest's "version" field to the new version.
 * - If monorepo package versions are being synchronized, updates their version
 * ranges wherever they appear as dependencies.
 *
 * @param currentManifest - The package's current manifest, as read from disk.
 * @param updateSpecification - The update specification, which determines how
 * the update is performed.
 * @returns The updated manifest.
 */
function getUpdatedManifest(currentManifest, updateSpecification) {
    const { newVersion } = updateSpecification;
    if (isMonorepoUpdateSpecification(updateSpecification) &&
        updateSpecification.synchronizeVersions) {
        // If we're synchronizing the versions of our updated packages, we also
        // synchronize their versions whenever they appear as a dependency.
        return {
            ...currentManifest,
            ...getUpdatedDependencyFields(currentManifest, updateSpecification),
            version: newVersion,
        };
    }
    // If we're not synchronizing versions, we leave all dependencies as they are.
    return { ...currentManifest, version: newVersion };
}
/**
 * Gets the updated dependency fields of the given manifest per the given
 * update specification.
 *
 * @param manifest - The package's current manifest, as read from disk.
 * @param updateSpecification - The update specification, which determines how
 * the update is performed.
 * @returns The updated dependency fields of the manifest.
 */
function getUpdatedDependencyFields(manifest, updateSpecification) {
    const { newVersion, packagesToUpdate } = updateSpecification;
    return Object.values(dist.ManifestDependencyFieldNames).reduce((newDepsFields, fieldName) => {
        if (fieldName in manifest) {
            newDepsFields[fieldName] = getUpdatedDependencyField(manifest[fieldName], packagesToUpdate, newVersion);
        }
        return newDepsFields;
    }, {});
}
/**
 * Updates the version range of every package in the list that's present in the
 * dependency object to "^<VERSION>", where <VERSION> is the specified new
 * version.
 *
 * @param dependencyObject - The package.json dependency object to update.
 * @param packagesToUpdate - The packages to update the version of.
 * @param newVersion - The new version of the given packages.
 * @returns The updated dependency object.
 */
function getUpdatedDependencyField(dependencyObject, packagesToUpdate, newVersion) {
    const newVersionRange = `^${newVersion}`;
    return Object.keys(dependencyObject).reduce((newDeps, packageName) => {
        newDeps[packageName] =
            packagesToUpdate.has(packageName) &&
                !dependencyObject[packageName].startsWith('workspace:')
                ? newVersionRange
                : dependencyObject[packageName];
        return newDeps;
    }, {});
}
/**
 * Type guard for checking if an update specification is a monorepo update
 * specification.
 *
 * @param specification - The update specification object to check.
 * @returns Whether the given specification object is a monorepo update
 * specification.
 */
function isMonorepoUpdateSpecification(specification) {
    return ('packagesToUpdate' in specification &&
        'synchronizeVersions' in specification);
}
//# sourceMappingURL=package-operations.js.map
;// CONCATENATED MODULE: ./lib/update.js









/**
 * Action entry function. Gets git tags, reads the work space root package.json,
 * and updates the package(s) of the repository per the Action inputs.
 *
 * @param actionInputs - The inputs to this action.
 */
async function performUpdate(actionInputs) {
    const repositoryUrl = await getRepositoryHttpsUrl();
    // Get all git tags. An error is thrown if "git tag" returns no tags and the
    // local git history is incomplete.
    const [tags] = await getTags();
    const rawRootManifest = await (0,dist.getPackageManifest)(WORKSPACE_ROOT);
    const rootManifest = (0,dist.validatePackageManifestVersion)(rawRootManifest, WORKSPACE_ROOT);
    const { version: currentVersion } = rootManifest;
    // Compute the new version and version diff from the inputs and root manifest
    let newVersion, versionDiff;
    if (actionInputs.ReleaseType) {
        newVersion = inc_default()(currentVersion, actionInputs.ReleaseType);
        versionDiff = actionInputs.ReleaseType;
    }
    else {
        newVersion = actionInputs.ReleaseVersion;
        versionDiff = diff_default()(currentVersion, newVersion);
    }
    // Ensure that the new version is greater than the current version, and that
    // there's no existing tag for it.
    validateVersion(currentVersion, newVersion, tags);
    if (dist.ManifestFieldNames.Workspaces in rootManifest) {
        console.log('Project appears to have workspaces. Applying monorepo workflow.');
        await updateMonorepo(newVersion, versionDiff, (0,dist.validateMonorepoPackageManifest)(rootManifest, WORKSPACE_ROOT), repositoryUrl, tags);
    }
    else {
        console.log('Project does not appear to have any workspaces. Applying polyrepo workflow.');
        await updatePolyrepo(newVersion, (0,dist.validatePackageManifestName)(rootManifest, WORKSPACE_ROOT), repositoryUrl);
    }
    (0,core.setOutput)('NEW_VERSION', newVersion);
}
/**
 * Given that checked out git repository is a polyrepo (i.e., a "normal",
 * single-package repo), updates the repository's package and its changelog.
 *
 * @param newVersion - The package's new version.
 * @param manifest - The package's parsed package.json file.
 * @param repositoryUrl - The HTTPS URL of the repository.
 */
async function updatePolyrepo(newVersion, manifest, repositoryUrl) {
    await updatePackage({ dirPath: './', manifest }, { newVersion, repositoryUrl, shouldUpdateChangelog: true });
}
/**
 * Given that the checked out repository is a monorepo:
 *
 * If the semver diff is "major" or if it's the first release of the monorepo
 * (inferred from the complete absence of tags), updates all packages.
 * Otherwise, updates packages that changed since their previous release.
 * The changelog of any updated package will also be updated.
 *
 * @param newVersion - The new version of the package(s) to update.
 * @param versionDiff - A SemVer version diff, e.g. "major" or "prerelease".
 * @param rootManifest - The parsed root package.json file of the monorepo.
 * @param repositoryUrl - The HTTPS URL of the repository.
 * @param tags - All tags reachable from the current git HEAD, as from "git
 * tag --merged".
 */
async function updateMonorepo(newVersion, versionDiff, rootManifest, repositoryUrl, tags) {
    // If the version bump is major or the new major version is still "0", we
    // synchronize the versions of all monorepo packages, meaning the "version"
    // field of their manifests and their version range specified wherever they
    // appear as a dependency.
    const synchronizeVersions = (0,dist.isMajorSemverDiff)(versionDiff) || major_default()(newVersion) === 0;
    // Collect required information to perform updates
    const allPackages = await getMetadataForAllPackages(rootManifest.workspaces);
    const packagesToUpdate = await getPackagesToUpdate(allPackages, synchronizeVersions, tags);
    const updateSpecification = {
        newVersion,
        packagesToUpdate,
        repositoryUrl,
        synchronizeVersions,
        shouldUpdateChangelog: true,
    };
    // Finally, bump the version of all packages and the root manifest, update the
    // changelogs of all updated packages, and add the new version as an output of
    // this Action.
    await updatePackages(allPackages, updateSpecification);
    await updatePackage({ dirPath: './', manifest: rootManifest }, { ...updateSpecification, shouldUpdateChangelog: false });
}
/**
 * Throws an error if the current version is equal to the new version, if a
 * tag for the new version already exists, or if the new version is less than
 * the current version.
 *
 * @param currentVersion - The most recently released version.
 * @param newVersion - The new version to be released.
 * @param tags - All tags reachable from the current git HEAD, as from "git
 * tag --merged".
 */
function validateVersion(currentVersion, newVersion, tags) {
    if (!gt_default()(newVersion, currentVersion)) {
        throw new Error(`The new version "${newVersion}" is not greater than the current version "${currentVersion}".`);
    }
    if (tags.has(`v${newVersion}`)) {
        throw new Error(`Tag "v${newVersion}" for new version "${newVersion}" already exists.`);
    }
}
//# sourceMappingURL=update.js.map
;// CONCATENATED MODULE: ./lib/index.js



performUpdate(getActionInputs()).catch((error) => {
    // istanbul ignore else
    if (error.stack) {
        (0,core.error)(error.stack);
    }
    (0,core.setFailed)(error);
});
//# sourceMappingURL=index.js.map
})();

module.exports = __webpack_exports__;
/******/ })()
;