import React, { useState, useRef, useEffect  } from 'react';
import { GoogleMap, LoadScript, Circle, OverlayView } from '@react-google-maps/api';
import {createUseStyles} from 'react-jss'
import CalendarPicker from './Components/Calendar';
import { Divider } from 'primereact/divider';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";                                //icons
import { DateTime } from "luxon";
import { Env } from './utils';

const App = () => {
  const paperOption = [
    { label: 'A4', code: 'a4' },
    { label: 'B4', code: 'b4' },
    { label: 'A3', code: 'a3' },
    { label: 'B3', code: 'b3' },
  ];
  const colorOption = [
    { code: 'one_side_colored', label: 'one_side_colored' },
    { code: 'one_side_mono', label: 'one_side_mono' },
    { code: 'both_side_colored', label: 'both_side_colored' },
    { code: 'colored_and_mono', label: 'colored_and_mono' },
    { code: 'both_side_mono', label: 'both_side_mono' },
  ];
  const typeOption = [
    { code: 'coat', label: 'coat' },
    { code: 'mat', label: 'mat' },
    { code: 'paper_type_normal', label: 'paper_type_normal' },
  ];
  const thicknessOption = [
    { code: '70kg', label: '70kg' },
    { code: '90kg', label: '90kg' },
    { code: '110kg', label: '110kg' },
  ];

  const classes = useStyles()
  const [date, setDate] = useState();
  const [paper, setPaper] = useState(paperOption[0]);
  const [color, setColor] = useState(colorOption[0]);
  const [type, setType] = useState(typeOption[0]);
  const [thickness, setThickness] = useState(thicknessOption[1]);
  const [brand, setBrand] = useState([]);
  let refCircle = useRef(null);
  
  const getDate = (date) => {
    setDate(date)
  }
  const onBrandChange = (e) => {
    let selectedBrand = [...brand];

    e.checked ? selectedBrand.push(e.value) : selectedBrand.splice(selectedBrand.indexOf(e.value), 1)

    setBrand(selectedBrand);
}
  const handleCircleRadius = () => {
    console.log("cc",refCircle)
    return refCircle && console.log('New Radius', refCircle.getRadius)
  };
  const containerStyle = {
    width: '100%',
    height: '100%'
  };
  const center = {
    lat: -3.745,
    lng: -38.523
  };
  const options = {
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    clickable: false,
    draggable: true,
    editable: true,
    visible: true,
    radius: 30000,
    zIndex: 1
  }

  useEffect(() => {
    const cekDate = DateTime.fromObject(date).toFormat('yyyy/mm/dd')
    console.log ("date3", cekDate)
    console.log ("brand",brand)
    fetch("https://orikomi-quote-api.107.jp/api/v1/estimate", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: Env.BEARER
      },
      body: JSON.stringify({
        paper_size  : paper.code,
        thickness   : thickness.code,
        color_type  : color.code,
        paper_type  : type.code,
        insertion_date : cekDate,
        center_loc  : {lng: center.lng, lat: center.lat},
        radius      : options.radius,
        brands      : brand
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)
      })
      .catch((e) => console.log(e));

    return 
  },[paper,thickness,color,type,date,brand]);

  return (
    <>
    <div className={classes.sidebar}>
        {/* Sidebar */}
        <aside className={classes.sidebar__sidebar}>
          <div className={classes.layout}>
            <div className={classes.label}>Insert Date</div>
            <div>:</div>
            <div className={classes.item}>
              {!date ? `----/--/--` : date.getFullYear() + `/` + date.getMonth() + `/` + date.getDate()}
            </div>
          </div>
          <CalendarPicker getDate={getDate} />

          <Divider />

          <div className={classes.layout}>
            <div className={classes.label}>Paper Size</div>
            <div>:</div>
            <Dropdown className={classes.item} value={paper} options={paperOption} onChange={(e) => setPaper(e.value)} />
          </div>
          <div className={classes.layout}>
            <div className={classes.label}>Color Type</div>
            <div>:</div>
            <Dropdown className={classes.item} value={color} options={colorOption} onChange={(e) => setColor(e.value)} />
          </div>
          <div className={classes.layout}>
            <div className={classes.label}>Type of Paper</div>
            <div>:</div>
            <Dropdown className={classes.item} value={type} options={typeOption} onChange={(e) => setType(e.value)} />
          </div>
          <div className={classes.layout}>
            <div className={classes.label}>Thickness of Paper</div>
            <div>:</div>
            <Dropdown className={classes.item} value={thickness} options={thicknessOption} onChange={(e) => setThickness(e.value)} />
          </div>

          <Divider />
          
          <h3>Brand Name Request</h3>
          <div className={classes.checkboxLayout}>
            <div className={classes.checkbox}>
                <Checkbox inputId="brand1" name="brand" value="asahi" onChange={onBrandChange} checked={brand.indexOf('asahi') !== -1} />
                <label style={{marginLeft: '10px'}} htmlFor="brand1">Asahi News Paper</label>
            </div>
            <div className={classes.checkbox}>
                <Checkbox inputId="brand2" name="brand" value="yomiuri" onChange={onBrandChange} checked={brand.indexOf('yomiuri') !== -1} />
                <label style={{marginLeft: '10px'}} htmlFor="brand2">Yomiuri News Paper</label>
            </div>
            <div className={classes.checkbox}>
                <Checkbox inputId="brand3" name="brand" value="sankei" onChange={onBrandChange} checked={brand.indexOf('sankei') !== -1} />
                <label style={{marginLeft: '10px'}} htmlFor="brand3">Sankei News Paper</label>
            </div>
            <div className={classes.checkbox}>
                <Checkbox inputId="brand4" name="brand" value="mainichi" onChange={onBrandChange} checked={brand.indexOf('mainichi') !== -1} />
                <label style={{marginLeft: '10px'}} htmlFor="brand4">Mainichi News Paper</label>
            </div>
            <div className={classes.checkbox}>
                <Checkbox inputId="brand5" name="brand" value="nikkei" onChange={onBrandChange} checked={brand.indexOf('nikkei') !== -1} />
                <label style={{marginLeft: '10px'}} htmlFor="brand5">Nikkei News Paper</label>
            </div>
            <div className={classes.checkbox}>
                <Checkbox inputId="brand6" name="brand" value="tokyo" onChange={onBrandChange} checked={brand.indexOf('tokyo') !== -1} />
                <label style={{marginLeft: '10px'}} htmlFor="brand6">Tokyo News Paper</label>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className={classes.sidebar__main}>
        <LoadScript
          googleMapsApiKey={Env.MAP_BOX_API_TOKEN}
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
          >
            <Circle
              ref={(ref) => {refCircle = ref}}
              onRadiusChanged={handleCircleRadius}
              center={center}
              options={options}
            />
            <OverlayView
              position={center}
              mapPaneName='overlayMouseTarget'
            >
              <div style={{backgroundColor: 'red'}}>
                <h1>OverlayView</h1>

                <button
                  type='button'
                >
                  Click me
                </button>
              </div>
            </OverlayView>
          </GoogleMap>
        </LoadScript>
        </main>
    </div>
    </>
  )
}

export default App

const useStyles = createUseStyles({
  sidebar: {
    display: 'flex',
    marginBottom: '60px',
  },
  sidebar__sidebar : {
    marginLeft: '40px',
    marginBottom: '60px',
    marginTop: '40px',
    marginRight: '20px',
    width: '30%'
  },
  sidebar__main: {
    marginTop: '40px',
    marginLeft: '60px',
    marginRight: '20px',
    padding: '10px',
    boxShadow: "-2px 10px 83px -35px rgba(163,162,162,0.75)",
    border:'2px solid rgb(204,204,204)',
    borderRadius: '15px',
    flex: 1,
    overflow: 'auto',
  },
  layout: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '10px'
  },
  item: {
    width: '60%',
  },
  label: {
    width: '30%',
  },
  checkboxLayout:{
    flexWrap: 'wrap',
    alignItems: 'center',
    display: 'flex',
    gap: '20px',

  },
  checkbox: {
    width: '45%',
  }
})