use dotenv::dotenv;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::collections::HashMap;
use tauri::Manager;
use directories::ProjectDirs;
use tokio::fs;
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use raw_window_handle::{HasWindowHandle, RawWindowHandle, WindowHandle};

mod player;
mod locale_guard;

#[cfg_attr(mobile, tauri::mobile_entry_point)]

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PlaybackSession {
    imdb_id: String,
    timestamp: u64,
    watched: bool,
}

#[derive(Debug, Serialize, Deserialize, Default)]
pub struct PlaybackSessions {
    sessions: HashMap<String, PlaybackSession>,
}

async fn get_sessions_path() -> Result<std::path::PathBuf, String> {
    let proj_dirs = ProjectDirs::from("com", "unstrem.io", "unstrem.io")
        .ok_or_else(|| "Could not resolve project directories".to_string())?;
    let app_data_dir = proj_dirs.data_dir().to_path_buf();
    let unstrem_dir = app_data_dir.join("unstrem.io");
    fs::create_dir_all(&unstrem_dir).await.map_err(|e| e.to_string())?;
    Ok(unstrem_dir.join("playback_sessions.json"))
}

async fn load_playback_sessions(_app_handle: tauri::AppHandle) -> Result<PlaybackSessions, String> {
    let path = get_sessions_path().await?;
    if !path.exists() {
        return Ok(PlaybackSessions::default());
    }
    let mut file = fs::File::open(&path).await.map_err(|e| e.to_string())?;
    let mut contents = String::new();
    file.read_to_string(&mut contents).await.map_err(|e| e.to_string())?;
    serde_json::from_str(&contents).map_err(|e| e.to_string())
}

