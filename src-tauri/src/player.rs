use libmpv2::Mpv;
use std::error::Error;
use std::sync::mpsc::{self, Receiver, Sender};
use std::thread;

pub struct VideoPlayer {
    mpv: Mpv,
}

impl VideoPlayer {
    pub fn new() -> Result<Self, Box<dyn Error>> {
        let mpv = Mpv::new()?;
        let _ = mpv.set_property("hwdec", "auto-safe");
        let _ = mpv.set_property("cache", "yes");
        let _ = mpv.set_property("cache-secs", 10);
        let _ = mpv.set_property("demuxer-max-bytes", 128i64 * 1024 * 1024);
        let _ = mpv.set_property("demuxer-readahead-secs", 60);
        let _ = mpv.set_property("user-agent", "unstrem.io/1.0");
        let _ = mpv.set_property("keep-open", "yes");
        let _ = mpv.set_property("force-window", "yes");
        Ok(Self { mpv })
    }

    fn load(&self, url: &str, start_time: Option<f64>) -> Result<(), Box<dyn Error>> {
        if let Some(t) = start_time {
            let _ = self.mpv.set_property("start", t);
        }
        self.mpv.command("loadfile", &[url])?;
        Ok(())
    }

    fn pause_toggle(&self) -> Result<(), Box<dyn Error>> {
        let paused: bool = self.mpv.get_property("pause")?;
        self.mpv.set_property("pause", !paused)?;
        Ok(())
    }

    fn stop(&self) -> Result<(), Box<dyn Error>> {
        self.mpv.command("stop", &[])?;
        // Reset properties that may affect next load
        let _ = self.mpv.set_property("pause", false);
        Ok(())
    }

    fn seek_relative(&self, seconds: f64) -> Result<(), Box<dyn Error>> {
        self.mpv.command("seek", &[&seconds.to_string(), "relative", "exact"]) ?;
        Ok(())
    }

    fn seek_absolute(&self, seconds: f64) -> Result<(), Box<dyn Error>> {
        self.mpv.set_property("time-pos", seconds)?;
        Ok(())
    }

    fn position(&self) -> Result<f64, Box<dyn Error>> {
        let pos: f64 = self.mpv.get_property("time-pos")?;
        Ok(pos)
    }

    fn duration(&self) -> Result<f64, Box<dyn Error>> {
        let dur: f64 = self.mpv.get_property("duration")?;
        Ok(dur)
    }

    fn set_volume(&self, volume: f64) -> Result<(), Box<dyn Error>> {
        self.mpv.set_property("volume", volume)?;
        Ok(())
    }

    fn get_volume(&self) -> Result<f64, Box<dyn Error>> {
        let vol: f64 = self.mpv.get_property("volume")?;
        Ok(vol)
    }

    fn cycle_audio(&self) -> Result<(), Box<dyn Error>> {
        self.mpv.command("cycle", &["audio"]) ?;
        Ok(())
    }

    fn cycle_subtitle(&self) -> Result<(), Box<dyn Error>> {
        self.mpv.command("cycle", &["sub"]) ?;
        Ok(())
    }

    fn toggle_subtitle_visibility(&self) -> Result<(), Box<dyn Error>> {
        let vis: bool = self.mpv.get_property("sub-visibility")?;
        self.mpv.set_property("sub-visibility", !vis)?;
        Ok(())
    }

    fn set_audio_track(&self, track_id: i64) -> Result<(), Box<dyn Error>> {
        self.mpv.set_property("aid", track_id)?;
        Ok(())
    }

    fn set_subtitle_track(&self, track_id: i64) -> Result<(), Box<dyn Error>> {
        self.mpv.set_property("sid", track_id)?;
        Ok(())
    }

    fn screenshot_to_file(&self, file: &str, include_subs: bool) -> Result<(), Box<dyn Error>> {
        let mode = if include_subs { "subtitles" } else { "video" };
        self.mpv.command("screenshot-to-file", &[file, mode])?;
        Ok(())
    }
}

pub enum PlayerCommand {
    Load { url: String, start_time: Option<f64> },
    PauseToggle,
    Stop,
    SeekRelative { seconds: f64 },
    SeekAbsolute { seconds: f64 },
    SetVolume { volume: f64 },
    GetVolume { reply: Sender<Result<f64, String>> },
    Position { reply: Sender<Result<f64, String>> },
    Duration { reply: Sender<Result<f64, String>> },
    CycleAudio,
    CycleSubtitle,
    ToggleSubtitleVisibility,
    SetAudioTrack { track_id: i64 },
    SetSubtitleTrack { track_id: i64 },
    Screenshot { file: String, include_subs: bool },
}

#[derive(Clone)]
pub struct PlayerHandle {
    tx: Sender<PlayerCommand>,
}

impl PlayerHandle {
    pub fn load(&self, url: String, start_time: Option<f64>) -> Result<(), String> {
        self.tx
            .send(PlayerCommand::Load { url, start_time })
            .map_err(|e| e.to_string())
    }

    pub fn pause_toggle(&self) -> Result<(), String> {
        self.tx.send(PlayerCommand::PauseToggle).map_err(|e| e.to_string())
    }

    pub fn stop(&self) -> Result<(), String> {
        self.tx.send(PlayerCommand::Stop).map_err(|e| e.to_string())
    }

    pub fn seek_relative(&self, seconds: f64) -> Result<(), String> {
        self.tx
            .send(PlayerCommand::SeekRelative { seconds })
            .map_err(|e| e.to_string())
    }

    pub fn seek_absolute(&self, seconds: f64) -> Result<(), String> {
        self.tx
            .send(PlayerCommand::SeekAbsolute { seconds })
            .map_err(|e| e.to_string())
    }

