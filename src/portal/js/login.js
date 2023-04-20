var login = (function() {

    return {
        validate: function (routerIp, clientMac, clientIp) {

            const router_key = 'b4446feaf944492dab9ebe69efe41a92';
            const router_id = '996e83d7844145cfbc7e3f1ca2832fa2';

            document.sendin.username.value = document.login.username.value;

            const dto = {   login: document.sendin.username.value,
                            routerId: router_id,
                            routerKey: router_key,
                            routerIP: routerIp,
                            clientMac: clientMac,
                            clientIP: clientIp 
                        };

            const session = JSON.stringify(dto);

            const xhr = new XMLHttpRequest();
            const method = "POST";
            const url = 'https://devhotspotapi.bao.co.tz/api/Voucher/CreateSession';

            xhr.open(method, url, true);
            xhr.setRequestHeader('content-type', 'application/json;charset=UTF-8');           
            xhr.onreadystatechange = () => {

                if (xhr.readyState === XMLHttpRequest.DONE) {
                    const status = xhr.status;

                    if (status === 0 || (status >= 200 && status < 400)) {

                        document.sendin.password.value =  xhr.responseText.replace(/\"/g, '');
                        document.sendin.submit();
                    }
                    else {
                        console.error(`request error: ${xhr.responseText}`);
                    }
                }
            };

            xhr.send(session);
        }
    };
})();