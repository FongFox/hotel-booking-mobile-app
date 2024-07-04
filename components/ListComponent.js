import React, { Component } from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { ListItem, Avatar, Rating } from 'react-native-elements';
import { baseUrl } from '../shared/baseUrl';
import Loading from './LoadingComponent';
import { connect } from 'react-redux';

const localImage = require('./images/user.png');

const mapStateToProps = (state) => {
    return {
        hotels: state.hotels,
        comments: state.comments
    }
};
class List extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.hotels.isLoading) {
            return (<Loading />);
        } else if (this.props.hotels.errMess) {
            return (<Text>{this.props.hotels.errMess}</Text>);
        } else {
            return (
                <View style={styles.container}>
                    <Text style={styles.header}>Popular Hotels</Text>
                    <FlatList
                        data={this.props.hotels.hotels}
                        renderItem={({ item, index }) => this.renderListItem(item, index)}
                        keyExtractor={(item) => item.id.toString()}
                        horizontal
                        contentContainerStyle={styles.listContainer}
                        showsHorizontalScrollIndicator={false}
                    />
                    <Text style={styles.reviewsHeader}>Recent Reviews</Text>
                    <FlatList
                        data={this.props.comments.comments}
                        renderItem={({ item, index }) => this.renderCommentItem(item, index)}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.commentsContainer}
                    />
                </View>
            );
        }
    }

    renderListItem(item, index) {
        const { navigate } = this.props.navigation;
        return (
            <ListItem
                key={index}
                onPress={() => navigate('Hoteldetail', { hotelId: item.id })}
                bottomDivider
                containerStyle={styles.listItemContainer}
                underlayColor="transparent"
                activeOpacity={0.7}
            >
                <Avatar source={{ uri: baseUrl + item.image }} size="large" rounded />
                <ListItem.Content>
                    <ListItem.Title style={styles.listItemTitle}>{item.name}</ListItem.Title>
                    <ListItem.Subtitle style={styles.listItemSubtitle}>{item.shortDescription}</ListItem.Subtitle>
                </ListItem.Content>
            </ListItem>
        );
    }

    renderCommentItem(item, index) {
        const hotel = this.props.hotels.hotels.find(hotel => hotel.id === item.hotelId);
        return (
            <ListItem
                key={index}
                bottomDivider
                containerStyle={styles.commentItemContainer}
            >
                <Avatar source={localImage} size="medium" rounded />
                <ListItem.Content>
                    <ListItem.Title style={styles.commentItemTitle}>{item.author}</ListItem.Title>
                    <ListItem.Subtitle style={styles.commentItemSubtitle}>
                        {item.comment}
                    </ListItem.Subtitle>
                    {hotel && (
                        <Text style={styles.commentHotelName}>on {hotel.name}</Text>
                    )}
                    <Rating
                        imageSize={20}
                        readonly
                        startingValue={item.rating}
                        style={styles.rating}
                    />
                </ListItem.Content>
            </ListItem>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E8F1F2',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        padding: 10,
        textAlign: 'center',
        backgroundColor: '#E8F1F2',
        marginTop: 20,
    },
    reviewsHeader: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        padding: 10,
        textAlign: 'center',
        backgroundColor: 'transparent',
        marginTop: 0,
    },
    listContainer: {
        padding: 10,
        marginBottom: 0,
        marginTop: 0,
        paddingBottom: 80
    },
    listItemContainer: {
        borderRadius: 10,
        marginHorizontal: 5,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        width: 'auto',
        alignSelf: 'flex-start'
    },
    listItemTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    listItemSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    commentsContainer: {
        padding: 10,
        backgroundColor: '#E8F1F2',
    },
    commentItemContainer: {
        borderRadius: 10,
        marginVertical: 5,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    commentItemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    commentItemSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    commentHotelName: {
        fontSize: 14,
        color: '#888',
        marginTop: 5,
    },
    rating: {
        marginTop: 5,
    },
});

export default connect(mapStateToProps)(List);
