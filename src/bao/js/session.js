
function startSession() {
    
    console.log('start session');

    const router_key = 'b4446feaf944492dab9ebe69efe41a92';
    const router_id = '996e83d7844145cfbc7e3f1ca2832fa2';

    // alert('server address:' + '$(server-address)');
    // alert('server mac: $(mac)');
    // alert('server ip: $(ip)');

    // console.log('start session');
    // console.log('server address: $(server-address)');
    // console.log('server mac: $(mac)');
    // console.log('server ip: $(ip)');

    document.sendin.username.value = document.login.username.value;

    const dto = { login: document.sendin.username.value };
    const session = JSON.stringify(dto);

    const xhr = new XMLHttpRequest();
    const method = "POST";
    const url = 'https://devhotspotapi.bao.co.tz/api/Voucher/CreateSession';

    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-type', 'application/json;charset=UTF-8');           
    xhr.onreadystatechange = () => {

        console.log('xhr state change');

        if (xhr.readyState === XMLHttpRequest.DONE) {
            const status = xhr.status;

            if (status === 0 || (status >= 200 && status < 400)) {
                console.log(xhr.responseText);
                var password = xhr.responseText.replace(/\"/g, '');

                document.sendin.password.value = hexMD5('$(chap-id)' + password + '$(chap-challenge)');
                document.sendin.submit();
                return false;
            }
            else {
                console.error("request error");
            }
        }
    };

    console.log('sending xhr request');
    xhr.send(session);
}
