<?php
// 新しい単語の追加
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $word = $_POST['word'];
    $userid= $_POST['userid'];

    $url = 'https://github-test.ryutokojou.workers.dev/';

    $post_fields = array(
        "type" => "login",
        "userid"=> $userid,
        "word"=> $word,
        "token"=>"aaa"
    );
    $headers = array(
        "Authorization: aaa",
        "Content-type: application/json"
    );

    // curlのセッションを初期化する
    $ch = curl_init();

    // curlのオプションを設定する
    $options = array(
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($post_fields)
    );
    curl_setopt_array($ch, $options);

    // curlを実行し、レスポンスデータを保存する
    $response = curl_exec($ch);
    echo $response;
    // curlセッションを終了する
    curl_close($ch);
    setcookie("user_name",$_POST['userid'],time()+60*60*24*3,"/","",true,true);
    setcookie("user_id",$response,time()+60*60*24*3,"/","",true,true);
}
?>