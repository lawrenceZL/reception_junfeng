import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Gmair from './gmair';
import registerServiceWorker from './registerServiceWorker';
import { createStore } from 'redux';
import { Provider} from 'react-redux';
import reducer from './reducers/index';
import {LocaleProvider} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import './antd-mobile.css'
moment.locale('zh-cn');
localStorage.setItem("access_token","4344bc0b-6819-49fc-9442-03d3cbafa840")

let store=createStore(reducer);
ReactDOM.render(<Provider store={store}><LocaleProvider locale={zhCN}><Gmair/></LocaleProvider></Provider>, document.getElementById('root'));

registerServiceWorker();
