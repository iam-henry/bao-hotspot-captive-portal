
var session = (function() {

    return {
        start: function (routerIp, clientMac, clientIp) {
            const router_id = '996e83d7844145cfbc7e3f1ca2832fa2';
            const router_key = 'b4446feaf944492dab9ebe69efe41a92';
            
            document.sendin.username.value = document.login.username.value;
            
            const dto = { key: router_id};
            const session = JSON.stringify(dto);

            const xhrSession = new XMLHttpRequest();
            const sessionUrl = "https://devhotspotapi.bao.co.tz/api/Voucher/StartSession";
            const method = "POST";

            xhrSession.open(method, sessionUrl, true);
            xhrSession.setRequestHeader("content-type", "application/json;charset=UTF-8");
            xhrSession.onreadystatechange = function() {

                if (xhrSession.readyState === XMLHttpRequest.DONE) {
                    const status = xhrSession.status;

                    if (status === 0 || (status >= 200 && status < 400)) {
                        
                        console.log(JSON.stringify('response: ' + xhrSession.responseText));
                        const one_time_code = nacl.randomBytes(24);
                        const router = JSON.parse(xhrSession.responseText);

                        var voucherDto = { 
                            login: document.login.username.value,
                            routerId : router_id,
                            routerKey: router_key,
                            routerIP: routerIp,
                            clientMac: clientMac,
                            clientIP: clientIp
                        };
                    
                        const encoder = new TextEncoder();

                        // Get the cipher text
                        const cipher_text = nacl.box(
                            encoder.encode(JSON.stringify(voucherDto)),
                            one_time_code,
                            Uint8Array.from(atob(router.result.pub), c => c.charCodeAt(0)),
                            Uint8Array.from(atob(router.result.pki), c => c.charCodeAt(0))
                        );

                        const envelope = JSON.stringify({ CipherText:  btoa(String.fromCharCode.apply(null, new Uint8Array(cipher_text))),
                                                            Code: btoa(String.fromCharCode.apply(null, new Uint8Array(one_time_code))),
                                                            Key: router_id });

                        const xhr = new XMLHttpRequest();
                        const url = "https://devhotspotapi.bao.co.tz/api/Voucher/SaveSession";
                        const method = "POST";

                        xhr.open(method, url, true);
                        xhr.setRequestHeader("content-type", "application/json;charset=UTF-8");
                        xhr.onreadystatechange = function() {
                            if (xhr.readyState === XMLHttpRequest.DONE) {
                                const status = xhr.status;

                                if (status === 0 || (status >= 200 && status < 400)) {
                                    console.log(xhr.responseText);

                                    const response = JSON.parse(xhr.responseText);
                                    document.sendin.password.value = response.result;
                                    document.sendin.submit();
                                }
                            }
                        };

                        xhr.send(envelope);
                    }
                }
            };

            xhrSession.send(session);
        }
    };
})();
