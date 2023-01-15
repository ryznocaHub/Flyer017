import React, { useState, useRef, useEffect  } from 'react';
// import { GoogleMap } from '@react-google-maps/api';
import {createUseStyles} from 'react-jss'
import CalendarPicker from './Components/Calendar';
import { Divider } from 'primereact/divider';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";                                //icons
import { DateTime } from "luxon";
import { Env } from './utils';
import CircleMap from './Components/Circle';

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
    radius: 3000,
    zIndex: 1
  }
  const nextDate = new Date(DateTime.now().plus({ days: 6 }).toISO())
  console.log("nextDate",nextDate)
  const classes = useStyles()
  const [date, setDate] = useState(nextDate);
  const [radius, setRadius] = useState(options.radius);
  const [paper, setPaper] = useState(paperOption[0]);
  const [color, setColor] = useState(colorOption[0]);
  const [type, setType] = useState(typeOption[0]);
  const [thickness, setThickness] = useState(thicknessOption[1]);
  const [brand, setBrand] = useState(["asahi"]);
  const [estimate, setEstimate] = useState();

  const getDate = (date) => {
    console.log("newDate",date)
    setDate(date)
  }
  const onBrandChange = (e) => {
    let selectedBrand = [...brand];

    e.checked ? selectedBrand.push(e.value) : selectedBrand.splice(selectedBrand.indexOf(e.value), 1)

    setBrand(selectedBrand);
  }
  const handleCircleRadius = newRadius => {
    setRadius(newRadius);
  }
  useEffect(() => {
    const validDate = DateTime.fromJSDate(date).toFormat('yyyy/MM/dd')
    console.log("validDate",validDate);
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
        insertion_date : validDate,
        center_loc  : {lng: center.lng, lat: center.lat},
        radius      : radius,
        brands      : brand
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("responsJson",responseJson)
        setEstimate(responseJson.value.estimation)
      })
      .catch((e) => console.log(e));

    return 
  },[paper,thickness,color,type,date,brand,radius]);

  return (
    <div className={classes.sidebar}>
        {/* Sidebar */}
        <aside className={classes.sidebar__sidebar}>
          <div className={classes.layout}>
            <div className={classes.label}>Insert Date</div>
            <div>:</div>
            <div className={classes.item}>
              {!date ? `----/--/--` : DateTime.fromJSDate(date).toFormat('yyyy/MM/dd')}
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
          <CircleMap
            isCircleShow
            options={options}
            center={center}
            handleCircleRadius={handleCircleRadius}
            googleMapURL={`https://maps.googleapis.com/maps/api/js?key=`+ Env.MAP_BOX_API_TOKEN +`&v=3.exp&libraries=geometry,drawing,places`}
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `100%` }} />}
            mapElement={<div style={{ height: `100%` }} />}
          />
          <Card className={classes.boxInfo} footer={() => <Button label="Put To Cart" icon="pi pi-shopping-cart" style={{width: '100%'}} />} >
            <div className={classes.layoutBox}>
              <div className={classes.labelBox}>Insertion Date</div>
              <div className={classes.itemBox}>{estimate && DateTime.fromJSDate(date).toFormat('yyyy/MM/dd')}</div>
            </div>
            <Divider/>
            <div className={classes.layoutBox}>
              <div className={classes.labelBox}>Quantity</div>
              <div className={classes.itemBox}>{estimate && estimate.quantity} copies</div>
            </div>
            <Divider/>
            <div className={classes.layoutBox}>
              <div className={classes.labelBox}>Unit Price</div>
              <div className={classes.itemBox}>1 copy @{estimate && estimate.unit_price} JPY</div>
            </div>
            <Divider/>
            <div className={classes.layoutBox}>
              <div className={classes.labelBox}>Total Price</div>
              <div className={classes.itemBox}>{estimate && estimate.total_price}</div>
            </div>
            <div style={{textAlign: 'end', fontSize: 12, color: 'grey'}}>include Tax ({estimate && estimate.include_tax})</div>
          </Card>
        </main>
    </div>
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
    position: 'relative'
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
  },
  boxInfo:{
    height: '400px',
    width: '300px',
    position: 'absolute',
    right: '20px',
    bottom: '25px',
    boxShadow: "-2px 10px 83px -35px rgba(163,162,162,0.75)",
  },
  layoutBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemBox: {
    width: '50%',
    textAlign: 'end',
    fontWeight: 'bold',
    fontSize: 17
  },
  labelBox: {
    width: '45%',
  },
})