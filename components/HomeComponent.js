import React, { Component } from 'react';
import { View, StyleSheet, ImageBackground, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { connect } from 'react-redux';
import { fetchPresentations } from '../redux/ActionCreators';
import { baseUrl } from '../shared/baseUrl';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opacity: new Animated.Value(1),
        };
    }

    componentDidMount() {
        this.props.fetchPresentations();
        this.props.navigation.addListener('focus', this.handleScreenFocus);
    }

    componentWillUnmount() {
        this.props.navigation.removeListener('focus', this.handleScreenFocus);
    }

    handleScreenFocus = () => {
        Animated.timing(this.state.opacity, {
            toValue: 1,
            duration: 500, // Adjust duration as needed
            easing: Easing.linear,
            useNativeDriver: true,
        }).start();
    };

    handleStartBrowsing = () => {
        Animated.timing(this.state.opacity, {
            toValue: 0,
            duration: 500, // Adjust duration as needed
            easing: Easing.linear,
            useNativeDriver: true,
        }).start(() => {
            this.props.navigation.navigate('List');
        });
    }

    render() {
        const { presentations } = this.props;
        const { opacity } = this.state;
        const backgroundImage = presentations.presentations.filter((presentation) => presentation.featured === true)[0]?.image;

        return (
            <Animated.View style={[styles.container, { opacity }]}>
                {backgroundImage && (
                    <ImageBackground
                        source={{ uri: baseUrl + backgroundImage }}
                        style={styles.backgroundImage}
                    >
                        <View style={styles.textContainer}>
                            <Text style={styles.text}>DISCOVER,</Text>
                            <Text style={styles.text}>RELAX,</Text>
                            <Text style={styles.text}>REPEAT.</Text>
                            <TouchableOpacity onPress={this.handleStartBrowsing} style={styles.button}>
                                <Text style={styles.buttonText}>Start Browsing</Text>
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
                )}
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        position: 'absolute',
        top: 20,
        width: '100%',
        alignItems: 'flex-start',
    },
    text: {
        fontSize: 60,
        fontWeight: '900',
        color: 'white',
        padding: 0,
        marginBottom: 20,
        marginLeft: 20,
    },
    button: {
        backgroundColor: 'black',
        paddingVertical: 7,
        paddingHorizontal: 15,
        borderRadius: 10,
        marginLeft: 40,
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
    },
});

const mapStateToProps = (state) => {
    return {
        presentations: state.presentations,
    };
};

const mapDispatchToProps = {
    fetchPresentations,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
