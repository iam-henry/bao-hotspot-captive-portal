//import the libraries

const request = require('request');
const nacl = require('tweetnacl');
nacl.util = require('tweetnacl-util');

//generating the key pairs
 const david = nacl.box.keyPair();
 const viktoria = nacl.box.keyPair();

 console.log(nacl.util.encodeBase64(david.publicKey), nacl.util.encodeBase64(david.secretKey));
 console.log(nacl.util.encodeBase64(viktoria.publicKey), nacl.util.encodeBase64(viktoria.secretKey));

const david_publicKey = 'pMq1jrJ84k12Q3orWY5KfovmYlnDSUEQ/3HFRFGuXGQ=';
const david_secretKey = 'AmL8vXrmdwEaQdVjDExLgU9tkwgAGP0JfN7jEWDQnDM=';

const viktoria_publicKey = '0PwsYaWcqPPPVnGpToa66UuN4fGhbbz4vFICSSz/yWs=';
const viktoria_secretKey = 'aHijiLBvI21TtkvlaLgZ/8x7rnOfAkp2IOLG/Vo1em8=';

function davidEncrypting(){
    const one_time_code = nacl.randomBytes(24);

    var voucherDto = { 
        login: '1Bao57de',
        routerId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        routerIP: '127.0.0.1',
        clientMac: '00:00:00:00:00:00',
        clientIP: '127.0.0.1'
      };

    //Get the cipher text
    const cipher_text = nacl.box(
        nacl.util.decodeUTF8(JSON.stringify(voucherDto)),
        one_time_code,
        nacl.util.decodeBase64(viktoria_publicKey),
        nacl.util.decodeBase64(david_secretKey)
    );

    //messagereturn to be sent to Viktoria
    const message_in_transit = {cipher_text, one_time_code};

    //return message_in_transit;
    const body = JSON.stringify({ CipherText: nacl.util.encodeBase64(cipher_text),
                                    Code: nacl.util.encodeBase64(one_time_code) });

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

    return message_in_transit;
};

function viktoriaDecrypting(message){
    //Get the decoded message
    let decoded_message = nacl.box.open(message.cipher_text,
                                        message.one_time_code,
                                        nacl.util.decodeBase64(david_publicKey),
                                        nacl.util.decodeBase64(viktoria_secretKey),
                                        );

    //Get the human readable message
    let plain_text = nacl.util.encodeUTF8(decoded_message)

    //return the plaintext
    return plain_text;
};

let ciphertext = davidEncrypting();
//console.log(viktoriaDecrypting(ciphertext));