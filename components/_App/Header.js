import React from 'react';
import baseUrl from "../../utils/baseUrl";
import {Avatar, Dropdown, Icon, Layout, Menu} from "antd";
import Link from "next/link";
import Router, {useRouter} from "next/router";
import NProgress from "nprogress";
import {handleLogout} from "../../utils/auth";

Router.onRouteChangeStart = () => NProgress.start();
Router.onRouteChangeComplete = () => NProgress.done();
Router.onRouteChangeError = () => NProgress.done();

const flex = {display: "flex", alignItems: "center"};

const avatarDropdown = (
    <Menu  className="app-header-dropdown" >
        <Menu.Item key="4" > Signed in as <strong>Pamir khan</strong> </Menu.Item>
        <Menu.Divider  className="d-block d-md-none" />
        <Menu.Item key="1"> Settings </Menu.Item>
        <Menu.Item key="0"><a><span>About</span></a></Menu.Item>
        <Menu.Item key="2"> <a >Need Help?</a> </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="3"> <a>Sign out</a> </Menu.Item>
    </Menu>
);

function Header({user}) {
    const authUser = user && user.employee;
    const router = useRouter();

    function isActive(route) {
        return route === router.pathname;
    }

    return (
        <Layout>
            <Menu selectable={false} style={{display: "flex", justifyContent: "flex-end"}}
                  theme={"light"}
                  mode="horizontal">
                {(authUser && !authUser.user_cnic) &&
                <Menu.Item key="Avatar">
                    <Avatar size={32} src={baseUrl + '/' + authUser.employee_photo}/>
                    {/*overlay={avatarDropdown}*/}
                  {/*  <Dropdown className="list-inline-item"  trigger={['click']} placement="bottomRight">
                        <a className="ant-dropdown-link no-link-style" >${config.hostUrl}/${authUser.employee_photo}
                            <Avatar src='https://pbs.twimg.com/profile_images/1100640894796132352/h9otzyUn_x96.png' size="small" />
                            <span className="ml-2">{authUser.full_name.split(' ')[0]}</span>
                        </a>
                    </Dropdown>*/}
                </Menu.Item>
                }
                {(authUser && !authUser.user_cnic)
                    ? <Menu.Item key="signup1">
                        Welcome, {authUser.full_name}!
                    </Menu.Item>
                    : authUser && <Menu.Item key="signup2">
                    Welcome, {authUser.user_name}!
                </Menu.Item>
                }


                {authUser &&
                <Menu.Item key="signout" onClick={handleLogout}>
                    <Icon type="logout" /> Sign Out
                </Menu.Item>
                }

                {!authUser &&
                <Menu.Item key="signup3">
                    <Link href="/signup"><a>Sign Up</a></Link>
                </Menu.Item>
                }
                {!authUser &&
                <Menu.Item key="signin">
                    <Link href="/signin"><a>Sign In</a></Link>
                </Menu.Item>
                }
            </Menu>

        </Layout>
    );
};
export default Header;
