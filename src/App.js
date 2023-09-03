import React from 'react';
import starlinkLogo from './assets/images/starlink_logo.svg'
import { Layout } from 'antd';
import Main from './components/Main';

const { Header, Footer, Content } = Layout;

function App() {
  return (
    <Layout>
      <Header>
        <img src={starlinkLogo} className="App-logo" alt="logo" />
        <p className="title">StarLink Tracker</p>
      </Header>
      <Content>
        <Main />
      </Content>
      <Footer>
        @2022 StarLink Tracker. All Rights Reserved. Website Made by Yen-Jung Luo
      </Footer>
    </Layout>
  );
}

export default App;
