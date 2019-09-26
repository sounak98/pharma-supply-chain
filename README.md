# pharma-supply-chain

Supply Chain based on Algorand Blockchain in Pharma Supply

## System Structure and Flow

### Actors

- Farmers
- Manufacturers
- Distributors
- Medicine Stores or Hospitals
- Patients

### Actions

#### Farmers

Sends raw materials to manufacturers. Multiple farmers can send different raw materials to a manufacturer for a particular medicine.

```json
{
  "farmer": {
    "name": "...",
    "location": {
      "lat": 000,
      "lon": 000
    }
  },
  "manufacturer": {
    "name": "...",
    "location": {
      "lat": 000,
      "lon": 000
    }
  },
  "raw_material": {
    "name": "...",
    "description": "..."
  },
  "time": 000
}
```

#### Manufacturers

Manufactures the medicines and sends the medicines to different distributors.

```json
{
  "manufacturer": {
    "name": "...",
    "location": {
      "lat": 000,
      "lon": 000
    }
  },
  "distributor": {
    "name": "..."
  },
  "medicine": {
    "batch_serial": 000,
    "quantity": 000,
    "name": "...",
    "description": "...",
    "mrp": 000,
    "expiry": 000,
    "properties": {
      "color": "..."
    }
  }
}
```

#### Distributors

Updates the location of the transport in fixed interval of time.

```json
{
  "distributor": {
    "name": "..."
  },
  "batch_serial": 000,
  "time": 000,
  "live_location": {
    "lat": 000,
    "lon": 000
  },
  "temperature": 000
}
```

#### Medicine Stores and Hospitals

Accepts batches of medicines from distributors.

```json
{
  "distributor": {
    "name": "..."
  },
  "retailer": {
    "name": "...",
    "location": {
      "lat": 000,
      "lon": 000
    }
  },
  "batch_serial": 000,
  "time": 000
}
```

### Patient

Buys medicines from shops or hospitals.

```json
{
  "acceptor": {
    "name": "...",
    "location": {
      "lat": 000,
      "lon": 000
    }
  },
  "batch_serial": 000,
  "time": 000
}
```

## Portal UI/UX

### Features

- Anyone with the unique identifier of a batch should be able to view the current status of a particular batch.
  - If the retailer wants to verify that the medicine was from a authorized manufacturer and that the distributor brought it in proper conditions, he can view that by searching the batch serial (unique identifier of a batch)
  - If a patient wants to verify the same, even he can do that in the same way.
- Any actor should be able to emit events of the structures mentioned above once they are satisfied with the previous progress and takes up their task.
  - In the case of the distributor this will be handled by an IoT device (temperature sensor fitted with camera?)
