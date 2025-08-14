use libc::{setlocale, LC_NUMERIC};
use std::ffi::CString;

// On Linux, some native libraries require LC_NUMERIC=C, otherwise parsing can break.
// SAFETY: called once during setup before any mpv/ffmpeg work.
pub unsafe fn ensure_c_numeric_locale() {
    let c_locale = CString::new("C").unwrap();
    let _ = setlocale(LC_NUMERIC, c_locale.as_ptr());
}


