//! Closed fictional TCP status source used through the actual Rust application.
use crate::{Check, check};
use std::{net::SocketAddr, sync::{Arc, atomic::{AtomicBool,AtomicU64,Ordering}}, time::Duration};
use tokio::{io::{AsyncReadExt,AsyncWriteExt}, net::TcpListener, task::JoinHandle};
pub struct Gateway { pub address: SocketAddr, task: JoinHandle<()>, calls: Arc<AtomicU64>, invalid: Arc<AtomicBool> }
impl Gateway {
    pub async fn start() -> Check<Self> {
        let listener=TcpListener::bind("127.0.0.1:0").await.map_err(|_| "game status fixture listener")?;
        let address=listener.local_addr().map_err(|_| "game status fixture address")?;
        let calls=Arc::new(AtomicU64::new(0));let invalid=Arc::new(AtomicBool::new(false));
        let c=calls.clone();let bad=invalid.clone();
        let task=tokio::spawn(async move {
            loop {
                let Ok((mut socket,_))=listener.accept().await else {break};
                let okay=tokio::time::timeout(Duration::from_secs(3),async {
                    let expected=b"\x13\x00\xff\x05\x0cplay.example\x63\xdd\x01\x01\x00";
                    let mut input=vec![0;expected.len()];socket.read_exact(&mut input).await.map_err(|_| ())?;
                    if input!=expected {return Err(());}
                    c.fetch_add(1,Ordering::SeqCst);
                    let json=r#"{"version":{"name":"Sleeping • Join to wake","protocol":767},"players":{"online":0,"max":20},"description":{"text":"Fictional sleeping game"}}"#;
                    let size=|n:usize| if n<128 {vec![n as u8]} else {vec![((n&127) as u8)|128,(n>>7) as u8]};
                    let mut body=vec![0];body.extend(size(json.len()));body.extend(json.as_bytes());let mut packet=size(body.len());packet.extend(body);
                    socket.write_all(&packet).await.map_err(|_| ())?;let mut extra=[0];
                    if socket.read(&mut extra).await.map_err(|_| ())? != 0 {return Err(());}
                    Ok::<(),()>(())
                }).await;
                if !matches!(okay,Ok(Ok(()))) {bad.store(true,Ordering::SeqCst);}
            }
        });
        Ok(Self {address,task,calls,invalid})
    }
    pub fn checked(&self) -> Check<()> {
        check(self.calls.load(Ordering::SeqCst)>0&&!self.invalid.load(Ordering::SeqCst),"actual game gateway saw status-only literal packets and no login or wake")
    }
    pub async fn close(mut self) -> Check<()> {
        self.checked()?;self.task.abort();let result=(&mut self.task).await;
        check(result.is_err_and(|e|e.is_cancelled()),"game status fixture is stopped")
    }
}
impl Drop for Gateway {fn drop(&mut self){self.task.abort();}}
