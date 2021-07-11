import MapboxGL from '@react-native-mapbox-gl/maps'
import React, { useImperativeHandle, useReducer, useRef } from 'react'
import { errorMessageToast, reducer } from '../../utils'

const convertDataToShape = (paths: any): any => {
  const features = paths.map((path: any) => {
    const { coordinates } = path
    return {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates
      }
    }
  })

  return {
    type: 'FeatureCollection',
    features
  }
}

type CoordinateLocationWithPath = {
  d: number
  cs: number[]
  points: number[][]
} | null

const getCoordinateLocationWithPath = (coors: number[], paths: any): CoordinateLocationWithPath => {
  const mapX = paths.reduce((r: any, { coordinates, _id }: any) => {
    coordinates.forEach((coordinate: any, index: number) => {
      if (index < coordinates.length - 1 || coordinates.length === 1) {
        // x1: coordinate[0]
        // y1: coordinate[1]
        // x2: coordinates[index + 1][0]
        // y2: coordinates[index + 1][1]

        const cA = coordinates[index + 1][1] - coordinate[1]
        const cB = - (coordinates[index + 1][0] - coordinate[0])
        const cC = - coordinate[0] * cA + coordinate[1] * (cB * -1)
        let d = Math.abs((cA * coors[0] + cB * coors[1] + cC) / (Math.sqrt(Math.pow(cA, 2) + Math.pow(cB, 2))))

        const cY = (((cB * cC) / cA) + (cB * coors[0]) - (cA * coors[1])) / ((-Math.pow(cB, 2) / cA) - cA)
        const cX = ((-cB * cY) - cC) / cA

        if (
          !(
            cX >= Math.min(coordinate[0], coordinates[index + 1][0]) &&
            cX <= Math.max(coordinate[0], coordinates[index + 1][0]) &&
            cY >= Math.min(coordinate[1], coordinates[index + 1][1]) &&
            cY <= Math.max(coordinate[1], coordinates[index + 1][1])
          )
        ) {
          d = Math.min(
            Math.sqrt(Math.pow((cX + coordinate[0]), 2) + Math.pow((cY + coordinate[1]), 2)),
            Math.sqrt(Math.pow((cX + coordinates[index + 1][0]), 2) + Math.pow((cY + coordinates[index + 1][1]), 2)),
          )
        }

        if (d) {
          r.push({
            d,
            cs: [cX, cY],
            points: [coordinate, coordinates[index + 1]]
          })
        }

      }
    })

    return r
  }, [])

  const dMin = Math.min(...mapX.map((m: any) => m.d))
  const findCoords = mapX.find((m: any) => m.d === dMin)

  return findCoords
}

const dijkstra = (objectNodes: {[node: string]: {[node: string]: number}}, sourceNode: string, destinationNode: string) => {
  const processingNodes: {[node: string]: { length: number, paths: string[] }} = {}
  const doneNodes: {[node: string]: { length: number, paths: string[] }} = {}
  let currentNodeName = sourceNode

  do {
    if (objectNodes[currentNodeName]) {
      Object.keys(objectNodes[currentNodeName]).forEach(node => {
        if (!doneNodes[node]) {
          const newLength = (processingNodes[currentNodeName]?.length || 0) + objectNodes[currentNodeName][node]

          if (!processingNodes[node] || newLength < processingNodes[node].length) {
            processingNodes[node] = {
              length: newLength,
              paths: (processingNodes[currentNodeName]?.paths || []).concat(node)
            }
          }
        }
      })

      doneNodes[currentNodeName] = processingNodes[currentNodeName]
      delete processingNodes[currentNodeName]
    }

    if (currentNodeName === destinationNode) return doneNodes[destinationNode]

    const processingNodesKeyArray = Object.keys(processingNodes)

    if (processingNodesKeyArray?.length) {
      currentNodeName = processingNodesKeyArray[0]
      for (let index = 1; index < processingNodesKeyArray.length; index++) {
        const nodeName = processingNodesKeyArray[index]
        const node = processingNodes[nodeName]
        if (node.length < processingNodes[currentNodeName].length) {
          currentNodeName = nodeName
        }
      }
    }
  } while (Object.keys(processingNodes)?.length)

  return null
}

export const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const deg2rad = (deg: number) => deg * (Math.PI/180)
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2-lat1) // deg2rad below
  const dLon = deg2rad(lon2-lon1)
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2)
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  var d = R * c // Distance in km
  return d;
}

const coorString = (coor: number[]) => `${coor[0]}-${coor[1]}`

