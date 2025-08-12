use dotenv::dotenv;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::collections::HashMap;
use directories::ProjectDirs;
use tokio::fs;
use tokio::io::{AsyncReadExt, AsyncWriteExt};

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
        "https://aiostreams-pot.alc.dpdns.org/stremio/{}/{}/stream/{}/{}.json",
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

pub fn run() {
  tauri::Builder::default()
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    
    .invoke_handler(tauri::generate_handler![get_trending_movies, get_streams, save_playback_session, get_playback_session])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
