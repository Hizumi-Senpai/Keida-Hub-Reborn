//! Independent literal wire expectations from issue45: actual TCP status only.
use super::*;
use tokio::{net::TcpListener, io::{AsyncReadExt,AsyncWriteExt}};
const ID: &str = "11111111-2222-3333-4444-555555555555";
fn document(endpoint: SocketAddr) -> String {
    format!(r#"{{"format":1,"endpoint":"{endpoint}","routes":[{{"server_id":"{ID}","hostname":"play.example","public_port":25570}}]}}"#)
}
fn fixture_frame(json: &str) -> Vec<u8> {
    fn two_byte_size(value: usize) -> Vec<u8> {
        assert!(value < 16384);
        if value < 128 { vec![value as u8] } else { vec![((value & 127) as u8)|128,(value>>7) as u8] }
    }
    let mut body=vec![0];body.extend(two_byte_size(json.len()));body.extend(json.as_bytes());
    let mut out=two_byte_size(body.len());out.extend(body);out
}
#[test]
fn route_input_is_bounded_and_closed_without_a_path_or_command_override() {
    let valid=document("127.0.0.1:25570".parse().unwrap());
    assert!(Routes::parse(&valid).is_ok());
    for changed in [valid.replace("\"format\":1","\"format\":2"),valid.replace("25570","0"),valid.replace("play.example","../config"),valid.replace("play.example","https://private.invalid"),valid.replace("play.example","a..example"),valid.replace("play.example","-host.example"),valid.replace("127.0.0.1:25570","0.0.0.0:25570"),valid.replace("\"routes\":", "\"command\":\"wake\",\"routes\":"),valid.replace("\"format\":1", "\"format\":1,\"format\":1")] {
        assert!(Routes::parse(&changed).is_err(),"invalid route input admitted");
    }
    assert!(Routes::parse(&" ".repeat(16385)).is_err());
    let route=serde_json::json!({"server_id":ID,"hostname":"play.example","public_port":25570});
    assert!(Routes::parse(&serde_json::json!({"format":1,"endpoint":"127.0.0.1:25570","routes":[route.clone(),route]}).to_string()).is_err());
}
#[tokio::test]
async fn actual_tcp_status_wire_contains_no_login_or_wake_and_discards_placeholder_counts() {
    for (name,expected) in [("Sleeping • Join to wake","sleeping"),("Waking up","starting"),("Updating modpack","updating"),("Status unavailable","unavailable"),("1.21.1","online")] {
        let listener=TcpListener::bind("127.0.0.1:0").await.unwrap();let endpoint=listener.local_addr().unwrap();
        let reply=fixture_frame(&format!(r#"{{"version":{{"name":"{name}","protocol":767}},"players":{{"online":7,"max":20}},"description":{{"text":"fixture-private-unrelated-text"}}}}"#));
        let server=tokio::spawn(async move {
            let (mut stream,_)=listener.accept().await.unwrap();
            let expected=b"\x13\x00\xff\x05\x0cplay.example\x63\xe2\x01\x01\x00";
            let mut request=vec![0;expected.len()];stream.read_exact(&mut request).await.unwrap();assert_eq!(&request,expected);
            stream.write_all(&reply).await.unwrap();let mut extra=[0u8;1];
            assert_eq!(tokio::time::timeout(Duration::from_secs(1),stream.read(&mut extra)).await.unwrap().unwrap(),0,"unexpected extra packet after status");
        });
        let routes=Routes::parse(&document(endpoint)).unwrap();let out=routes.collect(&[ID.into()]).await;
        let status=&out[ID];assert_eq!(status.state,expected);assert_eq!(status.source,"join-gateway-v1");assert_eq!(status.freshness,"fresh");
        assert_eq!(status.players,if expected=="online" {Some(7)} else {None});assert_eq!(status.capacity,if expected=="online" {Some(20)} else {None});
        let public=serde_json::to_string(status).unwrap();assert!(!public.contains("fixture-private-unrelated-text"));server.await.unwrap();
    }
}
#[tokio::test]
async fn unselected_routes_send_nothing_and_wrong_shapes_are_not_sleep() {
    let listener=TcpListener::bind("127.0.0.1:0").await.unwrap();let routes=Routes::parse(&document(listener.local_addr().unwrap())).unwrap();
    assert!(routes.collect(&["99999999-9999-9999-9999-999999999999".into()]).await.is_empty());
    assert!(tokio::time::timeout(Duration::from_millis(30),listener.accept()).await.is_err());
    for raw in [r#"{"version":{"name":"Sleeping • Join to wake","protocol":1}}"#,r#"{"version":{"name":"other","protocol":767}}"#,r#"{"version":{"name":"other","protocol":767},"players":{"online":-1,"max":20}}"#,r#"{"version":{"name":"Waking up","name":"Sleeping • Join to wake","protocol":767}}"#] {
        let frame=fixture_frame(raw);let prefix=if frame[0]&128==0 {1} else {2};assert!(decode(&frame[prefix..]).is_err());
    }
}
#[tokio::test]
async fn stalled_status_has_a_terminal_deadline_without_any_new_request() {
    let listener=TcpListener::bind("127.0.0.1:0").await.unwrap();let routes=Routes::parse(&document(listener.local_addr().unwrap())).unwrap();
    let server=tokio::spawn(async move {let (stream,_)=listener.accept().await.unwrap();std::hint::black_box(&stream);std::future::pending::<()>().await;});
    let at=std::time::Instant::now();let result=routes.collect(&[ID.into()]).await;
    assert_eq!(result[ID].state,"unavailable");assert_eq!(result[ID].error,Some("timeout"));assert_eq!(result[ID].players,None);
    assert!(at.elapsed()<Duration::from_secs(2));server.abort();assert!(server.await.unwrap_err().is_cancelled());
}
