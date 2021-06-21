const SettingSchema = {
  name: 'Setting',
  primaryKey: '_id',
  properties: {
    _id: 'string',
    appVersion: 'string',
    dataVersion: 'string',
    urlCHPlay: 'string',
    urlAppStore: 'string'
  }
}

export {
  SettingSchema
}
