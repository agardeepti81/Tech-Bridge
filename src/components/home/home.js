import { Component } from "react";
import "./home.css";
import { Button, Card, CardBody, CardSubtitle, CardText, CardTitle } from "reactstrap";
import { Link } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs"

class Profile extends Component {
    inConstruction() {
        alert("Method in construction");
    }
    render() {
        const { profile } = this.props;
        let segmentsGroup = [];
        for (let i = 0; i < profile.roadmaps[0].path.length; i++) {
            const rightArrow = [];

            if (i !== profile.roadmaps[0].path.length - 1)
                rightArrow.push(<BsArrowRight className="rightArrow" />);

            if (profile.roadmaps[0].path[i].code && profile.roadmaps[0].path[i].file)
                segmentsGroup.push(<div>
                    <Link to={`/${profile.code}/${profile.roadmaps[0].path[i].code}`}><Button color="dark">{profile.roadmaps[0].path[i].name}</Button></Link>
                    {rightArrow}
                </div>);
            else
                segmentsGroup.push(<div>
                    <Button color="dark" onClick={this.inConstruction}>{profile.roadmaps[0].path[i].name}</Button>
                    {rightArrow}
                </div>);
        }
        return (<div className="roadmap">
            <Card>
                <CardBody>
                    <CardTitle tag="h5">
                        {profile.name}
                    </CardTitle>
                    <CardSubtitle
                        className="mb-2 text-muted"
                        tag="h6"
                    >
                        {profile.desc}
                    </CardSubtitle>
                    <CardText>
                        Here is the roadmap:-
                    </CardText>
                    <div className="segments">
                        {segmentsGroup}
                    </div>
                </CardBody>
            </Card>
        </div>)
    }
}

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profiles: [],
            isLoaded: false,
            error: false
        }
    }
    componentDidMount() {
        fetch(process.env.PUBLIC_URL + "/data/profiles.json")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        profiles: result,
                        isLoaded: true
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }
    render() {
        const { error, isLoaded, profiles } = this.state;
        let roadmapsHtml = []
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            for (let i = 0; i < profiles.length; i++) {
                roadmapsHtml.push(<Profile profile={profiles[i]} />)
            }
            return (<div>
                {roadmapsHtml}
            </div>
            )
        }
    }
}