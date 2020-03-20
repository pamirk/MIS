import React, {Component} from 'react';
import {Steps} from "antd";

export default class ProgressStepper extends Component {
    render() {
        const {Step} = Steps;
        const {curr} = this.props;
        return (
            <div className='p-5'>
                <Steps size="small" current={curr} status="process">
                    <Step title="Registration"/>
                    <Step title="Address"/>
                    <Step title="Designation"/>
                </Steps>
            </div>
        );
    }
}
