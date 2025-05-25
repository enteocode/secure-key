#!/bin/sh

set -e

# Configure

export RUSTFLAGS='--cfg getrandom_backend="wasm_js"'

# Compile

cargo clean

# Optimize assembly
#
# NodeJS target creates a CommonJS output with __dirname which is not handled
# by @rollup/plugin-commonjs properly, therefor Web target is needed

rm -rf ./wasm
wasm-pack build --target web --release --no-default-features --out-dir wasm

# Cleanup

cargo clean
