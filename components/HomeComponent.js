import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Image } from 'react-native-elements';
import Loading from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { connect } from 'react-redux';

const RenderItem = (props) => {
    const { isLoading, errMess, item } = props;

    if (isLoading) {
        return (<Loading />);
    } else if (errMess) {
        return (<Text>{errMess}</Text>);
    } else if (item != null) {
        return (
            <Card containerStyle={styles.cardContainer}>
                <Image
                    source={{ uri: baseUrl + item.image }}
                    style={styles.image}
                    resizeMode="cover"
                >
                    <View style={styles.textContainer}>
                        <Text style={styles.featuredTitle}>{item.name}</Text>
                        {item.designation && <Text style={styles.featuredSubtitle}>{item.designation}</Text>}
                    </View>
                </Image>
                <Text style={styles.description}>{item.description}</Text>
            </Card>
        );
    } else {
        return (<View />);
    }
};

const mapStateToProps = (state) => {
    return {
        hotels: state.hotels,
        promotions: state.promotions,
        leaders: state.leaders
    }
};

class Home extends Component {
    render() {
        const { hotels, promotions, leaders } = this.props;
        const hotel = hotels.hotels.filter((hotel) => hotel.featured === true)[0];
        const promo = promotions.promotions.filter((promo) => promo.featured === true)[0];
        const leader = leaders.leaders.filter((leader) => leader.featured === true)[0];

        return (
            <ScrollView style={styles.container}>
                <RenderItem item={hotel}
                    isLoading={hotels.isLoading}
                    errMess={hotels.errMess} />
                <RenderItem item={promo}
                    isLoading={promotions.isLoading}
                    errMess={promotions.errMess} />
                <RenderItem item={leader}
                    isLoading={leaders.isLoading}
                    errMess={leaders.errMess} />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#E8F1F2',
        padding: 10,
    },
    cardContainer: {
        borderRadius: 10,
        borderWidth: 0,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        marginBottom: 20,
    },
    image: {
        width: '100%',
        height: 200,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    textContainer: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: 5,
        borderRadius: 5,
    },
    featuredTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    featuredSubtitle: {
        color: '#fff',
        fontSize: 14,
    },
    description: {
        margin: 10,
        fontSize: 16,
        color: '#333',
    },
});

export default connect(mapStateToProps)(Home);
