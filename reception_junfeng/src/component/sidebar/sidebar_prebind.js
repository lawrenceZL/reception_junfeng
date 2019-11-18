import React from 'react';
import {Menu, Icon, Layout} from 'antd'

const {Sider} = Layout;

class SidebarPrebind extends React.Component {
    constructor(){
        super();
        this.state = {
            current: 'none',
            collapsed: false,
        }
        this.handleClick = this.handleClick.bind(this);
        this.toggle = this.toggle.bind(this);
    }

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }

    handleClick = (e) => {
        this.setState({
            current: e.key,
        });
        window.location.href = '' + e.key
    }

    render() {
        return <Sider collapsible
                      collapsed={this.state.collapsed}
                      onCollapse={this.toggle}
                      width={200}
                      style={{background: '#fff'}}>
            <Menu
                onClick={this.handleClick}
                selectedKeys={[this.state.current]}
                mode="inline"
                style={{height: '100%', borderRight: 0}}
            >
                <Menu.Item key="/prebind">
                    <Icon type="build"/>
                    <span>预绑定</span>
                </Menu.Item>
                <Menu.Item key="/prebind/list">
                    <Icon type="ordered-list"/>
                    <span>绑定列表</span>
                </Menu.Item>

            </Menu>
        </Sider>
    }
}

export default SidebarPrebind;