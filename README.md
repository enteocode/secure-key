![Secure In-Memory Key](https://raw.githubusercontent.com/enteocode/secure-key/master/resources/secure-key.logo.svg)

[![Build Status](https://github.com/enteocode/secure-key/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/enteocode/secure-key/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-MIT-blue)][L]
[![WASM Security Badge](https://img.shields.io/badge/WASM-Memory_Safe_Sandbox-blue)](https://webassembly.org/security/)

A memory-hardened key container built with Rust & WASM for tamper-resistant crypto in Node.js.


## Features

**Military-Grade Protection**  
XOR masking, memory segmentation and automatic zeroization

**Developer Friendly**  
WebAssembly speed, TypeScript API and seamless Crypto module integration

**Cryptographic Integrity**  
HMAC tamper detection, runtime verification, timing attack resistance

## Installation

```shell
npm i @enteocode/secure-key
```

## Usage

```typescript
import { SecureKey } from '@enteocode/secure-key';
import { readFileSync } from 'node:fs';
import { createCipheriv } from 'node:crypto';

// Securely store API keys, tokens, or certificates

const secret = SecureKey.from(Buffer.from('sk_live_...'));

// Directly use with Node.js Crypto
// Unwrap gives direct memory reference.
// 
// Never clone it!

const cipher = createCipheriv('aes-256-gcm', secret.unwrap(), iv);

// Time Safe Comparison

if (secret.equals(readFileSync('backup.key'))) {
    console.log('MATCH');
}
```

> **Note**: All outputs will always return `Uint8Array`, even if the input was a `Buffer`.

## Security

### Safe JSON Representation

Use `JSON.stringify` to obtain a non-sensitive fingerprint:

```json
{
    "type": "SecureKey",
    "hash": "532eaabd9574880dbf76b9b8cc00832c20a6ec113d682299550d7a6e0f345e25"
}
```

- The `hash` is a **cryptographic SHA-256 digest**
- You can use it to compare keys without ever revealing the underlying secret

### Architecture

| Technique            | Implementation Details                | Protection Against   |
|----------------------|---------------------------------------|----------------------|
| **Random Splitting** | Data divided at unpredictable offsets | Memory scanning      |
| **XOR Obfuscation**  | Masked with CSPRNG-generated vectors  | Memory dump analysis |
| **WASM Sandboxing**  | Isolated memory space                 | Process inspection   |

## Development

### Prerequisites

- Rust 1.87 (`rustup install stable`)
- Node.js 20+
- wasm-pack (`cargo install wasm-pack`)

### WASM

Rust must be installed and run globally (once):

```shell
# Add WASM build target
rustup target add wasm32-unknown-unknown

# Install optimizer
cargo install wasm-pack
```

Once this is done, run the following to generate WASM and its additional JS/TS wrappers:

```shell
npm run build:wasm
```

This will generate its output to `wasm/`, needed for further TypeScript development.

### TypeScript Wrapper

Tests must run against the distributed (tree-shaken) package.
The raw WASM output includes broad compatibility code that breaks outside bundlers. Tree-shaking is essential to eliminate these conflicts before testing.

```shell
npm run build
npm test
```

## Considerations

- **Always combine with transport security** (HTTPS/TLS)
- **Never log unwrapped key material**
- **Environment variables should only contain fingerprints**

## Benchmarks

Tested on AWS t4g.micro (Node.js 20)

| Operation             | Time (ms) | Memory Overhead |
|-----------------------|-----------|-----------------|
| **Key Creation**      | 0.12      | 2.1x original   |
| **HMAC Verification** | 0.08      | <1%             |
| **Unwrapping**        | 0.05      | 0%              |

## Compliance

- [RFC 2104][R1]
- [RFC 4086][R2]
- [CWE-200][C1]
- [CWE-125][C2]
- [CWE-208][C3]
- [NIS2][N] / [GDPR][G] for data protection and privacy

## License

[MIT][L] © 2025, [Ádám Székely][A]


[A]: https://www.linkedin.com/in/enteocode/
[L]: http://www.opensource.org/licenses/MIT
[G]: https://commission.europa.eu/law/law-topic/data-protection_en
[N]: https://nis2directive.eu/

[R1]: https://tools.ietf.org/html/rfc2104
[R2]: https://tools.ietf.org/html/rfc4086
[C1]: https://cwe.mitre.org/data/definitions/200.html
[C2]: https://cwe.mitre.org/data/definitions/125.html
[C3]: https://cwe.mitre.org/data/definitions/208.html
