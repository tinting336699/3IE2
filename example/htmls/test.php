<?php
// 新しい単語の追加
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
if($_COOKIE["user_id"] == "aaa"){
    $type = $_POST['type'];
    $word = $_POST['word'];
    $mean = $_POST['mean'];
    $id = $_POST['id'];
    $userid = $_POST['userid'];

    $url = 'https://github-test.ryutokojou.workers.dev/';

    $post_fields = array(
        "type" => $type,
        "word"=> $word,
        "mean"=> $mean,
        "id"=> $id,
        "userid"=> $userid,
        "token"=> $_COOKIE["user_id"],
        "name"=> $_COOKIE["user_name"]
    );
    $headers = array(
        "Authorization: ".$_COOKIE["user_id"],
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

}else{
echo "error";
}
}
?>