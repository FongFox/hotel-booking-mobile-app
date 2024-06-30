import React, { Component } from 'react';
import { Text, FlatList } from 'react-native';
import { ScrollView } from 'react-native-virtualized-view';
import { Card, ListItem, Avatar } from 'react-native-elements';
import { baseUrl } from '../shared/baseUrl';
import Loading from './LoadingComponent';

class RenderHistory extends Component {
    render() {
        if (this.props.isLoading) {
            return (
                <Card>
                    <Card.Title>Corporate Leadership</Card.Title>
                    <Card.Divider />
                    <Loading />
                </Card>
            );
        } else if (this.props.errMess) {
            return (
                <Card>
                    <Card.Title>Corporate Leadership</Card.Title>
                    <Card.Divider />
                    <Text>{this.props.errMess}</Text>
                </Card>
            );
        } else {
            return (
                <Card>
                    <Card.Title>Our History</Card.Title>
                    <Card.Divider />
                    <Text style={{ margin: 10 }}>
                        Founded in 2010, our platform has revolutionized the way people book accommodations around the world. We started with a vision to connect travelers with a diverse range of hotels, from budget-friendly options to luxurious retreats.
                    </Text>
                    <Text style={{ margin: 10 }}>
                        Over the years, we've grown into a leading booking platform, offering an extensive selection of hotels in various destinations. Our commitment to providing seamless booking experiences and exceptional customer service has made us a favorite among travelers. Today, we continue to innovate and expand, bringing more options and greater convenience to our users.
                    </Text>
                </Card>
            );
        }
    }
}


class RenderLeadership extends Component {
    render() {
        return (
            <Card>
                <Card.Title>Corporate Leadership</Card.Title>
                <Card.Divider />
                <FlatList data={this.props.leaders}
                    renderItem={({ item, index }) => this.renderLeaderItem(item, index)}
                    keyExtractor={(item) => item.id.toString()} />
            </Card>
        );
    }

    renderLeaderItem(item, index) {
        return (
            <ListItem key={index}>
                <Avatar rounded source={{ uri: baseUrl + item.image }} />
                <ListItem.Content>
                    <ListItem.Title style={{ fontWeight: 'bold' }}>{item.name}</ListItem.Title>
                    <ListItem.Subtitle>{item.description}</ListItem.Subtitle>
                </ListItem.Content>
            </ListItem>
        );
    }
}

// redux
import { connect } from 'react-redux';
const mapStateToProps = (state) => {
    return {
        leaders: state.leaders
    }
};

class About extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <ScrollView>
                <RenderHistory />
                <RenderLeadership
                    leaders={this.props.leaders.leaders}
                    isLoading={this.props.leaders.isLoading}
                    errMess={this.props.leaders.errMess} />
            </ScrollView>
        );
    }
}

export default connect(mapStateToProps)(About);