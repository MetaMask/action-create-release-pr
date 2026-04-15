import { createRequire as __WEBPACK_EXTERNAL_createRequire } from "module";
import * as __WEBPACK_EXTERNAL_MODULE__actions_http_client_1e727b91__ from "@actions/http-client";
import * as __WEBPACK_EXTERNAL_MODULE__octokit_rest_fa3a39c1__ from "@octokit/rest";
/******/ var __webpack_modules__ = ({

/***/ 671:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.writeJsonFile = exports.readJsonObjectFile = void 0;
const fs_1 = __nccwpck_require__(9896);
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

/***/ 4725:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


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
__exportStar(__nccwpck_require__(671), exports);
__exportStar(__nccwpck_require__(6957), exports);
__exportStar(__nccwpck_require__(7069), exports);
__exportStar(__nccwpck_require__(5117), exports);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 6957:
/***/ ((__unused_webpack_module, exports) => {


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

/***/ 7069:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getWorkspaceLocations = exports.validateMonorepoPackageManifest = exports.validatePolyrepoPackageManifest = exports.validatePackageManifestName = exports.validatePackageManifestVersion = exports.getPackageManifest = exports.EngineNames = exports.ManifestFieldNames = exports.ManifestDependencyFieldNames = void 0;
const path_1 = __importDefault(__nccwpck_require__(6928));
const util_1 = __nccwpck_require__(9023);
const glob_1 = __importDefault(__nccwpck_require__(3574));
const misc_utils_1 = __nccwpck_require__(6957);
const file_utils_1 = __nccwpck_require__(671);
const semver_utils_1 = __nccwpck_require__(5117);
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
    ManifestFieldNames["Engines"] = "engines";
    ManifestFieldNames["Name"] = "name";
    ManifestFieldNames["Private"] = "private";
    ManifestFieldNames["Version"] = "version";
    ManifestFieldNames["Workspaces"] = "workspaces";
})(ManifestFieldNames = exports.ManifestFieldNames || (exports.ManifestFieldNames = {}));
var EngineNames;
(function (EngineNames) {
    EngineNames["Node"] = "node";
    EngineNames["Npm"] = "npm";
    EngineNames["Pnpm"] = "pnpm";
    EngineNames["Yarn"] = "yarn";
})(EngineNames = exports.EngineNames || (exports.EngineNames = {}));
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

/***/ 5117:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isMajorSemverDiff = exports.isValidSemver = exports.SemverReleaseTypes = void 0;
const parse_1 = __importDefault(__nccwpck_require__(6353));
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

/***/ 9380:
/***/ ((module) => {


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

/***/ 4691:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var concatMap = __nccwpck_require__(7087);
var balanced = __nccwpck_require__(9380);

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

/***/ 7087:
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

/***/ 546:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



const cp = __nccwpck_require__(5317);
const parse = __nccwpck_require__(7877);
const enoent = __nccwpck_require__(6469);

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

/***/ 6469:
/***/ ((module) => {



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

/***/ 7877:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



const path = __nccwpck_require__(6928);
const resolveCommand = __nccwpck_require__(4866);
const escape = __nccwpck_require__(2164);
const readShebang = __nccwpck_require__(599);

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

/***/ 2164:
/***/ ((module) => {



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

/***/ 599:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



const fs = __nccwpck_require__(9896);
const shebangCommand = __nccwpck_require__(9152);

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

/***/ 4866:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



const path = __nccwpck_require__(6928);
const which = __nccwpck_require__(8270);
const getPathKey = __nccwpck_require__(6689);

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

/***/ 8270:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const isWindows = process.platform === 'win32' ||
    process.env.OSTYPE === 'cygwin' ||
    process.env.OSTYPE === 'msys'

const path = __nccwpck_require__(6928)
const COLON = isWindows ? ';' : ':'
const isexe = __nccwpck_require__(2940)

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

/***/ 8204:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


const path = __nccwpck_require__(6928);
const childProcess = __nccwpck_require__(5317);
const crossSpawn = __nccwpck_require__(546);
const stripFinalNewline = __nccwpck_require__(1414);
const npmRunPath = __nccwpck_require__(6883);
const onetime = __nccwpck_require__(9969);
const makeError = __nccwpck_require__(8650);
const normalizeStdio = __nccwpck_require__(5109);
const {spawnedKill, spawnedCancel, setupTimeout, validateTimeout, setExitHandler} = __nccwpck_require__(9066);
const {handleInput, getSpawnedResult, makeAllStream, validateInputSync} = __nccwpck_require__(7750);
const {mergePromise, getSpawnedPromise} = __nccwpck_require__(381);
const {joinCommand, parseCommand, getEscapedCommand} = __nccwpck_require__(413);

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

/***/ 413:
/***/ ((module) => {


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

/***/ 8650:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


const {signalsByName} = __nccwpck_require__(4366);

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

/***/ 9066:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


const os = __nccwpck_require__(857);
const onExit = __nccwpck_require__(1415);

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

/***/ 381:
/***/ ((module) => {



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

/***/ 5109:
/***/ ((module) => {


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

/***/ 7750:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


const isStream = __nccwpck_require__(6543);
const getStream = __nccwpck_require__(6771);
const mergeStream = __nccwpck_require__(976);

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

/***/ 1415:
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
  var assert = __nccwpck_require__(2613)
  var signals = __nccwpck_require__(6554)
  var isWin = /^win/i.test(process.platform)

  var EE = __nccwpck_require__(4434)
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

/***/ 6554:
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

/***/ 9728:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = realpath
realpath.realpath = realpath
realpath.sync = realpathSync
realpath.realpathSync = realpathSync
realpath.monkeypatch = monkeypatch
realpath.unmonkeypatch = unmonkeypatch

var fs = __nccwpck_require__(9896)
var origRealpath = fs.realpath
var origRealpathSync = fs.realpathSync

var version = process.version
var ok = /^v[0-5]\./.test(version)
var old = __nccwpck_require__(1201)

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

/***/ 1201:
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

var pathModule = __nccwpck_require__(6928);
var isWindows = process.platform === 'win32';
var fs = __nccwpck_require__(9896);

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

/***/ 7070:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


const {PassThrough: PassThroughStream} = __nccwpck_require__(2203);

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

/***/ 6771:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


const {constants: BufferConstants} = __nccwpck_require__(181);
const stream = __nccwpck_require__(2203);
const {promisify} = __nccwpck_require__(9023);
const bufferStream = __nccwpck_require__(7070);

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

/***/ 2541:
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

var path = __nccwpck_require__(6928)
var minimatch = __nccwpck_require__(3772)
var isAbsolute = __nccwpck_require__(9024)
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

/***/ 3574:
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

var fs = __nccwpck_require__(9896)
var rp = __nccwpck_require__(9728)
var minimatch = __nccwpck_require__(3772)
var Minimatch = minimatch.Minimatch
var inherits = __nccwpck_require__(9598)
var EE = (__nccwpck_require__(4434).EventEmitter)
var path = __nccwpck_require__(6928)
var assert = __nccwpck_require__(2613)
var isAbsolute = __nccwpck_require__(9024)
var globSync = __nccwpck_require__(9795)
var common = __nccwpck_require__(2541)
var setopts = common.setopts
var ownProp = common.ownProp
var inflight = __nccwpck_require__(3176)
var util = __nccwpck_require__(9023)
var childrenIgnored = common.childrenIgnored
var isIgnored = common.isIgnored

var once = __nccwpck_require__(5560)

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

/***/ 9795:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = globSync
globSync.GlobSync = GlobSync

var fs = __nccwpck_require__(9896)
var rp = __nccwpck_require__(9728)
var minimatch = __nccwpck_require__(3772)
var Minimatch = minimatch.Minimatch
var Glob = (__nccwpck_require__(3574).Glob)
var util = __nccwpck_require__(9023)
var path = __nccwpck_require__(6928)
var assert = __nccwpck_require__(2613)
var isAbsolute = __nccwpck_require__(9024)
var common = __nccwpck_require__(2541)
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

/***/ 1212:
/***/ ((__unused_webpack_module, exports) => {

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

/***/ 4366:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

Object.defineProperty(exports, "__esModule", ({value:true}));exports.signalsByNumber=exports.signalsByName=void 0;var _os=__nccwpck_require__(857);

var _signals=__nccwpck_require__(8310);
var _realtime=__nccwpck_require__(3782);



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

/***/ 3782:
/***/ ((__unused_webpack_module, exports) => {

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

/***/ 8310:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

Object.defineProperty(exports, "__esModule", ({value:true}));exports.getSignals=void 0;var _os=__nccwpck_require__(857);

var _core=__nccwpck_require__(1212);
var _realtime=__nccwpck_require__(3782);



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

/***/ 3176:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var wrappy = __nccwpck_require__(8264)
var reqs = Object.create(null)
var once = __nccwpck_require__(5560)

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

/***/ 9598:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

try {
  var util = __nccwpck_require__(9023);
  /* istanbul ignore next */
  if (typeof util.inherits !== 'function') throw '';
  module.exports = util.inherits;
} catch (e) {
  /* istanbul ignore next */
  module.exports = __nccwpck_require__(6589);
}


/***/ }),

/***/ 6589:
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

/***/ 6543:
/***/ ((module) => {



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

/***/ 2940:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var fs = __nccwpck_require__(9896)
var core
if (process.platform === 'win32' || global.TESTING_WINDOWS) {
  core = __nccwpck_require__(9225)
} else {
  core = __nccwpck_require__(1025)
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

/***/ 1025:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = isexe
isexe.sync = sync

var fs = __nccwpck_require__(9896)

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

/***/ 9225:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = isexe
isexe.sync = sync

var fs = __nccwpck_require__(9896)

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

/***/ 976:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



const { PassThrough } = __nccwpck_require__(2203);

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

/***/ 9384:
/***/ ((module) => {



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

/***/ 3772:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = minimatch
minimatch.Minimatch = Minimatch

var path = (function () { try { return __nccwpck_require__(6928) } catch (e) {}}()) || {
  sep: '/'
}
minimatch.sep = path.sep

var GLOBSTAR = minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {}
var expand = __nccwpck_require__(4691)

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

/***/ 6883:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


const path = __nccwpck_require__(6928);
const pathKey = __nccwpck_require__(6689);

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

/***/ 5560:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var wrappy = __nccwpck_require__(8264)
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

/***/ 9969:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


const mimicFn = __nccwpck_require__(9384);

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

/***/ 9024:
/***/ ((module) => {



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

/***/ 6689:
/***/ ((module) => {



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

/***/ 9379:
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

const parseOptions = __nccwpck_require__(356)
const { safeRe: re, t } = __nccwpck_require__(5471)
const cmp = __nccwpck_require__(8646)
const debug = __nccwpck_require__(1159)
const SemVer = __nccwpck_require__(7163)
const Range = __nccwpck_require__(6782)


/***/ }),

/***/ 6782:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



const SPACE_CHARACTERS = /\s+/g

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
      this.formatted = undefined
      return this
    }

    this.options = options
    this.loose = !!options.loose
    this.includePrerelease = !!options.includePrerelease

    // First reduce all whitespace as much as possible so we do not have to rely
    // on potentially slow regexes like \s*. This is then stored and used for
    // future error messages as well.
    this.raw = range.trim().replace(SPACE_CHARACTERS, ' ')

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

    this.formatted = undefined
  }

  get range () {
    if (this.formatted === undefined) {
      this.formatted = ''
      for (let i = 0; i < this.set.length; i++) {
        if (i > 0) {
          this.formatted += '||'
        }
        const comps = this.set[i]
        for (let k = 0; k < comps.length; k++) {
          if (k > 0) {
            this.formatted += ' '
          }
          this.formatted += comps[k].toString().trim()
        }
      }
    }
    return this.formatted
  }

  format () {
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

const LRU = __nccwpck_require__(1383)
const cache = new LRU()

const parseOptions = __nccwpck_require__(356)
const Comparator = __nccwpck_require__(9379)
const debug = __nccwpck_require__(1159)
const SemVer = __nccwpck_require__(7163)
const {
  safeRe: re,
  t,
  comparatorTrimReplace,
  tildeTrimReplace,
  caretTrimReplace,
} = __nccwpck_require__(5471)
const { FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE } = __nccwpck_require__(5101)

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
  comp = comp.replace(re[t.BUILD], '')
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
// TODO build?
const hyphenReplace = incPr => ($0,
  from, fM, fm, fp, fpr, fb,
  to, tM, tm, tp, tpr) => {
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

/***/ 7163:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



const debug = __nccwpck_require__(1159)
const { MAX_LENGTH, MAX_SAFE_INTEGER } = __nccwpck_require__(5101)
const { safeRe: re, t } = __nccwpck_require__(5471)

const parseOptions = __nccwpck_require__(356)
const { compareIdentifiers } = __nccwpck_require__(3348)
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

    if (this.major < other.major) {
      return -1
    }
    if (this.major > other.major) {
      return 1
    }
    if (this.minor < other.minor) {
      return -1
    }
    if (this.minor > other.minor) {
      return 1
    }
    if (this.patch < other.patch) {
      return -1
    }
    if (this.patch > other.patch) {
      return 1
    }
    return 0
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
      debug('build compare', i, a, b)
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
    if (release.startsWith('pre')) {
      if (!identifier && identifierBase === false) {
        throw new Error('invalid increment argument: identifier is empty')
      }
      // Avoid an invalid semver results
      if (identifier) {
        const match = `-${identifier}`.match(this.options.loose ? re[t.PRERELEASELOOSE] : re[t.PRERELEASE])
        if (!match || match[1] !== identifier) {
          throw new Error(`invalid identifier: ${identifier}`)
        }
      }
    }

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
      case 'release':
        if (this.prerelease.length === 0) {
          throw new Error(`version ${this.raw} is not a prerelease`)
        }
        this.prerelease.length = 0
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

/***/ 1799:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



const parse = __nccwpck_require__(6353)
const clean = (version, options) => {
  const s = parse(version.trim().replace(/^[=v]+/, ''), options)
  return s ? s.version : null
}
module.exports = clean


/***/ }),

/***/ 8646:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



const eq = __nccwpck_require__(5082)
const neq = __nccwpck_require__(4974)
const gt = __nccwpck_require__(6599)
const gte = __nccwpck_require__(1236)
const lt = __nccwpck_require__(3872)
const lte = __nccwpck_require__(6717)

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

/***/ 5385:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



const SemVer = __nccwpck_require__(7163)
const parse = __nccwpck_require__(6353)
const { safeRe: re, t } = __nccwpck_require__(5471)

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
    match = version.match(options.includePrerelease ? re[t.COERCEFULL] : re[t.COERCE])
  } else {
    // Find the right-most coercible string that does not share
    // a terminus with a more left-ward coercible string.
    // Eg, '1.2.3.4' wants to coerce '2.3.4', not '3.4' or '4'
    // With includePrerelease option set, '1.2.3.4-rc' wants to coerce '2.3.4-rc', not '2.3.4'
    //
    // Walk through the string checking with a /g regexp
    // Manually set the index so as to pick up overlapping matches.
    // Stop when we get a match that ends at the string end, since no
    // coercible string can be more right-ward without the same terminus.
    const coerceRtlRegex = options.includePrerelease ? re[t.COERCERTLFULL] : re[t.COERCERTL]
    let next
    while ((next = coerceRtlRegex.exec(version)) &&
        (!match || match.index + match[0].length !== version.length)
    ) {
      if (!match ||
            next.index + next[0].length !== match.index + match[0].length) {
        match = next
      }
      coerceRtlRegex.lastIndex = next.index + next[1].length + next[2].length
    }
    // leave it in a clean state
    coerceRtlRegex.lastIndex = -1
  }

  if (match === null) {
    return null
  }

  const major = match[2]
  const minor = match[3] || '0'
  const patch = match[4] || '0'
  const prerelease = options.includePrerelease && match[5] ? `-${match[5]}` : ''
  const build = options.includePrerelease && match[6] ? `+${match[6]}` : ''

  return parse(`${major}.${minor}.${patch}${prerelease}${build}`, options)
}
module.exports = coerce


/***/ }),

/***/ 7648:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



const SemVer = __nccwpck_require__(7163)
const compareBuild = (a, b, loose) => {
  const versionA = new SemVer(a, loose)
  const versionB = new SemVer(b, loose)
  return versionA.compare(versionB) || versionA.compareBuild(versionB)
}
module.exports = compareBuild


/***/ }),

/***/ 6874:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



const compare = __nccwpck_require__(8469)
const compareLoose = (a, b) => compare(a, b, true)
module.exports = compareLoose


/***/ }),

/***/ 8469:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



const SemVer = __nccwpck_require__(7163)
const compare = (a, b, loose) =>
  new SemVer(a, loose).compare(new SemVer(b, loose))

module.exports = compare


/***/ }),

/***/ 711:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



const parse = __nccwpck_require__(6353)

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

    // If the main part has no difference
    if (lowVersion.compareMain(highVersion) === 0) {
      if (lowVersion.minor && !lowVersion.patch) {
        return 'minor'
      }
      return 'patch'
    }
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

  // high and low are prereleases
  return 'prerelease'
}

module.exports = diff


/***/ }),

/***/ 5082:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



const compare = __nccwpck_require__(8469)
const eq = (a, b, loose) => compare(a, b, loose) === 0
module.exports = eq


/***/ }),

/***/ 6599:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



const compare = __nccwpck_require__(8469)
const gt = (a, b, loose) => compare(a, b, loose) > 0
module.exports = gt


/***/ }),

/***/ 1236:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



const compare = __nccwpck_require__(8469)
const gte = (a, b, loose) => compare(a, b, loose) >= 0
module.exports = gte


/***/ }),

/***/ 2338:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



const SemVer = __nccwpck_require__(7163)

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

/***/ 3872:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



const compare = __nccwpck_require__(8469)
const lt = (a, b, loose) => compare(a, b, loose) < 0
module.exports = lt


/***/ }),

/***/ 6717:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



const compare = __nccwpck_require__(8469)
const lte = (a, b, loose) => compare(a, b, loose) <= 0
module.exports = lte


/***/ }),

/***/ 8511:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



const SemVer = __nccwpck_require__(7163)
const major = (a, loose) => new SemVer(a, loose).major
module.exports = major


/***/ }),

/***/ 2603:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



const SemVer = __nccwpck_require__(7163)
const minor = (a, loose) => new SemVer(a, loose).minor
module.exports = minor


/***/ }),

/***/ 4974:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



const compare = __nccwpck_require__(8469)
const neq = (a, b, loose) => compare(a, b, loose) !== 0
module.exports = neq


/***/ }),

/***/ 6353:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



const SemVer = __nccwpck_require__(7163)
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

/***/ 8756:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



const SemVer = __nccwpck_require__(7163)
const patch = (a, loose) => new SemVer(a, loose).patch
module.exports = patch


/***/ }),

/***/ 5714:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



const parse = __nccwpck_require__(6353)
const prerelease = (version, options) => {
  const parsed = parse(version, options)
  return (parsed && parsed.prerelease.length) ? parsed.prerelease : null
}
module.exports = prerelease


/***/ }),

/***/ 2173:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



const compare = __nccwpck_require__(8469)
const rcompare = (a, b, loose) => compare(b, a, loose)
module.exports = rcompare


/***/ }),

/***/ 7192:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



const compareBuild = __nccwpck_require__(7648)
const rsort = (list, loose) => list.sort((a, b) => compareBuild(b, a, loose))
module.exports = rsort


/***/ }),

/***/ 8011:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



const Range = __nccwpck_require__(6782)
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

/***/ 9872:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



const compareBuild = __nccwpck_require__(7648)
const sort = (list, loose) => list.sort((a, b) => compareBuild(a, b, loose))
module.exports = sort


/***/ }),

/***/ 8780:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



const parse = __nccwpck_require__(6353)
const valid = (version, options) => {
  const v = parse(version, options)
  return v ? v.version : null
}
module.exports = valid


/***/ }),

/***/ 2088:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



// just pre-load all the stuff that index.js lazily exports
const internalRe = __nccwpck_require__(5471)
const constants = __nccwpck_require__(5101)
const SemVer = __nccwpck_require__(7163)
const identifiers = __nccwpck_require__(3348)
const parse = __nccwpck_require__(6353)
const valid = __nccwpck_require__(8780)
const clean = __nccwpck_require__(1799)
const inc = __nccwpck_require__(2338)
const diff = __nccwpck_require__(711)
const major = __nccwpck_require__(8511)
const minor = __nccwpck_require__(2603)
const patch = __nccwpck_require__(8756)
const prerelease = __nccwpck_require__(5714)
const compare = __nccwpck_require__(8469)
const rcompare = __nccwpck_require__(2173)
const compareLoose = __nccwpck_require__(6874)
const compareBuild = __nccwpck_require__(7648)
const sort = __nccwpck_require__(9872)
const rsort = __nccwpck_require__(7192)
const gt = __nccwpck_require__(6599)
const lt = __nccwpck_require__(3872)
const eq = __nccwpck_require__(5082)
const neq = __nccwpck_require__(4974)
const gte = __nccwpck_require__(1236)
const lte = __nccwpck_require__(6717)
const cmp = __nccwpck_require__(8646)
const coerce = __nccwpck_require__(5385)
const Comparator = __nccwpck_require__(9379)
const Range = __nccwpck_require__(6782)
const satisfies = __nccwpck_require__(8011)
const toComparators = __nccwpck_require__(4750)
const maxSatisfying = __nccwpck_require__(3193)
const minSatisfying = __nccwpck_require__(8595)
const minVersion = __nccwpck_require__(1866)
const validRange = __nccwpck_require__(4737)
const outside = __nccwpck_require__(280)
const gtr = __nccwpck_require__(2276)
const ltr = __nccwpck_require__(5213)
const intersects = __nccwpck_require__(3465)
const simplifyRange = __nccwpck_require__(2028)
const subset = __nccwpck_require__(1489)
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

/***/ 5101:
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

/***/ 1159:
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

/***/ 3348:
/***/ ((module) => {



const numeric = /^[0-9]+$/
const compareIdentifiers = (a, b) => {
  if (typeof a === 'number' && typeof b === 'number') {
    return a === b ? 0 : a < b ? -1 : 1
  }

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

/***/ 1383:
/***/ ((module) => {



class LRUCache {
  constructor () {
    this.max = 1000
    this.map = new Map()
  }

  get (key) {
    const value = this.map.get(key)
    if (value === undefined) {
      return undefined
    } else {
      // Remove the key from the map and add it to the end
      this.map.delete(key)
      this.map.set(key, value)
      return value
    }
  }

  delete (key) {
    return this.map.delete(key)
  }

  set (key, value) {
    const deleted = this.delete(key)

    if (!deleted && value !== undefined) {
      // If cache is full, delete the least recently used item
      if (this.map.size >= this.max) {
        const firstKey = this.map.keys().next().value
        this.delete(firstKey)
      }

      this.map.set(key, value)
    }

    return this
  }
}

module.exports = LRUCache


/***/ }),

/***/ 356:
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

/***/ 5471:
/***/ ((module, exports, __nccwpck_require__) => {



const {
  MAX_SAFE_COMPONENT_LENGTH,
  MAX_SAFE_BUILD_LENGTH,
  MAX_LENGTH,
} = __nccwpck_require__(5101)
const debug = __nccwpck_require__(1159)
exports = module.exports = {}

// The actual regexps go on exports.re
const re = exports.re = []
const safeRe = exports.safeRe = []
const src = exports.src = []
const safeSrc = exports.safeSrc = []
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
  safeSrc[index] = safe
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
// Non-numeric identifiers include numeric identifiers but can be longer.
// Therefore non-numeric identifiers must go first.

createToken('PRERELEASEIDENTIFIER', `(?:${src[t.NONNUMERICIDENTIFIER]
}|${src[t.NUMERICIDENTIFIER]})`)

createToken('PRERELEASEIDENTIFIERLOOSE', `(?:${src[t.NONNUMERICIDENTIFIER]
}|${src[t.NUMERICIDENTIFIERLOOSE]})`)

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
createToken('COERCEPLAIN', `${'(^|[^\\d])' +
              '(\\d{1,'}${MAX_SAFE_COMPONENT_LENGTH}})` +
              `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` +
              `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?`)
createToken('COERCE', `${src[t.COERCEPLAIN]}(?:$|[^\\d])`)
createToken('COERCEFULL', src[t.COERCEPLAIN] +
              `(?:${src[t.PRERELEASE]})?` +
              `(?:${src[t.BUILD]})?` +
              `(?:$|[^\\d])`)
createToken('COERCERTL', src[t.COERCE], true)
createToken('COERCERTLFULL', src[t.COERCEFULL], true)

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

/***/ 2276:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



// Determine if version is greater than all the versions possible in the range.
const outside = __nccwpck_require__(280)
const gtr = (version, range, options) => outside(version, range, '>', options)
module.exports = gtr


/***/ }),

/***/ 3465:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



const Range = __nccwpck_require__(6782)
const intersects = (r1, r2, options) => {
  r1 = new Range(r1, options)
  r2 = new Range(r2, options)
  return r1.intersects(r2, options)
}
module.exports = intersects


/***/ }),

/***/ 5213:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



const outside = __nccwpck_require__(280)
// Determine if version is less than all the versions possible in the range
const ltr = (version, range, options) => outside(version, range, '<', options)
module.exports = ltr


/***/ }),

/***/ 3193:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



const SemVer = __nccwpck_require__(7163)
const Range = __nccwpck_require__(6782)

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

/***/ 8595:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



const SemVer = __nccwpck_require__(7163)
const Range = __nccwpck_require__(6782)
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

/***/ 1866:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



const SemVer = __nccwpck_require__(7163)
const Range = __nccwpck_require__(6782)
const gt = __nccwpck_require__(6599)

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

/***/ 280:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



const SemVer = __nccwpck_require__(7163)
const Comparator = __nccwpck_require__(9379)
const { ANY } = Comparator
const Range = __nccwpck_require__(6782)
const satisfies = __nccwpck_require__(8011)
const gt = __nccwpck_require__(6599)
const lt = __nccwpck_require__(3872)
const lte = __nccwpck_require__(6717)
const gte = __nccwpck_require__(1236)

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

/***/ 2028:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



// given a set of versions and a range, create a "simplified" range
// that includes the same versions that the original range does
// If the original range is shorter than the simplified one, return that.
const satisfies = __nccwpck_require__(8011)
const compare = __nccwpck_require__(8469)
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

/***/ 1489:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



const Range = __nccwpck_require__(6782)
const Comparator = __nccwpck_require__(9379)
const { ANY } = Comparator
const satisfies = __nccwpck_require__(8011)
const compare = __nccwpck_require__(8469)

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
//   - If LT.semver has a prerelease, and not in prerelease mode
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

/***/ 4750:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



const Range = __nccwpck_require__(6782)

// Mostly just for testing and legacy API reasons
const toComparators = (range, options) =>
  new Range(range, options).set
    .map(comp => comp.map(c => c.value).join(' ').trim().split(' '))

module.exports = toComparators


/***/ }),

/***/ 4737:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {



const Range = __nccwpck_require__(6782)
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

/***/ 9152:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


const shebangRegex = __nccwpck_require__(7334);

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

/***/ 7334:
/***/ ((module) => {


module.exports = /^#!(.*)/;


/***/ }),

/***/ 1414:
/***/ ((module) => {



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

/***/ 8264:
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

/***/ 2613:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("assert");

/***/ }),

/***/ 181:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("buffer");

/***/ }),

/***/ 5317:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("child_process");

/***/ }),

/***/ 4434:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("events");

/***/ }),

/***/ 9896:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("fs");

/***/ }),

/***/ 857:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("os");

/***/ }),

/***/ 6928:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("path");

/***/ }),

/***/ 2203:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("stream");

/***/ }),

/***/ 9023:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("util");

/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __nccwpck_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	var threw = true;
/******/ 	try {
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 		threw = false;
/******/ 	} finally {
/******/ 		if(threw) delete __webpack_module_cache__[moduleId];
/******/ 	}
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__nccwpck_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__nccwpck_require__.o(definition, key) && !__nccwpck_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__nccwpck_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__nccwpck_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/compat */
/******/ 
/******/ if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = new URL('.', import.meta.url).pathname.slice(import.meta.url.match(/^file:\/\/\/\w:/) ? 1 : 0, -1) + "/";
/******/ 
/************************************************************************/
var __webpack_exports__ = {};

// NAMESPACE OBJECT: ./node_modules/prettier/plugins/markdown.mjs
var markdown_namespaceObject = {};
__nccwpck_require__.r(markdown_namespaceObject);
__nccwpck_require__.d(markdown_namespaceObject, {
  "default": () => (fC),
  languages: () => (_i),
  options: () => (Si),
  parsers: () => (On),
  printers: () => (qm)
});

// EXTERNAL MODULE: external "os"
var external_os_ = __nccwpck_require__(857);
;// CONCATENATED MODULE: ./node_modules/@actions/core/lib/utils.js
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function utils_toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
/**
 *
 * @param annotationProperties
 * @returns The command properties to send with the actual annotation command
 * See IssueCommandProperties: https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionCommandManager.cs#L646
 */
function utils_toCommandProperties(annotationProperties) {
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
//# sourceMappingURL=utils.js.map
;// CONCATENATED MODULE: ./node_modules/@actions/core/lib/command.js


/**
 * Issues a command to the GitHub Actions runner
 *
 * @param command - The command name to issue
 * @param properties - Additional properties for the command (key-value pairs)
 * @param message - The message to include with the command
 * @remarks
 * This function outputs a specially formatted string to stdout that the Actions
 * runner interprets as a command. These commands can control workflow behavior,
 * set outputs, create annotations, mask values, and more.
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * @example
 * ```typescript
 * // Issue a warning annotation
 * issueCommand('warning', {}, 'This is a warning message');
 * // Output: ::warning::This is a warning message
 *
 * // Set an environment variable
 * issueCommand('set-env', { name: 'MY_VAR' }, 'some value');
 * // Output: ::set-env name=MY_VAR::some value
 *
 * // Add a secret mask
 * issueCommand('add-mask', {}, 'secretValue123');
 * // Output: ::add-mask::secretValue123
 * ```
 *
 * @internal
 * This is an internal utility function that powers the public API functions
 * such as setSecret, warning, error, and exportVariable.
 */
function command_issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + external_os_.EOL);
}
function command_issue(name, message = '') {
    command_issueCommand(name, {}, message);
}
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
    return utils_toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map
;// CONCATENATED MODULE: external "crypto"
const external_crypto_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("crypto");
// EXTERNAL MODULE: external "fs"
var external_fs_ = __nccwpck_require__(9896);
;// CONCATENATED MODULE: ./node_modules/@actions/core/lib/file-command.js
// For internal use, subject to change.
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */




function file_command_issueFileCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!external_fs_.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    external_fs_.appendFileSync(filePath, `${utils_toCommandValue(message)}${external_os_.EOL}`, {
        encoding: 'utf8'
    });
}
function file_command_prepareKeyValueMessage(key, value) {
    const delimiter = `ghadelimiter_${external_crypto_namespaceObject.randomUUID()}`;
    const convertedValue = utils_toCommandValue(value);
    // These should realistically never happen, but just in case someone finds a
    // way to exploit uuid generation let's not allow keys or values that contain
    // the delimiter.
    if (key.includes(delimiter)) {
        throw new Error(`Unexpected input: name should not contain the delimiter "${delimiter}"`);
    }
    if (convertedValue.includes(delimiter)) {
        throw new Error(`Unexpected input: value should not contain the delimiter "${delimiter}"`);
    }
    return `${key}<<${delimiter}${external_os_.EOL}${convertedValue}${external_os_.EOL}${delimiter}`;
}
//# sourceMappingURL=file-command.js.map
// EXTERNAL MODULE: external "path"
var external_path_ = __nccwpck_require__(6928);
;// CONCATENATED MODULE: external "@actions/http-client"
var x = (y) => {
	var x = {}; __nccwpck_require__.d(x, y); return x
} 
var y = (x) => (() => (x))
const http_client_namespaceObject = x({  });
;// CONCATENATED MODULE: ./node_modules/@actions/http-client/lib/auth.js
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
class auth_BearerCredentialHandler {
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
//# sourceMappingURL=auth.js.map
;// CONCATENATED MODULE: ./node_modules/@actions/core/lib/oidc-utils.js
var oidc_utils_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



class oidc_utils_OidcClient {
    static createHttpClient(allowRetry = true, maxRetry = 10) {
        const requestOptions = {
            allowRetries: allowRetry,
            maxRetries: maxRetry
        };
        return new HttpClient('actions/oidc-client', [new BearerCredentialHandler(oidc_utils_OidcClient.getRequestToken())], requestOptions);
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
        return oidc_utils_awaiter(this, void 0, void 0, function* () {
            var _a;
            const httpclient = oidc_utils_OidcClient.createHttpClient();
            const res = yield httpclient
                .getJson(id_token_url)
                .catch(error => {
                throw new Error(`Failed to get ID Token. \n 
        Error Code : ${error.statusCode}\n 
        Error Message: ${error.message}`);
            });
            const id_token = (_a = res.result) === null || _a === void 0 ? void 0 : _a.value;
            if (!id_token) {
                throw new Error('Response json body do not have ID Token field');
            }
            return id_token;
        });
    }
    static getIDToken(audience) {
        return oidc_utils_awaiter(this, void 0, void 0, function* () {
            try {
                // New ID Token is requested from action service
                let id_token_url = oidc_utils_OidcClient.getIDTokenUrl();
                if (audience) {
                    const encodedAudience = encodeURIComponent(audience);
                    id_token_url = `${id_token_url}&audience=${encodedAudience}`;
                }
                debug(`ID token url is ${id_token_url}`);
                const id_token = yield oidc_utils_OidcClient.getCall(id_token_url);
                setSecret(id_token);
                return id_token;
            }
            catch (error) {
                throw new Error(`Error message: ${error.message}`);
            }
        });
    }
}
//# sourceMappingURL=oidc-utils.js.map
;// CONCATENATED MODULE: ./node_modules/@actions/core/lib/summary.js
var summary_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


const { access, appendFile, writeFile } = external_fs_.promises;
const SUMMARY_ENV_VAR = 'GITHUB_STEP_SUMMARY';
const SUMMARY_DOCS_URL = 'https://docs.github.com/actions/using-workflows/workflow-commands-for-github-actions#adding-a-job-summary';
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
        return summary_awaiter(this, void 0, void 0, function* () {
            if (this._filePath) {
                return this._filePath;
            }
            const pathFromEnv = process.env[SUMMARY_ENV_VAR];
            if (!pathFromEnv) {
                throw new Error(`Unable to find environment variable for $${SUMMARY_ENV_VAR}. Check if your runtime environment supports job summaries.`);
            }
            try {
                yield access(pathFromEnv, external_fs_.constants.R_OK | external_fs_.constants.W_OK);
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
        return summary_awaiter(this, void 0, void 0, function* () {
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
        return summary_awaiter(this, void 0, void 0, function* () {
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
        return this.addRaw(external_os_.EOL);
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
const markdownSummary = (/* unused pure expression or super */ null && (_summary));
const summary = (/* unused pure expression or super */ null && (_summary));
//# sourceMappingURL=summary.js.map
;// CONCATENATED MODULE: ./node_modules/@actions/core/lib/path-utils.js

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
//# sourceMappingURL=path-utils.js.map
;// CONCATENATED MODULE: external "string_decoder"
const external_string_decoder_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("string_decoder");
// EXTERNAL MODULE: external "events"
var external_events_ = __nccwpck_require__(4434);
// EXTERNAL MODULE: external "child_process"
var external_child_process_ = __nccwpck_require__(5317);
// EXTERNAL MODULE: external "assert"
var external_assert_ = __nccwpck_require__(2613);
;// CONCATENATED MODULE: ./node_modules/@actions/io/lib/io-util.js
var io_util_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


const { chmod, copyFile, lstat, mkdir, open: io_util_open, readdir, rename, rm, rmdir, stat, symlink, unlink } = external_fs_.promises;
// export const {open} = 'fs'
const IS_WINDOWS = process.platform === 'win32';
/**
 * Custom implementation of readlink to ensure Windows junctions
 * maintain trailing backslash for backward compatibility with Node.js < 24
 *
 * In Node.js 20, Windows junctions (directory symlinks) always returned paths
 * with trailing backslashes. Node.js 24 removed this behavior, which breaks
 * code that relied on this format for path operations.
 *
 * This implementation restores the Node 20 behavior by adding a trailing
 * backslash to all junction results on Windows.
 */
function readlink(fsPath) {
    return io_util_awaiter(this, void 0, void 0, function* () {
        const result = yield fs.promises.readlink(fsPath);
        // On Windows, restore Node 20 behavior: add trailing backslash to all results
        // since junctions on Windows are always directory links
        if (IS_WINDOWS && !result.endsWith('\\')) {
            return `${result}\\`;
        }
        return result;
    });
}
// See https://github.com/nodejs/node/blob/d0153aee367422d0858105abec186da4dff0a0c5/deps/uv/include/uv/win.h#L691
const UV_FS_O_EXLOCK = 0x10000000;
const READONLY = external_fs_.constants.O_RDONLY;
function exists(fsPath) {
    return io_util_awaiter(this, void 0, void 0, function* () {
        try {
            yield stat(fsPath);
        }
        catch (err) {
            if (err.code === 'ENOENT') {
                return false;
            }
            throw err;
        }
        return true;
    });
}
function isDirectory(fsPath_1) {
    return io_util_awaiter(this, arguments, void 0, function* (fsPath, useStat = false) {
        const stats = useStat ? yield stat(fsPath) : yield lstat(fsPath);
        return stats.isDirectory();
    });
}
/**
 * On OSX/Linux, true if path starts with '/'. On Windows, true for paths like:
 * \, \hello, \\hello\share, C:, and C:\hello (and corresponding alternate separator cases).
 */
function isRooted(p) {
    p = normalizeSeparators(p);
    if (!p) {
        throw new Error('isRooted() parameter "p" cannot be empty');
    }
    if (IS_WINDOWS) {
        return (p.startsWith('\\') || /^[A-Z]:/i.test(p) // e.g. \ or \hello or \\hello
        ); // e.g. C: or C:\hello
    }
    return p.startsWith('/');
}
/**
 * Best effort attempt to determine whether a file exists and is executable.
 * @param filePath    file path to check
 * @param extensions  additional file extensions to try
 * @return if file exists and is executable, returns the file path. otherwise empty string.
 */
function tryGetExecutablePath(filePath, extensions) {
    return io_util_awaiter(this, void 0, void 0, function* () {
        let stats = undefined;
        try {
            // test file exists
            stats = yield stat(filePath);
        }
        catch (err) {
            if (err.code !== 'ENOENT') {
                // eslint-disable-next-line no-console
                console.log(`Unexpected error attempting to determine if executable file exists '${filePath}': ${err}`);
            }
        }
        if (stats && stats.isFile()) {
            if (IS_WINDOWS) {
                // on Windows, test for valid extension
                const upperExt = external_path_.extname(filePath).toUpperCase();
                if (extensions.some(validExt => validExt.toUpperCase() === upperExt)) {
                    return filePath;
                }
            }
            else {
                if (isUnixExecutable(stats)) {
                    return filePath;
                }
            }
        }
        // try each extension
        const originalFilePath = filePath;
        for (const extension of extensions) {
            filePath = originalFilePath + extension;
            stats = undefined;
            try {
                stats = yield stat(filePath);
            }
            catch (err) {
                if (err.code !== 'ENOENT') {
                    // eslint-disable-next-line no-console
                    console.log(`Unexpected error attempting to determine if executable file exists '${filePath}': ${err}`);
                }
            }
            if (stats && stats.isFile()) {
                if (IS_WINDOWS) {
                    // preserve the case of the actual file (since an extension was appended)
                    try {
                        const directory = external_path_.dirname(filePath);
                        const upperName = external_path_.basename(filePath).toUpperCase();
                        for (const actualName of yield readdir(directory)) {
                            if (upperName === actualName.toUpperCase()) {
                                filePath = external_path_.join(directory, actualName);
                                break;
                            }
                        }
                    }
                    catch (err) {
                        // eslint-disable-next-line no-console
                        console.log(`Unexpected error attempting to determine the actual case of the file '${filePath}': ${err}`);
                    }
                    return filePath;
                }
                else {
                    if (isUnixExecutable(stats)) {
                        return filePath;
                    }
                }
            }
        }
        return '';
    });
}
function normalizeSeparators(p) {
    p = p || '';
    if (IS_WINDOWS) {
        // convert slashes on Windows
        p = p.replace(/\//g, '\\');
        // remove redundant slashes
        return p.replace(/\\\\+/g, '\\');
    }
    // remove redundant slashes
    return p.replace(/\/\/+/g, '/');
}
// on Mac/Linux, test the execute bit
//     R   W  X  R  W X R W X
//   256 128 64 32 16 8 4 2 1
function isUnixExecutable(stats) {
    return ((stats.mode & 1) > 0 ||
        ((stats.mode & 8) > 0 &&
            process.getgid !== undefined &&
            stats.gid === process.getgid()) ||
        ((stats.mode & 64) > 0 &&
            process.getuid !== undefined &&
            stats.uid === process.getuid()));
}
// Get the path of cmd.exe in windows
function getCmdPath() {
    var _a;
    return (_a = process.env['COMSPEC']) !== null && _a !== void 0 ? _a : `cmd.exe`;
}
//# sourceMappingURL=io-util.js.map
;// CONCATENATED MODULE: ./node_modules/@actions/io/lib/io.js
var io_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



/**
 * Copies a file or folder.
 * Based off of shelljs - https://github.com/shelljs/shelljs/blob/9237f66c52e5daa40458f94f9565e18e8132f5a6/src/cp.js
 *
 * @param     source    source path
 * @param     dest      destination path
 * @param     options   optional. See CopyOptions.
 */
function cp(source_1, dest_1) {
    return io_awaiter(this, arguments, void 0, function* (source, dest, options = {}) {
        const { force, recursive, copySourceDirectory } = readCopyOptions(options);
        const destStat = (yield ioUtil.exists(dest)) ? yield ioUtil.stat(dest) : null;
        // Dest is an existing file, but not forcing
        if (destStat && destStat.isFile() && !force) {
            return;
        }
        // If dest is an existing directory, should copy inside.
        const newDest = destStat && destStat.isDirectory() && copySourceDirectory
            ? path.join(dest, path.basename(source))
            : dest;
        if (!(yield ioUtil.exists(source))) {
            throw new Error(`no such file or directory: ${source}`);
        }
        const sourceStat = yield ioUtil.stat(source);
        if (sourceStat.isDirectory()) {
            if (!recursive) {
                throw new Error(`Failed to copy. ${source} is a directory, but tried to copy without recursive flag.`);
            }
            else {
                yield cpDirRecursive(source, newDest, 0, force);
            }
        }
        else {
            if (path.relative(source, newDest) === '') {
                // a file cannot be copied to itself
                throw new Error(`'${newDest}' and '${source}' are the same file`);
            }
            yield io_copyFile(source, newDest, force);
        }
    });
}
/**
 * Moves a path.
 *
 * @param     source    source path
 * @param     dest      destination path
 * @param     options   optional. See MoveOptions.
 */
function mv(source_1, dest_1) {
    return io_awaiter(this, arguments, void 0, function* (source, dest, options = {}) {
        if (yield ioUtil.exists(dest)) {
            let destExists = true;
            if (yield ioUtil.isDirectory(dest)) {
                // If dest is directory copy src into dest
                dest = path.join(dest, path.basename(source));
                destExists = yield ioUtil.exists(dest);
            }
            if (destExists) {
                if (options.force == null || options.force) {
                    yield rmRF(dest);
                }
                else {
                    throw new Error('Destination already exists');
                }
            }
        }
        yield mkdirP(path.dirname(dest));
        yield ioUtil.rename(source, dest);
    });
}
/**
 * Remove a path recursively with force
 *
 * @param inputPath path to remove
 */
function rmRF(inputPath) {
    return io_awaiter(this, void 0, void 0, function* () {
        if (ioUtil.IS_WINDOWS) {
            // Check for invalid characters
            // https://docs.microsoft.com/en-us/windows/win32/fileio/naming-a-file
            if (/[*"<>|]/.test(inputPath)) {
                throw new Error('File path must not contain `*`, `"`, `<`, `>` or `|` on Windows');
            }
        }
        try {
            // note if path does not exist, error is silent
            yield ioUtil.rm(inputPath, {
                force: true,
                maxRetries: 3,
                recursive: true,
                retryDelay: 300
            });
        }
        catch (err) {
            throw new Error(`File was unable to be removed ${err}`);
        }
    });
}
/**
 * Make a directory.  Creates the full path with folders in between
 * Will throw if it fails
 *
 * @param   fsPath        path to create
 * @returns Promise<void>
 */
function mkdirP(fsPath) {
    return io_awaiter(this, void 0, void 0, function* () {
        ok(fsPath, 'a path argument must be provided');
        yield ioUtil.mkdir(fsPath, { recursive: true });
    });
}
/**
 * Returns path of a tool had the tool actually been invoked.  Resolves via paths.
 * If you check and the tool does not exist, it will throw.
 *
 * @param     tool              name of the tool
 * @param     check             whether to check if tool exists
 * @returns   Promise<string>   path to tool
 */
function which(tool, check) {
    return io_awaiter(this, void 0, void 0, function* () {
        if (!tool) {
            throw new Error("parameter 'tool' is required");
        }
        // recursive when check=true
        if (check) {
            const result = yield which(tool, false);
            if (!result) {
                if (IS_WINDOWS) {
                    throw new Error(`Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also verify the file has a valid extension for an executable file.`);
                }
                else {
                    throw new Error(`Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also check the file mode to verify the file is executable.`);
                }
            }
            return result;
        }
        const matches = yield findInPath(tool);
        if (matches && matches.length > 0) {
            return matches[0];
        }
        return '';
    });
}
/**
 * Returns a list of all occurrences of the given tool on the system path.
 *
 * @returns   Promise<string[]>  the paths of the tool
 */
function findInPath(tool) {
    return io_awaiter(this, void 0, void 0, function* () {
        if (!tool) {
            throw new Error("parameter 'tool' is required");
        }
        // build the list of extensions to try
        const extensions = [];
        if (IS_WINDOWS && process.env['PATHEXT']) {
            for (const extension of process.env['PATHEXT'].split(external_path_.delimiter)) {
                if (extension) {
                    extensions.push(extension);
                }
            }
        }
        // if it's rooted, return it if exists. otherwise return empty.
        if (isRooted(tool)) {
            const filePath = yield tryGetExecutablePath(tool, extensions);
            if (filePath) {
                return [filePath];
            }
            return [];
        }
        // if any path separators, return empty
        if (tool.includes(external_path_.sep)) {
            return [];
        }
        // build the list of directories
        //
        // Note, technically "where" checks the current directory on Windows. From a toolkit perspective,
        // it feels like we should not do this. Checking the current directory seems like more of a use
        // case of a shell, and the which() function exposed by the toolkit should strive for consistency
        // across platforms.
        const directories = [];
        if (process.env.PATH) {
            for (const p of process.env.PATH.split(external_path_.delimiter)) {
                if (p) {
                    directories.push(p);
                }
            }
        }
        // find all matches
        const matches = [];
        for (const directory of directories) {
            const filePath = yield tryGetExecutablePath(external_path_.join(directory, tool), extensions);
            if (filePath) {
                matches.push(filePath);
            }
        }
        return matches;
    });
}
function readCopyOptions(options) {
    const force = options.force == null ? true : options.force;
    const recursive = Boolean(options.recursive);
    const copySourceDirectory = options.copySourceDirectory == null
        ? true
        : Boolean(options.copySourceDirectory);
    return { force, recursive, copySourceDirectory };
}
function cpDirRecursive(sourceDir, destDir, currentDepth, force) {
    return io_awaiter(this, void 0, void 0, function* () {
        // Ensure there is not a run away recursive copy
        if (currentDepth >= 255)
            return;
        currentDepth++;
        yield mkdirP(destDir);
        const files = yield ioUtil.readdir(sourceDir);
        for (const fileName of files) {
            const srcFile = `${sourceDir}/${fileName}`;
            const destFile = `${destDir}/${fileName}`;
            const srcFileStat = yield ioUtil.lstat(srcFile);
            if (srcFileStat.isDirectory()) {
                // Recurse
                yield cpDirRecursive(srcFile, destFile, currentDepth, force);
            }
            else {
                yield io_copyFile(srcFile, destFile, force);
            }
        }
        // Change the mode for the newly created directory
        yield ioUtil.chmod(destDir, (yield ioUtil.stat(sourceDir)).mode);
    });
}
// Buffered file copy
function io_copyFile(srcFile, destFile, force) {
    return io_awaiter(this, void 0, void 0, function* () {
        if ((yield ioUtil.lstat(srcFile)).isSymbolicLink()) {
            // unlink/re-link it
            try {
                yield ioUtil.lstat(destFile);
                yield ioUtil.unlink(destFile);
            }
            catch (e) {
                // Try to override file permission
                if (e.code === 'EPERM') {
                    yield ioUtil.chmod(destFile, '0666');
                    yield ioUtil.unlink(destFile);
                }
                // other errors = it doesn't exist, no work to do
            }
            // Copy over symlink
            const symlinkFull = yield ioUtil.readlink(srcFile);
            yield ioUtil.symlink(symlinkFull, destFile, ioUtil.IS_WINDOWS ? 'junction' : null);
        }
        else if (!(yield ioUtil.exists(destFile)) || force) {
            yield ioUtil.copyFile(srcFile, destFile);
        }
    });
}
//# sourceMappingURL=io.js.map
;// CONCATENATED MODULE: external "timers"
const external_timers_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("timers");
;// CONCATENATED MODULE: ./node_modules/@actions/exec/lib/toolrunner.js
var toolrunner_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};







/* eslint-disable @typescript-eslint/unbound-method */
const toolrunner_IS_WINDOWS = process.platform === 'win32';
/*
 * Class for running command line tools. Handles quoting and arg parsing in a platform agnostic way.
 */
class ToolRunner extends external_events_.EventEmitter {
    constructor(toolPath, args, options) {
        super();
        if (!toolPath) {
            throw new Error("Parameter 'toolPath' cannot be null or empty.");
        }
        this.toolPath = toolPath;
        this.args = args || [];
        this.options = options || {};
    }
    _debug(message) {
        if (this.options.listeners && this.options.listeners.debug) {
            this.options.listeners.debug(message);
        }
    }
    _getCommandString(options, noPrefix) {
        const toolPath = this._getSpawnFileName();
        const args = this._getSpawnArgs(options);
        let cmd = noPrefix ? '' : '[command]'; // omit prefix when piped to a second tool
        if (toolrunner_IS_WINDOWS) {
            // Windows + cmd file
            if (this._isCmdFile()) {
                cmd += toolPath;
                for (const a of args) {
                    cmd += ` ${a}`;
                }
            }
            // Windows + verbatim
            else if (options.windowsVerbatimArguments) {
                cmd += `"${toolPath}"`;
                for (const a of args) {
                    cmd += ` ${a}`;
                }
            }
            // Windows (regular)
            else {
                cmd += this._windowsQuoteCmdArg(toolPath);
                for (const a of args) {
                    cmd += ` ${this._windowsQuoteCmdArg(a)}`;
                }
            }
        }
        else {
            // OSX/Linux - this can likely be improved with some form of quoting.
            // creating processes on Unix is fundamentally different than Windows.
            // on Unix, execvp() takes an arg array.
            cmd += toolPath;
            for (const a of args) {
                cmd += ` ${a}`;
            }
        }
        return cmd;
    }
    _processLineBuffer(data, strBuffer, onLine) {
        try {
            let s = strBuffer + data.toString();
            let n = s.indexOf(external_os_.EOL);
            while (n > -1) {
                const line = s.substring(0, n);
                onLine(line);
                // the rest of the string ...
                s = s.substring(n + external_os_.EOL.length);
                n = s.indexOf(external_os_.EOL);
            }
            return s;
        }
        catch (err) {
            // streaming lines to console is best effort.  Don't fail a build.
            this._debug(`error processing line. Failed with error ${err}`);
            return '';
        }
    }
    _getSpawnFileName() {
        if (toolrunner_IS_WINDOWS) {
            if (this._isCmdFile()) {
                return process.env['COMSPEC'] || 'cmd.exe';
            }
        }
        return this.toolPath;
    }
    _getSpawnArgs(options) {
        if (toolrunner_IS_WINDOWS) {
            if (this._isCmdFile()) {
                let argline = `/D /S /C "${this._windowsQuoteCmdArg(this.toolPath)}`;
                for (const a of this.args) {
                    argline += ' ';
                    argline += options.windowsVerbatimArguments
                        ? a
                        : this._windowsQuoteCmdArg(a);
                }
                argline += '"';
                return [argline];
            }
        }
        return this.args;
    }
    _endsWith(str, end) {
        return str.endsWith(end);
    }
    _isCmdFile() {
        const upperToolPath = this.toolPath.toUpperCase();
        return (this._endsWith(upperToolPath, '.CMD') ||
            this._endsWith(upperToolPath, '.BAT'));
    }
    _windowsQuoteCmdArg(arg) {
        // for .exe, apply the normal quoting rules that libuv applies
        if (!this._isCmdFile()) {
            return this._uvQuoteCmdArg(arg);
        }
        // otherwise apply quoting rules specific to the cmd.exe command line parser.
        // the libuv rules are generic and are not designed specifically for cmd.exe
        // command line parser.
        //
        // for a detailed description of the cmd.exe command line parser, refer to
        // http://stackoverflow.com/questions/4094699/how-does-the-windows-command-interpreter-cmd-exe-parse-scripts/7970912#7970912
        // need quotes for empty arg
        if (!arg) {
            return '""';
        }
        // determine whether the arg needs to be quoted
        const cmdSpecialChars = [
            ' ',
            '\t',
            '&',
            '(',
            ')',
            '[',
            ']',
            '{',
            '}',
            '^',
            '=',
            ';',
            '!',
            "'",
            '+',
            ',',
            '`',
            '~',
            '|',
            '<',
            '>',
            '"'
        ];
        let needsQuotes = false;
        for (const char of arg) {
            if (cmdSpecialChars.some(x => x === char)) {
                needsQuotes = true;
                break;
            }
        }
        // short-circuit if quotes not needed
        if (!needsQuotes) {
            return arg;
        }
        // the following quoting rules are very similar to the rules that by libuv applies.
        //
        // 1) wrap the string in quotes
        //
        // 2) double-up quotes - i.e. " => ""
        //
        //    this is different from the libuv quoting rules. libuv replaces " with \", which unfortunately
        //    doesn't work well with a cmd.exe command line.
        //
        //    note, replacing " with "" also works well if the arg is passed to a downstream .NET console app.
        //    for example, the command line:
        //          foo.exe "myarg:""my val"""
        //    is parsed by a .NET console app into an arg array:
        //          [ "myarg:\"my val\"" ]
        //    which is the same end result when applying libuv quoting rules. although the actual
        //    command line from libuv quoting rules would look like:
        //          foo.exe "myarg:\"my val\""
        //
        // 3) double-up slashes that precede a quote,
        //    e.g.  hello \world    => "hello \world"
        //          hello\"world    => "hello\\""world"
        //          hello\\"world   => "hello\\\\""world"
        //          hello world\    => "hello world\\"
        //
        //    technically this is not required for a cmd.exe command line, or the batch argument parser.
        //    the reasons for including this as a .cmd quoting rule are:
        //
        //    a) this is optimized for the scenario where the argument is passed from the .cmd file to an
        //       external program. many programs (e.g. .NET console apps) rely on the slash-doubling rule.
        //
        //    b) it's what we've been doing previously (by deferring to node default behavior) and we
        //       haven't heard any complaints about that aspect.
        //
        // note, a weakness of the quoting rules chosen here, is that % is not escaped. in fact, % cannot be
        // escaped when used on the command line directly - even though within a .cmd file % can be escaped
        // by using %%.
        //
        // the saving grace is, on the command line, %var% is left as-is if var is not defined. this contrasts
        // the line parsing rules within a .cmd file, where if var is not defined it is replaced with nothing.
        //
        // one option that was explored was replacing % with ^% - i.e. %var% => ^%var^%. this hack would
        // often work, since it is unlikely that var^ would exist, and the ^ character is removed when the
        // variable is used. the problem, however, is that ^ is not removed when %* is used to pass the args
        // to an external program.
        //
        // an unexplored potential solution for the % escaping problem, is to create a wrapper .cmd file.
        // % can be escaped within a .cmd file.
        let reverse = '"';
        let quoteHit = true;
        for (let i = arg.length; i > 0; i--) {
            // walk the string in reverse
            reverse += arg[i - 1];
            if (quoteHit && arg[i - 1] === '\\') {
                reverse += '\\'; // double the slash
            }
            else if (arg[i - 1] === '"') {
                quoteHit = true;
                reverse += '"'; // double the quote
            }
            else {
                quoteHit = false;
            }
        }
        reverse += '"';
        return reverse.split('').reverse().join('');
    }
    _uvQuoteCmdArg(arg) {
        // Tool runner wraps child_process.spawn() and needs to apply the same quoting as
        // Node in certain cases where the undocumented spawn option windowsVerbatimArguments
        // is used.
        //
        // Since this function is a port of quote_cmd_arg from Node 4.x (technically, lib UV,
        // see https://github.com/nodejs/node/blob/v4.x/deps/uv/src/win/process.c for details),
        // pasting copyright notice from Node within this function:
        //
        //      Copyright Joyent, Inc. and other Node contributors. All rights reserved.
        //
        //      Permission is hereby granted, free of charge, to any person obtaining a copy
        //      of this software and associated documentation files (the "Software"), to
        //      deal in the Software without restriction, including without limitation the
        //      rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
        //      sell copies of the Software, and to permit persons to whom the Software is
        //      furnished to do so, subject to the following conditions:
        //
        //      The above copyright notice and this permission notice shall be included in
        //      all copies or substantial portions of the Software.
        //
        //      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
        //      IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
        //      FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
        //      AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
        //      LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
        //      FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
        //      IN THE SOFTWARE.
        if (!arg) {
            // Need double quotation for empty argument
            return '""';
        }
        if (!arg.includes(' ') && !arg.includes('\t') && !arg.includes('"')) {
            // No quotation needed
            return arg;
        }
        if (!arg.includes('"') && !arg.includes('\\')) {
            // No embedded double quotes or backslashes, so I can just wrap
            // quote marks around the whole thing.
            return `"${arg}"`;
        }
        // Expected input/output:
        //   input : hello"world
        //   output: "hello\"world"
        //   input : hello""world
        //   output: "hello\"\"world"
        //   input : hello\world
        //   output: hello\world
        //   input : hello\\world
        //   output: hello\\world
        //   input : hello\"world
        //   output: "hello\\\"world"
        //   input : hello\\"world
        //   output: "hello\\\\\"world"
        //   input : hello world\
        //   output: "hello world\\" - note the comment in libuv actually reads "hello world\"
        //                             but it appears the comment is wrong, it should be "hello world\\"
        let reverse = '"';
        let quoteHit = true;
        for (let i = arg.length; i > 0; i--) {
            // walk the string in reverse
            reverse += arg[i - 1];
            if (quoteHit && arg[i - 1] === '\\') {
                reverse += '\\';
            }
            else if (arg[i - 1] === '"') {
                quoteHit = true;
                reverse += '\\';
            }
            else {
                quoteHit = false;
            }
        }
        reverse += '"';
        return reverse.split('').reverse().join('');
    }
    _cloneExecOptions(options) {
        options = options || {};
        const result = {
            cwd: options.cwd || process.cwd(),
            env: options.env || process.env,
            silent: options.silent || false,
            windowsVerbatimArguments: options.windowsVerbatimArguments || false,
            failOnStdErr: options.failOnStdErr || false,
            ignoreReturnCode: options.ignoreReturnCode || false,
            delay: options.delay || 10000
        };
        result.outStream = options.outStream || process.stdout;
        result.errStream = options.errStream || process.stderr;
        return result;
    }
    _getSpawnOptions(options, toolPath) {
        options = options || {};
        const result = {};
        result.cwd = options.cwd;
        result.env = options.env;
        result['windowsVerbatimArguments'] =
            options.windowsVerbatimArguments || this._isCmdFile();
        if (options.windowsVerbatimArguments) {
            result.argv0 = `"${toolPath}"`;
        }
        return result;
    }
    /**
     * Exec a tool.
     * Output will be streamed to the live console.
     * Returns promise with return code
     *
     * @param     tool     path to tool to exec
     * @param     options  optional exec options.  See ExecOptions
     * @returns   number
     */
    exec() {
        return toolrunner_awaiter(this, void 0, void 0, function* () {
            // root the tool path if it is unrooted and contains relative pathing
            if (!isRooted(this.toolPath) &&
                (this.toolPath.includes('/') ||
                    (toolrunner_IS_WINDOWS && this.toolPath.includes('\\')))) {
                // prefer options.cwd if it is specified, however options.cwd may also need to be rooted
                this.toolPath = external_path_.resolve(process.cwd(), this.options.cwd || process.cwd(), this.toolPath);
            }
            // if the tool is only a file name, then resolve it from the PATH
            // otherwise verify it exists (add extension on Windows if necessary)
            this.toolPath = yield which(this.toolPath, true);
            return new Promise((resolve, reject) => toolrunner_awaiter(this, void 0, void 0, function* () {
                this._debug(`exec tool: ${this.toolPath}`);
                this._debug('arguments:');
                for (const arg of this.args) {
                    this._debug(`   ${arg}`);
                }
                const optionsNonNull = this._cloneExecOptions(this.options);
                if (!optionsNonNull.silent && optionsNonNull.outStream) {
                    optionsNonNull.outStream.write(this._getCommandString(optionsNonNull) + external_os_.EOL);
                }
                const state = new ExecState(optionsNonNull, this.toolPath);
                state.on('debug', (message) => {
                    this._debug(message);
                });
                if (this.options.cwd && !(yield exists(this.options.cwd))) {
                    return reject(new Error(`The cwd: ${this.options.cwd} does not exist!`));
                }
                const fileName = this._getSpawnFileName();
                const cp = external_child_process_.spawn(fileName, this._getSpawnArgs(optionsNonNull), this._getSpawnOptions(this.options, fileName));
                let stdbuffer = '';
                if (cp.stdout) {
                    cp.stdout.on('data', (data) => {
                        if (this.options.listeners && this.options.listeners.stdout) {
                            this.options.listeners.stdout(data);
                        }
                        if (!optionsNonNull.silent && optionsNonNull.outStream) {
                            optionsNonNull.outStream.write(data);
                        }
                        stdbuffer = this._processLineBuffer(data, stdbuffer, (line) => {
                            if (this.options.listeners && this.options.listeners.stdline) {
                                this.options.listeners.stdline(line);
                            }
                        });
                    });
                }
                let errbuffer = '';
                if (cp.stderr) {
                    cp.stderr.on('data', (data) => {
                        state.processStderr = true;
                        if (this.options.listeners && this.options.listeners.stderr) {
                            this.options.listeners.stderr(data);
                        }
                        if (!optionsNonNull.silent &&
                            optionsNonNull.errStream &&
                            optionsNonNull.outStream) {
                            const s = optionsNonNull.failOnStdErr
                                ? optionsNonNull.errStream
                                : optionsNonNull.outStream;
                            s.write(data);
                        }
                        errbuffer = this._processLineBuffer(data, errbuffer, (line) => {
                            if (this.options.listeners && this.options.listeners.errline) {
                                this.options.listeners.errline(line);
                            }
                        });
                    });
                }
                cp.on('error', (err) => {
                    state.processError = err.message;
                    state.processExited = true;
                    state.processClosed = true;
                    state.CheckComplete();
                });
                cp.on('exit', (code) => {
                    state.processExitCode = code;
                    state.processExited = true;
                    this._debug(`Exit code ${code} received from tool '${this.toolPath}'`);
                    state.CheckComplete();
                });
                cp.on('close', (code) => {
                    state.processExitCode = code;
                    state.processExited = true;
                    state.processClosed = true;
                    this._debug(`STDIO streams have closed for tool '${this.toolPath}'`);
                    state.CheckComplete();
                });
                state.on('done', (error, exitCode) => {
                    if (stdbuffer.length > 0) {
                        this.emit('stdline', stdbuffer);
                    }
                    if (errbuffer.length > 0) {
                        this.emit('errline', errbuffer);
                    }
                    cp.removeAllListeners();
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(exitCode);
                    }
                });
                if (this.options.input) {
                    if (!cp.stdin) {
                        throw new Error('child process missing stdin');
                    }
                    cp.stdin.end(this.options.input);
                }
            }));
        });
    }
}
/**
 * Convert an arg string to an array of args. Handles escaping
 *
 * @param    argString   string of arguments
 * @returns  string[]    array of arguments
 */
function argStringToArray(argString) {
    const args = [];
    let inQuotes = false;
    let escaped = false;
    let arg = '';
    function append(c) {
        // we only escape double quotes.
        if (escaped && c !== '"') {
            arg += '\\';
        }
        arg += c;
        escaped = false;
    }
    for (let i = 0; i < argString.length; i++) {
        const c = argString.charAt(i);
        if (c === '"') {
            if (!escaped) {
                inQuotes = !inQuotes;
            }
            else {
                append(c);
            }
            continue;
        }
        if (c === '\\' && escaped) {
            append(c);
            continue;
        }
        if (c === '\\' && inQuotes) {
            escaped = true;
            continue;
        }
        if (c === ' ' && !inQuotes) {
            if (arg.length > 0) {
                args.push(arg);
                arg = '';
            }
            continue;
        }
        append(c);
    }
    if (arg.length > 0) {
        args.push(arg.trim());
    }
    return args;
}
class ExecState extends external_events_.EventEmitter {
    constructor(options, toolPath) {
        super();
        this.processClosed = false; // tracks whether the process has exited and stdio is closed
        this.processError = '';
        this.processExitCode = 0;
        this.processExited = false; // tracks whether the process has exited
        this.processStderr = false; // tracks whether stderr was written to
        this.delay = 10000; // 10 seconds
        this.done = false;
        this.timeout = null;
        if (!toolPath) {
            throw new Error('toolPath must not be empty');
        }
        this.options = options;
        this.toolPath = toolPath;
        if (options.delay) {
            this.delay = options.delay;
        }
    }
    CheckComplete() {
        if (this.done) {
            return;
        }
        if (this.processClosed) {
            this._setResult();
        }
        else if (this.processExited) {
            this.timeout = (0,external_timers_namespaceObject.setTimeout)(ExecState.HandleTimeout, this.delay, this);
        }
    }
    _debug(message) {
        this.emit('debug', message);
    }
    _setResult() {
        // determine whether there is an error
        let error;
        if (this.processExited) {
            if (this.processError) {
                error = new Error(`There was an error when attempting to execute the process '${this.toolPath}'. This may indicate the process failed to start. Error: ${this.processError}`);
            }
            else if (this.processExitCode !== 0 && !this.options.ignoreReturnCode) {
                error = new Error(`The process '${this.toolPath}' failed with exit code ${this.processExitCode}`);
            }
            else if (this.processStderr && this.options.failOnStdErr) {
                error = new Error(`The process '${this.toolPath}' failed because one or more lines were written to the STDERR stream`);
            }
        }
        // clear the timeout
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        this.done = true;
        this.emit('done', error, this.processExitCode);
    }
    static HandleTimeout(state) {
        if (state.done) {
            return;
        }
        if (!state.processClosed && state.processExited) {
            const message = `The STDIO streams did not close within ${state.delay / 1000} seconds of the exit event from process '${state.toolPath}'. This may indicate a child process inherited the STDIO streams and has not yet exited.`;
            state._debug(message);
        }
        state._setResult();
    }
}
//# sourceMappingURL=toolrunner.js.map
;// CONCATENATED MODULE: ./node_modules/@actions/exec/lib/exec.js
var exec_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


/**
 * Exec a command.
 * Output will be streamed to the live console.
 * Returns promise with return code
 *
 * @param     commandLine        command to execute (can include additional args). Must be correctly escaped.
 * @param     args               optional arguments for tool. Escaping is handled by the lib.
 * @param     options            optional exec options.  See ExecOptions
 * @returns   Promise<number>    exit code
 */
function exec_exec(commandLine, args, options) {
    return exec_awaiter(this, void 0, void 0, function* () {
        const commandArgs = argStringToArray(commandLine);
        if (commandArgs.length === 0) {
            throw new Error(`Parameter 'commandLine' cannot be null or empty.`);
        }
        // Path to tool to execute should be first arg
        const toolPath = commandArgs[0];
        args = commandArgs.slice(1).concat(args || []);
        const runner = new ToolRunner(toolPath, args, options);
        return runner.exec();
    });
}
/**
 * Exec a command and get the output.
 * Output will be streamed to the live console.
 * Returns promise with the exit code and collected stdout and stderr
 *
 * @param     commandLine           command to execute (can include additional args). Must be correctly escaped.
 * @param     args                  optional arguments for tool. Escaping is handled by the lib.
 * @param     options               optional exec options.  See ExecOptions
 * @returns   Promise<ExecOutput>   exit code, stdout, and stderr
 */
function getExecOutput(commandLine, args, options) {
    return exec_awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        let stdout = '';
        let stderr = '';
        //Using string decoder covers the case where a mult-byte character is split
        const stdoutDecoder = new external_string_decoder_namespaceObject.StringDecoder('utf8');
        const stderrDecoder = new external_string_decoder_namespaceObject.StringDecoder('utf8');
        const originalStdoutListener = (_a = options === null || options === void 0 ? void 0 : options.listeners) === null || _a === void 0 ? void 0 : _a.stdout;
        const originalStdErrListener = (_b = options === null || options === void 0 ? void 0 : options.listeners) === null || _b === void 0 ? void 0 : _b.stderr;
        const stdErrListener = (data) => {
            stderr += stderrDecoder.write(data);
            if (originalStdErrListener) {
                originalStdErrListener(data);
            }
        };
        const stdOutListener = (data) => {
            stdout += stdoutDecoder.write(data);
            if (originalStdoutListener) {
                originalStdoutListener(data);
            }
        };
        const listeners = Object.assign(Object.assign({}, options === null || options === void 0 ? void 0 : options.listeners), { stdout: stdOutListener, stderr: stdErrListener });
        const exitCode = yield exec_exec(commandLine, args, Object.assign(Object.assign({}, options), { listeners }));
        //flush any remaining characters
        stdout += stdoutDecoder.end();
        stderr += stderrDecoder.end();
        return {
            exitCode,
            stdout,
            stderr
        };
    });
}
//# sourceMappingURL=exec.js.map
;// CONCATENATED MODULE: ./node_modules/@actions/core/lib/platform.js
var platform_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


const getWindowsInfo = () => platform_awaiter(void 0, void 0, void 0, function* () {
    const { stdout: version } = yield exec.getExecOutput('powershell -command "(Get-CimInstance -ClassName Win32_OperatingSystem).Version"', undefined, {
        silent: true
    });
    const { stdout: name } = yield exec.getExecOutput('powershell -command "(Get-CimInstance -ClassName Win32_OperatingSystem).Caption"', undefined, {
        silent: true
    });
    return {
        name: name.trim(),
        version: version.trim()
    };
});
const getMacOsInfo = () => platform_awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const { stdout } = yield exec.getExecOutput('sw_vers', undefined, {
        silent: true
    });
    const version = (_b = (_a = stdout.match(/ProductVersion:\s*(.+)/)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : '';
    const name = (_d = (_c = stdout.match(/ProductName:\s*(.+)/)) === null || _c === void 0 ? void 0 : _c[1]) !== null && _d !== void 0 ? _d : '';
    return {
        name,
        version
    };
});
const getLinuxInfo = () => platform_awaiter(void 0, void 0, void 0, function* () {
    const { stdout } = yield exec.getExecOutput('lsb_release', ['-i', '-r', '-s'], {
        silent: true
    });
    const [name, version] = stdout.trim().split('\n');
    return {
        name,
        version
    };
});
const platform = external_os_.platform();
const arch = external_os_.arch();
const isWindows = platform === 'win32';
const isMacOS = platform === 'darwin';
const isLinux = platform === 'linux';
function getDetails() {
    return platform_awaiter(this, void 0, void 0, function* () {
        return Object.assign(Object.assign({}, (yield (isWindows
            ? getWindowsInfo()
            : isMacOS
                ? getMacOsInfo()
                : getLinuxInfo()))), { platform,
            arch,
            isWindows,
            isMacOS,
            isLinux });
    });
}
//# sourceMappingURL=platform.js.map
;// CONCATENATED MODULE: ./node_modules/@actions/core/lib/core.js
var core_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};






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
})(ExitCode || (ExitCode = {}));
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
    const convertedVal = toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        return issueFileCommand('ENV', prepareKeyValueMessage(name, val));
    }
    issueCommand('set-env', { name }, convertedVal);
}
/**
 * Registers a secret which will get masked from logs
 *
 * @param secret - Value of the secret to be masked
 * @remarks
 * This function instructs the Actions runner to mask the specified value in any
 * logs produced during the workflow run. Once registered, the secret value will
 * be replaced with asterisks (***) whenever it appears in console output, logs,
 * or error messages.
 *
 * This is useful for protecting sensitive information such as:
 * - API keys
 * - Access tokens
 * - Authentication credentials
 * - URL parameters containing signatures (SAS tokens)
 *
 * Note that masking only affects future logs; any previous appearances of the
 * secret in logs before calling this function will remain unmasked.
 *
 * @example
 * ```typescript
 * // Register an API token as a secret
 * const apiToken = "abc123xyz456";
 * setSecret(apiToken);
 *
 * // Now any logs containing this value will show *** instead
 * console.log(`Using token: ${apiToken}`); // Outputs: "Using token: ***"
 * ```
 */
function core_setSecret(secret) {
    issueCommand('add-mask', {}, secret);
}
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        issueFileCommand('PATH', inputPath);
    }
    else {
        issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
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
        return file_command_issueFileCommand('OUTPUT', file_command_prepareKeyValueMessage(name, value));
    }
    process.stdout.write(external_os_.EOL);
    command_issueCommand('set-output', { name }, utils_toCommandValue(value));
}
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    issue('echo', enabled ? 'on' : 'off');
}
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
    core_error(message);
}
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
/**
 * Writes debug message to user log
 * @param message debug message
 */
function core_debug(message) {
    issueCommand('debug', {}, message);
}
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function core_error(message, properties = {}) {
    command_issueCommand('error', utils_toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
/**
 * Adds a warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function warning(message, properties = {}) {
    issueCommand('warning', toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
/**
 * Adds a notice issue
 * @param message notice issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function notice(message, properties = {}) {
    issueCommand('notice', toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    issue('group', name);
}
/**
 * End an output group.
 */
function endGroup() {
    issue('endgroup');
}
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return core_awaiter(this, void 0, void 0, function* () {
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
        return issueFileCommand('STATE', prepareKeyValueMessage(name, value));
    }
    issueCommand('save-state', { name }, toCommandValue(value));
}
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
function getIDToken(aud) {
    return core_awaiter(this, void 0, void 0, function* () {
        return yield OidcClient.getIDToken(aud);
    });
}
/**
 * Summary exports
 */

/**
 * @deprecated use core.summary
 */

/**
 * Path exports
 */

/**
 * Platform utilities exports
 */

//# sourceMappingURL=core.js.map
// EXTERNAL MODULE: ./node_modules/@metamask/action-utils/dist/index.js
var dist = __nccwpck_require__(4725);
// EXTERNAL MODULE: ./node_modules/semver/functions/diff.js
var diff = __nccwpck_require__(711);
// EXTERNAL MODULE: ./node_modules/semver/functions/gt.js
var gt = __nccwpck_require__(6599);
// EXTERNAL MODULE: ./node_modules/semver/functions/inc.js
var inc = __nccwpck_require__(2338);
// EXTERNAL MODULE: ./node_modules/semver/functions/major.js
var major = __nccwpck_require__(8511);
// EXTERNAL MODULE: ./node_modules/semver/functions/clean.js
var clean = __nccwpck_require__(1799);
;// CONCATENATED MODULE: ./lib/utils.js

// Our custom input env keys
var InputKeys;
(function (InputKeys) {
    InputKeys["ReleaseType"] = "RELEASE_TYPE";
    InputKeys["ReleaseVersion"] = "RELEASE_VERSION";
})(InputKeys = InputKeys || (InputKeys = {}));
/**
 * SemVer release types that are accepted by this Action.
 */
var AcceptedSemverReleaseTypes;
(function (AcceptedSemverReleaseTypes) {
    AcceptedSemverReleaseTypes["Major"] = "major";
    AcceptedSemverReleaseTypes["Minor"] = "minor";
    AcceptedSemverReleaseTypes["Patch"] = "patch";
})(AcceptedSemverReleaseTypes = AcceptedSemverReleaseTypes || (AcceptedSemverReleaseTypes = {}));
/**
 * The names of the inputs to the Action, per action.yml.
 */
var InputNames;
(function (InputNames) {
    InputNames["ReleaseType"] = "release-type";
    InputNames["ReleaseVersion"] = "release-version";
})(InputNames = InputNames || (InputNames = {}));
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
    return process.env[key]?.trim() ?? '';
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
    if (!latestTag || !(0,dist.isValidSemver)(clean(latestTag))) {
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
        throw new Error(`Package "${packageName ?? 'undefined'}" has version "${currentVersion}" in its manifest, but no corresponding tag "${tagOfCurrentVersion}" exists.`);
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
    return (await getExecOutput('git', [command, ...args], { cwd: WORKSPACE_ROOT })).stdout.trim();
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
var semver = __nccwpck_require__(2088);
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
    const categorizedChanges = orderedChangeCategories
        .filter((category) => categories[category])
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
;// CONCATENATED MODULE: external "@octokit/rest"
var rest_x = (y) => {
	var x = {}; __nccwpck_require__.d(x, y); return x
} 
var rest_y = (x) => (() => (x))
const rest_namespaceObject = rest_x({ ["Octokit"]: () => (__WEBPACK_EXTERNAL_MODULE__octokit_rest_fa3a39c1__.Octokit) });
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
// EXTERNAL MODULE: ./node_modules/execa/index.js
var execa = __nccwpck_require__(8204);
;// CONCATENATED MODULE: ./node_modules/@metamask/auto-changelog/dist/run-command.mjs
function run_command_$importDefault(module) {
    if (module === null || module === void 0 ? void 0 : module.__esModule) {
        return module.default;
    }
    return module;
}

const run_command_execa = run_command_$importDefault(execa);
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
    github = new rest_namespaceObject.Octokit({ auth: githubToken });
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
var el=Object.create;var ft=Object.defineProperty;var rl=Object.getOwnPropertyDescriptor;var tl=Object.getOwnPropertyNames;var nl=Object.getPrototypeOf,il=Object.prototype.hasOwnProperty;var C=(e,r)=>()=>(r||e((r={exports:{}}).exports,r),r.exports),Ln=(e,r)=>{for(var t in r)ft(e,t,{get:r[t],enumerable:!0})},ul=(e,r,t,n)=>{if(r&&typeof r=="object"||typeof r=="function")for(let a of tl(r))!il.call(e,a)&&a!==t&&ft(e,a,{get:()=>r[a],enumerable:!(n=rl(r,a))||n.enumerable});return e};var Ue=(e,r,t)=>(t=e!=null?el(nl(e)):{},ul(r||!e||!e.__esModule?ft(t,"default",{value:e,enumerable:!0}):t,e));var xr=C((Om,In)=>{"use strict";In.exports=sl;function sl(e){return String(e).replace(/\s+/g," ")}});var Pi=C((av,Oi)=>{"use strict";Oi.exports=mf;var lr=9,Rr=10,Ye=32,Df=33,pf=58,Ge=91,df=92,xt=93,fr=94,Ur=96,zr=4,hf=1024;function mf(e){var r=this.Parser,t=this.Compiler;Ff(r)&&vf(r,e),gf(t)&&Ef(t)}function Ff(e){return!!(e&&e.prototype&&e.prototype.blockTokenizers)}function gf(e){return!!(e&&e.prototype&&e.prototype.visitors)}function vf(e,r){for(var t=r||{},n=e.prototype,a=n.blockTokenizers,u=n.inlineTokenizers,i=n.blockMethods,o=n.inlineMethods,s=a.definition,l=u.reference,c=[],f=-1,D=i.length,h;++f<D;)h=i[f],!(h==="newline"||h==="indentedCode"||h==="paragraph"||h==="footnoteDefinition")&&c.push([h]);c.push(["footnoteDefinition"]),t.inlineNotes&&(wt(o,"reference","inlineNote"),u.inlineNote=m),wt(i,"definition","footnoteDefinition"),wt(o,"reference","footnoteCall"),a.definition=y,a.footnoteDefinition=p,u.footnoteCall=d,u.reference=F,n.interruptFootnoteDefinition=c,F.locator=l.locator,d.locator=E,m.locator=B;function p(b,g,A){for(var x=this,v=x.interruptFootnoteDefinition,w=x.offset,k=g.length+1,q=0,T=[],R,O,S,_,P,ke,j,I,Z,Q,me,Fe,z;q<k&&(_=g.charCodeAt(q),!(_!==lr&&_!==Ye));)q++;if(g.charCodeAt(q++)===Ge&&g.charCodeAt(q++)===fr){for(O=q;q<k;){if(_=g.charCodeAt(q),_!==_||_===Rr||_===lr||_===Ye)return;if(_===xt){S=q,q++;break}q++}if(!(S===void 0||O===S||g.charCodeAt(q++)!==pf)){if(A)return!0;for(R=g.slice(O,S),P=b.now(),Z=0,Q=0,me=q,Fe=[];q<k;){if(_=g.charCodeAt(q),_!==_||_===Rr)z={start:Z,contentStart:me||q,contentEnd:q,end:q},Fe.push(z),_===Rr&&(Z=q+1,Q=0,me=void 0,z.end=Z);else if(Q!==void 0)if(_===Ye||_===lr)Q+=_===Ye?1:zr-Q%zr,Q>zr&&(Q=void 0,me=q);else{if(Q<zr&&z&&(z.contentStart===z.contentEnd||Cf(v,a,x,[b,g.slice(q,hf),!0])))break;Q=void 0,me=q}q++}for(q=-1,k=Fe.length;k>0&&(z=Fe[k-1],z.contentStart===z.contentEnd);)k--;for(ke=b(g.slice(0,z.contentEnd));++q<k;)z=Fe[q],w[P.line+q]=(w[P.line+q]||0)+(z.contentStart-z.start),T.push(g.slice(z.contentStart,z.end));return j=x.enterBlock(),I=x.tokenizeBlock(T.join(""),P),j(),ke({type:"footnoteDefinition",identifier:R.toLowerCase(),label:R,children:I})}}}function d(b,g,A){var x=g.length+1,v=0,w,k,q,T;if(g.charCodeAt(v++)===Ge&&g.charCodeAt(v++)===fr){for(k=v;v<x;){if(T=g.charCodeAt(v),T!==T||T===Rr||T===lr||T===Ye)return;if(T===xt){q=v,v++;break}v++}if(!(q===void 0||k===q))return A?!0:(w=g.slice(k,q),b(g.slice(0,v))({type:"footnoteReference",identifier:w.toLowerCase(),label:w}))}}function m(b,g,A){var x=this,v=g.length+1,w=0,k=0,q,T,R,O,S,_,P;if(g.charCodeAt(w++)===fr&&g.charCodeAt(w++)===Ge){for(R=w;w<v;){if(T=g.charCodeAt(w),T!==T)return;if(_===void 0)if(T===df)w+=2;else if(T===Ge)k++,w++;else if(T===xt)if(k===0){O=w,w++;break}else k--,w++;else if(T===Ur){for(S=w,_=1;g.charCodeAt(S+_)===Ur;)_++;w+=_}else w++;else if(T===Ur){for(S=w,P=1;g.charCodeAt(S+P)===Ur;)P++;w+=P,_===P&&(_=void 0),P=void 0}else w++}if(O!==void 0)return A?!0:(q=b.now(),q.column+=2,q.offset+=2,b(g.slice(0,w))({type:"footnote",children:x.tokenizeInline(g.slice(R,O),q)}))}}function F(b,g,A){var x=0;if(g.charCodeAt(x)===Df&&x++,g.charCodeAt(x)===Ge&&g.charCodeAt(x+1)!==fr)return l.call(this,b,g,A)}function y(b,g,A){for(var x=0,v=g.charCodeAt(x);v===Ye||v===lr;)v=g.charCodeAt(++x);if(v===Ge&&g.charCodeAt(x+1)!==fr)return s.call(this,b,g,A)}function E(b,g){return b.indexOf("[",g)}function B(b,g){return b.indexOf("^[",g)}}function Ef(e){var r=e.prototype.visitors,t="    ";r.footnote=n,r.footnoteReference=a,r.footnoteDefinition=u;function n(i){return"^["+this.all(i).join("")+"]"}function a(i){return"[^"+(i.label||i.identifier)+"]"}function u(i){for(var o=this.all(i).join(`

`).split(`
`),s=0,l=o.length,c;++s<l;)c=o[s],c!==""&&(o[s]=t+c);return"[^"+(i.label||i.identifier)+"]: "+o.join(`
`)}}function wt(e,r,t){e.splice(e.indexOf(r),0,t)}function Cf(e,r,t,n){for(var a=e.length,u=-1;++u<a;)if(r[e[u][0]].apply(t,n))return!0;return!1}});var Bt=C(kt=>{kt.isRemarkParser=bf;kt.isRemarkCompiler=yf;function bf(e){return!!(e&&e.prototype&&e.prototype.blockTokenizers)}function yf(e){return!!(e&&e.prototype&&e.prototype.visitors)}});var Mi=C((sv,zi)=>{var Li=Bt();zi.exports=kf;var Ii=9,Ni=32,Mr=36,Af=48,xf=57,Ri=92,wf=["math","math-inline"],Ui="math-display";function kf(e){let r=this.Parser,t=this.Compiler;Li.isRemarkParser(r)&&Bf(r,e),Li.isRemarkCompiler(t)&&qf(t,e)}function Bf(e,r){let t=e.prototype,n=t.inlineMethods;u.locator=a,t.inlineTokenizers.math=u,n.splice(n.indexOf("text"),0,"math");function a(i,o){return i.indexOf("$",o)}function u(i,o,s){let l=o.length,c=!1,f=!1,D=0,h,p,d,m,F,y,E;if(o.charCodeAt(D)===Ri&&(f=!0,D++),o.charCodeAt(D)===Mr){if(D++,f)return s?!0:i(o.slice(0,D))({type:"text",value:"$"});if(o.charCodeAt(D)===Mr&&(c=!0,D++),d=o.charCodeAt(D),!(d===Ni||d===Ii)){for(m=D;D<l;){if(p=d,d=o.charCodeAt(D+1),p===Mr){if(h=o.charCodeAt(D-1),h!==Ni&&h!==Ii&&(d!==d||d<Af||d>xf)&&(!c||d===Mr)){F=D-1,D++,c&&D++,y=D;break}}else p===Ri&&(D++,d=o.charCodeAt(D+1));D++}if(y!==void 0)return s?!0:(E=o.slice(m,F+1),i(o.slice(0,y))({type:"inlineMath",value:E,data:{hName:"span",hProperties:{className:wf.concat(c&&r.inlineMathDouble?[Ui]:[])},hChildren:[{type:"text",value:E}]}}))}}}}function qf(e){let r=e.prototype;r.visitors.inlineMath=t;function t(n){let a="$";return(n.data&&n.data.hProperties&&n.data.hProperties.className||[]).includes(Ui)&&(a="$$"),a+n.value+a}}});var $i=C((cv,ji)=>{var Yi=Bt();ji.exports=Of;var Gi=10,Dr=32,qt=36,Vi=`
`,Tf="$",_f=2,Sf=["math","math-display"];function Of(){let e=this.Parser,r=this.Compiler;Yi.isRemarkParser(e)&&Pf(e),Yi.isRemarkCompiler(r)&&Lf(r)}function Pf(e){let r=e.prototype,t=r.blockMethods,n=r.interruptParagraph,a=r.interruptList,u=r.interruptBlockquote;r.blockTokenizers.math=i,t.splice(t.indexOf("fencedCode")+1,0,"math"),n.splice(n.indexOf("fencedCode")+1,0,["math"]),a.splice(a.indexOf("fencedCode")+1,0,["math"]),u.splice(u.indexOf("fencedCode")+1,0,["math"]);function i(o,s,l){var c=s.length,f=0;let D,h,p,d,m,F,y,E,B,b,g;for(;f<c&&s.charCodeAt(f)===Dr;)f++;for(m=f;f<c&&s.charCodeAt(f)===qt;)f++;if(F=f-m,!(F<_f)){for(;f<c&&s.charCodeAt(f)===Dr;)f++;for(y=f;f<c;){if(D=s.charCodeAt(f),D===qt)return;if(D===Gi)break;f++}if(s.charCodeAt(f)===Gi){if(l)return!0;for(h=[],y!==f&&h.push(s.slice(y,f)),f++,p=s.indexOf(Vi,f+1),p=p===-1?c:p;f<c;){for(E=!1,b=f,g=p,d=p,B=0;d>b&&s.charCodeAt(d-1)===Dr;)d--;for(;d>b&&s.charCodeAt(d-1)===qt;)B++,d--;for(F<=B&&s.indexOf(Tf,b)===d&&(E=!0,g=d);b<=g&&b-f<m&&s.charCodeAt(b)===Dr;)b++;if(E)for(;g>b&&s.charCodeAt(g-1)===Dr;)g--;if((!E||b!==g)&&h.push(s.slice(b,g)),E)break;f=p+1,p=s.indexOf(Vi,f+1),p=p===-1?c:p}return h=h.join(`
`),o(s.slice(0,p))({type:"math",value:h,data:{hName:"div",hProperties:{className:Sf.concat()},hChildren:[{type:"text",value:h}]}})}}}}function Lf(e){let r=e.prototype;r.visitors.math=t;function t(n){return`$$
`+n.value+`
$$`}}});var Wi=C((lv,Hi)=>{var If=Mi(),Nf=$i();Hi.exports=Rf;function Rf(e){var r=e||{};Nf.call(this,r),If.call(this,r)}});var Ie=C((fv,Ki)=>{Ki.exports=zf;var Uf=Object.prototype.hasOwnProperty;function zf(){for(var e={},r=0;r<arguments.length;r++){var t=arguments[r];for(var n in t)Uf.call(t,n)&&(e[n]=t[n])}return e}});var Ji=C((Dv,Tt)=>{typeof Object.create=="function"?Tt.exports=function(r,t){t&&(r.super_=t,r.prototype=Object.create(t.prototype,{constructor:{value:r,enumerable:!1,writable:!0,configurable:!0}}))}:Tt.exports=function(r,t){if(t){r.super_=t;var n=function(){};n.prototype=t.prototype,r.prototype=new n,r.prototype.constructor=r}}});var Zi=C((pv,Qi)=>{"use strict";var Mf=Ie(),Xi=Ji();Qi.exports=Yf;function Yf(e){var r,t,n;Xi(u,e),Xi(a,u),r=u.prototype;for(t in r)n=r[t],n&&typeof n=="object"&&(r[t]="concat"in n?n.concat():Mf(n));return u;function a(i){return e.apply(this,i)}function u(){return this instanceof u?e.apply(this,arguments):new a(arguments)}}});var ru=C((dv,eu)=>{"use strict";eu.exports=Gf;function Gf(e,r,t){return n;function n(){var a=t||this,u=a[e];return a[e]=!r,i;function i(){a[e]=u}}}});var nu=C((hv,tu)=>{"use strict";tu.exports=Vf;function Vf(e){for(var r=String(e),t=[],n=/\r?\n|\r/g;n.exec(r);)t.push(n.lastIndex);return t.push(r.length+1),{toPoint:a,toPosition:a,toOffset:u};function a(i){var o=-1;if(i>-1&&i<t[t.length-1]){for(;++o<t.length;)if(t[o]>i)return{line:o+1,column:i-(t[o-1]||0)+1,offset:i}}return{}}function u(i){var o=i&&i.line,s=i&&i.column,l;return!isNaN(o)&&!isNaN(s)&&o-1 in t&&(l=(t[o-2]||0)+s-1||0),l>-1&&l<t[t.length-1]?l:-1}}});var uu=C((mv,iu)=>{"use strict";iu.exports=jf;var _t="\\";function jf(e,r){return t;function t(n){for(var a=0,u=n.indexOf(_t),i=e[r],o=[],s;u!==-1;)o.push(n.slice(a,u)),a=u+1,s=n.charAt(a),(!s||i.indexOf(s)===-1)&&o.push(_t),u=n.indexOf(_t,a+1);return o.push(n.slice(a)),o.join("")}}});var au=C((Fv,$f)=>{$f.exports={AElig:"\xC6",AMP:"&",Aacute:"\xC1",Acirc:"\xC2",Agrave:"\xC0",Aring:"\xC5",Atilde:"\xC3",Auml:"\xC4",COPY:"\xA9",Ccedil:"\xC7",ETH:"\xD0",Eacute:"\xC9",Ecirc:"\xCA",Egrave:"\xC8",Euml:"\xCB",GT:">",Iacute:"\xCD",Icirc:"\xCE",Igrave:"\xCC",Iuml:"\xCF",LT:"<",Ntilde:"\xD1",Oacute:"\xD3",Ocirc:"\xD4",Ograve:"\xD2",Oslash:"\xD8",Otilde:"\xD5",Ouml:"\xD6",QUOT:'"',REG:"\xAE",THORN:"\xDE",Uacute:"\xDA",Ucirc:"\xDB",Ugrave:"\xD9",Uuml:"\xDC",Yacute:"\xDD",aacute:"\xE1",acirc:"\xE2",acute:"\xB4",aelig:"\xE6",agrave:"\xE0",amp:"&",aring:"\xE5",atilde:"\xE3",auml:"\xE4",brvbar:"\xA6",ccedil:"\xE7",cedil:"\xB8",cent:"\xA2",copy:"\xA9",curren:"\xA4",deg:"\xB0",divide:"\xF7",eacute:"\xE9",ecirc:"\xEA",egrave:"\xE8",eth:"\xF0",euml:"\xEB",frac12:"\xBD",frac14:"\xBC",frac34:"\xBE",gt:">",iacute:"\xED",icirc:"\xEE",iexcl:"\xA1",igrave:"\xEC",iquest:"\xBF",iuml:"\xEF",laquo:"\xAB",lt:"<",macr:"\xAF",micro:"\xB5",middot:"\xB7",nbsp:"\xA0",not:"\xAC",ntilde:"\xF1",oacute:"\xF3",ocirc:"\xF4",ograve:"\xF2",ordf:"\xAA",ordm:"\xBA",oslash:"\xF8",otilde:"\xF5",ouml:"\xF6",para:"\xB6",plusmn:"\xB1",pound:"\xA3",quot:'"',raquo:"\xBB",reg:"\xAE",sect:"\xA7",shy:"\xAD",sup1:"\xB9",sup2:"\xB2",sup3:"\xB3",szlig:"\xDF",thorn:"\xFE",times:"\xD7",uacute:"\xFA",ucirc:"\xFB",ugrave:"\xF9",uml:"\xA8",uuml:"\xFC",yacute:"\xFD",yen:"\xA5",yuml:"\xFF"}});var ou=C((gv,Hf)=>{Hf.exports={"0":"\uFFFD","128":"\u20AC","130":"\u201A","131":"\u0192","132":"\u201E","133":"\u2026","134":"\u2020","135":"\u2021","136":"\u02C6","137":"\u2030","138":"\u0160","139":"\u2039","140":"\u0152","142":"\u017D","145":"\u2018","146":"\u2019","147":"\u201C","148":"\u201D","149":"\u2022","150":"\u2013","151":"\u2014","152":"\u02DC","153":"\u2122","154":"\u0161","155":"\u203A","156":"\u0153","158":"\u017E","159":"\u0178"}});var Ne=C((vv,su)=>{"use strict";su.exports=Wf;function Wf(e){var r=typeof e=="string"?e.charCodeAt(0):e;return r>=48&&r<=57}});var lu=C((Ev,cu)=>{"use strict";cu.exports=Kf;function Kf(e){var r=typeof e=="string"?e.charCodeAt(0):e;return r>=97&&r<=102||r>=65&&r<=70||r>=48&&r<=57}});var Ve=C((Cv,fu)=>{"use strict";fu.exports=Jf;function Jf(e){var r=typeof e=="string"?e.charCodeAt(0):e;return r>=97&&r<=122||r>=65&&r<=90}});var pu=C((bv,Du)=>{"use strict";var Xf=Ve(),Qf=Ne();Du.exports=Zf;function Zf(e){return Xf(e)||Qf(e)}});var du=C((yv,eD)=>{eD.exports={AEli:"\xC6",AElig:"\xC6",AM:"&",AMP:"&",Aacut:"\xC1",Aacute:"\xC1",Abreve:"\u0102",Acir:"\xC2",Acirc:"\xC2",Acy:"\u0410",Afr:"\u{1D504}",Agrav:"\xC0",Agrave:"\xC0",Alpha:"\u0391",Amacr:"\u0100",And:"\u2A53",Aogon:"\u0104",Aopf:"\u{1D538}",ApplyFunction:"\u2061",Arin:"\xC5",Aring:"\xC5",Ascr:"\u{1D49C}",Assign:"\u2254",Atild:"\xC3",Atilde:"\xC3",Aum:"\xC4",Auml:"\xC4",Backslash:"\u2216",Barv:"\u2AE7",Barwed:"\u2306",Bcy:"\u0411",Because:"\u2235",Bernoullis:"\u212C",Beta:"\u0392",Bfr:"\u{1D505}",Bopf:"\u{1D539}",Breve:"\u02D8",Bscr:"\u212C",Bumpeq:"\u224E",CHcy:"\u0427",COP:"\xA9",COPY:"\xA9",Cacute:"\u0106",Cap:"\u22D2",CapitalDifferentialD:"\u2145",Cayleys:"\u212D",Ccaron:"\u010C",Ccedi:"\xC7",Ccedil:"\xC7",Ccirc:"\u0108",Cconint:"\u2230",Cdot:"\u010A",Cedilla:"\xB8",CenterDot:"\xB7",Cfr:"\u212D",Chi:"\u03A7",CircleDot:"\u2299",CircleMinus:"\u2296",CirclePlus:"\u2295",CircleTimes:"\u2297",ClockwiseContourIntegral:"\u2232",CloseCurlyDoubleQuote:"\u201D",CloseCurlyQuote:"\u2019",Colon:"\u2237",Colone:"\u2A74",Congruent:"\u2261",Conint:"\u222F",ContourIntegral:"\u222E",Copf:"\u2102",Coproduct:"\u2210",CounterClockwiseContourIntegral:"\u2233",Cross:"\u2A2F",Cscr:"\u{1D49E}",Cup:"\u22D3",CupCap:"\u224D",DD:"\u2145",DDotrahd:"\u2911",DJcy:"\u0402",DScy:"\u0405",DZcy:"\u040F",Dagger:"\u2021",Darr:"\u21A1",Dashv:"\u2AE4",Dcaron:"\u010E",Dcy:"\u0414",Del:"\u2207",Delta:"\u0394",Dfr:"\u{1D507}",DiacriticalAcute:"\xB4",DiacriticalDot:"\u02D9",DiacriticalDoubleAcute:"\u02DD",DiacriticalGrave:"`",DiacriticalTilde:"\u02DC",Diamond:"\u22C4",DifferentialD:"\u2146",Dopf:"\u{1D53B}",Dot:"\xA8",DotDot:"\u20DC",DotEqual:"\u2250",DoubleContourIntegral:"\u222F",DoubleDot:"\xA8",DoubleDownArrow:"\u21D3",DoubleLeftArrow:"\u21D0",DoubleLeftRightArrow:"\u21D4",DoubleLeftTee:"\u2AE4",DoubleLongLeftArrow:"\u27F8",DoubleLongLeftRightArrow:"\u27FA",DoubleLongRightArrow:"\u27F9",DoubleRightArrow:"\u21D2",DoubleRightTee:"\u22A8",DoubleUpArrow:"\u21D1",DoubleUpDownArrow:"\u21D5",DoubleVerticalBar:"\u2225",DownArrow:"\u2193",DownArrowBar:"\u2913",DownArrowUpArrow:"\u21F5",DownBreve:"\u0311",DownLeftRightVector:"\u2950",DownLeftTeeVector:"\u295E",DownLeftVector:"\u21BD",DownLeftVectorBar:"\u2956",DownRightTeeVector:"\u295F",DownRightVector:"\u21C1",DownRightVectorBar:"\u2957",DownTee:"\u22A4",DownTeeArrow:"\u21A7",Downarrow:"\u21D3",Dscr:"\u{1D49F}",Dstrok:"\u0110",ENG:"\u014A",ET:"\xD0",ETH:"\xD0",Eacut:"\xC9",Eacute:"\xC9",Ecaron:"\u011A",Ecir:"\xCA",Ecirc:"\xCA",Ecy:"\u042D",Edot:"\u0116",Efr:"\u{1D508}",Egrav:"\xC8",Egrave:"\xC8",Element:"\u2208",Emacr:"\u0112",EmptySmallSquare:"\u25FB",EmptyVerySmallSquare:"\u25AB",Eogon:"\u0118",Eopf:"\u{1D53C}",Epsilon:"\u0395",Equal:"\u2A75",EqualTilde:"\u2242",Equilibrium:"\u21CC",Escr:"\u2130",Esim:"\u2A73",Eta:"\u0397",Eum:"\xCB",Euml:"\xCB",Exists:"\u2203",ExponentialE:"\u2147",Fcy:"\u0424",Ffr:"\u{1D509}",FilledSmallSquare:"\u25FC",FilledVerySmallSquare:"\u25AA",Fopf:"\u{1D53D}",ForAll:"\u2200",Fouriertrf:"\u2131",Fscr:"\u2131",GJcy:"\u0403",G:">",GT:">",Gamma:"\u0393",Gammad:"\u03DC",Gbreve:"\u011E",Gcedil:"\u0122",Gcirc:"\u011C",Gcy:"\u0413",Gdot:"\u0120",Gfr:"\u{1D50A}",Gg:"\u22D9",Gopf:"\u{1D53E}",GreaterEqual:"\u2265",GreaterEqualLess:"\u22DB",GreaterFullEqual:"\u2267",GreaterGreater:"\u2AA2",GreaterLess:"\u2277",GreaterSlantEqual:"\u2A7E",GreaterTilde:"\u2273",Gscr:"\u{1D4A2}",Gt:"\u226B",HARDcy:"\u042A",Hacek:"\u02C7",Hat:"^",Hcirc:"\u0124",Hfr:"\u210C",HilbertSpace:"\u210B",Hopf:"\u210D",HorizontalLine:"\u2500",Hscr:"\u210B",Hstrok:"\u0126",HumpDownHump:"\u224E",HumpEqual:"\u224F",IEcy:"\u0415",IJlig:"\u0132",IOcy:"\u0401",Iacut:"\xCD",Iacute:"\xCD",Icir:"\xCE",Icirc:"\xCE",Icy:"\u0418",Idot:"\u0130",Ifr:"\u2111",Igrav:"\xCC",Igrave:"\xCC",Im:"\u2111",Imacr:"\u012A",ImaginaryI:"\u2148",Implies:"\u21D2",Int:"\u222C",Integral:"\u222B",Intersection:"\u22C2",InvisibleComma:"\u2063",InvisibleTimes:"\u2062",Iogon:"\u012E",Iopf:"\u{1D540}",Iota:"\u0399",Iscr:"\u2110",Itilde:"\u0128",Iukcy:"\u0406",Ium:"\xCF",Iuml:"\xCF",Jcirc:"\u0134",Jcy:"\u0419",Jfr:"\u{1D50D}",Jopf:"\u{1D541}",Jscr:"\u{1D4A5}",Jsercy:"\u0408",Jukcy:"\u0404",KHcy:"\u0425",KJcy:"\u040C",Kappa:"\u039A",Kcedil:"\u0136",Kcy:"\u041A",Kfr:"\u{1D50E}",Kopf:"\u{1D542}",Kscr:"\u{1D4A6}",LJcy:"\u0409",L:"<",LT:"<",Lacute:"\u0139",Lambda:"\u039B",Lang:"\u27EA",Laplacetrf:"\u2112",Larr:"\u219E",Lcaron:"\u013D",Lcedil:"\u013B",Lcy:"\u041B",LeftAngleBracket:"\u27E8",LeftArrow:"\u2190",LeftArrowBar:"\u21E4",LeftArrowRightArrow:"\u21C6",LeftCeiling:"\u2308",LeftDoubleBracket:"\u27E6",LeftDownTeeVector:"\u2961",LeftDownVector:"\u21C3",LeftDownVectorBar:"\u2959",LeftFloor:"\u230A",LeftRightArrow:"\u2194",LeftRightVector:"\u294E",LeftTee:"\u22A3",LeftTeeArrow:"\u21A4",LeftTeeVector:"\u295A",LeftTriangle:"\u22B2",LeftTriangleBar:"\u29CF",LeftTriangleEqual:"\u22B4",LeftUpDownVector:"\u2951",LeftUpTeeVector:"\u2960",LeftUpVector:"\u21BF",LeftUpVectorBar:"\u2958",LeftVector:"\u21BC",LeftVectorBar:"\u2952",Leftarrow:"\u21D0",Leftrightarrow:"\u21D4",LessEqualGreater:"\u22DA",LessFullEqual:"\u2266",LessGreater:"\u2276",LessLess:"\u2AA1",LessSlantEqual:"\u2A7D",LessTilde:"\u2272",Lfr:"\u{1D50F}",Ll:"\u22D8",Lleftarrow:"\u21DA",Lmidot:"\u013F",LongLeftArrow:"\u27F5",LongLeftRightArrow:"\u27F7",LongRightArrow:"\u27F6",Longleftarrow:"\u27F8",Longleftrightarrow:"\u27FA",Longrightarrow:"\u27F9",Lopf:"\u{1D543}",LowerLeftArrow:"\u2199",LowerRightArrow:"\u2198",Lscr:"\u2112",Lsh:"\u21B0",Lstrok:"\u0141",Lt:"\u226A",Map:"\u2905",Mcy:"\u041C",MediumSpace:"\u205F",Mellintrf:"\u2133",Mfr:"\u{1D510}",MinusPlus:"\u2213",Mopf:"\u{1D544}",Mscr:"\u2133",Mu:"\u039C",NJcy:"\u040A",Nacute:"\u0143",Ncaron:"\u0147",Ncedil:"\u0145",Ncy:"\u041D",NegativeMediumSpace:"\u200B",NegativeThickSpace:"\u200B",NegativeThinSpace:"\u200B",NegativeVeryThinSpace:"\u200B",NestedGreaterGreater:"\u226B",NestedLessLess:"\u226A",NewLine:`
`,Nfr:"\u{1D511}",NoBreak:"\u2060",NonBreakingSpace:"\xA0",Nopf:"\u2115",Not:"\u2AEC",NotCongruent:"\u2262",NotCupCap:"\u226D",NotDoubleVerticalBar:"\u2226",NotElement:"\u2209",NotEqual:"\u2260",NotEqualTilde:"\u2242\u0338",NotExists:"\u2204",NotGreater:"\u226F",NotGreaterEqual:"\u2271",NotGreaterFullEqual:"\u2267\u0338",NotGreaterGreater:"\u226B\u0338",NotGreaterLess:"\u2279",NotGreaterSlantEqual:"\u2A7E\u0338",NotGreaterTilde:"\u2275",NotHumpDownHump:"\u224E\u0338",NotHumpEqual:"\u224F\u0338",NotLeftTriangle:"\u22EA",NotLeftTriangleBar:"\u29CF\u0338",NotLeftTriangleEqual:"\u22EC",NotLess:"\u226E",NotLessEqual:"\u2270",NotLessGreater:"\u2278",NotLessLess:"\u226A\u0338",NotLessSlantEqual:"\u2A7D\u0338",NotLessTilde:"\u2274",NotNestedGreaterGreater:"\u2AA2\u0338",NotNestedLessLess:"\u2AA1\u0338",NotPrecedes:"\u2280",NotPrecedesEqual:"\u2AAF\u0338",NotPrecedesSlantEqual:"\u22E0",NotReverseElement:"\u220C",NotRightTriangle:"\u22EB",NotRightTriangleBar:"\u29D0\u0338",NotRightTriangleEqual:"\u22ED",NotSquareSubset:"\u228F\u0338",NotSquareSubsetEqual:"\u22E2",NotSquareSuperset:"\u2290\u0338",NotSquareSupersetEqual:"\u22E3",NotSubset:"\u2282\u20D2",NotSubsetEqual:"\u2288",NotSucceeds:"\u2281",NotSucceedsEqual:"\u2AB0\u0338",NotSucceedsSlantEqual:"\u22E1",NotSucceedsTilde:"\u227F\u0338",NotSuperset:"\u2283\u20D2",NotSupersetEqual:"\u2289",NotTilde:"\u2241",NotTildeEqual:"\u2244",NotTildeFullEqual:"\u2247",NotTildeTilde:"\u2249",NotVerticalBar:"\u2224",Nscr:"\u{1D4A9}",Ntild:"\xD1",Ntilde:"\xD1",Nu:"\u039D",OElig:"\u0152",Oacut:"\xD3",Oacute:"\xD3",Ocir:"\xD4",Ocirc:"\xD4",Ocy:"\u041E",Odblac:"\u0150",Ofr:"\u{1D512}",Ograv:"\xD2",Ograve:"\xD2",Omacr:"\u014C",Omega:"\u03A9",Omicron:"\u039F",Oopf:"\u{1D546}",OpenCurlyDoubleQuote:"\u201C",OpenCurlyQuote:"\u2018",Or:"\u2A54",Oscr:"\u{1D4AA}",Oslas:"\xD8",Oslash:"\xD8",Otild:"\xD5",Otilde:"\xD5",Otimes:"\u2A37",Oum:"\xD6",Ouml:"\xD6",OverBar:"\u203E",OverBrace:"\u23DE",OverBracket:"\u23B4",OverParenthesis:"\u23DC",PartialD:"\u2202",Pcy:"\u041F",Pfr:"\u{1D513}",Phi:"\u03A6",Pi:"\u03A0",PlusMinus:"\xB1",Poincareplane:"\u210C",Popf:"\u2119",Pr:"\u2ABB",Precedes:"\u227A",PrecedesEqual:"\u2AAF",PrecedesSlantEqual:"\u227C",PrecedesTilde:"\u227E",Prime:"\u2033",Product:"\u220F",Proportion:"\u2237",Proportional:"\u221D",Pscr:"\u{1D4AB}",Psi:"\u03A8",QUO:'"',QUOT:'"',Qfr:"\u{1D514}",Qopf:"\u211A",Qscr:"\u{1D4AC}",RBarr:"\u2910",RE:"\xAE",REG:"\xAE",Racute:"\u0154",Rang:"\u27EB",Rarr:"\u21A0",Rarrtl:"\u2916",Rcaron:"\u0158",Rcedil:"\u0156",Rcy:"\u0420",Re:"\u211C",ReverseElement:"\u220B",ReverseEquilibrium:"\u21CB",ReverseUpEquilibrium:"\u296F",Rfr:"\u211C",Rho:"\u03A1",RightAngleBracket:"\u27E9",RightArrow:"\u2192",RightArrowBar:"\u21E5",RightArrowLeftArrow:"\u21C4",RightCeiling:"\u2309",RightDoubleBracket:"\u27E7",RightDownTeeVector:"\u295D",RightDownVector:"\u21C2",RightDownVectorBar:"\u2955",RightFloor:"\u230B",RightTee:"\u22A2",RightTeeArrow:"\u21A6",RightTeeVector:"\u295B",RightTriangle:"\u22B3",RightTriangleBar:"\u29D0",RightTriangleEqual:"\u22B5",RightUpDownVector:"\u294F",RightUpTeeVector:"\u295C",RightUpVector:"\u21BE",RightUpVectorBar:"\u2954",RightVector:"\u21C0",RightVectorBar:"\u2953",Rightarrow:"\u21D2",Ropf:"\u211D",RoundImplies:"\u2970",Rrightarrow:"\u21DB",Rscr:"\u211B",Rsh:"\u21B1",RuleDelayed:"\u29F4",SHCHcy:"\u0429",SHcy:"\u0428",SOFTcy:"\u042C",Sacute:"\u015A",Sc:"\u2ABC",Scaron:"\u0160",Scedil:"\u015E",Scirc:"\u015C",Scy:"\u0421",Sfr:"\u{1D516}",ShortDownArrow:"\u2193",ShortLeftArrow:"\u2190",ShortRightArrow:"\u2192",ShortUpArrow:"\u2191",Sigma:"\u03A3",SmallCircle:"\u2218",Sopf:"\u{1D54A}",Sqrt:"\u221A",Square:"\u25A1",SquareIntersection:"\u2293",SquareSubset:"\u228F",SquareSubsetEqual:"\u2291",SquareSuperset:"\u2290",SquareSupersetEqual:"\u2292",SquareUnion:"\u2294",Sscr:"\u{1D4AE}",Star:"\u22C6",Sub:"\u22D0",Subset:"\u22D0",SubsetEqual:"\u2286",Succeeds:"\u227B",SucceedsEqual:"\u2AB0",SucceedsSlantEqual:"\u227D",SucceedsTilde:"\u227F",SuchThat:"\u220B",Sum:"\u2211",Sup:"\u22D1",Superset:"\u2283",SupersetEqual:"\u2287",Supset:"\u22D1",THOR:"\xDE",THORN:"\xDE",TRADE:"\u2122",TSHcy:"\u040B",TScy:"\u0426",Tab:"	",Tau:"\u03A4",Tcaron:"\u0164",Tcedil:"\u0162",Tcy:"\u0422",Tfr:"\u{1D517}",Therefore:"\u2234",Theta:"\u0398",ThickSpace:"\u205F\u200A",ThinSpace:"\u2009",Tilde:"\u223C",TildeEqual:"\u2243",TildeFullEqual:"\u2245",TildeTilde:"\u2248",Topf:"\u{1D54B}",TripleDot:"\u20DB",Tscr:"\u{1D4AF}",Tstrok:"\u0166",Uacut:"\xDA",Uacute:"\xDA",Uarr:"\u219F",Uarrocir:"\u2949",Ubrcy:"\u040E",Ubreve:"\u016C",Ucir:"\xDB",Ucirc:"\xDB",Ucy:"\u0423",Udblac:"\u0170",Ufr:"\u{1D518}",Ugrav:"\xD9",Ugrave:"\xD9",Umacr:"\u016A",UnderBar:"_",UnderBrace:"\u23DF",UnderBracket:"\u23B5",UnderParenthesis:"\u23DD",Union:"\u22C3",UnionPlus:"\u228E",Uogon:"\u0172",Uopf:"\u{1D54C}",UpArrow:"\u2191",UpArrowBar:"\u2912",UpArrowDownArrow:"\u21C5",UpDownArrow:"\u2195",UpEquilibrium:"\u296E",UpTee:"\u22A5",UpTeeArrow:"\u21A5",Uparrow:"\u21D1",Updownarrow:"\u21D5",UpperLeftArrow:"\u2196",UpperRightArrow:"\u2197",Upsi:"\u03D2",Upsilon:"\u03A5",Uring:"\u016E",Uscr:"\u{1D4B0}",Utilde:"\u0168",Uum:"\xDC",Uuml:"\xDC",VDash:"\u22AB",Vbar:"\u2AEB",Vcy:"\u0412",Vdash:"\u22A9",Vdashl:"\u2AE6",Vee:"\u22C1",Verbar:"\u2016",Vert:"\u2016",VerticalBar:"\u2223",VerticalLine:"|",VerticalSeparator:"\u2758",VerticalTilde:"\u2240",VeryThinSpace:"\u200A",Vfr:"\u{1D519}",Vopf:"\u{1D54D}",Vscr:"\u{1D4B1}",Vvdash:"\u22AA",Wcirc:"\u0174",Wedge:"\u22C0",Wfr:"\u{1D51A}",Wopf:"\u{1D54E}",Wscr:"\u{1D4B2}",Xfr:"\u{1D51B}",Xi:"\u039E",Xopf:"\u{1D54F}",Xscr:"\u{1D4B3}",YAcy:"\u042F",YIcy:"\u0407",YUcy:"\u042E",Yacut:"\xDD",Yacute:"\xDD",Ycirc:"\u0176",Ycy:"\u042B",Yfr:"\u{1D51C}",Yopf:"\u{1D550}",Yscr:"\u{1D4B4}",Yuml:"\u0178",ZHcy:"\u0416",Zacute:"\u0179",Zcaron:"\u017D",Zcy:"\u0417",Zdot:"\u017B",ZeroWidthSpace:"\u200B",Zeta:"\u0396",Zfr:"\u2128",Zopf:"\u2124",Zscr:"\u{1D4B5}",aacut:"\xE1",aacute:"\xE1",abreve:"\u0103",ac:"\u223E",acE:"\u223E\u0333",acd:"\u223F",acir:"\xE2",acirc:"\xE2",acut:"\xB4",acute:"\xB4",acy:"\u0430",aeli:"\xE6",aelig:"\xE6",af:"\u2061",afr:"\u{1D51E}",agrav:"\xE0",agrave:"\xE0",alefsym:"\u2135",aleph:"\u2135",alpha:"\u03B1",amacr:"\u0101",amalg:"\u2A3F",am:"&",amp:"&",and:"\u2227",andand:"\u2A55",andd:"\u2A5C",andslope:"\u2A58",andv:"\u2A5A",ang:"\u2220",ange:"\u29A4",angle:"\u2220",angmsd:"\u2221",angmsdaa:"\u29A8",angmsdab:"\u29A9",angmsdac:"\u29AA",angmsdad:"\u29AB",angmsdae:"\u29AC",angmsdaf:"\u29AD",angmsdag:"\u29AE",angmsdah:"\u29AF",angrt:"\u221F",angrtvb:"\u22BE",angrtvbd:"\u299D",angsph:"\u2222",angst:"\xC5",angzarr:"\u237C",aogon:"\u0105",aopf:"\u{1D552}",ap:"\u2248",apE:"\u2A70",apacir:"\u2A6F",ape:"\u224A",apid:"\u224B",apos:"'",approx:"\u2248",approxeq:"\u224A",arin:"\xE5",aring:"\xE5",ascr:"\u{1D4B6}",ast:"*",asymp:"\u2248",asympeq:"\u224D",atild:"\xE3",atilde:"\xE3",aum:"\xE4",auml:"\xE4",awconint:"\u2233",awint:"\u2A11",bNot:"\u2AED",backcong:"\u224C",backepsilon:"\u03F6",backprime:"\u2035",backsim:"\u223D",backsimeq:"\u22CD",barvee:"\u22BD",barwed:"\u2305",barwedge:"\u2305",bbrk:"\u23B5",bbrktbrk:"\u23B6",bcong:"\u224C",bcy:"\u0431",bdquo:"\u201E",becaus:"\u2235",because:"\u2235",bemptyv:"\u29B0",bepsi:"\u03F6",bernou:"\u212C",beta:"\u03B2",beth:"\u2136",between:"\u226C",bfr:"\u{1D51F}",bigcap:"\u22C2",bigcirc:"\u25EF",bigcup:"\u22C3",bigodot:"\u2A00",bigoplus:"\u2A01",bigotimes:"\u2A02",bigsqcup:"\u2A06",bigstar:"\u2605",bigtriangledown:"\u25BD",bigtriangleup:"\u25B3",biguplus:"\u2A04",bigvee:"\u22C1",bigwedge:"\u22C0",bkarow:"\u290D",blacklozenge:"\u29EB",blacksquare:"\u25AA",blacktriangle:"\u25B4",blacktriangledown:"\u25BE",blacktriangleleft:"\u25C2",blacktriangleright:"\u25B8",blank:"\u2423",blk12:"\u2592",blk14:"\u2591",blk34:"\u2593",block:"\u2588",bne:"=\u20E5",bnequiv:"\u2261\u20E5",bnot:"\u2310",bopf:"\u{1D553}",bot:"\u22A5",bottom:"\u22A5",bowtie:"\u22C8",boxDL:"\u2557",boxDR:"\u2554",boxDl:"\u2556",boxDr:"\u2553",boxH:"\u2550",boxHD:"\u2566",boxHU:"\u2569",boxHd:"\u2564",boxHu:"\u2567",boxUL:"\u255D",boxUR:"\u255A",boxUl:"\u255C",boxUr:"\u2559",boxV:"\u2551",boxVH:"\u256C",boxVL:"\u2563",boxVR:"\u2560",boxVh:"\u256B",boxVl:"\u2562",boxVr:"\u255F",boxbox:"\u29C9",boxdL:"\u2555",boxdR:"\u2552",boxdl:"\u2510",boxdr:"\u250C",boxh:"\u2500",boxhD:"\u2565",boxhU:"\u2568",boxhd:"\u252C",boxhu:"\u2534",boxminus:"\u229F",boxplus:"\u229E",boxtimes:"\u22A0",boxuL:"\u255B",boxuR:"\u2558",boxul:"\u2518",boxur:"\u2514",boxv:"\u2502",boxvH:"\u256A",boxvL:"\u2561",boxvR:"\u255E",boxvh:"\u253C",boxvl:"\u2524",boxvr:"\u251C",bprime:"\u2035",breve:"\u02D8",brvba:"\xA6",brvbar:"\xA6",bscr:"\u{1D4B7}",bsemi:"\u204F",bsim:"\u223D",bsime:"\u22CD",bsol:"\\",bsolb:"\u29C5",bsolhsub:"\u27C8",bull:"\u2022",bullet:"\u2022",bump:"\u224E",bumpE:"\u2AAE",bumpe:"\u224F",bumpeq:"\u224F",cacute:"\u0107",cap:"\u2229",capand:"\u2A44",capbrcup:"\u2A49",capcap:"\u2A4B",capcup:"\u2A47",capdot:"\u2A40",caps:"\u2229\uFE00",caret:"\u2041",caron:"\u02C7",ccaps:"\u2A4D",ccaron:"\u010D",ccedi:"\xE7",ccedil:"\xE7",ccirc:"\u0109",ccups:"\u2A4C",ccupssm:"\u2A50",cdot:"\u010B",cedi:"\xB8",cedil:"\xB8",cemptyv:"\u29B2",cen:"\xA2",cent:"\xA2",centerdot:"\xB7",cfr:"\u{1D520}",chcy:"\u0447",check:"\u2713",checkmark:"\u2713",chi:"\u03C7",cir:"\u25CB",cirE:"\u29C3",circ:"\u02C6",circeq:"\u2257",circlearrowleft:"\u21BA",circlearrowright:"\u21BB",circledR:"\xAE",circledS:"\u24C8",circledast:"\u229B",circledcirc:"\u229A",circleddash:"\u229D",cire:"\u2257",cirfnint:"\u2A10",cirmid:"\u2AEF",cirscir:"\u29C2",clubs:"\u2663",clubsuit:"\u2663",colon:":",colone:"\u2254",coloneq:"\u2254",comma:",",commat:"@",comp:"\u2201",compfn:"\u2218",complement:"\u2201",complexes:"\u2102",cong:"\u2245",congdot:"\u2A6D",conint:"\u222E",copf:"\u{1D554}",coprod:"\u2210",cop:"\xA9",copy:"\xA9",copysr:"\u2117",crarr:"\u21B5",cross:"\u2717",cscr:"\u{1D4B8}",csub:"\u2ACF",csube:"\u2AD1",csup:"\u2AD0",csupe:"\u2AD2",ctdot:"\u22EF",cudarrl:"\u2938",cudarrr:"\u2935",cuepr:"\u22DE",cuesc:"\u22DF",cularr:"\u21B6",cularrp:"\u293D",cup:"\u222A",cupbrcap:"\u2A48",cupcap:"\u2A46",cupcup:"\u2A4A",cupdot:"\u228D",cupor:"\u2A45",cups:"\u222A\uFE00",curarr:"\u21B7",curarrm:"\u293C",curlyeqprec:"\u22DE",curlyeqsucc:"\u22DF",curlyvee:"\u22CE",curlywedge:"\u22CF",curre:"\xA4",curren:"\xA4",curvearrowleft:"\u21B6",curvearrowright:"\u21B7",cuvee:"\u22CE",cuwed:"\u22CF",cwconint:"\u2232",cwint:"\u2231",cylcty:"\u232D",dArr:"\u21D3",dHar:"\u2965",dagger:"\u2020",daleth:"\u2138",darr:"\u2193",dash:"\u2010",dashv:"\u22A3",dbkarow:"\u290F",dblac:"\u02DD",dcaron:"\u010F",dcy:"\u0434",dd:"\u2146",ddagger:"\u2021",ddarr:"\u21CA",ddotseq:"\u2A77",de:"\xB0",deg:"\xB0",delta:"\u03B4",demptyv:"\u29B1",dfisht:"\u297F",dfr:"\u{1D521}",dharl:"\u21C3",dharr:"\u21C2",diam:"\u22C4",diamond:"\u22C4",diamondsuit:"\u2666",diams:"\u2666",die:"\xA8",digamma:"\u03DD",disin:"\u22F2",div:"\xF7",divid:"\xF7",divide:"\xF7",divideontimes:"\u22C7",divonx:"\u22C7",djcy:"\u0452",dlcorn:"\u231E",dlcrop:"\u230D",dollar:"$",dopf:"\u{1D555}",dot:"\u02D9",doteq:"\u2250",doteqdot:"\u2251",dotminus:"\u2238",dotplus:"\u2214",dotsquare:"\u22A1",doublebarwedge:"\u2306",downarrow:"\u2193",downdownarrows:"\u21CA",downharpoonleft:"\u21C3",downharpoonright:"\u21C2",drbkarow:"\u2910",drcorn:"\u231F",drcrop:"\u230C",dscr:"\u{1D4B9}",dscy:"\u0455",dsol:"\u29F6",dstrok:"\u0111",dtdot:"\u22F1",dtri:"\u25BF",dtrif:"\u25BE",duarr:"\u21F5",duhar:"\u296F",dwangle:"\u29A6",dzcy:"\u045F",dzigrarr:"\u27FF",eDDot:"\u2A77",eDot:"\u2251",eacut:"\xE9",eacute:"\xE9",easter:"\u2A6E",ecaron:"\u011B",ecir:"\xEA",ecirc:"\xEA",ecolon:"\u2255",ecy:"\u044D",edot:"\u0117",ee:"\u2147",efDot:"\u2252",efr:"\u{1D522}",eg:"\u2A9A",egrav:"\xE8",egrave:"\xE8",egs:"\u2A96",egsdot:"\u2A98",el:"\u2A99",elinters:"\u23E7",ell:"\u2113",els:"\u2A95",elsdot:"\u2A97",emacr:"\u0113",empty:"\u2205",emptyset:"\u2205",emptyv:"\u2205",emsp13:"\u2004",emsp14:"\u2005",emsp:"\u2003",eng:"\u014B",ensp:"\u2002",eogon:"\u0119",eopf:"\u{1D556}",epar:"\u22D5",eparsl:"\u29E3",eplus:"\u2A71",epsi:"\u03B5",epsilon:"\u03B5",epsiv:"\u03F5",eqcirc:"\u2256",eqcolon:"\u2255",eqsim:"\u2242",eqslantgtr:"\u2A96",eqslantless:"\u2A95",equals:"=",equest:"\u225F",equiv:"\u2261",equivDD:"\u2A78",eqvparsl:"\u29E5",erDot:"\u2253",erarr:"\u2971",escr:"\u212F",esdot:"\u2250",esim:"\u2242",eta:"\u03B7",et:"\xF0",eth:"\xF0",eum:"\xEB",euml:"\xEB",euro:"\u20AC",excl:"!",exist:"\u2203",expectation:"\u2130",exponentiale:"\u2147",fallingdotseq:"\u2252",fcy:"\u0444",female:"\u2640",ffilig:"\uFB03",fflig:"\uFB00",ffllig:"\uFB04",ffr:"\u{1D523}",filig:"\uFB01",fjlig:"fj",flat:"\u266D",fllig:"\uFB02",fltns:"\u25B1",fnof:"\u0192",fopf:"\u{1D557}",forall:"\u2200",fork:"\u22D4",forkv:"\u2AD9",fpartint:"\u2A0D",frac1:"\xBC",frac12:"\xBD",frac13:"\u2153",frac14:"\xBC",frac15:"\u2155",frac16:"\u2159",frac18:"\u215B",frac23:"\u2154",frac25:"\u2156",frac3:"\xBE",frac34:"\xBE",frac35:"\u2157",frac38:"\u215C",frac45:"\u2158",frac56:"\u215A",frac58:"\u215D",frac78:"\u215E",frasl:"\u2044",frown:"\u2322",fscr:"\u{1D4BB}",gE:"\u2267",gEl:"\u2A8C",gacute:"\u01F5",gamma:"\u03B3",gammad:"\u03DD",gap:"\u2A86",gbreve:"\u011F",gcirc:"\u011D",gcy:"\u0433",gdot:"\u0121",ge:"\u2265",gel:"\u22DB",geq:"\u2265",geqq:"\u2267",geqslant:"\u2A7E",ges:"\u2A7E",gescc:"\u2AA9",gesdot:"\u2A80",gesdoto:"\u2A82",gesdotol:"\u2A84",gesl:"\u22DB\uFE00",gesles:"\u2A94",gfr:"\u{1D524}",gg:"\u226B",ggg:"\u22D9",gimel:"\u2137",gjcy:"\u0453",gl:"\u2277",glE:"\u2A92",gla:"\u2AA5",glj:"\u2AA4",gnE:"\u2269",gnap:"\u2A8A",gnapprox:"\u2A8A",gne:"\u2A88",gneq:"\u2A88",gneqq:"\u2269",gnsim:"\u22E7",gopf:"\u{1D558}",grave:"`",gscr:"\u210A",gsim:"\u2273",gsime:"\u2A8E",gsiml:"\u2A90",g:">",gt:">",gtcc:"\u2AA7",gtcir:"\u2A7A",gtdot:"\u22D7",gtlPar:"\u2995",gtquest:"\u2A7C",gtrapprox:"\u2A86",gtrarr:"\u2978",gtrdot:"\u22D7",gtreqless:"\u22DB",gtreqqless:"\u2A8C",gtrless:"\u2277",gtrsim:"\u2273",gvertneqq:"\u2269\uFE00",gvnE:"\u2269\uFE00",hArr:"\u21D4",hairsp:"\u200A",half:"\xBD",hamilt:"\u210B",hardcy:"\u044A",harr:"\u2194",harrcir:"\u2948",harrw:"\u21AD",hbar:"\u210F",hcirc:"\u0125",hearts:"\u2665",heartsuit:"\u2665",hellip:"\u2026",hercon:"\u22B9",hfr:"\u{1D525}",hksearow:"\u2925",hkswarow:"\u2926",hoarr:"\u21FF",homtht:"\u223B",hookleftarrow:"\u21A9",hookrightarrow:"\u21AA",hopf:"\u{1D559}",horbar:"\u2015",hscr:"\u{1D4BD}",hslash:"\u210F",hstrok:"\u0127",hybull:"\u2043",hyphen:"\u2010",iacut:"\xED",iacute:"\xED",ic:"\u2063",icir:"\xEE",icirc:"\xEE",icy:"\u0438",iecy:"\u0435",iexc:"\xA1",iexcl:"\xA1",iff:"\u21D4",ifr:"\u{1D526}",igrav:"\xEC",igrave:"\xEC",ii:"\u2148",iiiint:"\u2A0C",iiint:"\u222D",iinfin:"\u29DC",iiota:"\u2129",ijlig:"\u0133",imacr:"\u012B",image:"\u2111",imagline:"\u2110",imagpart:"\u2111",imath:"\u0131",imof:"\u22B7",imped:"\u01B5",in:"\u2208",incare:"\u2105",infin:"\u221E",infintie:"\u29DD",inodot:"\u0131",int:"\u222B",intcal:"\u22BA",integers:"\u2124",intercal:"\u22BA",intlarhk:"\u2A17",intprod:"\u2A3C",iocy:"\u0451",iogon:"\u012F",iopf:"\u{1D55A}",iota:"\u03B9",iprod:"\u2A3C",iques:"\xBF",iquest:"\xBF",iscr:"\u{1D4BE}",isin:"\u2208",isinE:"\u22F9",isindot:"\u22F5",isins:"\u22F4",isinsv:"\u22F3",isinv:"\u2208",it:"\u2062",itilde:"\u0129",iukcy:"\u0456",ium:"\xEF",iuml:"\xEF",jcirc:"\u0135",jcy:"\u0439",jfr:"\u{1D527}",jmath:"\u0237",jopf:"\u{1D55B}",jscr:"\u{1D4BF}",jsercy:"\u0458",jukcy:"\u0454",kappa:"\u03BA",kappav:"\u03F0",kcedil:"\u0137",kcy:"\u043A",kfr:"\u{1D528}",kgreen:"\u0138",khcy:"\u0445",kjcy:"\u045C",kopf:"\u{1D55C}",kscr:"\u{1D4C0}",lAarr:"\u21DA",lArr:"\u21D0",lAtail:"\u291B",lBarr:"\u290E",lE:"\u2266",lEg:"\u2A8B",lHar:"\u2962",lacute:"\u013A",laemptyv:"\u29B4",lagran:"\u2112",lambda:"\u03BB",lang:"\u27E8",langd:"\u2991",langle:"\u27E8",lap:"\u2A85",laqu:"\xAB",laquo:"\xAB",larr:"\u2190",larrb:"\u21E4",larrbfs:"\u291F",larrfs:"\u291D",larrhk:"\u21A9",larrlp:"\u21AB",larrpl:"\u2939",larrsim:"\u2973",larrtl:"\u21A2",lat:"\u2AAB",latail:"\u2919",late:"\u2AAD",lates:"\u2AAD\uFE00",lbarr:"\u290C",lbbrk:"\u2772",lbrace:"{",lbrack:"[",lbrke:"\u298B",lbrksld:"\u298F",lbrkslu:"\u298D",lcaron:"\u013E",lcedil:"\u013C",lceil:"\u2308",lcub:"{",lcy:"\u043B",ldca:"\u2936",ldquo:"\u201C",ldquor:"\u201E",ldrdhar:"\u2967",ldrushar:"\u294B",ldsh:"\u21B2",le:"\u2264",leftarrow:"\u2190",leftarrowtail:"\u21A2",leftharpoondown:"\u21BD",leftharpoonup:"\u21BC",leftleftarrows:"\u21C7",leftrightarrow:"\u2194",leftrightarrows:"\u21C6",leftrightharpoons:"\u21CB",leftrightsquigarrow:"\u21AD",leftthreetimes:"\u22CB",leg:"\u22DA",leq:"\u2264",leqq:"\u2266",leqslant:"\u2A7D",les:"\u2A7D",lescc:"\u2AA8",lesdot:"\u2A7F",lesdoto:"\u2A81",lesdotor:"\u2A83",lesg:"\u22DA\uFE00",lesges:"\u2A93",lessapprox:"\u2A85",lessdot:"\u22D6",lesseqgtr:"\u22DA",lesseqqgtr:"\u2A8B",lessgtr:"\u2276",lesssim:"\u2272",lfisht:"\u297C",lfloor:"\u230A",lfr:"\u{1D529}",lg:"\u2276",lgE:"\u2A91",lhard:"\u21BD",lharu:"\u21BC",lharul:"\u296A",lhblk:"\u2584",ljcy:"\u0459",ll:"\u226A",llarr:"\u21C7",llcorner:"\u231E",llhard:"\u296B",lltri:"\u25FA",lmidot:"\u0140",lmoust:"\u23B0",lmoustache:"\u23B0",lnE:"\u2268",lnap:"\u2A89",lnapprox:"\u2A89",lne:"\u2A87",lneq:"\u2A87",lneqq:"\u2268",lnsim:"\u22E6",loang:"\u27EC",loarr:"\u21FD",lobrk:"\u27E6",longleftarrow:"\u27F5",longleftrightarrow:"\u27F7",longmapsto:"\u27FC",longrightarrow:"\u27F6",looparrowleft:"\u21AB",looparrowright:"\u21AC",lopar:"\u2985",lopf:"\u{1D55D}",loplus:"\u2A2D",lotimes:"\u2A34",lowast:"\u2217",lowbar:"_",loz:"\u25CA",lozenge:"\u25CA",lozf:"\u29EB",lpar:"(",lparlt:"\u2993",lrarr:"\u21C6",lrcorner:"\u231F",lrhar:"\u21CB",lrhard:"\u296D",lrm:"\u200E",lrtri:"\u22BF",lsaquo:"\u2039",lscr:"\u{1D4C1}",lsh:"\u21B0",lsim:"\u2272",lsime:"\u2A8D",lsimg:"\u2A8F",lsqb:"[",lsquo:"\u2018",lsquor:"\u201A",lstrok:"\u0142",l:"<",lt:"<",ltcc:"\u2AA6",ltcir:"\u2A79",ltdot:"\u22D6",lthree:"\u22CB",ltimes:"\u22C9",ltlarr:"\u2976",ltquest:"\u2A7B",ltrPar:"\u2996",ltri:"\u25C3",ltrie:"\u22B4",ltrif:"\u25C2",lurdshar:"\u294A",luruhar:"\u2966",lvertneqq:"\u2268\uFE00",lvnE:"\u2268\uFE00",mDDot:"\u223A",mac:"\xAF",macr:"\xAF",male:"\u2642",malt:"\u2720",maltese:"\u2720",map:"\u21A6",mapsto:"\u21A6",mapstodown:"\u21A7",mapstoleft:"\u21A4",mapstoup:"\u21A5",marker:"\u25AE",mcomma:"\u2A29",mcy:"\u043C",mdash:"\u2014",measuredangle:"\u2221",mfr:"\u{1D52A}",mho:"\u2127",micr:"\xB5",micro:"\xB5",mid:"\u2223",midast:"*",midcir:"\u2AF0",middo:"\xB7",middot:"\xB7",minus:"\u2212",minusb:"\u229F",minusd:"\u2238",minusdu:"\u2A2A",mlcp:"\u2ADB",mldr:"\u2026",mnplus:"\u2213",models:"\u22A7",mopf:"\u{1D55E}",mp:"\u2213",mscr:"\u{1D4C2}",mstpos:"\u223E",mu:"\u03BC",multimap:"\u22B8",mumap:"\u22B8",nGg:"\u22D9\u0338",nGt:"\u226B\u20D2",nGtv:"\u226B\u0338",nLeftarrow:"\u21CD",nLeftrightarrow:"\u21CE",nLl:"\u22D8\u0338",nLt:"\u226A\u20D2",nLtv:"\u226A\u0338",nRightarrow:"\u21CF",nVDash:"\u22AF",nVdash:"\u22AE",nabla:"\u2207",nacute:"\u0144",nang:"\u2220\u20D2",nap:"\u2249",napE:"\u2A70\u0338",napid:"\u224B\u0338",napos:"\u0149",napprox:"\u2249",natur:"\u266E",natural:"\u266E",naturals:"\u2115",nbs:"\xA0",nbsp:"\xA0",nbump:"\u224E\u0338",nbumpe:"\u224F\u0338",ncap:"\u2A43",ncaron:"\u0148",ncedil:"\u0146",ncong:"\u2247",ncongdot:"\u2A6D\u0338",ncup:"\u2A42",ncy:"\u043D",ndash:"\u2013",ne:"\u2260",neArr:"\u21D7",nearhk:"\u2924",nearr:"\u2197",nearrow:"\u2197",nedot:"\u2250\u0338",nequiv:"\u2262",nesear:"\u2928",nesim:"\u2242\u0338",nexist:"\u2204",nexists:"\u2204",nfr:"\u{1D52B}",ngE:"\u2267\u0338",nge:"\u2271",ngeq:"\u2271",ngeqq:"\u2267\u0338",ngeqslant:"\u2A7E\u0338",nges:"\u2A7E\u0338",ngsim:"\u2275",ngt:"\u226F",ngtr:"\u226F",nhArr:"\u21CE",nharr:"\u21AE",nhpar:"\u2AF2",ni:"\u220B",nis:"\u22FC",nisd:"\u22FA",niv:"\u220B",njcy:"\u045A",nlArr:"\u21CD",nlE:"\u2266\u0338",nlarr:"\u219A",nldr:"\u2025",nle:"\u2270",nleftarrow:"\u219A",nleftrightarrow:"\u21AE",nleq:"\u2270",nleqq:"\u2266\u0338",nleqslant:"\u2A7D\u0338",nles:"\u2A7D\u0338",nless:"\u226E",nlsim:"\u2274",nlt:"\u226E",nltri:"\u22EA",nltrie:"\u22EC",nmid:"\u2224",nopf:"\u{1D55F}",no:"\xAC",not:"\xAC",notin:"\u2209",notinE:"\u22F9\u0338",notindot:"\u22F5\u0338",notinva:"\u2209",notinvb:"\u22F7",notinvc:"\u22F6",notni:"\u220C",notniva:"\u220C",notnivb:"\u22FE",notnivc:"\u22FD",npar:"\u2226",nparallel:"\u2226",nparsl:"\u2AFD\u20E5",npart:"\u2202\u0338",npolint:"\u2A14",npr:"\u2280",nprcue:"\u22E0",npre:"\u2AAF\u0338",nprec:"\u2280",npreceq:"\u2AAF\u0338",nrArr:"\u21CF",nrarr:"\u219B",nrarrc:"\u2933\u0338",nrarrw:"\u219D\u0338",nrightarrow:"\u219B",nrtri:"\u22EB",nrtrie:"\u22ED",nsc:"\u2281",nsccue:"\u22E1",nsce:"\u2AB0\u0338",nscr:"\u{1D4C3}",nshortmid:"\u2224",nshortparallel:"\u2226",nsim:"\u2241",nsime:"\u2244",nsimeq:"\u2244",nsmid:"\u2224",nspar:"\u2226",nsqsube:"\u22E2",nsqsupe:"\u22E3",nsub:"\u2284",nsubE:"\u2AC5\u0338",nsube:"\u2288",nsubset:"\u2282\u20D2",nsubseteq:"\u2288",nsubseteqq:"\u2AC5\u0338",nsucc:"\u2281",nsucceq:"\u2AB0\u0338",nsup:"\u2285",nsupE:"\u2AC6\u0338",nsupe:"\u2289",nsupset:"\u2283\u20D2",nsupseteq:"\u2289",nsupseteqq:"\u2AC6\u0338",ntgl:"\u2279",ntild:"\xF1",ntilde:"\xF1",ntlg:"\u2278",ntriangleleft:"\u22EA",ntrianglelefteq:"\u22EC",ntriangleright:"\u22EB",ntrianglerighteq:"\u22ED",nu:"\u03BD",num:"#",numero:"\u2116",numsp:"\u2007",nvDash:"\u22AD",nvHarr:"\u2904",nvap:"\u224D\u20D2",nvdash:"\u22AC",nvge:"\u2265\u20D2",nvgt:">\u20D2",nvinfin:"\u29DE",nvlArr:"\u2902",nvle:"\u2264\u20D2",nvlt:"<\u20D2",nvltrie:"\u22B4\u20D2",nvrArr:"\u2903",nvrtrie:"\u22B5\u20D2",nvsim:"\u223C\u20D2",nwArr:"\u21D6",nwarhk:"\u2923",nwarr:"\u2196",nwarrow:"\u2196",nwnear:"\u2927",oS:"\u24C8",oacut:"\xF3",oacute:"\xF3",oast:"\u229B",ocir:"\xF4",ocirc:"\xF4",ocy:"\u043E",odash:"\u229D",odblac:"\u0151",odiv:"\u2A38",odot:"\u2299",odsold:"\u29BC",oelig:"\u0153",ofcir:"\u29BF",ofr:"\u{1D52C}",ogon:"\u02DB",ograv:"\xF2",ograve:"\xF2",ogt:"\u29C1",ohbar:"\u29B5",ohm:"\u03A9",oint:"\u222E",olarr:"\u21BA",olcir:"\u29BE",olcross:"\u29BB",oline:"\u203E",olt:"\u29C0",omacr:"\u014D",omega:"\u03C9",omicron:"\u03BF",omid:"\u29B6",ominus:"\u2296",oopf:"\u{1D560}",opar:"\u29B7",operp:"\u29B9",oplus:"\u2295",or:"\u2228",orarr:"\u21BB",ord:"\xBA",order:"\u2134",orderof:"\u2134",ordf:"\xAA",ordm:"\xBA",origof:"\u22B6",oror:"\u2A56",orslope:"\u2A57",orv:"\u2A5B",oscr:"\u2134",oslas:"\xF8",oslash:"\xF8",osol:"\u2298",otild:"\xF5",otilde:"\xF5",otimes:"\u2297",otimesas:"\u2A36",oum:"\xF6",ouml:"\xF6",ovbar:"\u233D",par:"\xB6",para:"\xB6",parallel:"\u2225",parsim:"\u2AF3",parsl:"\u2AFD",part:"\u2202",pcy:"\u043F",percnt:"%",period:".",permil:"\u2030",perp:"\u22A5",pertenk:"\u2031",pfr:"\u{1D52D}",phi:"\u03C6",phiv:"\u03D5",phmmat:"\u2133",phone:"\u260E",pi:"\u03C0",pitchfork:"\u22D4",piv:"\u03D6",planck:"\u210F",planckh:"\u210E",plankv:"\u210F",plus:"+",plusacir:"\u2A23",plusb:"\u229E",pluscir:"\u2A22",plusdo:"\u2214",plusdu:"\u2A25",pluse:"\u2A72",plusm:"\xB1",plusmn:"\xB1",plussim:"\u2A26",plustwo:"\u2A27",pm:"\xB1",pointint:"\u2A15",popf:"\u{1D561}",poun:"\xA3",pound:"\xA3",pr:"\u227A",prE:"\u2AB3",prap:"\u2AB7",prcue:"\u227C",pre:"\u2AAF",prec:"\u227A",precapprox:"\u2AB7",preccurlyeq:"\u227C",preceq:"\u2AAF",precnapprox:"\u2AB9",precneqq:"\u2AB5",precnsim:"\u22E8",precsim:"\u227E",prime:"\u2032",primes:"\u2119",prnE:"\u2AB5",prnap:"\u2AB9",prnsim:"\u22E8",prod:"\u220F",profalar:"\u232E",profline:"\u2312",profsurf:"\u2313",prop:"\u221D",propto:"\u221D",prsim:"\u227E",prurel:"\u22B0",pscr:"\u{1D4C5}",psi:"\u03C8",puncsp:"\u2008",qfr:"\u{1D52E}",qint:"\u2A0C",qopf:"\u{1D562}",qprime:"\u2057",qscr:"\u{1D4C6}",quaternions:"\u210D",quatint:"\u2A16",quest:"?",questeq:"\u225F",quo:'"',quot:'"',rAarr:"\u21DB",rArr:"\u21D2",rAtail:"\u291C",rBarr:"\u290F",rHar:"\u2964",race:"\u223D\u0331",racute:"\u0155",radic:"\u221A",raemptyv:"\u29B3",rang:"\u27E9",rangd:"\u2992",range:"\u29A5",rangle:"\u27E9",raqu:"\xBB",raquo:"\xBB",rarr:"\u2192",rarrap:"\u2975",rarrb:"\u21E5",rarrbfs:"\u2920",rarrc:"\u2933",rarrfs:"\u291E",rarrhk:"\u21AA",rarrlp:"\u21AC",rarrpl:"\u2945",rarrsim:"\u2974",rarrtl:"\u21A3",rarrw:"\u219D",ratail:"\u291A",ratio:"\u2236",rationals:"\u211A",rbarr:"\u290D",rbbrk:"\u2773",rbrace:"}",rbrack:"]",rbrke:"\u298C",rbrksld:"\u298E",rbrkslu:"\u2990",rcaron:"\u0159",rcedil:"\u0157",rceil:"\u2309",rcub:"}",rcy:"\u0440",rdca:"\u2937",rdldhar:"\u2969",rdquo:"\u201D",rdquor:"\u201D",rdsh:"\u21B3",real:"\u211C",realine:"\u211B",realpart:"\u211C",reals:"\u211D",rect:"\u25AD",re:"\xAE",reg:"\xAE",rfisht:"\u297D",rfloor:"\u230B",rfr:"\u{1D52F}",rhard:"\u21C1",rharu:"\u21C0",rharul:"\u296C",rho:"\u03C1",rhov:"\u03F1",rightarrow:"\u2192",rightarrowtail:"\u21A3",rightharpoondown:"\u21C1",rightharpoonup:"\u21C0",rightleftarrows:"\u21C4",rightleftharpoons:"\u21CC",rightrightarrows:"\u21C9",rightsquigarrow:"\u219D",rightthreetimes:"\u22CC",ring:"\u02DA",risingdotseq:"\u2253",rlarr:"\u21C4",rlhar:"\u21CC",rlm:"\u200F",rmoust:"\u23B1",rmoustache:"\u23B1",rnmid:"\u2AEE",roang:"\u27ED",roarr:"\u21FE",robrk:"\u27E7",ropar:"\u2986",ropf:"\u{1D563}",roplus:"\u2A2E",rotimes:"\u2A35",rpar:")",rpargt:"\u2994",rppolint:"\u2A12",rrarr:"\u21C9",rsaquo:"\u203A",rscr:"\u{1D4C7}",rsh:"\u21B1",rsqb:"]",rsquo:"\u2019",rsquor:"\u2019",rthree:"\u22CC",rtimes:"\u22CA",rtri:"\u25B9",rtrie:"\u22B5",rtrif:"\u25B8",rtriltri:"\u29CE",ruluhar:"\u2968",rx:"\u211E",sacute:"\u015B",sbquo:"\u201A",sc:"\u227B",scE:"\u2AB4",scap:"\u2AB8",scaron:"\u0161",sccue:"\u227D",sce:"\u2AB0",scedil:"\u015F",scirc:"\u015D",scnE:"\u2AB6",scnap:"\u2ABA",scnsim:"\u22E9",scpolint:"\u2A13",scsim:"\u227F",scy:"\u0441",sdot:"\u22C5",sdotb:"\u22A1",sdote:"\u2A66",seArr:"\u21D8",searhk:"\u2925",searr:"\u2198",searrow:"\u2198",sec:"\xA7",sect:"\xA7",semi:";",seswar:"\u2929",setminus:"\u2216",setmn:"\u2216",sext:"\u2736",sfr:"\u{1D530}",sfrown:"\u2322",sharp:"\u266F",shchcy:"\u0449",shcy:"\u0448",shortmid:"\u2223",shortparallel:"\u2225",sh:"\xAD",shy:"\xAD",sigma:"\u03C3",sigmaf:"\u03C2",sigmav:"\u03C2",sim:"\u223C",simdot:"\u2A6A",sime:"\u2243",simeq:"\u2243",simg:"\u2A9E",simgE:"\u2AA0",siml:"\u2A9D",simlE:"\u2A9F",simne:"\u2246",simplus:"\u2A24",simrarr:"\u2972",slarr:"\u2190",smallsetminus:"\u2216",smashp:"\u2A33",smeparsl:"\u29E4",smid:"\u2223",smile:"\u2323",smt:"\u2AAA",smte:"\u2AAC",smtes:"\u2AAC\uFE00",softcy:"\u044C",sol:"/",solb:"\u29C4",solbar:"\u233F",sopf:"\u{1D564}",spades:"\u2660",spadesuit:"\u2660",spar:"\u2225",sqcap:"\u2293",sqcaps:"\u2293\uFE00",sqcup:"\u2294",sqcups:"\u2294\uFE00",sqsub:"\u228F",sqsube:"\u2291",sqsubset:"\u228F",sqsubseteq:"\u2291",sqsup:"\u2290",sqsupe:"\u2292",sqsupset:"\u2290",sqsupseteq:"\u2292",squ:"\u25A1",square:"\u25A1",squarf:"\u25AA",squf:"\u25AA",srarr:"\u2192",sscr:"\u{1D4C8}",ssetmn:"\u2216",ssmile:"\u2323",sstarf:"\u22C6",star:"\u2606",starf:"\u2605",straightepsilon:"\u03F5",straightphi:"\u03D5",strns:"\xAF",sub:"\u2282",subE:"\u2AC5",subdot:"\u2ABD",sube:"\u2286",subedot:"\u2AC3",submult:"\u2AC1",subnE:"\u2ACB",subne:"\u228A",subplus:"\u2ABF",subrarr:"\u2979",subset:"\u2282",subseteq:"\u2286",subseteqq:"\u2AC5",subsetneq:"\u228A",subsetneqq:"\u2ACB",subsim:"\u2AC7",subsub:"\u2AD5",subsup:"\u2AD3",succ:"\u227B",succapprox:"\u2AB8",succcurlyeq:"\u227D",succeq:"\u2AB0",succnapprox:"\u2ABA",succneqq:"\u2AB6",succnsim:"\u22E9",succsim:"\u227F",sum:"\u2211",sung:"\u266A",sup:"\u2283",sup1:"\xB9",sup2:"\xB2",sup3:"\xB3",supE:"\u2AC6",supdot:"\u2ABE",supdsub:"\u2AD8",supe:"\u2287",supedot:"\u2AC4",suphsol:"\u27C9",suphsub:"\u2AD7",suplarr:"\u297B",supmult:"\u2AC2",supnE:"\u2ACC",supne:"\u228B",supplus:"\u2AC0",supset:"\u2283",supseteq:"\u2287",supseteqq:"\u2AC6",supsetneq:"\u228B",supsetneqq:"\u2ACC",supsim:"\u2AC8",supsub:"\u2AD4",supsup:"\u2AD6",swArr:"\u21D9",swarhk:"\u2926",swarr:"\u2199",swarrow:"\u2199",swnwar:"\u292A",szli:"\xDF",szlig:"\xDF",target:"\u2316",tau:"\u03C4",tbrk:"\u23B4",tcaron:"\u0165",tcedil:"\u0163",tcy:"\u0442",tdot:"\u20DB",telrec:"\u2315",tfr:"\u{1D531}",there4:"\u2234",therefore:"\u2234",theta:"\u03B8",thetasym:"\u03D1",thetav:"\u03D1",thickapprox:"\u2248",thicksim:"\u223C",thinsp:"\u2009",thkap:"\u2248",thksim:"\u223C",thor:"\xFE",thorn:"\xFE",tilde:"\u02DC",time:"\xD7",times:"\xD7",timesb:"\u22A0",timesbar:"\u2A31",timesd:"\u2A30",tint:"\u222D",toea:"\u2928",top:"\u22A4",topbot:"\u2336",topcir:"\u2AF1",topf:"\u{1D565}",topfork:"\u2ADA",tosa:"\u2929",tprime:"\u2034",trade:"\u2122",triangle:"\u25B5",triangledown:"\u25BF",triangleleft:"\u25C3",trianglelefteq:"\u22B4",triangleq:"\u225C",triangleright:"\u25B9",trianglerighteq:"\u22B5",tridot:"\u25EC",trie:"\u225C",triminus:"\u2A3A",triplus:"\u2A39",trisb:"\u29CD",tritime:"\u2A3B",trpezium:"\u23E2",tscr:"\u{1D4C9}",tscy:"\u0446",tshcy:"\u045B",tstrok:"\u0167",twixt:"\u226C",twoheadleftarrow:"\u219E",twoheadrightarrow:"\u21A0",uArr:"\u21D1",uHar:"\u2963",uacut:"\xFA",uacute:"\xFA",uarr:"\u2191",ubrcy:"\u045E",ubreve:"\u016D",ucir:"\xFB",ucirc:"\xFB",ucy:"\u0443",udarr:"\u21C5",udblac:"\u0171",udhar:"\u296E",ufisht:"\u297E",ufr:"\u{1D532}",ugrav:"\xF9",ugrave:"\xF9",uharl:"\u21BF",uharr:"\u21BE",uhblk:"\u2580",ulcorn:"\u231C",ulcorner:"\u231C",ulcrop:"\u230F",ultri:"\u25F8",umacr:"\u016B",um:"\xA8",uml:"\xA8",uogon:"\u0173",uopf:"\u{1D566}",uparrow:"\u2191",updownarrow:"\u2195",upharpoonleft:"\u21BF",upharpoonright:"\u21BE",uplus:"\u228E",upsi:"\u03C5",upsih:"\u03D2",upsilon:"\u03C5",upuparrows:"\u21C8",urcorn:"\u231D",urcorner:"\u231D",urcrop:"\u230E",uring:"\u016F",urtri:"\u25F9",uscr:"\u{1D4CA}",utdot:"\u22F0",utilde:"\u0169",utri:"\u25B5",utrif:"\u25B4",uuarr:"\u21C8",uum:"\xFC",uuml:"\xFC",uwangle:"\u29A7",vArr:"\u21D5",vBar:"\u2AE8",vBarv:"\u2AE9",vDash:"\u22A8",vangrt:"\u299C",varepsilon:"\u03F5",varkappa:"\u03F0",varnothing:"\u2205",varphi:"\u03D5",varpi:"\u03D6",varpropto:"\u221D",varr:"\u2195",varrho:"\u03F1",varsigma:"\u03C2",varsubsetneq:"\u228A\uFE00",varsubsetneqq:"\u2ACB\uFE00",varsupsetneq:"\u228B\uFE00",varsupsetneqq:"\u2ACC\uFE00",vartheta:"\u03D1",vartriangleleft:"\u22B2",vartriangleright:"\u22B3",vcy:"\u0432",vdash:"\u22A2",vee:"\u2228",veebar:"\u22BB",veeeq:"\u225A",vellip:"\u22EE",verbar:"|",vert:"|",vfr:"\u{1D533}",vltri:"\u22B2",vnsub:"\u2282\u20D2",vnsup:"\u2283\u20D2",vopf:"\u{1D567}",vprop:"\u221D",vrtri:"\u22B3",vscr:"\u{1D4CB}",vsubnE:"\u2ACB\uFE00",vsubne:"\u228A\uFE00",vsupnE:"\u2ACC\uFE00",vsupne:"\u228B\uFE00",vzigzag:"\u299A",wcirc:"\u0175",wedbar:"\u2A5F",wedge:"\u2227",wedgeq:"\u2259",weierp:"\u2118",wfr:"\u{1D534}",wopf:"\u{1D568}",wp:"\u2118",wr:"\u2240",wreath:"\u2240",wscr:"\u{1D4CC}",xcap:"\u22C2",xcirc:"\u25EF",xcup:"\u22C3",xdtri:"\u25BD",xfr:"\u{1D535}",xhArr:"\u27FA",xharr:"\u27F7",xi:"\u03BE",xlArr:"\u27F8",xlarr:"\u27F5",xmap:"\u27FC",xnis:"\u22FB",xodot:"\u2A00",xopf:"\u{1D569}",xoplus:"\u2A01",xotime:"\u2A02",xrArr:"\u27F9",xrarr:"\u27F6",xscr:"\u{1D4CD}",xsqcup:"\u2A06",xuplus:"\u2A04",xutri:"\u25B3",xvee:"\u22C1",xwedge:"\u22C0",yacut:"\xFD",yacute:"\xFD",yacy:"\u044F",ycirc:"\u0177",ycy:"\u044B",ye:"\xA5",yen:"\xA5",yfr:"\u{1D536}",yicy:"\u0457",yopf:"\u{1D56A}",yscr:"\u{1D4CE}",yucy:"\u044E",yum:"\xFF",yuml:"\xFF",zacute:"\u017A",zcaron:"\u017E",zcy:"\u0437",zdot:"\u017C",zeetrf:"\u2128",zeta:"\u03B6",zfr:"\u{1D537}",zhcy:"\u0436",zigrarr:"\u21DD",zopf:"\u{1D56B}",zscr:"\u{1D4CF}",zwj:"\u200D",zwnj:"\u200C"}});var Fu=C((Av,mu)=>{"use strict";var hu=du();mu.exports=tD;var rD={}.hasOwnProperty;function tD(e){return rD.call(hu,e)?hu[e]:!1}});var pr=C((xv,Tu)=>{"use strict";var gu=au(),vu=ou(),nD=Ne(),iD=lu(),yu=pu(),uD=Fu();Tu.exports=gD;var aD={}.hasOwnProperty,je=String.fromCharCode,oD=Function.prototype,Eu={warning:null,reference:null,text:null,warningContext:null,referenceContext:null,textContext:null,position:{},additional:null,attribute:!1,nonTerminated:!0},sD=9,Cu=10,cD=12,lD=32,bu=38,fD=59,DD=60,pD=61,dD=35,hD=88,mD=120,FD=65533,$e="named",Ot="hexadecimal",Pt="decimal",Lt={};Lt[Ot]=16;Lt[Pt]=10;var Yr={};Yr[$e]=yu;Yr[Pt]=nD;Yr[Ot]=iD;var Au=1,xu=2,wu=3,ku=4,Bu=5,St=6,qu=7,Ae={};Ae[Au]="Named character references must be terminated by a semicolon";Ae[xu]="Numeric character references must be terminated by a semicolon";Ae[wu]="Named character references cannot be empty";Ae[ku]="Numeric character references cannot be empty";Ae[Bu]="Named character references must be known";Ae[St]="Numeric character references cannot be disallowed";Ae[qu]="Numeric character references cannot be outside the permissible Unicode range";function gD(e,r){var t={},n,a;r||(r={});for(a in Eu)n=r[a],t[a]=n??Eu[a];return(t.position.indent||t.position.start)&&(t.indent=t.position.indent||[],t.position=t.position.start),vD(e,t)}function vD(e,r){var t=r.additional,n=r.nonTerminated,a=r.text,u=r.reference,i=r.warning,o=r.textContext,s=r.referenceContext,l=r.warningContext,c=r.position,f=r.indent||[],D=e.length,h=0,p=-1,d=c.column||1,m=c.line||1,F="",y=[],E,B,b,g,A,x,v,w,k,q,T,R,O,S,_,P,ke,j,I;for(typeof t=="string"&&(t=t.charCodeAt(0)),P=Z(),w=i?Q:oD,h--,D++;++h<D;)if(A===Cu&&(d=f[p]||1),A=e.charCodeAt(h),A===bu){if(v=e.charCodeAt(h+1),v===sD||v===Cu||v===cD||v===lD||v===bu||v===DD||v!==v||t&&v===t){F+=je(A),d++;continue}for(O=h+1,R=O,I=O,v===dD?(I=++R,v=e.charCodeAt(I),v===hD||v===mD?(S=Ot,I=++R):S=Pt):S=$e,E="",T="",g="",_=Yr[S],I--;++I<D&&(v=e.charCodeAt(I),!!_(v));)g+=je(v),S===$e&&aD.call(gu,g)&&(E=g,T=gu[g]);b=e.charCodeAt(I)===fD,b&&(I++,B=S===$e?uD(g):!1,B&&(E=g,T=B)),j=1+I-O,!b&&!n||(g?S===$e?(b&&!T?w(Bu,1):(E!==g&&(I=R+E.length,j=1+I-R,b=!1),b||(k=E?Au:wu,r.attribute?(v=e.charCodeAt(I),v===pD?(w(k,j),T=null):yu(v)?T=null:w(k,j)):w(k,j))),x=T):(b||w(xu,j),x=parseInt(g,Lt[S]),ED(x)?(w(qu,j),x=je(FD)):x in vu?(w(St,j),x=vu[x]):(q="",CD(x)&&w(St,j),x>65535&&(x-=65536,q+=je(x>>>10|55296),x=56320|x&1023),x=q+je(x))):S!==$e&&w(ku,j)),x?(me(),P=Z(),h=I-1,d+=I-O+1,y.push(x),ke=Z(),ke.offset++,u&&u.call(s,x,{start:P,end:ke},e.slice(O-1,I)),P=ke):(g=e.slice(O-1,I),F+=g,d+=g.length,h=I-1)}else A===10&&(m++,p++,d=0),A===A?(F+=je(A),d++):me();return y.join("");function Z(){return{line:m,column:d,offset:h+(c.offset||0)}}function Q(Fe,z){var lt=Z();lt.column+=z,lt.offset+=z,i.call(l,Ae[Fe],lt,Fe)}function me(){F&&(y.push(F),a&&a.call(o,F,{start:P,end:Z()}),F="")}}function ED(e){return e>=55296&&e<=57343||e>1114111}function CD(e){return e>=1&&e<=8||e===11||e>=13&&e<=31||e>=127&&e<=159||e>=64976&&e<=65007||(e&65535)===65535||(e&65535)===65534}});var Ou=C((wv,Su)=>{"use strict";var bD=Ie(),_u=pr();Su.exports=yD;function yD(e){return t.raw=n,t;function r(u){for(var i=e.offset,o=u.line,s=[];++o&&o in i;)s.push((i[o]||0)+1);return{start:u,indent:s}}function t(u,i,o){_u(u,{position:r(i),warning:a,text:o,reference:o,textContext:e,referenceContext:e})}function n(u,i,o){return _u(u,bD(o,{position:r(i),warning:a}))}function a(u,i,o){o!==3&&e.file.message(u,i)}}});var Iu=C((kv,Lu)=>{"use strict";Lu.exports=AD;function AD(e){return r;function r(t,n){var a=this,u=a.offset,i=[],o=a[e+"Methods"],s=a[e+"Tokenizers"],l=n.line,c=n.column,f,D,h,p,d,m;if(!t)return i;for(x.now=E,x.file=a.file,F("");t;){for(f=-1,D=o.length,d=!1;++f<D&&(p=o[f],h=s[p],!(h&&(!h.onlyAtStart||a.atStart)&&(!h.notInList||!a.inList)&&(!h.notInBlock||!a.inBlock)&&(!h.notInLink||!a.inLink)&&(m=t.length,h.apply(a,[x,t]),d=m!==t.length,d))););d||a.file.fail(new Error("Infinite loop"),x.now())}return a.eof=E(),i;function F(v){for(var w=-1,k=v.indexOf(`
`);k!==-1;)l++,w=k,k=v.indexOf(`
`,k+1);w===-1?c+=v.length:c=v.length-w,l in u&&(w!==-1?c+=u[l]:c<=u[l]&&(c=u[l]+1))}function y(){var v=[],w=l+1;return function(){for(var k=l+1;w<k;)v.push((u[w]||0)+1),w++;return v}}function E(){var v={line:l,column:c};return v.offset=a.toOffset(v),v}function B(v){this.start=v,this.end=E()}function b(v){t.slice(0,v.length)!==v&&a.file.fail(new Error("Incorrectly eaten value: please report this warning on https://git.io/vg5Ft"),E())}function g(){var v=E();return w;function w(k,q){var T=k.position,R=T?T.start:v,O=[],S=T&&T.end.line,_=v.line;if(k.position=new B(R),T&&q&&T.indent){if(O=T.indent,S<_){for(;++S<_;)O.push((u[S]||0)+1);O.push(v.column)}q=O.concat(q)}return k.position.indent=q||[],k}}function A(v,w){var k=w?w.children:i,q=k[k.length-1],T;return q&&v.type===q.type&&(v.type==="text"||v.type==="blockquote")&&Pu(q)&&Pu(v)&&(T=v.type==="text"?xD:wD,v=T.call(a,q,v)),v!==q&&k.push(v),a.atStart&&i.length!==0&&a.exitStart(),v}function x(v){var w=y(),k=g(),q=E();return b(v),T.reset=R,R.test=O,T.test=O,t=t.slice(v.length),F(v),w=w(),T;function T(S,_){return k(A(k(S),_),w)}function R(){var S=T.apply(null,arguments);return l=q.line,c=q.column,t=v+t,S}function O(){var S=k({});return l=q.line,c=q.column,t=v+t,S.position}}}}function Pu(e){var r,t;return e.type!=="text"||!e.position?!0:(r=e.position.start,t=e.position.end,r.line!==t.line||t.column-r.column===e.value.length)}function xD(e,r){return e.value+=r.value,e}function wD(e,r){return this.options.commonmark||this.options.gfm?r:(e.children=e.children.concat(r.children),e)}});var Uu=C((Bv,Ru)=>{"use strict";Ru.exports=Gr;var It=["\\","`","*","{","}","[","]","(",")","#","+","-",".","!","_",">"],Nt=It.concat(["~","|"]),Nu=Nt.concat([`
`,'"',"$","%","&","'",",","/",":",";","<","=","?","@","^"]);Gr.default=It;Gr.gfm=Nt;Gr.commonmark=Nu;function Gr(e){var r=e||{};return r.commonmark?Nu:r.gfm?Nt:It}});var Mu=C((qv,zu)=>{"use strict";zu.exports=["address","article","aside","base","basefont","blockquote","body","caption","center","col","colgroup","dd","details","dialog","dir","div","dl","dt","fieldset","figcaption","figure","footer","form","frame","frameset","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","iframe","legend","li","link","main","menu","menuitem","meta","nav","noframes","ol","optgroup","option","p","param","pre","section","source","title","summary","table","tbody","td","tfoot","th","thead","title","tr","track","ul"]});var Rt=C((Tv,Yu)=>{"use strict";Yu.exports={position:!0,gfm:!0,commonmark:!1,pedantic:!1,blocks:Mu()}});var Vu=C((_v,Gu)=>{"use strict";var kD=Ie(),BD=Uu(),qD=Rt();Gu.exports=TD;function TD(e){var r=this,t=r.options,n,a;if(e==null)e={};else if(typeof e=="object")e=kD(e);else throw new Error("Invalid value `"+e+"` for setting `options`");for(n in qD){if(a=e[n],a==null&&(a=t[n]),n!=="blocks"&&typeof a!="boolean"||n==="blocks"&&typeof a!="object")throw new Error("Invalid value `"+a+"` for setting `options."+n+"`");e[n]=a}return r.options=e,r.escape=BD(e),r}});var Hu=C((Sv,$u)=>{"use strict";$u.exports=ju;function ju(e){if(e==null)return PD;if(typeof e=="string")return OD(e);if(typeof e=="object")return"length"in e?SD(e):_D(e);if(typeof e=="function")return e;throw new Error("Expected function, string, or object as test")}function _D(e){return r;function r(t){var n;for(n in e)if(t[n]!==e[n])return!1;return!0}}function SD(e){for(var r=[],t=-1;++t<e.length;)r[t]=ju(e[t]);return n;function n(){for(var a=-1;++a<r.length;)if(r[a].apply(this,arguments))return!0;return!1}}function OD(e){return r;function r(t){return!!(t&&t.type===e)}}function PD(){return!0}});var Ku=C((Ov,Wu)=>{Wu.exports=LD;function LD(e){return e}});var Zu=C((Pv,Qu)=>{"use strict";Qu.exports=Vr;var ID=Hu(),ND=Ku(),Ju=!0,Xu="skip",Ut=!1;Vr.CONTINUE=Ju;Vr.SKIP=Xu;Vr.EXIT=Ut;function Vr(e,r,t,n){var a,u;typeof r=="function"&&typeof t!="function"&&(n=t,t=r,r=null),u=ID(r),a=n?-1:1,i(e,null,[])();function i(o,s,l){var c=typeof o=="object"&&o!==null?o:{},f;return typeof c.type=="string"&&(f=typeof c.tagName=="string"?c.tagName:typeof c.name=="string"?c.name:void 0,D.displayName="node ("+ND(c.type+(f?"<"+f+">":""))+")"),D;function D(){var h=l.concat(o),p=[],d,m;if((!r||u(o,s,l[l.length-1]||null))&&(p=RD(t(o,l)),p[0]===Ut))return p;if(o.children&&p[0]!==Xu)for(m=(n?o.children.length:-1)+a;m>-1&&m<o.children.length;){if(d=i(o.children[m],m,h)(),d[0]===Ut)return d;m=typeof d[1]=="number"?d[1]:m+a}return p}}}function RD(e){return e!==null&&typeof e=="object"&&"length"in e?e:typeof e=="number"?[Ju,e]:[e]}});var ra=C((Lv,ea)=>{"use strict";ea.exports=$r;var jr=Zu(),UD=jr.CONTINUE,zD=jr.SKIP,MD=jr.EXIT;$r.CONTINUE=UD;$r.SKIP=zD;$r.EXIT=MD;function $r(e,r,t,n){typeof r=="function"&&typeof t!="function"&&(n=t,t=r,r=null),jr(e,r,a,n);function a(u,i){var o=i[i.length-1],s=o?o.children.indexOf(u):null;return t(u,s,o)}}});var na=C((Iv,ta)=>{"use strict";var YD=ra();ta.exports=GD;function GD(e,r){return YD(e,r?VD:jD),e}function VD(e){delete e.position}function jD(e){e.position=void 0}});var aa=C((Nv,ua)=>{"use strict";var ia=Ie(),$D=na();ua.exports=KD;var HD=`
`,WD=/\r\n|\r/g;function KD(){var e=this,r=String(e.file),t={line:1,column:1,offset:0},n=ia(t),a;return r=r.replace(WD,HD),r.charCodeAt(0)===65279&&(r=r.slice(1),n.column++,n.offset++),a={type:"root",children:e.tokenizeBlock(r,n),position:{start:t,end:e.eof||ia(t)}},e.options.position||$D(a,!0),a}});var sa=C((Rv,oa)=>{"use strict";var JD=/^[ \t]*(\n|$)/;oa.exports=XD;function XD(e,r,t){for(var n,a="",u=0,i=r.length;u<i&&(n=JD.exec(r.slice(u)),n!=null);)u+=n[0].length,a+=n[0];if(a!==""){if(t)return!0;e(a)}}});var Hr=C((Uv,ca)=>{"use strict";var pe="",zt;ca.exports=QD;function QD(e,r){if(typeof e!="string")throw new TypeError("expected a string");if(r===1)return e;if(r===2)return e+e;var t=e.length*r;if(zt!==e||typeof zt>"u")zt=e,pe="";else if(pe.length>=t)return pe.substr(0,t);for(;t>pe.length&&r>1;)r&1&&(pe+=e),r>>=1,e+=e;return pe+=e,pe=pe.substr(0,t),pe}});var Mt=C((zv,la)=>{"use strict";la.exports=ZD;function ZD(e){return String(e).replace(/\n+$/,"")}});var pa=C((Mv,Da)=>{"use strict";var ep=Hr(),rp=Mt();Da.exports=ip;var Yt=`
`,fa="	",Gt=" ",tp=4,np=ep(Gt,tp);function ip(e,r,t){for(var n=-1,a=r.length,u="",i="",o="",s="",l,c,f;++n<a;)if(l=r.charAt(n),f)if(f=!1,u+=o,i+=s,o="",s="",l===Yt)o=l,s=l;else for(u+=l,i+=l;++n<a;){if(l=r.charAt(n),!l||l===Yt){s=l,o=l;break}u+=l,i+=l}else if(l===Gt&&r.charAt(n+1)===l&&r.charAt(n+2)===l&&r.charAt(n+3)===l)o+=np,n+=3,f=!0;else if(l===fa)o+=l,f=!0;else{for(c="";l===fa||l===Gt;)c+=l,l=r.charAt(++n);if(l!==Yt)break;o+=c+l,s+=l}if(i)return t?!0:e(u)({type:"code",lang:null,meta:null,value:rp(i)})}});var ma=C((Yv,ha)=>{"use strict";ha.exports=sp;var Wr=`
`,dr="	",He=" ",up="~",da="`",ap=3,op=4;function sp(e,r,t){var n=this,a=n.options.gfm,u=r.length+1,i=0,o="",s,l,c,f,D,h,p,d,m,F,y,E,B;if(a){for(;i<u&&(c=r.charAt(i),!(c!==He&&c!==dr));)o+=c,i++;if(E=i,c=r.charAt(i),!(c!==up&&c!==da)){for(i++,l=c,s=1,o+=c;i<u&&(c=r.charAt(i),c===l);)o+=c,s++,i++;if(!(s<ap)){for(;i<u&&(c=r.charAt(i),!(c!==He&&c!==dr));)o+=c,i++;for(f="",p="";i<u&&(c=r.charAt(i),!(c===Wr||l===da&&c===l));)c===He||c===dr?p+=c:(f+=p+c,p=""),i++;if(c=r.charAt(i),!(c&&c!==Wr)){if(t)return!0;B=e.now(),B.column+=o.length,B.offset+=o.length,o+=f,f=n.decode.raw(n.unescape(f),B),p&&(o+=p),p="",F="",y="",d="",m="";for(var b=!0;i<u;){if(c=r.charAt(i),d+=F,m+=y,F="",y="",c!==Wr){d+=c,y+=c,i++;continue}for(b?(o+=c,b=!1):(F+=c,y+=c),p="",i++;i<u&&(c=r.charAt(i),c===He);)p+=c,i++;if(F+=p,y+=p.slice(E),!(p.length>=op)){for(p="";i<u&&(c=r.charAt(i),c===l);)p+=c,i++;if(F+=p,y+=p,!(p.length<s)){for(p="";i<u&&(c=r.charAt(i),!(c!==He&&c!==dr));)F+=c,y+=c,i++;if(!c||c===Wr)break}}}for(o+=d+F,i=-1,u=f.length;++i<u;)if(c=f.charAt(i),c===He||c===dr)D||(D=f.slice(0,i));else if(D){h=f.slice(i);break}return e(o)({type:"code",lang:D||f||null,meta:h||null,value:m})}}}}}});var Re=C((We,Fa)=>{We=Fa.exports=cp;function cp(e){return e.trim?e.trim():We.right(We.left(e))}We.left=function(e){return e.trimLeft?e.trimLeft():e.replace(/^\s\s*/,"")};We.right=function(e){if(e.trimRight)return e.trimRight();for(var r=/\s/,t=e.length;r.test(e.charAt(--t)););return e.slice(0,t+1)}});var Kr=C((Gv,ga)=>{"use strict";ga.exports=lp;function lp(e,r,t,n){for(var a=e.length,u=-1,i,o;++u<a;)if(i=e[u],o=i[1]||{},!(o.pedantic!==void 0&&o.pedantic!==t.options.pedantic)&&!(o.commonmark!==void 0&&o.commonmark!==t.options.commonmark)&&r[i[0]].apply(t,n))return!0;return!1}});var ba=C((Vv,Ca)=>{"use strict";var fp=Re(),Dp=Kr();Ca.exports=pp;var Vt=`
`,va="	",jt=" ",Ea=">";function pp(e,r,t){for(var n=this,a=n.offset,u=n.blockTokenizers,i=n.interruptBlockquote,o=e.now(),s=o.line,l=r.length,c=[],f=[],D=[],h,p=0,d,m,F,y,E,B,b,g;p<l&&(d=r.charAt(p),!(d!==jt&&d!==va));)p++;if(r.charAt(p)===Ea){if(t)return!0;for(p=0;p<l;){for(F=r.indexOf(Vt,p),B=p,b=!1,F===-1&&(F=l);p<l&&(d=r.charAt(p),!(d!==jt&&d!==va));)p++;if(r.charAt(p)===Ea?(p++,b=!0,r.charAt(p)===jt&&p++):p=B,y=r.slice(p,F),!b&&!fp(y)){p=B;break}if(!b&&(m=r.slice(p),Dp(i,u,n,[e,m,!0])))break;E=B===p?y:r.slice(B,F),D.push(p-B),c.push(E),f.push(y),p=F+1}for(p=-1,l=D.length,h=e(c.join(Vt));++p<l;)a[s]=(a[s]||0)+D[p],s++;return g=n.enterBlock(),f=n.tokenizeBlock(f.join(Vt),o),g(),h({type:"blockquote",children:f})}}});var xa=C((jv,Aa)=>{"use strict";Aa.exports=hp;var ya=`
`,hr="	",mr=" ",Fr="#",dp=6;function hp(e,r,t){for(var n=this,a=n.options.pedantic,u=r.length+1,i=-1,o=e.now(),s="",l="",c,f,D;++i<u;){if(c=r.charAt(i),c!==mr&&c!==hr){i--;break}s+=c}for(D=0;++i<=u;){if(c=r.charAt(i),c!==Fr){i--;break}s+=c,D++}if(!(D>dp)&&!(!D||!a&&r.charAt(i+1)===Fr)){for(u=r.length+1,f="";++i<u;){if(c=r.charAt(i),c!==mr&&c!==hr){i--;break}f+=c}if(!(!a&&f.length===0&&c&&c!==ya)){if(t)return!0;for(s+=f,f="",l="";++i<u&&(c=r.charAt(i),!(!c||c===ya));){if(c!==mr&&c!==hr&&c!==Fr){l+=f+c,f="";continue}for(;c===mr||c===hr;)f+=c,c=r.charAt(++i);if(!a&&l&&!f&&c===Fr){l+=c;continue}for(;c===Fr;)f+=c,c=r.charAt(++i);for(;c===mr||c===hr;)f+=c,c=r.charAt(++i);i--}return o.column+=s.length,o.offset+=s.length,s+=l+f,e(s)({type:"heading",depth:D,children:n.tokenizeInline(l,o)})}}}});var Ba=C(($v,ka)=>{"use strict";ka.exports=bp;var mp="	",Fp=`
`,wa=" ",gp="*",vp="-",Ep="_",Cp=3;function bp(e,r,t){for(var n=-1,a=r.length+1,u="",i,o,s,l;++n<a&&(i=r.charAt(n),!(i!==mp&&i!==wa));)u+=i;if(!(i!==gp&&i!==vp&&i!==Ep))for(o=i,u+=i,s=1,l="";++n<a;)if(i=r.charAt(n),i===o)s++,u+=l+o,l="";else if(i===wa)l+=i;else return s>=Cp&&(!i||i===Fp)?(u+=l,t?!0:e(u)({type:"thematicBreak"})):void 0}});var $t=C((Hv,Ta)=>{"use strict";Ta.exports=wp;var qa="	",yp=" ",Ap=1,xp=4;function wp(e){for(var r=0,t=0,n=e.charAt(r),a={},u,i=0;n===qa||n===yp;){for(u=n===qa?xp:Ap,t+=u,u>1&&(t=Math.floor(t/u)*u);i<t;)a[++i]=r;n=e.charAt(++r)}return{indent:t,stops:a}}});var Oa=C((Wv,Sa)=>{"use strict";var kp=Re(),Bp=Hr(),qp=$t();Sa.exports=Sp;var _a=`
`,Tp=" ",_p="!";function Sp(e,r){var t=e.split(_a),n=t.length+1,a=1/0,u=[],i,o,s;for(t.unshift(Bp(Tp,r)+_p);n--;)if(o=qp(t[n]),u[n]=o.stops,kp(t[n]).length!==0)if(o.indent)o.indent>0&&o.indent<a&&(a=o.indent);else{a=1/0;break}if(a!==1/0)for(n=t.length;n--;){for(s=u[n],i=a;i&&!(i in s);)i--;t[n]=t[n].slice(s[i]+1)}return t.shift(),t.join(_a)}});var Ua=C((Kv,Ra)=>{"use strict";var Op=Re(),Pp=Hr(),Pa=Ne(),Lp=$t(),Ip=Oa(),Np=Kr();Ra.exports=jp;var Ht="*",Rp="_",La="+",Wt="-",Ia=".",de=" ",ie=`
`,Jr="	",Na=")",Up="x",xe=4,zp=/\n\n(?!\s*$)/,Mp=/^\[([ X\tx])][ \t]/,Yp=/^([ \t]*)([*+-]|\d+[.)])( {1,4}(?! )| |\t|$|(?=\n))([^\n]*)/,Gp=/^([ \t]*)([*+-]|\d+[.)])([ \t]+)/,Vp=/^( {1,4}|\t)?/gm;function jp(e,r,t){for(var n=this,a=n.options.commonmark,u=n.options.pedantic,i=n.blockTokenizers,o=n.interruptList,s=0,l=r.length,c=null,f,D,h,p,d,m,F,y,E,B,b,g,A,x,v,w,k,q,T,R=!1,O,S,_,P;s<l&&(p=r.charAt(s),!(p!==Jr&&p!==de));)s++;if(p=r.charAt(s),p===Ht||p===La||p===Wt)d=p,h=!1;else{for(h=!0,D="";s<l&&(p=r.charAt(s),!!Pa(p));)D+=p,s++;if(p=r.charAt(s),!D||!(p===Ia||a&&p===Na)||t&&D!=="1")return;c=parseInt(D,10),d=p}if(p=r.charAt(++s),!(p!==de&&p!==Jr&&(u||p!==ie&&p!==""))){if(t)return!0;for(s=0,x=[],v=[],w=[];s<l;){for(m=r.indexOf(ie,s),F=s,y=!1,P=!1,m===-1&&(m=l),f=0;s<l;){if(p=r.charAt(s),p===Jr)f+=xe-f%xe;else if(p===de)f++;else break;s++}if(k&&f>=k.indent&&(P=!0),p=r.charAt(s),E=null,!P){if(p===Ht||p===La||p===Wt)E=p,s++,f++;else{for(D="";s<l&&(p=r.charAt(s),!!Pa(p));)D+=p,s++;p=r.charAt(s),s++,D&&(p===Ia||a&&p===Na)&&(E=p,f+=D.length+1)}if(E)if(p=r.charAt(s),p===Jr)f+=xe-f%xe,s++;else if(p===de){for(_=s+xe;s<_&&r.charAt(s)===de;)s++,f++;s===_&&r.charAt(s)===de&&(s-=xe-1,f-=xe-1)}else p!==ie&&p!==""&&(E=null)}if(E){if(!u&&d!==E)break;y=!0}else!a&&!P&&r.charAt(F)===de?P=!0:a&&k&&(P=f>=k.indent||f>xe),y=!1,s=F;if(b=r.slice(F,m),B=F===s?b:r.slice(s,m),(E===Ht||E===Rp||E===Wt)&&i.thematicBreak.call(n,e,b,!0))break;if(g=A,A=!y&&!Op(B).length,P&&k)k.value=k.value.concat(w,b),v=v.concat(w,b),w=[];else if(y)w.length!==0&&(R=!0,k.value.push(""),k.trail=w.concat()),k={value:[b],indent:f,trail:[]},x.push(k),v=v.concat(w,b),w=[];else if(A){if(g&&!a)break;w.push(b)}else{if(g||Np(o,i,n,[e,b,!0]))break;k.value=k.value.concat(w,b),v=v.concat(w,b),w=[]}s=m+1}for(O=e(v.join(ie)).reset({type:"list",ordered:h,start:c,spread:R,children:[]}),q=n.enterList(),T=n.enterBlock(),s=-1,l=x.length;++s<l;)k=x[s].value.join(ie),S=e.now(),e(k)($p(n,k,S),O),k=x[s].trail.join(ie),s!==l-1&&(k+=ie),e(k);return q(),T(),O}}function $p(e,r,t){var n=e.offset,a=e.options.pedantic?Hp:Wp,u=null,i,o;return r=a.apply(null,arguments),e.options.gfm&&(i=r.match(Mp),i&&(o=i[0].length,u=i[1].toLowerCase()===Up,n[t.line]+=o,r=r.slice(o))),{type:"listItem",spread:zp.test(r),checked:u,children:e.tokenizeBlock(r,t)}}function Hp(e,r,t){var n=e.offset,a=t.line;return r=r.replace(Gp,u),a=t.line,r.replace(Vp,u);function u(i){return n[a]=(n[a]||0)+i.length,a++,""}}function Wp(e,r,t){var n=e.offset,a=t.line,u,i,o,s,l,c,f;for(r=r.replace(Yp,D),s=r.split(ie),l=Ip(r,Lp(u).indent).split(ie),l[0]=o,n[a]=(n[a]||0)+i.length,a++,c=0,f=s.length;++c<f;)n[a]=(n[a]||0)+s[c].length-l[c].length,a++;return l.join(ie);function D(h,p,d,m,F){return i=p+d+m,o=F,Number(d)<10&&i.length%2===1&&(d=de+d),u=p+Pp(de,d.length)+m,u+o}}});var Ga=C((Jv,Ya)=>{"use strict";Ya.exports=ed;var Kt=`
`,Kp="	",za=" ",Ma="=",Jp="-",Xp=3,Qp=1,Zp=2;function ed(e,r,t){for(var n=this,a=e.now(),u=r.length,i=-1,o="",s,l,c,f,D;++i<u;){if(c=r.charAt(i),c!==za||i>=Xp){i--;break}o+=c}for(s="",l="";++i<u;){if(c=r.charAt(i),c===Kt){i--;break}c===za||c===Kp?l+=c:(s+=l+c,l="")}if(a.column+=o.length,a.offset+=o.length,o+=s+l,c=r.charAt(++i),f=r.charAt(++i),!(c!==Kt||f!==Ma&&f!==Jp)){for(o+=c,l=f,D=f===Ma?Qp:Zp;++i<u;){if(c=r.charAt(i),c!==f){if(c!==Kt)return;i--;break}l+=c}return t?!0:e(o+l)({type:"heading",depth:D,children:n.tokenizeInline(s,a)})}}});var Xt=C(Jt=>{"use strict";var rd="[a-zA-Z_:][a-zA-Z0-9:._-]*",td="[^\"'=<>`\\u0000-\\u0020]+",nd="'[^']*'",id='"[^"]*"',ud="(?:"+td+"|"+nd+"|"+id+")",ad="(?:\\s+"+rd+"(?:\\s*=\\s*"+ud+")?)",Va="<[A-Za-z][A-Za-z0-9\\-]*"+ad+"*\\s*\\/?>",ja="<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>",od="<!---->|<!--(?:-?[^>-])(?:-?[^-])*-->",sd="<[?].*?[?]>",cd="<![A-Za-z]+\\s+[^>]*>",ld="<!\\[CDATA\\[[\\s\\S]*?\\]\\]>";Jt.openCloseTag=new RegExp("^(?:"+Va+"|"+ja+")");Jt.tag=new RegExp("^(?:"+Va+"|"+ja+"|"+od+"|"+sd+"|"+cd+"|"+ld+")")});var Ka=C((Qv,Wa)=>{"use strict";var fd=Xt().openCloseTag;Wa.exports=wd;var Dd="	",pd=" ",$a=`
`,dd="<",hd=/^<(script|pre|style)(?=(\s|>|$))/i,md=/<\/(script|pre|style)>/i,Fd=/^<!--/,gd=/-->/,vd=/^<\?/,Ed=/\?>/,Cd=/^<![A-Za-z]/,bd=/>/,yd=/^<!\[CDATA\[/,Ad=/]]>/,Ha=/^$/,xd=new RegExp(fd.source+"\\s*$");function wd(e,r,t){for(var n=this,a=n.options.blocks.join("|"),u=new RegExp("^</?("+a+")(?=(\\s|/?>|$))","i"),i=r.length,o=0,s,l,c,f,D,h,p,d=[[hd,md,!0],[Fd,gd,!0],[vd,Ed,!0],[Cd,bd,!0],[yd,Ad,!0],[u,Ha,!0],[xd,Ha,!1]];o<i&&(f=r.charAt(o),!(f!==Dd&&f!==pd));)o++;if(r.charAt(o)===dd){for(s=r.indexOf($a,o+1),s=s===-1?i:s,l=r.slice(o,s),c=-1,D=d.length;++c<D;)if(d[c][0].test(l)){h=d[c];break}if(h){if(t)return h[2];if(o=s,!h[1].test(l))for(;o<i;){if(s=r.indexOf($a,o+1),s=s===-1?i:s,l=r.slice(o+1,s),h[1].test(l)){l&&(o=s);break}o=s}return p=r.slice(0,o),e(p)({type:"html",value:p})}}}});var ue=C((Zv,Ja)=>{"use strict";Ja.exports=qd;var kd=String.fromCharCode,Bd=/\s/;function qd(e){return Bd.test(typeof e=="number"?kd(e):e.charAt(0))}});var Qt=C((eE,Xa)=>{"use strict";var Td=xr();Xa.exports=_d;function _d(e){return Td(e).toLowerCase()}});var io=C((rE,no)=>{"use strict";var Sd=ue(),Od=Qt();no.exports=Nd;var Qa='"',Za="'",Pd="\\",Ke=`
`,Xr="	",Qr=" ",en="[",gr="]",Ld="(",Id=")",eo=":",ro="<",to=">";function Nd(e,r,t){for(var n=this,a=n.options.commonmark,u=0,i=r.length,o="",s,l,c,f,D,h,p,d;u<i&&(f=r.charAt(u),!(f!==Qr&&f!==Xr));)o+=f,u++;if(f=r.charAt(u),f===en){for(u++,o+=f,c="";u<i&&(f=r.charAt(u),f!==gr);)f===Pd&&(c+=f,u++,f=r.charAt(u)),c+=f,u++;if(!(!c||r.charAt(u)!==gr||r.charAt(u+1)!==eo)){for(h=c,o+=c+gr+eo,u=o.length,c="";u<i&&(f=r.charAt(u),!(f!==Xr&&f!==Qr&&f!==Ke));)o+=f,u++;if(f=r.charAt(u),c="",s=o,f===ro){for(u++;u<i&&(f=r.charAt(u),!!Zt(f));)c+=f,u++;if(f=r.charAt(u),f===Zt.delimiter)o+=ro+c+f,u++;else{if(a)return;u-=c.length+1,c=""}}if(!c){for(;u<i&&(f=r.charAt(u),!!Rd(f));)c+=f,u++;o+=c}if(c){for(p=c,c="";u<i&&(f=r.charAt(u),!(f!==Xr&&f!==Qr&&f!==Ke));)c+=f,u++;if(f=r.charAt(u),D=null,f===Qa?D=Qa:f===Za?D=Za:f===Ld&&(D=Id),!D)c="",u=o.length;else if(c){for(o+=c+f,u=o.length,c="";u<i&&(f=r.charAt(u),f!==D);){if(f===Ke){if(u++,f=r.charAt(u),f===Ke||f===D)return;c+=Ke}c+=f,u++}if(f=r.charAt(u),f!==D)return;l=o,o+=c+f,u++,d=c,c=""}else return;for(;u<i&&(f=r.charAt(u),!(f!==Xr&&f!==Qr));)o+=f,u++;if(f=r.charAt(u),!f||f===Ke)return t?!0:(s=e(s).test().end,p=n.decode.raw(n.unescape(p),s,{nonTerminated:!1}),d&&(l=e(l).test().end,d=n.decode.raw(n.unescape(d),l)),e(o)({type:"definition",identifier:Od(h),label:h,title:d||null,url:p}))}}}}function Zt(e){return e!==to&&e!==en&&e!==gr}Zt.delimiter=to;function Rd(e){return e!==en&&e!==gr&&!Sd(e)}});var oo=C((tE,ao)=>{"use strict";var Ud=ue();ao.exports=Kd;var zd="	",Zr=`
`,Md=" ",Yd="-",Gd=":",Vd="\\",rn="|",jd=1,$d=2,uo="left",Hd="center",Wd="right";function Kd(e,r,t){var n=this,a,u,i,o,s,l,c,f,D,h,p,d,m,F,y,E,B,b,g,A,x,v;if(n.options.gfm){for(a=0,E=0,l=r.length+1,c=[];a<l;){if(A=r.indexOf(Zr,a),x=r.indexOf(rn,a+1),A===-1&&(A=r.length),x===-1||x>A){if(E<$d)return;break}c.push(r.slice(a,A)),E++,a=A+1}for(o=c.join(Zr),u=c.splice(1,1)[0]||[],a=0,l=u.length,E--,i=!1,p=[];a<l;){if(D=u.charAt(a),D===rn){if(h=null,i===!1){if(v===!1)return}else p.push(i),i=!1;v=!1}else if(D===Yd)h=!0,i=i||null;else if(D===Gd)i===uo?i=Hd:h&&i===null?i=Wd:i=uo;else if(!Ud(D))return;a++}if(i!==!1&&p.push(i),!(p.length<jd)){if(t)return!0;for(y=-1,b=[],g=e(o).reset({type:"table",align:p,children:b});++y<E;){for(B=c[y],s={type:"tableRow",children:[]},y&&e(Zr),e(B).reset(s,g),l=B.length+1,a=0,f="",d="",m=!0;a<l;){if(D=B.charAt(a),D===zd||D===Md){d?f+=D:e(D),a++;continue}D===""||D===rn?m?e(D):((d||D)&&!m&&(o=d,f.length>1&&(D?(o+=f.slice(0,-1),f=f.charAt(f.length-1)):(o+=f,f="")),F=e.now(),e(o)({type:"tableCell",children:n.tokenizeInline(d,F)},s)),e(f+D),f="",d=""):(f&&(d+=f,f=""),d+=D,D===Vd&&a!==l-2&&(d+=B.charAt(a+1),a++)),m=!1,a++}y||e(Zr+u)}return g}}}});var lo=C((nE,co)=>{"use strict";var Jd=Re(),Xd=Mt(),Qd=Kr();co.exports=rh;var Zd="	",vr=`
`,eh=" ",so=4;function rh(e,r,t){for(var n=this,a=n.options,u=a.commonmark,i=n.blockTokenizers,o=n.interruptParagraph,s=r.indexOf(vr),l=r.length,c,f,D,h,p;s<l;){if(s===-1){s=l;break}if(r.charAt(s+1)===vr)break;if(u){for(h=0,c=s+1;c<l;){if(D=r.charAt(c),D===Zd){h=so;break}else if(D===eh)h++;else break;c++}if(h>=so&&D!==vr){s=r.indexOf(vr,s+1);continue}}if(f=r.slice(s+1),Qd(o,i,n,[e,f,!0]))break;if(c=s,s=r.indexOf(vr,s+1),s!==-1&&Jd(r.slice(c,s))===""){s=c;break}}return f=r.slice(0,s),t?!0:(p=e.now(),f=Xd(f),e(f)({type:"paragraph",children:n.tokenizeInline(f,p)}))}});var Do=C((iE,fo)=>{"use strict";fo.exports=th;function th(e,r){return e.indexOf("\\",r)}});var Fo=C((uE,mo)=>{"use strict";var nh=Do();mo.exports=ho;ho.locator=nh;var ih=`
`,po="\\";function ho(e,r,t){var n=this,a,u;if(r.charAt(0)===po&&(a=r.charAt(1),n.escape.indexOf(a)!==-1))return t?!0:(a===ih?u={type:"break"}:u={type:"text",value:a},e(po+a)(u))}});var tn=C((aE,go)=>{"use strict";go.exports=uh;function uh(e,r){return e.indexOf("<",r)}});var yo=C((oE,bo)=>{"use strict";var vo=ue(),ah=pr(),oh=tn();bo.exports=on;on.locator=oh;on.notInLink=!0;var Eo="<",nn=">",Co="@",un="/",an="mailto:",et=an.length;function on(e,r,t){var n=this,a="",u=r.length,i=0,o="",s=!1,l="",c,f,D,h,p;if(r.charAt(0)===Eo){for(i++,a=Eo;i<u&&(c=r.charAt(i),!(vo(c)||c===nn||c===Co||c===":"&&r.charAt(i+1)===un));)o+=c,i++;if(o){if(l+=o,o="",c=r.charAt(i),l+=c,i++,c===Co)s=!0;else{if(c!==":"||r.charAt(i+1)!==un)return;l+=un,i++}for(;i<u&&(c=r.charAt(i),!(vo(c)||c===nn));)o+=c,i++;if(c=r.charAt(i),!(!o||c!==nn))return t?!0:(l+=o,D=l,a+=l+c,f=e.now(),f.column++,f.offset++,s&&(l.slice(0,et).toLowerCase()===an?(D=D.slice(et),f.column+=et,f.offset+=et):l=an+l),h=n.inlineTokenizers,n.inlineTokenizers={text:h.text},p=n.enterLink(),D=n.tokenizeInline(D,f),n.inlineTokenizers=h,p(),e(a)({type:"link",title:null,url:ah(l,{nonTerminated:!1}),children:D}))}}}});var xo=C((sE,Ao)=>{"use strict";Ao.exports=sh;function sh(e,r){var t=String(e),n=0,a;if(typeof r!="string")throw new Error("Expected character");for(a=t.indexOf(r);a!==-1;)n++,a=t.indexOf(r,a+r.length);return n}});var Bo=C((cE,ko)=>{"use strict";ko.exports=ch;var wo=["www.","http://","https://"];function ch(e,r){var t=-1,n,a,u;if(!this.options.gfm)return t;for(a=wo.length,n=-1;++n<a;)u=e.indexOf(wo[n],r),u!==-1&&(t===-1||u<t)&&(t=u);return t}});var Oo=C((lE,So)=>{"use strict";var qo=xo(),lh=pr(),fh=Ne(),sn=Ve(),Dh=ue(),ph=Bo();So.exports=ln;ln.locator=ph;ln.notInLink=!0;var dh=33,hh=38,mh=41,Fh=42,gh=44,vh=45,cn=46,Eh=58,Ch=59,bh=63,yh=60,To=95,Ah=126,xh="(",_o=")";function ln(e,r,t){var n=this,a=n.options.gfm,u=n.inlineTokenizers,i=r.length,o=-1,s=!1,l,c,f,D,h,p,d,m,F,y,E,B,b,g;if(a){if(r.slice(0,4)==="www.")s=!0,D=4;else if(r.slice(0,7).toLowerCase()==="http://")D=7;else if(r.slice(0,8).toLowerCase()==="https://")D=8;else return;for(o=D-1,f=D,l=[];D<i;){if(d=r.charCodeAt(D),d===cn){if(o===D-1)break;l.push(D),o=D,D++;continue}if(fh(d)||sn(d)||d===vh||d===To){D++;continue}break}if(d===cn&&(l.pop(),D--),l[0]!==void 0&&(c=l.length<2?f:l[l.length-2]+1,r.slice(c,D).indexOf("_")===-1)){if(t)return!0;for(m=D,h=D;D<i&&(d=r.charCodeAt(D),!(Dh(d)||d===yh));)D++,d===dh||d===Fh||d===gh||d===cn||d===Eh||d===bh||d===To||d===Ah||(m=D);if(D=m,r.charCodeAt(D-1)===mh)for(p=r.slice(h,D),F=qo(p,xh),y=qo(p,_o);y>F;)D=h+p.lastIndexOf(_o),p=r.slice(h,D),y--;if(r.charCodeAt(D-1)===Ch&&(D--,sn(r.charCodeAt(D-1)))){for(m=D-2;sn(r.charCodeAt(m));)m--;r.charCodeAt(m)===hh&&(D=m)}return E=r.slice(0,D),b=lh(E,{nonTerminated:!1}),s&&(b="http://"+b),g=n.enterLink(),n.inlineTokenizers={text:u.text},B=n.tokenizeInline(E,e.now()),n.inlineTokenizers=u,g(),e(E)({type:"link",title:null,url:b,children:B})}}}});var No=C((fE,Io)=>{"use strict";var wh=Ne(),kh=Ve(),Bh=43,qh=45,Th=46,_h=95;Io.exports=Lo;function Lo(e,r){var t=this,n,a;if(!this.options.gfm||(n=e.indexOf("@",r),n===-1))return-1;if(a=n,a===r||!Po(e.charCodeAt(a-1)))return Lo.call(t,e,n+1);for(;a>r&&Po(e.charCodeAt(a-1));)a--;return a}function Po(e){return wh(e)||kh(e)||e===Bh||e===qh||e===Th||e===_h}});var Mo=C((DE,zo)=>{"use strict";var Sh=pr(),Ro=Ne(),Uo=Ve(),Oh=No();zo.exports=pn;pn.locator=Oh;pn.notInLink=!0;var Ph=43,fn=45,rt=46,Lh=64,Dn=95;function pn(e,r,t){var n=this,a=n.options.gfm,u=n.inlineTokenizers,i=0,o=r.length,s=-1,l,c,f,D;if(a){for(l=r.charCodeAt(i);Ro(l)||Uo(l)||l===Ph||l===fn||l===rt||l===Dn;)l=r.charCodeAt(++i);if(i!==0&&l===Lh){for(i++;i<o;){if(l=r.charCodeAt(i),Ro(l)||Uo(l)||l===fn||l===rt||l===Dn){i++,s===-1&&l===rt&&(s=i);continue}break}if(!(s===-1||s===i||l===fn||l===Dn))return l===rt&&i--,c=r.slice(0,i),t?!0:(D=n.enterLink(),n.inlineTokenizers={text:u.text},f=n.tokenizeInline(c,e.now()),n.inlineTokenizers=u,D(),e(c)({type:"link",title:null,url:"mailto:"+Sh(c,{nonTerminated:!1}),children:f}))}}}});var Vo=C((pE,Go)=>{"use strict";var Ih=Ve(),Nh=tn(),Rh=Xt().tag;Go.exports=Yo;Yo.locator=Nh;var Uh="<",zh="?",Mh="!",Yh="/",Gh=/^<a /i,Vh=/^<\/a>/i;function Yo(e,r,t){var n=this,a=r.length,u,i;if(!(r.charAt(0)!==Uh||a<3)&&(u=r.charAt(1),!(!Ih(u)&&u!==zh&&u!==Mh&&u!==Yh)&&(i=r.match(Rh),!!i)))return t?!0:(i=i[0],!n.inLink&&Gh.test(i)?n.inLink=!0:n.inLink&&Vh.test(i)&&(n.inLink=!1),e(i)({type:"html",value:i}))}});var dn=C((dE,jo)=>{"use strict";jo.exports=jh;function jh(e,r){var t=e.indexOf("[",r),n=e.indexOf("![",r);return n===-1||t<n?t:n}});var Qo=C((hE,Xo)=>{"use strict";var Er=ue(),$h=dn();Xo.exports=Jo;Jo.locator=$h;var Hh=`
`,Wh="!",$o='"',Ho="'",Je="(",Cr=")",hn="<",mn=">",Wo="[",br="\\",Kh="]",Ko="`";function Jo(e,r,t){var n=this,a="",u=0,i=r.charAt(0),o=n.options.pedantic,s=n.options.commonmark,l=n.options.gfm,c,f,D,h,p,d,m,F,y,E,B,b,g,A,x,v,w,k;if(i===Wh&&(F=!0,a=i,i=r.charAt(++u)),i===Wo&&!(!F&&n.inLink)){for(a+=i,A="",u++,B=r.length,v=e.now(),g=0,v.column+=u,v.offset+=u;u<B;){if(i=r.charAt(u),d=i,i===Ko){for(f=1;r.charAt(u+1)===Ko;)d+=i,u++,f++;D?f>=D&&(D=0):D=f}else if(i===br)u++,d+=r.charAt(u);else if((!D||l)&&i===Wo)g++;else if((!D||l)&&i===Kh)if(g)g--;else{if(r.charAt(u+1)!==Je)return;d+=Je,c=!0,u++;break}A+=d,d="",u++}if(c){for(y=A,a+=A+d,u++;u<B&&(i=r.charAt(u),!!Er(i));)a+=i,u++;if(i=r.charAt(u),A="",h=a,i===hn){for(u++,h+=hn;u<B&&(i=r.charAt(u),i!==mn);){if(s&&i===Hh)return;A+=i,u++}if(r.charAt(u)!==mn)return;a+=hn+A+mn,x=A,u++}else{for(i=null,d="";u<B&&(i=r.charAt(u),!(d&&(i===$o||i===Ho||s&&i===Je)));){if(Er(i)){if(!o)break;d+=i}else{if(i===Je)g++;else if(i===Cr){if(g===0)break;g--}A+=d,d="",i===br&&(A+=br,i=r.charAt(++u)),A+=i}u++}a+=A,x=A,u=a.length}for(A="";u<B&&(i=r.charAt(u),!!Er(i));)A+=i,u++;if(i=r.charAt(u),a+=A,A&&(i===$o||i===Ho||s&&i===Je))if(u++,a+=i,A="",E=i===Je?Cr:i,p=a,s){for(;u<B&&(i=r.charAt(u),i!==E);)i===br&&(A+=br,i=r.charAt(++u)),u++,A+=i;if(i=r.charAt(u),i!==E)return;for(b=A,a+=A+i,u++;u<B&&(i=r.charAt(u),!!Er(i));)a+=i,u++}else for(d="";u<B;){if(i=r.charAt(u),i===E)m&&(A+=E+d,d=""),m=!0;else if(!m)A+=i;else if(i===Cr){a+=A+E+d,b=A;break}else Er(i)?d+=i:(A+=E+d+i,d="",m=!1);u++}if(r.charAt(u)===Cr)return t?!0:(a+=Cr,x=n.decode.raw(n.unescape(x),e(h).test().end,{nonTerminated:!1}),b&&(p=e(p).test().end,b=n.decode.raw(n.unescape(b),p)),k={type:F?"image":"link",title:b||null,url:x},F?k.alt=n.decode.raw(n.unescape(y),v)||null:(w=n.enterLink(),k.children=n.tokenizeInline(y,v),w()),e(a)(k))}}}});var rs=C((mE,es)=>{"use strict";var Jh=ue(),Xh=dn(),Qh=Qt();es.exports=Zo;Zo.locator=Xh;var Fn="link",Zh="image",e0="shortcut",r0="collapsed",gn="full",t0="!",tt="[",nt="\\",it="]";function Zo(e,r,t){var n=this,a=n.options.commonmark,u=r.charAt(0),i=0,o=r.length,s="",l="",c=Fn,f=e0,D,h,p,d,m,F,y,E;if(u===t0&&(c=Zh,l=u,u=r.charAt(++i)),u===tt){for(i++,l+=u,F="",E=0;i<o;){if(u=r.charAt(i),u===tt)y=!0,E++;else if(u===it){if(!E)break;E--}u===nt&&(F+=nt,u=r.charAt(++i)),F+=u,i++}if(s=F,D=F,u=r.charAt(i),u===it){if(i++,s+=u,F="",!a)for(;i<o&&(u=r.charAt(i),!!Jh(u));)F+=u,i++;if(u=r.charAt(i),u===tt){for(h="",F+=u,i++;i<o&&(u=r.charAt(i),!(u===tt||u===it));)u===nt&&(h+=nt,u=r.charAt(++i)),h+=u,i++;u=r.charAt(i),u===it?(f=h?gn:r0,F+=h+u,i++):h="",s+=F,F=""}else{if(!D)return;h=D}if(!(f!==gn&&y))return s=l+s,c===Fn&&n.inLink?null:t?!0:(p=e.now(),p.column+=l.length,p.offset+=l.length,h=f===gn?h:D,d={type:c+"Reference",identifier:Qh(h),label:h,referenceType:f},c===Fn?(m=n.enterLink(),d.children=n.tokenizeInline(D,p),m()):d.alt=n.decode.raw(n.unescape(D),p)||null,e(s)(d))}}}});var ns=C((FE,ts)=>{"use strict";ts.exports=n0;function n0(e,r){var t=e.indexOf("**",r),n=e.indexOf("__",r);return n===-1?t:t===-1||n<t?n:t}});var markdown_os=C((gE,as)=>{"use strict";var i0=Re(),is=ue(),u0=ns();as.exports=us;us.locator=u0;var a0="\\",o0="*",s0="_";function us(e,r,t){var n=this,a=0,u=r.charAt(a),i,o,s,l,c,f,D;if(!(u!==o0&&u!==s0||r.charAt(++a)!==u)&&(o=n.options.pedantic,s=u,c=s+s,f=r.length,a++,l="",u="",!(o&&is(r.charAt(a)))))for(;a<f;){if(D=u,u=r.charAt(a),u===s&&r.charAt(a+1)===s&&(!o||!is(D))&&(u=r.charAt(a+2),u!==s))return i0(l)?t?!0:(i=e.now(),i.column+=2,i.offset+=2,e(c+l+c)({type:"strong",children:n.tokenizeInline(l,i)})):void 0;!o&&u===a0&&(l+=u,u=r.charAt(++a)),l+=u,a++}}});var cs=C((vE,ss)=>{"use strict";ss.exports=f0;var c0=String.fromCharCode,l0=/\w/;function f0(e){return l0.test(typeof e=="number"?c0(e):e.charAt(0))}});var markdown_fs=C((EE,ls)=>{"use strict";ls.exports=D0;function D0(e,r){var t=e.indexOf("*",r),n=e.indexOf("_",r);return n===-1?t:t===-1||n<t?n:t}});var ms=C((CE,hs)=>{"use strict";var p0=Re(),d0=cs(),Ds=ue(),h0=markdown_fs();hs.exports=ds;ds.locator=h0;var m0="*",ps="_",F0="\\";function ds(e,r,t){var n=this,a=0,u=r.charAt(a),i,o,s,l,c,f,D;if(!(u!==m0&&u!==ps)&&(o=n.options.pedantic,c=u,s=u,f=r.length,a++,l="",u="",!(o&&Ds(r.charAt(a)))))for(;a<f;){if(D=u,u=r.charAt(a),u===s&&(!o||!Ds(D))){if(u=r.charAt(++a),u!==s){if(!p0(l)||D===s)return;if(!o&&s===ps&&d0(u)){l+=s;continue}return t?!0:(i=e.now(),i.column++,i.offset++,e(c+l+s)({type:"emphasis",children:n.tokenizeInline(l,i)}))}l+=s}!o&&u===F0&&(l+=u,u=r.charAt(++a)),l+=u,a++}}});var gs=C((bE,Fs)=>{"use strict";Fs.exports=g0;function g0(e,r){return e.indexOf("~~",r)}});var ys=C((yE,bs)=>{"use strict";var vs=ue(),v0=gs();bs.exports=Cs;Cs.locator=v0;var ut="~",Es="~~";function Cs(e,r,t){var n=this,a="",u="",i="",o="",s,l,c;if(!(!n.options.gfm||r.charAt(0)!==ut||r.charAt(1)!==ut||vs(r.charAt(2))))for(s=1,l=r.length,c=e.now(),c.column+=2,c.offset+=2;++s<l;){if(a=r.charAt(s),a===ut&&u===ut&&(!i||!vs(i)))return t?!0:e(Es+o+Es)({type:"delete",children:n.tokenizeInline(o,c)});o+=u,i=u,u=a}}});var xs=C((AE,As)=>{"use strict";As.exports=E0;function E0(e,r){return e.indexOf("`",r)}});var Bs=C((xE,ks)=>{"use strict";var C0=xs();ks.exports=ws;ws.locator=C0;var vn=10,En=32,Cn=96;function ws(e,r,t){for(var n=r.length,a=0,u,i,o,s,l,c;a<n&&r.charCodeAt(a)===Cn;)a++;if(!(a===0||a===n)){for(u=a,l=r.charCodeAt(a);a<n;){if(s=l,l=r.charCodeAt(a+1),s===Cn){if(i===void 0&&(i=a),o=a+1,l!==Cn&&o-i===u){c=!0;break}}else i!==void 0&&(i=void 0,o=void 0);a++}if(c){if(t)return!0;if(a=u,n=i,s=r.charCodeAt(a),l=r.charCodeAt(n-1),c=!1,n-a>2&&(s===En||s===vn)&&(l===En||l===vn)){for(a++,n--;a<n;){if(s=r.charCodeAt(a),s!==En&&s!==vn){c=!0;break}a++}c===!0&&(u++,i--)}return e(r.slice(0,o))({type:"inlineCode",value:r.slice(u,i)})}}}});var Ts=C((wE,qs)=>{"use strict";qs.exports=b0;function b0(e,r){for(var t=e.indexOf(`
`,r);t>r&&e.charAt(t-1)===" ";)t--;return t}});var Os=C((kE,Ss)=>{"use strict";var y0=Ts();Ss.exports=_s;_s.locator=y0;var A0=" ",x0=`
`,w0=2;function _s(e,r,t){for(var n=r.length,a=-1,u="",i;++a<n;){if(i=r.charAt(a),i===x0)return a<w0?void 0:t?!0:(u+=i,e(u)({type:"break"}));if(i!==A0)return;u+=i}}});var Ls=C((BE,Ps)=>{"use strict";Ps.exports=k0;function k0(e,r,t){var n=this,a,u,i,o,s,l,c,f,D,h;if(t)return!0;for(a=n.inlineMethods,o=a.length,u=n.inlineTokenizers,i=-1,D=r.length;++i<o;)f=a[i],!(f==="text"||!u[f])&&(c=u[f].locator,c||e.file.fail("Missing locator: `"+f+"`"),l=c.call(n,r,1),l!==-1&&l<D&&(D=l));s=r.slice(0,D),h=e.now(),n.decode(s,h,p);function p(d,m,F){e(F||d)({type:"text",value:d})}}});var Us=C((qE,Rs)=>{"use strict";var B0=Ie(),at=ru(),q0=nu(),T0=uu(),_0=Ou(),bn=Iu();Rs.exports=Is;function Is(e,r){this.file=r,this.offset={},this.options=B0(this.options),this.setOptions({}),this.inList=!1,this.inBlock=!1,this.inLink=!1,this.atStart=!0,this.toOffset=q0(r).toOffset,this.unescape=T0(this,"escape"),this.decode=_0(this)}var U=Is.prototype;U.setOptions=Vu();U.parse=aa();U.options=Rt();U.exitStart=at("atStart",!0);U.enterList=at("inList",!1);U.enterLink=at("inLink",!1);U.enterBlock=at("inBlock",!1);U.interruptParagraph=[["thematicBreak"],["list"],["atxHeading"],["fencedCode"],["blockquote"],["html"],["setextHeading",{commonmark:!1}],["definition",{commonmark:!1}]];U.interruptList=[["atxHeading",{pedantic:!1}],["fencedCode",{pedantic:!1}],["thematicBreak",{pedantic:!1}],["definition",{commonmark:!1}]];U.interruptBlockquote=[["indentedCode",{commonmark:!0}],["fencedCode",{commonmark:!0}],["atxHeading",{commonmark:!0}],["setextHeading",{commonmark:!0}],["thematicBreak",{commonmark:!0}],["html",{commonmark:!0}],["list",{commonmark:!0}],["definition",{commonmark:!1}]];U.blockTokenizers={blankLine:sa(),indentedCode:pa(),fencedCode:ma(),blockquote:ba(),atxHeading:xa(),thematicBreak:Ba(),list:Ua(),setextHeading:Ga(),html:Ka(),definition:io(),table:oo(),paragraph:lo()};U.inlineTokenizers={escape:Fo(),autoLink:yo(),url:Oo(),email:Mo(),html:Vo(),link:Qo(),reference:rs(),strong:markdown_os(),emphasis:ms(),deletion:ys(),code:Bs(),break:Os(),text:Ls()};U.blockMethods=Ns(U.blockTokenizers);U.inlineMethods=Ns(U.inlineTokenizers);U.tokenizeBlock=bn("block");U.tokenizeInline=bn("inline");U.tokenizeFactory=bn;function Ns(e){var r=[],t;for(t in e)r.push(t);return r}});var Gs=C((TE,Ys)=>{"use strict";var S0=Zi(),O0=Ie(),zs=Us();Ys.exports=Ms;Ms.Parser=zs;function Ms(e){var r=this.data("settings"),t=S0(zs);t.prototype.options=O0(t.prototype.options,r,e),this.Parser=t}});var js=C((_E,Vs)=>{"use strict";Vs.exports=P0;function P0(e){if(e)throw e}});var yn=C((SE,$s)=>{$s.exports=function(r){return r!=null&&r.constructor!=null&&typeof r.constructor.isBuffer=="function"&&r.constructor.isBuffer(r)}});var rc=C((OE,ec)=>{"use strict";var ot=Object.prototype.hasOwnProperty,Zs=Object.prototype.toString,Hs=Object.defineProperty,Ws=Object.getOwnPropertyDescriptor,Ks=function(r){return typeof Array.isArray=="function"?Array.isArray(r):Zs.call(r)==="[object Array]"},Js=function(r){if(!r||Zs.call(r)!=="[object Object]")return!1;var t=ot.call(r,"constructor"),n=r.constructor&&r.constructor.prototype&&ot.call(r.constructor.prototype,"isPrototypeOf");if(r.constructor&&!t&&!n)return!1;var a;for(a in r);return typeof a>"u"||ot.call(r,a)},Xs=function(r,t){Hs&&t.name==="__proto__"?Hs(r,t.name,{enumerable:!0,configurable:!0,value:t.newValue,writable:!0}):r[t.name]=t.newValue},Qs=function(r,t){if(t==="__proto__")if(ot.call(r,t)){if(Ws)return Ws(r,t).value}else return;return r[t]};ec.exports=function e(){var r,t,n,a,u,i,o=arguments[0],s=1,l=arguments.length,c=!1;for(typeof o=="boolean"&&(c=o,o=arguments[1]||{},s=2),(o==null||typeof o!="object"&&typeof o!="function")&&(o={});s<l;++s)if(r=arguments[s],r!=null)for(t in r)n=Qs(o,t),a=Qs(r,t),o!==a&&(c&&a&&(Js(a)||(u=Ks(a)))?(u?(u=!1,i=n&&Ks(n)?n:[]):i=n&&Js(n)?n:{},Xs(o,{name:t,newValue:e(c,i,a)})):typeof a<"u"&&Xs(o,{name:t,newValue:a}));return o}});var nc=C((PE,tc)=>{"use strict";tc.exports=e=>{if(Object.prototype.toString.call(e)!=="[object Object]")return!1;let r=Object.getPrototypeOf(e);return r===null||r===Object.prototype}});var uc=C((LE,ic)=>{"use strict";var L0=[].slice;ic.exports=I0;function I0(e,r){var t;return n;function n(){var i=L0.call(arguments,0),o=e.length>i.length,s;o&&i.push(a);try{s=e.apply(null,i)}catch(l){if(o&&t)throw l;return a(l)}o||(s&&typeof s.then=="function"?s.then(u,a):s instanceof Error?a(s):u(s))}function a(){t||(t=!0,r.apply(null,arguments))}function u(i){a(null,i)}}});var lc=C((IE,cc)=>{"use strict";var oc=uc();cc.exports=sc;sc.wrap=oc;var ac=[].slice;function sc(){var e=[],r={};return r.run=t,r.use=n,r;function t(){var a=-1,u=ac.call(arguments,0,-1),i=arguments[arguments.length-1];if(typeof i!="function")throw new Error("Expected function as last argument, not "+i);o.apply(null,[null].concat(u));function o(s){var l=e[++a],c=ac.call(arguments,0),f=c.slice(1),D=u.length,h=-1;if(s){i(s);return}for(;++h<D;)(f[h]===null||f[h]===void 0)&&(f[h]=u[h]);u=f,l?oc(l,o).apply(null,u):i.apply(null,[null].concat(u))}}function n(a){if(typeof a!="function")throw new Error("Expected `fn` to be a function, not "+a);return e.push(a),r}}});var dc=C((NE,pc)=>{"use strict";var Xe={}.hasOwnProperty;pc.exports=N0;function N0(e){return!e||typeof e!="object"?"":Xe.call(e,"position")||Xe.call(e,"type")?fc(e.position):Xe.call(e,"start")||Xe.call(e,"end")?fc(e):Xe.call(e,"line")||Xe.call(e,"column")?An(e):""}function An(e){return(!e||typeof e!="object")&&(e={}),Dc(e.line)+":"+Dc(e.column)}function fc(e){return(!e||typeof e!="object")&&(e={}),An(e.start)+"-"+An(e.end)}function Dc(e){return e&&typeof e=="number"?e:1}});var Fc=C((RE,mc)=>{"use strict";var R0=dc();mc.exports=xn;function hc(){}hc.prototype=Error.prototype;xn.prototype=new hc;var we=xn.prototype;we.file="";we.name="";we.reason="";we.message="";we.stack="";we.fatal=null;we.column=null;we.line=null;function xn(e,r,t){var n,a,u;typeof r=="string"&&(t=r,r=null),n=U0(t),a=R0(r)||"1:1",u={start:{line:null,column:null},end:{line:null,column:null}},r&&r.position&&(r=r.position),r&&(r.start?(u=r,r=r.start):u.start=r),e.stack&&(this.stack=e.stack,e=e.message),this.message=e,this.name=a,this.reason=e,this.line=r?r.line:null,this.column=r?r.column:null,this.location=u,this.source=n[0],this.ruleId=n[1]}function U0(e){var r=[null,null],t;return typeof e=="string"&&(t=e.indexOf(":"),t===-1?r[1]=e:(r[0]=e.slice(0,t),r[1]=e.slice(t+1))),r}});var gc=C(Qe=>{"use strict";Qe.basename=z0;Qe.dirname=M0;Qe.extname=Y0;Qe.join=G0;Qe.sep="/";function z0(e,r){var t=0,n=-1,a,u,i,o;if(r!==void 0&&typeof r!="string")throw new TypeError('"ext" argument must be a string');if(yr(e),a=e.length,r===void 0||!r.length||r.length>e.length){for(;a--;)if(e.charCodeAt(a)===47){if(i){t=a+1;break}}else n<0&&(i=!0,n=a+1);return n<0?"":e.slice(t,n)}if(r===e)return"";for(u=-1,o=r.length-1;a--;)if(e.charCodeAt(a)===47){if(i){t=a+1;break}}else u<0&&(i=!0,u=a+1),o>-1&&(e.charCodeAt(a)===r.charCodeAt(o--)?o<0&&(n=a):(o=-1,n=u));return t===n?n=u:n<0&&(n=e.length),e.slice(t,n)}function M0(e){var r,t,n;if(yr(e),!e.length)return".";for(r=-1,n=e.length;--n;)if(e.charCodeAt(n)===47){if(t){r=n;break}}else t||(t=!0);return r<0?e.charCodeAt(0)===47?"/":".":r===1&&e.charCodeAt(0)===47?"//":e.slice(0,r)}function Y0(e){var r=-1,t=0,n=-1,a=0,u,i,o;for(yr(e),o=e.length;o--;){if(i=e.charCodeAt(o),i===47){if(u){t=o+1;break}continue}n<0&&(u=!0,n=o+1),i===46?r<0?r=o:a!==1&&(a=1):r>-1&&(a=-1)}return r<0||n<0||a===0||a===1&&r===n-1&&r===t+1?"":e.slice(r,n)}function G0(){for(var e=-1,r;++e<arguments.length;)yr(arguments[e]),arguments[e]&&(r=r===void 0?arguments[e]:r+"/"+arguments[e]);return r===void 0?".":V0(r)}function V0(e){var r,t;return yr(e),r=e.charCodeAt(0)===47,t=j0(e,!r),!t.length&&!r&&(t="."),t.length&&e.charCodeAt(e.length-1)===47&&(t+="/"),r?"/"+t:t}function j0(e,r){for(var t="",n=0,a=-1,u=0,i=-1,o,s;++i<=e.length;){if(i<e.length)o=e.charCodeAt(i);else{if(o===47)break;o=47}if(o===47){if(!(a===i-1||u===1))if(a!==i-1&&u===2){if(t.length<2||n!==2||t.charCodeAt(t.length-1)!==46||t.charCodeAt(t.length-2)!==46){if(t.length>2){if(s=t.lastIndexOf("/"),s!==t.length-1){s<0?(t="",n=0):(t=t.slice(0,s),n=t.length-1-t.lastIndexOf("/")),a=i,u=0;continue}}else if(t.length){t="",n=0,a=i,u=0;continue}}r&&(t=t.length?t+"/..":"..",n=2)}else t.length?t+="/"+e.slice(a+1,i):t=e.slice(a+1,i),n=i-a-1;a=i,u=0}else o===46&&u>-1?u++:u=-1}return t}function yr(e){if(typeof e!="string")throw new TypeError("Path must be a string. Received "+JSON.stringify(e))}});var Ec=C(vc=>{"use strict";vc.cwd=$0;function $0(){return"/"}});var yc=C((ME,bc)=>{"use strict";var ae=gc(),H0=Ec(),W0=yn();bc.exports=he;var K0={}.hasOwnProperty,wn=["history","path","basename","stem","extname","dirname"];he.prototype.toString=am;Object.defineProperty(he.prototype,"path",{get:J0,set:X0});Object.defineProperty(he.prototype,"dirname",{get:Q0,set:Z0});Object.defineProperty(he.prototype,"basename",{get:em,set:rm});Object.defineProperty(he.prototype,"extname",{get:tm,set:nm});Object.defineProperty(he.prototype,"stem",{get:im,set:um});function he(e){var r,t;if(!e)e={};else if(typeof e=="string"||W0(e))e={contents:e};else if("message"in e&&"messages"in e)return e;if(!(this instanceof he))return new he(e);for(this.data={},this.messages=[],this.history=[],this.cwd=H0.cwd(),t=-1;++t<wn.length;)r=wn[t],K0.call(e,r)&&(this[r]=e[r]);for(r in e)wn.indexOf(r)<0&&(this[r]=e[r])}function J0(){return this.history[this.history.length-1]}function X0(e){Bn(e,"path"),this.path!==e&&this.history.push(e)}function Q0(){return typeof this.path=="string"?ae.dirname(this.path):void 0}function Z0(e){Cc(this.path,"dirname"),this.path=ae.join(e||"",this.basename)}function em(){return typeof this.path=="string"?ae.basename(this.path):void 0}function rm(e){Bn(e,"basename"),kn(e,"basename"),this.path=ae.join(this.dirname||"",e)}function tm(){return typeof this.path=="string"?ae.extname(this.path):void 0}function nm(e){if(kn(e,"extname"),Cc(this.path,"extname"),e){if(e.charCodeAt(0)!==46)throw new Error("`extname` must start with `.`");if(e.indexOf(".",1)>-1)throw new Error("`extname` cannot contain multiple dots")}this.path=ae.join(this.dirname,this.stem+(e||""))}function im(){return typeof this.path=="string"?ae.basename(this.path,this.extname):void 0}function um(e){Bn(e,"stem"),kn(e,"stem"),this.path=ae.join(this.dirname||"",e+(this.extname||""))}function am(e){return(this.contents||"").toString(e)}function kn(e,r){if(e&&e.indexOf(ae.sep)>-1)throw new Error("`"+r+"` cannot be a path: did not expect `"+ae.sep+"`")}function Bn(e,r){if(!e)throw new Error("`"+r+"` cannot be empty")}function Cc(e,r){if(!e)throw new Error("Setting `"+r+"` requires `path` to be set too")}});var xc=C((YE,Ac)=>{"use strict";var om=Fc(),st=yc();Ac.exports=st;st.prototype.message=sm;st.prototype.info=lm;st.prototype.fail=cm;function sm(e,r,t){var n=new om(e,r,t);return this.path&&(n.name=this.path+":"+n.name,n.file=this.path),n.fatal=!1,this.messages.push(n),n}function cm(){var e=this.message.apply(this,arguments);throw e.fatal=!0,e}function lm(){var e=this.message.apply(this,arguments);return e.fatal=null,e}});var kc=C((GE,wc)=>{"use strict";wc.exports=xc()});var Ic=C((VE,Lc)=>{"use strict";var Bc=js(),fm=yn(),ct=rc(),qc=nc(),Oc=lc(),Ar=kc();Lc.exports=Pc().freeze();var Dm=[].slice,pm={}.hasOwnProperty,dm=Oc().use(hm).use(mm).use(Fm);function hm(e,r){r.tree=e.parse(r.file)}function mm(e,r,t){e.run(r.tree,r.file,n);function n(a,u,i){a?t(a):(r.tree=u,r.file=i,t())}}function Fm(e,r){var t=e.stringify(r.tree,r.file);t==null||(typeof t=="string"||fm(t)?("value"in r.file&&(r.file.value=t),r.file.contents=t):r.file.result=t)}function Pc(){var e=[],r=Oc(),t={},n=-1,a;return u.data=o,u.freeze=i,u.attachers=e,u.use=s,u.parse=c,u.stringify=h,u.run=f,u.runSync=D,u.process=p,u.processSync=d,u;function u(){for(var m=Pc(),F=-1;++F<e.length;)m.use.apply(null,e[F]);return m.data(ct(!0,{},t)),m}function i(){var m,F;if(a)return u;for(;++n<e.length;)m=e[n],m[1]!==!1&&(m[1]===!0&&(m[1]=void 0),F=m[0].apply(u,m.slice(1)),typeof F=="function"&&r.use(F));return a=!0,n=1/0,u}function o(m,F){return typeof m=="string"?arguments.length===2?(_n("data",a),t[m]=F,u):pm.call(t,m)&&t[m]||null:m?(_n("data",a),t=m,u):t}function s(m){var F;if(_n("use",a),m!=null)if(typeof m=="function")b.apply(null,arguments);else if(typeof m=="object")"length"in m?B(m):y(m);else throw new Error("Expected usable value, not `"+m+"`");return F&&(t.settings=ct(t.settings||{},F)),u;function y(g){B(g.plugins),g.settings&&(F=ct(F||{},g.settings))}function E(g){if(typeof g=="function")b(g);else if(typeof g=="object")"length"in g?b.apply(null,g):y(g);else throw new Error("Expected usable value, not `"+g+"`")}function B(g){var A=-1;if(g!=null)if(typeof g=="object"&&"length"in g)for(;++A<g.length;)E(g[A]);else throw new Error("Expected a list of plugins, not `"+g+"`")}function b(g,A){var x=l(g);x?(qc(x[1])&&qc(A)&&(A=ct(!0,x[1],A)),x[1]=A):e.push(Dm.call(arguments))}}function l(m){for(var F=-1;++F<e.length;)if(e[F][0]===m)return e[F]}function c(m){var F=Ar(m),y;return i(),y=u.Parser,qn("parse",y),Tc(y,"parse")?new y(String(F),F).parse():y(String(F),F)}function f(m,F,y){if(_c(m),i(),!y&&typeof F=="function"&&(y=F,F=null),!y)return new Promise(E);E(null,y);function E(B,b){r.run(m,Ar(F),g);function g(A,x,v){x=x||m,A?b(A):B?B(x):y(null,x,v)}}}function D(m,F){var y,E;return f(m,F,B),Sc("runSync","run",E),y;function B(b,g){E=!0,y=g,Bc(b)}}function h(m,F){var y=Ar(F),E;return i(),E=u.Compiler,Tn("stringify",E),_c(m),Tc(E,"compile")?new E(m,y).compile():E(m,y)}function p(m,F){if(i(),qn("process",u.Parser),Tn("process",u.Compiler),!F)return new Promise(y);y(null,F);function y(E,B){var b=Ar(m);dm.run(u,{file:b},g);function g(A){A?B(A):E?E(b):F(null,b)}}}function d(m){var F,y;return i(),qn("processSync",u.Parser),Tn("processSync",u.Compiler),F=Ar(m),p(F,E),Sc("processSync","process",y),F;function E(B){y=!0,Bc(B)}}}function Tc(e,r){return typeof e=="function"&&e.prototype&&(gm(e.prototype)||r in e.prototype)}function gm(e){var r;for(r in e)return!0;return!1}function qn(e,r){if(typeof r!="function")throw new Error("Cannot `"+e+"` without `Parser`")}function Tn(e,r){if(typeof r!="function")throw new Error("Cannot `"+e+"` without `Compiler`")}function _n(e,r){if(r)throw new Error("Cannot invoke `"+e+"` on a frozen processor.\nCreate a new processor first, by invoking it: use `processor()` instead of `processor`.")}function _c(e){if(!e||typeof e.type!="string")throw new Error("Expected node, got `"+e+"`")}function Sc(e,r,t){if(!t)throw new Error("`"+e+"` finished async. Use `"+r+"` instead")}});var Pn={};Ln(Pn,{languages:()=>_i,options:()=>Si,parsers:()=>On,printers:()=>qm});var al=(e,r,t,n)=>{if(!(e&&r==null))return r.replaceAll?r.replaceAll(t,n):t.global?r.replace(t,n):r.split(t).join(n)},N=al;var ol=(e,r,t)=>{if(!(e&&r==null))return Array.isArray(r)||typeof r=="string"?r[t<0?r.length+t:t]:r.at(t)},M=ol;var qi=Ue(xr(),1);function Be(e){if(typeof e!="string")throw new TypeError("Expected a string");return e.replace(/[|\\{}()[\]^$+*?.]/g,"\\$&").replace(/-/g,"\\x2d")}var $="string",H="array",ge="cursor",ee="indent",re="align",oe="trim",K="group",J="fill",X="if-break",se="indent-if-break",ce="line-suffix",le="line-suffix-boundary",W="line",fe="label",te="break-parent",wr=new Set([ge,ee,re,oe,K,J,X,se,ce,le,W,fe,te]);function cl(e){if(typeof e=="string")return $;if(Array.isArray(e))return H;if(!e)return;let{type:r}=e;if(wr.has(r))return r}var Y=cl;var ll=e=>new Intl.ListFormat("en-US",{type:"disjunction"}).format(e);function fl(e){let r=e===null?"null":typeof e;if(r!=="string"&&r!=="object")return`Unexpected doc '${r}', 
Expected it to be 'string' or 'object'.`;if(Y(e))throw new Error("doc is valid.");let t=Object.prototype.toString.call(e);if(t!=="[object Object]")return`Unexpected doc '${t}'.`;let n=ll([...wr].map(a=>`'${a}'`));return`Unexpected doc.type '${e.type}'.
Expected it to be ${n}.`}var Dt=class extends Error{name="InvalidDocError";constructor(r){super(fl(r)),this.doc=r}},qe=Dt;var Nn={};function Dl(e,r,t,n){let a=[e];for(;a.length>0;){let u=a.pop();if(u===Nn){t(a.pop());continue}t&&a.push(u,Nn);let i=Y(u);if(!i)throw new qe(u);if((r==null?void 0:r(u))!==!1)switch(i){case H:case J:{let o=i===H?u:u.parts;for(let s=o.length,l=s-1;l>=0;--l)a.push(o[l]);break}case X:a.push(u.flatContents,u.breakContents);break;case K:if(n&&u.expandedStates)for(let o=u.expandedStates.length,s=o-1;s>=0;--s)a.push(u.expandedStates[s]);else a.push(u.contents);break;case re:case ee:case se:case fe:case ce:a.push(u.contents);break;case $:case ge:case oe:case le:case W:case te:break;default:throw new qe(u)}}}var Rn=Dl;var Un=()=>{},Te=Un,kr=Un;function Ze(e){return Te(e),{type:ee,contents:e}}function ve(e,r){return Te(r),{type:re,contents:r,n:e}}function ze(e,r={}){return Te(e),kr(r.expandedStates,!0),{type:K,id:r.id,contents:e,break:!!r.shouldBreak,expandedStates:r.expandedStates}}function _e(e){return ve({type:"root"},e)}function Ee(e){return kr(e),{type:J,parts:e}}function zn(e,r="",t={}){return Te(e),r!==""&&Te(r),{type:X,breakContents:e,flatContents:r,groupId:t.groupId}}var er={type:te};var rr={type:W,hard:!0},pl={type:W,hard:!0,literal:!0},Br={type:W},qr={type:W,soft:!0},L=[rr,er],tr=[pl,er];function Tr(e,r){Te(e),kr(r);let t=[];for(let n=0;n<r.length;n++)n!==0&&t.push(e),t.push(r[n]);return t}function dl(e,r){if(typeof e=="string")return r(e);let t=new Map;return n(e);function n(u){if(t.has(u))return t.get(u);let i=a(u);return t.set(u,i),i}function a(u){switch(Y(u)){case H:return r(u.map(n));case J:return r({...u,parts:u.parts.map(n)});case X:return r({...u,breakContents:n(u.breakContents),flatContents:n(u.flatContents)});case K:{let{expandedStates:i,contents:o}=u;return i?(i=i.map(n),o=i[0]):o=n(o),r({...u,contents:o,expandedStates:i})}case re:case ee:case se:case fe:case ce:return r({...u,contents:n(u.contents)});case $:case ge:case oe:case le:case W:case te:return r(u);default:throw new qe(u)}}}function Mn(e){if(e.length>0){let r=M(!1,e,-1);!r.expandedStates&&!r.break&&(r.break="propagated")}return null}function Yn(e){let r=new Set,t=[];function n(u){if(u.type===te&&Mn(t),u.type===K){if(t.push(u),r.has(u))return!1;r.add(u)}}function a(u){u.type===K&&t.pop().break&&Mn(t)}Rn(e,n,a,!0)}function Ce(e,r=tr){return dl(e,t=>typeof t=="string"?Tr(r,t.split(`
`)):t)}function hl(e,r){let t=e.match(new RegExp(`(${Be(r)})+`,"gu"));return t===null?0:t.reduce((n,a)=>Math.max(n,a.length/r.length),0)}var _r=hl;function ml(e,r){let t=e.match(new RegExp(`(${Be(r)})+`,"gu"));if(t===null)return 0;let n=new Map,a=0;for(let u of t){let i=u.length/r.length;n.set(i,!0),i>a&&(a=i)}for(let u=1;u<a;u++)if(!n.get(u))return u;return a+1}var Gn=ml;var Sr="'",Vn='"';function Fl(e,r){let t=r===!0||r===Sr?Sr:Vn,n=t===Sr?Vn:Sr,a=0,u=0;for(let i of e)i===t?a++:i===n&&u++;return a>u?n:t}var jn=Fl;var pt=class extends Error{name="UnexpectedNodeError";constructor(r,t,n="type"){super(`Unexpected ${t} node ${n}: ${JSON.stringify(r[n])}.`),this.node=r}},$n=pt;var Xn=Ue(xr(),1);function gl(e){return(e==null?void 0:e.type)==="front-matter"}var Hn=gl;var nr=3;function vl(e){let r=e.slice(0,nr);if(r!=="---"&&r!=="+++")return;let t=e.indexOf(`
`,nr);if(t===-1)return;let n=e.slice(nr,t).trim(),a=e.indexOf(`
${r}`,t),u=n;if(u||(u=r==="+++"?"toml":"yaml"),a===-1&&r==="---"&&u==="yaml"&&(a=e.indexOf(`
...`,t)),a===-1)return;let i=a+1+nr,o=e.charAt(i+1);if(!/\s?/u.test(o))return;let s=e.slice(0,i);return{type:"front-matter",language:u,explicitLanguage:n,value:e.slice(t+1,a),startDelimiter:r,endDelimiter:s.slice(-nr),raw:s}}function El(e){let r=vl(e);if(!r)return{content:e};let{raw:t}=r;return{frontMatter:r,content:N(!1,t,/[^\n]/gu," ")+e.slice(t.length)}}var ir=El;var Wn=["format","prettier"];function dt(e){let r=`@(${Wn.join("|")})`,t=new RegExp([`<!--\\s*${r}\\s*-->`,`\\{\\s*\\/\\*\\s*${r}\\s*\\*\\/\\s*\\}`,`<!--.*\r?
[\\s\\S]*(^|
)[^\\S
]*${r}[^\\S
]*($|
)[\\s\\S]*
.*-->`].join("|"),"mu"),n=e.match(t);return(n==null?void 0:n.index)===0}var Kn=e=>dt(ir(e).content.trimStart()),Jn=e=>{let r=ir(e),t=`<!-- @${Wn[0]} -->`;return r.frontMatter?`${r.frontMatter.raw}

${t}

${r.content}`:`${t}

${r.content}`};var Cl=new Set(["position","raw"]);function Qn(e,r,t){if((e.type==="front-matter"||e.type==="code"||e.type==="yaml"||e.type==="import"||e.type==="export"||e.type==="jsx")&&delete r.value,e.type==="list"&&delete r.isAligned,(e.type==="list"||e.type==="listItem")&&delete r.spread,e.type==="text")return null;if(e.type==="inlineCode"&&(r.value=N(!1,e.value,`
`," ")),e.type==="wikiLink"&&(r.value=N(!1,e.value.trim(),/[\t\n]+/gu," ")),(e.type==="definition"||e.type==="linkReference"||e.type==="imageReference")&&(r.label=(0,Xn.default)(e.label)),(e.type==="link"||e.type==="image")&&e.url&&e.url.includes("("))for(let n of"<>")r.url=N(!1,e.url,n,encodeURIComponent(n));if((e.type==="definition"||e.type==="link"||e.type==="image")&&e.title&&(r.title=N(!1,e.title,/\\(?=["')])/gu,"")),(t==null?void 0:t.type)==="root"&&t.children.length>0&&(t.children[0]===e||Hn(t.children[0])&&t.children[1]===e)&&e.type==="html"&&dt(e.value))return null}Qn.ignoredProperties=Cl;var Zn=Qn;var ei=/(?:[\u02ea-\u02eb\u1100-\u11ff\u2e80-\u2e99\u2e9b-\u2ef3\u2f00-\u2fd5\u2ff0-\u303f\u3041-\u3096\u3099-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312f\u3131-\u318e\u3190-\u4dbf\u4e00-\u9fff\ua700-\ua707\ua960-\ua97c\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufe10-\ufe1f\ufe30-\ufe6f\uff00-\uffef]|[\ud840-\ud868\ud86a-\ud86c\ud86f-\ud872\ud874-\ud879\ud880-\ud883\ud885-\ud887][\udc00-\udfff]|\ud81b[\udfe3]|\ud82b[\udff0-\udff3\udff5-\udffb\udffd-\udffe]|\ud82c[\udc00-\udd22\udd32\udd50-\udd52\udd55\udd64-\udd67]|\ud83c[\ude00\ude50-\ude51]|\ud869[\udc00-\udedf\udf00-\udfff]|\ud86d[\udc00-\udf39\udf40-\udfff]|\ud86e[\udc00-\udc1d\udc20-\udfff]|\ud873[\udc00-\udea1\udeb0-\udfff]|\ud87a[\udc00-\udfe0]|\ud87e[\udc00-\ude1d]|\ud884[\udc00-\udf4a\udf50-\udfff]|\ud888[\udc00-\udfaf])(?:[\ufe00-\ufe0f]|\udb40[\udd00-\uddef])?/u,Se=/(?:[\u0021-\u002f\u003a-\u0040\u005b-\u0060\u007b-\u007e]|\p{General_Category=Connector_Punctuation}|\p{General_Category=Dash_Punctuation}|\p{General_Category=Close_Punctuation}|\p{General_Category=Final_Punctuation}|\p{General_Category=Initial_Punctuation}|\p{General_Category=Other_Punctuation}|\p{General_Category=Open_Punctuation})/u;async function bl(e,r){if(e.language==="yaml"){let t=e.value.trim(),n=t?await r(t,{parser:"yaml"}):"";return _e([e.startDelimiter,e.explicitLanguage,L,n,n?L:"",e.endDelimiter])}}var ri=bl;var yl=e=>String(e).split(/[/\\]/u).pop();function ti(e,r){if(!r)return;let t=yl(r).toLowerCase();return e.find(({filenames:n})=>n==null?void 0:n.some(a=>a.toLowerCase()===t))??e.find(({extensions:n})=>n==null?void 0:n.some(a=>t.endsWith(a)))}function Al(e,r){if(r)return e.find(({name:t})=>t.toLowerCase()===r)??e.find(({aliases:t})=>t==null?void 0:t.includes(r))??e.find(({extensions:t})=>t==null?void 0:t.includes(`.${r}`))}function xl(e,r){let t=e.plugins.flatMap(a=>a.languages??[]),n=Al(t,r.language)??ti(t,r.physicalFile)??ti(t,r.file)??(r.physicalFile,void 0);return n==null?void 0:n.parsers[0]}var ni=xl;var wl=new Proxy(()=>{},{get:()=>wl});function Oe(e){return e.position.start.offset}function Pe(e){return e.position.end.offset}var ht=new Set(["liquidNode","inlineCode","emphasis","esComment","strong","delete","wikiLink","link","linkReference","image","imageReference","footnote","footnoteReference","sentence","whitespace","word","break","inlineMath"]),Or=new Set([...ht,"tableCell","paragraph","heading"]),Le="non-cjk",De="cj-letter",be="k-letter",ur="cjk-punctuation",kl=/\p{Script_Extensions=Hangul}/u;function Pr(e){let r=[],t=e.split(/([\t\n ]+)/u);for(let[a,u]of t.entries()){if(a%2===1){r.push({type:"whitespace",value:/\n/u.test(u)?`
`:" "});continue}if((a===0||a===t.length-1)&&u==="")continue;let i=u.split(new RegExp(`(${ei.source})`,"u"));for(let[o,s]of i.entries())if(!((o===0||o===i.length-1)&&s==="")){if(o%2===0){s!==""&&n({type:"word",value:s,kind:Le,hasLeadingPunctuation:Se.test(s[0]),hasTrailingPunctuation:Se.test(M(!1,s,-1))});continue}n(Se.test(s)?{type:"word",value:s,kind:ur,hasLeadingPunctuation:!0,hasTrailingPunctuation:!0}:{type:"word",value:s,kind:kl.test(s)?be:De,hasLeadingPunctuation:!1,hasTrailingPunctuation:!1})}}return r;function n(a){let u=M(!1,r,-1);(u==null?void 0:u.type)==="word"&&!i(Le,ur)&&![u.value,a.value].some(o=>/\u3000/u.test(o))&&r.push({type:"whitespace",value:""}),r.push(a);function i(o,s){return u.kind===o&&a.kind===s||u.kind===s&&a.kind===o}}}function Me(e,r){let t=r.originalText.slice(e.position.start.offset,e.position.end.offset),{numberText:n,leadingSpaces:a}=t.match(/^\s*(?<numberText>\d+)(\.|\))(?<leadingSpaces>\s*)/u).groups;return{number:Number(n),leadingSpaces:a}}function ii(e,r){return!e.ordered||e.children.length<2||Me(e.children[1],r).number!==1?!1:Me(e.children[0],r).number!==0?!0:e.children.length>2&&Me(e.children[2],r).number===1}function Lr(e,r){let{value:t}=e;return e.position.end.offset===r.length&&t.endsWith(`
`)&&r.endsWith(`
`)?t.slice(0,-1):t}function ye(e,r){return function t(n,a,u){let i={...r(n,a,u)};return i.children&&(i.children=i.children.map((o,s)=>t(o,s,[i,...u]))),i}(e,null,[])}function mt(e){if((e==null?void 0:e.type)!=="link"||e.children.length!==1)return!1;let[r]=e.children;return Oe(e)===Oe(r)&&Pe(e)===Pe(r)}function Bl(e,r){let{node:t}=e;if(t.type==="code"&&t.lang!==null){let n=ni(r,{language:t.lang});if(n)return async a=>{let u=r.__inJsTemplate?"~":"`",i=u.repeat(Math.max(3,_r(t.value,u)+1)),o={parser:n};t.lang==="ts"||t.lang==="typescript"?o.filepath="dummy.ts":t.lang==="tsx"&&(o.filepath="dummy.tsx");let s=await a(Lr(t,r.originalText),o);return _e([i,t.lang,t.meta?" "+t.meta:"",L,Ce(s),L,i])}}switch(t.type){case"front-matter":return n=>ri(t,n);case"import":case"export":return n=>n(t.value,{parser:"babel"});case"jsx":return n=>n(`<$>${t.value}</$>`,{parser:"__js_expression",rootMarker:"mdx"})}return null}var ui=Bl;var ar=null;function or(e){if(ar!==null&&typeof ar.property){let r=ar;return ar=or.prototype=null,r}return ar=or.prototype=e??Object.create(null),new or}var ql=10;for(let e=0;e<=ql;e++)or();function Ft(e){return or(e)}function Tl(e,r="type"){Ft(e);function t(n){let a=n[r],u=e[a];if(!Array.isArray(u))throw Object.assign(new Error(`Missing visitor keys for '${a}'.`),{node:n});return u}return t}var ai=Tl;var _l={"front-matter":[],root:["children"],paragraph:["children"],sentence:["children"],word:[],whitespace:[],emphasis:["children"],strong:["children"],delete:["children"],inlineCode:[],wikiLink:[],link:["children"],image:[],blockquote:["children"],heading:["children"],code:[],html:[],list:["children"],thematicBreak:[],linkReference:["children"],imageReference:[],definition:[],footnote:["children"],footnoteReference:[],footnoteDefinition:["children"],table:["children"],tableCell:["children"],break:[],liquidNode:[],import:[],export:[],esComment:[],jsx:[],math:[],inlineMath:[],tableRow:["children"],listItem:["children"],text:[]},oi=_l;var Sl=ai(oi),si=Sl;function ci(e){switch(e){case"cr":return"\r";case"crlf":return`\r
`;default:return`
`}}var li=()=>/[#*0-9]\uFE0F?\u20E3|[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23ED-\u23EF\u23F1\u23F2\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB\u25FC\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692\u2694-\u2697\u2699\u269B\u269C\u26A0\u26A7\u26AA\u26B0\u26B1\u26BD\u26BE\u26C4\u26C8\u26CF\u26D1\u26E9\u26F0-\u26F5\u26F7\u26F8\u26FA\u2702\u2708\u2709\u270F\u2712\u2714\u2716\u271D\u2721\u2733\u2734\u2744\u2747\u2757\u2763\u27A1\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B55\u3030\u303D\u3297\u3299]\uFE0F?|[\u261D\u270C\u270D](?:\uFE0F|\uD83C[\uDFFB-\uDFFF])?|[\u270A\u270B](?:\uD83C[\uDFFB-\uDFFF])?|[\u23E9-\u23EC\u23F0\u23F3\u25FD\u2693\u26A1\u26AB\u26C5\u26CE\u26D4\u26EA\u26FD\u2705\u2728\u274C\u274E\u2753-\u2755\u2795-\u2797\u27B0\u27BF\u2B50]|\u26D3\uFE0F?(?:\u200D\uD83D\uDCA5)?|\u26F9(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|\u2764\uFE0F?(?:\u200D(?:\uD83D\uDD25|\uD83E\uDE79))?|\uD83C(?:[\uDC04\uDD70\uDD71\uDD7E\uDD7F\uDE02\uDE37\uDF21\uDF24-\uDF2C\uDF36\uDF7D\uDF96\uDF97\uDF99-\uDF9B\uDF9E\uDF9F\uDFCD\uDFCE\uDFD4-\uDFDF\uDFF5\uDFF7]\uFE0F?|[\uDF85\uDFC2\uDFC7](?:\uD83C[\uDFFB-\uDFFF])?|[\uDFC4\uDFCA](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDFCB\uDFCC](?:\uFE0F|\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDCCF\uDD8E\uDD91-\uDD9A\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF43\uDF45-\uDF4A\uDF4C-\uDF7C\uDF7E-\uDF84\uDF86-\uDF93\uDFA0-\uDFC1\uDFC5\uDFC6\uDFC8\uDFC9\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF8-\uDFFF]|\uDDE6\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF]|\uDDE7\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF]|\uDDE8\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF]|\uDDE9\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF]|\uDDEA\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA]|\uDDEB\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7]|\uDDEC\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE]|\uDDED\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA]|\uDDEE\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9]|\uDDEF\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5]|\uDDF0\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF]|\uDDF1\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE]|\uDDF2\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF]|\uDDF3\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF]|\uDDF4\uD83C\uDDF2|\uDDF5\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE]|\uDDF6\uD83C\uDDE6|\uDDF7\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC]|\uDDF8\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF]|\uDDF9\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF]|\uDDFA\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF]|\uDDFB\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA]|\uDDFC\uD83C[\uDDEB\uDDF8]|\uDDFD\uD83C\uDDF0|\uDDFE\uD83C[\uDDEA\uDDF9]|\uDDFF\uD83C[\uDDE6\uDDF2\uDDFC]|\uDF44(?:\u200D\uD83D\uDFEB)?|\uDF4B(?:\u200D\uD83D\uDFE9)?|\uDFC3(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?|\uDFF3\uFE0F?(?:\u200D(?:\u26A7\uFE0F?|\uD83C\uDF08))?|\uDFF4(?:\u200D\u2620\uFE0F?|\uDB40\uDC67\uDB40\uDC62\uDB40(?:\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDC73\uDB40\uDC63\uDB40\uDC74|\uDC77\uDB40\uDC6C\uDB40\uDC73)\uDB40\uDC7F)?)|\uD83D(?:[\uDC3F\uDCFD\uDD49\uDD4A\uDD6F\uDD70\uDD73\uDD76-\uDD79\uDD87\uDD8A-\uDD8D\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA\uDECB\uDECD-\uDECF\uDEE0-\uDEE5\uDEE9\uDEF0\uDEF3]\uFE0F?|[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDC8F\uDC91\uDCAA\uDD7A\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC](?:\uD83C[\uDFFB-\uDFFF])?|[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4\uDEB5](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDD74\uDD90](?:\uFE0F|\uD83C[\uDFFB-\uDFFF])?|[\uDC00-\uDC07\uDC09-\uDC14\uDC16-\uDC25\uDC27-\uDC3A\uDC3C-\uDC3E\uDC40\uDC44\uDC45\uDC51-\uDC65\uDC6A\uDC79-\uDC7B\uDC7D-\uDC80\uDC84\uDC88-\uDC8E\uDC90\uDC92-\uDCA9\uDCAB-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDDA4\uDDFB-\uDE2D\uDE2F-\uDE34\uDE37-\uDE41\uDE43\uDE44\uDE48-\uDE4A\uDE80-\uDEA2\uDEA4-\uDEB3\uDEB7-\uDEBF\uDEC1-\uDEC5\uDED0-\uDED2\uDED5-\uDED7\uDEDC-\uDEDF\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB\uDFF0]|\uDC08(?:\u200D\u2B1B)?|\uDC15(?:\u200D\uD83E\uDDBA)?|\uDC26(?:\u200D(?:\u2B1B|\uD83D\uDD25))?|\uDC3B(?:\u200D\u2744\uFE0F?)?|\uDC41\uFE0F?(?:\u200D\uD83D\uDDE8\uFE0F?)?|\uDC68(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDC68\uDC69]\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFC-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFD-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFD\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFE])))?))?|\uDC69(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?[\uDC68\uDC69]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?|\uDC69\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?))|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFC-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB\uDFFD-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB-\uDFFD\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB-\uDFFE])))?))?|\uDC6F(?:\u200D[\u2640\u2642]\uFE0F?)?|\uDD75(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|\uDE2E(?:\u200D\uD83D\uDCA8)?|\uDE35(?:\u200D\uD83D\uDCAB)?|\uDE36(?:\u200D\uD83C\uDF2B\uFE0F?)?|\uDE42(?:\u200D[\u2194\u2195]\uFE0F?)?|\uDEB6(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?)|\uD83E(?:[\uDD0C\uDD0F\uDD18-\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2\uDDD3\uDDD5\uDEC3-\uDEC5\uDEF0\uDEF2-\uDEF8](?:\uD83C[\uDFFB-\uDFFF])?|[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD\uDDCF\uDDD4\uDDD6-\uDDDD](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDDDE\uDDDF](?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDD0D\uDD0E\uDD10-\uDD17\uDD20-\uDD25\uDD27-\uDD2F\uDD3A\uDD3F-\uDD45\uDD47-\uDD76\uDD78-\uDDB4\uDDB7\uDDBA\uDDBC-\uDDCC\uDDD0\uDDE0-\uDDFF\uDE70-\uDE7C\uDE80-\uDE88\uDE90-\uDEBD\uDEBF-\uDEC2\uDECE-\uDEDB\uDEE0-\uDEE8]|\uDD3C(?:\u200D[\u2640\u2642]\uFE0F?|\uD83C[\uDFFB-\uDFFF])?|\uDDCE(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?|\uDDD1(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1|\uDDD1\u200D\uD83E\uDDD2(?:\u200D\uD83E\uDDD2)?|\uDDD2(?:\u200D\uD83E\uDDD2)?))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFC-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB\uDFFD-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB-\uDFFD\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB-\uDFFE]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?))?|\uDEF1(?:\uD83C(?:\uDFFB(?:\u200D\uD83E\uDEF2\uD83C[\uDFFC-\uDFFF])?|\uDFFC(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB\uDFFD-\uDFFF])?|\uDFFD(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])?|\uDFFE(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB-\uDFFD\uDFFF])?|\uDFFF(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB-\uDFFE])?))?)/g;function fi(e){return e===12288||e>=65281&&e<=65376||e>=65504&&e<=65510}function Di(e){return e>=4352&&e<=4447||e===8986||e===8987||e===9001||e===9002||e>=9193&&e<=9196||e===9200||e===9203||e===9725||e===9726||e===9748||e===9749||e>=9800&&e<=9811||e===9855||e===9875||e===9889||e===9898||e===9899||e===9917||e===9918||e===9924||e===9925||e===9934||e===9940||e===9962||e===9970||e===9971||e===9973||e===9978||e===9981||e===9989||e===9994||e===9995||e===10024||e===10060||e===10062||e>=10067&&e<=10069||e===10071||e>=10133&&e<=10135||e===10160||e===10175||e===11035||e===11036||e===11088||e===11093||e>=11904&&e<=11929||e>=11931&&e<=12019||e>=12032&&e<=12245||e>=12272&&e<=12287||e>=12289&&e<=12350||e>=12353&&e<=12438||e>=12441&&e<=12543||e>=12549&&e<=12591||e>=12593&&e<=12686||e>=12688&&e<=12771||e>=12783&&e<=12830||e>=12832&&e<=12871||e>=12880&&e<=19903||e>=19968&&e<=42124||e>=42128&&e<=42182||e>=43360&&e<=43388||e>=44032&&e<=55203||e>=63744&&e<=64255||e>=65040&&e<=65049||e>=65072&&e<=65106||e>=65108&&e<=65126||e>=65128&&e<=65131||e>=94176&&e<=94180||e===94192||e===94193||e>=94208&&e<=100343||e>=100352&&e<=101589||e>=101632&&e<=101640||e>=110576&&e<=110579||e>=110581&&e<=110587||e===110589||e===110590||e>=110592&&e<=110882||e===110898||e>=110928&&e<=110930||e===110933||e>=110948&&e<=110951||e>=110960&&e<=111355||e===126980||e===127183||e===127374||e>=127377&&e<=127386||e>=127488&&e<=127490||e>=127504&&e<=127547||e>=127552&&e<=127560||e===127568||e===127569||e>=127584&&e<=127589||e>=127744&&e<=127776||e>=127789&&e<=127797||e>=127799&&e<=127868||e>=127870&&e<=127891||e>=127904&&e<=127946||e>=127951&&e<=127955||e>=127968&&e<=127984||e===127988||e>=127992&&e<=128062||e===128064||e>=128066&&e<=128252||e>=128255&&e<=128317||e>=128331&&e<=128334||e>=128336&&e<=128359||e===128378||e===128405||e===128406||e===128420||e>=128507&&e<=128591||e>=128640&&e<=128709||e===128716||e>=128720&&e<=128722||e>=128725&&e<=128727||e>=128732&&e<=128735||e===128747||e===128748||e>=128756&&e<=128764||e>=128992&&e<=129003||e===129008||e>=129292&&e<=129338||e>=129340&&e<=129349||e>=129351&&e<=129535||e>=129648&&e<=129660||e>=129664&&e<=129672||e>=129680&&e<=129725||e>=129727&&e<=129733||e>=129742&&e<=129755||e>=129760&&e<=129768||e>=129776&&e<=129784||e>=131072&&e<=196605||e>=196608&&e<=262141}var pi=e=>!(fi(e)||Di(e));var Ol=/[^\x20-\x7F]/u;function Pl(e){if(!e)return 0;if(!Ol.test(e))return e.length;e=e.replace(li(),"  ");let r=0;for(let t of e){let n=t.codePointAt(0);n<=31||n>=127&&n<=159||n>=768&&n<=879||(r+=pi(n)?1:2)}return r}var sr=Pl;var G=Symbol("MODE_BREAK"),ne=Symbol("MODE_FLAT"),cr=Symbol("cursor");function di(){return{value:"",length:0,queue:[]}}function Ll(e,r){return markdown_gt(e,{type:"indent"},r)}function Il(e,r,t){return r===Number.NEGATIVE_INFINITY?e.root||di():r<0?markdown_gt(e,{type:"dedent"},t):r?r.type==="root"?{...e,root:e}:markdown_gt(e,{type:typeof r=="string"?"stringAlign":"numberAlign",n:r},t):e}function markdown_gt(e,r,t){let n=r.type==="dedent"?e.queue.slice(0,-1):[...e.queue,r],a="",u=0,i=0,o=0;for(let p of n)switch(p.type){case"indent":c(),t.useTabs?s(1):l(t.tabWidth);break;case"stringAlign":c(),a+=p.n,u+=p.n.length;break;case"numberAlign":i+=1,o+=p.n;break;default:throw new Error(`Unexpected type '${p.type}'`)}return D(),{...e,value:a,length:u,queue:n};function s(p){a+="	".repeat(p),u+=t.tabWidth*p}function l(p){a+=" ".repeat(p),u+=p}function c(){t.useTabs?f():D()}function f(){i>0&&s(i),h()}function D(){o>0&&l(o),h()}function h(){i=0,o=0}}function vt(e){let r=0,t=0,n=e.length;e:for(;n--;){let a=e[n];if(a===cr){t++;continue}for(let u=a.length-1;u>=0;u--){let i=a[u];if(i===" "||i==="	")r++;else{e[n]=a.slice(0,u+1);break e}}}if(r>0||t>0)for(e.length=n+1;t-- >0;)e.push(cr);return r}function Ir(e,r,t,n,a,u){if(t===Number.POSITIVE_INFINITY)return!0;let i=r.length,o=[e],s=[];for(;t>=0;){if(o.length===0){if(i===0)return!0;o.push(r[--i]);continue}let{mode:l,doc:c}=o.pop(),f=Y(c);switch(f){case $:s.push(c),t-=sr(c);break;case H:case J:{let D=f===H?c:c.parts;for(let h=D.length-1;h>=0;h--)o.push({mode:l,doc:D[h]});break}case ee:case re:case se:case fe:o.push({mode:l,doc:c.contents});break;case oe:t+=vt(s);break;case K:{if(u&&c.break)return!1;let D=c.break?G:l,h=c.expandedStates&&D===G?M(!1,c.expandedStates,-1):c.contents;o.push({mode:D,doc:h});break}case X:{let h=(c.groupId?a[c.groupId]||ne:l)===G?c.breakContents:c.flatContents;h&&o.push({mode:l,doc:h});break}case W:if(l===G||c.hard)return!0;c.soft||(s.push(" "),t--);break;case ce:n=!0;break;case le:if(n)return!1;break}}return!1}function hi(e,r){let t={},n=r.printWidth,a=ci(r.endOfLine),u=0,i=[{ind:di(),mode:G,doc:e}],o=[],s=!1,l=[],c=0;for(Yn(e);i.length>0;){let{ind:D,mode:h,doc:p}=i.pop();switch(Y(p)){case $:{let d=a!==`
`?N(!1,p,`
`,a):p;o.push(d),i.length>0&&(u+=sr(d));break}case H:for(let d=p.length-1;d>=0;d--)i.push({ind:D,mode:h,doc:p[d]});break;case ge:if(c>=2)throw new Error("There are too many 'cursor' in doc.");o.push(cr),c++;break;case ee:i.push({ind:Ll(D,r),mode:h,doc:p.contents});break;case re:i.push({ind:Il(D,p.n,r),mode:h,doc:p.contents});break;case oe:u-=vt(o);break;case K:switch(h){case ne:if(!s){i.push({ind:D,mode:p.break?G:ne,doc:p.contents});break}case G:{s=!1;let d={ind:D,mode:ne,doc:p.contents},m=n-u,F=l.length>0;if(!p.break&&Ir(d,i,m,F,t))i.push(d);else if(p.expandedStates){let y=M(!1,p.expandedStates,-1);if(p.break){i.push({ind:D,mode:G,doc:y});break}else for(let E=1;E<p.expandedStates.length+1;E++)if(E>=p.expandedStates.length){i.push({ind:D,mode:G,doc:y});break}else{let B=p.expandedStates[E],b={ind:D,mode:ne,doc:B};if(Ir(b,i,m,F,t)){i.push(b);break}}}else i.push({ind:D,mode:G,doc:p.contents});break}}p.id&&(t[p.id]=M(!1,i,-1).mode);break;case J:{let d=n-u,{parts:m}=p;if(m.length===0)break;let[F,y]=m,E={ind:D,mode:ne,doc:F},B={ind:D,mode:G,doc:F},b=Ir(E,[],d,l.length>0,t,!0);if(m.length===1){b?i.push(E):i.push(B);break}let g={ind:D,mode:ne,doc:y},A={ind:D,mode:G,doc:y};if(m.length===2){b?i.push(g,E):i.push(A,B);break}m.splice(0,2);let x={ind:D,mode:h,doc:Ee(m)},v=m[0];Ir({ind:D,mode:ne,doc:[F,y,v]},[],d,l.length>0,t,!0)?i.push(x,g,E):b?i.push(x,A,E):i.push(x,A,B);break}case X:case se:{let d=p.groupId?t[p.groupId]:h;if(d===G){let m=p.type===X?p.breakContents:p.negate?p.contents:Ze(p.contents);m&&i.push({ind:D,mode:h,doc:m})}if(d===ne){let m=p.type===X?p.flatContents:p.negate?Ze(p.contents):p.contents;m&&i.push({ind:D,mode:h,doc:m})}break}case ce:l.push({ind:D,mode:h,doc:p.contents});break;case le:l.length>0&&i.push({ind:D,mode:h,doc:rr});break;case W:switch(h){case ne:if(p.hard)s=!0;else{p.soft||(o.push(" "),u+=1);break}case G:if(l.length>0){i.push({ind:D,mode:h,doc:p},...l.reverse()),l.length=0;break}p.literal?D.root?(o.push(a,D.root.value),u=D.root.length):(o.push(a),u=0):(u-=vt(o),o.push(a+D.value),u=D.length);break}break;case fe:i.push({ind:D,mode:h,doc:p.contents});break;case te:break;default:throw new qe(p)}i.length===0&&l.length>0&&(i.push(...l.reverse()),l.length=0)}let f=o.indexOf(cr);if(f!==-1){let D=o.indexOf(cr,f+1),h=o.slice(0,f).join(""),p=o.slice(f+1,D).join(""),d=o.slice(D+1).join("");return{formatted:h+p+d,cursorNodeStart:h.length,cursorNodeText:p}}return{formatted:o.join("")}}function mi(e,r,t){let{node:n}=e,a=[],u=e.map(()=>e.map(({index:f})=>{let D=hi(t(),r).formatted,h=sr(D);return a[f]=Math.max(a[f]??3,h),{text:D,width:h}},"children"),"children"),i=s(!1);if(r.proseWrap!=="never")return[er,i];let o=s(!0);return[er,ze(zn(o,i))];function s(f){return Tr(rr,[c(u[0],f),l(f),...u.slice(1).map(D=>c(D,f))].map(D=>`| ${D.join(" | ")} |`))}function l(f){return a.map((D,h)=>{let p=n.align[h],d=p==="center"||p==="left"?":":"-",m=p==="center"||p==="right"?":":"-",F=f?"-":"-".repeat(D-2);return`${d}${F}${m}`})}function c(f,D){return f.map(({text:h,width:p},d)=>{if(D)return h;let m=a[d]-p,F=n.align[d],y=0;F==="right"?y=m:F==="center"&&(y=Math.floor(m/2));let E=m-y;return`${" ".repeat(y)}${h}${" ".repeat(E)}`})}}function Fi(e,r,t){let n=e.map(t,"children");return Nl(n)}function Nl(e){let r=[""];return function t(n){for(let a of n){let u=Y(a);if(u===H){t(a);continue}let i=a,o=[];u===J&&([i,...o]=a.parts),r.push([r.pop(),i],...o)}}(e),Ee(r)}var Rl=/^.$/su;function Ul(e,r){return e=zl(e,r),e=Yl(e),e=Vl(e,r),e=jl(e,r),e=Gl(e),e}function zl(e,r){return ye(e,t=>t.type!=="text"||t.value==="*"||t.value==="_"||!Rl.test(t.value)||t.position.end.offset-t.position.start.offset===t.value.length?t:{...t,value:r.originalText.slice(t.position.start.offset,t.position.end.offset)})}function Ml(e,r,t){return ye(e,n=>{if(!n.children)return n;let a=n.children.reduce((u,i)=>{let o=M(!1,u,-1);return o&&r(o,i)?u.splice(-1,1,t(o,i)):u.push(i),u},[]);return{...n,children:a}})}function Yl(e){return Ml(e,(r,t)=>r.type==="text"&&t.type==="text",(r,t)=>({type:"text",value:r.value+t.value,position:{start:r.position.start,end:t.position.end}}))}function Gl(e){return ye(e,(r,t,[n])=>{if(r.type!=="text")return r;let{value:a}=r;return n.type==="paragraph"&&(t===0&&(a=a.trimStart()),t===n.children.length-1&&(a=a.trimEnd())),{type:"sentence",position:r.position,children:Pr(a)}})}function Vl(e,r){return ye(e,(t,n,a)=>{if(t.type==="code"){let u=/^\n?(?: {4,}|\t)/u.test(r.originalText.slice(t.position.start.offset,t.position.end.offset));if(t.isIndented=u,u)for(let i=0;i<a.length;i++){let o=a[i];if(o.hasIndentedCodeblock)break;o.type==="list"&&(o.hasIndentedCodeblock=!0)}}return t})}function jl(e,r){return ye(e,(a,u,i)=>{if(a.type==="list"&&a.children.length>0){for(let o=0;o<i.length;o++){let s=i[o];if(s.type==="list"&&!s.isAligned)return a.isAligned=!1,a}a.isAligned=n(a)}return a});function t(a){return a.children.length===0?-1:a.children[0].position.start.column-1}function n(a){if(!a.ordered)return!0;let[u,i]=a.children;if(Me(u,r).leadingSpaces.length>1)return!0;let s=t(u);if(s===-1)return!1;if(a.children.length===1)return s%r.tabWidth===0;let l=t(i);return s!==l?!1:s%r.tabWidth===0?!0:Me(i,r).leadingSpaces.length>1}}var gi=Ul;function vi(e,r){let t=[""];return e.each(()=>{let{node:n}=e,a=r();switch(n.type){case"whitespace":if(Y(a)!==$){t.push(a,"");break}default:t.push([t.pop(),a])}},"children"),Ee(t)}var $l=new Set(["heading","tableCell","link","wikiLink"]),Hl=new Set(`$(\xA3\xA5\xB7'"\u3008\u300A\u300C\u300E\u3010\u3014\u3016\u301D\uFE59\uFE5B\uFF04\uFF08\uFF3B\uFF5B\uFFE1\uFFE5[{\u2035\uFE34\uFE35\uFE37\uFE39\uFE3B\uFE3D\uFE3F\uFE41\uFE43\uFE4F\u3018\uFF5F\xAB`),Wl=new Set(`!%),.:;?]}\xA2\xB0\xB7'"\u2020\u2021\u203A\u2103\u2236\u3001\u3002\u3003\u3006\u3015\u3017\u301E\uFE5A\uFE5C\uFF01\uFF02\uFF05\uFF07\uFF09\uFF0C\uFF0E\uFF1A\uFF1B\uFF1F\uFF3D\uFF5D\uFF5E\u2013\u2014\u2022\u3009\u300B\u300D\uFE30\uFE31\uFE32\uFE33\uFE50\uFE51\uFE52\uFE53\uFE54\uFE55\uFE56\uFE58\uFE36\uFE38\uFE3A\uFE3C\uFE3E\uFE40\uFE42\uFE57\uFF5C\uFF64\u300F\u3011\u3019\u301F\uFF60\xBB\u30FD\u30FE\u30FC\u30A1\u30A3\u30A5\u30A7\u30A9\u30C3\u30E3\u30E5\u30E7\u30EE\u30F5\u30F6\u3041\u3043\u3045\u3047\u3049\u3063\u3083\u3085\u3087\u308E\u3095\u3096\u31F0\u31F1\u31F2\u31F3\u31F4\u31F5\u31F6\u31F7\u31F8\u31F9\u31FA\u31FB\u31FC\u31FD\u31FE\u31FF\u3005\u303B\u2010\u30A0\u301C\uFF5E\u203C\u2047\u2048\u2049\u30FB\u3099\u309A`),Ei=new Set("!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~");function Kl({parent:e}){if(e.usesCJSpaces===void 0){let r={" ":0,"":0},{children:t}=e;for(let n=1;n<t.length-1;++n){let a=t[n];if(a.type==="whitespace"&&(a.value===" "||a.value==="")){let u=t[n-1].kind,i=t[n+1].kind;(u===De&&i===Le||u===Le&&i===De)&&++r[a.value]}}e.usesCJSpaces=r[" "]>r[""]}return e.usesCJSpaces}function Jl(e,r){if(r)return!0;let{previous:t,next:n}=e;if(!t||!n)return!0;let a=t.kind,u=n.kind;return bi(a)&&bi(u)||a===be&&u===De||u===be&&a===De?!0:a===ur||u===ur||a===De&&u===De?!1:Ei.has(n.value[0])||Ei.has(M(!1,t.value,-1))?!0:t.hasTrailingPunctuation||n.hasLeadingPunctuation?!1:Kl(e)}function Ci(e){return e===Le||e===De||e===be}function bi(e){return e===Le||e===be}function Xl(e,r,t,n,a){if(t!=="always"||e.hasAncestor(s=>$l.has(s.type)))return!1;if(n)return r!=="";if(r===" ")return!0;let{previous:u,next:i}=e;return!(r===""&&((u==null?void 0:u.kind)===be&&Ci(i==null?void 0:i.kind)||(i==null?void 0:i.kind)===be&&Ci(u==null?void 0:u.kind))||!a&&(i&&Wl.has(i.value[0])||u&&Hl.has(M(!1,u.value,-1))))}function Et(e,r,t,n){if(t==="preserve"&&r===`
`)return L;let a=r===" "||r===`
`&&Jl(e,n);return Xl(e,r,t,n,a)?a?Br:qr:a?" ":""}var Ql=new Set(["listItem","definition"]);function Zl(e,r,t){var a,u;let{node:n}=e;if(af(e)){let i=[""],o=Pr(r.originalText.slice(n.position.start.offset,n.position.end.offset));for(let s of o){if(s.type==="word"){i.push([i.pop(),s.value]);continue}let l=Et(e,s.value,r.proseWrap,!0);if(Y(l)===$){i.push([i.pop(),l]);continue}i.push(l)}return Ee(i)}switch(n.type){case"front-matter":return r.originalText.slice(n.position.start.offset,n.position.end.offset);case"root":return n.children.length===0?"":[tf(e,r,t),L];case"paragraph":return Fi(e,r,t);case"sentence":return vi(e,t);case"word":{let i=N(!1,N(!1,n.value,"*",String.raw`\*`),new RegExp([`(^|${Se.source})(_+)`,`(_+)(${Se.source}|$)`].join("|"),"gu"),(l,c,f,D,h)=>N(!1,f?`${c}${f}`:`${D}${h}`,"_",String.raw`\_`)),o=(l,c,f)=>l.type==="sentence"&&f===0,s=(l,c,f)=>mt(l.children[f-1]);return i!==n.value&&(e.match(void 0,o,s)||e.match(void 0,o,(l,c,f)=>l.type==="emphasis"&&f===0,s))&&(i=i.replace(/^(\\?[*_])+/u,l=>N(!1,l,"\\",""))),i}case"whitespace":{let{next:i}=e,o=i&&/^>|^(?:[*+-]|#{1,6}|\d+[).])$/u.test(i.value)?"never":r.proseWrap;return Et(e,n.value,o)}case"emphasis":{let i;if(mt(n.children[0]))i=r.originalText[n.position.start.offset];else{let{previous:o,next:s}=e;i=(o==null?void 0:o.type)==="sentence"&&((a=M(!1,o.children,-1))==null?void 0:a.type)==="word"&&!M(!1,o.children,-1).hasTrailingPunctuation||(s==null?void 0:s.type)==="sentence"&&((u=s.children[0])==null?void 0:u.type)==="word"&&!s.children[0].hasLeadingPunctuation||e.hasAncestor(c=>c.type==="emphasis")?"*":"_"}return[i,V(e,r,t),i]}case"strong":return["**",V(e,r,t),"**"];case"delete":return["~~",V(e,r,t),"~~"];case"inlineCode":{let i=r.proseWrap==="preserve"?n.value:N(!1,n.value,`
`," "),o=Gn(i,"`"),s="`".repeat(o||1),l=i.startsWith("`")||i.endsWith("`")||/^[\n ]/u.test(i)&&/[\n ]$/u.test(i)&&/[^\n ]/u.test(i)?" ":"";return[s,l,i,l,s]}case"wikiLink":{let i="";return r.proseWrap==="preserve"?i=n.value:i=N(!1,n.value,/[\t\n]+/gu," "),["[[",i,"]]"]}case"link":switch(r.originalText[n.position.start.offset]){case"<":{let i="mailto:";return["<",n.url.startsWith(i)&&r.originalText.slice(n.position.start.offset+1,n.position.start.offset+1+i.length)!==i?n.url.slice(i.length):n.url,">"]}case"[":return["[",V(e,r,t),"](",Ct(n.url,")"),Nr(n.title,r),")"];default:return r.originalText.slice(n.position.start.offset,n.position.end.offset)}case"image":return["![",n.alt||"","](",Ct(n.url,")"),Nr(n.title,r),")"];case"blockquote":return["> ",ve("> ",V(e,r,t))];case"heading":return["#".repeat(n.depth)+" ",V(e,r,t)];case"code":{if(n.isIndented){let s=" ".repeat(4);return ve(s,[s,Ce(n.value,L)])}let i=r.__inJsTemplate?"~":"`",o=i.repeat(Math.max(3,_r(n.value,i)+1));return[o,n.lang||"",n.meta?" "+n.meta:"",L,Ce(Lr(n,r.originalText),L),L,o]}case"html":{let{parent:i,isLast:o}=e,s=i.type==="root"&&o?n.value.trimEnd():n.value,l=/^<!--.*-->$/su.test(s);return Ce(s,l?L:_e(tr))}case"list":{let i=Ai(n,e.parent),o=ii(n,r);return V(e,r,t,{processor(s){let l=f(),c=s.node;if(c.children.length===2&&c.children[1].type==="html"&&c.children[0].position.start.column!==c.children[1].position.start.column)return[l,yi(s,r,t,l)];return[l,ve(" ".repeat(l.length),yi(s,r,t,l))];function f(){let D=n.ordered?(s.isFirst?n.start:o?1:n.start+s.index)+(i%2===0?". ":") "):i%2===0?"- ":"* ";return n.isAligned||n.hasIndentedCodeblock?ef(D,r):D}}})}case"thematicBreak":{let{ancestors:i}=e,o=i.findIndex(l=>l.type==="list");return o===-1?"---":Ai(i[o],i[o+1])%2===0?"***":"---"}case"linkReference":return["[",V(e,r,t),"]",n.referenceType==="full"?bt(n):n.referenceType==="collapsed"?"[]":""];case"imageReference":switch(n.referenceType){case"full":return["![",n.alt||"","]",bt(n)];default:return["![",n.alt,"]",n.referenceType==="collapsed"?"[]":""]}case"definition":{let i=r.proseWrap==="always"?Br:" ";return ze([bt(n),":",Ze([i,Ct(n.url),n.title===null?"":[i,Nr(n.title,r,!1)]])])}case"footnote":return["[^",V(e,r,t),"]"];case"footnoteReference":return Bi(n);case"footnoteDefinition":{let i=n.children.length===1&&n.children[0].type==="paragraph"&&(r.proseWrap==="never"||r.proseWrap==="preserve"&&n.children[0].position.start.line===n.children[0].position.end.line);return[Bi(n),": ",i?V(e,r,t):ze([ve(" ".repeat(4),V(e,r,t,{processor:({isFirst:o})=>o?ze([qr,t()]):t()}))])]}case"table":return mi(e,r,t);case"tableCell":return V(e,r,t);case"break":return/\s/u.test(r.originalText[n.position.start.offset])?["  ",_e(tr)]:["\\",L];case"liquidNode":return Ce(n.value,L);case"import":case"export":case"jsx":return n.value;case"esComment":return["{/* ",n.value," */}"];case"math":return["$$",L,n.value?[Ce(n.value,L),L]:"","$$"];case"inlineMath":return r.originalText.slice(Oe(n),Pe(n));case"tableRow":case"listItem":case"text":default:throw new $n(n,"Markdown")}}function yi(e,r,t,n){let{node:a}=e,u=a.checked===null?"":a.checked?"[x] ":"[ ] ";return[u,V(e,r,t,{processor({node:i,isFirst:o}){if(o&&i.type!=="list")return ve(" ".repeat(u.length),t());let s=" ".repeat(sf(r.tabWidth-n.length,0,3));return[s,ve(s,t())]}})]}function ef(e,r){let t=n();return e+" ".repeat(t>=4?0:t);function n(){let a=e.length%r.tabWidth;return a===0?0:r.tabWidth-a}}function Ai(e,r){return rf(e,r,t=>t.ordered===e.ordered)}function rf(e,r,t){let n=-1;for(let a of r.children)if(a.type===e.type&&t(a)?n++:n=-1,a===e)return n}function tf(e,r,t){let n=[],a=null,{children:u}=e.node;for(let[i,o]of u.entries())switch(yt(o)){case"start":a===null&&(a={index:i,offset:o.position.end.offset});break;case"end":a!==null&&(n.push({start:a,end:{index:i,offset:o.position.start.offset}}),a=null);break;default:break}return V(e,r,t,{processor({index:i}){if(n.length>0){let o=n[0];if(i===o.start.index)return[xi(u[o.start.index]),r.originalText.slice(o.start.offset,o.end.offset),xi(u[o.end.index])];if(o.start.index<i&&i<o.end.index)return!1;if(i===o.end.index)return n.shift(),!1}return t()}})}function V(e,r,t,n={}){let{processor:a=t}=n,u=[];return e.each(()=>{let i=a(e);i!==!1&&(u.length>0&&nf(e)&&(u.push(L),(uf(e,r)||ki(e))&&u.push(L),ki(e)&&u.push(L)),u.push(i))},"children"),u}function xi(e){if(e.type==="html")return e.value;if(e.type==="paragraph"&&Array.isArray(e.children)&&e.children.length===1&&e.children[0].type==="esComment")return["{/* ",e.children[0].value," */}"]}function yt(e){let r;if(e.type==="html")r=e.value.match(/^<!--\s*prettier-ignore(?:-(start|end))?\s*-->$/u);else{let t;e.type==="esComment"?t=e:e.type==="paragraph"&&e.children.length===1&&e.children[0].type==="esComment"&&(t=e.children[0]),t&&(r=t.value.match(/^prettier-ignore(?:-(start|end))?$/u))}return r?r[1]||"next":!1}function nf({node:e,parent:r}){let t=ht.has(e.type),n=e.type==="html"&&Or.has(r.type);return!t&&!n}function wi(e,r){return e.type==="listItem"&&(e.spread||r.originalText.charAt(e.position.end.offset-1)===`
`)}function uf({node:e,previous:r,parent:t},n){if(wi(r,n))return!0;let i=r.type===e.type&&Ql.has(e.type),o=t.type==="listItem"&&!wi(t,n),s=yt(r)==="next",l=e.type==="html"&&r.type==="html"&&r.position.end.line+1===e.position.start.line,c=e.type==="html"&&t.type==="listItem"&&r.type==="paragraph"&&r.position.end.line+1===e.position.start.line;return!(i||o||s||l||c)}function ki({node:e,previous:r}){let t=r.type==="list",n=e.type==="code"&&e.isIndented;return t&&n}function af(e){let r=e.findAncestor(t=>t.type==="linkReference"||t.type==="imageReference");return r&&(r.type!=="linkReference"||r.referenceType!=="full")}var of=(e,r)=>{for(let t of r)e=N(!1,e,t,encodeURIComponent(t));return e};function Ct(e,r=[]){let t=[" ",...Array.isArray(r)?r:[r]];return new RegExp(t.map(n=>Be(n)).join("|"),"u").test(e)?`<${of(e,"<>")}>`:e}function Nr(e,r,t=!0){if(!e)return"";if(t)return" "+Nr(e,r,!1);if(e=N(!1,e,/\\(?=["')])/gu,""),e.includes('"')&&e.includes("'")&&!e.includes(")"))return`(${e})`;let n=jn(e,r.singleQuote);return e=N(!1,e,"\\","\\\\"),e=N(!1,e,n,`\\${n}`),`${n}${e}${n}`}function sf(e,r,t){return e<r?r:e>t?t:e}function cf(e){return e.index>0&&yt(e.previous)==="next"}function bt(e){return`[${(0,qi.default)(e.label)}]`}function Bi(e){return`[^${e.label}]`}var lf={preprocess:gi,print:Zl,embed:ui,massageAstNode:Zn,hasPrettierIgnore:cf,insertPragma:Jn,getVisitorKeys:si},Ti=lf;var _i=[{linguistLanguageId:222,name:"Markdown",type:"prose",color:"#083fa1",aliases:["md","pandoc"],aceMode:"markdown",codemirrorMode:"gfm",codemirrorMimeType:"text/x-gfm",wrap:!0,extensions:[".md",".livemd",".markdown",".mdown",".mdwn",".mkd",".mkdn",".mkdown",".ronn",".scd",".workbook"],filenames:["contents.lr","README"],tmScope:"text.md",parsers:["markdown"],vscodeLanguageIds:["markdown"]},{linguistLanguageId:222,name:"MDX",type:"prose",color:"#083fa1",aliases:["md","pandoc"],aceMode:"markdown",codemirrorMode:"gfm",codemirrorMimeType:"text/x-gfm",wrap:!0,extensions:[".mdx"],filenames:[],tmScope:"text.md",parsers:["mdx"],vscodeLanguageIds:["mdx"]}];var At={bracketSpacing:{category:"Common",type:"boolean",default:!0,description:"Print spaces between brackets.",oppositeDescription:"Do not print spaces between brackets."},singleQuote:{category:"Common",type:"boolean",default:!1,description:"Use single quotes instead of double quotes."},proseWrap:{category:"Common",type:"choice",default:"preserve",description:"How to wrap prose.",choices:[{value:"always",description:"Wrap prose if it exceeds the print width."},{value:"never",description:"Do not wrap prose."},{value:"preserve",description:"Wrap prose as-is."}]},bracketSameLine:{category:"Common",type:"boolean",default:!1,description:"Put > of opening tags on the last line instead of on a new line."},singleAttributePerLine:{category:"Common",type:"boolean",default:!1,description:"Enforce single attribute per line in HTML, Vue and JSX."}};var ff={proseWrap:At.proseWrap,singleQuote:At.singleQuote},Si=ff;var On={};Ln(On,{markdown:()=>km,mdx:()=>Bm,remark:()=>km});var Wc=Ue(Pi(),1),Kc=Ue(Wi(),1),Jc=Ue(Gs(),1),Xc=Ue(Ic(),1);var vm=/^import\s/u,Em=/^export\s/u,Nc=String.raw`[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)*|`,Rc=/<!---->|<!---?[^>-](?:-?[^-])*-->/u,Cm=/^\{\s*\/\*(.*)\*\/\s*\}/u,bm=`

`,Uc=e=>vm.test(e),Sn=e=>Em.test(e),zc=(e,r)=>{let t=r.indexOf(bm),n=r.slice(0,t);if(Sn(n)||Uc(n))return e(n)({type:Sn(n)?"export":"import",value:n})},Mc=(e,r)=>{let t=Cm.exec(r);if(t)return e(t[0])({type:"esComment",value:t[1].trim()})};zc.locator=e=>Sn(e)||Uc(e)?-1:1;Mc.locator=(e,r)=>e.indexOf("{",r);var Yc=function(){let{Parser:e}=this,{blockTokenizers:r,blockMethods:t,inlineTokenizers:n,inlineMethods:a}=e.prototype;r.esSyntax=zc,n.esComment=Mc,t.splice(t.indexOf("paragraph"),0,"esSyntax"),a.splice(a.indexOf("text"),0,"esComment")};var ym=function(){let e=this.Parser.prototype;e.blockMethods=["frontMatter",...e.blockMethods],e.blockTokenizers.frontMatter=r;function r(t,n){let a=ir(n);if(a.frontMatter)return t(a.frontMatter.raw)(a.frontMatter)}r.onlyAtStart=!0},Gc=ym;function Am(){return e=>ye(e,(r,t,[n])=>r.type!=="html"||Rc.test(r.value)||Or.has(n.type)?r:{...r,type:"jsx"})}var Vc=Am;var xm=function(){let e=this.Parser.prototype,r=e.inlineMethods;r.splice(r.indexOf("text"),0,"liquid"),e.inlineTokenizers.liquid=t;function t(n,a){let u=a.match(/^(\{%.*?%\}|\{\{.*?\}\})/su);if(u)return n(u[0])({type:"liquidNode",value:u[0]})}t.locator=function(n,a){return n.indexOf("{",a)}},jc=xm;var wm=function(){let e="wikiLink",r=/^\[\[(?<linkContents>.+?)\]\]/su,t=this.Parser.prototype,n=t.inlineMethods;n.splice(n.indexOf("link"),0,e),t.inlineTokenizers.wikiLink=a;function a(u,i){let o=r.exec(i);if(o){let s=o.groups.linkContents.trim();return u(o[0])({type:e,value:s})}}a.locator=function(u,i){return u.indexOf("[",i)}},$c=wm;function Qc({isMDX:e}){return r=>{let t=(0,Xc.default)().use(Jc.default,{commonmark:!0,...e&&{blocks:[Nc]}}).use(Wc.default).use(Gc).use(Kc.default).use(e?Yc:Hc).use(jc).use(e?Vc:Hc).use($c);return t.run(t.parse(r))}}function Hc(){}var Zc={astFormat:"mdast",hasPragma:Kn,locStart:Oe,locEnd:Pe},km={...Zc,parse:Qc({isMDX:!1})},Bm={...Zc,parse:Qc({isMDX:!0})};var qm={mdast:Ti};var fC=Pn;

;// CONCATENATED MODULE: ./node_modules/prettier/standalone.mjs
var yu=Object.create;var He=Object.defineProperty;var Au=Object.getOwnPropertyDescriptor;var Bu=Object.getOwnPropertyNames;var wu=Object.getPrototypeOf,xu=Object.prototype.hasOwnProperty;var standalone_sr=e=>{throw TypeError(e)};var _u=(e,t)=>()=>(e&&(t=e(e=0)),t);var standalone_At=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),We=(e,t)=>{for(var r in t)He(e,r,{get:t[r],enumerable:!0})},standalone_ar=(e,t,r,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of Bu(t))!xu.call(e,o)&&o!==r&&He(e,o,{get:()=>t[o],enumerable:!(n=Au(t,o))||n.enumerable});return e};var standalone_Me=(e,t,r)=>(r=e!=null?yu(wu(e)):{},standalone_ar(t||!e||!e.__esModule?He(r,"default",{value:e,enumerable:!0}):r,e)),vu=e=>standalone_ar(He({},"__esModule",{value:!0}),e);var bu=(e,t,r)=>t.has(e)||standalone_sr("Cannot "+r);var Dr=(e,t,r)=>t.has(e)?standalone_sr("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,r);var pe=(e,t,r)=>(bu(e,t,"access private method"),r);var it=standalone_At((ia,sn)=>{"use strict";var on=new Proxy(String,{get:()=>on});sn.exports=on});var Tn={};We(Tn,{default:()=>_o,shouldHighlight:()=>standalone_xo});var standalone_xo,_o,kn=_u(()=>{standalone_xo=()=>!1,_o=String});var standalone_Pn=standalone_At((bD,Xt)=>{var g=String,Ln=function(){return{isColorSupported:!1,reset:g,bold:g,dim:g,italic:g,underline:g,inverse:g,hidden:g,strikethrough:g,black:g,red:g,green:g,yellow:g,blue:g,magenta:g,cyan:g,white:g,gray:g,bgBlack:g,bgRed:g,bgGreen:g,bgYellow:g,bgBlue:g,bgMagenta:g,bgCyan:g,bgWhite:g}};Xt.exports=Ln();Xt.exports.createColors=Ln});var standalone_$n=standalone_At(Ct=>{"use strict";Object.defineProperty(Ct,"__esModule",{value:!0});Ct.codeFrameColumns=Mn;Ct.default=To;var In=(kn(),vu(Tn)),Hn=vo(standalone_Pn(),!0);function Wn(e){if(typeof WeakMap!="function")return null;var t=new WeakMap,r=new WeakMap;return(Wn=function(n){return n?r:t})(e)}function vo(e,t){if(!t&&e&&e.__esModule)return e;if(e===null||typeof e!="object"&&typeof e!="function")return{default:e};var r=Wn(t);if(r&&r.has(e))return r.get(e);var n={__proto__:null},o=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var u in e)if(u!=="default"&&{}.hasOwnProperty.call(e,u)){var i=o?Object.getOwnPropertyDescriptor(e,u):null;i&&(i.get||i.set)?Object.defineProperty(n,u,i):n[u]=e[u]}return n.default=e,r&&r.set(e,n),n}var bo=Hn.default,Rn=(e,t)=>r=>e(t(r)),Zt;function Oo(e){if(e){var t;return(t=Zt)!=null||(Zt=(0,Hn.createColors)(!0)),Zt}return bo}var Yn=!1;function So(e){return{gutter:e.gray,marker:Rn(e.red,e.bold),message:Rn(e.red,e.bold)}}var jn=/\r\n|[\n\r\u2028\u2029]/;function No(e,t,r){let n=Object.assign({column:0,line:-1},e.start),o=Object.assign({},n,e.end),{linesAbove:u=2,linesBelow:i=3}=r||{},s=n.line,a=n.column,D=o.line,l=o.column,d=Math.max(s-(u+1),0),f=Math.min(t.length,D+i);s===-1&&(d=0),D===-1&&(f=t.length);let p=D-s,c={};if(p)for(let F=0;F<=p;F++){let m=F+s;if(!a)c[m]=!0;else if(F===0){let E=t[m-1].length;c[m]=[a,E-a+1]}else if(F===p)c[m]=[0,l];else{let E=t[m-F].length;c[m]=[0,E]}}else a===l?a?c[s]=[a,0]:c[s]=!0:c[s]=[a,l-a];return{start:d,end:f,markerLines:c}}function Mn(e,t,r={}){let n=(r.highlightCode||r.forceColor)&&(0,In.shouldHighlight)(r),o=Oo(r.forceColor),u=So(o),i=(F,m)=>n?F(m):m,s=e.split(jn),{start:a,end:D,markerLines:l}=No(t,s,r),d=t.start&&typeof t.start.column=="number",f=String(D).length,c=(n?(0,In.default)(e,r):e).split(jn,D).slice(a,D).map((F,m)=>{let E=a+1+m,w=` ${` ${E}`.slice(-f)} |`,h=l[E],C=!l[E+1];if(h){let k="";if(Array.isArray(h)){let v=F.slice(0,Math.max(h[0]-1,0)).replace(/[^\t]/g," "),$=h[1]||1;k=[`
 `,i(u.gutter,w.replace(/\d/g," "))," ",v,i(u.marker,"^").repeat($)].join(""),C&&r.message&&(k+=" "+i(u.message,r.message))}return[i(u.marker,">"),i(u.gutter,w),F.length>0?` ${F}`:"",k].join("")}else return` ${i(u.gutter,w)}${F.length>0?` ${F}`:""}`}).join(`
`);return r.message&&!d&&(c=`${" ".repeat(f+1)}${r.message}
${c}`),n?o.reset(c):c}function To(e,t,r,n={}){if(!Yn){Yn=!0;let u="Passing lineNumber and colNumber is deprecated to @babel/code-frame. Please use `codeFrameColumns`.";{let i=new Error(u);i.name="DeprecationWarning",console.warn(new Error(u))}}return r=Math.max(r,0),Mn(e,{start:{column:r,line:t}},n)}});var standalone_ir={};We(standalone_ir,{__debug:()=>standalone_di,check:()=>standalone_fi,doc:()=>standalone_nr,format:()=>gu,formatWithCursor:()=>Cu,getSupportInfo:()=>standalone_pi,util:()=>standalone_or,version:()=>fu});var standalone_Ou=(e,t,r,n)=>{if(!(e&&t==null))return t.replaceAll?t.replaceAll(r,n):r.global?t.replace(r,n):t.split(r).join(n)},standalone_ne=standalone_Ou;function Z(){}Z.prototype={diff:function(t,r){var n,o=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},u=o.callback;typeof o=="function"&&(u=o,o={}),this.options=o;var i=this;function s(h){return u?(setTimeout(function(){u(void 0,h)},0),!0):h}t=this.castInput(t),r=this.castInput(r),t=this.removeEmpty(this.tokenize(t)),r=this.removeEmpty(this.tokenize(r));var a=r.length,D=t.length,l=1,d=a+D;o.maxEditLength&&(d=Math.min(d,o.maxEditLength));var f=(n=o.timeout)!==null&&n!==void 0?n:1/0,p=Date.now()+f,c=[{oldPos:-1,lastComponent:void 0}],F=this.extractCommon(c[0],r,t,0);if(c[0].oldPos+1>=D&&F+1>=a)return s([{value:this.join(r),count:r.length}]);var m=-1/0,E=1/0;function A(){for(var h=Math.max(m,-l);h<=Math.min(E,l);h+=2){var C=void 0,k=c[h-1],v=c[h+1];k&&(c[h-1]=void 0);var $=!1;if(v){var ye=v.oldPos-h;$=v&&0<=ye&&ye<a}var yt=k&&k.oldPos+1<D;if(!$&&!yt){c[h]=void 0;continue}if(!yt||$&&k.oldPos+1<v.oldPos?C=i.addToPath(v,!0,void 0,0):C=i.addToPath(k,void 0,!0,1),F=i.extractCommon(C,r,t,h),C.oldPos+1>=D&&F+1>=a)return s(Su(i,C.lastComponent,r,t,i.useLongestToken));c[h]=C,C.oldPos+1>=D&&(E=Math.min(E,h-1)),F+1>=a&&(m=Math.max(m,h+1))}l++}if(u)(function h(){setTimeout(function(){if(l>d||Date.now()>p)return u();A()||h()},0)})();else for(;l<=d&&Date.now()<=p;){var w=A();if(w)return w}},addToPath:function(t,r,n,o){var u=t.lastComponent;return u&&u.added===r&&u.removed===n?{oldPos:t.oldPos+o,lastComponent:{count:u.count+1,added:r,removed:n,previousComponent:u.previousComponent}}:{oldPos:t.oldPos+o,lastComponent:{count:1,added:r,removed:n,previousComponent:u}}},extractCommon:function(t,r,n,o){for(var u=r.length,i=n.length,s=t.oldPos,a=s-o,D=0;a+1<u&&s+1<i&&this.equals(r[a+1],n[s+1]);)a++,s++,D++;return D&&(t.lastComponent={count:D,previousComponent:t.lastComponent}),t.oldPos=s,a},equals:function(t,r){return this.options.comparator?this.options.comparator(t,r):t===r||this.options.ignoreCase&&t.toLowerCase()===r.toLowerCase()},removeEmpty:function(t){for(var r=[],n=0;n<t.length;n++)t[n]&&r.push(t[n]);return r},castInput:function(t){return t},tokenize:function(t){return t.split("")},join:function(t){return t.join("")}};function Su(e,t,r,n,o){for(var u=[],i;t;)u.push(t),i=t.previousComponent,delete t.previousComponent,t=i;u.reverse();for(var s=0,a=u.length,D=0,l=0;s<a;s++){var d=u[s];if(d.removed){if(d.value=e.join(n.slice(l,l+d.count)),l+=d.count,s&&u[s-1].added){var p=u[s-1];u[s-1]=u[s],u[s]=p}}else{if(!d.added&&o){var f=r.slice(D,D+d.count);f=f.map(function(F,m){var E=n[l+m];return E.length>F.length?E:F}),d.value=e.join(f)}else d.value=e.join(r.slice(D,D+d.count));D+=d.count,d.added||(l+=d.count)}}var c=u[a-1];return a>1&&typeof c.value=="string"&&(c.added||c.removed)&&e.equals("",c.value)&&(u[a-2].value+=c.value,u.pop()),u}var standalone_hi=new Z;var lr=/^[A-Za-z\xC0-\u02C6\u02C8-\u02D7\u02DE-\u02FF\u1E00-\u1EFF]+$/,standalone_cr=/\S/,fr=new Z;fr.equals=function(e,t){return this.options.ignoreCase&&(e=e.toLowerCase(),t=t.toLowerCase()),e===t||this.options.ignoreWhitespace&&!standalone_cr.test(e)&&!standalone_cr.test(t)};fr.tokenize=function(e){for(var t=e.split(/([^\S\r\n]+|[()[\]{}'"\r\n]|\b)/),r=0;r<t.length-1;r++)!t[r+1]&&t[r+2]&&lr.test(t[r])&&lr.test(t[r+2])&&(t[r]+=t[r+2],t.splice(r+1,2),r--);return t};var standalone_pr=new Z;standalone_pr.tokenize=function(e){this.options.stripTrailingCr&&(e=e.replace(/\r\n/g,`
`));var t=[],r=e.split(/(\n|\r\n)/);r[r.length-1]||r.pop();for(var n=0;n<r.length;n++){var o=r[n];n%2&&!this.options.newlineIsToken?t[t.length-1]+=o:(this.options.ignoreWhitespace&&(o=o.trim()),t.push(o))}return t};var Nu=new Z;Nu.tokenize=function(e){return e.split(/(\S.+?[.!?])(?=\s+|$)/)};var Tu=new Z;Tu.tokenize=function(e){return e.split(/([{}:;,]|\s+)/)};function $e(e){"@babel/helpers - typeof";return typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?$e=function(t){return typeof t}:$e=function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},$e(e)}var ku=Object.prototype.toString,Ae=new Z;Ae.useLongestToken=!0;Ae.tokenize=standalone_pr.tokenize;Ae.castInput=function(e){var t=this.options,r=t.undefinedReplacement,n=t.stringifyReplacer,o=n===void 0?function(u,i){return typeof i>"u"?r:i}:n;return typeof e=="string"?e:JSON.stringify(standalone_Bt(e,null,null,o),o,"  ")};Ae.equals=function(e,t){return Z.prototype.equals.call(Ae,e.replace(/,([\r\n])/g,"$1"),t.replace(/,([\r\n])/g,"$1"))};function standalone_Bt(e,t,r,n,o){t=t||[],r=r||[],n&&(e=n(o,e));var u;for(u=0;u<t.length;u+=1)if(t[u]===e)return r[u];var i;if(ku.call(e)==="[object Array]"){for(t.push(e),i=new Array(e.length),r.push(i),u=0;u<e.length;u+=1)i[u]=standalone_Bt(e[u],t,r,n,o);return t.pop(),r.pop(),i}if(e&&e.toJSON&&(e=e.toJSON()),$e(e)==="object"&&e!==null){t.push(e),i={},r.push(i);var s=[],a;for(a in e)e.hasOwnProperty(a)&&s.push(a);for(s.sort(),u=0;u<s.length;u+=1)a=s[u],i[a]=standalone_Bt(e[a],t,r,n,a);t.pop(),r.pop()}else i=e;return i}var standalone_Ve=new Z;standalone_Ve.tokenize=function(e){return e.slice()};standalone_Ve.join=standalone_Ve.removeEmpty=function(e){return e};function dr(e,t,r){return standalone_Ve.diff(e,t,r)}function Fr(e){let t=e.indexOf("\r");return t>=0?e.charAt(t+1)===`
`?"crlf":"cr":"lf"}function standalone_Be(e){switch(e){case"cr":return"\r";case"crlf":return`\r
`;default:return`
`}}function wt(e,t){let r;switch(t){case`
`:r=/\n/gu;break;case"\r":r=/\r/gu;break;case`\r
`:r=/\r\n/gu;break;default:throw new Error(`Unexpected "eol" ${JSON.stringify(t)}.`)}let n=e.match(r);return n?n.length:0}function mr(e){return standalone_ne(!1,e,/\r\n?/gu,`
`)}var U="string",standalone_W="array",z="cursor",standalone_L="indent",P="align",I="trim",standalone_x="group",S="fill",_="if-break",R="indent-if-break",standalone_Y="line-suffix",j="line-suffix-boundary",B="line",standalone_N="label",b="break-parent",standalone_Ue=new Set([z,standalone_L,P,I,standalone_x,S,_,R,standalone_Y,j,B,standalone_N,b]);function Lu(e){if(typeof e=="string")return U;if(Array.isArray(e))return standalone_W;if(!e)return;let{type:t}=e;if(standalone_Ue.has(t))return t}var standalone_G=Lu;var Pu=e=>new Intl.ListFormat("en-US",{type:"disjunction"}).format(e);function standalone_Iu(e){let t=e===null?"null":typeof e;if(t!=="string"&&t!=="object")return`Unexpected doc '${t}', 
Expected it to be 'string' or 'object'.`;if(standalone_G(e))throw new Error("doc is valid.");let r=Object.prototype.toString.call(e);if(r!=="[object Object]")return`Unexpected doc '${r}'.`;let n=Pu([...standalone_Ue].map(o=>`'${o}'`));return`Unexpected doc.type '${e.type}'.
Expected it to be ${n}.`}var xt=class extends Error{name="InvalidDocError";constructor(t){super(standalone_Iu(t)),this.doc=t}},Q=xt;var Er={};function Ru(e,t,r,n){let o=[e];for(;o.length>0;){let u=o.pop();if(u===Er){r(o.pop());continue}r&&o.push(u,Er);let i=standalone_G(u);if(!i)throw new Q(u);if((t==null?void 0:t(u))!==!1)switch(i){case standalone_W:case S:{let s=i===standalone_W?u:u.parts;for(let a=s.length,D=a-1;D>=0;--D)o.push(s[D]);break}case _:o.push(u.flatContents,u.breakContents);break;case standalone_x:if(n&&u.expandedStates)for(let s=u.expandedStates.length,a=s-1;a>=0;--a)o.push(u.expandedStates[a]);else o.push(u.contents);break;case P:case standalone_L:case R:case standalone_N:case standalone_Y:o.push(u.contents);break;case U:case z:case I:case j:case B:case b:break;default:throw new Q(u)}}}var we=Ru;var hr=()=>{},standalone_K=hr,standalone_ze=hr;function standalone_De(e){return standalone_K(e),{type:standalone_L,contents:e}}function ae(e,t){return standalone_K(t),{type:P,contents:t,n:e}}function _t(e,t={}){return standalone_K(e),standalone_ze(t.expandedStates,!0),{type:standalone_x,id:t.id,contents:e,break:!!t.shouldBreak,expandedStates:t.expandedStates}}function Cr(e){return ae(Number.NEGATIVE_INFINITY,e)}function gr(e){return ae({type:"root"},e)}function yr(e){return ae(-1,e)}function Ar(e,t){return _t(e[0],{...t,expandedStates:e})}function Ge(e){return standalone_ze(e),{type:S,parts:e}}function standalone_Br(e,t="",r={}){return standalone_K(e),t!==""&&standalone_K(t),{type:_,breakContents:e,flatContents:t,groupId:r.groupId}}function standalone_wr(e,t){return standalone_K(e),{type:R,contents:e,groupId:t.groupId,negate:t.negate}}function xe(e){return standalone_K(e),{type:standalone_Y,contents:e}}var standalone_xr={type:j},de={type:b},standalone_r={type:I},standalone_e={type:B,hard:!0},standalone_vt={type:B,hard:!0,literal:!0},Ke={type:B},vr={type:B,soft:!0},q=[standalone_e,de],standalone_qe=[standalone_vt,de],standalone_ve={type:z};function standalone_be(e,t){standalone_K(e),standalone_ze(t);let r=[];for(let n=0;n<t.length;n++)n!==0&&r.push(e),r.push(t[n]);return r}function Je(e,t,r){standalone_K(e);let n=e;if(t>0){for(let o=0;o<Math.floor(t/r);++o)n=standalone_De(n);n=ae(t%r,n),n=ae(Number.NEGATIVE_INFINITY,n)}return n}function br(e,t){return standalone_K(t),e?{type:standalone_N,label:e,contents:t}:t}function standalone_ee(e){var t;if(!e)return"";if(Array.isArray(e)){let r=[];for(let n of e)if(Array.isArray(n))r.push(...standalone_ee(n));else{let o=standalone_ee(n);o!==""&&r.push(o)}return r}return e.type===_?{...e,breakContents:standalone_ee(e.breakContents),flatContents:standalone_ee(e.flatContents)}:e.type===standalone_x?{...e,contents:standalone_ee(e.contents),expandedStates:(t=e.expandedStates)==null?void 0:t.map(standalone_ee)}:e.type===S?{type:"fill",parts:e.parts.map(standalone_ee)}:e.contents?{...e,contents:standalone_ee(e.contents)}:e}function standalone_Or(e){let t=Object.create(null),r=new Set;return n(standalone_ee(e));function n(u,i,s){var a,D;if(typeof u=="string")return JSON.stringify(u);if(Array.isArray(u)){let l=u.map(n).filter(Boolean);return l.length===1?l[0]:`[${l.join(", ")}]`}if(u.type===B){let l=((a=s==null?void 0:s[i+1])==null?void 0:a.type)===b;return u.literal?l?"literalline":"literallineWithoutBreakParent":u.hard?l?"hardline":"hardlineWithoutBreakParent":u.soft?"softline":"line"}if(u.type===b)return((D=s==null?void 0:s[i-1])==null?void 0:D.type)===B&&s[i-1].hard?void 0:"breakParent";if(u.type===I)return"trim";if(u.type===standalone_L)return"indent("+n(u.contents)+")";if(u.type===P)return u.n===Number.NEGATIVE_INFINITY?"dedentToRoot("+n(u.contents)+")":u.n<0?"dedent("+n(u.contents)+")":u.n.type==="root"?"markAsRoot("+n(u.contents)+")":"align("+JSON.stringify(u.n)+", "+n(u.contents)+")";if(u.type===_)return"ifBreak("+n(u.breakContents)+(u.flatContents?", "+n(u.flatContents):"")+(u.groupId?(u.flatContents?"":', ""')+`, { groupId: ${o(u.groupId)} }`:"")+")";if(u.type===R){let l=[];u.negate&&l.push("negate: true"),u.groupId&&l.push(`groupId: ${o(u.groupId)}`);let d=l.length>0?`, { ${l.join(", ")} }`:"";return`indentIfBreak(${n(u.contents)}${d})`}if(u.type===standalone_x){let l=[];u.break&&u.break!=="propagated"&&l.push("shouldBreak: true"),u.id&&l.push(`id: ${o(u.id)}`);let d=l.length>0?`, { ${l.join(", ")} }`:"";return u.expandedStates?`conditionalGroup([${u.expandedStates.map(f=>n(f)).join(",")}]${d})`:`group(${n(u.contents)}${d})`}if(u.type===S)return`fill([${u.parts.map(l=>n(l)).join(", ")}])`;if(u.type===standalone_Y)return"lineSuffix("+n(u.contents)+")";if(u.type===j)return"lineSuffixBoundary";if(u.type===standalone_N)return`label(${JSON.stringify(u.label)}, ${n(u.contents)})`;throw new Error("Unknown doc type "+u.type)}function o(u){if(typeof u!="symbol")return JSON.stringify(String(u));if(u in t)return t[u];let i=u.description||"symbol";for(let s=0;;s++){let a=i+(s>0?` #${s}`:"");if(!r.has(a))return r.add(a),t[u]=`Symbol.for(${JSON.stringify(a)})`}}}var Yu=(e,t,r)=>{if(!(e&&t==null))return Array.isArray(t)||typeof t=="string"?t[r<0?t.length+r:r]:t.at(r)},standalone_y=Yu;var standalone_Sr=()=>/[#*0-9]\uFE0F?\u20E3|[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23ED-\u23EF\u23F1\u23F2\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB\u25FC\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692\u2694-\u2697\u2699\u269B\u269C\u26A0\u26A7\u26AA\u26B0\u26B1\u26BD\u26BE\u26C4\u26C8\u26CF\u26D1\u26E9\u26F0-\u26F5\u26F7\u26F8\u26FA\u2702\u2708\u2709\u270F\u2712\u2714\u2716\u271D\u2721\u2733\u2734\u2744\u2747\u2757\u2763\u27A1\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B55\u3030\u303D\u3297\u3299]\uFE0F?|[\u261D\u270C\u270D](?:\uFE0F|\uD83C[\uDFFB-\uDFFF])?|[\u270A\u270B](?:\uD83C[\uDFFB-\uDFFF])?|[\u23E9-\u23EC\u23F0\u23F3\u25FD\u2693\u26A1\u26AB\u26C5\u26CE\u26D4\u26EA\u26FD\u2705\u2728\u274C\u274E\u2753-\u2755\u2795-\u2797\u27B0\u27BF\u2B50]|\u26D3\uFE0F?(?:\u200D\uD83D\uDCA5)?|\u26F9(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|\u2764\uFE0F?(?:\u200D(?:\uD83D\uDD25|\uD83E\uDE79))?|\uD83C(?:[\uDC04\uDD70\uDD71\uDD7E\uDD7F\uDE02\uDE37\uDF21\uDF24-\uDF2C\uDF36\uDF7D\uDF96\uDF97\uDF99-\uDF9B\uDF9E\uDF9F\uDFCD\uDFCE\uDFD4-\uDFDF\uDFF5\uDFF7]\uFE0F?|[\uDF85\uDFC2\uDFC7](?:\uD83C[\uDFFB-\uDFFF])?|[\uDFC4\uDFCA](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDFCB\uDFCC](?:\uFE0F|\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDCCF\uDD8E\uDD91-\uDD9A\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF43\uDF45-\uDF4A\uDF4C-\uDF7C\uDF7E-\uDF84\uDF86-\uDF93\uDFA0-\uDFC1\uDFC5\uDFC6\uDFC8\uDFC9\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF8-\uDFFF]|\uDDE6\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF]|\uDDE7\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF]|\uDDE8\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF]|\uDDE9\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF]|\uDDEA\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA]|\uDDEB\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7]|\uDDEC\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE]|\uDDED\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA]|\uDDEE\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9]|\uDDEF\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5]|\uDDF0\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF]|\uDDF1\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE]|\uDDF2\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF]|\uDDF3\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF]|\uDDF4\uD83C\uDDF2|\uDDF5\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE]|\uDDF6\uD83C\uDDE6|\uDDF7\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC]|\uDDF8\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF]|\uDDF9\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF]|\uDDFA\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF]|\uDDFB\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA]|\uDDFC\uD83C[\uDDEB\uDDF8]|\uDDFD\uD83C\uDDF0|\uDDFE\uD83C[\uDDEA\uDDF9]|\uDDFF\uD83C[\uDDE6\uDDF2\uDDFC]|\uDF44(?:\u200D\uD83D\uDFEB)?|\uDF4B(?:\u200D\uD83D\uDFE9)?|\uDFC3(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?|\uDFF3\uFE0F?(?:\u200D(?:\u26A7\uFE0F?|\uD83C\uDF08))?|\uDFF4(?:\u200D\u2620\uFE0F?|\uDB40\uDC67\uDB40\uDC62\uDB40(?:\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDC73\uDB40\uDC63\uDB40\uDC74|\uDC77\uDB40\uDC6C\uDB40\uDC73)\uDB40\uDC7F)?)|\uD83D(?:[\uDC3F\uDCFD\uDD49\uDD4A\uDD6F\uDD70\uDD73\uDD76-\uDD79\uDD87\uDD8A-\uDD8D\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA\uDECB\uDECD-\uDECF\uDEE0-\uDEE5\uDEE9\uDEF0\uDEF3]\uFE0F?|[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDC8F\uDC91\uDCAA\uDD7A\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC](?:\uD83C[\uDFFB-\uDFFF])?|[\uDC6E\uDC70\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4\uDEB5](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDD74\uDD90](?:\uFE0F|\uD83C[\uDFFB-\uDFFF])?|[\uDC00-\uDC07\uDC09-\uDC14\uDC16-\uDC25\uDC27-\uDC3A\uDC3C-\uDC3E\uDC40\uDC44\uDC45\uDC51-\uDC65\uDC6A\uDC79-\uDC7B\uDC7D-\uDC80\uDC84\uDC88-\uDC8E\uDC90\uDC92-\uDCA9\uDCAB-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDDA4\uDDFB-\uDE2D\uDE2F-\uDE34\uDE37-\uDE41\uDE43\uDE44\uDE48-\uDE4A\uDE80-\uDEA2\uDEA4-\uDEB3\uDEB7-\uDEBF\uDEC1-\uDEC5\uDED0-\uDED2\uDED5-\uDED7\uDEDC-\uDEDF\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB\uDFF0]|\uDC08(?:\u200D\u2B1B)?|\uDC15(?:\u200D\uD83E\uDDBA)?|\uDC26(?:\u200D(?:\u2B1B|\uD83D\uDD25))?|\uDC3B(?:\u200D\u2744\uFE0F?)?|\uDC41\uFE0F?(?:\u200D\uD83D\uDDE8\uFE0F?)?|\uDC68(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDC68\uDC69]\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFC-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFD-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFD\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFE])))?))?|\uDC69(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?[\uDC68\uDC69]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?|\uDC69\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?))|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFC-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB\uDFFD-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB-\uDFFD\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB-\uDFFE])))?))?|\uDC6F(?:\u200D[\u2640\u2642]\uFE0F?)?|\uDD75(?:\uFE0F|\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|\uDE2E(?:\u200D\uD83D\uDCA8)?|\uDE35(?:\u200D\uD83D\uDCAB)?|\uDE36(?:\u200D\uD83C\uDF2B\uFE0F?)?|\uDE42(?:\u200D[\u2194\u2195]\uFE0F?)?|\uDEB6(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?)|\uD83E(?:[\uDD0C\uDD0F\uDD18-\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2\uDDD3\uDDD5\uDEC3-\uDEC5\uDEF0\uDEF2-\uDEF8](?:\uD83C[\uDFFB-\uDFFF])?|[\uDD26\uDD35\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD\uDDCF\uDDD4\uDDD6-\uDDDD](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDDDE\uDDDF](?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDD0D\uDD0E\uDD10-\uDD17\uDD20-\uDD25\uDD27-\uDD2F\uDD3A\uDD3F-\uDD45\uDD47-\uDD76\uDD78-\uDDB4\uDDB7\uDDBA\uDDBC-\uDDCC\uDDD0\uDDE0-\uDDFF\uDE70-\uDE7C\uDE80-\uDE88\uDE90-\uDEBD\uDEBF-\uDEC2\uDECE-\uDEDB\uDEE0-\uDEE8]|\uDD3C(?:\u200D[\u2640\u2642]\uFE0F?|\uD83C[\uDFFB-\uDFFF])?|\uDDCE(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?|\uDDD1(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1|\uDDD1\u200D\uD83E\uDDD2(?:\u200D\uD83E\uDDD2)?|\uDDD2(?:\u200D\uD83E\uDDD2)?))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFC-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB\uDFFD-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB-\uDFFD\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB-\uDFFE]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF])))?))?|\uDEF1(?:\uD83C(?:\uDFFB(?:\u200D\uD83E\uDEF2\uD83C[\uDFFC-\uDFFF])?|\uDFFC(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB\uDFFD-\uDFFF])?|\uDFFD(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])?|\uDFFE(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB-\uDFFD\uDFFF])?|\uDFFF(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB-\uDFFE])?))?)/g;function standalone_Nr(e){return e===12288||e>=65281&&e<=65376||e>=65504&&e<=65510}function standalone_Tr(e){return e>=4352&&e<=4447||e===8986||e===8987||e===9001||e===9002||e>=9193&&e<=9196||e===9200||e===9203||e===9725||e===9726||e===9748||e===9749||e>=9800&&e<=9811||e===9855||e===9875||e===9889||e===9898||e===9899||e===9917||e===9918||e===9924||e===9925||e===9934||e===9940||e===9962||e===9970||e===9971||e===9973||e===9978||e===9981||e===9989||e===9994||e===9995||e===10024||e===10060||e===10062||e>=10067&&e<=10069||e===10071||e>=10133&&e<=10135||e===10160||e===10175||e===11035||e===11036||e===11088||e===11093||e>=11904&&e<=11929||e>=11931&&e<=12019||e>=12032&&e<=12245||e>=12272&&e<=12287||e>=12289&&e<=12350||e>=12353&&e<=12438||e>=12441&&e<=12543||e>=12549&&e<=12591||e>=12593&&e<=12686||e>=12688&&e<=12771||e>=12783&&e<=12830||e>=12832&&e<=12871||e>=12880&&e<=19903||e>=19968&&e<=42124||e>=42128&&e<=42182||e>=43360&&e<=43388||e>=44032&&e<=55203||e>=63744&&e<=64255||e>=65040&&e<=65049||e>=65072&&e<=65106||e>=65108&&e<=65126||e>=65128&&e<=65131||e>=94176&&e<=94180||e===94192||e===94193||e>=94208&&e<=100343||e>=100352&&e<=101589||e>=101632&&e<=101640||e>=110576&&e<=110579||e>=110581&&e<=110587||e===110589||e===110590||e>=110592&&e<=110882||e===110898||e>=110928&&e<=110930||e===110933||e>=110948&&e<=110951||e>=110960&&e<=111355||e===126980||e===127183||e===127374||e>=127377&&e<=127386||e>=127488&&e<=127490||e>=127504&&e<=127547||e>=127552&&e<=127560||e===127568||e===127569||e>=127584&&e<=127589||e>=127744&&e<=127776||e>=127789&&e<=127797||e>=127799&&e<=127868||e>=127870&&e<=127891||e>=127904&&e<=127946||e>=127951&&e<=127955||e>=127968&&e<=127984||e===127988||e>=127992&&e<=128062||e===128064||e>=128066&&e<=128252||e>=128255&&e<=128317||e>=128331&&e<=128334||e>=128336&&e<=128359||e===128378||e===128405||e===128406||e===128420||e>=128507&&e<=128591||e>=128640&&e<=128709||e===128716||e>=128720&&e<=128722||e>=128725&&e<=128727||e>=128732&&e<=128735||e===128747||e===128748||e>=128756&&e<=128764||e>=128992&&e<=129003||e===129008||e>=129292&&e<=129338||e>=129340&&e<=129349||e>=129351&&e<=129535||e>=129648&&e<=129660||e>=129664&&e<=129672||e>=129680&&e<=129725||e>=129727&&e<=129733||e>=129742&&e<=129755||e>=129760&&e<=129768||e>=129776&&e<=129784||e>=131072&&e<=196605||e>=196608&&e<=262141}var standalone_kr=e=>!(standalone_Nr(e)||standalone_Tr(e));var ju=/[^\x20-\x7F]/u;function standalone_Hu(e){if(!e)return 0;if(!ju.test(e))return e.length;e=e.replace(standalone_Sr(),"  ");let t=0;for(let r of e){let n=r.codePointAt(0);n<=31||n>=127&&n<=159||n>=768&&n<=879||(t+=standalone_kr(n)?1:2)}return t}var standalone_Oe=standalone_Hu;function standalone_Ne(e,t){if(typeof e=="string")return t(e);let r=new Map;return n(e);function n(u){if(r.has(u))return r.get(u);let i=o(u);return r.set(u,i),i}function o(u){switch(standalone_G(u)){case standalone_W:return t(u.map(n));case S:return t({...u,parts:u.parts.map(n)});case _:return t({...u,breakContents:n(u.breakContents),flatContents:n(u.flatContents)});case standalone_x:{let{expandedStates:i,contents:s}=u;return i?(i=i.map(n),s=i[0]):s=n(s),t({...u,contents:s,expandedStates:i})}case P:case standalone_L:case R:case standalone_N:case standalone_Y:return t({...u,contents:n(u.contents)});case U:case z:case I:case j:case B:case b:return t(u);default:throw new Q(u)}}}function Xe(e,t,r){let n=r,o=!1;function u(i){if(o)return!1;let s=t(i);s!==void 0&&(o=!0,n=s)}return we(e,u),n}function Wu(e){if(e.type===standalone_x&&e.break||e.type===B&&e.hard||e.type===b)return!0}function standalone_Ir(e){return Xe(e,Wu,!1)}function standalone_Lr(e){if(e.length>0){let t=standalone_y(!1,e,-1);!t.expandedStates&&!t.break&&(t.break="propagated")}return null}function Rr(e){let t=new Set,r=[];function n(u){if(u.type===b&&standalone_Lr(r),u.type===standalone_x){if(r.push(u),t.has(u))return!1;t.add(u)}}function o(u){u.type===standalone_x&&r.pop().break&&standalone_Lr(r)}we(e,n,o,!0)}function standalone_Mu(e){return e.type===B&&!e.hard?e.soft?"":" ":e.type===_?e.flatContents:e}function Yr(e){return standalone_Ne(e,standalone_Mu)}function standalone_Pr(e){for(e=[...e];e.length>=2&&standalone_y(!1,e,-2).type===B&&standalone_y(!1,e,-1).type===b;)e.length-=2;if(e.length>0){let t=standalone_Se(standalone_y(!1,e,-1));e[e.length-1]=t}return e}function standalone_Se(e){switch(standalone_G(e)){case standalone_L:case R:case standalone_x:case standalone_Y:case standalone_N:{let t=standalone_Se(e.contents);return{...e,contents:t}}case _:return{...e,breakContents:standalone_Se(e.breakContents),flatContents:standalone_Se(e.flatContents)};case S:return{...e,parts:standalone_Pr(e.parts)};case standalone_W:return standalone_Pr(e);case U:return e.replace(/[\n\r]*$/u,"");case P:case z:case I:case j:case B:case b:break;default:throw new Q(e)}return e}function standalone_Ze(e){return standalone_Se(standalone_Vu(e))}function $u(e){switch(standalone_G(e)){case S:if(e.parts.every(t=>t===""))return"";break;case standalone_x:if(!e.contents&&!e.id&&!e.break&&!e.expandedStates)return"";if(e.contents.type===standalone_x&&e.contents.id===e.id&&e.contents.break===e.break&&e.contents.expandedStates===e.expandedStates)return e.contents;break;case P:case standalone_L:case R:case standalone_Y:if(!e.contents)return"";break;case _:if(!e.flatContents&&!e.breakContents)return"";break;case standalone_W:{let t=[];for(let r of e){if(!r)continue;let[n,...o]=Array.isArray(r)?r:[r];typeof n=="string"&&typeof standalone_y(!1,t,-1)=="string"?t[t.length-1]+=n:t.push(n),t.push(...o)}return t.length===0?"":t.length===1?t[0]:t}case U:case z:case I:case j:case B:case standalone_N:case b:break;default:throw new Q(e)}return e}function standalone_Vu(e){return standalone_Ne(e,t=>$u(t))}function jr(e,t=standalone_qe){return standalone_Ne(e,r=>typeof r=="string"?standalone_be(t,r.split(`
`)):r)}function standalone_Uu(e){if(e.type===B)return!0}function standalone_Hr(e){return Xe(e,standalone_Uu,!1)}function Qe(e,t){return e.type===standalone_N?{...e,contents:t(e.contents)}:t(e)}var standalone_H=Symbol("MODE_BREAK"),standalone_J=Symbol("MODE_FLAT"),standalone_Te=Symbol("cursor");function Wr(){return{value:"",length:0,queue:[]}}function zu(e,t){return standalone_bt(e,{type:"indent"},t)}function Gu(e,t,r){return t===Number.NEGATIVE_INFINITY?e.root||Wr():t<0?standalone_bt(e,{type:"dedent"},r):t?t.type==="root"?{...e,root:e}:standalone_bt(e,{type:typeof t=="string"?"stringAlign":"numberAlign",n:t},r):e}function standalone_bt(e,t,r){let n=t.type==="dedent"?e.queue.slice(0,-1):[...e.queue,t],o="",u=0,i=0,s=0;for(let c of n)switch(c.type){case"indent":l(),r.useTabs?a(1):D(r.tabWidth);break;case"stringAlign":l(),o+=c.n,u+=c.n.length;break;case"numberAlign":i+=1,s+=c.n;break;default:throw new Error(`Unexpected type '${c.type}'`)}return f(),{...e,value:o,length:u,queue:n};function a(c){o+="	".repeat(c),u+=r.tabWidth*c}function D(c){o+=" ".repeat(c),u+=c}function l(){r.useTabs?d():f()}function d(){i>0&&a(i),p()}function f(){s>0&&D(s),p()}function p(){i=0,s=0}}function Ot(e){let t=0,r=0,n=e.length;e:for(;n--;){let o=e[n];if(o===standalone_Te){r++;continue}for(let u=o.length-1;u>=0;u--){let i=o[u];if(i===" "||i==="	")t++;else{e[n]=o.slice(0,u+1);break e}}}if(t>0||r>0)for(e.length=n+1;r-- >0;)e.push(standalone_Te);return t}function et(e,t,r,n,o,u){if(r===Number.POSITIVE_INFINITY)return!0;let i=t.length,s=[e],a=[];for(;r>=0;){if(s.length===0){if(i===0)return!0;s.push(t[--i]);continue}let{mode:D,doc:l}=s.pop(),d=standalone_G(l);switch(d){case U:a.push(l),r-=standalone_Oe(l);break;case standalone_W:case S:{let f=d===standalone_W?l:l.parts;for(let p=f.length-1;p>=0;p--)s.push({mode:D,doc:f[p]});break}case standalone_L:case P:case R:case standalone_N:s.push({mode:D,doc:l.contents});break;case I:r+=Ot(a);break;case standalone_x:{if(u&&l.break)return!1;let f=l.break?standalone_H:D,p=l.expandedStates&&f===standalone_H?standalone_y(!1,l.expandedStates,-1):l.contents;s.push({mode:f,doc:p});break}case _:{let p=(l.groupId?o[l.groupId]||standalone_J:D)===standalone_H?l.breakContents:l.flatContents;p&&s.push({mode:D,doc:p});break}case B:if(D===standalone_H||l.hard)return!0;l.soft||(a.push(" "),r--);break;case standalone_Y:n=!0;break;case j:if(n)return!1;break}}return!1}function Fe(e,t){let r={},n=t.printWidth,o=standalone_Be(t.endOfLine),u=0,i=[{ind:Wr(),mode:standalone_H,doc:e}],s=[],a=!1,D=[],l=0;for(Rr(e);i.length>0;){let{ind:f,mode:p,doc:c}=i.pop();switch(standalone_G(c)){case U:{let F=o!==`
`?standalone_ne(!1,c,`
`,o):c;s.push(F),i.length>0&&(u+=standalone_Oe(F));break}case standalone_W:for(let F=c.length-1;F>=0;F--)i.push({ind:f,mode:p,doc:c[F]});break;case z:if(l>=2)throw new Error("There are too many 'cursor' in doc.");s.push(standalone_Te),l++;break;case standalone_L:i.push({ind:zu(f,t),mode:p,doc:c.contents});break;case P:i.push({ind:Gu(f,c.n,t),mode:p,doc:c.contents});break;case I:u-=Ot(s);break;case standalone_x:switch(p){case standalone_J:if(!a){i.push({ind:f,mode:c.break?standalone_H:standalone_J,doc:c.contents});break}case standalone_H:{a=!1;let F={ind:f,mode:standalone_J,doc:c.contents},m=n-u,E=D.length>0;if(!c.break&&et(F,i,m,E,r))i.push(F);else if(c.expandedStates){let A=standalone_y(!1,c.expandedStates,-1);if(c.break){i.push({ind:f,mode:standalone_H,doc:A});break}else for(let w=1;w<c.expandedStates.length+1;w++)if(w>=c.expandedStates.length){i.push({ind:f,mode:standalone_H,doc:A});break}else{let h=c.expandedStates[w],C={ind:f,mode:standalone_J,doc:h};if(et(C,i,m,E,r)){i.push(C);break}}}else i.push({ind:f,mode:standalone_H,doc:c.contents});break}}c.id&&(r[c.id]=standalone_y(!1,i,-1).mode);break;case S:{let F=n-u,{parts:m}=c;if(m.length===0)break;let[E,A]=m,w={ind:f,mode:standalone_J,doc:E},h={ind:f,mode:standalone_H,doc:E},C=et(w,[],F,D.length>0,r,!0);if(m.length===1){C?i.push(w):i.push(h);break}let k={ind:f,mode:standalone_J,doc:A},v={ind:f,mode:standalone_H,doc:A};if(m.length===2){C?i.push(k,w):i.push(v,h);break}m.splice(0,2);let $={ind:f,mode:p,doc:Ge(m)},ye=m[0];et({ind:f,mode:standalone_J,doc:[E,A,ye]},[],F,D.length>0,r,!0)?i.push($,k,w):C?i.push($,v,w):i.push($,v,h);break}case _:case R:{let F=c.groupId?r[c.groupId]:p;if(F===standalone_H){let m=c.type===_?c.breakContents:c.negate?c.contents:standalone_De(c.contents);m&&i.push({ind:f,mode:p,doc:m})}if(F===standalone_J){let m=c.type===_?c.flatContents:c.negate?standalone_De(c.contents):c.contents;m&&i.push({ind:f,mode:p,doc:m})}break}case standalone_Y:D.push({ind:f,mode:p,doc:c.contents});break;case j:D.length>0&&i.push({ind:f,mode:p,doc:standalone_e});break;case B:switch(p){case standalone_J:if(c.hard)a=!0;else{c.soft||(s.push(" "),u+=1);break}case standalone_H:if(D.length>0){i.push({ind:f,mode:p,doc:c},...D.reverse()),D.length=0;break}c.literal?f.root?(s.push(o,f.root.value),u=f.root.length):(s.push(o),u=0):(u-=Ot(s),s.push(o+f.value),u=f.length);break}break;case standalone_N:i.push({ind:f,mode:p,doc:c.contents});break;case b:break;default:throw new Q(c)}i.length===0&&D.length>0&&(i.push(...D.reverse()),D.length=0)}let d=s.indexOf(standalone_Te);if(d!==-1){let f=s.indexOf(standalone_Te,d+1),p=s.slice(0,d).join(""),c=s.slice(d+1,f).join(""),F=s.slice(f+1).join("");return{formatted:p+c+F,cursorNodeStart:p.length,cursorNodeText:c}}return{formatted:s.join("")}}function standalone_Ku(e,t,r=0){let n=0;for(let o=r;o<e.length;++o)e[o]==="	"?n=n+t-n%t:n++;return n}var me=standalone_Ku;var standalone_te,Nt,tt,St=class{constructor(t){Dr(this,standalone_te);this.stack=[t]}get key(){let{stack:t,siblings:r}=this;return standalone_y(!1,t,r===null?-2:-4)??null}get index(){return this.siblings===null?null:standalone_y(!1,this.stack,-2)}get node(){return standalone_y(!1,this.stack,-1)}get parent(){return this.getNode(1)}get grandparent(){return this.getNode(2)}get isInArray(){return this.siblings!==null}get siblings(){let{stack:t}=this,r=standalone_y(!1,t,-3);return Array.isArray(r)?r:null}get next(){let{siblings:t}=this;return t===null?null:t[this.index+1]}get previous(){let{siblings:t}=this;return t===null?null:t[this.index-1]}get isFirst(){return this.index===0}get isLast(){let{siblings:t,index:r}=this;return t!==null&&r===t.length-1}get isRoot(){return this.stack.length===1}get root(){return this.stack[0]}get ancestors(){return[...pe(this,standalone_te,tt).call(this)]}getName(){let{stack:t}=this,{length:r}=t;return r>1?standalone_y(!1,t,-2):null}getValue(){return standalone_y(!1,this.stack,-1)}getNode(t=0){let r=pe(this,standalone_te,Nt).call(this,t);return r===-1?null:this.stack[r]}getParentNode(t=0){return this.getNode(t+1)}call(t,...r){let{stack:n}=this,{length:o}=n,u=standalone_y(!1,n,-1);for(let i of r)u=u[i],n.push(i,u);try{return t(this)}finally{n.length=o}}callParent(t,r=0){let n=pe(this,standalone_te,Nt).call(this,r+1),o=this.stack.splice(n+1);try{return t(this)}finally{this.stack.push(...o)}}each(t,...r){let{stack:n}=this,{length:o}=n,u=standalone_y(!1,n,-1);for(let i of r)u=u[i],n.push(i,u);try{for(let i=0;i<u.length;++i)n.push(i,u[i]),t(this,i,u),n.length-=2}finally{n.length=o}}map(t,...r){let n=[];return this.each((o,u,i)=>{n[u]=t(o,u,i)},...r),n}match(...t){let r=this.stack.length-1,n=null,o=this.stack[r--];for(let u of t){if(o===void 0)return!1;let i=null;if(typeof n=="number"&&(i=n,n=this.stack[r--],o=this.stack[r--]),u&&!u(o,n,i))return!1;n=this.stack[r--],o=this.stack[r--]}return!0}findAncestor(t){for(let r of pe(this,standalone_te,tt).call(this))if(t(r))return r}hasAncestor(t){for(let r of pe(this,standalone_te,tt).call(this))if(t(r))return!0;return!1}};standalone_te=new WeakSet,Nt=function(t){let{stack:r}=this;for(let n=r.length-1;n>=0;n-=2)if(!Array.isArray(r[n])&&--t<0)return n;return-1},tt=function*(){let{stack:t}=this;for(let r=t.length-3;r>=0;r-=2){let n=t[r];Array.isArray(n)||(yield n)}};var Mr=St;var $r=new Proxy(()=>{},{get:()=>$r}),ke=$r;function qu(e){return e!==null&&typeof e=="object"}var Vr=qu;function*Tt(e,t){let{getVisitorKeys:r,filter:n=()=>!0}=t,o=u=>Vr(u)&&n(u);for(let u of r(e)){let i=e[u];if(Array.isArray(i))for(let s of i)o(s)&&(yield s);else o(i)&&(yield i)}}function*Ur(e,t){let r=[e];for(let n=0;n<r.length;n++){let o=r[n];for(let u of Tt(o,t))yield u,r.push(u)}}function standalone_Ee(e){return(t,r,n)=>{let o=!!(n!=null&&n.backwards);if(r===!1)return!1;let{length:u}=t,i=r;for(;i>=0&&i<u;){let s=t.charAt(i);if(e instanceof RegExp){if(!e.test(s))return i}else if(!e.includes(s))return i;o?i--:i++}return i===-1||i===u?i:!1}}var zr=standalone_Ee(/\s/u),T=standalone_Ee(" 	"),rt=standalone_Ee(",; 	"),nt=standalone_Ee(/[^\n\r]/u);function Ju(e,t,r){let n=!!(r!=null&&r.backwards);if(t===!1)return!1;let o=e.charAt(t);if(n){if(e.charAt(t-1)==="\r"&&o===`
`)return t-2;if(o===`
`||o==="\r"||o==="\u2028"||o==="\u2029")return t-1}else{if(o==="\r"&&e.charAt(t+1)===`
`)return t+2;if(o===`
`||o==="\r"||o==="\u2028"||o==="\u2029")return t+1}return t}var standalone_M=Ju;function Xu(e,t,r={}){let n=T(e,r.backwards?t-1:t,r),o=standalone_M(e,n,r);return n!==o}var standalone_V=Xu;function standalone_Zu(e){return Array.isArray(e)&&e.length>0}var kt=standalone_Zu;var Gr=new Set(["tokens","comments","parent","enclosingNode","precedingNode","followingNode"]),Qu=e=>Object.keys(e).filter(t=>!Gr.has(t));function eo(e){return e?t=>e(t,Gr):Qu}var standalone_X=eo;function to(e){let t=e.type||e.kind||"(unknown type)",r=String(e.name||e.id&&(typeof e.id=="object"?e.id.name:e.id)||e.key&&(typeof e.key=="object"?e.key.name:e.key)||e.value&&(typeof e.value=="object"?"":String(e.value))||e.operator||"");return r.length>20&&(r=r.slice(0,19)+"\u2026"),t+(r?" "+r:"")}function Lt(e,t){(e.comments??(e.comments=[])).push(t),t.printed=!1,t.nodeDescription=to(e)}function standalone_ue(e,t){t.leading=!0,t.trailing=!1,Lt(e,t)}function standalone_re(e,t,r){t.leading=!1,t.trailing=!1,r&&(t.marker=r),Lt(e,t)}function standalone_oe(e,t){t.leading=!1,t.trailing=!0,Lt(e,t)}var Pt=new WeakMap;function ut(e,t){if(Pt.has(e))return Pt.get(e);let{printer:{getCommentChildNodes:r,canAttachComment:n,getVisitorKeys:o},locStart:u,locEnd:i}=t;if(!n)return[];let s=((r==null?void 0:r(e,t))??[...Tt(e,{getVisitorKeys:standalone_X(o)})]).flatMap(a=>n(a)?[a]:ut(a,t));return s.sort((a,D)=>u(a)-u(D)||i(a)-i(D)),Pt.set(e,s),s}function standalone_qr(e,t,r,n){let{locStart:o,locEnd:u}=r,i=o(t),s=u(t),a=ut(e,r),D,l,d=0,f=a.length;for(;d<f;){let p=d+f>>1,c=a[p],F=o(c),m=u(c);if(F<=i&&s<=m)return standalone_qr(c,t,r,c);if(m<=i){D=c,d=p+1;continue}if(s<=F){l=c,f=p;continue}throw new Error("Comment location overlaps with node location")}if((n==null?void 0:n.type)==="TemplateLiteral"){let{quasis:p}=n,c=standalone_Rt(p,t,r);D&&standalone_Rt(p,D,r)!==c&&(D=null),l&&standalone_Rt(p,l,r)!==c&&(l=null)}return{enclosingNode:n,precedingNode:D,followingNode:l}}var It=()=>!1;function Jr(e,t){let{comments:r}=e;if(delete e.comments,!kt(r)||!t.printer.canAttachComment)return;let n=[],{locStart:o,locEnd:u,printer:{experimentalFeatures:{avoidAstMutation:i=!1}={},handleComments:s={}},originalText:a}=t,{ownLine:D=It,endOfLine:l=It,remaining:d=It}=s,f=r.map((p,c)=>({...standalone_qr(e,p,t),comment:p,text:a,options:t,ast:e,isLastComment:r.length-1===c}));for(let[p,c]of f.entries()){let{comment:F,precedingNode:m,enclosingNode:E,followingNode:A,text:w,options:h,ast:C,isLastComment:k}=c;if(h.parser==="json"||h.parser==="json5"||h.parser==="jsonc"||h.parser==="__js_expression"||h.parser==="__ts_expression"||h.parser==="__vue_expression"||h.parser==="__vue_ts_expression"){if(o(F)-o(C)<=0){standalone_ue(C,F);continue}if(u(F)-u(C)>=0){standalone_oe(C,F);continue}}let v;if(i?v=[c]:(F.enclosingNode=E,F.precedingNode=m,F.followingNode=A,v=[F,w,h,C,k]),ro(w,h,f,p))F.placement="ownLine",D(...v)||(A?standalone_ue(A,F):m?standalone_oe(m,F):E?standalone_re(E,F):standalone_re(C,F));else if(no(w,h,f,p))F.placement="endOfLine",l(...v)||(m?standalone_oe(m,F):A?standalone_ue(A,F):E?standalone_re(E,F):standalone_re(C,F));else if(F.placement="remaining",!d(...v))if(m&&A){let $=n.length;$>0&&n[$-1].followingNode!==A&&standalone_Kr(n,h),n.push(c)}else m?standalone_oe(m,F):A?standalone_ue(A,F):E?standalone_re(E,F):standalone_re(C,F)}if(standalone_Kr(n,t),!i)for(let p of r)delete p.precedingNode,delete p.enclosingNode,delete p.followingNode}var Xr=e=>!/[\S\n\u2028\u2029]/u.test(e);function ro(e,t,r,n){let{comment:o,precedingNode:u}=r[n],{locStart:i,locEnd:s}=t,a=i(o);if(u)for(let D=n-1;D>=0;D--){let{comment:l,precedingNode:d}=r[D];if(d!==u||!Xr(e.slice(s(l),a)))break;a=i(l)}return standalone_V(e,a,{backwards:!0})}function no(e,t,r,n){let{comment:o,followingNode:u}=r[n],{locStart:i,locEnd:s}=t,a=s(o);if(u)for(let D=n+1;D<r.length;D++){let{comment:l,followingNode:d}=r[D];if(d!==u||!Xr(e.slice(a,i(l))))break;a=s(l)}return standalone_V(e,a)}function standalone_Kr(e,t){var s,a;let r=e.length;if(r===0)return;let{precedingNode:n,followingNode:o}=e[0],u=t.locStart(o),i;for(i=r;i>0;--i){let{comment:D,precedingNode:l,followingNode:d}=e[i-1];ke.strictEqual(l,n),ke.strictEqual(d,o);let f=t.originalText.slice(t.locEnd(D),u);if(((a=(s=t.printer).isGap)==null?void 0:a.call(s,f,t))??/^[\s(]*$/u.test(f))u=t.locStart(D);else break}for(let[D,{comment:l}]of e.entries())D<i?standalone_oe(n,l):standalone_ue(o,l);for(let D of[n,o])D.comments&&D.comments.length>1&&D.comments.sort((l,d)=>t.locStart(l)-t.locStart(d));e.length=0}function standalone_Rt(e,t,r){let n=r.locStart(t)-1;for(let o=1;o<e.length;++o)if(n<r.locStart(e[o]))return o-1;return 0}function uo(e,t){let r=t-1;r=T(e,r,{backwards:!0}),r=standalone_M(e,r,{backwards:!0}),r=T(e,r,{backwards:!0});let n=standalone_M(e,r,{backwards:!0});return r!==n}var standalone_Le=uo;function Zr(e,t){let r=e.node;return r.printed=!0,t.printer.printComment(e,t)}function standalone_oo(e,t){var l;let r=e.node,n=[Zr(e,t)],{printer:o,originalText:u,locStart:i,locEnd:s}=t;if((l=o.isBlockComment)==null?void 0:l.call(o,r)){let d=standalone_V(u,s(r))?standalone_V(u,i(r),{backwards:!0})?q:Ke:" ";n.push(d)}else n.push(q);let D=standalone_M(u,T(u,s(r)));return D!==!1&&standalone_V(u,D)&&n.push(q),n}function standalone_io(e,t,r){var D;let n=e.node,o=Zr(e,t),{printer:u,originalText:i,locStart:s}=t,a=(D=u.isBlockComment)==null?void 0:D.call(u,n);if(r!=null&&r.hasLineSuffix&&!(r!=null&&r.isBlock)||standalone_V(i,s(n),{backwards:!0})){let l=standalone_Le(i,s(n));return{doc:xe([q,l?q:"",o]),isBlock:a,hasLineSuffix:!0}}return!a||r!=null&&r.hasLineSuffix?{doc:[xe([" ",o]),de],isBlock:a,hasLineSuffix:!0}:{doc:[" ",o],isBlock:a,hasLineSuffix:!1}}function so(e,t){let r=e.node;if(!r)return{};let n=t[Symbol.for("printedComments")];if((r.comments||[]).filter(a=>!n.has(a)).length===0)return{leading:"",trailing:""};let u=[],i=[],s;return e.each(()=>{let a=e.node;if(n!=null&&n.has(a))return;let{leading:D,trailing:l}=a;D?u.push(standalone_oo(e,t)):l&&(s=standalone_io(e,t,s),i.push(s.doc))},"comments"),{leading:u,trailing:i}}function Qr(e,t,r){let{leading:n,trailing:o}=so(e,r);return!n&&!o?t:Qe(t,u=>[n,u,o])}function en(e){let{[Symbol.for("comments")]:t,[Symbol.for("printedComments")]:r}=e;for(let n of t){if(!n.printed&&!r.has(n))throw new Error('Comment "'+n.value.trim()+'" was not printed. Please report this error!');delete n.printed}}function ao(e){return()=>{}}var standalone_tn=ao;var standalone_Pe=class extends Error{name="ConfigError"},standalone_Ie=class extends Error{name="UndefinedParserError"};var rn={cursorOffset:{category:"Special",type:"int",default:-1,range:{start:-1,end:1/0,step:1},description:"Print (to stderr) where a cursor at the given position would move to after formatting.",cliCategory:"Editor"},endOfLine:{category:"Global",type:"choice",default:"lf",description:"Which end of line characters to apply.",choices:[{value:"lf",description:"Line Feed only (\\n), common on Linux and macOS as well as inside git repos"},{value:"crlf",description:"Carriage Return + Line Feed characters (\\r\\n), common on Windows"},{value:"cr",description:"Carriage Return character only (\\r), used very rarely"},{value:"auto",description:`Maintain existing
(mixed values within one file are normalised by looking at what's used after the first line)`}]},filepath:{category:"Special",type:"path",description:"Specify the input filepath. This will be used to do parser inference.",cliName:"stdin-filepath",cliCategory:"Other",cliDescription:"Path to the file to pretend that stdin comes from."},insertPragma:{category:"Special",type:"boolean",default:!1,description:"Insert @format pragma into file's first docblock comment.",cliCategory:"Other"},parser:{category:"Global",type:"choice",default:void 0,description:"Which parser to use.",exception:e=>typeof e=="string"||typeof e=="function",choices:[{value:"flow",description:"Flow"},{value:"babel",description:"JavaScript"},{value:"babel-flow",description:"Flow"},{value:"babel-ts",description:"TypeScript"},{value:"typescript",description:"TypeScript"},{value:"acorn",description:"JavaScript"},{value:"espree",description:"JavaScript"},{value:"meriyah",description:"JavaScript"},{value:"css",description:"CSS"},{value:"less",description:"Less"},{value:"scss",description:"SCSS"},{value:"json",description:"JSON"},{value:"json5",description:"JSON5"},{value:"jsonc",description:"JSON with Comments"},{value:"json-stringify",description:"JSON.stringify"},{value:"graphql",description:"GraphQL"},{value:"markdown",description:"Markdown"},{value:"mdx",description:"MDX"},{value:"vue",description:"Vue"},{value:"yaml",description:"YAML"},{value:"glimmer",description:"Ember / Handlebars"},{value:"html",description:"HTML"},{value:"angular",description:"Angular"},{value:"lwc",description:"Lightning Web Components"}]},plugins:{type:"path",array:!0,default:[{value:[]}],category:"Global",description:"Add a plugin. Multiple plugins can be passed as separate `--plugin`s.",exception:e=>typeof e=="string"||typeof e=="object",cliName:"plugin",cliCategory:"Config"},printWidth:{category:"Global",type:"int",default:80,description:"The line length where Prettier will try wrap.",range:{start:0,end:1/0,step:1}},rangeEnd:{category:"Special",type:"int",default:1/0,range:{start:0,end:1/0,step:1},description:`Format code ending at a given character offset (exclusive).
The range will extend forwards to the end of the selected statement.`,cliCategory:"Editor"},rangeStart:{category:"Special",type:"int",default:0,range:{start:0,end:1/0,step:1},description:`Format code starting at a given character offset.
The range will extend backwards to the start of the first line containing the selected statement.`,cliCategory:"Editor"},requirePragma:{category:"Special",type:"boolean",default:!1,description:`Require either '@prettier' or '@format' to be present in the file's first docblock comment
in order for it to be formatted.`,cliCategory:"Other"},tabWidth:{type:"int",category:"Global",default:2,description:"Number of spaces per indentation level.",range:{start:0,end:1/0,step:1}},useTabs:{category:"Global",type:"boolean",default:!1,description:"Indent with tabs instead of spaces."},embeddedLanguageFormatting:{category:"Global",type:"choice",default:"auto",description:"Control how Prettier formats quoted code embedded in the file.",choices:[{value:"auto",description:"Format embedded code if Prettier can automatically identify it."},{value:"off",description:"Never automatically format embedded code."}]}};function ot({plugins:e=[],showDeprecated:t=!1}={}){let r=e.flatMap(o=>o.languages??[]),n=[];for(let o of standalone_lo(Object.assign({},...e.map(({options:u})=>u),rn)))!t&&o.deprecated||(Array.isArray(o.choices)&&(t||(o.choices=o.choices.filter(u=>!u.deprecated)),o.name==="parser"&&(o.choices=[...o.choices,...standalone_Do(o.choices,r,e)])),o.pluginDefaults=Object.fromEntries(e.filter(u=>{var i;return((i=u.defaultOptions)==null?void 0:i[o.name])!==void 0}).map(u=>[u.name,u.defaultOptions[o.name]])),n.push(o));return{languages:r,options:n}}function*standalone_Do(e,t,r){let n=new Set(e.map(o=>o.value));for(let o of t)if(o.parsers){for(let u of o.parsers)if(!n.has(u)){n.add(u);let i=r.find(a=>a.parsers&&Object.prototype.hasOwnProperty.call(a.parsers,u)),s=o.name;i!=null&&i.name&&(s+=` (plugin: ${i.name})`),yield{value:u,description:s}}}}function standalone_lo(e){let t=[];for(let[r,n]of Object.entries(e)){let o={name:r,...n};Array.isArray(o.default)&&(o.default=standalone_y(!1,o.default,-1).value),t.push(o)}return t}var co=e=>String(e).split(/[/\\]/u).pop();function nn(e,t){if(!t)return;let r=co(t).toLowerCase();return e.find(({filenames:n})=>n==null?void 0:n.some(o=>o.toLowerCase()===r))??e.find(({extensions:n})=>n==null?void 0:n.some(o=>r.endsWith(o)))}function fo(e,t){if(t)return e.find(({name:r})=>r.toLowerCase()===t)??e.find(({aliases:r})=>r==null?void 0:r.includes(t))??e.find(({extensions:r})=>r==null?void 0:r.includes(`.${t}`))}function po(e,t){let r=e.plugins.flatMap(o=>o.languages??[]),n=fo(r,t.language)??nn(r,t.physicalFile)??nn(r,t.file)??(t.physicalFile,void 0);return n==null?void 0:n.parsers[0]}var un=po;var ie={key:e=>/^[$_a-zA-Z][$_a-zA-Z0-9]*$/.test(e)?e:JSON.stringify(e),value(e){if(e===null||typeof e!="object")return JSON.stringify(e);if(Array.isArray(e))return`[${e.map(r=>ie.value(r)).join(", ")}]`;let t=Object.keys(e);return t.length===0?"{}":`{ ${t.map(r=>`${ie.key(r)}: ${ie.value(e[r])}`).join(", ")} }`},pair:({key:e,value:t})=>ie.value({[e]:t})};var Yt=standalone_Me(it(),1),an=(e,t,{descriptor:r})=>{let n=[`${Yt.default.yellow(typeof e=="string"?r.key(e):r.pair(e))} is deprecated`];return t&&n.push(`we now treat it as ${Yt.default.blue(typeof t=="string"?r.key(t):r.pair(t))}`),n.join("; ")+"."};var standalone_le=standalone_Me(it(),1);var st=Symbol.for("vnopts.VALUE_NOT_EXIST"),he=Symbol.for("vnopts.VALUE_UNCHANGED");var Dn=" ".repeat(2),cn=(e,t,r)=>{let{text:n,list:o}=r.normalizeExpectedResult(r.schemas[e].expected(r)),u=[];return n&&u.push(ln(e,t,n,r.descriptor)),o&&u.push([ln(e,t,o.title,r.descriptor)].concat(o.values.map(i=>fn(i,r.loggerPrintWidth))).join(`
`)),pn(u,r.loggerPrintWidth)};function ln(e,t,r,n){return[`Invalid ${standalone_le.default.red(n.key(e))} value.`,`Expected ${standalone_le.default.blue(r)},`,`but received ${t===st?standalone_le.default.gray("nothing"):standalone_le.default.red(n.value(t))}.`].join(" ")}function fn({text:e,list:t},r){let n=[];return e&&n.push(`- ${standalone_le.default.blue(e)}`),t&&n.push([`- ${standalone_le.default.blue(t.title)}:`].concat(t.values.map(o=>fn(o,r-Dn.length).replace(/^|\n/g,`$&${Dn}`))).join(`
`)),pn(n,r)}function pn(e,t){if(e.length===1)return e[0];let[r,n]=e,[o,u]=e.map(i=>i.split(`
`,1)[0].length);return o>t&&o>u?n:r}var Wt=standalone_Me(it(),1);var jt=[],standalone_dn=[];function Ht(e,t){if(e===t)return 0;let r=e;e.length>t.length&&(e=t,t=r);let n=e.length,o=t.length;for(;n>0&&e.charCodeAt(~-n)===t.charCodeAt(~-o);)n--,o--;let u=0;for(;u<n&&e.charCodeAt(u)===t.charCodeAt(u);)u++;if(n-=u,o-=u,n===0)return o;let i,s,a,D,l=0,d=0;for(;l<n;)standalone_dn[l]=e.charCodeAt(u+l),jt[l]=++l;for(;d<o;)for(i=t.charCodeAt(u+d),a=d++,s=d,l=0;l<n;l++)D=i===standalone_dn[l]?a:a+1,a=jt[l],s=jt[l]=a>s?D>s?s+1:D:D>a?a+1:D;return s}var at=(e,t,{descriptor:r,logger:n,schemas:o})=>{let u=[`Ignored unknown option ${Wt.default.yellow(r.pair({key:e,value:t}))}.`],i=Object.keys(o).sort().find(s=>Ht(e,s)<3);i&&u.push(`Did you mean ${Wt.default.blue(r.key(i))}?`),n.warn(u.join(" "))};var standalone_Fo=["default","expected","validate","deprecated","forward","redirect","overlap","preprocess","postprocess"];function mo(e,t){let r=new e(t),n=Object.create(r);for(let o of standalone_Fo)o in t&&(n[o]=Eo(t[o],r,O.prototype[o].length));return n}var O=class{static create(t){return mo(this,t)}constructor(t){this.name=t.name}default(t){}expected(t){return"nothing"}validate(t,r){return!1}deprecated(t,r){return!1}forward(t,r){}redirect(t,r){}overlap(t,r,n){return t}preprocess(t,r){return t}postprocess(t,r){return he}};function Eo(e,t,r){return typeof e=="function"?(...n)=>e(...n.slice(0,r-1),t,...n.slice(r-1)):()=>e}var standalone_Dt=class extends O{constructor(t){super(t),this._sourceName=t.sourceName}expected(t){return t.schemas[this._sourceName].expected(t)}validate(t,r){return r.schemas[this._sourceName].validate(t,r)}redirect(t,r){return this._sourceName}};var lt=class extends O{expected(){return"anything"}validate(){return!0}};var ct=class extends O{constructor({valueSchema:t,name:r=t.name,...n}){super({...n,name:r}),this._valueSchema=t}expected(t){let{text:r,list:n}=t.normalizeExpectedResult(this._valueSchema.expected(t));return{text:r&&`an array of ${r}`,list:n&&{title:"an array of the following values",values:[{list:n}]}}}validate(t,r){if(!Array.isArray(t))return!1;let n=[];for(let o of t){let u=r.normalizeValidateResult(this._valueSchema.validate(o,r),o);u!==!0&&n.push(u.value)}return n.length===0?!0:{value:n}}deprecated(t,r){let n=[];for(let o of t){let u=r.normalizeDeprecatedResult(this._valueSchema.deprecated(o,r),o);u!==!1&&n.push(...u.map(({value:i})=>({value:[i]})))}return n}forward(t,r){let n=[];for(let o of t){let u=r.normalizeForwardResult(this._valueSchema.forward(o,r),o);n.push(...u.map(Fn))}return n}redirect(t,r){let n=[],o=[];for(let u of t){let i=r.normalizeRedirectResult(this._valueSchema.redirect(u,r),u);"remain"in i&&n.push(i.remain),o.push(...i.redirect.map(Fn))}return n.length===0?{redirect:o}:{redirect:o,remain:n}}overlap(t,r){return t.concat(r)}};function Fn({from:e,to:t}){return{from:[e],to:t}}var standalone_ft=class extends O{expected(){return"true or false"}validate(t){return typeof t=="boolean"}};function En(e,t){let r=Object.create(null);for(let n of e){let o=n[t];if(r[o])throw new Error(`Duplicate ${t} ${JSON.stringify(o)}`);r[o]=n}return r}function hn(e,t){let r=new Map;for(let n of e){let o=n[t];if(r.has(o))throw new Error(`Duplicate ${t} ${JSON.stringify(o)}`);r.set(o,n)}return r}function Cn(){let e=Object.create(null);return t=>{let r=JSON.stringify(t);return e[r]?!0:(e[r]=!0,!1)}}function gn(e,t){let r=[],n=[];for(let o of e)t(o)?r.push(o):n.push(o);return[r,n]}function standalone_yn(e){return e===Math.floor(e)}function An(e,t){if(e===t)return 0;let r=typeof e,n=typeof t,o=["undefined","object","boolean","number","string"];return r!==n?o.indexOf(r)-o.indexOf(n):r!=="string"?Number(e)-Number(t):e.localeCompare(t)}function Bn(e){return(...t)=>{let r=e(...t);return typeof r=="string"?new Error(r):r}}function standalone_Mt(e){return e===void 0?{}:e}function standalone_$t(e){if(typeof e=="string")return{text:e};let{text:t,list:r}=e;return ho((t||r)!==void 0,"Unexpected `expected` result, there should be at least one field."),r?{text:t,list:{title:r.title,values:r.values.map(standalone_$t)}}:{text:t}}function Vt(e,t){return e===!0?!0:e===!1?{value:t}:e}function Ut(e,t,r=!1){return e===!1?!1:e===!0?r?!0:[{value:t}]:"value"in e?[e]:e.length===0?!1:e}function mn(e,t){return typeof e=="string"||"key"in e?{from:t,to:e}:"from"in e?{from:e.from,to:e.to}:{from:t,to:e.to}}function standalone_pt(e,t){return e===void 0?[]:Array.isArray(e)?e.map(r=>mn(r,t)):[mn(e,t)]}function zt(e,t){let r=standalone_pt(typeof e=="object"&&"redirect"in e?e.redirect:e,t);return r.length===0?{remain:t,redirect:r}:typeof e=="object"&&"remain"in e?{remain:e.remain,redirect:r}:{redirect:r}}function ho(e,t){if(!e)throw new Error(t)}var standalone_dt=class extends O{constructor(t){super(t),this._choices=hn(t.choices.map(r=>r&&typeof r=="object"?r:{value:r}),"value")}expected({descriptor:t}){let r=Array.from(this._choices.keys()).map(i=>this._choices.get(i)).filter(({hidden:i})=>!i).map(i=>i.value).sort(An).map(t.value),n=r.slice(0,-2),o=r.slice(-2);return{text:n.concat(o.join(" or ")).join(", "),list:{title:"one of the following values",values:r}}}validate(t){return this._choices.has(t)}deprecated(t){let r=this._choices.get(t);return r&&r.deprecated?{value:t}:!1}forward(t){let r=this._choices.get(t);return r?r.forward:void 0}redirect(t){let r=this._choices.get(t);return r?r.redirect:void 0}};var standalone_Ft=class extends O{expected(){return"a number"}validate(t,r){return typeof t=="number"}};var standalone_mt=class extends standalone_Ft{expected(){return"an integer"}validate(t,r){return r.normalizeValidateResult(super.validate(t,r),t)===!0&&standalone_yn(t)}};var standalone_Re=class extends O{expected(){return"a string"}validate(t){return typeof t=="string"}};var wn=ie,xn=at,_n=cn,vn=an;var standalone_Et=class{constructor(t,r){let{logger:n=console,loggerPrintWidth:o=80,descriptor:u=wn,unknown:i=xn,invalid:s=_n,deprecated:a=vn,missing:D=()=>!1,required:l=()=>!1,preprocess:d=p=>p,postprocess:f=()=>he}=r||{};this._utils={descriptor:u,logger:n||{warn:()=>{}},loggerPrintWidth:o,schemas:En(t,"name"),normalizeDefaultResult:standalone_Mt,normalizeExpectedResult:standalone_$t,normalizeDeprecatedResult:Ut,normalizeForwardResult:standalone_pt,normalizeRedirectResult:zt,normalizeValidateResult:Vt},this._unknownHandler=i,this._invalidHandler=Bn(s),this._deprecatedHandler=a,this._identifyMissing=(p,c)=>!(p in c)||D(p,c),this._identifyRequired=l,this._preprocess=d,this._postprocess=f,this.cleanHistory()}cleanHistory(){this._hasDeprecationWarned=Cn()}normalize(t){let r={},o=[this._preprocess(t,this._utils)],u=()=>{for(;o.length!==0;){let i=o.shift(),s=this._applyNormalization(i,r);o.push(...s)}};u();for(let i of Object.keys(this._utils.schemas)){let s=this._utils.schemas[i];if(!(i in r)){let a=standalone_Mt(s.default(this._utils));"value"in a&&o.push({[i]:a.value})}}u();for(let i of Object.keys(this._utils.schemas)){if(!(i in r))continue;let s=this._utils.schemas[i],a=r[i],D=s.postprocess(a,this._utils);D!==he&&(this._applyValidation(D,i,s),r[i]=D)}return this._applyPostprocess(r),this._applyRequiredCheck(r),r}_applyNormalization(t,r){let n=[],{knownKeys:o,unknownKeys:u}=this._partitionOptionKeys(t);for(let i of o){let s=this._utils.schemas[i],a=s.preprocess(t[i],this._utils);this._applyValidation(a,i,s);let D=({from:p,to:c})=>{n.push(typeof c=="string"?{[c]:p}:{[c.key]:c.value})},l=({value:p,redirectTo:c})=>{let F=Ut(s.deprecated(p,this._utils),a,!0);if(F!==!1)if(F===!0)this._hasDeprecationWarned(i)||this._utils.logger.warn(this._deprecatedHandler(i,c,this._utils));else for(let{value:m}of F){let E={key:i,value:m};if(!this._hasDeprecationWarned(E)){let A=typeof c=="string"?{key:c,value:m}:c;this._utils.logger.warn(this._deprecatedHandler(E,A,this._utils))}}};standalone_pt(s.forward(a,this._utils),a).forEach(D);let f=zt(s.redirect(a,this._utils),a);if(f.redirect.forEach(D),"remain"in f){let p=f.remain;r[i]=i in r?s.overlap(r[i],p,this._utils):p,l({value:p})}for(let{from:p,to:c}of f.redirect)l({value:p,redirectTo:c})}for(let i of u){let s=t[i];this._applyUnknownHandler(i,s,r,(a,D)=>{n.push({[a]:D})})}return n}_applyRequiredCheck(t){for(let r of Object.keys(this._utils.schemas))if(this._identifyMissing(r,t)&&this._identifyRequired(r))throw this._invalidHandler(r,st,this._utils)}_partitionOptionKeys(t){let[r,n]=gn(Object.keys(t).filter(o=>!this._identifyMissing(o,t)),o=>o in this._utils.schemas);return{knownKeys:r,unknownKeys:n}}_applyValidation(t,r,n){let o=Vt(n.validate(t,this._utils),t);if(o!==!0)throw this._invalidHandler(r,o.value,this._utils)}_applyUnknownHandler(t,r,n,o){let u=this._unknownHandler(t,r,this._utils);if(u)for(let i of Object.keys(u)){if(this._identifyMissing(i,u))continue;let s=u[i];i in this._utils.schemas?o(i,s):n[i]=s}}_applyPostprocess(t){let r=this._postprocess(t,this._utils);if(r!==he){if(r.delete)for(let n of r.delete)delete t[n];if(r.override){let{knownKeys:n,unknownKeys:o}=this._partitionOptionKeys(r.override);for(let u of n){let i=r.override[u];this._applyValidation(i,u,this._utils.schemas[u]),t[u]=i}for(let u of o){let i=r.override[u];this._applyUnknownHandler(u,i,t,(s,a)=>{let D=this._utils.schemas[s];this._applyValidation(a,s,D),t[s]=a})}}}}};var Gt;function go(e,t,{logger:r=!1,isCLI:n=!1,passThrough:o=!1,FlagSchema:u,descriptor:i}={}){if(n){if(!u)throw new Error("'FlagSchema' option is required.");if(!i)throw new Error("'descriptor' option is required.")}else i=ie;let s=o?Array.isArray(o)?(f,p)=>o.includes(f)?{[f]:p}:void 0:(f,p)=>({[f]:p}):(f,p,c)=>{let{_:F,...m}=c.schemas;return at(f,p,{...c,schemas:m})},a=standalone_yo(t,{isCLI:n,FlagSchema:u}),D=new standalone_Et(a,{logger:r,unknown:s,descriptor:i}),l=r!==!1;l&&Gt&&(D._hasDeprecationWarned=Gt);let d=D.normalize(e);return l&&(Gt=D._hasDeprecationWarned),d}function standalone_yo(e,{isCLI:t,FlagSchema:r}){let n=[];t&&n.push(lt.create({name:"_"}));for(let o of e)n.push(Ao(o,{isCLI:t,optionInfos:e,FlagSchema:r})),o.alias&&t&&n.push(standalone_Dt.create({name:o.alias,sourceName:o.name}));return n}function Ao(e,{isCLI:t,optionInfos:r,FlagSchema:n}){let{name:o}=e,u={name:o},i,s={};switch(e.type){case"int":i=standalone_mt,t&&(u.preprocess=Number);break;case"string":i=standalone_Re;break;case"choice":i=standalone_dt,u.choices=e.choices.map(a=>a!=null&&a.redirect?{...a,redirect:{to:{key:e.name,value:a.redirect}}}:a);break;case"boolean":i=standalone_ft;break;case"flag":i=n,u.flags=r.flatMap(a=>[a.alias,a.description&&a.name,a.oppositeDescription&&`no-${a.name}`].filter(Boolean));break;case"path":i=standalone_Re;break;default:throw new Error(`Unexpected type ${e.type}`)}if(e.exception?u.validate=(a,D,l)=>e.exception(a)||D.validate(a,l):u.validate=(a,D,l)=>a===void 0||D.validate(a,l),e.redirect&&(s.redirect=a=>a?{to:typeof e.redirect=="string"?e.redirect:{key:e.redirect.option,value:e.redirect.value}}:void 0),e.deprecated&&(s.deprecated=!0),t&&!e.array){let a=u.preprocess||(D=>D);u.preprocess=(D,l,d)=>l.preprocess(a(Array.isArray(D)?standalone_y(!1,D,-1):D),d)}return e.array?ct.create({...t?{preprocess:a=>Array.isArray(a)?a:[a]}:{},...s,valueSchema:i.create(u)}):i.create({...u,...s})}var bn=go;var standalone_Bo=(e,t,r)=>{if(!(e&&t==null)){if(t.findLast)return t.findLast(r);for(let n=t.length-1;n>=0;n--){let o=t[n];if(r(o,n,t))return o}}},Kt=standalone_Bo;function qt(e,t){if(!t)throw new Error("parserName is required.");let r=Kt(!1,e,o=>o.parsers&&Object.prototype.hasOwnProperty.call(o.parsers,t));if(r)return r;let n=`Couldn't resolve parser "${t}".`;throw n+=" Plugins must be explicitly added to the standalone bundle.",new standalone_Pe(n)}function standalone_On(e,t){if(!t)throw new Error("astFormat is required.");let r=Kt(!1,e,o=>o.printers&&Object.prototype.hasOwnProperty.call(o.printers,t));if(r)return r;let n=`Couldn't find plugin for AST format "${t}".`;throw n+=" Plugins must be explicitly added to the standalone bundle.",new standalone_Pe(n)}function standalone_ht({plugins:e,parser:t}){let r=qt(e,t);return Jt(r,t)}function Jt(e,t){let r=e.parsers[t];return typeof r=="function"?r():r}function standalone_Sn(e,t){let r=e.printers[t];return typeof r=="function"?r():r}var standalone_Nn={astFormat:"estree",printer:{},originalText:void 0,locStart:null,locEnd:null};async function wo(e,t={}){var d;let r={...e};if(!r.parser)if(r.filepath){if(r.parser=un(r,{physicalFile:r.filepath}),!r.parser)throw new standalone_Ie(`No parser could be inferred for file "${r.filepath}".`)}else throw new standalone_Ie("No parser and no file path given, couldn't infer a parser.");let n=ot({plugins:e.plugins,showDeprecated:!0}).options,o={...standalone_Nn,...Object.fromEntries(n.filter(f=>f.default!==void 0).map(f=>[f.name,f.default]))},u=qt(r.plugins,r.parser),i=await Jt(u,r.parser);r.astFormat=i.astFormat,r.locEnd=i.locEnd,r.locStart=i.locStart;let s=(d=u.printers)!=null&&d[i.astFormat]?u:standalone_On(r.plugins,i.astFormat),a=await standalone_Sn(s,i.astFormat);r.printer=a;let D=s.defaultOptions?Object.fromEntries(Object.entries(s.defaultOptions).filter(([,f])=>f!==void 0)):{},l={...o,...D};for(let[f,p]of Object.entries(l))(r[f]===null||r[f]===void 0)&&(r[f]=p);return r.parser==="json"&&(r.trailingComma="none"),bn(r,n,{passThrough:Object.keys(standalone_Nn),...t})}var standalone_se=wo;var standalone_Vn=standalone_Me(standalone_$n(),1);async function ko(e,t){let r=await standalone_ht(t),n=r.preprocess?r.preprocess(e,t):e;t.originalText=n;let o;try{o=await r.parse(n,t,t)}catch(u){Lo(u,e)}return{text:n,ast:o}}function Lo(e,t){let{loc:r}=e;if(r){let n=(0,standalone_Vn.codeFrameColumns)(t,r,{highlightCode:!0});throw e.message+=`
`+n,e.codeFrame=n,e}throw e}var standalone_ce=ko;async function standalone_Un(e,t,r,n,o){let{embeddedLanguageFormatting:u,printer:{embed:i,hasPrettierIgnore:s=()=>!1,getVisitorKeys:a}}=r;if(!i||u!=="auto")return;if(i.length>2)throw new Error("printer.embed has too many parameters. The API changed in Prettier v3. Please update your plugin. See https://prettier.io/docs/en/plugins.html#optional-embed");let D=standalone_X(i.getVisitorKeys??a),l=[];p();let d=e.stack;for(let{print:c,node:F,pathStack:m}of l)try{e.stack=m;let E=await c(f,t,e,r);E&&o.set(F,E)}catch(E){if(globalThis.PRETTIER_DEBUG)throw E}e.stack=d;function f(c,F){return Po(c,F,r,n)}function p(){let{node:c}=e;if(c===null||typeof c!="object"||s(e))return;for(let m of D(c))Array.isArray(c[m])?e.each(p,m):e.call(p,m);let F=i(e,r);if(F){if(typeof F=="function"){l.push({print:F,node:c,pathStack:[...e.stack]});return}o.set(c,F)}}}async function Po(e,t,r,n){let o=await standalone_se({...r,...t,parentParser:r.parser,originalText:e},{passThrough:!0}),{ast:u}=await standalone_ce(e,o),i=await n(u,o);return standalone_Ze(i)}function Io(e,t){let{originalText:r,[Symbol.for("comments")]:n,locStart:o,locEnd:u,[Symbol.for("printedComments")]:i}=t,{node:s}=e,a=o(s),D=u(s);for(let l of n)o(l)>=a&&u(l)<=D&&i.add(l);return r.slice(a,D)}var standalone_zn=Io;async function Ye(e,t){({ast:e}=await standalone_Qt(e,t));let r=new Map,n=new Mr(e),o=standalone_tn(t),u=new Map;await standalone_Un(n,s,t,Ye,u);let i=await standalone_Gn(n,t,s,void 0,u);return en(t),i;function s(D,l){return D===void 0||D===n?a(l):Array.isArray(D)?n.call(()=>a(l),...D):n.call(()=>a(l),D)}function a(D){o(n);let l=n.node;if(l==null)return"";let d=l&&typeof l=="object"&&D===void 0;if(d&&r.has(l))return r.get(l);let f=standalone_Gn(n,t,s,D,u);return d&&r.set(l,f),f}}function standalone_Gn(e,t,r,n,o){var a;let{node:u}=e,{printer:i}=t,s;return(a=i.hasPrettierIgnore)!=null&&a.call(i,e)?s=standalone_zn(e,t):o.has(u)?s=o.get(u):s=i.print(e,t,r,n),u===t.cursorNode&&(s=Qe(s,D=>[standalone_ve,D,standalone_ve])),i.printComment&&(!i.willPrintOwnComments||!i.willPrintOwnComments(e,t))&&(s=Qr(e,s,t)),s}async function standalone_Qt(e,t){let r=e.comments??[];t[Symbol.for("comments")]=r,t[Symbol.for("tokens")]=e.tokens??[],t[Symbol.for("printedComments")]=new Set,Jr(e,t);let{printer:{preprocess:n}}=t;return e=n?await n(e,t):e,{ast:e,comments:r}}function Ro(e,t){let{cursorOffset:r,locStart:n,locEnd:o}=t,u=standalone_X(t.printer.getVisitorKeys),i=a=>n(a)<=r&&o(a)>=r,s=e;for(let a of Ur(e,{getVisitorKeys:u,filter:i}))s=a;return s}var standalone_Kn=Ro;function Yo(e,t){let{printer:{massageAstNode:r,getVisitorKeys:n}}=t;if(!r)return e;let o=standalone_X(n),u=r.ignoredProperties??new Set;return i(e);function i(s,a){if(!(s!==null&&typeof s=="object"))return s;if(Array.isArray(s))return s.map(f=>i(f,a)).filter(Boolean);let D={},l=new Set(o(s));for(let f in s)!Object.prototype.hasOwnProperty.call(s,f)||u.has(f)||(l.has(f)?D[f]=i(s[f],s):D[f]=s[f]);let d=r(s,D,a);if(d!==null)return d??D}}var qn=Yo;var jo=(e,t,r)=>{if(!(e&&t==null)){if(t.findLastIndex)return t.findLastIndex(r);for(let n=t.length-1;n>=0;n--){let o=t[n];if(r(o,n,t))return n}return-1}},standalone_Jn=jo;var Ho=({parser:e})=>e==="json"||e==="json5"||e==="jsonc"||e==="json-stringify";function Wo(e,t){let r=[e.node,...e.parentNodes],n=new Set([t.node,...t.parentNodes]);return r.find(o=>standalone_Qn.has(o.type)&&n.has(o))}function standalone_Xn(e){let t=standalone_Jn(!1,e,r=>r.type!=="Program"&&r.type!=="File");return t===-1?e:e.slice(0,t+1)}function standalone_Mo(e,t,{locStart:r,locEnd:n}){let o=e.node,u=t.node;if(o===u)return{startNode:o,endNode:u};let i=r(e.node);for(let a of standalone_Xn(t.parentNodes))if(r(a)>=i)u=a;else break;let s=n(t.node);for(let a of standalone_Xn(e.parentNodes)){if(n(a)<=s)o=a;else break;if(o===u)break}return{startNode:o,endNode:u}}function standalone_er(e,t,r,n,o=[],u){let{locStart:i,locEnd:s}=r,a=i(e),D=s(e);if(!(t>D||t<a||u==="rangeEnd"&&t===a||u==="rangeStart"&&t===D)){for(let l of ut(e,r)){let d=standalone_er(l,t,r,n,[e,...o],u);if(d)return d}if(!n||n(e,o[0]))return{node:e,parentNodes:o}}}function $o(e,t){return t!=="DeclareExportDeclaration"&&e!=="TypeParameterDeclaration"&&(e==="Directive"||e==="TypeAlias"||e==="TSExportAssignment"||e.startsWith("Declare")||e.startsWith("TSDeclare")||e.endsWith("Statement")||e.endsWith("Declaration"))}var standalone_Qn=new Set(["JsonRoot","ObjectExpression","ArrayExpression","StringLiteral","NumericLiteral","BooleanLiteral","NullLiteral","UnaryExpression","TemplateLiteral"]),standalone_Vo=new Set(["OperationDefinition","FragmentDefinition","VariableDefinition","TypeExtensionDefinition","ObjectTypeDefinition","FieldDefinition","DirectiveDefinition","EnumTypeDefinition","EnumValueDefinition","InputValueDefinition","InputObjectTypeDefinition","SchemaDefinition","OperationTypeDefinition","InterfaceTypeDefinition","UnionTypeDefinition","ScalarTypeDefinition"]);function standalone_Zn(e,t,r){if(!t)return!1;switch(e.parser){case"flow":case"babel":case"babel-flow":case"babel-ts":case"typescript":case"acorn":case"espree":case"meriyah":case"__babel_estree":return $o(t.type,r==null?void 0:r.type);case"json":case"json5":case"jsonc":case"json-stringify":return standalone_Qn.has(t.type);case"graphql":return standalone_Vo.has(t.kind);case"vue":return t.tag!=="root"}return!1}function eu(e,t,r){let{rangeStart:n,rangeEnd:o,locStart:u,locEnd:i}=t;ke.ok(o>n);let s=e.slice(n,o).search(/\S/u),a=s===-1;if(!a)for(n+=s;o>n&&!/\S/u.test(e[o-1]);--o);let D=standalone_er(r,n,t,(p,c)=>standalone_Zn(t,p,c),[],"rangeStart"),l=a?D:standalone_er(r,o,t,p=>standalone_Zn(t,p),[],"rangeEnd");if(!D||!l)return{rangeStart:0,rangeEnd:0};let d,f;if(Ho(t)){let p=Wo(D,l);d=p,f=p}else({startNode:d,endNode:f}=standalone_Mo(D,l,t));return{rangeStart:Math.min(u(d),u(f)),rangeEnd:Math.max(i(d),i(f))}}var standalone_uu="\uFEFF",tu=Symbol("cursor");async function standalone_ou(e,t,r=0){if(!e||e.trim().length===0)return{formatted:"",cursorOffset:-1,comments:[]};let{ast:n,text:o}=await standalone_ce(e,t);t.cursorOffset>=0&&(t.cursorNode=standalone_Kn(n,t));let u=await Ye(n,t,r);r>0&&(u=Je([q,u],r,t.tabWidth));let i=Fe(u,t);if(r>0){let a=i.formatted.trim();i.cursorNodeStart!==void 0&&(i.cursorNodeStart-=i.formatted.indexOf(a)),i.formatted=a+standalone_Be(t.endOfLine)}let s=t[Symbol.for("comments")];if(t.cursorOffset>=0){let a,D,l,d,f;if(t.cursorNode&&i.cursorNodeText?(a=t.locStart(t.cursorNode),D=o.slice(a,t.locEnd(t.cursorNode)),l=t.cursorOffset-a,d=i.cursorNodeStart,f=i.cursorNodeText):(a=0,D=o,l=t.cursorOffset,d=0,f=i.formatted),D===f)return{formatted:i.formatted,cursorOffset:d+l,comments:s};let p=D.split("");p.splice(l,0,tu);let c=f.split(""),F=dr(p,c),m=d;for(let E of F)if(E.removed){if(E.value.includes(tu))break}else m+=E.count;return{formatted:i.formatted,cursorOffset:m,comments:s}}return{formatted:i.formatted,cursorOffset:-1,comments:s}}async function Uo(e,t){let{ast:r,text:n}=await standalone_ce(e,t),{rangeStart:o,rangeEnd:u}=eu(n,t,r),i=n.slice(o,u),s=Math.min(o,n.lastIndexOf(`
`,o)+1),a=n.slice(s,o).match(/^\s*/u)[0],D=me(a,t.tabWidth),l=await standalone_ou(i,{...t,rangeStart:0,rangeEnd:Number.POSITIVE_INFINITY,cursorOffset:t.cursorOffset>o&&t.cursorOffset<=u?t.cursorOffset-o:-1,endOfLine:"lf"},D),d=l.formatted.trimEnd(),{cursorOffset:f}=t;f>u?f+=d.length-i.length:l.cursorOffset>=0&&(f=l.cursorOffset+o);let p=n.slice(0,o)+d+n.slice(u);if(t.endOfLine!=="lf"){let c=standalone_Be(t.endOfLine);f>=0&&c===`\r
`&&(f+=wt(p.slice(0,f),`
`)),p=standalone_ne(!1,p,`
`,c)}return{formatted:p,cursorOffset:f,comments:l.comments}}function standalone_tr(e,t,r){return typeof t!="number"||Number.isNaN(t)||t<0||t>e.length?r:t}function standalone_ru(e,t){let{cursorOffset:r,rangeStart:n,rangeEnd:o}=t;return r=standalone_tr(e,r,-1),n=standalone_tr(e,n,0),o=standalone_tr(e,o,e.length),{...t,cursorOffset:r,rangeStart:n,rangeEnd:o}}function iu(e,t){let{cursorOffset:r,rangeStart:n,rangeEnd:o,endOfLine:u}=standalone_ru(e,t),i=e.charAt(0)===standalone_uu;if(i&&(e=e.slice(1),r--,n--,o--),u==="auto"&&(u=Fr(e)),e.includes("\r")){let s=a=>wt(e.slice(0,Math.max(a,0)),`\r
`);r-=s(r),n-=s(n),o-=s(o),e=mr(e)}return{hasBOM:i,text:e,options:standalone_ru(e,{...t,cursorOffset:r,rangeStart:n,rangeEnd:o,endOfLine:u})}}async function standalone_nu(e,t){let r=await standalone_ht(t);return!r.hasPragma||r.hasPragma(e)}async function standalone_rr(e,t){let{hasBOM:r,text:n,options:o}=iu(e,await standalone_se(t));if(o.rangeStart>=o.rangeEnd&&n!==""||o.requirePragma&&!await standalone_nu(n,o))return{formatted:e,cursorOffset:t.cursorOffset,comments:[]};let u;return o.rangeStart>0||o.rangeEnd<n.length?u=await Uo(n,o):(!o.requirePragma&&o.insertPragma&&o.printer.insertPragma&&!await standalone_nu(n,o)&&(n=o.printer.insertPragma(n)),u=await standalone_ou(n,o)),r&&(u.formatted=standalone_uu+u.formatted,u.cursorOffset>=0&&u.cursorOffset++),u}async function su(e,t,r){let{text:n,options:o}=iu(e,await standalone_se(t)),u=await standalone_ce(n,o);return r&&(r.preprocessForPrint&&(u.ast=await standalone_Qt(u.ast,o)),r.massage&&(u.ast=qn(u.ast,o))),u}async function standalone_au(e,t){t=await standalone_se(t);let r=await Ye(e,t);return Fe(r,t)}async function Du(e,t){let r=standalone_Or(e),{formatted:n}=await standalone_rr(r,{...t,parser:"__js_expression"});return n}async function standalone_lu(e,t){t=await standalone_se(t);let{ast:r}=await standalone_ce(e,t);return Ye(r,t)}async function cu(e,t){return Fe(e,await standalone_se(t))}var standalone_nr={};We(standalone_nr,{builders:()=>Go,printer:()=>Ko,utils:()=>qo});var Go={join:standalone_be,line:Ke,softline:vr,hardline:q,literalline:standalone_qe,group:_t,conditionalGroup:Ar,fill:Ge,lineSuffix:xe,lineSuffixBoundary:standalone_xr,cursor:standalone_ve,breakParent:de,ifBreak:standalone_Br,trim:standalone_r,indent:standalone_De,indentIfBreak:standalone_wr,align:ae,addAlignmentToDoc:Je,markAsRoot:gr,dedentToRoot:Cr,dedent:yr,hardlineWithoutBreakParent:standalone_e,literallineWithoutBreakParent:standalone_vt,label:br,concat:e=>e},Ko={printDocToString:Fe},qo={willBreak:standalone_Ir,traverseDoc:we,findInDoc:Xe,mapDoc:standalone_Ne,removeLines:Yr,stripTrailingHardline:standalone_Ze,replaceEndOfLine:jr,canBreak:standalone_Hr};var fu="3.3.3";var standalone_or={};We(standalone_or,{addDanglingComment:()=>standalone_re,addLeadingComment:()=>standalone_ue,addTrailingComment:()=>standalone_oe,getAlignmentSize:()=>me,getIndentSize:()=>standalone_pu,getMaxContinuousCount:()=>standalone_du,getNextNonSpaceNonCommentCharacter:()=>standalone_Fu,getNextNonSpaceNonCommentCharacterIndex:()=>standalone_si,getStringWidth:()=>standalone_Oe,hasNewline:()=>standalone_V,hasNewlineInRange:()=>mu,hasSpaces:()=>Eu,isNextLineEmpty:()=>standalone_ci,isNextLineEmptyAfterIndex:()=>standalone_gt,isPreviousLineEmpty:()=>standalone_Di,makeString:()=>hu,skip:()=>standalone_Ee,skipEverythingButNewLine:()=>nt,skipInlineComment:()=>standalone_Ce,skipNewline:()=>standalone_M,skipSpaces:()=>T,skipToLineEnd:()=>rt,skipTrailingComment:()=>standalone_ge,skipWhitespace:()=>zr});function Jo(e,t){if(t===!1)return!1;if(e.charAt(t)==="/"&&e.charAt(t+1)==="*"){for(let r=t+2;r<e.length;++r)if(e.charAt(r)==="*"&&e.charAt(r+1)==="/")return r+2}return t}var standalone_Ce=Jo;function Xo(e,t){return t===!1?!1:e.charAt(t)==="/"&&e.charAt(t+1)==="/"?nt(e,t):t}var standalone_ge=Xo;function Zo(e,t){let r=null,n=t;for(;n!==r;)r=n,n=T(e,n),n=standalone_Ce(e,n),n=standalone_ge(e,n),n=standalone_M(e,n);return n}var je=Zo;function standalone_Qo(e,t){let r=null,n=t;for(;n!==r;)r=n,n=rt(e,n),n=standalone_Ce(e,n),n=T(e,n);return n=standalone_ge(e,n),n=standalone_M(e,n),n!==!1&&standalone_V(e,n)}var standalone_gt=standalone_Qo;function standalone_ei(e,t){let r=e.lastIndexOf(`
`);return r===-1?0:me(e.slice(r+1).match(/^[\t ]*/u)[0],t)}var standalone_pu=standalone_ei;function standalone_ur(e){if(typeof e!="string")throw new TypeError("Expected a string");return e.replace(/[|\\{}()[\]^$+*?.]/g,"\\$&").replace(/-/g,"\\x2d")}function standalone_ti(e,t){let r=e.match(new RegExp(`(${standalone_ur(t)})+`,"gu"));return r===null?0:r.reduce((n,o)=>Math.max(n,o.length/t.length),0)}var standalone_du=standalone_ti;function standalone_ri(e,t){let r=je(e,t);return r===!1?"":e.charAt(r)}var standalone_Fu=standalone_ri;function standalone_ni(e,t,r){for(let n=t;n<r;++n)if(e.charAt(n)===`
`)return!0;return!1}var mu=standalone_ni;function standalone_ui(e,t,r={}){return T(e,r.backwards?t-1:t,r)!==t}var Eu=standalone_ui;function standalone_oi(e,t,r){let n=t==='"'?"'":'"',u=standalone_ne(!1,e,/\\(.)|(["'])/gsu,(i,s,a)=>s===n?s:a===t?"\\"+a:a||(r&&/^[^\n\r"'0-7\\bfnrt-vx\u2028\u2029]$/u.test(s)?s:"\\"+s));return t+u+t}var hu=standalone_oi;function standalone_ii(e,t,r){return je(e,r(t))}function standalone_si(e,t){return arguments.length===2||typeof t=="number"?je(e,t):standalone_ii(...arguments)}function standalone_ai(e,t,r){return standalone_Le(e,r(t))}function standalone_Di(e,t){return arguments.length===2||typeof t=="number"?standalone_Le(e,t):standalone_ai(...arguments)}function standalone_li(e,t,r){return standalone_gt(e,r(t))}function standalone_ci(e,t){return arguments.length===2||typeof t=="number"?standalone_gt(e,t):standalone_li(...arguments)}function standalone_fe(e,t=1){return async(...r)=>{let n=r[t]??{},o=n.plugins??[];return r[t]={...n,plugins:Array.isArray(o)?o:Object.values(o)},e(...r)}}var Cu=standalone_fe(standalone_rr);async function gu(e,t){let{formatted:r}=await Cu(e,{...t,cursorOffset:-1});return r}async function standalone_fi(e,t){return await gu(e,t)===e}var standalone_pi=standalone_fe(ot,0),standalone_di={parse:standalone_fe(su),formatAST:standalone_fe(standalone_au),formatDoc:standalone_fe(Du),printToDoc:standalone_fe(standalone_lu),printDocToString:standalone_fe(cu)};var fc=(/* unused pure expression or super */ null && (standalone_ir));

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
        const fullWorkspacePath = external_path_.join(rootDir, workspaceDirectory);
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
                        dirName: external_path_.basename(workspaceDirectory),
                        manifest,
                        name,
                        dirPath: external_path_.join(parentDir, workspaceDirectory),
                    },
                };
            }
            const manifest = (0,dist.validatePolyrepoPackageManifest)(rawManifest, workspaceDirectory);
            return {
                ...result,
                [manifest.name]: {
                    dirName: external_path_.basename(workspaceDirectory),
                    manifest,
                    name: manifest.name,
                    dirPath: external_path_.join(parentDir, workspaceDirectory),
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
        (0,dist.writeJsonFile)(external_path_.join(rootDir, packageMetadata.dirPath, MANIFEST_FILE_NAME), getUpdatedManifest(packageMetadata.manifest, updateSpecification)),
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
    // TypeScript is loading Jest's `@types/prettier`, which uses Prettier 2
    // (non-async). This function will be removed in a future refactor, so
    // ignoring the type error for now.
    // eslint-disable-next-line @typescript-eslint/await-thenable
    return await gu(changelog, {
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
    const packagePath = external_path_.join(rootDir, projectRootDirectory);
    const changelogPath = external_path_.join(packagePath, CHANGELOG_FILE_NAME);
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
        newVersion = inc(currentVersion, actionInputs.ReleaseType);
        versionDiff = actionInputs.ReleaseType;
    }
    else {
        newVersion = actionInputs.ReleaseVersion;
        versionDiff = diff(currentVersion, newVersion);
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
    setOutput('NEW_VERSION', newVersion);
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
    const synchronizeVersions = (0,dist.isMajorSemverDiff)(versionDiff) || major(newVersion) === 0;
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
    if (!gt(newVersion, currentVersion)) {
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
        core_error(error.stack);
    }
    setFailed(error);
});
//# sourceMappingURL=index.js.map
