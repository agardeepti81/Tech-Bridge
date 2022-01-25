import React, { Component } from "react";
import "./main.css";
import { Button, Card, CardBody, CardSubtitle, CardText, CardTitle, Carousel, CarouselCaption, CarouselControl, CarouselIndicators, CarouselItem } from "reactstrap";
import Zone from "./zone/zone";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewZoneIndex: 0,
            zoneAnimating: false
        }
        this.setViewZoneIndex = this.setViewZoneIndex.bind(this);
        this.setZoneAnimating = this.setZoneAnimating.bind(this);
        this.previousButton = this.previousButton.bind(this);
        this.nextButton = this.nextButton.bind(this);
    }

    setViewZoneIndex(index) {
        this.setState({
            viewZoneIndex: index
        })
    }

    setZoneAnimating(animating) {
        this.setState({
            zoneAnimating: animating
        })
    }

    previousButton() {
        if (this.state.zoneAnimating) return;
        const previousZoneIndex = this.state.viewZoneIndex === 0 ? this.props.zonesJson.length - 1 : this.state.viewZoneIndex - 1;
        this.setViewZoneIndex(previousZoneIndex);
    }

    nextButton() {
        if (this.state.zoneAnimating) return;
        const nextZoneIndex = this.state.viewZoneIndex === this.props.zonesJson.length - 1 ? 0 : this.state.viewZoneIndex + 1;
        this.setViewZoneIndex(nextZoneIndex);
    }

    render() {
        const { zonesJson } = this.props;
        const { viewZoneIndex, items, zoneAnimating } = this.state;
        let zones = [];
        for (let i = 0; i < zonesJson.length; i++) {
            zones.push(zonesJson[i].name);
        }
        const { lessonProgress } = this.props;
        let zonesHtml = [], i = 0, userZones = [], resumeZone = false;
        for (let j = 0; j < lessonProgress.length; j++) {
            if (lessonProgress[j].status)
                userZones.push(lessonProgress[j].zoneName)
            else {
                resumeZone = true;
            }
        }
        while (i < zones.length) {
            if (userZones.find(zone => zone === zones[i])) {
                zonesHtml.push(<CarouselItem
                    className="zone"
                    onExited={() => this.setZoneAnimating(false)}
                    onExiting={() => this.setZoneAnimating(true)}
                >
                    <Zone zoneData={zonesJson[i]} status="completed" />
                </CarouselItem>)
                i++;
            }
            else
                break;
        }
        if (resumeZone)
            zonesHtml.push(<CarouselItem
                className="zone"
                onExited={() => this.setZoneAnimating(false)}
                onExiting={() => this.setZoneAnimating(true)}
            >
                <Zone zoneData={zonesJson[i]} status="inprogress" />\
            </CarouselItem>)
        else if (i < zones.length)
            zonesHtml.push(<CarouselItem
                className="zone"
                onExited={() => this.setZoneAnimating(false)}
                onExiting={() => this.setZoneAnimating(true)}
            >
                <Zone zoneData={zonesJson[i]} status="start" />
            </CarouselItem>)
        i++;
        while (i < zones.length) {
            zonesHtml.push(<CarouselItem
                className="zone"
                onExited={() => this.setZoneAnimating(false)}
                onExiting={() => this.setZoneAnimating(true)}
            >
                <Zone zoneData={zonesJson[i]} status="locked" />
            </CarouselItem>);
            i++;
        }
        return (
            <div className="zones">
                <Carousel
                    activeIndex={viewZoneIndex}
                    next={this.nextButton}
                    previous={this.previousButton}
                    interval={false}
                >
                    <CarouselIndicators
                        activeIndex={viewZoneIndex}
                        items={zones}
                        onClickHandler={(newIndex) => {
                            if (zoneAnimating) return;
                            this.setViewZoneIndex(newIndex);
                        }}
                    />
                    {zonesHtml}
                    <CarouselControl
                        direction="prev"
                        directionText="Previous"
                        onClickHandler={this.previousButton}
                    />
                    <CarouselControl
                        direction="next"
                        directionText="Next"
                        onClickHandler={this.nextButton}
                    />
                </Carousel>
            </div>
        );
    }
}

export default Main;