import React, { Component } from 'react';
import { View, Text, FlatList, Modal, Button } from 'react-native';
import { Card, Image, Icon, Rating, Input } from 'react-native-elements';
import { ScrollView } from 'react-native-virtualized-view';
import { baseUrl } from '../shared/baseUrl';

// redux
import { connect } from 'react-redux';
const mapStateToProps = (state) => {
    return {
        hotels: state.hotels,
        comments: state.comments,
        favorites: state.favorites
    }
};

import { postFavorite, postComment } from '../redux/ActionCreators';
const mapDispatchToProps = (dispatch) => ({
    postFavorite: (hotelId) => dispatch(postFavorite(hotelId)),
    postComment: (hotelId, rating, author, comment) => dispatch(postComment(hotelId, rating, author, comment))
});

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
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <Icon raised reverse name={this.props.favorite ? 'heart' : 'heart-o'} type='font-awesome' color='#f50'
                            onPress={() => this.props.favorite ? alert('Already favorite') : this.props.onPressFavorite()} />
                        <Icon raised reverse name='comment' type='font-awesome' color='#f50'
                            onPress={() => this.props.onPressComment()} />
                        <Icon raised reverse name='pencil' type='font-awesome' color='#f50' />
                    </View>
                </Card>
            );
        }
        return (<View />);
    }
}

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
                <Rating startingValue={item.rating} imageSize={16} readonly style={{ flexDirection: 'row' }} />
                <Text style={{ fontSize: 12 }}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>
        );
    };
}

class ModalContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rating: 3,
            author: '',
            comment: ''
        };
    }

    render() {
        return (
            <View style={{ justifyContent: 'center', margin: 20 }}>
                <Rating startingValue={this.state.rating} showRating={true}
                    onFinishRating={(value) => this.setState({ rating: value })} />
                <View style={{ height: 20 }} />
                <Input value={this.state.author} placeholder='Author' leftIcon={{ name: 'user-o', type: 'font-awesome' }}
                    onChangeText={(text) => this.setState({ author: text })} />
                <Input value={this.state.comment} placeholder='Comment' leftIcon={{ name: 'comment-o', type: 'font-awesome' }}
                    onChangeText={(text) => this.setState({ comment: text })} />
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <Button title='SUBMIT' color='#7cc'
                        onPress={() => this.handleSubmit()} />
                    <View style={{ width: 10 }} />
                    <Button title='CANCEL' color='#7cc'
                        onPress={() => this.props.onPressCancel()} />
                </View>
            </View>
        );
    }

    handleSubmit() {
        this.props.postComment(this.props.hotelId, this.state.rating, this.state.author, this.state.comment);
        this.props.onPressCancel();
    }
}

class Hoteldetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false
        };
    }

    render() {
        const hotelId = parseInt(this.props.route.params.hotelId);
        const hotel = this.props.hotels.hotels[hotelId];
        const comments = this.props.comments.comments.filter((cmt) => cmt.hotelId === hotelId);
        const favorite = this.props.favorites.some((el) => el === hotelId);
        return (
            <ScrollView>
                <RenderHotel hotel={hotel} favorite={favorite}
                    onPressFavorite={() => this.markFavorite(hotelId)}
                    onPressComment={() => this.setState({ showModal: true })} />
                <RenderComments comments={comments} />

                <Modal animationType={'slide'} visible={this.state.showModal}
                    onRequestClose={() => this.setState({ showModal: false })}>
                    <ModalContent hotelId={hotelId}
                        onPressCancel={() => this.setState({ showModal: false })}
                        postComment={this.props.postComment} />
                </Modal>

            </ScrollView>
        );
    }

    markFavorite(hotelId) {
        this.props.postFavorite(hotelId);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Hoteldetail);