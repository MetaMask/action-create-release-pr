"use strict";
exports.id = 441;
exports.ids = [441];
exports.modules = {

/***/ 8734:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "b70cf7958e5bf61abf14.js";

/***/ }),

/***/ 6441:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "defineConfig": () => (/* binding */ defineConfig),
  "format": () => (/* binding */ dist_format),
  "jsTextToDoc": () => (/* binding */ dist_jsTextToDoc)
});

// EXTERNAL MODULE: external "node:module"
var external_node_module_ = __webpack_require__(2033);
;// CONCATENATED MODULE: ./node_modules/oxfmt/dist/bindings-D8fqxEoQ.js

//#region src-js/bindings.js
const bindings_D8fqxEoQ_require = (0,external_node_module_.createRequire)(import.meta.url);
new URL(/* asset import */ __webpack_require__(8734), __webpack_require__.b).pathname;
const { readFileSync } = bindings_D8fqxEoQ_require("node:fs");
let nativeBinding = null;
const loadErrors = [];
const isMusl = () => {
	let musl = false;
	if (process.platform === "linux") {
		musl = isMuslFromFilesystem();
		if (musl === null) musl = isMuslFromReport();
		if (musl === null) musl = isMuslFromChildProcess();
	}
	return musl;
};
const isFileMusl = (f) => f.includes("libc.musl-") || f.includes("ld-musl-");
const isMuslFromFilesystem = () => {
	try {
		return readFileSync("/usr/bin/ldd", "utf-8").includes("musl");
	} catch {
		return null;
	}
};
const isMuslFromReport = () => {
	let report = null;
	if (typeof process.report?.getReport === "function") {
		process.report.excludeNetwork = true;
		report = process.report.getReport();
	}
	if (!report) return null;
	if (report.header && report.header.glibcVersionRuntime) return false;
	if (Array.isArray(report.sharedObjects)) {
		if (report.sharedObjects.some(isFileMusl)) return true;
	}
	return false;
};
const isMuslFromChildProcess = () => {
	try {
		return bindings_D8fqxEoQ_require("child_process").execSync("ldd --version", { encoding: "utf8" }).includes("musl");
	} catch (e) {
		return false;
	}
};
function requireNative() {
	if (process.env.NAPI_RS_NATIVE_LIBRARY_PATH) try {
		return bindings_D8fqxEoQ_require(process.env.NAPI_RS_NATIVE_LIBRARY_PATH);
	} catch (err) {
		loadErrors.push(err);
	}
	else if (process.platform === "android") if (process.arch === "arm64") {
		try {
			return bindings_D8fqxEoQ_require("./oxfmt.android-arm64.node");
		} catch (e) {
			loadErrors.push(e);
		}
		try {
			const binding = bindings_D8fqxEoQ_require("@oxfmt/binding-android-arm64");
			const bindingPackageVersion = bindings_D8fqxEoQ_require("@oxfmt/binding-android-arm64/package.json").version;
			if (bindingPackageVersion !== "0.44.0" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 0.44.0 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e) {
			loadErrors.push(e);
		}
	} else if (process.arch === "arm") {
		try {
			return bindings_D8fqxEoQ_require("./oxfmt.android-arm-eabi.node");
		} catch (e) {
			loadErrors.push(e);
		}
		try {
			const binding = bindings_D8fqxEoQ_require("@oxfmt/binding-android-arm-eabi");
			const bindingPackageVersion = bindings_D8fqxEoQ_require("@oxfmt/binding-android-arm-eabi/package.json").version;
			if (bindingPackageVersion !== "0.44.0" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 0.44.0 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e) {
			loadErrors.push(e);
		}
	} else loadErrors.push(/* @__PURE__ */ new Error(`Unsupported architecture on Android ${process.arch}`));
	else if (process.platform === "win32") if (process.arch === "x64") if (process.config?.variables?.shlib_suffix === "dll.a" || process.config?.variables?.node_target_type === "shared_library") {
		try {
			return bindings_D8fqxEoQ_require("./oxfmt.win32-x64-gnu.node");
		} catch (e) {
			loadErrors.push(e);
		}
		try {
			const binding = bindings_D8fqxEoQ_require("@oxfmt/binding-win32-x64-gnu");
			const bindingPackageVersion = bindings_D8fqxEoQ_require("@oxfmt/binding-win32-x64-gnu/package.json").version;
			if (bindingPackageVersion !== "0.44.0" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 0.44.0 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e) {
			loadErrors.push(e);
		}
	} else {
		try {
			return bindings_D8fqxEoQ_require("./oxfmt.win32-x64-msvc.node");
		} catch (e) {
			loadErrors.push(e);
		}
		try {
			const binding = bindings_D8fqxEoQ_require("@oxfmt/binding-win32-x64-msvc");
			const bindingPackageVersion = bindings_D8fqxEoQ_require("@oxfmt/binding-win32-x64-msvc/package.json").version;
			if (bindingPackageVersion !== "0.44.0" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 0.44.0 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e) {
			loadErrors.push(e);
		}
	}
	else if (process.arch === "ia32") {
		try {
			return bindings_D8fqxEoQ_require("./oxfmt.win32-ia32-msvc.node");
		} catch (e) {
			loadErrors.push(e);
		}
		try {
			const binding = bindings_D8fqxEoQ_require("@oxfmt/binding-win32-ia32-msvc");
			const bindingPackageVersion = bindings_D8fqxEoQ_require("@oxfmt/binding-win32-ia32-msvc/package.json").version;
			if (bindingPackageVersion !== "0.44.0" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 0.44.0 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e) {
			loadErrors.push(e);
		}
	} else if (process.arch === "arm64") {
		try {
			return bindings_D8fqxEoQ_require("./oxfmt.win32-arm64-msvc.node");
		} catch (e) {
			loadErrors.push(e);
		}
		try {
			const binding = bindings_D8fqxEoQ_require("@oxfmt/binding-win32-arm64-msvc");
			const bindingPackageVersion = bindings_D8fqxEoQ_require("@oxfmt/binding-win32-arm64-msvc/package.json").version;
			if (bindingPackageVersion !== "0.44.0" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 0.44.0 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e) {
			loadErrors.push(e);
		}
	} else loadErrors.push(/* @__PURE__ */ new Error(`Unsupported architecture on Windows: ${process.arch}`));
	else if (process.platform === "darwin") {
		try {
			return bindings_D8fqxEoQ_require("./oxfmt.darwin-universal.node");
		} catch (e) {
			loadErrors.push(e);
		}
		try {
			const binding = bindings_D8fqxEoQ_require("@oxfmt/binding-darwin-universal");
			const bindingPackageVersion = bindings_D8fqxEoQ_require("@oxfmt/binding-darwin-universal/package.json").version;
			if (bindingPackageVersion !== "0.44.0" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 0.44.0 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e) {
			loadErrors.push(e);
		}
		if (process.arch === "x64") {
			try {
				return bindings_D8fqxEoQ_require("./oxfmt.darwin-x64.node");
			} catch (e) {
				loadErrors.push(e);
			}
			try {
				const binding = bindings_D8fqxEoQ_require("@oxfmt/binding-darwin-x64");
				const bindingPackageVersion = bindings_D8fqxEoQ_require("@oxfmt/binding-darwin-x64/package.json").version;
				if (bindingPackageVersion !== "0.44.0" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 0.44.0 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
				return binding;
			} catch (e) {
				loadErrors.push(e);
			}
		} else if (process.arch === "arm64") {
			try {
				return bindings_D8fqxEoQ_require("./oxfmt.darwin-arm64.node");
			} catch (e) {
				loadErrors.push(e);
			}
			try {
				const binding = bindings_D8fqxEoQ_require("@oxfmt/binding-darwin-arm64");
				const bindingPackageVersion = bindings_D8fqxEoQ_require("@oxfmt/binding-darwin-arm64/package.json").version;
				if (bindingPackageVersion !== "0.44.0" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 0.44.0 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
				return binding;
			} catch (e) {
				loadErrors.push(e);
			}
		} else loadErrors.push(/* @__PURE__ */ new Error(`Unsupported architecture on macOS: ${process.arch}`));
	} else if (process.platform === "freebsd") if (process.arch === "x64") {
		try {
			return bindings_D8fqxEoQ_require("./oxfmt.freebsd-x64.node");
		} catch (e) {
			loadErrors.push(e);
		}
		try {
			const binding = bindings_D8fqxEoQ_require("@oxfmt/binding-freebsd-x64");
			const bindingPackageVersion = bindings_D8fqxEoQ_require("@oxfmt/binding-freebsd-x64/package.json").version;
			if (bindingPackageVersion !== "0.44.0" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 0.44.0 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e) {
			loadErrors.push(e);
		}
	} else if (process.arch === "arm64") {
		try {
			return bindings_D8fqxEoQ_require("./oxfmt.freebsd-arm64.node");
		} catch (e) {
			loadErrors.push(e);
		}
		try {
			const binding = bindings_D8fqxEoQ_require("@oxfmt/binding-freebsd-arm64");
			const bindingPackageVersion = bindings_D8fqxEoQ_require("@oxfmt/binding-freebsd-arm64/package.json").version;
			if (bindingPackageVersion !== "0.44.0" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 0.44.0 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e) {
			loadErrors.push(e);
		}
	} else loadErrors.push(/* @__PURE__ */ new Error(`Unsupported architecture on FreeBSD: ${process.arch}`));
	else if (process.platform === "linux") if (process.arch === "x64") if (isMusl()) {
		try {
			return bindings_D8fqxEoQ_require("./oxfmt.linux-x64-musl.node");
		} catch (e) {
			loadErrors.push(e);
		}
		try {
			const binding = bindings_D8fqxEoQ_require("@oxfmt/binding-linux-x64-musl");
			const bindingPackageVersion = bindings_D8fqxEoQ_require("@oxfmt/binding-linux-x64-musl/package.json").version;
			if (bindingPackageVersion !== "0.44.0" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 0.44.0 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e) {
			loadErrors.push(e);
		}
	} else {
		try {
			return bindings_D8fqxEoQ_require("./oxfmt.linux-x64-gnu.node");
		} catch (e) {
			loadErrors.push(e);
		}
		try {
			const binding = bindings_D8fqxEoQ_require("@oxfmt/binding-linux-x64-gnu");
			const bindingPackageVersion = bindings_D8fqxEoQ_require("@oxfmt/binding-linux-x64-gnu/package.json").version;
			if (bindingPackageVersion !== "0.44.0" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 0.44.0 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e) {
			loadErrors.push(e);
		}
	}
	else if (process.arch === "arm64") if (isMusl()) {
		try {
			return bindings_D8fqxEoQ_require("./oxfmt.linux-arm64-musl.node");
		} catch (e) {
			loadErrors.push(e);
		}
		try {
			const binding = bindings_D8fqxEoQ_require("@oxfmt/binding-linux-arm64-musl");
			const bindingPackageVersion = bindings_D8fqxEoQ_require("@oxfmt/binding-linux-arm64-musl/package.json").version;
			if (bindingPackageVersion !== "0.44.0" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 0.44.0 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e) {
			loadErrors.push(e);
		}
	} else {
		try {
			return bindings_D8fqxEoQ_require("./oxfmt.linux-arm64-gnu.node");
		} catch (e) {
			loadErrors.push(e);
		}
		try {
			const binding = bindings_D8fqxEoQ_require("@oxfmt/binding-linux-arm64-gnu");
			const bindingPackageVersion = bindings_D8fqxEoQ_require("@oxfmt/binding-linux-arm64-gnu/package.json").version;
			if (bindingPackageVersion !== "0.44.0" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 0.44.0 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e) {
			loadErrors.push(e);
		}
	}
	else if (process.arch === "arm") if (isMusl()) {
		try {
			return bindings_D8fqxEoQ_require("./oxfmt.linux-arm-musleabihf.node");
		} catch (e) {
			loadErrors.push(e);
		}
		try {
			const binding = bindings_D8fqxEoQ_require("@oxfmt/binding-linux-arm-musleabihf");
			const bindingPackageVersion = bindings_D8fqxEoQ_require("@oxfmt/binding-linux-arm-musleabihf/package.json").version;
			if (bindingPackageVersion !== "0.44.0" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 0.44.0 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e) {
			loadErrors.push(e);
		}
	} else {
		try {
			return bindings_D8fqxEoQ_require("./oxfmt.linux-arm-gnueabihf.node");
		} catch (e) {
			loadErrors.push(e);
		}
		try {
			const binding = bindings_D8fqxEoQ_require("@oxfmt/binding-linux-arm-gnueabihf");
			const bindingPackageVersion = bindings_D8fqxEoQ_require("@oxfmt/binding-linux-arm-gnueabihf/package.json").version;
			if (bindingPackageVersion !== "0.44.0" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 0.44.0 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e) {
			loadErrors.push(e);
		}
	}
	else if (process.arch === "loong64") if (isMusl()) {
		try {
			return bindings_D8fqxEoQ_require("./oxfmt.linux-loong64-musl.node");
		} catch (e) {
			loadErrors.push(e);
		}
		try {
			const binding = bindings_D8fqxEoQ_require("@oxfmt/binding-linux-loong64-musl");
			const bindingPackageVersion = bindings_D8fqxEoQ_require("@oxfmt/binding-linux-loong64-musl/package.json").version;
			if (bindingPackageVersion !== "0.44.0" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 0.44.0 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e) {
			loadErrors.push(e);
		}
	} else {
		try {
			return bindings_D8fqxEoQ_require("./oxfmt.linux-loong64-gnu.node");
		} catch (e) {
			loadErrors.push(e);
		}
		try {
			const binding = bindings_D8fqxEoQ_require("@oxfmt/binding-linux-loong64-gnu");
			const bindingPackageVersion = bindings_D8fqxEoQ_require("@oxfmt/binding-linux-loong64-gnu/package.json").version;
			if (bindingPackageVersion !== "0.44.0" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 0.44.0 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e) {
			loadErrors.push(e);
		}
	}
	else if (process.arch === "riscv64") if (isMusl()) {
		try {
			return bindings_D8fqxEoQ_require("./oxfmt.linux-riscv64-musl.node");
		} catch (e) {
			loadErrors.push(e);
		}
		try {
			const binding = bindings_D8fqxEoQ_require("@oxfmt/binding-linux-riscv64-musl");
			const bindingPackageVersion = bindings_D8fqxEoQ_require("@oxfmt/binding-linux-riscv64-musl/package.json").version;
			if (bindingPackageVersion !== "0.44.0" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 0.44.0 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e) {
			loadErrors.push(e);
		}
	} else {
		try {
			return bindings_D8fqxEoQ_require("./oxfmt.linux-riscv64-gnu.node");
		} catch (e) {
			loadErrors.push(e);
		}
		try {
			const binding = bindings_D8fqxEoQ_require("@oxfmt/binding-linux-riscv64-gnu");
			const bindingPackageVersion = bindings_D8fqxEoQ_require("@oxfmt/binding-linux-riscv64-gnu/package.json").version;
			if (bindingPackageVersion !== "0.44.0" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 0.44.0 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e) {
			loadErrors.push(e);
		}
	}
	else if (process.arch === "ppc64") {
		try {
			return bindings_D8fqxEoQ_require("./oxfmt.linux-ppc64-gnu.node");
		} catch (e) {
			loadErrors.push(e);
		}
		try {
			const binding = bindings_D8fqxEoQ_require("@oxfmt/binding-linux-ppc64-gnu");
			const bindingPackageVersion = bindings_D8fqxEoQ_require("@oxfmt/binding-linux-ppc64-gnu/package.json").version;
			if (bindingPackageVersion !== "0.44.0" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 0.44.0 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e) {
			loadErrors.push(e);
		}
	} else if (process.arch === "s390x") {
		try {
			return bindings_D8fqxEoQ_require("./oxfmt.linux-s390x-gnu.node");
		} catch (e) {
			loadErrors.push(e);
		}
		try {
			const binding = bindings_D8fqxEoQ_require("@oxfmt/binding-linux-s390x-gnu");
			const bindingPackageVersion = bindings_D8fqxEoQ_require("@oxfmt/binding-linux-s390x-gnu/package.json").version;
			if (bindingPackageVersion !== "0.44.0" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 0.44.0 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e) {
			loadErrors.push(e);
		}
	} else loadErrors.push(/* @__PURE__ */ new Error(`Unsupported architecture on Linux: ${process.arch}`));
	else if (process.platform === "openharmony") if (process.arch === "arm64") {
		try {
			return bindings_D8fqxEoQ_require("./oxfmt.openharmony-arm64.node");
		} catch (e) {
			loadErrors.push(e);
		}
		try {
			const binding = bindings_D8fqxEoQ_require("@oxfmt/binding-openharmony-arm64");
			const bindingPackageVersion = bindings_D8fqxEoQ_require("@oxfmt/binding-openharmony-arm64/package.json").version;
			if (bindingPackageVersion !== "0.44.0" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 0.44.0 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e) {
			loadErrors.push(e);
		}
	} else if (process.arch === "x64") {
		try {
			return bindings_D8fqxEoQ_require("./oxfmt.openharmony-x64.node");
		} catch (e) {
			loadErrors.push(e);
		}
		try {
			const binding = bindings_D8fqxEoQ_require("@oxfmt/binding-openharmony-x64");
			const bindingPackageVersion = bindings_D8fqxEoQ_require("@oxfmt/binding-openharmony-x64/package.json").version;
			if (bindingPackageVersion !== "0.44.0" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 0.44.0 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e) {
			loadErrors.push(e);
		}
	} else if (process.arch === "arm") {
		try {
			return bindings_D8fqxEoQ_require("./oxfmt.openharmony-arm.node");
		} catch (e) {
			loadErrors.push(e);
		}
		try {
			const binding = bindings_D8fqxEoQ_require("@oxfmt/binding-openharmony-arm");
			const bindingPackageVersion = bindings_D8fqxEoQ_require("@oxfmt/binding-openharmony-arm/package.json").version;
			if (bindingPackageVersion !== "0.44.0" && process.env.NAPI_RS_ENFORCE_VERSION_CHECK && process.env.NAPI_RS_ENFORCE_VERSION_CHECK !== "0") throw new Error(`Native binding package version mismatch, expected 0.44.0 but got ${bindingPackageVersion}. You can reinstall dependencies to fix this issue.`);
			return binding;
		} catch (e) {
			loadErrors.push(e);
		}
	} else loadErrors.push(/* @__PURE__ */ new Error(`Unsupported architecture on OpenHarmony: ${process.arch}`));
	else loadErrors.push(/* @__PURE__ */ new Error(`Unsupported OS: ${process.platform}, architecture: ${process.arch}`));
}
nativeBinding = requireNative();
if (!nativeBinding || process.env.NAPI_RS_FORCE_WASI) {
	let wasiBinding = null;
	let wasiBindingError = null;
	try {
		wasiBinding = bindings_D8fqxEoQ_require("./oxfmt.wasi.cjs");
		nativeBinding = wasiBinding;
	} catch (err) {
		if (process.env.NAPI_RS_FORCE_WASI) wasiBindingError = err;
	}
	if (!nativeBinding || process.env.NAPI_RS_FORCE_WASI) try {
		wasiBinding = bindings_D8fqxEoQ_require("@oxfmt/binding-wasm32-wasi");
		nativeBinding = wasiBinding;
	} catch (err) {
		if (process.env.NAPI_RS_FORCE_WASI) {
			if (!wasiBindingError) wasiBindingError = err;
			else wasiBindingError.cause = err;
			loadErrors.push(err);
		}
	}
	if (process.env.NAPI_RS_FORCE_WASI === "error" && !wasiBinding) {
		const error = /* @__PURE__ */ new Error("WASI binding not found and NAPI_RS_FORCE_WASI is set to error");
		error.cause = wasiBindingError;
		throw error;
	}
}
if (!nativeBinding) {
	if (loadErrors.length > 0) throw new Error("Cannot find native binding. npm has a bug related to optional dependencies (https://github.com/npm/cli/issues/4828). Please try `npm i` again after removing both package-lock.json and node_modules directory.", { cause: loadErrors.reduce((err, cur) => {
		cur.cause = err;
		return cur;
	}) });
	throw new Error(`Failed to load native binding`);
}
const { Severity, format, jsTextToDoc, runCli } = nativeBinding;
//#endregion


;// CONCATENATED MODULE: ./node_modules/oxfmt/dist/apis-mHnrEtPz.js
//#region src-js/libs/apis.ts
const CACHES = {
	prettier: null,
	tailwindPlugin: null,
	tailwindSorter: null,
	oxfmtPlugin: null
};
async function loadPrettier() {
	if (!CACHES.prettier) {
		CACHES.prettier = await Promise.all(/* import() */[__webpack_require__.e(936), __webpack_require__.e(802)]).then(__webpack_require__.bind(__webpack_require__, 8936));
		const { formatOptionsHiddenDefaults } = CACHES.prettier.__internal;
		formatOptionsHiddenDefaults.parentParser = null;
		formatOptionsHiddenDefaults.__onHtmlRoot = null;
		formatOptionsHiddenDefaults.__inJsTemplate = null;
	}
	return CACHES.prettier;
}
/**
* TODO: Plugins support
* - Read `plugins` field
* - Load plugins dynamically and parse `languages` field
* - Map file extensions and filenames to Prettier parsers
*
* @returns Array of loaded plugin's `languages` info
*/
async function resolvePlugins() {
	return [];
}
/**
* Format non-js file
*
* @returns Formatted code
*/
async function formatFile({ code, options }) {
	const prettier = CACHES.prettier ?? await loadPrettier();
	if ("_useTailwindPlugin" in options) await setupTailwindPlugin(options);
	if ("_oxfmtPluginOptionsJson" in options) await setupOxfmtPlugin(options);
	return prettier.format(code, options);
}
/**
* Format non-js code snippets into formatted string.
* Mainly used for formatting code fences within JSDoc,
* and is also used as a temporary fallback for html-in-js.
*
* @returns Formatted code snippet
*/
async function formatEmbeddedCode({ code, options }) {
	const prettier = CACHES.prettier ?? await loadPrettier();
	if ("_useTailwindPlugin" in options) await setupTailwindPlugin(options);
	return prettier.format(code, options);
}
/**
* Format non-js code snippets into Prettier `Doc` JSON strings.
*
* This makes our printer correctly handle `printWidth` even for embedded code.
* - For gql-in-js, `texts` contains multiple parts split by `${}` in a template literal
* - For others, `texts` always contains a single string with `${}` parts replaced by placeholders
* However, this function does not need to be aware of that,
* as it simply formats each text part independently and returns an array of formatted parts.
*
* @returns Doc JSON strings
*/
async function formatEmbeddedDoc({ texts, options }) {
	const prettier = CACHES.prettier ?? await loadPrettier();
	if ("_useTailwindPlugin" in options) await setupTailwindPlugin(options);
	return Promise.all(texts.map(async (text) => {
		const metadata = {};
		if (options.parser === "html" || options.parser === "angular") {
			options.parentParser = "OXFMT";
			options.__onHtmlRoot = (root) => metadata.htmlHasMultipleRootElements = (root.children?.length ?? 0) > 1;
		}
		if (options.parser === "markdown") options.__inJsTemplate = true;
		const doc = await prettier.__debug.printToDoc(text, options);
		const symbolToNumber = /* @__PURE__ */ new Map();
		let nextId = 1;
		return JSON.stringify([doc, metadata], (_key, value) => {
			if (typeof value === "symbol") {
				if (!symbolToNumber.has(value)) symbolToNumber.set(value, nextId++);
				return symbolToNumber.get(value);
			}
			if (value === -Infinity) return "__NEGATIVE_INFINITY__";
			return value;
		});
	}));
}
async function loadTailwindPlugin() {
	if (!CACHES.tailwindPlugin) CACHES.tailwindPlugin = await Promise.all(/* import() */[__webpack_require__.e(936), __webpack_require__.e(777), __webpack_require__.e(117), __webpack_require__.e(731), __webpack_require__.e(726), __webpack_require__.e(891)]).then(__webpack_require__.bind(__webpack_require__, 4234));
	return CACHES.tailwindPlugin;
}
/**
* Load Tailwind CSS plugin.
* Option mapping (sortTailwindcss.xxx → tailwindXxx) is also done in Rust side.
*/
async function setupTailwindPlugin(options) {
	const tailwindPlugin = CACHES.tailwindPlugin ?? await loadTailwindPlugin();
	options.plugins ??= [];
	options.plugins.push(tailwindPlugin);
}
async function loadTailwindSorter() {
	if (!CACHES.tailwindSorter) CACHES.tailwindSorter = await Promise.all(/* import() */[__webpack_require__.e(731), __webpack_require__.e(89)]).then(__webpack_require__.bind(__webpack_require__, 26));
	return CACHES.tailwindSorter;
}
/**
* Process Tailwind CSS classes found in JS/TS files in batch.
* @param args - Object containing classes and options (filepath is in options.filepath)
* @returns Array of sorted class strings (same order/length as input)
*/
async function sortTailwindClasses({ classes, options }) {
	const { createSorter } = CACHES.tailwindSorter ?? await loadTailwindSorter();
	return (await createSorter({
		filepath: options.filepath,
		stylesheetPath: options.tailwindStylesheet,
		configPath: options.tailwindConfig,
		preserveWhitespace: options.tailwindPreserveWhitespace,
		preserveDuplicates: options.tailwindPreserveDuplicates
	})).sortClassAttributes(classes);
}
async function loadOxfmtPlugin() {
	if (!CACHES.oxfmtPlugin) CACHES.oxfmtPlugin = await __webpack_require__.e(/* import() */ 362).then(__webpack_require__.bind(__webpack_require__, 3362));
	return CACHES.oxfmtPlugin;
}
/**
* Load oxfmt plugin for js-in-xxx parsers.
*/
async function setupOxfmtPlugin(options) {
	const oxcPlugin = CACHES.oxfmtPlugin ?? await loadOxfmtPlugin();
	options.plugins ??= [];
	options.plugins.push(oxcPlugin);
}
//#endregion


;// CONCATENATED MODULE: ./node_modules/oxfmt/dist/index.js


//#region src-js/index.ts
/**
* Define an oxfmt configuration with type inference.
*/
function defineConfig(config) {
	return config;
}
/**
* Format the given source text according to the specified options.
*/
async function dist_format(fileName, sourceText, options) {
	if (typeof fileName !== "string") throw new TypeError("`fileName` must be a string");
	if (typeof sourceText !== "string") throw new TypeError("`sourceText` must be a string");
	return format(fileName, sourceText, options ?? {}, resolvePlugins, (options, code) => formatFile({
		options,
		code
	}), (options, code) => formatEmbeddedCode({
		options,
		code
	}), (options, texts) => formatEmbeddedDoc({
		options,
		texts
	}), (options, classes) => sortTailwindClasses({
		options,
		classes
	}));
}
/**
* Format a JS/TS snippet for Prettier `textToDoc()` plugin flow.
*/
async function dist_jsTextToDoc(sourceExt, sourceText, oxfmtPluginOptionsJson, parentContext) {
	return jsTextToDoc(sourceExt, sourceText, oxfmtPluginOptionsJson, parentContext, resolvePlugins, (_options, _code) => Promise.reject(), (options, code) => formatEmbeddedCode({
		options,
		code
	}), (options, texts) => formatEmbeddedDoc({
		options,
		texts
	}), (options, classes) => sortTailwindClasses({
		options,
		classes
	}));
}
//#endregion



/***/ })

};
;