    pub fn set_volume(&self, volume: f64) -> Result<(), String> {
        self.tx
            .send(PlayerCommand::SetVolume { volume })
            .map_err(|e| e.to_string())
    }

    pub fn get_volume(&self) -> Result<f64, String> {
        let (tx, rx) = mpsc::channel();
        self.tx
            .send(PlayerCommand::GetVolume { reply: tx })
            .map_err(|e| e.to_string())?;
        rx.recv().map_err(|e| e.to_string())?
    }

    pub fn position(&self) -> Result<f64, String> {
        let (tx, rx) = mpsc::channel();
        self.tx
            .send(PlayerCommand::Position { reply: tx })
            .map_err(|e| e.to_string())?;
        rx.recv().map_err(|e| e.to_string())?
    }

    pub fn duration(&self) -> Result<f64, String> {
        let (tx, rx) = mpsc::channel();
        self.tx
            .send(PlayerCommand::Duration { reply: tx })
            .map_err(|e| e.to_string())?;
        rx.recv().map_err(|e| e.to_string())?
    }

    pub fn cycle_audio(&self) -> Result<(), String> {
        self.tx
            .send(PlayerCommand::CycleAudio)
            .map_err(|e| e.to_string())
    }

    pub fn cycle_subtitle(&self) -> Result<(), String> {
        self.tx
            .send(PlayerCommand::CycleSubtitle)
            .map_err(|e| e.to_string())
    }

    pub fn toggle_subtitle_visibility(&self) -> Result<(), String> {
        self.tx
            .send(PlayerCommand::ToggleSubtitleVisibility)
            .map_err(|e| e.to_string())
    }

    pub fn set_audio_track(&self, track_id: i64) -> Result<(), String> {
        self.tx
            .send(PlayerCommand::SetAudioTrack { track_id })
            .map_err(|e| e.to_string())
    }

    pub fn set_subtitle_track(&self, track_id: i64) -> Result<(), String> {
        self.tx
            .send(PlayerCommand::SetSubtitleTrack { track_id })
            .map_err(|e| e.to_string())
    }

    pub fn screenshot_to_file(&self, file: String, include_subs: bool) -> Result<(), String> {
        self.tx
            .send(PlayerCommand::Screenshot { file, include_subs })
            .map_err(|e| e.to_string())
    }
}

pub fn spawn_player_service() -> Result<PlayerHandle, Box<dyn Error>> {
    let (tx, rx): (Sender<PlayerCommand>, Receiver<PlayerCommand>) = mpsc::channel();
    // Notify the spawner whether initialization succeeded
    let (ready_tx, ready_rx) = mpsc::channel();
    thread::spawn(move || {
        let inner = VideoPlayer::new();
        match inner {
            Ok(player) => {
                let _ = ready_tx.send(Ok::<(), String>(())) ;
                while let Ok(cmd) = rx.recv() {
                    match cmd {
                        PlayerCommand::Load { url, start_time } => {
                            if let Err(e) = player.load(&url, start_time) { eprintln!("load error: {e}"); }
                        }
                        PlayerCommand::PauseToggle => { if let Err(e) = player.pause_toggle() { eprintln!("pause error: {e}"); } }
                        PlayerCommand::Stop => { if let Err(e) = player.stop() { eprintln!("stop error: {e}"); } }
                        PlayerCommand::SeekRelative { seconds } => { if let Err(e) = player.seek_relative(seconds) { eprintln!("seek rel error: {e}"); } }
                        PlayerCommand::SeekAbsolute { seconds } => { if let Err(e) = player.seek_absolute(seconds) { eprintln!("seek abs error: {e}"); } }
                        PlayerCommand::SetVolume { volume } => { if let Err(e) = player.set_volume(volume) { eprintln!("volume error: {e}"); } }
                        PlayerCommand::GetVolume { reply } => {
                            let _ = reply.send(player.get_volume().map_err(|e| e.to_string()));
                        }
                        PlayerCommand::Position { reply } => {
                            let _ = reply.send(player.position().map_err(|e| e.to_string()));
                        }
                        PlayerCommand::Duration { reply } => {
                            let _ = reply.send(player.duration().map_err(|e| e.to_string()));
                        }
                        PlayerCommand::CycleAudio => { if let Err(e) = player.cycle_audio() { eprintln!("cycle audio error: {e}"); } }
                        PlayerCommand::CycleSubtitle => { if let Err(e) = player.cycle_subtitle() { eprintln!("cycle sub error: {e}"); } }
                        PlayerCommand::ToggleSubtitleVisibility => { if let Err(e) = player.toggle_subtitle_visibility() { eprintln!("toggle sub vis error: {e}"); } }
                        PlayerCommand::SetAudioTrack { track_id } => { if let Err(e) = player.set_audio_track(track_id) { eprintln!("set aid error: {e}"); } }
                        PlayerCommand::SetSubtitleTrack { track_id } => { if let Err(e) = player.set_subtitle_track(track_id) { eprintln!("set sid error: {e}"); } }
                        PlayerCommand::Screenshot { file, include_subs } => { if let Err(e) = player.screenshot_to_file(&file, include_subs) { eprintln!("screenshot error: {e}"); } }
                    }
                }
            }
            Err(e) => {
                let _ = ready_tx.send(Err::<(), String>(e.to_string()));
            }
        }
    });

    match ready_rx.recv() {
        Ok(Ok(())) => Ok(PlayerHandle { tx }),
        Ok(Err(msg)) => Err(Box::new(std::io::Error::new(std::io::ErrorKind::Other, msg))),
        Err(recv_err) => Err(Box::new(std::io::Error::new(std::io::ErrorKind::Other, format!("player init channel error: {recv_err}"))))
    }
}
