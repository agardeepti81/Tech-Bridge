import React, { Component } from "react";
import "./zone-section.css";

import { Accordion, Button, Card, useAccordionButton } from "react-bootstrap";

class ZoneSection extends Component {
    render() {
        return (<div>
            <Accordion defaultActiveKey="0">
                <Card>
                    <Card.Header className="instructionHeader">
                        <div className="instruction">Play Course Video</div>
                        <Button className="instructionFunction" variant="primary">Play</Button>
                    </Card.Header>
                    <Accordion.Collapse eventKey="0">
                        <Card.Body>Here is the video</Card.Body>
                    </Accordion.Collapse>
                </Card>
                {/* <Card>
                    <Card.Header>
                        <CustomToggle eventKey="1">Click me!</CustomToggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="1">
                        <Card.Body>Hello! I'm another body</Card.Body>
                    </Accordion.Collapse>
                </Card> */}
            </Accordion>
        </div>)
    }
}


export default ZoneSection;


// function CustomToggle({ children, eventKey }) {
    // const decoratedOnClick = useAccordionButton(eventKey, () =>
    //     console.log('totally custom!'),
    // );

//     return (
//         <button
//             type="button"
//             style={{ backgroundColor: 'pink' }}
//             // onClick={decoratedOnClick}
//         >
//             {children}
//         </button>
//     );
// }

// function Example() {
//     return (
//         <Accordion defaultActiveKey="0">
//             <Card>
//                 <Card.Header>
//                     <CustomToggle eventKey="0">Click me!</CustomToggle>
//                 </Card.Header>
//                 <Accordion.Collapse eventKey="0">
//                     <Card.Body>Hello! I'm the body</Card.Body>
//                 </Accordion.Collapse>
//             </Card>
//             <Card>
//                 <Card.Header>
//                     <CustomToggle eventKey="1">Click me!</CustomToggle>
//                 </Card.Header>
//                 <Accordion.Collapse eventKey="1">
//                     <Card.Body>Hello! I'm another body</Card.Body>
//                 </Accordion.Collapse>
//             </Card>
//         </Accordion>
//     );
// }