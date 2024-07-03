import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Alert } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';
import Loading from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { SwipeListView } from 'react-native-swipe-list-view';

// redux
import { connect } from 'react-redux';
const mapStateToProps = (state) => {
    return {
        hotels: state.hotels,
        favorites: state.favorites
    }
};

// redux
import { deleteFavorite } from '../redux/ActionCreators';
const mapDispatchToProps = (dispatch) => ({
    deleteFavorite: (hotelID) => dispatch(deleteFavorite(hotelID))
});

class Bookmark extends Component {
    render() {
        if (this.props.hotels.isLoading) {
            return (<Loading />);
        } else if (this.props.hotels.errMess) {
            return (<Text>{this.props.hotels.errMess}</Text>);
        } else {
            const hotels = this.props.hotels.hotels.filter((hotel) => this.props.favorites.some((el) => el === hotel.id));
            return (
                // <FlatList data={hotels}
                //     renderItem={({ item, index }) => this.renderMenuItem(item, index)}
                //     keyExtractor={(item) => item.id.toString()} />
                <SwipeListView data={hotels}
                    renderItem={({ item, index }) => this.renderMenuItem(item, index)}
                    renderHiddenItem={({ item, index }) => this.renderHiddenItem(item, index)}
                    keyExtractor={(item) => item.id.toString()}
                    rightOpenValue={-100} />
            );
        }
    }
    renderMenuItem(item, index) {
        const { navigate } = this.props.navigation;
        return (
            <ListItem key={index} onPress={() => navigate('Hoteldetail', { hotelID: item.id })}>
                <Avatar source={{ uri: baseUrl + item.image }} />
                <ListItem.Content>
                    <ListItem.Title>{item.name}</ListItem.Title>
                    <ListItem.Subtitle>{item.description}</ListItem.Subtitle>
                </ListItem.Content>
            </ListItem>
        );
    }
    renderHiddenItem(item, index) {
        return (
            <View style={{ alignItems: 'center', backgroundColor: '#DDD', flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 15 }}>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 0, bottom: 0, right: 0, width: 100, backgroundColor: 'red' }}
                    onPress={() => {
                        Alert.alert(
                            'Delete Bookmark?',
                            'Are you sure you wish to delete this hotel out of your saves?: ' + item.name + '?',
                            [
                                { text: 'Cancel', onPress: () => { /* nothing */ } },
                                { text: 'OK', onPress: () => this.props.deleteFavorite(item.id) }
                            ]
                        );
                    }}>
                    <Text style={{ color: '#FFF' }}>Delete</Text>
                </TouchableOpacity>
            </View>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Bookmark);