import React, { useEffect, useReducer } from 'react'
import styled from 'styled-components/native'
import Realm from 'realm'
import Client from '../../tools/client'
import { Logo75 } from '../../components/HeaderTitle'
import { errorToast, reducer } from '../../utils'
import { APP_VERSION, REALM_VERSION } from '../../constants'
import { Schemas } from '../../tools/realm'

const VersionCheckContainer = styled.View`
  width: 100%;
  height: 100%;
  background: #063463;
  display: flex;
  justify-content: center;
  align-items: center;
`

const AppText = styled.Text`
  font-size: 20px;
  color: #fff;
  margin-top: 10px;
`

const VersionCheck = (props: any) => {
  const [state, setState] = useReducer(reducer, {
    diffAppVerSion: false,
    success: false
  })


  const checkAndUpdate = async () => {
    const realm = await Realm.open({
      schema: Schemas,
      schemaVersion: REALM_VERSION,
      migration: (olRealm, newRealm) => {
        console.log(olRealm.schemaVersion)
        console.log(newRealm.schemaVersion)
      }
    })

    const getSetData = async () => {
      try {
        const { data } = await Client.query({
          query: `{
            components {
              _id
              code
              name
              coordinate
              images
              map
              zooms
              titleZooms
              search {
                data
              }
              style {
                line
                fill
                title
              }
              childs {
                _id
                coordinate
              }
              wayIns
              type
              info
            }
            paths {
              _id
              coordinates
            }
          }`,
          variables: {}
        })

        if (data?.data?.components?.length) {
          const { components: serverComponents } = data.data
          const components = realm.objects('Component')

          realm.write(() => {
            realm.delete(components)
            serverComponents.forEach((serverComponent: any) => realm.create('Component', {
              _id: serverComponent._id,
              code: serverComponent.code || '',
              name: serverComponent.name || '',
              coordinate: serverComponent.coordinate || [],
              images: serverComponent.images || [],
              zooms: serverComponent.zooms || [],
              titleZooms: serverComponent.titleZooms || [],
              search: JSON.stringify(serverComponent.search) || '',
              map: JSON.stringify(serverComponent.map) || '',
              style: JSON.stringify(serverComponent.style) || '',
              childs: JSON.stringify(serverComponent.childs) || '',
              wayIns: JSON.stringify(serverComponent.wayIns) || '',
              type: serverComponent.type || '',
              info: serverComponent.info || ''
            }))
          })
        }

        if (data?.data?.paths?.length) {
          const { paths: serverPaths } = data.data
          const paths = realm.objects('Path')

          realm.write(() => {
            realm.delete(paths)
            serverPaths.forEach((serverPath: any) => realm.create('Path', {
              _id: serverPath._id,
              coordinates: JSON.stringify(serverPath.coordinates || [])
            }))
          })
        }
      } catch (error) {
        errorToast(error.message)
      }
    }

    try {
      const { data: checkVersion } = await Client.query({
        query: `{
          checkVersion {
            _id
            appVersion
            dataVersion
          }
        }`,
        variables: {}
      })

      if (checkVersion?.data?.checkVersion?._id === 'default') {
        const serverSetting = checkVersion?.data?.checkVersion
        const settings = realm.objects('Setting')
        const defaultSettings = settings.filtered('_id = "default"')

        let diffDataVersion = false
        let diffAppVerSion = false

        if (!defaultSettings.length) {
          realm.write(() => {
            realm.create('Setting', {
              _id: serverSetting._id,
              appVersion: serverSetting.appVersion,
              dataVersion: serverSetting.dataVersion,
              urlCHPlay: serverSetting.urlCHPlay || '',
              urlAppStore: serverSetting.urlAppStore || ''
            })
          })

          diffDataVersion = true
        } else {
          const defaultSetting: any = defaultSettings[0]

          if (serverSetting.appVersion !== APP_VERSION) diffAppVerSion = true
          if (serverSetting.dataVersion !== defaultSetting.dataVersion ) diffDataVersion = true

          realm.write(() => {
            defaultSetting.urlAppStore = serverSetting.urlAppStore || ''
            defaultSetting.urlCHPlay = serverSetting.urlCHPlay || ''
          })
        }

        if (!diffAppVerSion && diffDataVersion) {
          await getSetData()
          realm.write(() => {
            const defaultSetting: any = defaultSettings[0]
            defaultSetting.dataVersion = serverSetting.dataVersion
          })
        } else {
          setState({ diffAppVerSion: diffAppVerSion, success: true })
        }
      } else {
        // Máy chủ không có setting
      }
    } catch (error) {
      errorToast(error.message)
    }

    realm.close()

    setState({ success: true })
  }

  useEffect(() => {
    checkAndUpdate()
  }, [])

  useEffect(() => {
    if (state.success && !state.diffAppVersion) {
      props?.navigation?.navigate('Home')
    }
  }, [state.success, state.diffAppVersion])

  return (
    <VersionCheckContainer>
      <Logo75 source={require('../../assets/NTULogo75.png')} />
      <AppText>NTU Map</AppText>
    </VersionCheckContainer>
  )
}

export default VersionCheck
