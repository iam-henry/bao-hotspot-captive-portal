const { API_KEY, ROUTER_ID, BAOAPI_BASEURL } = require('./keys');

const preflight = (function() {

  return {
      status: function (routerIp, clientMac, clientIp , callback) {

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
              config.retries += 1;
              var backOffDelay = config.retries ? ( (1/2) * (Math.pow(2, config.retries) - 1) ) * 2000 : 1000;

              if (config.retries == 1) {
                backOffDelay = Math.random() * 1000 + 1000;
              }

              const delayRetryRequest = new Promise((resolve) => {
                setTimeout(() => {
                  console.log(`** retrying request - url: ${config.url}, attempts: ${config.retries}, delay: ${backOffDelay}`);
                  resolve();
                }, backOffDelay || 1000);
              });
              return delayRetryRequest.then(() => axios(config));
          });

          const router_key = API_KEY;
          const router_id = ROUTER_ID;

          document.sendin.username.value = document.login.username.value;

          const dto = {   login: document.sendin.username.value,
                          routerId: router_id,
                          routerKey: router_key,
                          routerIP: routerIp,
                          clientMac: clientMac,
                          clientIP: clientIp 
                      };

          const body = JSON.stringify(dto);
          const url = `${BAOAPI_BASEURL}/Voucher/PreFlightStatus`;
          const headers = {
              'Content-Type': 'application/json'
            };

          axios.post(url, body, { headers: headers, retry: 3, retryDelay: 1000, retries: 0 })
              .then(function (response) {
                  // handle success
                  console.log(response.data);
                  callback(true, response.data);
              })
              .catch(function (error) {
                  // handle error
                  console.log(error);
                  callback(false, error);
              });
      }
  };
})()