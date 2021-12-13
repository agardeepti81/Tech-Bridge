import React, { Component } from "react";
import "./zone-section.css";

import { Accordion, Button, Card, useAccordionButton } from "react-bootstrap";

function CustomToggle({ children, eventKey }) {
    const decoratedOnClick = useAccordionButton(eventKey);
  
    return (
      <Button
        className="instructionFunction" 
        variant="primary"
        onClick={decoratedOnClick}
      >
        {children}
      </Button>
    );
}

class ZoneSection extends Component {
    render() {
        const sectionData=this.props.sectionData;
        return (<div>
            <Accordion>
                <Card>
                    <Card.Header className="instructionHeader">
                        <div className="instruction">Play Course Video</div>
                        <CustomToggle eventKey="0">Play</CustomToggle>
                        {/* <Button  variant="primary">Play</Button> */}
                    </Card.Header>
                    <Accordion.Collapse eventKey="0">
                        <Card.Body>
                            <video width="400" controls>
                                <source src={sectionData.video} type="video/mp4"/>
                                Your browser does not support HTML video.
                            </video>
                        </Card.Body>
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



  
//   function Example() {
//     return (
//       <Accordion defaultActiveKey="0">
//         <Card>
//           <Card.Header>
//             <CustomToggle eventKey="0">Click me!</CustomToggle>
//           </Card.Header>
//           <Accordion.Collapse eventKey="0">
//             <Card.Body>Hello! I'm the body</Card.Body>
//           </Accordion.Collapse>
//         </Card>
//         <Card>
//           <Card.Header>
//             <CustomToggle eventKey="1">Click me!</CustomToggle>
//           </Card.Header>
//           <Accordion.Collapse eventKey="1">
//             <Card.Body>Hello! I'm another body</Card.Body>
//           </Accordion.Collapse>
//         </Card>
//       </Accordion>
//     );
//   }
  
//   render(<Example />);