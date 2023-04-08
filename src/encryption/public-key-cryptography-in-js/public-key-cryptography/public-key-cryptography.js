//import the libraries

const request = require('request');
const nacl = require('tweetnacl');
nacl.util = require('tweetnacl-util');

//generating the key pairs
// const david = nacl.box.keyPair();
// const viktoria = nacl.box.keyPair();
// console.log(nacl.util.encodeBase64(david.publicKey), nacl.util.encodeBase64(david.secretKey));
// console.log(nacl.util.encodeBase64(viktoria.publicKey), nacl.util.encodeBase64(viktoria.secretKey));
// const router_secretKey = 'jJZcxh5D/+nX86cFguUYNK2W3M/JLTzkpCgwD8Oi1Zk=';
// const portal_publicKey = 'AD6Imf19oyhsP3GLnOORPLbdy4t3VMidBEvRko0SyzE=';
// const portal_secretKey = 'aHijiLBvI21TtkvlaLgZ/8x7rnOfAkp2IOLG/Vo1em8=';
// const router_publicKey = 'pMq1jrJ84k12Q3orWY5KfovmYlnDSUEQ/3HFRFGuXGQ=';

const router_key = 'b4446feaf944492dab9ebe69efe41a92';
const router_id = '996e83d7844145cfbc7e3f1ca2832fa2';

function davidEncrypting(){
    const dto = { key: router_key};
    const session = JSON.stringify(dto);

    request.post({
        url: `http://localhost:8080/api/Voucher/StartSession`,
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
                login: '1Bao57de',
                routerId: router_id,
                routerIP: '127.0.0.1',
                clientMac: '00:00:00:00:00:00',
                clientIP: '127.0.0.1'
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

                    console.log(JSON.stringify(body));

                });
    });

    return '';

/*
    //messagereturn to be sent to Viktoria
    const message_in_transit = {cipher_text, one_time_code};
    const dto = { key: router_key};
    const session = JSON.stringify(dto);

    request.post({
        url: `http://localhost:8080/api/Voucher/StartSession`,
        method: 'POST',
        body: session,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Content-Length': session.length
        }},
        function (error, response, body){
            console.log(response);
        });

    //return message_in_transit;
    const body = JSON.stringify({ CipherText: nacl.util.encodeBase64(cipher_text),
                                    Code: nacl.util.encodeBase64(one_time_code),
                                    Key: router_key });

    console.log("body: " + body);

    request.post({
        url: 'http://localhost:8080/api/Voucher/SaveSession',
        method: 'POST',
        body: body,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Content-Length': body.length
        }},
        function (error, response, body){
            console.log(response);
        });
*/
    return message_in_transit;
};

/*
function viktoriaDecrypting(message){
    //Get the decoded message
    let decoded_message = nacl.box.open(message.cipher_text,
                                        message.one_time_code,
                                        nacl.util.decodeBase64(router_publicKey),
                                        nacl.util.decodeBase64(portal_secretKey),
                                        );

    //Get the human readable message
    let plain_text = nacl.util.encodeUTF8(decoded_message)

    //return the plaintext
    return plain_text;
};
*/

let ciphertext = davidEncrypting();
//console.log(viktoriaDecrypting(ciphertext));