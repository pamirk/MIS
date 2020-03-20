import {Card, Divider} from "antd";

function Index() {
    return (
        <Card style={{minHeight: '100vh'}} className='text-large font-weight-bolder p-2'>
            <h1 className="">Record time off for an
                employee</h1>
            <Divider/>
            <div className='pt-5'>
                <img className="zp-icon-image content-block-with-icon__icon"
                     src="https://d3bnlkto289wdc.cloudfront.net/assets/_/_/node_modules/@gusto/component-library/illustrations/illo-calendar-fd3475849b8ab9f349d38c46d309456a.svg"/>

                <div className="content-block-with-icon__content">
                    <p className="pb-4" style={{fontSize: '18px'}}>When you record time off
                        for an employee, it’s automatically approved. We’ll also email the employee to let them know
                        you’ve
                        submitted time off for them.</p>
                    <form className="form-horizontal top-label-form">
                        <div className="question">
                            <div className="question-text">Who’s taking time off?</div>
                            <div className="form-group">
                                <div className="controls col-sm-9">
                                    <div
                                        className="Select autocomplete padding-side-none col-sm-6 col-vs-12 employee-id-input is-clearable is-searchable Select--single">
                                        <div className="Select-control">
                                            <div className="Select-multi-value-wrapper" id="react-select-3--value">
                                                <div className="Select-placeholder">Employee Name</div>
                                                <div className="Select-input" style={{display: 'inline-block'}}><input
                                                    id="employee_id" aria-activedescendant="react-select-3--value"
                                                    aria-expanded="false" aria-haspopup="false" aria-owns=""
                                                    role="combobox" value=""
                                                    style={{boxSizing: 'content-box', width: '5px'}}/>
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: '0px',
                                                        left: '0px',
                                                        visibility: 'hidden',
                                                        height: '0px',
                                                        overflow: 'scroll',
                                                        whiteSpace: 'pre',
                                                        fontSize: '16px',
                                                        fontFamily: 'GCentra -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif',
                                                        fontWeight: '400',
                                                        fontStyle: 'normal',
                                                        letterSpacing: 'normal',
                                                        textTransform: 'none'
                                                    }}>

                                                    </div>
                                                </div>
                                            </div>
                                            <span className="Select-arrow-zone"><span
                                                className="Select-arrow"></span></span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="question">
                            <div className="question-text">What kind of time off is it?</div>
                            <div className="form-group">
                                <div className="controls col-sm-9">
                                    <div className="col-sm-6 col-vs-12 padding-none request-type-input">
                                        <div className="select-wrapper"><select disabled=""
                                                                                className="request-type-input"
                                                                                id="request_type">
                                            <option>- Please Select -</option>
                                        </select></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="question question-dates date-range-picker">
                            <div className="question-text">When will they be away?</div>
                            <div className="form-group">
                                <div className="controls">
                                    <div className="react-datepicker-wrapper">
                                        <div className="react-datepicker__input-container">
                                            <div className="datepicker-input input-group">
                                                <span className="input-group-addon">
                                                    <i className="zp-icon zp-icon-calendar-outline"
                                                       aria-hidden="true">
                                                    </i>
                                                </span>
                                                <input className="form-control"
                                                       name="first_day"
                                                       placeholder="First day" disabled=""
                                                       autoComplete="off" value=""/></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <span className="input-separator"> to </span>
                            <div className="form-group">
                                <div className="controls">
                                    <div className="react-datepicker-wrapper">
                                        <div className="react-datepicker__input-container">
                                            <div className="datepicker-input input-group">
                                                <span className="input-group-addon">
                                                <i className="zp-icon zp-icon-calendar-outline"
                                                   aria-hidden="true">
                                                </i>
                                            </span>
                                                <input className="form-control"
                                                       name="last_day"
                                                       placeholder="Last day" disabled=""
                                                       autoComplete="off" value=""/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="form-actions">
                            <div className="ajax-spinner">
                                <button className="btn btn-primary save" type="button" disabled="">Record Time Off</button>
                                <button className="btn btn-secondary cancel" type="button">Cancel</button>
                                <div className="spinner display-none">
                                    <img src="https://d3bnlkto289wdc.cloudfront.net/assets/_/_/node_modules/@gusto/component-library/assets/images/loader-spinner-f4d2da7a6e956901a2bd84f394edb6b7.gif"
                                        alt="Loading. Please Wait."/>
                                    <span className="inline-block margin-left-5px">Please wait…</span>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>


            </div>
        </Card>
    );
}

export default Index;
