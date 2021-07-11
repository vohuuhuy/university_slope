const ComponentSchema = {
  name: 'Component',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    code: 'string',
    name: 'string',
    coordinate: 'double?[]',
    images: 'string?[]',
    zooms: 'double?[]',
    titleZooms: 'double?[]',
    type: 'string',
    info: 'string',

    // json
    search: 'string',
    map: 'string',
    style: 'string',
    childs: 'string',
    wayIns: 'string'
  }
}

export {
  ComponentSchema
}
