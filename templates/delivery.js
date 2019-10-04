export var delivery = {
      transporter: {
        name: "",
        vehicleNo: "",
        tempSensor: {
          ideal: 0,
          crossed: 0 // no of times temperature crossed a certain threshold, if greater than x then distributor might reject, if between 0 and x then he'll send a tx to batchId with quality = 100 * (1 - 1/n), n = no of times temp crossed the ideal one.
        }
      },
      timestamp: '',
      manufacturer: {
        name: "",
        location: {
          lat: "",
          lng: ""
        }
      },
      distributor: {
        name: "",
        location: {
          lat: "",
          lng: ""
        }
      },
      ingredientSource: "",
      medicines: [
        {
          name: "",
          quantity: 0,
          price: 0,
          batchId: ""
        }
      ]
    };