const generateObjectNodes = (paths: any, coorLocation?: CoordinateLocationWithPath, wayIns?: number[][][]) => {
  const objectNodes: {[node: string]: {[node: string]: number}} = {}

  let coorLocationString: string[] = []
  let coorStringCS: string

  if (coorLocation) {
    coorLocationString[0] = coorString(coorLocation.points[0])
    coorLocationString[1] = coorString(coorLocation.points[1])
    coorStringCS = coorString(coorLocation.cs)
  }

  paths.forEach((path: any) => {
    path.coordinates.forEach((coor: any, index: number) => {
      if (index < path.coordinates.length - 1) {
        const nextCoor = path.coordinates[index + 1]
        const coorString1 = coorString(coor)
        const coorString2 = coorString(nextCoor)

        if (
          coorLocation &&
          coorLocationString.length &&
          coorLocationString[0] === coorString1 &&
          coorLocationString[1] === coorString2
        ) {
          if (!objectNodes[coorString1]) objectNodes[coorString1] = {}
          if (!objectNodes[coorStringCS]) objectNodes[coorStringCS] = {}
          if (!objectNodes[coorString2]) objectNodes[coorString2] = {}
          const distance1 = getDistanceFromLatLonInKm(coor[1], coor[0], coorLocation.cs[1], coorLocation.cs[0])
          const distance2 = getDistanceFromLatLonInKm(coorLocation.cs[1], coorLocation.cs[0], nextCoor[1], nextCoor[0])
          objectNodes[coorString1][coorStringCS] = distance1
          objectNodes[coorStringCS][coorString1] = distance1
          objectNodes[coorStringCS][coorString2] = distance2
          objectNodes[coorString2][coorStringCS] = distance2
        } else {
          if (!objectNodes[coorString1]) objectNodes[coorString1] = {}
          if (!objectNodes[coorString2]) objectNodes[coorString2] = {}
          const distance = getDistanceFromLatLonInKm(coor[1], coor[0], nextCoor[1], nextCoor[0])
          objectNodes[coorString1][coorString2] = distance
          objectNodes[coorString2][coorString1] = distance
        }
      }
    })
  })

  if (wayIns?.length) {
    wayIns.forEach(wayIn => {
      if (wayIn?.length) {
        wayIn.forEach((coor, index) => {
          if (index < wayIn.length - 1) {
            const nextCoor = wayIn[index + 1]
            const coorString1 = coorString(coor)
            const coorString2 = coorString(nextCoor)
            if (!objectNodes[coorString1]) objectNodes[coorString1] = {}
            if (!objectNodes[coorString2]) objectNodes[coorString2] = {}
            const distance = getDistanceFromLatLonInKm(coor[0], coor[1], nextCoor[0], nextCoor[1])
            objectNodes[coorString1][coorString2] = distance
            objectNodes[coorString2][coorString1] = distance
          }
        })
      }
    })
  }

  return objectNodes
}

const convertResultDijkstra = (
  data: {
    length: number;
    paths: string[];
  } | null,
  coorLocation: number[]
) => {
  if (!data) return null
  const coordinates = data.paths?.map(path => {
    return path.split('-').map(coorString => parseFloat(coorString))
  })
  coordinates.unshift(coorLocation)
  return {
    length: data.length,
    coordinates
  }
}

export const genLengthOfPathKm = (length: number) => {
  if (length > 1) return `${length.toFixed(2)} KM`
  return `${(length * 1000).toFixed(0)} M`
}

const RoadDirections = React.forwardRef((props: any, ref) => {
  const pathsRef = useRef<any>()

  const [state, setState] = useReducer(reducer, {
    shape: null,
    dijkstraCoors: [],
    coorLocationCS: []
  })

  const getRoute = (sourceInfo: any, destinationInfo: any) => {
    const sourceCoor = sourceInfo.coors
    const destinationCoor = destinationInfo.coors

    let wayIns: number[][][] = []
    let coorLocation: CoordinateLocationWithPath = null

    if (sourceInfo?.wayIns) {
      wayIns = wayIns.concat(sourceInfo.wayIns)
    } else {
      coorLocation = getCoordinateLocationWithPath(sourceCoor, pathsRef.current)
    }

    if (destinationInfo?.wayIns) {
      wayIns = wayIns.concat(destinationInfo.wayIns)
    }

    const sourceNodeCoor = sourceInfo?.wayIns ? sourceInfo.coors : coorLocation?.cs

    if (sourceNodeCoor) {
      const objectNodes = generateObjectNodes(pathsRef.current, coorLocation, wayIns)
      const result = dijkstra(objectNodes, coorString(sourceNodeCoor), coorString(destinationCoor))
      const convertResult = convertResultDijkstra(result, sourceNodeCoor)

      if (convertResult) {
        setState({
          coorLocationCS: coorLocation?.cs,
          dijkstraCoors: convertResult.coordinates
        })

        props.cameraRef.setCamera({
          centerCoordinate: coorLocation?.cs,
          zoomLevel: 16,
          animationDuration: 2000,
        })
        props?.lengthOfPathRef?.current?.set({ visible: true, content: genLengthOfPathKm(convertResult.length) })
      } else {
        errorMessageToast(`${destinationInfo.text} chưa được kết nối với đường`)
      }
    }
  }

  const setPaths = (paths: any) => {
    pathsRef.current = paths
    setState({ shape: convertDataToShape(paths) })
  }

  const getPaths = () => pathsRef.current

  const removeRoute = () => {
    setState({
      dijkstraCoors: [],
      coorLocationCS: []
    })
  }

  useImperativeHandle(ref, () => ({
    getRoute,
    setPaths,
    getPaths,
    removeRoute
  }))

  return (
    <>
    {
      state.shape && (
        <MapboxGL.ShapeSource
          id='path'
          shape={state.shape}
        >
          <MapboxGL.LineLayer
            id={`line`}
            style={{
              lineColor: "#c3dbe2",
              lineWidth: 1.7,
              lineOpacity: 1
            }}
          />
        </MapboxGL.ShapeSource>
      )
    }
    {state.dijkstraCoors?.length > 0 && (
      <MapboxGL.ShapeSource
        id='dijkstra'
        shape={{
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: state.dijkstraCoors
              }
            }
          ]
        }}
      >
        <MapboxGL.LineLayer
          id={`dijkstra-line`}
          style={{
            lineColor: 'red',
            lineWidth: 2.5,
            lineOpacity: 1
          }}
        />
      </MapboxGL.ShapeSource>
    )}
    </>
  )
})

export default RoadDirections
