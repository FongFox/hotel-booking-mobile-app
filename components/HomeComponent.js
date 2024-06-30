import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { ScrollView } from 'react-native-virtualized-view'
import { Card, Image } from 'react-native-elements';
import Loading from './LoadingComponent';

import { baseUrl } from '../shared/baseUrl';

class RenderItem extends Component {
    render() {
        if (this.props.isLoading) {
            return (<Loading />);
        } else if (this.props.errMess) {
            return (<Text>{this.props.errMess}</Text>);
        } else {
            const item = this.props.item;
            if (item != null) {
                return (
                    <Card>
                        <Image source={{ uri: baseUrl + item.image }} style={{ width: '100%', height: 100, flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Card.FeaturedTitle>{item.name}</Card.FeaturedTitle>
                            <Card.FeaturedSubtitle>{item.designation}</Card.FeaturedSubtitle>
                        </Image>
                        <Text style={{ margin: 10 }}>{item.description}</Text>
                    </Card>
                );
            }
            return (<View />);
        }
    }
}

// redux
import { connect } from 'react-redux';
const mapStateToProps = (state) => {
    return {
        hotels: state.hotels,
        promotions: state.promotions,
        leaders: state.leaders
    }
};

class Home extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const hotel = this.props.hotels.hotels.filter((hotel) => hotel.featured === true)[0];
        const promo = this.props.promotions.promotions.filter((promo) => promo.featured === true)[0];
        const leader = this.props.leaders.leaders.filter((leader) => leader.featured === true)[0];
        return (
            <ScrollView>
                <RenderItem item={hotel}
                    isLoading={this.props.hotels.isLoading}
                    errMess={this.props.hotels.errMess} />
                <RenderItem item={promo}
                    isLoading={this.props.promotions.isLoading}
                    errMess={this.props.promotions.errMess} />
                <RenderItem item={leader}
                    isLoading={this.props.leaders.isLoading}
                    errMess={this.props.leaders.errMess} />
            </ScrollView>
        );
    }
}

export default connect(mapStateToProps)(Home);