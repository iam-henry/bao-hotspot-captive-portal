
function startSession() {
    
    const router_key = 'b4446feaf944492dab9ebe69efe41a92';
    const router_id = '996e83d7844145cfbc7e3f1ca2832fa2';

    return {
        start: function () {

            //alert('server address:' + '$(server-address)');
            //alert('server mac: $(mac)');
            //alert('server ip: $(ip)');

            //console.log('start session');
            //console.log('server address: $(server-address)');
            //console.log('server mac: $(mac)');
            //console.log('server ip: $(ip)');

            document.sendin.username.value = document.login.username.value;
            document.sendin.password.value = hexMD5('$(chap-id)' + 'd23b' + '$(chap-challenge)');
            //document.sendin.password.value = hexMD5('$(chap-id)' + document.login.password.value + '$(chap-challenge)');
            document.sendin.submit();
            return;
        }
    };
}
