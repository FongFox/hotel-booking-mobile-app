import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Card, Image, Icon } from 'react-native-elements';
import { ScrollView } from 'react-native-virtualized-view';
import { baseUrl } from '../shared/baseUrl';

class RenderComments extends Component {
    render() {
        const comments = this.props.comments;
        return (
            <Card>
                <Card.Title>Comments</Card.Title>
                <Card.Divider />
                <FlatList data={comments}
                    renderItem={({ item, index }) => this.renderCommentItem(item, index)}
                    keyExtractor={(item) => item.id.toString()} />
            </Card>
        );
    }
    renderCommentItem(item, index) {
        return (
            <View key={index} style={{ margin: 10 }}>
                <Text style={{ fontSize: 14 }}>{item.comment}</Text>
                <Text style={{ fontSize: 12 }}>{item.rating} Stars</Text>
                <Text style={{ fontSize: 12 }}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>
        );
    };
}

class RenderHotel extends Component {
    render() {
        const hotel = this.props.hotel;
        if (hotel != null) {
            return (
                <Card>
                    <Image source={{ uri: baseUrl + hotel.image }}
                        style={{ width: '100%', height: 100, flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Card.FeaturedTitle style={{ color: '#000' }}>
                            {hotel.name}
                        </Card.FeaturedTitle>
                    </Image>
                    <Text style={{ margin: 10 }}>
                        {hotel.description}
                    </Text>
                    <Icon raised reverse type='font-awesome' color='#f50'
                        name={this.props.favorite ? 'heart' : 'heart-o'}
                        onPress={() => this.props.favorite ? alert('Already favorite') : this.props.onPressFavorite()} />
                </Card>
            );
        }
        return (<View />);
    }
}

// redux
import { connect } from 'react-redux';
const mapStateToProps = (state) => {
    return {
        hotels: state.hotels,
        comments: state.comments,
        favorites: state.favorites
    }
};

import { postFavorite } from '../redux/ActionCreators';
const mapDispatchToProps = (dispatch) => ({
    postFavorite: (hotelId) => dispatch(postFavorite(hotelId))
});

class Hoteldetail extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const hotelId = parseInt(this.props.route.params.hotelId);
        const hotel = this.props.hotels.hotels[hotelId];
        const comments = this.props.comments.comments.filter((cmt) => cmt.hotelId === hotelId);
        const favorite = this.props.favorites.some((el) => el === hotelId);
        return (
            <ScrollView>
                <RenderHotel hotel={hotel} favorite={favorite} onPressFavorite={() => this.markFavorite(hotelId)} />
                <RenderComments comments={comments} />
            </ScrollView>
        );
    }

    markFavorite(hotelId) {
        this.props.postFavorite(hotelId);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Hoteldetail);