async fn save_playback_sessions(_app_handle: tauri::AppHandle, sessions: &PlaybackSessions) -> Result<(), String> {
    let path = get_sessions_path().await?;
    let contents = serde_json::to_string_pretty(sessions).map_err(|e| e.to_string())?;
    let mut file = fs::File::create(&path).await.map_err(|e| e.to_string())?;
    file.write_all(contents.as_bytes()).await.map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
async fn save_playback_session(app_handle: tauri::AppHandle, session: PlaybackSession) -> Result<(), String> {
    let mut sessions = load_playback_sessions(app_handle.clone()).await?;
    sessions.sessions.insert(session.imdb_id.clone(), session);
    save_playback_sessions(app_handle, &sessions).await?;
    Ok(())
}

#[tauri::command]
async fn get_playback_session(app_handle: tauri::AppHandle, imdb_id: String) -> Result<Option<PlaybackSession>, String> {
    let sessions = load_playback_sessions(app_handle).await?;
    Ok(sessions.sessions.get(&imdb_id).cloned())
}

#[tauri::command]
async fn get_trending_movies() -> Result<serde_json::Value, String> {
    println!("get_trending_movies command called");
    let client = reqwest::Client::builder()
        .user_agent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36")
        .build().map_err(|e| e.to_string())?;

    let trending_url = "https://v3-cinemeta.strem.io/catalog/movie/top.json".to_string();

    let trending_response = client.get(&trending_url).send().await.map_err(|e| {
        eprintln!("Error fetching trending movies from Cinemeta: {}", e);
        e.to_string()
    })?;
    let trending_json: Value = trending_response.json::<serde_json::Value>().await.map_err(|e| {
        eprintln!("Error parsing Cinemeta trending movies JSON: {}", e);
        e.to_string()
    })?;

    let mut movies_data: Vec<Value> = Vec::new();

    if let Some(metas) = trending_json["metas"].as_array() {
        for meta_item in metas {
            let mut movie = serde_json::Map::new();
            if let Some(imdb_id) = meta_item["imdb_id"].as_str() {
                movie.insert("id".to_string(), Value::String(imdb_id.to_string()));
                movie.insert("imdb_id".to_string(), Value::String(imdb_id.to_string()));
            } else if let Some(id) = meta_item["id"].as_str() {
                movie.insert("id".to_string(), Value::String(id.to_string()));
                movie.insert("imdb_id".to_string(), Value::String(id.to_string()));
            }
            if let Some(name) = meta_item["name"].as_str() {
                movie.insert("title".to_string(), Value::String(name.to_string()));
            }
            if let Some(poster) = meta_item["poster"].as_str() {
                movie.insert("poster_path".to_string(), Value::String(poster.to_string()));
            }
            if let Some(banner) = meta_item["background"].as_str() {
                movie.insert("backdrop_path".to_string(), Value::String(banner.to_string()));
            }
            if let Some(released) = meta_item["released"].as_str() {
                // Use 'released' field for release_date and format it to YYYY-MM-DD
                if let Some(date_part) = released.split('T').next() {
                    movie.insert("release_date".to_string(), Value::String(date_part.to_string()));
                }
            }
            if let Some(description) = meta_item["description"].as_str() {
                movie.insert("overview".to_string(), Value::String(description.to_string()));
            }
            // Cinemeta does not provide vote_average directly in catalog, setting a placeholder
            if let Some(imdb_rating) = meta_item["imdbRating"].as_str() {
                if let Ok(rating) = imdb_rating.parse::<f64>() {
                    movie.insert("vote_average".to_string(), Value::Number(serde_json::Number::from_f64(rating).unwrap()));
                } else {
                    movie.insert("vote_average".to_string(), Value::Number(serde_json::Number::from_f64(0.0).unwrap()));
                }
            } else {
                movie.insert("vote_average".to_string(), Value::Number(serde_json::Number::from_f64(0.0).unwrap()));
            }

            movies_data.push(Value::Object(movie));
        }
    }

    Ok(Value::Object(serde_json::Map::from_iter(vec![
        ("results".to_string(), Value::Array(movies_data))
    ])))
}

#[tauri::command]
async fn get_streams(id: String, r#type: String) -> Result<serde_json::Value, String> {
    dotenv().ok();
    let uuid = std::env::var("AIOSTREAMS_UUID").map_err(|e| {
        eprintln!("Error reading AIOSTREAMS_UUID: {}", e);
        e.to_string()
    })?;
    let encrypted_password = std::env::var("AIOSTREAMS_ENCRYPTED_PASSWORD").map_err(|e| {
        eprintln!("Error reading AIOSTREAMS_ENCRYPTED_PASSWORD: {}", e);
        e.to_string()
    })?;

    let url = format!(
        "https://aiostreams-sonic.lolcathost.ovh/stremio/{}/{}/stream/{}/{}.json",
        uuid,
        encrypted_password,
        r#type,
        id
    );

    let client = reqwest::Client::builder()
        .user_agent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36")
        .build().map_err(|e| e.to_string())?;

    let response = client.get(&url).send().await.map_err(|e| {
        eprintln!("Error fetching streams: {}", e);
        e.to_string()
    })?;
    let text = response.text().await.map_err(|e| {
        eprintln!("Error reading streams response body: {}", e);
        e.to_string()
    })?;
    let json = serde_json::from_str(&text).map_err(|e| {
        eprintln!("Error parsing streams JSON: {}", e);
        e.to_string()
    })?;

    Ok(json)
}

#[tauri::command]
fn play_video(state: tauri::State<AppState>, url: String) -> Result<(), String> {
    // Deprecated in favor of HTML5 element playback; keep for compatibility but no-op
    let _ = state; let _ = url; Ok(())
}

#[derive(Clone)]
struct AppState {
    player: player::PlayerHandle,
}

#[tauri::command]
fn player_load(state: tauri::State<AppState>, url: String, start_time: Option<f64>) -> Result<(), String> {
    state.player.load(url, start_time)
}

#[tauri::command]
fn player_pause_toggle(state: tauri::State<AppState>) -> Result<(), String> {
    state.player.pause_toggle()
}

#[tauri::command]
fn player_stop(state: tauri::State<AppState>) -> Result<(), String> {
    state.player.stop()
}

#[tauri::command]
fn player_seek_relative(state: tauri::State<AppState>, seconds: f64) -> Result<(), String> {
    state.player.seek_relative(seconds)
}

#[tauri::command]
fn player_seek_absolute(state: tauri::State<AppState>, seconds: f64) -> Result<(), String> {
    state.player.seek_absolute(seconds)
}

#[tauri::command]
fn player_position(state: tauri::State<AppState>) -> Result<f64, String> {
    // Prevent IPC errors if player thread died; return a friendly error instead
    state.player.position().map_err(|e| format!("player_position error: {e}"))
}

#[tauri::command]
fn player_duration(state: tauri::State<AppState>) -> Result<f64, String> {
    state.player.duration().map_err(|e| format!("player_duration error: {e}"))
}

#[tauri::command]
fn player_set_volume(state: tauri::State<AppState>, volume: f64) -> Result<(), String> {
    state.player.set_volume(volume)
}

#[tauri::command]
fn player_get_volume(state: tauri::State<AppState>) -> Result<f64, String> {
    state.player.get_volume().map_err(|e| format!("player_get_volume error: {e}"))
}

#[tauri::command]
fn player_cycle_audio(state: tauri::State<AppState>) -> Result<(), String> {
    state.player.cycle_audio()
}

#[tauri::command]
fn player_cycle_subtitle(state: tauri::State<AppState>) -> Result<(), String> {
    state.player.cycle_subtitle()
}

#[tauri::command]
fn player_toggle_subtitle_visibility(state: tauri::State<AppState>) -> Result<(), String> {
    state.player.toggle_subtitle_visibility()
}

#[tauri::command]
fn player_set_audio_track(state: tauri::State<AppState>, track_id: i64) -> Result<(), String> {
    state.player.set_audio_track(track_id)
}

#[tauri::command]
fn player_set_subtitle_track(state: tauri::State<AppState>, track_id: i64) -> Result<(), String> {
    state.player.set_subtitle_track(track_id)
}

#[tauri::command]
fn player_screenshot(state: tauri::State<AppState>, file: String, include_subs: Option<bool>) -> Result<(), String> {
    state.player.screenshot_to_file(file, include_subs.unwrap_or(true))
}

pub fn run() {
  // Prefer X11 backend on Linux so mpv can embed via Xlib when running under Wayland
  #[cfg(target_os = "linux")]
  {
    use std::env;
    let session = env::var("XDG_SESSION_TYPE").unwrap_or_default();
    let wayland_display = env::var("WAYLAND_DISPLAY").unwrap_or_default();
    if session.eq_ignore_ascii_case("wayland") || !wayland_display.is_empty() {
      // Set before winit initializes
      env::set_var("WINIT_UNIX_BACKEND", "x11");
    }
  }

  tauri::Builder::default()
    .setup(|app| {
      // Ensure LC_NUMERIC is C for libraries like mpv/FFmpeg on Linux
      unsafe { locale_guard::ensure_c_numeric_locale(); }
      // Initialize and manage a single persistent player instance
      let handle = player::spawn_player_service()?;
      // Try to embed mpv into our main window (Tauri v2: WebviewWindow implements HasWindowHandle)
      if let Some(window) = app.get_webview_window("main") {
        if let Ok(wh) = window.window_handle() {
          let raw: RawWindowHandle = wh.as_raw();
          #[cfg(target_os = "windows")]
          if let RawWindowHandle::Win32(h) = raw {
            let _ = handle.set_wid((h.hwnd as isize) as i64);
          }
          #[cfg(target_os = "linux")]
          if let RawWindowHandle::Xlib(h) = raw {
            let _ = handle.set_wid(h.window as i64);
          }
          #[cfg(target_os = "macos")]
          if let RawWindowHandle::AppKit(h) = raw {
            let _ = handle.set_wid((h.ns_view as isize) as i64);
          }
        }
      }
      let state = AppState { player: handle };
      app.manage(state);
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![
      get_trending_movies,
      get_streams,
      save_playback_session,
      get_playback_session,
      play_video,
      player_load,
      player_pause_toggle,
      player_stop,
      player_seek_relative,
      player_seek_absolute,
      player_position,
      player_duration,
      player_set_volume,
      player_get_volume,
      player_cycle_audio,
      player_cycle_subtitle,
      player_toggle_subtitle_visibility,
      player_set_audio_track,
      player_set_subtitle_track,
      player_screenshot,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
