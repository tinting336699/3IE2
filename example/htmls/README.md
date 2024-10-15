"# t-htmls"
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>勉強用サイトのテストページ</title>
    <meta name="description" content="勉強用サイトの機能をテストするページです" />
    <meta name="robots" content="noindex,nofollow">
    <link rel="stylesheet" href="./test.css" />
    <!-- <script src="./test.js" defer></script> -->
    <meta name=”author” content="ryutokojou">
</head>

<body id="body">
    <!-- iframe読み込み -->
    <label class="label">
        <div class="hamburger-menu">
            <input type="checkbox" id="menu-btn-check">
            <label for="menu-btn-check" class="menu-btn"><span></span></label>
            <div class="menu-content">
                <ul>
                    <li>
                        <a href="#">login</a>
                    </li>
                    <li>
                        <a href="https://forstudy.cloudfree.jp/form.html">単語帳</a>
                    </li>
                    <!-- <li>
                            <a href="#">メニューリンク3</a>
                        </li> -->
                </ul>
            </div>
        </div>
        <a class="title" href="#">勉強アシスト</a>
        <div id="account"></div>
    </label>
    <!-- コンテンツ開始 -->
    <script>
        var data = {
            type: "",
            id: "",
            userid: "",
            word: "",
            mean: ""
        }
            (async () => {
                console.log(await getdata())
            })();
        async function getdata() {
            data.type = document.getElementById("type").value
            data.id = document.getElementById("id").value
            data.userid = document.getElementById("userid").value
            data.word = document.getElementById("word").value
            data.mean = document.getElementById("mean").value;
            const headers = new Headers();
            headers.append('Content-Type', 'application/x-www-form-urlencoded');

            const body = `type=${data.type}&word=${data.word}&mean=${data.mean}&id=${data.id}&userid=${data.userid}`;

            const init = {
                method: 'POST',
                headers,
                body
            };

            const response = await fetch('https://forstudy.cloudfree.jp/test.php', init);
            console.log(`response status is ${response.status}`);
            const mediaType = response.headers.get('content-type');
            let data2;
            if (mediaType.includes('json')) {
                data2 = await response.json();
            } else {
                data2 = await response.text();
            }
            console.log(data2);
            document.getElementById("show").innerHTML = data2
            return data2
        }
    </script>
</body>

</html>