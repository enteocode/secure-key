import {
    initSync,
    create_secure_key,
    destroy,
    get_data,
    get_hash,
    equals,
    verify,
    SecureKey as Pointer
} from '../wasm/secure_key';
import { readFileSync } from 'node:fs';

import path from '../wasm/secure_key_bg.wasm';

// Initialize WebAssembly synchronously with precompiled module

initSync({
    module: readFileSync(path as any)
});

/**
 * Unique symbol used to store internal WASM pointer, to hide
 * internal reference from external access
 *
 * @private
 */
const pointer = Symbol();

/**
 * SecureKey
 *
 * Provides protected memory storage with integrity check, zeroization on
 * destruction and constant-time equality checks.
 *
 * @public
 */
export class SecureKey {
    /**
     * Internal pointer to WASM-managed instance
     *
     * @private
     */
    private readonly [pointer]: Pointer;

    /**
     * Creates a new SecureKey instance in protected memory space
     *
     * @static
     * @param buffer Original secret data (will be masked inside WASM)
     */
    static from<T extends Uint8Array>(buffer: T): SecureKey {
        return new SecureKey(create_secure_key(buffer));
    }

    private constructor(instance: Pointer) {
        this[pointer] = instance;
    }

    /**
     * Verifies HMAC integrity of the stored value to detect tampering
     *
     * @public
     */
    public verify(): boolean {
        return verify(this[pointer]);
    }

    /**
     * Securely checks if the stored value is equal to another input.
     * Uses constant-time comparison to prevent timing attacks.
     *
     * @public
     * @param other
     */
    public equals(other: Uint8Array): boolean {
        return equals(this[pointer], other);
    }

    /**
     * Retrieves the original data by unmasking the value in WASM.
     *
     * Warning: Do NOT clone or copy the returned buffer to JS heap, as it
     * will bypass WASM memory protection.
     *
     * Use it directly only.
     *
     * @public
     */
    public unwrap(): Uint8Array {
        return get_data(this[pointer]);
    }

    /**
     * Returns a minimal JSON representation for comparison and debugging.
     * Includes only non-sensitive metadata
     *
     * @public
     */
    toJSON() {
        const hash = Buffer.from(get_hash(this[pointer])).toString('hex');

        return {
            type: SecureKey.name,
            hash
        };
    }

    /**
     * Native JavaScript `Object.prototype.toString.call()` integration
     *
     * @internal
     */
    get [Symbol.toStringTag]() {
        return 'SecureKey';
    }

    /**
     * Disposes the instance and zeroizes memory inside the WASM sandbox.
     *
     * @internal
     */
    [Symbol.dispose]() {
        destroy(this[pointer]);
    }
}
