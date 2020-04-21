import React from 'react'
import {Col, Row} from "reactstrap";

export default function List18({categoryData}) {
    return (
        <Row>
            {categoryData && categoryData.map(i =>
                <Col key={i.category}>
                    <div>
                        <div style={{padding: '17px 0 17px 25px'}}>
                        <span style={{
                            display: 'block',
                            width: '15px',
                            height: '15px',
                            textIndent: '-9999px',
                            float: 'left',
                            margin: '3px 0 0 -25px',
                            borderRadius: '50%',
                            backgroundColor: '#3659a2'
                        }}>•</span>
                            <h2>{i.count}</h2>
                        </div>
                    </div>
                    <div style={{
                        fontSize: '14px',
                        color: '#a9b3bb',
                        lineHeight: '1.4',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        display: 'block',
                    }}>{i.category}</div>
                </Col>
            )}
        </Row>
    );
}

