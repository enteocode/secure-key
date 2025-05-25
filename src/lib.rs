extern crate getrandom;
extern crate hex;
extern crate hmac;
extern crate rand;
extern crate sha2;
extern crate subtle;
extern crate wasm_bindgen;
extern crate zeroize;

use wasm_bindgen::prelude::*;

mod secure_key;

pub use secure_key::SecureKey;

#[wasm_bindgen]
pub fn create_secure_key(data: &[u8]) -> SecureKey {
    SecureKey::new(data)
}

#[wasm_bindgen]
pub fn get_data(secure_key: &SecureKey) -> Vec<u8> {
    secure_key.get_data()
}

#[wasm_bindgen]
pub fn get_hmac(secure_key: &SecureKey) -> String {
    secure_key.get_hmac()
}

#[wasm_bindgen]
pub fn get_hash(secure_key: &SecureKey) -> Vec<u8> {
    secure_key.get_hash()
}

#[wasm_bindgen]
pub fn equals(secure_key: &SecureKey, other: &[u8]) -> bool {
    secure_key.equals(other)
}

#[wasm_bindgen]
pub fn verify(secure_key: &SecureKey) -> bool {
    secure_key.verify()
}

#[wasm_bindgen]
pub fn destroy(secure_key: SecureKey) {
    drop(secure_key)
}
