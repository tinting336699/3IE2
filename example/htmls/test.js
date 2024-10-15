var data = {
    type: "",
    id: "",
    userid: "",
    word: "",
    mean: ""
}
document.getElementById("json").addEventListener("click",() =>{
    data.type = document.getElementById("type").value
    data.id = document.getElementById("id").value
    data.userid = document.getElementById("userid").value
    data.word = document.getElementById("word").value
    data.mean = document.getElementById("mean").value
    // var response = fetch("https://github-test.ryutokojou.workers.dev/",{
    //     method:"post",
    //     headers:JSON.stringify(
    //         {Authorization:"aaa"}
    //     ),
    //     body:JSON.stringify(data)
    // }).then((response) => response.json)
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'aaa');

    const body = `{"type":"${data.type}","id":${data.id},"word":"${data.word}","mean":"${data.mean}","userid":${data.userid}}`;

    const init = {
    method: 'POST',
    headers,
    body
    };

    var response = fetch('https://github-test.ryutokojou.workers.dev/', init)
    .then((response) => {
        document.getElementById("show").innerHTML = response.json(); // or .text() or .blob() ...
    })
    .then((text) => {
        document.getElementById("show").innerHTML = text.text()
    // text is the response body
    })
    .catch((e) => {
    // error in e.message
    });
    document.getElementById("show").innerHTML = response
})