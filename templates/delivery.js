export var delivery = {
      transporter: {
        name: "",
        vehicleNo: "",
        tempSensor: {
          ideal: 0,
          crossed: 0
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