import React, { useRef } from "react";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Circle,
} from "react-google-maps";
import {createUseStyles} from 'react-jss'

const CircleMap = withScriptjs(
    withGoogleMap(({ isCircleShow, options, center, handleCircleRadius }) => {
        
    const classes = useStyles()
    let refCircle = useRef(null);

    return (
      <GoogleMap defaultZoom={13} defaultCenter={center}>
        {isCircleShow && (
          <Circle
            ref={(ref) => (refCircle = ref)}
            onRadiusChanged={()=>handleCircleRadius(refCircle.getRadius())}
            center={center}
            options={options}
          />
        )}
      </GoogleMap>
    );
  })
);

export default CircleMap;

const useStyles = createUseStyles({
    boxInfo:{
        backgroundColor: 'red',
        height: '200px',
        width: '200px',
        position: 'absolute',
        right: '100px',
        bottom: '100px'
    }
})