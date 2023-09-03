import React from 'react';
import Title from 'antd/lib/typography/Title';
import { Spin, List, Checkbox, Avatar } from 'antd';
import satelliteImage from '../assets/images/satellite.svg';

const SatelliteList = ({ loading, satList, updateSatelliteList, disable }) => {
  const onSelectionChange = (checked, targetSatellite) => {
    const nextSatelliteList = satList.map((satellite) => {
      if (satellite.satid === targetSatellite.satid) {
        return {
          ...satellite,
          selected: checked,
        };
      } else {
        return {
          ...satellite,
        };
      }
    });
    updateSatelliteList(nextSatelliteList);
  };

  return (
    <div className="satellite-list-container">
      <Title level={5}>
        Nearby Satellites ({satList ? satList.length : 0})
      </Title>
      <p>
        Select the satellites you wanna track on the world map at the right side
      </p>
      <hr />
      {loading ? (
        <div className="spin-box">
          <Spin tip="Loading..." size="large" />
        </div>
      ) : (
        <List
          className="sat-list"
          itemLayout="horizontal"
          dataSource={satList}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Checkbox
                  disabled={disable}
                  dataInfo={item}
                  onChange={(e) => {
                    onSelectionChange(e.target.checked, e.target.dataInfo);
                  }}
                />,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={satelliteImage}
                    size="larg"
                    alt="satellite image"
                  />
                }
                title={<p>{item.satname}</p>}
                description={`Launch Date: ${item.launchDate}`}
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default SatelliteList;
