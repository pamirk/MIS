import React from 'react'
import {Input, Icon, Tooltip, Checkbox, Layout} from 'antd'
import Head from "next/head";

class ExtraAppsTodoistList extends React.Component {
    constructor(props) {
        super(props)
        this.taskInput = React.createRef()
    }

    state = {
        treeData: [
            {name: 'Level 1'},
            {
                name: 'Level 2',
                expanded: true,
                children: [{name: 'Level 2'}, {name: 'Level 2'}, {name: 'Level 2'}],
            },
        ],
        completed: [
            {name: 'Level 0', checked: true},
            {name: 'Level 0', checked: true},
            {name: 'Level 0', checked: true},
        ],
        hideInput: true,
    }

    toggleInput = () => {
        const {hideInput} = this.state
        this.setState({
            hideInput: !hideInput,
        })
    }

    addTask = e => {
        const task = e.target.value;

        if (e.which === 13 && task !== '') {
            let {treeData} = this.state;
            treeData = treeData.concat({
                name: task,
            });

            this.setState({
                treeData,
            });
            this.taskInput.current.value = ''
        }
    };

    render() {
        const {treeData, hideInput, completed} = this.state;
        const getNodeKey = ({treeIndex}) => treeIndex;

        return (
            <div>
              <Head>
                <link rel="stylesheet" type="text/css" href="/static/github.css"/>
              </Head>
                <div className="air__utils__heading">
                    <h5>Todoist List</h5>
                </div>
                <div className="row">
                    <div className="col-12 col-md-3">
                        <div className="mb-4">
                            <Input
                                prefix={<Icon type="search" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                placeholder="Search mail..."
                            />
                        </div>
                        <div className={'categories'}>
                            <div className="d-flex flex-column">
                                <div
                                    className={` category title text-dark font-size-18 font-weight-bold`}
                                >
                                    <span className="text-truncate">Overall</span>
                                </div>
                                <a
                                    href="#"
                                    onClick={e => e.preventDefault()}
                                    className={`category text-dark font-size-18`}
                                >
                                    <span className="text-truncate">Today</span>
                                </a>
                                <a
                                    href="#"
                                    onClick={e => e.preventDefault()}
                                    className={`category text-dark font-size-18`}
                                >
                                    <span className="text-truncate">Next 7 days</span>
                                </a>
                                <div
                                    className={` category title text-dark font-size-18 font-weight-bold`}
                                >
                                    <span className="text-truncate">To Do Lists</span>
                                </div>
                                <a
                                    href="#"
                                    onClick={e => e.preventDefault()}
                                    className={`category current text-dark font-size-18`}
                                >
                  <span className="text-truncate">
                    Welcome{' '}
                      <span role="img" aria-label="hello">
                      &#128075;
                    </span>
                  </span>
                                </a>
                                <a
                                    href="#"
                                    onClick={e => e.preventDefault()}
                                    className={`category text-dark font-size-18`}
                                >
                                    <span className="text-truncate">Homework (1)</span>
                                </a>
                                <a
                                    href="#"
                                    onClick={e => e.preventDefault()}
                                    className={`category text-dark font-size-18`}
                                >
                                    <span className="text-truncate">Fitness</span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-9">
                        <div className="card">
                            <div className="card-header card-header-flex align-items-center">
                                <div className="d-flex flex-column justify-content-center mr-auto">
                                    <h5 className="mb-0">
                                        Welcome{' '}
                                        <span role="img" aria-label="hello">
                      &#128075;
                    </span>
                                    </h5>
                                </div>
                                <div>
                                    <Tooltip placement="top" title="Unlock Account">
                                        <a
                                            href="#"
                                            onClick={e => e.preventDefault()}
                                            className="btn btn-sm btn-light mr-2"
                                        >
                                            <i className="fe fe-unlock"/>
                                        </a>
                                    </Tooltip>
                                    <Tooltip placement="top" title="Mark as important">
                                        <a
                                            href="#"
                                            onClick={e => e.preventDefault()}
                                            className="btn btn-sm btn-light mr-2"
                                        >
                                            <i className="fe fe-star"/>
                                        </a>
                                    </Tooltip>
                                    <Tooltip placement="top" title="Delete user">
                                        <a href="#" onClick={e => e.preventDefault()} className="btn btn-sm btn-light">
                                            <i className="fe fe-trash"/>
                                        </a>
                                    </Tooltip>
                                </div>
                            </div>
                            <div className="card-body">
                                <h6 className="text-uppercase text-dark font-size-18 font-weight-bold mb-2">
                                    Current tasks
                                </h6>
                                <p className="mb-3">
                                    Welocme to Todoist! Let&apos;s get you started with a few tips
                                </p>
                                <div className="height-400">

                                </div>
                                <button
                                    type="button"
                                    className="btn btn-primary btn-with-addon text-nowrap"
                                    onClick={this.toggleInput}>
                  <span className="btn-addon">
                    <i className="btn-addon-icon fe fe-plus-circle"/>
                  </span>
                                    Add Task
                                </button>
                                <input
                                    hidden={hideInput}
                                    className="form-control mt-3"
                                    placeholder="Add task here and press enter..."
                                    type="text"
                                    onKeyPress={e => this.addTask(e)}
                                    ref={this.taskInput}
                                />
                                <h6 className="text-uppercase text-dark font-size-18 font-weight-bold mb-2 mt-4">
                                    Completed
                                </h6>
                                <p className="mb-3">
                                    Welocme to Todoist! Let&apos;s get you started with a few tips
                                </p>
                                <div className="height-200">

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ExtraAppsTodoistList
