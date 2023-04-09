
const router_key = 'b4446feaf944492dab9ebe69efe41a92';
const router_id = '996e83d7844145cfbc7e3f1ca2832fa2';

function startSession() {

    document.sendin.username.value = document.login.username.value;

    var voucher = document.login.username.value;
    var routerIp = '$(server-address)';
    var clientMac = '$(mac)';
    var clientIp = '$(ip)';

    const dto = { key: router_key};
    const session = JSON.stringify(dto);

    request.post({
        url: `http://devhotspotapi.bao.co.tz/api/Voucher/StartSession`,
        method: 'POST',
        body: session,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Content-Length': session.length
        }}, 
        function (error, response, body){
            console.log(JSON.stringify(body));
            const one_time_code = nacl.randomBytes(24);
            const router = JSON.parse(body);

            var voucherDto = { 
                login: voucher,
                routerId: router_id,
                routerIP: routerIp,
                clientMac: clientMac,
                clientIP: clientIp
              };
        
            // Get the cipher text
            const cipher_text = nacl.box(
                nacl.util.decodeUTF8(JSON.stringify(voucherDto)),
                one_time_code,
                nacl.util.decodeBase64(router.result.pub),
                nacl.util.decodeBase64(router.result.pki)
            );
        
            const envelope = JSON.stringify({ CipherText: nacl.util.encodeBase64(cipher_text),
                                                Code: nacl.util.encodeBase64(one_time_code),
                                                Key: router_key });

            request.post({
                url: `http://localhost:8080/api/Voucher/SaveSession`,
                method: 'POST',
                body: envelope,
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Content-Length': envelope.length
                }},
                function (error, response, body){

                    document.sendin.password.value = hexMD5('$(chap-id)' + body + '$(chap-challenge)');
                    document.sendin.submit();
                });
    });

};

export { startSession };
