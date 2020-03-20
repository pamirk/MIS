import React, {useState} from "react";
import {Button, Card, Divider, Modal} from "antd";

function ChangeProfilePhoto() {
    const [modelVisible, setModelVisible] = useState(true);

    return (
        <>
            <Modal
                destroyOnClose={true}
                width={780}
                visible={modelVisible}
                onOk={setModelVisible(false)}
                onCancel={setModelVisible(false)}
                footer={null}
                closable={false}>
                <Card bordered={false}
                      title={<strong className={'text-large font-weight-bold'}>Request for </strong>}>
                    <Divider/>
                    <div className='flex-justify-content'>
                        <Button size={"large"} className='mr-2' htmlType="submit"
                                style={{backgroundColor: '#0a8080', color: 'white'}}>Send Request</Button>
                        <Button size={"large"} >Cancel</Button>
                    </div>
                </Card>
            </Modal>
        </>
    )
}

export default ChangeProfilePhoto
