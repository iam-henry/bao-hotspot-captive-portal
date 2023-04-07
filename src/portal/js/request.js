var bao = (function() {
 
    var baseUrl = "https://bao.co.tz/api/KeyService/GetKey/BNH.Hotspot.VoucherPassword/"

    return {
        encrypt: function(dto, callback) {
            var routerId = '996e83d7844145cfbc7e3f1ca2832fa2';
            var routerKey = 'b4446feaf944492dab9ebe69efe41a92';
            var salt = CryptoJS.enc.Utf8.parse('1ed6bef9fd72406b');
            
            var voucherDto = {
                    RouterIpAddress: dto.RouterIpAddress, 
                    Login: dto.Login, 
                    ClientMacAddress: dto.ClientMacAddress,
                    ClientIpAddress: dto.ClientIpAddress,
                    RouterId: routerId,
                    RouterKey: routerKey
            };

            var voucherJSON = JSON.stringify(voucherDto);

            var xhttp = new XMLHttpRequest();
            
            xhttp.open("GET", baseUrl, true);
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send();

            //
            // request complete callback
            //
            xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {

                        var tempKey = this.responseText.replace(/\"/g, '');
                        var key = CryptoJS.enc.Utf8.parse(tempKey);

                        const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(voucherJSON),
                        key,
                        {
                            keySize: 128 / 8,
                            iv: salt,
                            mode: CryptoJS.mode.CBC,
                            padding: CryptoJS.pad.Pkcs7
                        });

                        //
                        // base 64 code the cipher text and start the login callback
                        //
                        var cipher = encrypted.toString().replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
                        callback(cipher);
                    }
            };
        },
 
        reset: function() {}
    };  
})();
