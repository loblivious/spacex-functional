import React, { useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Graticule,
  Sphere,
  Marker,
} from 'react-simple-maps';
import { Button, InputNumber, Progress } from 'antd';
import { POSITION_API_BASE_URL, N2YO_API_KEY } from '../constants';

const progressStatus = {
  Idle: 'Idle',
  Fetching: 'Fetching Satellites Positions...',
  Tracking: 'Tracking...',
  Complete: 'Coomplete Tracking',
};

const geoUrl =
  'https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json';

const WorldMap = ({ observerInfo, satList, disableLeftPanel }) => {
  const [duration, setDuration] = useState(1);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [progressText, setProgressText] = useState('Idle');
  const [satellitesPositions, setSatellitesPositions] = useState([]);
  const [currentTimestamp, setCurrentTimestamp] = useState('');
  const [disable, setDisable] = useState(false);

  const selectedSatellites = satList.filter((satellite) => satellite.selected);

  const trackOnClick = () => {
    const { longitude, latitude, altitude } = observerInfo;

    disableLeftPanel(true);
    setDisable(true);
    setProgressPercentage(0);
    setProgressText(progressStatus.Fetching);
    const fetchSatellitesPositionsPromisese = selectedSatellites.map(
      (satellite) => {
        const { satid } = satellite;

        return fetch(
          `${POSITION_API_BASE_URL}/${satid}/${latitude}/${longitude}/${altitude}/${
            duration * 60
          }&apiKey=${N2YO_API_KEY}`
        ).then((response) => response.json());
      }
    );

    Promise.all(fetchSatellitesPositionsPromisese).then((data) => {
      setProgressText(progressStatus.Tracking);

      let currentMin = 0;
      setSatellitesPositions(getPositionsAtNthMinute(currentMin, data));
      setCurrentTimestamp(
        new Date(data[0].positions[currentMin].timestamp * 1000).toString()
      );

      const intervalId = setInterval(() => {

        currentMin++;
        setProgressPercentage((currentMin / duration) * 100);
        setSatellitesPositions(getPositionsAtNthMinute(currentMin, data));
        setCurrentTimestamp(
          new Date(
            data[0].positions[currentMin * 60 - 1].timestamp * 1000
          ).toString()
        );
        
        if (currentMin === duration) {
          clearInterval(intervalId);
          setProgressText(progressStatus.Complete);
          setDisable(false);
          disableLeftPanel(false);
        }
      }, 1000);
    });
  };

  const getPositionsAtNthMinute = (minute, data) => {
    const currentIndex = minute === 0 ? 0 : minute * 60 - 1;
    return data.map((sat) => {
      return {
        id: sat.info.satid,
        satlatitude: sat.positions[currentIndex].satlatitude,
        satlongitude: sat.positions[currentIndex].satlongitude,
      };
    });
  };

  return (
    <>
      <div className="track-info-panel">
        <Button
          type="primary"
          onClick={trackOnClick}
          disabled={selectedSatellites.length === 0 || disable}
        >
          Track selected satellites
        </Button>
        <span style={{ marginLeft: '10px', marginRight: '10px' }}>for</span>
        <InputNumber
          min={1}
          max={50}
          defaultValue={1}
          onChange={(value) => setDuration(value)}
          disabled={disable}
        />
        <span style={{ marginLeft: '10px', marginRight: '30px' }}>minutes</span>
        <Progress
          style={{ width: '500px' }}
          percent={progressPercentage}
          format={() => progressText}
        />
      </div>
      <div className="time-stamp-container">
        <b>{currentTimestamp}</b>
      </div>
      <div className="world-map-container">
        <ComposableMap
          projectionConfig={{ scale: 137 }}
          style={{ height: '700px', marginLeft: '100px' }}
        >
          <Graticule stroke="#DDD" strokeWidth={0.5} />
          <Sphere stroke="#DDD" strokeWidth={0.5} />
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#7dbcea"
                  stroke="#1f6099"
                />
              ))
            }
          </Geographies>
          {satellitesPositions.map((pos) => (
            <Marker
              coordinates={[pos.satlongitude, pos.satlatitude]}
              key={pos.id}
            >
              <circle r={2} fill="#F53" />
              <text x={5} y={5} fontSize={10}>
                Starlink - {pos.id}
              </text>
            </Marker>
          ))}
        </ComposableMap>
      </div>
    </>
  );
};

export default WorldMap;
