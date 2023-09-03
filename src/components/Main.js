import React, { useState } from 'react';
import ObserverInfo from './ObserverInfo';
import { Col, Row } from 'antd';
import SatelliteList from './SatelliteList';
import { ABOVE_API_BASE_URL, SAT_CATEGORY, N2YO_API_KEY } from '../constants';
import WorldMap from './WorldMap';

const Main = () => {
  const [observerInfo, setObserverInfo] = useState(undefined);
  const [disableLeftPanel, setDisableLeftPanel] = useState(false);
  const [loadingSatellites, setLoadingSatellites] = useState(false);
  const [satList, setSatList] = useState([]);

  const findSatellitesOnClick = (nextObserverInfo) => {
    setObserverInfo(nextObserverInfo);
    const { longitude, latitude, altitude, radius } = nextObserverInfo;

    setLoadingSatellites(true);
    fetch(
      `${ABOVE_API_BASE_URL}/${latitude}/${longitude}/${altitude}/${radius}/${SAT_CATEGORY}/&apiKey=${N2YO_API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => {
        setSatList(
          data.above.map((satellite) => {
            return {
              ...satellite,
              selected: false,
            };
          })
        );
        setLoadingSatellites(false);
      })
      .catch(() => {
        setLoadingSatellites(false);
      });
  };

  return (
    <Row>
      <Col span={8}>
        <ObserverInfo
          findSatellitesOnClick={findSatellitesOnClick}
          disable={disableLeftPanel}
        />
        <SatelliteList
          loading={loadingSatellites}
          satList={satList}
          updateSatelliteList={setSatList}
          disable={disableLeftPanel}
        />
      </Col>
      <Col span={16}>
        <WorldMap
          observerInfo={observerInfo}
          satList={satList}
          disableLeftPanel={setDisableLeftPanel}
        />
      </Col>
    </Row>
  );
};
export default Main;
