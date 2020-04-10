import React, {useState} from "react";
import Head from "next/head";
import {Layout, Menu, Icon} from 'antd';
import Header from "./Header";
import HeadContent from "./HeadContent";
import Link from "next/link";
import Logo from "../../static/logo.svg";
import Plane from "../../static/plane.svg";
import Training from "../../static/training.svg";
import Register from "../../static/register.svg";
import Complaint from "../../static/complaint.svg";

const {Sider, Content} = Layout;

function AppLayout({children, user}) {
    const [collapsed, setCollapsed] = useState(true);
    const toggle = () => setCollapsed(!collapsed);
    const flex = {display: "flex", alignItems: "center"};
    const authUser = user && user.employeeLogin;

    const menulinks = (authUser && authUser.is_admin === 0)
        ?
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['100']}>

            <Menu.Item key="8">
                <Link href="/register_complaint">
                    <a> <span>Add Complaint</span></a>
                    </Link>
                </Menu.Item>
            <Menu.Item key="9">
                <Link href="/complaints">
                    <a> <span>View Complaints</span></a>
                </Link>
            </Menu.Item>
            <Menu.Item key="11">
                <Link href="/leave2">
                    <a><span>Time Off</span></a>
                </Link>
            </Menu.Item>
            <Menu.Item key="12">
                <Link href="/employee/details">
                    <a><span>Personal details</span></a>
                </Link>
            </Menu.Item>
        </Menu>
        :
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['100']}>
            {/*<Menu.Item key="1">
                <Link
                    href="/create_employee">
                    <a> <Icon component={Register}/> <span>Register Employee</span></a>
                </Link>
            </Menu.Item>*/}
            <Menu.Item key="2">
                <Link href="/add_employee">
                    <a> <span>Add Employee</span></a>
                </Link>
            </Menu.Item>
            <Menu.Item key="3">
                <Link href="/employees">
                    <a> <span>All Employees</span></a>
                </Link>
            </Menu.Item>
            {/* <Menu.Item key="4">
                <Link href="/create_designation">
                    <a> <Icon type="plus"/><span>Add Designation</span></a>
                </Link>
            </Menu.Item>
            <Menu.Item key="5">
                <Link href="/create_department">
                    <a> <Icon type="plus"/><span>Add Department</span></a>
                </Link>
            </Menu.Item>
            <Menu.Item key="6">
                <Link href="/create_division">
                    <a><Icon type="plus"/><span>Add Division</span></a>
                </Link>
            </Menu.Item>
            <Menu.Item key="7">
                <Link href="/create_sub_division">
                    <a><Icon type="plus"/><span>Add Sub Division</span></a>
                </Link>
            </Menu.Item>*/}
            <Menu.Item key="8">
                <Link href="/complaints">
                    <a><span>Complaints</span></a>
                </Link>
            </Menu.Item>
            {/*<Menu.Item key="9">
                    <Link  href="/complain_reports"><a>Complaint Reports</a></Link>
                </Menu.Item>*/}
            <Menu.Item key="10">
                <Link href="/leave">
                    <a><span>Time Off</span></a>
                </Link>
            </Menu.Item>
            <Menu.Item key="11">
                <Link href="/tubewells">
                    <a><span>Tubewells</span></a>
                </Link>
            </Menu.Item>
            <Menu.Item key="12">
                <Link href="/trainings">
                    <a><span>Trainings</span></a>
                </Link>
            </Menu.Item>
            <Menu.Item key="13">
                <Link href="/roles">
                    <a><span>Roles</span></a>
                </Link>
            </Menu.Item>
        </Menu>;

    return (
        <>
            <Head>
                <HeadContent/>
                <link rel="stylesheet" type="text/css" href="/static/bootstrap.css"/>
                <link rel="stylesheet" type="text/css" href="/static/antd.min.css"/>
                <link rel="stylesheet" type="text/css" href="/static/styles.css"/>
                <link rel="stylesheet" type="text/css" href="/static/Menu.css"/>
                <link rel="stylesheet" type="text/css" href="/static/base.css"/>
                <link rel="stylesheet" type="text/css" href="/static/nprogress.css"/>

                <title>QMC</title>
            </Head>
            <Layout>
                <Sider hidden={!authUser}
                       style={{minHeight: '100vh'}}
                       trigger={collapsed ? "" : null}
                       breakpoint="lg"
                       collapsedWidth="0"
                       onBreakpoint={broken => setCollapsed(true)}>
                    <div className="header--logo">
                        <Link href="/"><strong className='logo-text'>QMC</strong></Link></div>
                    {menulinks}
                </Sider>
                <Layout>
                    <Header user={user}/>
                    <Content>
                        {children}
                    </Content>
                </Layout>
            </Layout>

        </>
    );
}


export default AppLayout;
