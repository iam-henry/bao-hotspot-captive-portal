const login = (function() {

    return {
        validate: function (routerIp, clientMac, clientIp) {

            axios.interceptors.response.use(undefined, (err) => {
                const { config, message } = err;
                if (!config || !config.retry) {
                  return Promise.reject(err);
                }

                //
                // retry while Network timeout or Network Error
                //
                if (!(message.includes("timeout") || message.includes("Network Error"))) {
                  return Promise.reject(err);
                }
                config.retry -= 1;
                const delayRetryRequest = new Promise((resolve) => {
                  setTimeout(() => {
                    console.log("retry the request", config.url);
                    resolve();
                  }, config.retryDelay || 1000);
                });
                return delayRetryRequest.then(() => axios(config));
            });

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

            const body = JSON.stringify(dto);
            const url = 'https://devhotspotapi.bao.co.tz/api/Voucher/CreateSession';
            const headers = {
                'Content-Type': 'application/json'
              };

            axios.post(url, body, { headers: headers }, { retry: 3, retryDelay: 3000 })
                .then(function (response) {
                    // handle success
                    console.log(response);

                    document.sendin.password.value =  response.data.replace(/\"/g, '');
                    document.sendin.submit();
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                });
        }
    };
})();