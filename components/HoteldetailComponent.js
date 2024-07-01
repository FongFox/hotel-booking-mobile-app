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
                <View>
                    <Card containerStyle={styles.card}>
                        <Text style={styles.title}>{hotel.name}</Text>
                    </Card>
                    <Card containerStyle={styles.card}>
                        <Image source={{ uri: baseUrl + hotel.image }}
                            style={styles.image}>
                        </Image>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 25 }}>
                            <Icon raised reverse name={this.props.favorite ? 'heart' : 'heart-o'} type='font-awesome' color='#f50'
                                onPress={() => this.props.favorite ? alert('Already favorite') : this.props.onPressFavorite()} />
                            <Icon raised reverse name='comment' type='font-awesome' color='#f50'
                                onPress={() => this.props.onPressComment()} />
                            <Icon raised reverse name='pencil' type='font-awesome' color='#f50'
                                onPress={() => this.props.onPressBooking()} />
                        </View>
                    </Card>
                    <Card containerStyle={styles.card}>
                        <Text style={styles.description}>{'\u2022 ' + hotel.description}</Text>
                    </Card>
                </View>
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
            <View key={index} style={styles.commentItem}>
                <Text style={styles.commentText}>{item.comment}</Text>
                <Rating startingValue={item.rating} imageSize={16} readonly style={styles.rating} />
                <Text style={styles.commentAuthor}>{'-- ' + item.author + ', ' + item.date} </Text>
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
            <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Add Comment</Text>
                <Rating startingValue={this.state.rating} showRating={true}
                    onFinishRating={(value) => this.setState({ rating: value })} />
                <Input value={this.state.author} placeholder='Author' leftIcon={{ name: 'user-o', type: 'font-awesome' }}
                    onChangeText={(text) => this.setState({ author: text })} />
                <Input value={this.state.comment} placeholder='Comment' leftIcon={{ name: 'comment-o', type: 'font-awesome' }}
                    onChangeText={(text) => this.setState({ comment: text })} />
                <View style={styles.buttonRow}>
                    <Button title='SUBMIT' color='#7cc'
                        onPress={() => this.handleSubmit()} />
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
        };
    }

    handleBooking() {
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

    render() {
        return (
            <ScrollView style={styles.bookingContainer}>
                <Text style={styles.modalTitle}>Booking</Text>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Number of Guests</Text>
                    <Picker
                        style={styles.formItem}
                        selectedValue={this.state.guests}
                        onValueChange={(value) => this.setState({ guests: value })}
                    >
                        {[...Array(10).keys()].map((num) => (
                            <Picker.Item key={num} label={String(num + 1)} value={num + 1} />
                        ))}
                    </Picker>
                </View>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Smoking/No-Smoking?</Text>
                    <Switch
                        style={styles.formItem}
                        value={this.state.smoking}
                        onValueChange={(value) => this.setState({ smoking: value })}
                    />
                </View>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Date and Time</Text>
                    <View style={styles.dateContainer}>
                        <Icon name='schedule' size={36} onPress={() => this.setState({ showDatePicker: true })} />
                        <Text style={styles.dateText}>{format(this.state.date, 'dd/MM/yyyy - HH:mm')}</Text>
                        <DateTimePickerModal
                            mode='datetime'
                            isVisible={this.state.showDatePicker}
                            onConfirm={(date) => this.setState({ date: date, showDatePicker: false })}
                            onCancel={() => this.setState({ showDatePicker: false })}
                        />
                    </View>
                </View>
                <View style={styles.buttonRow}>
                    <Button title='Reserve' color='#7cc'
                        onPress={() => this.handleBooking()} />
                    <Button title='CANCEL' color='red'
                        onPress={() => this.props.onPressCancel()} />
                </View>
            </ScrollView>
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
    cardContainer: {
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        backgroundColor: '#fff',
    },
    image: {
        width: '100%',
        height: 200,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    featuredTitle: {
        color: '#fff',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
    },
    description: {
        margin: 10,
        fontSize: 16,
        color: '#444',
    },
    iconRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
    },
    commentItem: {
        margin: 10,
    },
    commentText: {
        fontSize: 14,
        marginBottom: 5,
    },
    rating: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    commentAuthor: {
        fontSize: 12,
        color: '#555',
    },
    modalContainer: {
        justifyContent: 'center',
        margin: 20,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10,
        color: '#7cc',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    bookingContainer: {
        margin: 20,
    },
    formRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    formLabel: {
        fontSize: 18,
        flex: 1,
        minWidth: 150,  // Added fixed width to ensure label and input stay on the same line
    },
    formItem: {
        flex: 2,
    },
    dateText: {
        marginTop: 10,
        fontSize: 16,
        color: '#333',
    },
    card: {
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000',
        marginVertical: 10,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 10,
        width: '100%',
    },
    description: {
        fontSize: 16,
        margin: 10,
        textAlign: 'left',
    },
    dateContainer: {
        flexDirection: 'column',
        alignItems: 'center',
    },
});

