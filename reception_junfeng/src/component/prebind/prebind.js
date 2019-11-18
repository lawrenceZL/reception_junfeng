import React from 'react'
import {Layout, Breadcrumb} from 'antd'
import {
    Alert,
    Button,
    ButtonToolbar,
    Form,
    FormGroup,
    ListGroup,
    ListGroupItem
} from 'react-bootstrap'

import {preparation_service} from "../service/preparation.service";
import SidebarPrebind from "../sidebar/sidebar_prebind"
import GmairHeader from "../header/header";

const {Content} = Layout;

class Prebind extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show_upload: true,
            records: [],
            warning: false,
            result: ''
        };
        this.reset_upload = this.reset_upload.bind(this);
    }

    process_file = files => {
        this.setState({show_upload: false})
        let reader = new FileReader();
        let that = this;
        reader.onload = function () {
            let result = [];
            let mac_list = [];
            let qrcode_list = [];
            let content = reader.result
            let records = content.replace(/\r/g, '').split('\n');
            for (let i = 0; i < records.length; i++) {
                if (records[i].trim().length == 0)
                    continue;
                let item = records[i].split(',');
                let mac = item[0].split('=')[1].trim()
                let qrcode = item[1].split('=')[1].trim()
                let version = item[2].split('=')[1].trim();
                let record = {};
                record.machineId = mac;
                record.codeValue = qrcode;
                record.version = version;
                if (mac_list.indexOf(mac) >= 0 || qrcode_list.indexOf(qrcode) >= 0) {
                    record.abnormal = true;
                    that.setState({warning: true})
                } else {
                    record.abnormal = false;
                }
                mac_list.push(mac);
                qrcode_list.push(qrcode);
                result.push(record);
            }
            that.setState({records: result})
        }
        reader.readAsText(files[0]);
    }

    reset_upload = () => {
        this.setState({show_upload: true, records: [], warning: false})
    }

    upload = () => {
        if (this.state.records.length == 1) {
            preparation_service.pre_bind_single(this.state.records).then(response => {
                if (response.responseCode === 'RESPONSE_OK') {
                    this.setState({result: '绑定成功'})
                } else {
                    this.setState({result: response.description})
                }
            });
        } else if (this.state.records.length > 1) {
            preparation_service.pre_bind_batch(this.state.records).then(response => {
                if (response.responseCode === 'RESPONSE_OK') {
                    this.setState({result: '绑定成功'})
                } else {
                    this.setState({result: response.description})
                }
            });
        }
    }

    render() {
        let records = this.state.records;
        let list = records.map(function (item) {
            return <ListGroupItem bsStyle={item.abnormal ? 'danger' : 'success'}
                                  key={item.machineId}>MAC:&nbsp;{item.machineId},
                二维码:&nbsp;{item.codeValue},&nbsp;版本号:{item.version}</ListGroupItem>
        })

        return (
            <div>
                <GmairHeader/>
                <Layout>
                    <SidebarPrebind/>
                    <Layout style={{padding: '0 24px 24px'}}>
                        <Breadcrumb style={{margin: '16px 0'}}>
                            <Breadcrumb.Item>预绑定</Breadcrumb.Item>
                        </Breadcrumb>
                        <Content style={{background: '#fff', padding: 24, margin: 0, minHeight: 560}}>
                            <div className='page'>
                                <div className='container-fluid'>
                                    <Form>
                                        {
                                            this.state.show_upload
                                            &&
                                            <FormGroup>
                                                <input type={'file'}
                                                       id={'file'}
                                                       className={'input-file'}
                                                       accept={'.csv'}
                                                       onChange={e => this.process_file(e.target.files)}>
                                                </input>
                                            </FormGroup>
                                        }
                                        {!this.state.show_upload
                                        &&
                                        <div>
                                            <ListGroup>
                                                {list}
                                            </ListGroup>
                                        </div>
                                        }
                                        {
                                            !this.state.show_upload && this.state.warning &&
                                            <div>
                                                <ButtonToolbar>
                                                    <Button bsStyle='danger'>我知道了</Button>
                                                    <Button bsStyle='success' onClick={this.reset_upload}>重新上传</Button>
                                                </ButtonToolbar>
                                            </div>
                                        }
                                        {
                                            !this.state.show_upload && !this.state.warning &&
                                            <div>
                                                <ButtonToolbar>
                                                    <Button bsStyle='success' onClick={this.upload}>确认上传</Button>
                                                </ButtonToolbar>
                                            </div>
                                        }
                                    </Form>
                                    {
                                        this.state.result !== '' &&
                                        <Alert bsStyle="warning">
                                            {this.state.result}
                                        </Alert>
                                    }
                                </div>
                            </div>
                        </Content>
                    </Layout>
                </Layout>
            </div>
        )
    }
}

export default Prebind;
