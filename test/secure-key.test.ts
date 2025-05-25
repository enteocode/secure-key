import { SecureKey } from '../dist';

// ATTENTION
//
// Tests must run against the distributed (tree-shaken) package.
//
// The raw WASM output includes broad compatibility code that breaks outside bundlers.
// Tree-shaking is essential to eliminate these conflicts before testing.

describe('SecureKey', () => {
    it('should be defined', () => {
        expect(SecureKey).toBeDefined();
    });

    it('should work with Uint8Array', () => {
        expect(SecureKey.from(new Uint8Array([1, 2, 3, 4]))).toBeInstanceOf(SecureKey);
    });

    it('should work with Buffer', () => {
        expect(SecureKey.from(Buffer.from('Test'))).toBeInstanceOf(SecureKey);
    });

    it('should return the same data', () => {
        const i = Buffer.from('Test');
        const o = Buffer.from(SecureKey.from(i).unwrap());

        expect(i.equals(o)).toBe(true);
    });

    it('should verify integrity', () => {
        expect(SecureKey.from(Buffer.from('Test')).verify()).toBe(true);
    });

    it('should equals pass with same data', () => {
        expect(SecureKey.from(Buffer.from('Test')).equals(Buffer.from('Test'))).toBe(true);
    });

    it('should equals fail with different data', () => {
        expect(SecureKey.from(Buffer.from('Test')).equals(Buffer.from('test'))).toBe(false);
    });

    it('should create a safe JSON representation', () => {
        const json = JSON.stringify(SecureKey.from(Buffer.from('Test')));
        const read = JSON.parse(json);

        expect(read.type).toBe(SecureKey.name);
        expect(read.hash).toMatch(/[0-9a-f]{64}/);
    });
});
