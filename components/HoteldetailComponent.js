import React, { Component } from 'react';
import { View, Text, FlatList, Modal, Button, StyleSheet, Switch, Alert, PanResponder, Platform } from 'react-native';
import { Card, Image, Icon, Rating, Input } from 'react-native-elements';
import { ScrollView } from 'react-native-virtualized-view';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { format } from 'date-fns';
import * as Notifications from 'expo-notifications';
import * as Calendar from 'expo-calendar';


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
        // gesture
        const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
            if (dx < -200) return 1; // right to left
            return 0;
        };
        const panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (e, gestureState) => { return true; },
            onPanResponderEnd: (e, gestureState) => {
                if (recognizeDrag(gestureState) === 1) {
                    Alert.alert(
                        'Bookmark',
                        'Are you sure you wish to add ' + hotel.name + ' to your bookmark saves?',
                        [
                            { text: 'Cancel', onPress: () => { /* nothing */ } },
                            { text: 'OK', onPress: () => { this.props.favorite ? alert('Already saved') : this.props.onPressFavorite() } },
                        ]
                    );
                }
                return true;
            }
        });
        const hotel = this.props.hotel;
        if (hotel != null) {
            return (
                <Card {...panResponder.panHandlers}>
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
                    <Button title='SUBMIT' color='#3d9034'
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
            date: new Date(),
            showDatePicker: false,
            requirement: false,
            showForm: false, // track form appear
            additionalRequirements: '', // form data
            calendarId: null // Added ID
        };
    }

    async obtainCalendarPermission() {
        const { status } = await Calendar.requestCalendarPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need calendar permissions to make this work!');
            return false;
        }
        return true;
    }
    async getDefaultCalendarSource() {
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        const defaultCalendar = calendars.find(cal => cal.source.name === 'Default') || calendars[0];
        return defaultCalendar.source;
    }

    async addReservationToCalendar(date) {
        const permission = await this.obtainCalendarPermission();
        if (!permission) return;

        const defaultCalendarSource = Platform.OS === 'ios'
            ? await this.getDefaultCalendarSource()
            : { isLocalAccount: true, name: 'Expo Calendar' };

        const defaultCalendarId = await Calendar.createCalendarAsync({
            title: 'Expo Calendar',
            color: 'blue',
            entityType: Calendar.EntityTypes.EVENT,
            sourceId: defaultCalendarSource.id,
            source: defaultCalendarSource,
            name: 'internalCalendarName',
            ownerAccount: 'personal',
            accessLevel: Calendar.CalendarAccessLevel.OWNER,
        });

        await Calendar.createEventAsync(defaultCalendarId, {
            title: 'Hotel Booking Notice',
            location: this.props.hotel.name + '\n' + this.props.hotel.address,
            startDate: new Date(Date.parse(date)),
            endDate: new Date(Date.parse(date) + 2 * 60 * 60 * 1000),
            timeZone: 'Asia/Hong_Kong',
        });

        alert('Reservation added to your calendar!');
    }


    handleBooking() {
        Alert.alert(
            'Is this your booking?',
            'Number of Guest(s)/Room: ' + this.state.guests + '\n' +
            'Date and Time: ' + this.state.date.toISOString() + '\n' +
            'Additional requirements: ' + this.state.requirement + '\n' +
            this.state.additionalRequirements,
            [
                {
                    text: 'Cancel',
                    onPress: () => this.resetForm(),
                    style: 'cancel'
                },
                {
                    text: 'OK',
                    onPress: () => {
                        this.props.onPressCancel();
                        this.addReservationToCalendar(this.state.date);
                        this.presentLocalNotification(this.state.date);
                    },
                }
            ],
            { cancelable: false }
        );
    }
    async presentLocalNotification(date) {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status === 'granted') {
            Notifications.setNotificationHandler({
                handleNotification: async () => ({ shouldShowAlert: true, shouldPlaySound: true, shouldSetBadge: true })
            });
            Notifications.scheduleNotificationAsync({
                content: {
                    title: 'Your Booking',
                    body: 'Booking for ' + date + ' requested',
                    sound: true,
                    vibrate: true
                },
                trigger: null
            });
        }
    }
    resetForm() {
        this.setState({
            guests: 1,
            date: new Date(),
            showDatePicker: false,
            requirement: false,
            showForm: false, // track form appear
            additionalRequirements: '', // form data
        });
    }

    render() {
        return (
            <View style={styles.bookingContainer}>
                <Text style={styles.modalTitle}>Booking</Text>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Number of Guests/Room</Text>
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
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Additional requirement(s):</Text>
                    <Switch
                        style={styles.formItem}
                        value={this.state.requirement}
                        onValueChange={(value) => this.setState({ requirement: value, showForm: value })}
                    />
                </View>
                {this.state.showForm && (
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Enter Additional Requirement(s):</Text>
                        <Input
                            placeholder='Enter requirements'
                            value={this.state.additionalRequirements}
                            onChangeText={(text) => this.setState({ additionalRequirements: text })}
                            style={styles.formItem}
                        />
                    </View>
                )}
                <View style={styles.buttonRow}>
                    <Button title='RESERVE' color='#3d9034'
                        onPress={() => this.handleBooking()} />
                    <Button title='CANCEL' color='red'
                        onPress={() => this.props.onPressCancel()} />
                </View>
            </View>
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
                        onPressCancel={() => this.setState({ showBookingModal: false })}
                        hotel={hotel} />
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
        marginTop: 40,
        color: '#3d9034',
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

