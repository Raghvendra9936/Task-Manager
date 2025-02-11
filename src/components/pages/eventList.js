"use strict"
import React from 'react';
import {connect} from 'react-redux';
import {Grid, Col, Row, Button, Panel} from 'react-bootstrap';

import EventForm from './eventForm';
import EventFetch from './eventFetch';

class EventList extends React.Component{
    constructor(){
        super();
        this.state = {
            show_event_form: false,
            show_event_list: false
        }
    }

    showEventForm(){
        this.setState({show_event_form: !(this.state.show_event_form)})
    }

    showEventList(){
        this.setState({show_event_list: !(this.state.show_event_list)})
    }

    show_message = (bool_val) => {
        if (bool_val)
            return "Close your Task Listing Page"
        else
            return "Check previously added Tasks"
    }

    render(){
        return(
            <Grid>
                <Row>
                    <Col xs={12} sm={12} md={12} style={{textAlign: "center"}}>
                        <Panel bsStyle = "primary" style={{margin: '35px'}}>
                        <Panel.Heading>Task_Manager</Panel.Heading>
                        <Panel.Body>
                            <Row><strong>Welcome to Task_Manager</strong></Row>
                            <Row><i>"never forget an event with Task_Manager"</i></Row>
                            <Row>
                                <Button onClick={this.showEventForm.bind(this)}
                                bsStyle='primary pull-left' style={{margin: '15px'}}>
                                Add New Task with Task_Manager
                                </Button>
                                <Button onClick={this.showEventList.bind(this)}
                                bsStyle='primary pull-right' style={{margin: '15px'}}>
                                {this.show_message(this.state.show_event_list)}
                                </Button>
                            </Row>
                        </Panel.Body>
                        </Panel>
                    </Col>
                </Row>
                <Row>
                            <Col xs={12} sm={12} md={12} style={{textAlign: "center", marginLeft: "150px", paddingRight:"350px", paddingBottom: "10px"}}>
                            <EventForm
                                show = {this.state.show_event_form}
                            />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} sm={12} md={12} style={{textAlign: "center"}}>
                            <EventFetch
                            show = {this.state.show_event_list}
                            />
                            </Col>
                        </Row>

                      
            </Grid>            
        )
    }
}


function mapStateToProps(state){
   
    return{events: state.events}
}

export default connect(mapStateToProps)(EventList);
