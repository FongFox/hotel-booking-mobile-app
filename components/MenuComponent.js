import React, { Component } from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';
import { baseUrl } from '../shared/baseUrl';
import Loading from './LoadingComponent';
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
            return (<Text>{this.props.hotels.errMess}</Text>);
        } else {
            return (
                <FlatList
                    data={this.props.hotels.hotels}
                    renderItem={({ item, index }) => this.renderMenuItem(item, index)}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                />
            );
        }
    }

    renderMenuItem(item, index) {
        const { navigate } = this.props.navigation;
        return (
            <ListItem
                key={index}
                onPress={() => navigate('Hoteldetail', { hotelId: item.id })}
                bottomDivider
                containerStyle={styles.listItemContainer}
            >
                <Avatar source={{ uri: baseUrl + item.image }} size="large" rounded />
                <ListItem.Content>
                    <ListItem.Title style={styles.listItemTitle}>{item.name}</ListItem.Title>
                    <ListItem.Subtitle style={styles.listItemSubtitle}>{item.shortDescription}</ListItem.Subtitle>
                </ListItem.Content>
            </ListItem>
        );
    }
}

const styles = StyleSheet.create({
    listContainer: {
        padding: 10,
        backgroundColor: '#E8F1F2',
    },
    listItemContainer: {
        borderRadius: 10,
        marginVertical: 5,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
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
});

export default connect(mapStateToProps)(Menu);
