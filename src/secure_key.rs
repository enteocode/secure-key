use hex::encode;
use hmac::{Hmac, Mac};
use rand::{fill, random_range};
use sha2::Sha256;
use subtle::ConstantTimeEq;
use wasm_bindgen::prelude::*;
use zeroize::Zeroize;

type HmacSha256 = Hmac<Sha256>;

#[wasm_bindgen]
pub struct SecureKey {
    masked1: Vec<u8>,
    masked2: Vec<u8>,
    mask: Vec<u8>,
    hmac_key: [u8; 32],
    hmac_tag: Vec<u8>,
}

impl Drop for SecureKey {
    fn drop(&mut self) {
        self.masked1.zeroize();
        self.masked2.zeroize();
        self.mask.zeroize();
        self.hmac_key.zeroize();
        self.hmac_tag.zeroize();
    }
}

impl SecureKey {
    pub fn new(data: &[u8]) -> SecureKey {
        let len = data.len();
        let split = random_range(0..=len);
        let mut mask = vec![0u8; len];

        fill(&mut mask[..len]);

        let masked: Vec<u8> = data.iter().enumerate().map(|(i, &b)| b ^ mask[i]).collect();

        let (m1, m2) = masked.split_at(split);
        let masked1 = m1.to_vec();
        let masked2 = m2.to_vec();

        let mut hmac_key = [0u8; 32];

        fill(&mut hmac_key);

        let mut hmac = HmacSha256::new_from_slice(&hmac_key).expect("HMAC initialization failed");

        hmac.update(data);

        let hmac_tag = hmac.finalize().into_bytes().to_vec();

        SecureKey {
            masked1,
            masked2,
            mask,
            hmac_key,
            hmac_tag,
        }
    }

    pub fn equals(&self, other: &[u8]) -> bool {
        if !self.verify() {
            panic!("HMAC verification failed - data corrupted");
        }
        let original = reconstruct_unmasked_data(&self.masked1, &self.masked2, &self.mask);

        original.ct_eq(other).unwrap_u8() == 1
    }

    pub fn verify(&self) -> bool {
        let original = reconstruct_unmasked_data(&self.masked1, &self.masked2, &self.mask);

        let mut hmac = HmacSha256::new_from_slice(&self.hmac_key).expect("HMAC init failed");

        hmac.update(&original);
        hmac.verify_slice(&self.hmac_tag).is_ok()
    }

    pub fn get_data(&self) -> Vec<u8> {
        if !self.verify() {
            panic!("HMAC verification failed - data corrupted");
        }
        reconstruct_unmasked_data(&self.masked1, &self.masked2, &self.mask)
    }

    pub fn get_hmac(&self) -> String {
        encode(&self.hmac_tag)
    }
}

fn reconstruct_unmasked_data(masked1: &[u8], masked2: &[u8], mask: &[u8]) -> Vec<u8> {
    let mut combined = masked1.to_vec();

    combined.extend_from_slice(masked2);
    combined
        .iter()
        .enumerate()
        .map(|(i, &b)| b ^ mask[i])
        .collect()
}
