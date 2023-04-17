
var session = (function() {
    
    const router_key = 'b4446feaf944492dab9ebe69efe41a92';
    const router_id = '996e83d7844145cfbc7e3f1ca2832fa2';

    return {
        start: function () {

            var voucher = document.login.username.value;
            var routerIp = '$(server-address)';
            var clientMac = '$(mac)';
            var clientIp = '$(ip)';

            routerIp = routerIp.substring(0, routerIp.indexOf(':'));

            const dto = { key: router_key};
            const session = JSON.stringify(dto);

            var baseUrl = "https://devhotspotapi.bao.co.tz/api/Voucher/StartSession"
            var xhttp = new XMLHttpRequest();
            xhttp.open("POST", baseUrl, true);
            xhttp.setRequestHeader("Content-type", "application/json;charset=UTF-8");
            xhttp.send(session);

            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    
                    console.log(JSON.stringify('response: ' + this.responseText));
                    const one_time_code = nacl.randomBytes(24);
                    const router = JSON.parse(this.responseText);

                    var voucherDto = { 
                        login: voucher,
                        routerId: router_id,
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
                                                        Key: router_key });

                    var baseUrl = "https://devhotspotapi.bao.co.tz/api/Voucher/SaveSession"
                    var xhttp = new XMLHttpRequest();
                    xhttp.open("POST", baseUrl, true);
                    xhttp.setRequestHeader("Content-type", "application/json;charset=UTF-8");
                    xhttp.send(envelope);

                    xhttp.onreadystatechange = function() {
                        if (this.readyState == 4 && this.status == 200) {
                            var password = this.responseText.replace(/\"/g, '');
                            
                            document.sendin.username.value = document.login.username.value;
                            document.sendin.password.value = hexMD5('$(chap-id)' + password + '$(chap-challenge)');
                            document.sendin.submit();
                        }
                    };
                }
            };
        }
    };
})();
