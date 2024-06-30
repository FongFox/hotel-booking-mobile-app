import React, { Component } from 'react';
import { FlatList, View, Text } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';
import { baseUrl } from '../shared/baseUrl';
import Loading from './LoadingComponent';

// redux
import { connect } from 'react-redux';
const mapStateToProps = (state) => {
    return {
        hotels: state.hotels
    }
};

class Menu extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.hotels.isLoading) {
            return (<Loading />);
        } else if (this.props.hotels.errMess) {
            return (<Text>{this.props.errMess}</Text>);
        } else {
            return (
                <FlatList data={this.props.hotels.hotels}
                    renderItem={({ item, index }) => this.renderMenuItem(item, index)}
                    keyExtractor={(item) => item.id.toString()} />
            );
        }
    }

    renderMenuItem(item, index) {
        const { navigate } = this.props.navigation;
        return (
            <ListItem key={index} onPress={() => navigate('Hoteldetail', { hotelId: item.id })}>
                <Avatar source={{ uri: baseUrl + item.image }} />
                <ListItem.Content>
                    <ListItem.Title>{item.name}</ListItem.Title>
                    <ListItem.Subtitle>{item.shortDescription}</ListItem.Subtitle>
                </ListItem.Content>
            </ListItem>
        );
    }

}

export default connect(mapStateToProps)(Menu);