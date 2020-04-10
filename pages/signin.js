import React from "react";
import {Tabs} from "antd";
import Head from "next/head";
import EmployeeSignin from "../components/auth/EmployeeSignin";
import UserSignin from "../components/auth/UserSignin";

const { TabPane } = Tabs;
function sigin() {
    return (
        <div style={{minHeight: '100vh'}}>
            <Head>
                <link rel="stylesheet" type="text/css" href="/static/authentication.css"/>
            </Head>
            <div className="gx-login-container bg-authentication min-vh-100">
                <div>
                    <div className="gx-login-content mb-0 w-100" title='Login'>
                            <span className="px-2 ant-card-head-title">
                                Welcome back, please login to your account.</span>
                        <Tabs size='large' className=''>
                            <TabPane tab="Employee Signin" key="1">
                                <EmployeeSignin/>
                            </TabPane>
                            <TabPane tab="User Signin" key="2">
                                <UserSignin />
                            </TabPane>

                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default sigin;
