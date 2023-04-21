#![no_std]
#![no_main]

#[cfg(not(target_arch = "wasm32"))]
compile_error!("target arch should be wasm32: compile with '--target wasm32-unknown-unknown'");

extern crate alloc;

use alloc::string::String;

use casper_contract::{
    contract_api::{runtime, storage},
    unwrap_or_revert::UnwrapOrRevert,
};
use casper_types::URef;
use core::convert::TryInto;

const MOVIE_ARG_NAME: &str = "movie";
const RATING_ARG_NAME: &str = "rating";

#[no_mangle]
pub extern "C" fn call() {
    let movie: String = runtime::get_named_arg(MOVIE_ARG_NAME);
    let rating: u8 = runtime::get_named_arg(RATING_ARG_NAME);

    match runtime::get_key(&movie) {
        None => {
            let key = storage::new_uref(rating).into();
            runtime::put_key(&movie, key);
        }
        Some(_key) => {
            //Get the URref of the named key
            let key: URef = _key.try_into().unwrap_or_revert();
            storage::write(key, rating);   
        }
    }
}
