import React, { Component } from 'react';
import { Text } from 'react-native';
import { Card, Button, Icon } from 'react-native-elements';
import * as MailComposer from 'expo-mail-composer';
import * as Animatable from 'react-native-animatable';

class Contact extends Component {
    render() {
        return (
            <Animatable.View animation='fadeInDown' duration={2000} delay={1000}>
                <Card>
                    <Card.Title>Contact Information</Card.Title>
                    <Card.Divider />
                    <Text style={{ margin: 10 }}>5 Nguyen Van Trang</Text>
                    <Text style={{ margin: 10 }}>Hoa Sen University</Text>
                    <Text style={{ margin: 10 }}>Vietnam</Text>
                    <Text style={{ margin: 10 }}>Tel: 028 7300 7272</Text>
                    <Text style={{ margin: 10 }}>Fax: 028 7309 1991</Text>
                    <Text style={{ margin: 10 }}>Email: ITSupport@hoasen.edu.vn</Text>
                    <Button title=' Compose Email' buttonStyle={{ backgroundColor: '#7cc' }}
                        icon={<Icon name='envelope-o' type='font-awesome' color='white' />}
                        onPress={this.composeMail} />
                </Card>
            </Animatable.View>
        );
    }
    composeMail() {
        MailComposer.composeAsync({
            recipients: ['<email_address>'],
            subject: 'From me',
            body: 'Dear Hotel ...'
        });
    }
}
export default Contact;
