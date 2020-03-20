import React from 'react'
import {Tabs, Menu, Dropdown, Icon, Button, Layout} from 'antd'
import Avatar from './Avatar'
import Head from "next/head";
const data = {
    title: "Something happened with my browser",
    status: "open",
    authorName: "Mark Freemanopened",
    date: "5 Apr 2017",
    commentsCount: 8,
    authorImg: 'https://cleanuitemplate.com/admin/react/preview/resources/images/avatars/1.jpg',
    comments: [
        {
            authorName: "Bill Gates",
            avatar: "https://cleanuitemplate.com/admin/react/preview/resources/images/avatars/1.jpg",
            date: "10 Apr 2016 11:03A",
            content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
            likesCount: 121
        }
    ],
    participants: [
        'https://cleanuitemplate.com/admin/react/preview/resources/images/avatars/1.jpg',
        'https://cleanuitemplate.com/admin/react/preview/resources/images/avatars/1.jpg',
        'https://cleanuitemplate.com/admin/react/preview/resources/images/avatars/1.jpg',
    ]
}
const {TabPane} = Tabs

const postActions = (
    <Menu>
        <Menu.Item>
            <Icon type="edit"/> Edit Post
        </Menu.Item>
        <Menu.Item>
            <Icon type="delete"/> Delete Post
        </Menu.Item>
        <Menu.Item>
            <Icon type="frown-o"/> Mark as a Spam
        </Menu.Item>
    </Menu>
)

class GitHubDiscuss extends React.Component {
    state = {
        discuss: data,
    }

    render() {
        const {discuss} = this.state
        return (
            <Layout className={'p-5'}>
                <Head>
                    <link rel="stylesheet" type="text/css" href="/static/github.css"/>
                </Head>

                <section className="card">
                    <div className="card-header">
                        <div className="utils__title">
                            <strong>GitHub Discussion</strong>
                        </div>
                    </div>
                    <div className="card-body p-5">
                        <div className={discuss}>
                            <div className="mb-3">
                            </div>
                            <div className={`header clearfix`}>
                                <div className='title'>
                                    <h1 className='titleText'>{discuss.title}</h1>
                                    <div className='open'>
                                        <Button type="primary" size="small">
                                            New discussion
                                        </Button>
                                    </div>
                                </div>
                                <div>
                                    {discuss.status === 'open' && (
                                        <span className={`status btn btn-success btn-sm`}><i className="fa fa-check-circle-o mr-2"/>Open</span>
                                    )}
                                    {discuss.status === 'closed' && (
                                        <span className={`status btn btn-success btn-sm`}><i className="fa fa-times-circle mr-2"/>Closed</span>
                                    )}
                                    <div className='metaText'>
                                        <a href="javascript: void(0);" className="mr-1">{discuss.authorName}</a>
                                        opened this discussion on
                                        <span className="ml-1">{discuss.date}</span> ·
                                        <span className="ml-1">{`${discuss.commentsCount} comments`}</span>
                                    </div>
                                </div>
                            </div>
                            {<div className="row">
                                <div className="col-lg-10">
                                    <div>
                                        {discuss.comments.map(comment => (
                                            <div className={"commentItem"} key={comment.authorName}>
                                                <div className="mb-0 pb-0 clearfix">
                                                    <div className={"commentAvatar"}>
                                                        <Avatar src={comment.avatar} size="50" />
                                                    </div>
                                                    <div className={"contentWrapper"}>
                                                        <div className={"commentHead"}>
                                                            <div className="pull-right">
                                                                <Dropdown overlay={postActions}>
                                                                    <a className="ant-dropdown-link" href="javascript: void(0);">
                                                                        Actions <Icon type="down" />
                                                                    </a>
                                                                </Dropdown>
                                                            </div>
                                                            <strong>{comment.authorName}</strong> posted:
                                                            <small className="text-muted ml-2">{comment.date}</small>
                                                        </div>
                                                        <div
                                                            className={"commentContent"}
                                                            dangerouslySetInnerHTML={{ __html: comment.content }}
                                                        />
                                                        <div className={"commentBottom"}>
                                                            <a href="javascript: void(0);" className="mr-2">
                                                                <i className="icmn-heart mr-1" />
                                                                {comment.likesCount > 0 && (
                                                                    <span>{`${comment.likesCount} Likes`}</span>
                                                                )}
                                                                {comment.likesCount === 0 && (
                                                                    <span>{`${comment.likesCount} Like`}</span>
                                                                )}
                                                            </a>
                                                            <a href="javascript: void(0);" className="mr-2">
                                                                <i className="icmn-reply mr-1" />
                                                                Reply
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {discuss.status === 'open' && (
                                        <div className={`addComment clearfix`}>
                                            <div className={'commentAvatar'}>
                                                <Avatar size="50" src={discuss.authorImg} />
                                            </div>
                                            <div className={'contentWrapper'}>
                                                <div className={`commentHead emptyCommentHead p-3`}>

                                                </div>
                                                <div className={'commentBottom'}>
                                                    <Button type="primary">Comment</Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="col-lg-2">
                                    <div>
                                        <div className={'pksidebarItem'}>
                                            <div className={'pksidebarHead'}>Assignees</div>
                                            <div>No one assigned</div>
                                        </div>
                                        <div className={'pksidebarItem'}>
                                            <div className={'pksidebarHead'}>Labels</div>
                                            <div>None yet</div>
                                        </div>
                                        <div className={'pksidebarItem'}>
                                            <div className={'pksidebarHead'}>Projects</div>
                                            <div>None yet</div>
                                        </div>
                                        <div className={'pksidebarItem'}>
                                            <div className={'pksidebarHead'}>Milenstone</div>
                                            <div>No milestone</div>
                                        </div>
                                        <div className={'pksidebarItem'}>
                                            <div className={'pksidebarHead'}>Notifications</div>
                                            <div>You’re ignoring this thread.</div>
                                        </div>
                                        <div className={'pksidebarItem'}>
                                            <div className={'pksidebarHead'}>Participants</div>
                                            <div>
                                                <ul className={'participantsList'}>
                                                    {discuss.participants.map(participant => (
                                                        <li className={'participantsItem'} key={participant}>
                                                            <Avatar size="25" src={participant} />
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>}
                        </div>
                    </div>
                </section>
            </Layout>
        )
    }
}

export default GitHubDiscuss
