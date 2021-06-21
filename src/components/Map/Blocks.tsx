import React, { forwardRef, FunctionComponent, useEffect, useImperativeHandle, useReducer, useRef } from 'react'
import { Text } from 'react-native'
import Realm from 'realm'
import styled from 'styled-components/native'
import MapboxGL from '@react-native-mapbox-gl/maps'
import { reducer } from '../../utils'
import { ComponentSchema } from '../../tools/realm'
import { REALM_VERSION } from '../../constants'
import { Logo } from '../HeaderTitle'

const setting: any = require('./setting.json')

const DrawChildrenContent = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffffff00;
`

const DrawChildren = () => {
  return (
    <DrawChildrenContent>
      <Logo source={require('../../assets/NTULogo50.png')} />
      <Text>Đại học Nha Trang</Text>
    </DrawChildrenContent>
  )
}

const MapDraw: FunctionComponent<any> = forwardRef((props, ref) => {
  const handlesRef = useRef<any>([])

  const [state, setState] = useReducer(reducer, {
    zoom: setting.zoom,
    components: []
  })

  const cameraZoomChange = (zoom: number) => {
    zoom = Math.round((zoom - (zoom % 0.5)) * 10) / 10
    if (state.zoom !== zoom && handlesRef.current) {
      setState({ zoom })
    }
  }

  const genBlocks = () => {
    const blockComponents = state.components.filter((component: any) => (
      component.map
      && !!component?.zooms?.length
      && component.zooms[0] <= state.zoom
      && component.zooms[1] >= state.zoom
    ))

    return blockComponents.map((component: any) => (
      <>
        {
          !!component.childs?.length && component.childs.map((child: any) => (
              <MapboxGL.MarkerView
                key={child.id}
                id={child.id}
                coordinate={child.coordinate}
                children={<DrawChildren key={child.id} {...child}/> }
              />
            )
          )
        }
        <MapboxGL.ShapeSource
          key={component._id}
          id={component._id}
          shape={component.map}
        >
          <MapboxGL.FillLayer
            id={`fill-${component._id}`}
            style={{
              ...component.style?.fill
            }}
          />
          <MapboxGL.LineLayer
            id={`line-${component._id}`}
            style={{
              ...component.style?.line
            }}
          />
        </MapboxGL.ShapeSource>
      </>
    ))
  }

  const genTitle = () => {
    const titleComponents = state.components.filter((component: any) => (
      !!(component.code || component.name)
      && !!component?.coordinate?.length
      && !!component?.titleZooms?.length
      && component.titleZooms[0] <= state.zoom
      && component.titleZooms[1] >= state.zoom
    ))

    return titleComponents.map((component: any) => (
      <MapboxGL.ShapeSource
        key={`title-${component._id}`}
        id={`title-${component._id}`}
        shape={{
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              id: `title-feature-${component._id}`,
              properties: {
                id: `title-properties-${component._id}`
              },
              geometry: {
                type: 'Point',
                coordinates: component.coordinate
              },
            }
          ]
        }}
      >
        <MapboxGL.SymbolLayer
          id={`title-text-${component._id}`}
          style={{
            textField: component.code || component.name,
            textSize: 10,
            textColor: component?.style?.title?.color || 'black',
            textAnchor: 'center'
          }}
        />
      </MapboxGL.ShapeSource>
    ))
  }

  useImperativeHandle(ref, () => ({
    cameraZoomChange
  }))

  useEffect(() => {
    const init = async () => {
      const realm = await Realm.open({
        schema: [ComponentSchema],
        schemaVersion: REALM_VERSION
      })

      const realmComponents = realm.objects('Component')

      const components = realmComponents.map((component: any) => JSON.parse(JSON.stringify({
        _id: component._id,
        code: component.code,
        name: component.name,
        coordinate: component.coordinate,
        images: component.images,
        zooms: component.zooms,
        titleZooms: component.titleZooms,
        search: JSON.parse(component.search),
        map: JSON.parse(component.map),
        style: JSON.parse(component.style),
        childs: JSON.parse(component.childs)
      })))

      setState({ components })

      realm.close()
    }

    init()
  }, [])

  return (
    <>
      {genBlocks()}
      {genTitle()}
    </>
  )
})

export default MapDraw
