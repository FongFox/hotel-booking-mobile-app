import React, { Component } from 'react';
import { View, Text, FlatList, Modal, Button, StyleSheet, Switch, Alert } from 'react-native';
import { Card, Image, Icon, Rating, Input } from 'react-native-elements';
import { ScrollView } from 'react-native-virtualized-view';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { format } from 'date-fns';

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
                        <Icon raised reverse name='pencil' type='font-awesome' color='#f50'
                            onPress={() => this.props.onPressBooking()} />
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
                <View style={styles.modal}>
                    <Text style={styles.modalTitle}>Comment</Text>
                </View>
                <Rating startingValue={this.state.rating} showRating={true}
                    onFinishRating={(value) => this.setState({ rating: value })} />
                <View style={{ height: 20 }} />
                <Input value={this.state.author} placeholder='Author' leftIcon={{ name: 'user-o', type: 'font-awesome' }}
                    onChangeText={(text) => this.setState({ author: text })} />
                <Input value={this.state.comment} placeholder='Comment' leftIcon={{ name: 'comment-o', type: 'font-awesome' }}
                    onChangeText={(text) => this.setState({ comment: text })} />
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                    <Button title='SUBMIT' color='#7cc'
                        onPress={() => this.handleSubmit()} />
                    <View style={{ width: 10 }} />
                    <Button title='CANCEL' color='red'
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

class BookingContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            guests: 1,
            smoking: false,
            date: new Date(),
            showDatePicker: false
        }
    }

    render() {
        return (
            <ScrollView style={{ margin: 20 }}>
                <View style={styles.modal}>
                    <Text style={styles.modalTitle}>Booking</Text>
                </View>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Number of Guests</Text>
                    <Picker style={styles.formItem} selectedValue={this.state.guests} onValueChange={(value) => this.setState({ guests: value })}>
                        <Picker.Item label='1' value='1' />
                        <Picker.Item label='2' value='2' />
                        <Picker.Item label='3' value='3' />
                        <Picker.Item label='4' value='4' />
                        <Picker.Item label='5' value='5' />
                        <Picker.Item label='6' value='6' />
                    </Picker>
                </View>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Smoking/No-Smoking?</Text>
                    <Switch style={styles.formItem} value={this.state.smoking} onValueChange={(value) => this.setState({ smoking: value })} />
                </View>
                <View style={[styles.formRow, { marginBottom: 60 }]}>
                    <Text style={styles.formLabel}>Date and Time</Text>
                    <Icon name='schedule' size={36} onPress={() => this.setState({ showDatePicker: true })} />
                    <Text style={{ marginLeft: 10 }}>{format(this.state.date, 'dd/MM/yyyy - HH:mm')}</Text>
                    <DateTimePickerModal mode='datetime' isVisible={this.state.showDatePicker}
                        onConfirm={(date) => this.setState({ date: date, showDatePicker: false })}
                        onCancel={() => this.setState({ showDatePicker: false })} />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <Button title='Reserve' color='#7cc'
                        onPress={() => this.handleBooking()} />
                    <View style={{ width: 10 }} />
                    <Button title='CANCEL' color='red'
                        onPress={() => this.props.onPressCancel()} />
                </View>
            </ScrollView >
        );
    }

    handleBooking() {
        // alert(JSON.stringify(this.state));
        // this.props.onPressCancel();

        Alert.alert(
            'Booking Details', JSON.stringify(this.state),
            [{
                text: 'OK',
                onPress: () => {
                    this.props.onPressCancel();
                }
            }],
            { cancelable: false }
        );
    }

}

class Hoteldetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            showBookingModal: false
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
                    onPressComment={() => this.setState({ showModal: true })}
                    onPressBooking={() => this.setState({ showBookingModal: true })} />

                <RenderComments comments={comments} />

                <Modal animationType={'slide'} visible={this.state.showModal}
                    onRequestClose={() => this.setState({ showModal: false })}>
                    <ModalContent hotelId={hotelId}
                        onPressCancel={() => this.setState({ showModal: false })}
                        postComment={this.props.postComment} />
                </Modal>

                <Modal animationType={'slide'} visible={this.state.showBookingModal}
                    onRequestClose={() => this.setState({ showBookingModal: false })}>
                    <BookingContent hotelId={hotelId}
                        onPressCancel={() => this.setState({ showBookingModal: false })} />
                </Modal>

            </ScrollView>
        );
    }

    markFavorite(hotelId) {
        this.props.postFavorite(hotelId);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Hoteldetail);

const styles = StyleSheet.create({
    formRow: { alignItems: 'center', justifyContent: 'center', flex: 1, flexDirection: 'row', margin: 20 },
    formLabel: { fontSize: 18, flex: 2 },
    formItem: { flex: 1 },
    modal: { justifyContent: 'center', margin: 20 },
    modalTitle: { fontSize: 24, fontWeight: 'bold', backgroundColor: '#7cc', textAlign: 'center', color: 'white', marginBottom: 10 },
    modalText: { fontSize: 18, margin: 10 }
});
