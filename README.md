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

Manufactures the medicines and sends the medicines to different Distributors.

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