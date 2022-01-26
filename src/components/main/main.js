import React, { Component } from "react";
import "./main.css";
import { Carousel, CarouselControl, CarouselIndicators, CarouselItem } from "reactstrap";
import Zone from "./zone/zone";
import { useParams } from "react-router-dom";

const MainRoute = (props) => {
    const params = useParams();
    const profile = params.profile, pathName = params.pathName;

    return(<Main lessonProgress={props.lessonProgress} zonesJson={props.zonesJson} profile={profile} pathName={pathName} />);
}

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
        const { zonesJson, profile, pathName } = this.props;
        const { viewZoneIndex, zoneAnimating } = this.state;
        let zones = [];
        console.log(profile, pathName);
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
                    <Zone profile={profile} pathName={pathName} zoneData={zonesJson[i]} status="completed" />
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
                <Zone profile={profile} pathName={pathName} zoneData={zonesJson[i]} status="inprogress" />\
            </CarouselItem>)
        else if (i < zones.length)
            zonesHtml.push(<CarouselItem
                className="zone"
                onExited={() => this.setZoneAnimating(false)}
                onExiting={() => this.setZoneAnimating(true)}
            >
                <Zone profile={profile} pathName={pathName} zoneData={zonesJson[i]} status="start" />
            </CarouselItem>)
        i++;
        while (i < zones.length) {
            zonesHtml.push(<CarouselItem
                className="zone"
                onExited={() => this.setZoneAnimating(false)}
                onExiting={() => this.setZoneAnimating(true)}
            >
                <Zone profile={profile} pathName={pathName} zoneData={zonesJson[i]} status="locked" />
            </CarouselItem>);
            i++;
        }
        return (<div id="home">
            {/* <div id="segmentInfo">
                <div className="infoText"></div>
                <video width="400" controls>
                    <source src={sectionData.video} type="video/mp4" />
                    Your browser doesn't support HTML video
                </video>
            </div> */}
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
        </div>
        );
    }
}

export default MainRoute;