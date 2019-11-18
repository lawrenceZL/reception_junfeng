import React from 'react'
import {preparation_service} from "../service/preparation.service";
import {datetimeService} from '../service/datetime.service';
import SidebarPrebind from "../sidebar/sidebar_prebind"
import {Layout, Breadcrumb} from 'antd'

import {
    Alert,
    Button,
    ButtonToolbar,
    ControlLabel,
    Form,
    FormControl,
    FormGroup,
    ListGroup,
    ListGroupItem
} from 'react-bootstrap'

import DatePicker from 'react-16-bootstrap-date-picker'
import GmairHeader from "../header/header";

const {Content} = Layout

const prebind_area = {
    paddingTop: `51px`
}

const DAY_LABELS = ['日', '一', '二', '三', '四', '五', '六'];

const MONTH_LABELS = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

class BindList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            start: '',
            end: '',
            qrcode: '',
            mac: '',
            records: [],
            enable_del: false,
            del_mode: false,
            to_del_record: null,
            del_result: ''
        };
        this.load_start_date = this.load_start_date.bind(this);
        this.load_end_date = this.load_end_date.bind(this);
        this.read_qrcode = this.read_qrcode.bind(this);
        this.read_mac = this.read_mac.bind(this);
        this.begin_seach = this.begin_seach.bind(this);
        this.enable_del = this.enable_del.bind(this);
        this.remove_bind = this.remove_bind.bind(this);
        this.confirm_remove = this.confirm_remove.bind(this);
        this.reset = this.reset.bind(this);
    }

    componentDidMount() {
        preparation_service.obtain_prebind_list().then(response => {
            if (response.responseCode === 'RESPONSE_OK') {
                this.setState({records: response.data});
            }
        })
    }

    reset = () => {
        this.setState({enable_del: false, del_mode: false, to_del_record: null})
    }

    load_start_date = (value, formattedValue) => {
        this.setState({start: formattedValue});
    }

    load_end_date = (value, formattedValue) => {
        this.setState({end: formattedValue});
    }

    read_qrcode = (e) => {
        this.setState({qrcode: e.target.value})
    }

    read_mac = (e) => {
        this.setState({mac: e.target.value})
    }

    begin_seach = () => {
        preparation_service.prebind_list(this.state.qrcode, this.state.mac, this.state.start, this.state.end).then((response) => {
            if (response.responseCode === 'RESPONSE_OK') {
                this.setState({records: response.data});
            } else {
                this.setState({records: []});
            }
        });
    }

    enable_del = () => {
        this.setState({enable_del: !this.state.enable_del})
    }

    remove_bind = (e) => {
        console.log(e.target.id);
        this.setState({del_mode: true});
        let record_list = this.state.records;
        for (let i = 0; i < record_list.length; i++) {
            if (e.target.id === record_list[i].bindId) {
                this.setState({to_del_record: record_list[i]});
            }
        }
    }

    confirm_remove = () => {
        let record = this.state.to_del_record;
        let bind_id = record.bindId;
        preparation_service.remove_prebind_record(bind_id).then(response => {
            if (response.responseCode === 'RESPONSE_OK') {
                this.setState({del_result: '二维码: ' + record.codeValue + ', MAC地址: ' + record.machineId + '所对应的绑定信息删除成功'})
            } else {
                this.setState({del_result: '二维码: ' + record.codeValue + ', MAC地址: ' + record.machineId + '所对应的绑定信息删除失败,请联系工作人员'})
            }
            this.reset();
            let record_list = this.state.records;
            let remaining_list = [];
            for (let i = 0; i < record_list.length; i++) {
                if (record_list[i].bindId !== bind_id) {
                    remaining_list.push(record_list[i]);
                }
            }
            this.setState({records: remaining_list});

        })
    }

    clear_del_msg = () => {
        this.setState({del_result: ''});
    }

    render() {
        let records = this.state.records;
        let that = this;
        let list = records.map(function (item, index) {
            return (<ListGroupItem bsStyle={index % 2 === 0 ? 'success' : 'warning'}
                                   key={item.bindId}> MAC:&nbsp;{item.machineId},
                二维码:&nbsp;{item.codeValue},{' '}录入时间:{' '}{datetimeService.formatTimeStampToDateTime(item.createAt)}{' '}
                {that.state.enable_del &&
                <Button bsStyle='danger' id={item.bindId} onClick={that.remove_bind}>删除</Button>}</ListGroupItem>)
        })

        return (
            <div>
                <GmairHeader/>
                <Layout>
                    <SidebarPrebind/>
                    <Layout style={{padding: '0 24px 24px'}}>
                        <Breadcrumb style={{margin: '16px 0'}}>
                            <Breadcrumb.Item>预绑定列表</Breadcrumb.Item>
                        </Breadcrumb>
                        <Content style={{background: '#fff', padding: 24, margin: 0, minHeight: 560}}>
                            <div className='page'>
                                <div style={prebind_area}>
                                    <div className='container-fluid'>
                                        <Form inline>

                                            <FormGroup>
                                                <ControlLabel>起始时间</ControlLabel> {' '}
                                                <DatePicker autoComplete='off' dateFormat='YYYY-MM-DD' cellPadding='6px'
                                                            dayLabels={DAY_LABELS} monthLabels={MONTH_LABELS}
                                                            value={this.state.start}
                                                            onChange={this.load_start_date}/>
                                            </FormGroup> {' '}
                                            <FormGroup>
                                                <ControlLabel>截止时间</ControlLabel> {' '}
                                                <DatePicker autoComplete='off' dateFormat='YYYY-MM-DD' cellPadding='6px'
                                                            dayLabels={DAY_LABELS} monthLabels={MONTH_LABELS}
                                                            value={this.state.end}
                                                            onChange={this.load_end_date}/>
                                            </FormGroup> {' '}
                                            <FormGroup>
                                                <ControlLabel>二维码</ControlLabel> {' '}
                                                <FormControl type='text' value={this.state.qrcode}
                                                             onChange={this.read_qrcode}></FormControl>
                                            </FormGroup> {' '}
                                            <FormGroup>
                                                <ControlLabel>MAC</ControlLabel> {' '}
                                                <FormControl type='text' value={this.state.mac}
                                                             onChange={this.read_mac}></FormControl>
                                            </FormGroup> {' '}
                                            <FormGroup>
                                                <ButtonToolbar>
                                                    <Button bsStyle='success'
                                                            onClick={this.begin_seach}>查询</Button>{' '}
                                                    <Button bsStyle='danger'
                                                            onClick={this.enable_del}>删除模式</Button>{' '}
                                                </ButtonToolbar>
                                            </FormGroup>
                                        </Form>
                                        {this.state.del_mode ?
                                            <div>
                                                <Alert bsStyle="danger" style={{marginTop: '20px'}}>
                                                    <h4>您将删除以下内容</h4>
                                                    <ListGroup style={{marginTop: '20px'}}>
                                                        <ListGroupItem bsStyle='success'
                                                                       key={this.state.to_del_record.bindId}> MAC:&nbsp;{this.state.to_del_record.machineId},
                                                            二维码:&nbsp;{this.state.to_del_record.codeValue},{' '}录入时间:{' '}{datetimeService.formatTimeStampToDateTime(this.state.to_del_record.createAt)}{' '}
                                                        </ListGroupItem>
                                                    </ListGroup>
                                                    <ButtonToolbar>
                                                        <Button bsStyle='danger' id={this.state.to_del_record.bindId}
                                                                onClick={this.confirm_remove}
                                                                style={{marginTop: '20px'}}>确认删除</Button>
                                                    </ButtonToolbar>
                                                </Alert>
                                            </div>
                                            :
                                            <div>
                                                {this.state.del_result !== '' &&
                                                <Alert bsStyle='success' style={{marginTop: '20px'}}
                                                       onDismiss={this.clear_del_msg}>
                                                    {this.state.del_result}
                                                </Alert>
                                                }
                                                <ListGroup style={{marginTop: '20px'}}>
                                                    <p>共{this.state.records.length}条记录</p>
                                                    {list}
                                                </ListGroup>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </Content>
                    </Layout>
                </Layout>
            </div>
        )
    }
}

export default BindList
