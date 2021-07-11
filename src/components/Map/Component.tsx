import React, { forwardRef, FunctionComponent, useEffect, useImperativeHandle, useReducer, useRef } from 'react'
import { Text } from 'react-native'
import styled from 'styled-components/native'
import MapboxGL from '@react-native-mapbox-gl/maps'
import { reducer } from '../../utils'
import { Logo } from '../HeaderTitle'
import { genLengthOfPathKm, getDistanceFromLatLonInKm } from './RoadDirections'

const setting: any = require('./setting.json')

const DrawChildrenContent = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffffff00;
`

const Component: FunctionComponent<any> = forwardRef((props, ref) => {
  const handlesRef = useRef<any>([])
  const componentsRef = useRef()

  const [state, setState] = useReducer(reducer, {
    zoom: setting.zoom,
    blocks: [],
    titles: []
  })

  const cameraZoomChange = (zoom: number) => {
    zoom = Math.round((zoom - (zoom % 0.5)) * 10) / 10

    if (state.zoom !== zoom && handlesRef.current) {
      setState({ zoom })
    }
  }

  const blockPress = (block: any) => {
    let range = 'Chưa xác định'
    let haveRange = false

    if (!props.userLocationRef.current?.check()) range = 'Chưa cho phép định vị'
    else if (block.coordinate) {
      const location = props.userLocationRef.current?.get()
      if (location?.length) {
        range = genLengthOfPathKm(getDistanceFromLatLonInKm(location[1], location[0], block.coordinate[1], block.coordinate[0]))
        haveRange = true
      }
    }

    props.componentInfoRef.current.open({
      title: block.name,
      type: block.type,
      info: block.info,
      range,
      haveRange,
      images: block.images || []
    })
  }

  const genBlocks = () => {
    return state.blocks
      .map((block: any) => {
        const show = !!block?.zooms?.length
          && block.zooms[0] <= state.zoom
          && state.zoom <= block.zooms[1]

        return (
          <>
            <MapboxGL.ShapeSource
              key={block._id}
              id={block._id}
              shape={block.map}
              onPress={() => blockPress(block)}
            >
              <MapboxGL.FillLayer
                id={`fill-${block._id}`}
                style={{
                  ...block.style?.fill,
                  visibility: show ? 'visible' : 'none'
                }}
              />
              <MapboxGL.LineLayer
                id={`line-${block._id}`}
                style={{
                  ...block.style?.line,
                  visibility: show ? 'visible' : 'none'
                }}
              />
            </MapboxGL.ShapeSource>
            {
              !!block.childs?.length && block.childs.map((child: any) => (
                <MapboxGL.ShapeSource
                  key={`ShapeSource-${child.id}`}
                  id={`ShapeSource-${child.id}`}
                  shape={{
                    type: 'Feature',
                    geometry: {
                      type: 'Point',
                      coordinates: child.coordinate
                    },
                    properties: {}
                  }}
                >
                  <MapboxGL.SymbolLayer
                    id={`SymbolLayer-${child.id}`}
                    style={{
                      iconImage: require('../../assets/NTULogo50.png'),
                      iconSize: 0.3,
                      visibility: show ? 'visible' : 'none'
                    }}
                  />
                </MapboxGL.ShapeSource>
                )
              )
            }
          </>
        )
      })
  }

  const genTitle = () => {
    return state.titles.map((title: any) => {
      const show = title.titleZooms?.length
        && title.titleZooms[0] <= state.zoom
        && state.zoom <= title.titleZooms[1]

      return (
        <MapboxGL.ShapeSource
          key={`title-${title._id}`}
          id={`title-${title._id}`}
          shape={{
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                id: `title-feature-${title._id}`,
                properties: {
                  id: `title-properties-${title._id}`
                },
                geometry: {
                  type: 'Point',
                  coordinates: title.coordinate
                }
              }
            ]
          }}
        >
          <MapboxGL.SymbolLayer
            id={`title-text-${title._id}`}
            style={{
              textField: title.code || title.name || '',
              textSize: 10,
              textColor: title?.style?.title?.color,
              textAnchor: 'center',
              visibility: show ? 'visible' : 'none'
            }}
          />
        </MapboxGL.ShapeSource>
      )
    })
  }

  const setComponents = (components: any) => {
    componentsRef.current = components

    const blocks: any[] = []
    const titles: any[] = []

    components?.forEach((component: any) => {
      if (component?.map) {
        blocks.push({
          _id: component?._id,
          name: component?.name,
          map: component?.map,
          zooms: component?.zooms,
          images: component?.images,
          style: component?.style,
          childs: component?.childs,
          type: component?.type,
          info: component?.info,
          coordinate: component?.coordinate
        })
      }

      if (component?.coordinate?.length) {
        titles.push({
          _id: component?._id,
          code: component?.code,
          name: component?.name,
          coordinate: component?.coordinate,
          titleZooms: component?.titleZooms,
          style: component?.style
        })
      }
    })

    setState({ blocks, titles })
  }

  const getComponents = () => componentsRef.current

  useImperativeHandle(ref, () => ({
    cameraZoomChange,
    setComponents,
    getComponents
  }))

  return (
    <>
      {genBlocks()}
      {genTitle()}
    </>
  )
})

export default Component
