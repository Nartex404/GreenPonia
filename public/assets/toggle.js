let i, j = 0;
let val_start = parseInt(localStorage.getItem('val_start'));
let date = localStorage.getItem('date');

const ToggleSwitch = ({ start }) => {
  let bomb = false;
  let system = false;
  let datenow = false;

  const stateBomb = () => {
    bomb = !bomb;
    if (bomb === false) {
      i = 1;
    } else {
      i = 0;
    }
    downlink(i, j);
  };

  const stateSystem = () => {
    system = !system;
    if (system === false) {
      j = 1;
    } else {
      j = 0;
    }
    downlink(i, j);
  };

  const downlink = (val1, val2) => {
    const url = 'https://nam1.cloud.thethings.network/api/v3/as/applications/nodos/webhooks/webhook-firebase/devices/eui-ac1f09fffe054a6b/down/replace';
    const payload = {
      downlinks: [{
        decoded_payload: {
          act: val1,
          start: val2
        },
        f_port: 1,
        priority: "NORMAL"
      }]
    };
    const config = {
      headers: {
        Authorization: 'Bearer NNSXS.SI4ZQ6FHI3RLSIP75PWI2PQPM2ZWVLSUFD5532A.HGULM7KZUIIIPINMJTEPU7DBKYW47K67HQCYYHBTH5GMA7CU6HNQ',
        'Content-Type': 'application/json'
      }
    };

    axios.post(url, payload, config)
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  if (start === val_start) {
    datenow = date;
    console.log("date: ", date);
    localStorage.setItem('date', date);
  } else {
    let now = new Date().toLocaleString();
    datenow = now;
    localStorage.setItem('date', now);
  }

  localStorage.setItem('val_start', start);

  console.log("start: ", start);
  console.log("val_start: ", val_start);

  console.log('date_init: ', date);

  return (
    `<div>
      <label>Last activity LoRaWAN system: ${datenow}</label>
      <div>
        <input type="checkbox" id="bomb" checked={bomb} onChange={stateBomb} />
        <label for="bomb">Start bomb</label>
      </div>
      <div>
        <input type="checkbox" id="system" checked={system} onChange={stateSystem} />
        <label for="system">Start system</label>
      </div>
      <p>The switch is currently ${bomb ? "on" : "off"}.</p>
    </div>`
  );
};

// Ejemplo de uso
/*const startValue = true;
const toggleSwitch = ToggleSwitch({ start: startValue });
console.log(toggleSwitch);*/
