# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.1.1](https://github.com/enteocode/secure-key/compare/v1.1.0...v1.1.1) (2025-05-26)


### Bug Fixes

* removed unused HMAC getter ([1f9e566](https://github.com/enteocode/secure-key/commit/1f9e566db1b556d1125852d8991e2b6115731eb8))


### Tests

* added test to check hash mismatch on different content ([660f940](https://github.com/enteocode/secure-key/commit/660f9403d3afcac9296201d76eb4bdad2ec9dbae))
* added unit-test for `hash` matching ([56c946e](https://github.com/enteocode/secure-key/commit/56c946e4bab14e8659aa7a0be36a1d3c637ea9d5))


### Style

* added logo ([b37251e](https://github.com/enteocode/secure-key/commit/b37251ee1e1f41a8ff36c3199b2e639d76797381))

## [1.1.0](https://github.com/enteocode/secure-key/compare/v1.0.0...v1.1.0) (2025-05-25)


### Features

* changed `hmac` to `hash` in JSON representation for cryptographic (SHA-256) content matching ([390271f](https://github.com/enteocode/secure-key/commit/390271f5cd40c125813e5b39ac5b44886bf93e89))


### Bug Fixes

* increased security (random length mask, reversed partial store) ([e1e7bd7](https://github.com/enteocode/secure-key/commit/e1e7bd7b7cbf9ccbf7b50fa5bdf7ceac74da268c))
* removed unnecessary build step from `make.sh` ([563e45e](https://github.com/enteocode/secure-key/commit/563e45e872a97a8bd1c2b8b74506e4b6024271f1))


### Docs

* small changes to increase readability ([9413313](https://github.com/enteocode/secure-key/commit/9413313883b62e270b11f3ad902af68e03b7bd75))

## 1.0.0 (2025-05-24)


### Setup

* initial implementation ([3082a9a](https://github.com/enteocode/secure-key/commit/3082a9af4812b415f4b5ee131fb20cb652a9e041))


### Docs

* adjusted visual display ([dd422c8](https://github.com/enteocode/secure-key/commit/dd422c89dc372a096abdb5024f686a406f45405e))
