import Title from 'antd/lib/typography/Title';
import React from 'react';
import { InputNumber, Form, Button } from 'antd';

const ObserverInfo = ({ findSatellitesOnClick, disable }) => {
  const onFormFinish = (observerInfo) => {
    findSatellitesOnClick(observerInfo);
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 24 },
  };

  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  return (
    <div className="observer-info-container">
      <Title level={5}>Observer Info</Title>
      <Form
        {...layout}
        initialValues={{
          longitude: '0',
          latitude: '0',
          altitude: '0',
          radius: '0',
        }}
        onFinish={onFormFinish}
      >
        <Form.Item
          label="Longitude"
          name="longitude"
          rules={[
            {
              required: true,
              message: 'Please enter a valid longitude!',
            },
          ]}
        >
          <InputNumber
            min={-180}
            max={180}
            style={{ width: '40%' }}
            disabled={disable}
          />
        </Form.Item>

        <Form.Item
          label="Latitude"
          name="latitude"
          rules={[
            {
              required: true,
              message: 'Please enter a valid latitude!',
            },
          ]}
        >
          <InputNumber
            min={-90}
            max={90}
            style={{ width: '40%' }}
            disabled={disable}
          />
        </Form.Item>

        <Form.Item
          label="Altitude(meters)"
          name="altitude"
          rules={[
            {
              required: true,
              message: 'Please enter a valid altitude!',
            },
          ]}
        >
          <InputNumber
            min={-413}
            max={8850}
            style={{ width: '40%' }}
            disabled={disable}
          />
        </Form.Item>

        <Form.Item
          label="Radius"
          name="radius"
          rules={[
            {
              required: true,
              message: 'Please enter a valid radius!',
            },
          ]}
        >
          <InputNumber
            min={0}
            max={90}
            style={{ width: '40%' }}
            disabled={disable}
          />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit" disabled={disable}>
            Find nearby satellites
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default ObserverInfo;
